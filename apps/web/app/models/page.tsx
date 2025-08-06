'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Brain,
  Search,
  Flame,
  Verified,
  Download,
  Trophy
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
import { ModelCard } from '@/components/ui/model-card';
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
    rotateY: 0
  },
  hover: {
    y: -12,
    rotateY: 5,
    scale: 1.03,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
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



  return (
    <motion.div 
      className="min-h-screen bg-background relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Refined gradient overlay following design system */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/5"
        style={{ y: backgroundY }}
      />
      
      {/* Subtle geometric elements with design system colors */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-[0.03]"
        style={{ 
          top: '8%', 
          left: '10%',
          background: 'hsl(228 100% 51%)', // primary from design system
          filter: 'blur(60px)'
        }}
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -20, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-[0.03]"
        style={{ 
          bottom: '15%', 
          right: '15%',
          background: 'hsl(173 75% 51%)', // accent from design system
          filter: 'blur(50px)'
        }}
        animate={{ 
          x: [0, -25, 0], 
          y: [0, 25, 0],
          scale: [1, 0.95, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section - Clean and minimal following design system */}
        <motion.div 
          className="text-center mb-20"
          style={{ y: heroSpring, opacity: opacitySpring }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.15 }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="relative flex items-center justify-center"
              animate={{
                y: [-1, 1, -1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Brain size={42} className="text-primary" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground"
              style={{ 
                fontWeight: 300,
                letterSpacing: '-0.035em',
                lineHeight: 0.9
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              Scientific Models
            </motion.h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
              style={{ fontWeight: 400 }}
            >
              Every scientific claim becomes runnable. Discover and deploy cutting-edge foundation models 
              with git-based versioning and automated reproducibility verification.
            </p>
          </motion.div>

          {/* Clean Stats Cards following design system */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.06, delayChildren: 0.3 }}
            className="mb-16"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group"
              >
                <Card className="text-center border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-border transition-all duration-300 group-hover:shadow-sm">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Brain className="h-4 w-4 text-primary" />
                      <span className="text-xl md:text-2xl font-semibold text-foreground font-mono">
                        {models.length}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">AI Models</span>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="group"
              >
                <Card className="text-center border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-border transition-all duration-300 group-hover:shadow-sm">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Download className="h-4 w-4 text-accent" />
                      <span className="text-xl md:text-2xl font-semibold text-foreground font-mono">
                        {models.reduce((sum, m) => sum + m.downloads, 0).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">Downloads</span>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="group"
              >
                <Card className="text-center border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-border transition-all duration-300 group-hover:shadow-sm">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-xl md:text-2xl font-semibold text-foreground font-mono">
                        {models.reduce((sum, m) => sum + (m.citations || 0), 0).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">Citations</span>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                className="group"
              >
                <Card className="text-center border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-border transition-all duration-300 group-hover:shadow-sm">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Verified className="h-4 w-4 text-accent" />
                      <span className="text-xl md:text-2xl font-semibold text-foreground font-mono">
                        98.5%
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">Verified</span>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters - Refined UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-8 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative max-w-lg mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search models, tags, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-border/50 bg-background/50 focus:bg-background/80 transition-colors"
                  />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-border/50">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger className="border-border/50">
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map(domain => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger className="border-border/50">
                      <SelectValue placeholder="Framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map(framework => (
                        <SelectItem key={framework} value={framework}>{framework}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Tabs value={viewMode} onValueChange={setViewMode}>
                    <TabsList className="grid w-full grid-cols-2 bg-muted/30">
                      <TabsTrigger value="featured" className="text-xs data-[state=active]:bg-background">
                        <Flame className="h-3 w-3 mr-1" />
                        Featured
                      </TabsTrigger>
                      <TabsTrigger value="all" className="text-xs data-[state=active]:bg-background">
                        <Brain className="h-3 w-3 mr-1" />
                        All
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <div className="border-t border-border/30 mt-6 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">
                    {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} found
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20">
                      <Flame className="h-3 w-3" />
                      {models.filter(m => m.trending).length} Trending
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1 bg-accent/10 text-accent border-accent/20">
                      <Verified className="h-3 w-3" />
                      {models.filter(m => m.verified).length} Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Models Grid - Clean and Simple */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {filteredModels.map((model, index) => (
            <ModelCard
              key={model.id}
              id={model.id}
              name={model.name}
              description={model.description}
              author={model.author}
              authorAvatar={model.authorAvatar}
              featured={model.featured}
              trending={model.trending}
              verified={model.verified}
              tags={model.tags}
              downloads={model.downloads}
              likes={model.likes}
              accuracy={model.accuracy}
              framework={model.framework}
              delay={index * 0.05}
            />
          ))}
        </motion.div>

        {/* Enhanced Empty State */}
        <AnimatePresence>
          {filteredModels.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6"
              >
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <Brain className="w-16 h-16 text-muted-foreground/60 mx-auto" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-accent/20 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
              
              <motion.h3 
                className="text-xl font-semibold text-foreground mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                No models found
              </motion.h3>
              
              <motion.p 
                className="text-muted-foreground mb-6 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Try adjusting your search criteria or browse all available models to discover cutting-edge AI research.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedDomain('All');
                    setSelectedFramework('All');
                    setViewMode('all');
                  }}
                  className="bg-background hover:bg-muted/50 border-border/50"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
