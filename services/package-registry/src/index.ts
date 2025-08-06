import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import multer from 'multer';
import tar from 'tar';
import semver from 'semver';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { body, param, query, validationResult } from 'express-validator';
import pino from 'pino';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3004;

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// Storage configuration
const STORAGE_PATH = process.env.STORAGE_PATH || './storage';
const PACKAGES_PATH = path.join(STORAGE_PATH, 'packages');
const METADATA_PATH = path.join(STORAGE_PATH, 'metadata');

// Ensure storage directories exist
fs.ensureDirSync(PACKAGES_PATH);
fs.ensureDirSync(METADATA_PATH);

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) }
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload configuration
const upload = multer({
  dest: path.join(STORAGE_PATH, 'temp'),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    // Accept .tgz, .tar.gz files
    if (file.mimetype === 'application/gzip' || file.originalname.endsWith('.tgz') || file.originalname.endsWith('.tar.gz')) {
      cb(null, true);
    } else {
      cb(new Error('Only .tgz and .tar.gz files are allowed'));
    }
  }
});

// In-memory package metadata (in production, use database)
interface PackageMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  type: 'protocol-template' | 'control-arm' | 'endpoint-analytics' | 'simulation-model';
  keywords: string[];
  dependencies?: Record<string, string>;
  bastionVersion?: string;
  createdAt: string;
  updatedAt: string;
  downloads: number;
  size: number;
  tarball: string;
  readme?: string;
  license?: string;
  repository?: string;
  homepage?: string;
}

interface PackageIndex {
  [packageName: string]: {
    [version: string]: PackageMetadata;
  };
}

// Load package index from disk
let packageIndex: PackageIndex = {};

async function loadPackageIndex(): Promise<void> {
  const indexFile = path.join(METADATA_PATH, 'index.json');
  if (await fs.pathExists(indexFile)) {
    try {
      packageIndex = await fs.readJson(indexFile);
      logger.info('Package index loaded successfully');
    } catch (error) {
      logger.error('Failed to load package index:', error);
    }
  } else {
    // Initialize with seed packages
    await initializeSeedPackages();
  }
}

async function savePackageIndex(): Promise<void> {
  const indexFile = path.join(METADATA_PATH, 'index.json');
  try {
    await fs.writeJson(indexFile, packageIndex, { spaces: 2 });
    logger.info('Package index saved successfully');
  } catch (error) {
    logger.error('Failed to save package index:', error);
  }
}

async function initializeSeedPackages(): Promise<void> {
  // Create seed packages for the MVP
  const seedPackages = [
    {
      name: 'protocol-template-clinical-trial',
      version: '1.0.0',
      description: 'Standard clinical trial protocol template',
      author: 'Bastion Team',
      type: 'protocol-template' as const,
      keywords: ['clinical-trial', 'template', 'protocol'],
      bastionVersion: '^1.0.0'
    },
    {
      name: 'control-arm-placebo',
      version: '1.0.0',
      description: 'Standard placebo control arm module',
      author: 'Bastion Team',
      type: 'control-arm' as const,
      keywords: ['placebo', 'control', 'arm'],
      bastionVersion: '^1.0.0'
    },
    {
      name: 'endpoint-analytics-survival',
      version: '1.0.0',
      description: 'Survival analysis endpoint analytics module',
      author: 'Bastion Team',
      type: 'endpoint-analytics' as const,
      keywords: ['survival', 'analytics', 'endpoint'],
      bastionVersion: '^1.0.0'
    }
  ];

  for (const pkg of seedPackages) {
    if (!packageIndex[pkg.name]) {
      packageIndex[pkg.name] = {};
    }

    packageIndex[pkg.name][pkg.version] = {
      ...pkg,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloads: 0,
      size: 1024, // Placeholder size
      tarball: `/packages/${pkg.name}/-/${pkg.name}-${pkg.version}.tgz`,
      readme: `# ${pkg.name}\n\n${pkg.description}`,
      license: 'MIT'
    };

    // Create placeholder tarball
    const tarballPath = path.join(PACKAGES_PATH, pkg.name, '-', `${pkg.name}-${pkg.version}.tgz`);
    await fs.ensureDir(path.dirname(tarballPath));
    await fs.writeFile(tarballPath, Buffer.from('placeholder'));
  }

  await savePackageIndex();
  logger.info('Seed packages initialized');
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    packagesCount: Object.keys(packageIndex).length
  });
});

