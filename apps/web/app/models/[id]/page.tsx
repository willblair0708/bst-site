'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Star, 
  Download,
  GitFork,
  Calendar,
  Code,
  FileText,
  BarChart3,
  Cpu,
  Play,
  Copy,
  Share,
  Clock,
  CheckCircle,
  AlertTriangle,
  Brain,
  Verified,
  Hash,
  Eye,
  Users,
  Globe,
  Shield,
  Zap,
  Trophy,
  Activity,
  Database,
  Terminal,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Layers,
  TrendingUp,
  Timer,
  PieChart,
  LineChart,
  Monitor,
  HelpCircle,
  Beaker,
  Target,
  Workflow
} from 'lucide-react';
import Link from 'next/link';
import { ModelActions } from './model-actions';

interface ModelData {
  id: string;
  name: string;
  author: string;
  authorAvatar: string;
  description: string;
  longDescription: string;
  category: string;
  domain: string;
  downloads: number;
  likes: number;
  lastModified: string;
  tags: string[];
  license: string;
  size: string;
  framework: string;
  language: string;
  featured: boolean;
  trending: boolean;
  verified: boolean;
  accuracy: number;
  computeReq: string;
  paperUrl: string;
  codeUrl: string;
  version: string;
  citations: number;
  reproducibilityScore: number;
  validationTests: number;
  benchmarkRank: number;
  requirements: Record<string, string>;
  metrics: Record<string, string>;
  scientificMetrics: Record<string, number>;
  useCases: string[];
  quickStart: string;
  apiReference: Array<{
    function: string;
    description: string;
    parameters: Record<string, any>;
    returns: string;
  }>;
  changelog: Array<{
    version: string;
    date: string;
    changes: string[];
  }>;
  benchmarks: Array<{
    dataset: string;
    metric: string;
    score: number;
    rank: number;
    participants: number;
  }>;
  relatedModels: Array<{
    id: string;
    name: string;
    description: string;
    similarity: number;
  }>;
}

