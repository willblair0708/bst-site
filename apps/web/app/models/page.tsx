'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { 
  Brain,
  Search,
  Flame,
  Verified,
  Download,
  Trophy,
  Bot
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
const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1]
    }
  },
};

const heroVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.4, 0.0, 0.2, 1],
      staggerChildren: 0.15
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
    description: 'Revolutionary protein structure prediction with atomic-level accuracy for all of life\'s molecules.',
    category: 'Protein Structure',
    domain: 'Structural Biology',
    downloads: 125000,
    likes: 8420,
    lastModified: '2024-05-08',
    tags: ['protein-folding', 'structural-biology', 'deep-learning', 'biology'],
    license: 'Apache 2.0',
    size: '2.1 GB',
    framework: 'TensorFlow',
    language: 'Python',
    featured: true,
    trending: true,
    verified: true,
    citations: 15420,
  },
  {
    id: 'scbert',
    name: 'scBERT',
    author: 'TencentAI',
    authorAvatar: '/avatars/tencent.png',
    description: 'Transformer-powered single-cell RNA sequencing analysis for state-of-the-art cell type classification.',
    category: 'Genomics',
    domain: 'Single Cell Analysis',
    downloads: 45000,
    likes: 2100,
    lastModified: '2024-05-01',
    tags: ['single-cell', 'rna-seq', 'transformer', 'genomics'],
    license: 'MIT',
    size: '850 MB',
    framework: 'PyTorch',
    language: 'Python',
    featured: false,
    trending: false,
    verified: true,
    citations: 3240,
  },
  {
    id: 'chemprop',
    name: 'ChemProp',
    author: 'MIT CSAIL',
    authorAvatar: '/avatars/mit.png',
    description: 'Molecular property prediction using message passing neural networks for accelerated drug discovery.',
    category: 'Chemistry',
    domain: 'Drug Discovery',
    downloads: 67000,
    likes: 3400,
    lastModified: '2024-04-28',
    tags: ['chemistry', 'drug-discovery', 'molecular-properties', 'mpnn'],
    license: 'MIT',
    size: '120 MB',
    framework: 'PyTorch',
    language: 'Python',
    featured: true,
    verified: false,
    citations: 4800,
  },
  {
    id: 'esm-2',
    name: 'ESM-2',
    author: 'Meta AI',
    authorAvatar: '/avatars/meta.png',
    description: 'Evolutionary scale modeling for protein sequence analysis and functional annotation.',
    category: 'Protein Analysis',
    domain: 'Computational Biology',
    downloads: 89000,
    likes: 5200,
    lastModified: '2024-05-05',
    tags: ['protein-sequences', 'evolution', 'language-model', 'biology'],
    license: 'MIT',
    size: '15 GB',
    framework: 'PyTorch',
    language: 'Python',
    featured: true,
    verified: true,
    citations: 9800,
  },
  {
    id: 'deepchem',
    name: 'DeepChem',
    author: 'DeepChem Team',
    authorAvatar: '/avatars/deepchem.png',
    description: 'A comprehensive library for deep learning in drug discovery and quantum chemistry.',
    category: 'Chemistry',
    domain: 'Drug Discovery',
    downloads: 156000,
    likes: 7800,
    lastModified: '2024-04-20',
    tags: ['deep-learning', 'chemistry', 'drug-discovery', 'quantum'],
    license: 'MIT',
    size: '300 MB',
    framework: 'TensorFlow',
    language: 'Python',
    featured: false,
    verified: false,
    citations: 11250,
  },
  {
    id: 'geneformer',
    name: 'Geneformer',
    author: 'Gladstone Institutes',
    authorAvatar: '/avatars/gladstone.png',
    description: 'Transformer model for gene network analysis and cell state prediction from single-cell data.',
    category: 'Genomics',
    domain: 'Gene Networks',
    downloads: 34000,
    likes: 1900,
    lastModified: '2024-04-15',
    tags: ['gene-networks', 'transformer', 'cell-biology', 'genomics'],
    license: 'Apache 2.0',
    size: '1.8 GB',
    framework: 'PyTorch',
    language: 'Python',
    featured: false,
    trending: true,
    verified: true,
    citations: 2100,
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

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const backgroundY = useTransform(scrollY, [0, 800], [0, -150]);
  
  const springConfig = { stiffness: 260, damping: 30 };
  const heroSpring = useSpring(heroY, springConfig);
  const opacitySpring = useSpring(heroOpacity, { stiffness: 100, damping: 20 });

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
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.downloads - a.downloads;
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
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"
        style={{ y: backgroundY }}
      />
      
      {/* Subtle geometric elements with design system colors */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-[0.04]"
        style={{ 
          top: '5%', 
          left: '10%',
          background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
        animate={{ 
          x: [0, 40, 0], 
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-[0.04]"
        style={{ 
          bottom: '10%', 
          right: '15%',
          background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
          filter: 'blur(70px)'
        }}
        animate={{ 
          x: [0, -35, 0], 
          y: [0, 35, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        {/* Hero Section - "Pastel Bento Tile" style */}
        <motion.div 
          className="text-center mb-16"
          style={{ y: heroSpring, opacity: opacitySpring }}
          variants={heroVariants}
        >
          <motion.div
            className="inline-block bg-primary/10 rounded-full p-3 mb-6 shadow-sm"
            variants={heroVariants}
          >
            <motion.div 
              className="relative flex items-center justify-center bg-primary rounded-full p-2"
              animate={{ rotate: [0, 10, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain size={32} className="text-primary-foreground" />
            </motion.div>
          </motion.div>
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground"
            variants={heroVariants}
          >
            Scientific Models
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4 mb-8 leading-relaxed"
            variants={heroVariants}
          >
            Discover and deploy cutting-edge foundation models with git-based versioning and automated reproducibility verification. Every scientific claim becomes runnable.
          </motion.p>

          {/* Clean Stats Cards following design system */}
          <motion.div
            className="max-w-4xl mx-auto"
            variants={heroVariants}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: Brain, label: 'AI Models', value: models.length },
                { icon: Download, label: 'Downloads', value: models.reduce((sum, m) => sum + m.downloads, 0) },
                { icon: Trophy, label: 'Citations', value: models.reduce((sum, m) => sum + (m.citations || 0), 0) },
                { icon: Verified, label: 'Verified', value: `${models.filter(m => m.verified).length}` }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 + i * 0.05 }}
                  className="group"
                >
                  <Card className="text-center border-border/20 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all duration-300 group-hover:shadow-md rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <stat.icon className={`h-4 w-4 ${i === 0 || i === 2 ? 'text-primary' : 'text-accent'}`} />
                        <span className="text-xl font-semibold text-foreground font-mono">
                          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters - "Soft-UI 2.0" style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-md border border-border/20 mb-8 shadow-sm rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
                  <Input
                    placeholder="Search models, tags, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 h-12 text-base border-border/30 bg-background/50 focus:bg-background/80 focus:ring-2 focus:ring-primary/50 transition-all rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-border/30 h-11 rounded-lg">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger className="border-border/30 h-11 rounded-lg">
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map(domain => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger className="border-border/30 h-11 rounded-lg">
                      <SelectValue placeholder="Framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map(framework => (
                        <SelectItem key={framework} value={framework}>{framework}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Tabs value={viewMode} onValueChange={setViewMode}>
                    <TabsList className="grid w-full grid-cols-2 bg-muted/40 h-11 rounded-lg">
                      <TabsTrigger value="featured" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md">
                        <Flame className="h-4 w-4 mr-1.5" />
                        Featured
                      </TabsTrigger>
                      <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md">
                        <Brain className="h-4 w-4 mr-1.5" />
                        All
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <div className="border-t border-border/20 mt-6 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">
                    {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} found
                  </span>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="flex items-center gap-1.5 bg-primary/10 text-primary border-primary/20 rounded-md px-2.5 py-1 text-xs">
                      <Flame className="h-3.5 w-3.5" />
                      {models.filter(m => m.trending).length} Trending
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1.5 bg-accent/10 text-accent border-accent/20 rounded-md px-2.5 py-1 text-xs">
                      <Verified className="h-3.5 w-3.5" />
                      {models.filter(m => m.verified).length} Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Models Grid - "Pastel Bento" style */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {filteredModels.map((model, index) => (
            <ModelCard
              key={model.id}
              model={{
                name: model.name,
                version: "1.0", // Placeholder
                description: model.description,
                provider: model.author,
                Icon: Bot,
                stars: model.likes,
                forks: model.downloads,
              }}
              variants={itemVariants}
            />
          ))}
        </motion.div>

        {/* Enhanced Empty State */}
        <AnimatePresence>
          {filteredModels.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 150 }}
                className="mb-6"
              >
                <div className="relative inline-block">
                  <Brain className="w-20 h-20 text-muted-foreground/30" />
                  <motion.div
                    className="absolute top-0 right-0 w-5 h-5 bg-primary/20 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
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
                Try adjusting your search or filter criteria to discover new AI models.
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
                  className="bg-background hover:bg-muted/50 border-border/50 rounded-lg"
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