// Get all packages
app.get('/packages', [
  query('q').optional().isString(),
  query('type').optional().isIn(['protocol-template', 'control-arm', 'endpoint-analytics', 'simulation-model']),
  query('size').optional().isInt({ min: 1, max: 100 }),
  query('from').optional().isInt({ min: 0 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
  }

  const query = req.query.q as string || '';
  const type = req.query.type as string;
  const size = parseInt(req.query.size as string) || 20;
  const from = parseInt(req.query.from as string) || 0;

  // Filter packages
  let packages: any[] = [];
  
  for (const [name, versions] of Object.entries(packageIndex)) {
    const latestVersion = Object.keys(versions).sort(semver.rcompare)[0];
    const pkg = versions[latestVersion];

    // Apply filters
    if (query && !name.toLowerCase().includes(query.toLowerCase()) && 
        !pkg.description?.toLowerCase().includes(query.toLowerCase())) {
      continue;
    }

    if (type && pkg.type !== type) {
      continue;
    }

    packages.push({
      name,
      version: latestVersion,
      description: pkg.description,
      author: pkg.author,
      type: pkg.type,
      keywords: pkg.keywords,
      downloads: pkg.downloads,
      updatedAt: pkg.updatedAt
    });
  }

  // Sort by downloads (descending)
  packages.sort((a, b) => b.downloads - a.downloads);

  // Paginate
  const total = packages.length;
  packages = packages.slice(from, from + size);

  res.json({
    objects: packages.map(pkg => ({ package: pkg })),
    total,
    time: new Date().toISOString()
  });
});

// Get specific package metadata
app.get('/packages/:name', [
  param('name').isString().isLength({ min: 1 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
  }

  const packageName = req.params.name;
  const packageVersions = packageIndex[packageName];

  if (!packageVersions) {
    return res.status(404).json({ error: 'Package not found' });
  }

  // Return all versions
  const versions = Object.keys(packageVersions).sort(semver.rcompare);
  const latest = packageVersions[versions[0]];

  res.json({
    name: packageName,
    description: latest.description,
    'dist-tags': {
      latest: versions[0]
    },
    versions: packageVersions,
    time: {
      created: latest.createdAt,
      modified: latest.updatedAt,
      ...Object.fromEntries(
        versions.map(v => [v, packageVersions[v].createdAt])
      )
    },
    author: latest.author,
    keywords: latest.keywords,
    license: latest.license,
    repository: latest.repository,
    homepage: latest.homepage,
    readme: latest.readme
  });
});

// Get specific package version
app.get('/packages/:name/:version', [
  param('name').isString().isLength({ min: 1 }),
  param('version').isString().isLength({ min: 1 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
  }

  const packageName = req.params.name;
  const version = req.params.version;
  const packageVersions = packageIndex[packageName];

  if (!packageVersions || !packageVersions[version]) {
    return res.status(404).json({ error: 'Package version not found' });
  }

  res.json(packageVersions[version]);
});

// Download package tarball
app.get('/packages/:name/-/:filename', [
  param('name').isString().isLength({ min: 1 }),
  param('filename').isString().matches(/\.tgz$/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
  }

  const packageName = req.params.name;
  const filename = req.params.filename;
  const tarballPath = path.join(PACKAGES_PATH, packageName, '-', filename);

  if (!await fs.pathExists(tarballPath)) {
    return res.status(404).json({ error: 'Package tarball not found' });
  }

  try {
    // Extract version from filename
    const versionMatch = filename.match(/-(\d+\.\d+\.\d+.*?)\.tgz$/);
    if (versionMatch) {
      const version = versionMatch[1];
      const packageData = packageIndex[packageName]?.[version];
      if (packageData) {
        packageData.downloads++;
        await savePackageIndex();
      }
    }

    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(tarballPath);
    fileStream.pipe(res);
    
  } catch (error) {
    logger.error('Error serving package tarball:', error);
    res.status(500).json({ error: 'Failed to serve package' });
  }
});

// Publish package
app.put('/packages/:name', upload.single('tarball'), [
  param('name').isString().isLength({ min: 1 }),
  body('version').isString().custom(value => {
    if (!semver.valid(value)) {
      throw new Error('Invalid version format');
    }
    return true;
  }),
  body('description').optional().isString(),
  body('type').isIn(['protocol-template', 'control-arm', 'endpoint-analytics', 'simulation-model']),
  body('keywords').optional().isArray(),
  body('author').optional().isString(),
  body('license').optional().isString(),
  body('repository').optional().isString(),
  body('homepage').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
  }

  const packageName = req.params.name;
  const {
    version,
    description,
    type,
    keywords = [],
    author,
    license = 'MIT',
    repository,
    homepage
  } = req.body;

  // Check if version already exists
  if (packageIndex[packageName]?.[version]) {
    return res.status(409).json({ error: 'Package version already exists' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Package tarball is required' });
  }

  try {
    // Validate tarball
    const tempPath = req.file.path;
    const extractPath = path.join(STORAGE_PATH, 'temp', uuidv4());
    
    await fs.ensureDir(extractPath);
    await tar.extract({
      file: tempPath,
      cwd: extractPath
    });

    // Validate package structure
    const packageJsonPath = path.join(extractPath, 'package', 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      await fs.remove(tempPath);
      await fs.remove(extractPath);
      return res.status(400).json({ error: 'Invalid package: missing package.json' });
    }

    const packageJson = await fs.readJson(packageJsonPath);
    if (packageJson.name !== packageName || packageJson.version !== version) {
      await fs.remove(tempPath);
      await fs.remove(extractPath);
      return res.status(400).json({ error: 'Package name/version mismatch' });
    }

    // Move tarball to storage
    const targetDir = path.join(PACKAGES_PATH, packageName, '-');
    const targetPath = path.join(targetDir, `${packageName}-${version}.tgz`);
    
    await fs.ensureDir(targetDir);
    await fs.move(tempPath, targetPath);

    // Get file size
    const stats = await fs.stat(targetPath);
    const size = stats.size;

    // Read README if exists
    let readme = '';
    const readmePath = path.join(extractPath, 'package', 'README.md');
    if (await fs.pathExists(readmePath)) {
      readme = await fs.readFile(readmePath, 'utf8');
    }

    // Update package index
    if (!packageIndex[packageName]) {
      packageIndex[packageName] = {};
    }

    const now = new Date().toISOString();
    packageIndex[packageName][version] = {
      name: packageName,
      version,
      description,
      author,
      type,
      keywords: Array.isArray(keywords) ? keywords : [],
      bastionVersion: packageJson.bastionVersion || '^1.0.0',
      createdAt: now,
      updatedAt: now,
      downloads: 0,
      size,
      tarball: `/packages/${packageName}/-/${packageName}-${version}.tgz`,
      readme,
      license,
      repository,
      homepage
    };

    await savePackageIndex();

    // Cleanup
    await fs.remove(extractPath);

    logger.info(`Package published: ${packageName}@${version}`);

    res.status(201).json({
      message: 'Package published successfully',
      name: packageName,
      version,
      tarball: packageIndex[packageName][version].tarball
    });

  } catch (error) {
    logger.error('Error publishing package:', error);
    
    // Cleanup on error
    if (req.file) {
      await fs.remove(req.file.path).catch(() => {});
    }
    
    res.status(500).json({ error: 'Failed to publish package' });
  }
});

// Search packages
app.get('/search', [
  query('text').isString().isLength({ min: 1 }),
  query('size').optional().isInt({ min: 1, max: 100 }),
  query('from').optional().isInt({ min: 0 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', errors: errors.array() });
  }

  const searchText = (req.query.text as string).toLowerCase();
  const size = parseInt(req.query.size as string) || 20;
  const from = parseInt(req.query.from as string) || 0;

  const results: any[] = [];

  for (const [name, versions] of Object.entries(packageIndex)) {
    const latestVersion = Object.keys(versions).sort(semver.rcompare)[0];
    const pkg = versions[latestVersion];

    // Search in name, description, keywords
    const searchableText = [
      name,
      pkg.description || '',
      ...(pkg.keywords || [])
    ].join(' ').toLowerCase();

    if (searchableText.includes(searchText)) {
      results.push({
        package: {
          name,
          version: latestVersion,
          description: pkg.description,
          keywords: pkg.keywords,
          author: pkg.author,
          type: pkg.type,
          downloads: pkg.downloads,
          updatedAt: pkg.updatedAt
        },
        score: {
          final: name.toLowerCase().includes(searchText) ? 1.0 : 0.5,
          detail: {
            quality: 0.8,
            popularity: Math.min(pkg.downloads / 1000, 1.0),
            maintenance: 0.9
          }
        }
      });
    }
  }

  // Sort by score
  results.sort((a, b) => b.score.final - a.score.final);

  // Paginate
  const total = results.length;
  const paginatedResults = results.slice(from, from + size);

  res.json({
    objects: paginatedResults,
    total,
    time: new Date().toISOString()
  });
});

// Package statistics
app.get('/stats', (req, res) => {
  const stats = {
    totalPackages: Object.keys(packageIndex).length,
    totalVersions: Object.values(packageIndex).reduce((sum, versions) => sum + Object.keys(versions).length, 0),
    totalDownloads: Object.values(packageIndex).reduce((sum, versions) => {
      return sum + Object.values(versions).reduce((vsum, pkg) => vsum + pkg.downloads, 0);
    }, 0),
    packagesByType: {} as Record<string, number>
  };

  // Count packages by type
  for (const versions of Object.values(packageIndex)) {
    const latestVersion = Object.keys(versions).sort(semver.rcompare)[0];
    const pkg = versions[latestVersion];
    stats.packagesByType[pkg.type] = (stats.packagesByType[pkg.type] || 0) + 1;
  }

  res.json(stats);
});

// Error handling
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Request error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large' });
    }
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
async function startServer() {
  try {
    await loadPackageIndex();
    
    app.listen(port, () => {
      logger.info(`Package registry server started on port ${port}`);
      logger.info(`Packages stored in: ${PACKAGES_PATH}`);
      logger.info(`Total packages: ${Object.keys(packageIndex).length}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();