// Enhanced model data structure for scientific foundation models
const getModel = (id: string): ModelData | null => {
  const models = {
    'esm-2': {
      id: 'esm-2',
      name: 'ESM-2',
      author: 'Meta AI',
      authorAvatar: '/avatars/meta.png',
      description: 'Evolutionary scale modeling for protein sequence analysis',
      longDescription: `ESM-2 represents a breakthrough in protein language modeling, trained on millions of protein sequences to understand the evolutionary patterns and functional relationships encoded in protein sequences. This transformer-based model has learned rich representations of protein biology through large-scale unsupervised learning on sequence data.

The model captures evolutionary constraints, functional domains, and structural information directly from sequences, making it invaluable for protein engineering, variant effect prediction, and functional annotation. ESM-2's representations have shown remarkable success across diverse protein tasks, from predicting the effects of mutations to identifying functional sites.

Key innovations include the evolutionary scale modeling approach, which leverages the vast diversity of natural protein sequences, and attention mechanisms that capture long-range dependencies crucial for protein structure and function. The model has been validated on numerous protein biology benchmarks and deployed in real-world protein engineering applications.`,
      category: 'Protein Analysis',
      domain: 'Computational Biology',
      downloads: 89000,
      likes: 5200,
      lastModified: '2024-01-12',
      tags: ['protein-sequences', 'evolution', 'language-model', 'biology', 'transformers'],
      license: 'MIT',
      size: '15 GB',
      framework: 'PyTorch',
      language: 'Python',
      featured: true,
      trending: false,
      verified: true,
      accuracy: 94.1,
      computeReq: 'GPU Required',
      paperUrl: 'https://arxiv.org/abs/2206.13517',
      codeUrl: 'https://github.com/facebookresearch/esm',
      version: '2.0.1',
      citations: 12300,
      reproducibilityScore: 95.8,
      validationTests: 98,
      benchmarkRank: 1,
      requirements: {
        memory: '32 GB RAM',
        gpu: 'NVIDIA A100 or V100',
        storage: '20 GB available space',
        python: '3.8+',
        cuda: '11.0+',
        dependencies: 'PyTorch 1.12+, transformers, biotite'
      },
      metrics: {
        accuracy: '94.1%',
        speed: '10ms per sequence',
        coverage: '99% of known proteins',
        confidence: '96% reliable predictions',
        resolution: 'Residue-level',
        validation: 'Validated on ProteinGym benchmark'
      },
      scientificMetrics: {
        spearman_correlation: 0.73,
        ndcg: 0.85,
        auc_roc: 0.92,
        top_k_accuracy: 0.89,
        mutation_effect_correlation: 0.68
      },
      useCases: [
        'Protein variant effect prediction',
        'Functional site identification',
        'Protein family classification',
        'Evolutionary analysis',
        'Protein engineering guidance',
        'Contact prediction',
        'Secondary structure prediction',
        'Domain boundary prediction'
      ],
      quickStart: `# Install ESM
pip install fair-esm

# Load pre-trained ESM-2 model
import torch
import esm

# Load ESM-2 model
model, alphabet = esm.pretrained.esm2_t33_650M_UR50D()
batch_converter = alphabet.get_batch_converter()
model.eval()

# Prepare sequence data
data = [
    ("protein1", "MKTVRQERLKSIVRILERSKEPVSGAQLAEELSVSRQVIVQDIAYLRSLGYNIVATPRGYVLAGG"),
]

# Convert to model input
batch_labels, batch_strs, batch_tokens = batch_converter(data)

# Generate representations
with torch.no_grad():
    results = model(batch_tokens, repr_layers=[33], return_contacts=True)

# Extract per-residue representations
token_representations = results["representations"][33]

# Extract attention-based contacts
contacts = results["contacts"]`,
      apiReference: [
        {
          function: 'esm.pretrained.esm2_t33_650M_UR50D',
          description: 'Loads the ESM-2 650M parameter pre-trained model',
          parameters: {
            device: 'str - Device to load model on ("cpu" or "cuda")',
            eval_mode: 'bool - Whether to set model to evaluation mode'
          },
          returns: 'Tuple of (model, alphabet) for sequence processing and inference'
        },
        {
          function: 'model.extract_features',
          description: 'Extracts contextualized representations for protein sequences',
          parameters: {
            sequences: 'list - List of protein sequences',
            repr_layers: 'list - Which transformer layers to extract from',
            return_contacts: 'bool - Whether to return attention-based contacts'
          },
          returns: 'Dictionary with representations and optional contact predictions'
        }
      ],
      changelog: [
        {
          version: '2.0.1',
          date: '2024-01-12',
          changes: [
            'Improved memory efficiency for long sequences',
            'Added support for batch processing optimization',
            'Enhanced contact prediction accuracy',
            'Fixed compatibility with latest PyTorch versions',
            'Added utilities for downstream task fine-tuning'
          ]
        },
        {
          version: '2.0.0', 
          date: '2023-08-15',
          changes: [
            'Released ESM-2 with improved architecture',
            'Trained on expanded UniRef50 dataset',
            'Enhanced evolutionary scale modeling approach',
            'Improved performance on variant effect prediction',
            'Added multiple model sizes for different use cases'
          ]
        }
      ],
      benchmarks: [
        {
          dataset: 'ProteinGym',
          metric: 'Spearman ρ',
          score: 0.73,
          rank: 1,
          participants: 15
        },
        {
          dataset: 'FLIP',
          metric: 'AUC-ROC',
          score: 0.92,
          rank: 1,
          participants: 12
        },
        {
          dataset: 'Mutation Effects',
          metric: 'Correlation',
          score: 0.68,
          rank: 2,
          participants: 8
        }
      ],
      relatedModels: [
        {
          id: 'alphafold-3',
          name: 'AlphaFold 3',
          description: 'Protein structure prediction',
          similarity: 0.85
        },
        {
          id: 'scbert',
          name: 'scBERT',
          description: 'Single-cell RNA analysis',
          similarity: 0.72
        },
        {
          id: 'chemprop',
          name: 'ChemProp',
          description: 'Molecular property prediction',
          similarity: 0.58
        }
      ]
    }
  };

  const decodedId = decodeURIComponent(id);
  const formattedId = decodedId.toLowerCase().replace(/ /g, '-');
  return models[formattedId as keyof typeof models] || null;
};

