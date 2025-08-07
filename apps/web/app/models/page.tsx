'use client';

import { useState, useMemo } from 'react';
import { 
  Brain,
  Search,
  Filter,
  Star,
  Download,
  Verified,
  Bot
} from 'lucide-react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

// Sample models data
const models = [
  {
    id: 'esm-2',
    name: 'ESM-2',
    author: 'Meta AI',
    description: 'Evolutionary scale modeling for protein sequence analysis and functional annotation.',
    category: 'Protein Analysis',
    domain: 'Computational Biology',
    downloads: 89000,
    stars: 5200,
    verified: true,
    featured: true,
    tags: ['protein-sequences', 'evolution', 'language-model', 'biology'],
    framework: 'PyTorch',
  },
  {
    id: 'alphafold2',
    name: 'AlphaFold 2',
    author: 'DeepMind',
    description: 'Highly accurate protein structure prediction using deep learning.',
    category: 'Protein Structure',
    domain: 'Structural Biology',
    downloads: 125000,
    stars: 8900,
    verified: true,
    featured: true,
    tags: ['protein-structure', 'deep-learning', 'prediction'],
    framework: 'PyTorch',
  },
  {
    id: 'gpt-chem',
    name: 'GPT-Chem',
    author: 'ChemAI Labs',
    description: 'Chemical compound generation and property prediction model.',
    category: 'Chemistry',
    domain: 'Drug Discovery',
    downloads: 34000,
    stars: 2100,
    verified: false,
    featured: false,
    tags: ['chemistry', 'generation', 'properties'],
    framework: 'TensorFlow',
  }
];

const categories = ['All', 'Protein Structure', 'Genomics', 'Chemistry', 'Protein Analysis'];
const frameworks = ['All', 'PyTorch', 'TensorFlow'];

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFramework, setSelectedFramework] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || model.category === selectedCategory;
      const matchesFramework = selectedFramework === 'All' || model.framework === selectedFramework;
      
      return matchesSearch && matchesCategory && matchesFramework;
    });
  }, [searchQuery, selectedCategory, selectedFramework]);



  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted text-xs font-semibold text-muted-foreground mb-3">
            Models
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Brain className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Scientific Models</h1>
          </div>
          <p className="text-muted-foreground text-lg mt-2">
            Discover verified AI models for scientific research
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="flex items-center gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Framework" />
              </SelectTrigger>
              <SelectContent>
                {frameworks.map(framework => (
                  <SelectItem key={framework} value={framework}>{framework}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredModels.length} models found
          </p>
          <div className="flex gap-2">
            <Badge variant="success">
              <Verified className="h-3 w-3 mr-1" />
              {models.filter(m => m.verified).length} Verified
            </Badge>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModels.map((model) => (
            <div key={model.id} className="group rounded-3xl border bg-card shadow-elevation-1 transition-all hover:shadow-elevation-2">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-foreground">{model.name}</h3>
                      <div className="text-xs text-muted-foreground truncate">by {model.author}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full">{model.framework}</Badge>
                    {model.verified && (
                      <Badge variant="success" className="text-[10px] px-2 py-0.5 rounded-full">
                        <Verified className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {model.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span className="font-mono">{model.stars.toLocaleString()}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span className="font-mono">{model.downloads.toLocaleString()}</span>
                    </span>
                  </div>
                  <Link href={`/models/${model.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                    <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-lg">
                      View
                    </Button>
                  </Link>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {model.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5 rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedFramework('All');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
