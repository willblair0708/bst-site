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
    trending: true,
  },
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
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary-100/20 relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-primary-50/20 via-transparent to-accent-50/10"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {/* Hero Section - Refined Astra-Soft style */}
        <motion.div 
          className="text-center mb-12"
          style={{ y: heroSpring, opacity: opacitySpring }}
          variants={heroVariants}
        >
          <motion.div
            className="inline-block bg-gradient-to-br from-primary-100 to-primary-50 rounded-full p-3 mb-4 shadow-soft"
            variants={heroVariants}
          >
            <motion.div 
              className="relative flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 rounded-full p-2 shadow-soft"
              animate={{ rotate: [0, 10, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain size={28} className="text-white" />
            </motion.div>
          </motion.div>
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent"
            variants={heroVariants}
          >
            Scientific Models
          </motion.h1>
          
          <motion.p 
            className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto mt-3 mb-6 leading-relaxed"
            variants={heroVariants}
          >
            Discover and deploy cutting-edge foundation models with git-based versioning and automated reproducibility verification.
          </motion.p>

          {/* Pastel Bento Stats Cards */}
          <motion.div
            className="max-w-3xl mx-auto"
            variants={heroVariants}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: Brain, label: 'AI Models', value: models.length, color: 'primary' },
                { icon: Download, label: 'Downloads', value: models.reduce((sum, m) => sum + m.downloads, 0), color: 'accent' },
                { icon: Trophy, label: 'Citations', value: models.reduce((sum, m) => sum + (m.citations || 0), 0), color: 'purple' },
                { icon: Verified, label: 'Verified', value: `${models.filter(m => m.verified).length}`, color: 'green' }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4, rotate: i % 2 === 0 ? 1 : -1 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300, delay: 0.3 + i * 0.05 }}
                  className="group"
                >
                  <Card className={`text-center bg-gradient-to-br ${
                    stat.color === 'primary' ? 'from-primary-100 via-primary-50 to-white border-primary-200/60 hover:border-primary-300' :
                    stat.color === 'accent' ? 'from-accent-100 via-accent-50 to-white border-accent-200/60 hover:border-accent-300' :
                    stat.color === 'purple' ? 'from-purple-100 via-purple-50 to-white border-purple-200/60 hover:border-purple-300' :
                    'from-green-100 via-emerald-50 to-white border-green-200/60 hover:border-green-300'
                  } transition-all shadow-elevation-1 hover:shadow-elevation-2 rounded-2xl`}>
                    <CardContent className="p-5">
                      <div className={`p-2 rounded-xl mx-auto mb-3 w-fit shadow-soft ${
                        stat.color === 'primary' ? 'bg-primary-500' :
                        stat.color === 'accent' ? 'bg-accent-500' :
                        stat.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                        'bg-gradient-to-br from-green-500 to-emerald-600'
                      }`}>
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className={`text-2xl font-bold mb-1 ${
                        stat.color === 'primary' ? 'text-primary-700' :
                        stat.color === 'accent' ? 'text-accent-700' :
                        stat.color === 'purple' ? 'text-purple-700' :
                        'text-green-700'
                      }`}>
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </div>
                      <div className={`text-xs font-medium ${
                        stat.color === 'primary' ? 'text-primary-600' :
                        stat.color === 'accent' ? 'text-accent-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        'text-green-600'
                      }`}>
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters - Enhanced Astra-Soft style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-primary-50/30 via-white/80 to-accent-50/20 backdrop-blur-md border-2 border-primary-100/60 mb-10 shadow-elevation-2 rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-4">
                <div className="relative max-w-xl mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
                  <Input
                    placeholder="Search models, tags, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 h-12 text-base border-2 border-primary-200/60 bg-white/80 focus:bg-white focus:ring-2 focus:ring-primary-300/50 focus:border-primary-300 transition-all rounded-2xl shadow-soft"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-2 border-primary-200/60 bg-white/80 h-11 rounded-xl shadow-soft hover:shadow-elevation-1 transition-all">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger className="border-2 border-primary-200/60 bg-white/80 h-11 rounded-xl shadow-soft hover:shadow-elevation-1 transition-all">
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map(domain => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger className="border-2 border-primary-200/60 bg-white/80 h-11 rounded-xl shadow-soft hover:shadow-elevation-1 transition-all">
                      <SelectValue placeholder="Framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map(framework => (
                        <SelectItem key={framework} value={framework}>{framework}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Tabs value={viewMode} onValueChange={setViewMode}>
                    <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-accent-50 to-accent-100/50 border-2 border-accent-200/60 h-11 rounded-xl shadow-soft">
                      <TabsTrigger value="featured" className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-500 data-[state=active]:to-accent-600 data-[state=active]:text-white data-[state=active]:shadow-soft rounded-lg transition-all font-medium">
                        <Flame className="h-4 w-4 mr-1.5" />
                        Featured
                      </TabsTrigger>
                      <TabsTrigger value="all" className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-soft rounded-lg transition-all font-medium">
                        <Brain className="h-4 w-4 mr-1.5" />
                        All
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <div className="border-t border-primary-200/30 mt-8 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 text-sm font-medium">
                    {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} found
                  </span>
                  <div className="flex items-center gap-3">
                    <Badge className="flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white border-0 shadow-soft rounded-xl px-3 py-1.5 text-sm font-medium">
                      <Flame className="h-4 w-4" />
                      {models.filter(m => m.trending).length} Trending
                    </Badge>
                    <Badge className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-soft rounded-xl px-3 py-1.5 text-sm font-medium">
                      <Verified className="h-4 w-4" />
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
                  className="bg-white hover:bg-primary-50 border-2 border-primary-200 text-primary-700 hover:text-primary-800 rounded-xl px-6 py-2.5 shadow-soft hover:shadow-elevation-1 transition-all font-medium"
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