interface ModelPageProps {
  params: Promise<{
    id: string;
  }>;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function ModelPage({ params }: ModelPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copySuccess, setCopySuccess] = useState(false);
  const [modelId, setModelId] = useState<string | null>(null);
  const [model, setModel] = useState<ModelData | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
  const resolvedParams = await params;
      setModelId(resolvedParams.id);
      const modelData = getModel(resolvedParams.id);
      setModel(modelData);
    };
    resolveParams();
  }, [params]);

  // Loading state
  if (!model && modelId !== null) {
    notFound();
  }

  // Still loading
  if (!model) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading model...</p>
        </div>
      </div>
    );
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb / Back link */}
        <div className="mb-6">
          <Link href="/models" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
            <ChevronRight className="rotate-180 h-4 w-4" />
            Back to models
          </Link>
        </div>
                  {/* Hero Section - Enhanced Design */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* Hero Header - Astra-Soft Design */}
          <div className="rounded-3xl border bg-card p-6 lg:p-8 mb-10 shadow-elevation-1">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex items-start gap-6 flex-1">
                <div className="relative">
                  <Avatar className="h-16 w-16 shadow-elevation-1">
                    <AvatarImage src={model.authorAvatar} alt={model.author} />
                    <AvatarFallback className="bg-primary-500 text-foreground text-2xl font-bold">
                      {model.author.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {model.verified && (
                    <motion.div 
                      className="absolute -bottom-2 -right-2 w-7 h-7 bg-accent-500 rounded-full flex items-center justify-center border-2 border-card shadow-elevation-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
                    >
                      <Verified className="h-3.5 w-3.5 text-foreground" />
                    </motion.div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                        {model.name}
                      </h1>
                      <div className="flex gap-1.5">
                        {model.featured && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Badge className="bg-primary-500 text-foreground border-0 px-2 py-0.5 rounded-xl text-xs">
                              <Trophy className="h-3 w-3 mr-1.5" />
                              Featured
                            </Badge>
                          </motion.div>
                        )}
                        {model.trending && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <Badge className="bg-accent-500 text-foreground border-0 px-2 py-0.5 rounded-xl text-xs">
                              <TrendingUp className="h-3 w-3 mr-1.5" />
                              Trending
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </div>
          
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">by</span>
                      <span className="font-medium text-foreground">{model.author}</span>
                      <span className="text-muted-foreground">•</span>
                      <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-md">
                        v{model.version}
                      </Badge>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">Updated {new Date(model.lastModified).toLocaleDateString()}</span>
                    </div>
                    {/* Meta chips */}
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span className="font-mono">{formatNumber(model.likes)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span className="font-mono">{formatNumber(model.downloads)}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                    {model.description}
                  </p>
                </div>
              </div>
              
              <div className="lg:ml-8">
                <ModelActions likes={model.likes} />
              </div>
            </div>
          </div>

          {/* Enhanced Metrics Grid - Pastel Bento Tiles */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Composable Models Pillar - Downloads */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Card className="text-center bg-card border border-border transition-shadow shadow-elevation-1 hover:shadow-elevation-2 rounded-2xl">
                <CardContent className="p-4">
                  <div className="mb-2 flex justify-center">
                    <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center">
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-foreground">{formatNumber(model.downloads)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Downloads</div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Versioned Knowledge Pillar - Stars */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Card className="text-center bg-card border border-border transition-shadow shadow-elevation-1 hover:shadow-elevation-2 rounded-2xl">
                <CardContent className="p-4">
                  <div className="mb-2 flex justify-center">
                    <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center">
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-foreground">{formatNumber(model.likes)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Stars</div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Human-AI Collaboration Pillar - Citations */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Card className="text-center bg-card border border-border transition-shadow shadow-elevation-1 hover:shadow-elevation-2 rounded-2xl">
                <CardContent className="p-4">
                  <div className="mb-2 flex justify-center">
                    <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-foreground">{formatNumber(model.citations)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Citations</div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Composable Models Pillar - Accuracy */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Card className="text-center bg-card border border-border transition-shadow shadow-elevation-1 hover:shadow-elevation-2 rounded-2xl">
                <CardContent className="p-4">
                  <div className="mb-2 flex justify-center">
                    <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-foreground">{model.accuracy}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Accuracy</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Card className="text-center bg-card border border-border transition-shadow shadow-elevation-1 hover:shadow-elevation-2 rounded-2xl">
                <CardContent className="p-4">
                  <div className="mb-2 flex justify-center">
                    <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-foreground">{model.reproducibilityScore}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Reproducible</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Card className="text-center bg-card border border-border transition-shadow shadow-elevation-1 hover:shadow-elevation-2 rounded-2xl">
                <CardContent className="p-4">
                  <div className="mb-2 flex justify-center">
                    <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center">
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-xl font-semibold text-foreground">#{model.benchmarkRank}</div>
                  <div className="text-xs text-muted-foreground mt-1">Global Rank</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Action Buttons - Soft-UI Design */}
          <motion.div 
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="sm" 
                className="bg-primary-500 hover:bg-primary-600 transition-colors whitespace-nowrap text-foreground px-4 py-2 rounded-xl"
              >
                <Play className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Run Model</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                size="sm" 
                className="px-4 py-2 rounded-xl"
              >
                <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Download</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                size="sm" 
                className="px-4 py-2 rounded-xl"
              >
                <GitFork className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Fork</span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="px-4 py-2 rounded-xl"
              >
                <Link href={model.codeUrl} target="_blank" className="flex items-center">
                  <Code className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>View Code</span>
                  <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="px-4 py-2 rounded-xl"
              >
                <Link href={model.paperUrl} target="_blank" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>Read Paper</span>
                  <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content */}
          <motion.div 
            className="xl:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="mb-12">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-muted border p-1 rounded-xl sticky top-0 z-10">
                  <TabsTrigger value="overview" className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-background">
                    <Brain className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="quickstart" className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-background">
                    <Zap className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Quick Start</span>
                  </TabsTrigger>
                  <TabsTrigger value="benchmarks" className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-background">
                    <Trophy className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Benchmarks</span>
                  </TabsTrigger>
                  <TabsTrigger value="api" className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-background">
                    <Terminal className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">API Docs</span>
                  </TabsTrigger>
                  <TabsTrigger value="validation" className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-background">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Validation</span>
                  </TabsTrigger>
                  <TabsTrigger value="changelog" className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-background">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Changelog</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="overview" className="space-y-10">
                    <Card className="bg-card border rounded-2xl overflow-hidden shadow-elevation-1">
                      <CardHeader className="pb-6">
                        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                          </div>
                          About This Model
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                  <div className="prose max-w-none">
                          {model.longDescription.split('\n\n').map((paragraph: string, index: number) => (
                            <p key={index} className="mb-6 text-muted-foreground leading-relaxed text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Card className="bg-card border shadow-elevation-1 rounded-2xl">
                        <CardHeader className="pb-6">
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                              <Target className="h-5 w-5 text-muted-foreground" />
                            </div>
                            Use Cases
                          </CardTitle>
                </CardHeader>
                <CardContent>
                          <div className="space-y-4">
                            {model.useCases.map((useCase: string, index: number) => (
                              <motion.div 
                                key={index} 
                                className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-foreground font-medium">{useCase}</span>
                              </motion.div>
                            ))}
                          </div>
                </CardContent>
              </Card>

                      <Card className="bg-card border shadow-elevation-1 rounded-2xl">
                        <CardHeader className="pb-6">
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                              <BarChart3 className="h-5 w-5 text-muted-foreground" />
                            </div>
                            Performance Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Object.entries(model.metrics).map(([key, value]: [string, string], index: number) => (
                              <motion.div 
                                key={key} 
                                className="flex justify-between items-center p-3 bg-background/50 rounded-lg border"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <span className="text-sm text-muted-foreground capitalize font-medium">
                                  {key.replace(/([A-Z])/g, ' $1')}:
                                </span>
                                <span className="text-sm font-bold text-foreground">{value}</span>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
            </TabsContent>

            <TabsContent value="quickstart" className="space-y-6">
                    <Card className="bg-card border rounded-2xl shadow-elevation-1">
                <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Zap className="h-5 w-5" />
                          Quick Start Guide
                        </CardTitle>
                  <CardDescription>Get started with {model.name} in minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                          <div className="relative">
                            <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto border">
                        <code className="text-sm">{model.quickStart}</code>
                      </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleCopyCode(model.quickStart)}
                            >
                              {copySuccess ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

                  <TabsContent value="benchmarks" className="space-y-6">
                    <Card className="bg-card border rounded-2xl shadow-elevation-1">
                  <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Trophy className="h-5 w-5" />
                          Benchmark Results
                        </CardTitle>
                        <CardDescription>Performance across scientific evaluation datasets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                          {model.benchmarks.map((benchmark: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                              <div>
                                <div className="font-medium">{benchmark.dataset}</div>
                                <div className="text-sm text-muted-foreground">{benchmark.metric}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-semibold text-foreground">{benchmark.score}</div>
                                <div className="text-sm text-muted-foreground">
                                  Rank #{benchmark.rank} of {benchmark.participants}
                                </div>
                              </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                    <Card className="bg-card border rounded-2xl shadow-elevation-1">
                  <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <PieChart className="h-5 w-5" />
                          Scientific Metrics
                        </CardTitle>
                  </CardHeader>
                  <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.entries(model.scientificMetrics).map(([key, value]: [string, number]) => (
                            <div key={key} className="text-center p-3 bg-muted/30 rounded-lg border">
                              <div className="text-lg font-semibold text-foreground">{value}</div>
                              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                {key.replace(/_/g, '-')}
                              </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
                    <Card className="bg-card border rounded-2xl shadow-elevation-1">
                <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Terminal className="h-5 w-5" />
                          API Reference
                        </CardTitle>
                        <CardDescription>Complete API documentation for {model.name}</CardDescription>
                </CardHeader>
                <CardContent>
                        <div className="space-y-6">
                          {model.apiReference.map((api: any, index: number) => (
                            <div key={index} className="border rounded-lg p-4 bg-muted/30">
                              <h4 className="font-mono font-medium mb-2 text-foreground">{api.function}()</h4>
                              <p className="text-sm text-muted-foreground mb-4">{api.description}</p>
                              
                              <div className="space-y-2 mb-4">
                                <h5 className="font-medium text-sm">Parameters:</h5>
                                {Object.entries(api.parameters).map(([param, desc]: [string, any]) => (
                                  <div key={param} className="text-sm">
                                    <code className="bg-muted px-1 rounded">{param}</code>
                                    <span className="text-muted-foreground ml-2">{desc}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-sm mb-1">Returns:</h5>
                                <p className="text-sm text-muted-foreground">{api.returns}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="validation" className="space-y-6">
                    <Card className="bg-card border rounded-2xl shadow-elevation-1">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Shield className="h-5 w-5" />
                          Reproducibility & Validation
                        </CardTitle>
                        <CardDescription>Scientific validation and reproducibility metrics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-4 bg-accent/10 rounded-lg border">
                            <div className="text-2xl font-semibold text-foreground mb-2">{model.reproducibilityScore}%</div>
                            <div className="text-sm text-muted-foreground">Reproducibility Score</div>
                          </div>
                          <div className="text-center p-4 bg-primary/10 rounded-lg border">
                            <div className="text-2xl font-semibold text-foreground mb-2">{model.validationTests}</div>
                            <div className="text-sm text-muted-foreground">Validation Tests</div>
                          </div>
                          <div className="text-center p-4 bg-green-500/10 rounded-lg border">
                            <div className="text-2xl font-semibold text-foreground mb-2">✓ Verified</div>
                            <div className="text-sm text-muted-foreground">Scientific Review</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="changelog" className="space-y-6">
              <div className="space-y-4">
                      {model.changelog.map((release: any, index: number) => (
                        <Card key={index} className="bg-card border rounded-2xl shadow-elevation-1">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-semibold">Version {release.version}</CardTitle>
                        <Badge variant="outline">{release.date}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                            <ul className="space-y-2">
                              {release.changes.map((change: string, changeIndex: number) => (
                                <li key={changeIndex} className="flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
                </motion.div>
              </AnimatePresence>
          </Tabs>
          </motion.div>

        {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Enhanced Model Information */}
            <Card className="bg-gradient-to-br from-card/40 to-card/20 border-border/50 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  Model Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground font-medium">Category:</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20">{model.category}</Badge>
              </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground font-medium">Domain:</span>
                  <span className="text-sm font-semibold text-foreground">{model.domain}</span>
              </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground font-medium">Framework:</span>
                  <Badge variant="outline" className="border-accent/30 text-accent">{model.framework}</Badge>
              </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground font-medium">Language:</span>
                  <span className="text-sm font-semibold text-foreground">{model.language}</span>
              </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground font-medium">License:</span>
                  <Badge variant="outline" className="border-green-500/30 text-green-600">{model.license}</Badge>
              </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground font-medium">Model Size:</span>
                  <span className="text-sm font-semibold text-foreground">{model.size}</span>
              </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground font-medium">Compute:</span>
                  <span className="text-sm font-semibold text-foreground">{model.computeReq}</span>
              </div>
            </CardContent>
          </Card>

            {/* Enhanced System Requirements */}
            <Card className="bg-gradient-to-br from-card/40 to-card/20 border-border/50 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Monitor className="h-5 w-5 text-accent" />
                  </div>
                  System Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(model.requirements).map(([key, value]: [string, string], index: number) => (
                  <motion.div 
                    key={key} 
                    className="flex justify-between items-center p-3 bg-background/50 rounded-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-sm text-muted-foreground capitalize font-medium">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="text-sm font-semibold text-foreground">{value}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced Tags */}
            <Card className="bg-gradient-to-br from-card/40 to-card/20 border-border/50 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  Tags
                </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag: string, index: number) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Badge 
                        variant="outline" 
                        className="bg-gradient-to-r from-muted/50 to-muted/30 border-border/50 hover:bg-muted/70 transition-colors cursor-pointer"
                      >
                    {tag}
                  </Badge>
                    </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

            {/* Enhanced Related Models */}
            <Card className="bg-gradient-to-br from-card/40 to-card/20 border-border/50 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Layers className="h-5 w-5 text-accent" />
                  </div>
                  Related Models
                </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                  {model.relatedModels.map((relatedModel: any, index: number) => (
                    <motion.div
                      key={relatedModel.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        href={`/models/${relatedModel.id}`} 
                        className="block p-4 rounded-xl border border-border/50 hover:border-accent/30 bg-background/50 hover:bg-background/80 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold group-hover:text-accent transition-colors">
                            {relatedModel.name}
                          </div>
                          <Badge variant="outline" className="text-xs bg-accent/10 border-accent/30 text-accent">
                            {Math.round(relatedModel.similarity * 100)}%
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {relatedModel.description}
                        </div>
                </Link>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}