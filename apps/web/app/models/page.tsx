'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "antd";
import { 
  Search, 
  Star, 
  Download,
  Tag,
  Calendar,
  User,
  Code,
  FileText,
  BarChart3,
  Cpu
} from 'lucide-react';
import Link from 'next/link';

// Mock data for scientific models
const models = [
  {
    id: 'alphafold-3',
    name: 'AlphaFold 3',
    author: 'DeepMind',
    authorAvatar: '/avatars/deepmind.png',
    description: 'Highly accurate protein structure prediction for all life\'s molecules',
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
    accuracy: 92.5,
    computeReq: 'GPU Required'
  },
  {
    id: 'scbert',
    name: 'scBERT',
    author: 'TencentAI',
    authorAvatar: '/avatars/tencent.png',
    description: 'Single-cell RNA sequencing analysis using transformer architecture',
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
    accuracy: 89.2,
    computeReq: 'CPU/GPU'
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
  const [sortBy, setSortBy] = useState('downloads');
  const [viewMode, setViewMode] = useState('featured');

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
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Scientific Models
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl">
            Discover and deploy open-source foundation models for scientific research. 
            From protein folding to drug discovery, find the right model for your research.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{models.length}</div>
              <div className="text-sm text-muted-foreground">Models</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatNumber(models.reduce((sum, m) => sum + m.downloads, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">45</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
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

          <div className="flex flex-wrap items-center gap-4">
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="all">All Models</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
                <SelectItem value="recent">Recently Updated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground">
              {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      size={40}
                      src={model.authorAvatar} 
                      alt={model.author}
                    >
                      {model.author.charAt(0)}
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
                        <Tag className="h-4 w-4 text-muted-foreground" />
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
    </div>
  );
}
