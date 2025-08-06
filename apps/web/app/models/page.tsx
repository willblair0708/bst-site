'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Brain,
  Sparkles,
  Zap,
  Globe,
  Cpu,
  Calendar,
  Shield,
  TrendingUp,
  GitFork,
  Users,
  ArrowRight,
  ChevronRight,
  Star,
  Download,
  Eye,
  Clock,
  BarChart3,
  Layers,
  Rocket,
  Search,
  Filter,
  Flame,
  Trophy,
  Lightbulb,
  Activity
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

// Animation variants for enhanced micro-interactions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: { scale: 0.98 }
};

const cardVariants = {
  initial: { opacity: 0, y: 30, rotateY: -15 },
  animate: { 
    opacity: 1, 
    y: 0, 
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -12,
    rotateY: 5,
    scale: 1.03,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const statsVariants = {
  initial: { opacity: 0, scale: 0.8, rotateX: -45 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    rotateX: 5,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const heroVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

// Enhanced models data with AI-first metrics
const models = [
  {
    id: 'alphafold-3',
    name: 'AlphaFold 3',
    author: 'DeepMind',
    authorAvatar: '/avatars/deepmind.png',
    description: 'Revolutionary protein structure prediction achieving atomic-level accuracy for all life\'s molecules',
    category: 'Protein Structure',
    domain: 'Structural Biology',
    downloads: 125000,
    likes: 8420,
    lastModified: '2024-01-15',
    tags: ['protein-folding', 'structural-biology', 'deep-learning', 'biology'],
    license: 'Apache 2.0',
    size: '2.1 GB',
    framework: 'TensorFlow',
    language: 'Python',
    featured: true,
    trending: true,
    accuracy: 92.5,
    computeReq: 'GPU Required',
    papers: 23,
    citations: 15420,
    benchmarkScore: 94.2,
    inferenceTime: '0.8s',
    modelParams: '2.1B',
    energyEfficiency: 'A+',
    reproduced: 89,
    difficulty: 'Intermediate',
    industry: ['pharma', 'biotech', 'research'],
    useCases: ['Drug Discovery', 'Protein Engineering', 'Disease Research'],
    verified: true,
    aiMetrics: {
      robustness: 94,
      fairness: 91,
      explainability: 87,
      scalability: 96
    }
  },
  {
    id: 'scbert',
    name: 'scBERT',
    author: 'TencentAI',
    authorAvatar: '/avatars/tencent.png',
    description: 'Transformer-powered single-cell RNA sequencing analysis with state-of-the-art cell type classification',
    category: 'Genomics',
    domain: 'Single Cell Analysis',
    downloads: 45000,
    likes: 2100,
    lastModified: '2024-01-10',
    tags: ['single-cell', 'rna-seq', 'transformer', 'genomics'],
    license: 'MIT',
    size: '850 MB',
    framework: 'PyTorch',
    language: 'Python',
    featured: false,
    trending: false,
    accuracy: 89.2,
    computeReq: 'CPU/GPU',
    papers: 8,
    citations: 3240,
    benchmarkScore: 91.5,
    inferenceTime: '2.1s',
    modelParams: '340M',
    energyEfficiency: 'B+',
    reproduced: 67,
    difficulty: 'Advanced',
    industry: ['biotech', 'research', 'pharma'],
    useCases: ['Cell Classification', 'Gene Expression', 'Disease Modeling'],
    verified: true,
    aiMetrics: {
      robustness: 88,
      fairness: 94,
      explainability: 76,
      scalability: 89
    }
  },
  {
    id: 'chemprop',
    name: 'ChemProp',
    author: 'MIT CSAIL',
    authorAvatar: '/avatars/mit.png',
    description: 'Molecular property prediction using message passing neural networks',
    category: 'Chemistry',
    domain: 'Drug Discovery',
    downloads: 67000,
    likes: 3400,
    lastModified: '2024-01-08',
    tags: ['chemistry', 'drug-discovery', 'molecular-properties', 'mpnn'],
    license: 'MIT',
    size: '120 MB',
    framework: 'PyTorch',
    language: 'Python',
    featured: true,
    accuracy: 85.7,
    computeReq: 'CPU'
  },
  {
    id: 'esm-2',
    name: 'ESM-2',
    author: 'Meta AI',
    authorAvatar: '/avatars/meta.png',
    description: 'Evolutionary scale modeling for protein sequence analysis',
    category: 'Protein Analysis',
    domain: 'Computational Biology',
    downloads: 89000,
    likes: 5200,
    lastModified: '2024-01-12',
    tags: ['protein-sequences', 'evolution', 'language-model', 'biology'],
    license: 'MIT',
    size: '15 GB',
    framework: 'PyTorch',
    language: 'Python',
    featured: true,
    accuracy: 94.1,
    computeReq: 'GPU Required'
  },
  {
    id: 'deepchem',
    name: 'DeepChem',
    author: 'DeepChem Team',
    authorAvatar: '/avatars/deepchem.png',
    description: 'Deep learning for drug discovery and quantum chemistry',
    category: 'Chemistry',
    domain: 'Drug Discovery',
    downloads: 156000,
    likes: 7800,
    lastModified: '2024-01-14',
    tags: ['deep-learning', 'chemistry', 'drug-discovery', 'quantum'],
    license: 'MIT',
    size: '300 MB',
    framework: 'TensorFlow',
    language: 'Python',
    featured: false,
    accuracy: 87.3,
    computeReq: 'CPU/GPU'
  },
  {
    id: 'geneformer',
    name: 'Geneformer',
    author: 'Gladstone Institutes',
    authorAvatar: '/avatars/gladstone.png',
    description: 'Transformer model for gene network analysis and cell state prediction',
    category: 'Genomics',
    domain: 'Gene Networks',
    downloads: 34000,
    likes: 1900,
    lastModified: '2024-01-09',
    tags: ['gene-networks', 'transformer', 'cell-biology', 'genomics'],
    license: 'Apache 2.0',
    size: '1.8 GB',
    framework: 'PyTorch',
    language: 'Python',
    featured: false,
    accuracy: 91.8,
    computeReq: 'GPU Recommended'
  }
];

const categories = ['All', 'Protein Structure', 'Genomics', 'Chemistry', 'Protein Analysis'];
const domains = ['All', 'Structural Biology', 'Drug Discovery', 'Single Cell Analysis', 'Computational Biology', 'Gene Networks'];
const frameworks = ['All', 'PyTorch', 'TensorFlow'];

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedFramework, setSelectedFramework] = useState('All');
  const [sortBy, setSortBy] = useState('trending');
  const [viewMode, setViewMode] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced scroll animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const backgroundY = useTransform(scrollY, [0, 500], [0, -100]);
  
  // Spring animations for smooth interactions
  const springConfig = { stiffness: 300, damping: 30 };
  const heroSpring = useSpring(heroY, springConfig);
  const opacitySpring = useSpring(heroOpacity, springConfig);
  const [showFilters, setShowFilters] = useState(false);

  const filteredModels = useMemo(() => {
    let filtered = models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || model.category === selectedCategory;
      const matchesDomain = selectedDomain === 'All' || model.domain === selectedDomain;
      const matchesFramework = selectedFramework === 'All' || model.framework === selectedFramework;
      
      return matchesSearch && matchesCategory && matchesDomain && matchesFramework;
    });

    if (viewMode === 'featured') {
      filtered = filtered.filter(model => model.featured);
    }

    // Sort models
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'recent':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default: // downloads
          return b.downloads - a.downloads;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedDomain, selectedFramework, sortBy, viewMode]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div 
      className="min-h-screen bg-background relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Enhanced gradient overlay with parallax */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/10"
        style={{ y: backgroundY }}
      />
      
      {/* Enhanced floating geometric elements with physics */}
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-5"
        style={{ 
          top: '5%', 
          left: '5%',
          background: 'hsl(228 100% 51%)', // primary color
          filter: 'blur(40px)'
        }}
        animate={{ 
          x: [0, 50, 0], 
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-60 h-60 rounded-full opacity-5"
        style={{ 
          bottom: '10%', 
          right: '10%',
          background: 'hsl(173 75% 51%)', // accent color
          filter: 'blur(30px)'
        }}
        animate={{ 
          x: [0, -40, 0], 
          y: [0, 40, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Enhanced Hero Section with Parallax */}
        <motion.div 
          className="text-center mb-16"
          style={{ y: heroSpring, opacity: opacitySpring }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div 
              className="relative"
              animate={{
                y: [-2, 2, -2],
                rotate: [-2, 2, -2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Brain size={48} className="text-primary drop-shadow-lg" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-light tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent m-0"
              style={{ 
                fontWeight: 300,
                letterSpacing: '-0.035em',
                lineHeight: 1
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              Scientific Models
            </motion.h1>
            <motion.div
              animate={{
                y: [-2, 2, -2],
                rotate: [-2, 2, -2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles size={24} className="text-accent drop-shadow-lg" />
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p 
              className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed font-light"
            >
              Every scientific claim becomes runnable. Discover and deploy cutting-edge foundation models 
              with git-based versioning and automated reproducibility verification.
            </p>
          </motion.div>

          {/* Enhanced Stats Cards with Stagger Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateX: -45 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <Card className="text-center h-32 bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Brain className="text-primary text-lg" />
                      <span className="text-2xl font-bold text-primary font-mono">
                        {models.length}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">AI Models</span>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateX: -45 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              >
                <Card className="text-center h-32 bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <motion.div 
                      className="flex items-center justify-center gap-2 mb-1"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Download className="text-accent text-lg" />
                      <span className="text-2xl font-bold text-accent font-mono">
                        {formatNumber(models.reduce((sum, m) => sum + m.downloads, 0))}
                      </span>
                    </motion.div>
                    <span className="text-muted-foreground text-sm">Downloads</span>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateX: -45 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              >
                <Card className="text-center h-32 bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <motion.div 
                      className="flex items-center justify-center gap-2 mb-1"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Trophy className="text-primary text-lg" />
                      <span className="text-2xl font-bold text-primary font-mono">
                        {formatNumber(models.reduce((sum, m) => sum + (m.citations || 0), 0))}
                      </span>
                    </motion.div>
                    <span className="text-muted-foreground text-sm">Citations</span>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateX: -45 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              >
                <Card className="text-center h-32 bg-card/50 backdrop-blur border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <motion.div 
                      className="flex items-center justify-center gap-2 mb-1"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Shield className="text-accent text-lg" />
                      <span className="text-2xl font-bold text-accent font-mono">
                        98.5%
                      </span>
                    </motion.div>
                    <span className="text-muted-foreground text-sm">Verified</span>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters - Custom UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="bg-card/80 backdrop-blur border-border/50 mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search models, tags, or descriptions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-2">
                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map(domain => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-2">
                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger>
                      <SelectValue placeholder="Framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map(framework => (
                        <SelectItem key={framework} value={framework}>{framework}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-1">
                  <Tabs value={viewMode} onValueChange={setViewMode}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="featured" className="text-xs">
                        <Flame className="h-3 w-3 mr-1" />
                        Featured
                      </TabsTrigger>
                      <TabsTrigger value="all" className="text-xs">
                        <Lightbulb className="h-3 w-3 mr-1" />
                        All
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <div className="border-t border-border/50 mt-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} found
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {models.filter(m => m.trending).length} Trending
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {models.filter(m => m.verified).length} Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={model.authorAvatar} 
                        alt={model.author}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {model.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/models/${model.id}`}>
                        <CardTitle className="hover:text-primary cursor-pointer">
                          {model.name}
                        </CardTitle>
                      </Link>
                      <div className="text-sm text-muted-foreground">{model.author}</div>
                    </div>
                  </div>
                  {model.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {model.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {model.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {model.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{model.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Model Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span>{formatNumber(model.downloads)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span>{formatNumber(model.likes)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <span>{model.framework}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(model.lastModified).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>{model.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <span>{model.accuracy}% acc</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button asChild className="flex-1">
                      <Link href={`/models/${model.id}`}>
                        View Model
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <Cpu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No models found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all models
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDomain('All');
              setSelectedFramework('All');
              setViewMode('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
