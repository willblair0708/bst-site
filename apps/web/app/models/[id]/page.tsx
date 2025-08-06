import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "antd";
import { 
  Star, 
  Download,
  Tag,
  Calendar,
  User,
  Code,
  FileText,
  BarChart3,
  Cpu,
  Play,
  Copy,
  Share,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { ModelActions } from './model-actions';

// Mock data for individual model
const getModel = (id: string) => {
  const models = {
    'alphafold-3': {
      id: 'alphafold-3',
      name: 'AlphaFold 3',
      author: 'DeepMind',
      authorAvatar: '/avatars/deepmind.png',
      description: 'Highly accurate protein structure prediction for all life\'s molecules',
      longDescription: `AlphaFold 3 represents a significant advancement in protein structure prediction, extending beyond proteins to predict the structure and interactions of all life's molecules with unprecedented accuracy. This model can predict structures for proteins, DNA, RNA, and small molecules, making it invaluable for drug discovery and biological research.

The model uses an improved architecture based on diffusion networks and achieves remarkable accuracy across diverse molecular systems. It has been validated on numerous benchmark datasets and has shown particular strength in predicting protein-protein interactions and protein-ligand binding sites.`,
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
      computeReq: 'GPU Required',
      paperUrl: 'https://arxiv.org/abs/2105.13413',
      codeUrl: 'https://github.com/deepmind/alphafold',
      version: '3.0.2',
      citations: 15420,
      requirements: {
        memory: '16 GB RAM',
        gpu: 'NVIDIA V100 or A100',
        storage: '5 GB available space',
        python: '3.8+'
      },
      metrics: {
        accuracy: 92.5,
        speed: '0.8 seconds per protein',
        coverage: '98.5% of known proteins',
        confidence: '95.2% high confidence'
      },
      useCases: [
        'Drug discovery and development',
        'Protein engineering',
        'Understanding disease mechanisms',
        'Enzyme design',
        'Structural biology research'
      ],
      quickStart: `# Install AlphaFold 3
pip install alphafold3

# Basic usage
from alphafold3 import predict_structure

# Predict protein structure
structure = predict_structure(sequence="MKTVRQERLKSIVRILERSKEPVSGAQLAEELSVSRQVIVQDIAYLRSLGYNIVATPRGYVLAGG")

# Save results
structure.save("output.pdb")`,
      changelog: [
        {
          version: '3.0.2',
          date: '2024-01-15',
          changes: ['Improved accuracy for membrane proteins', 'Bug fixes in preprocessing', 'Enhanced GPU utilization']
        },
        {
          version: '3.0.1', 
          date: '2024-01-08',
          changes: ['Added support for protein-RNA complexes', 'Performance optimizations', 'Updated training data']
        },
        {
          version: '3.0.0',
          date: '2023-12-20',
          changes: ['Major architecture update', 'Diffusion-based prediction', 'Support for small molecules']
        }
      ]
    }
  };

  return models[id as keyof typeof models] || null;
};

interface ModelPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ModelPage({ params }: ModelPageProps) {
  const resolvedParams = await params;
  const model = getModel(resolvedParams.id);

  if (!model) {
    notFound();
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <Avatar 
              size={64}
              src={model.authorAvatar} 
              alt={model.author}
            >
              {model.author.charAt(0)}
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{model.name}</h1>
                {model.featured && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground mb-2">by {model.author}</p>
              <p className="text-muted-foreground max-w-3xl">{model.description}</p>
            </div>
          </div>
          
          <ModelActions likes={model.likes} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{formatNumber(model.downloads)}</div>
            <div className="text-sm text-muted-foreground">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{formatNumber(model.likes)}</div>
            <div className="text-sm text-muted-foreground">Stars</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{formatNumber(model.citations)}</div>
            <div className="text-sm text-muted-foreground">Citations</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{model.accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{model.size}</div>
            <div className="text-sm text-muted-foreground">Model Size</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary">v{model.version}</div>
            <div className="text-sm text-muted-foreground">Version</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button size="lg">
            <Play className="h-4 w-4 mr-2" />
            Run Model
          </Button>
          <Button variant="outline" size="lg">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="lg">
            <Copy className="h-4 w-4 mr-2" />
            Fork
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={model.codeUrl} target="_blank">
              <Code className="h-4 w-4 mr-2" />
              View Code
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={model.paperUrl} target="_blank">
              <FileText className="h-4 w-4 mr-2" />
              Read Paper
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="api">API Docs</TabsTrigger>
              <TabsTrigger value="changelog">Changelog</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {model.longDescription.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {model.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quickstart" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start Guide</CardTitle>
                  <CardDescription>Get started with {model.name} in minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Installation & Usage</h4>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm">{model.quickStart}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(model.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(model.requirements).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>Complete API reference for {model.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg p-4">
                      <h4 className="font-medium mb-2">predict_structure()</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Predicts the 3D structure of a protein from its amino acid sequence.
                      </p>
                      <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                        <code>{`predict_structure(
  sequence: str,
  model_id: str = "alphafold3",
  confidence_threshold: float = 0.7,
  output_format: str = "pdb"
) -> Structure`}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="changelog" className="space-y-6">
              <div className="space-y-4">
                {model.changelog.map((release, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Version {release.version}</CardTitle>
                        <Badge variant="outline">{release.date}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {release.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Model Info */}
          <Card>
            <CardHeader>
              <CardTitle>Model Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <Badge variant="secondary">{model.category}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Domain:</span>
                <span className="font-medium">{model.domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework:</span>
                <span className="font-medium">{model.framework}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language:</span>
                <span className="font-medium">{model.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">License:</span>
                <span className="font-medium">{model.license}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compute:</span>
                <span className="font-medium">{model.computeReq}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">{new Date(model.lastModified).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {model.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Models */}
          <Card>
            <CardHeader>
              <CardTitle>Related Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/models/esm-2" className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="font-medium">ESM-2</div>
                  <div className="text-sm text-muted-foreground">Protein language model</div>
                </Link>
                <Link href="/models/chemprop" className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="font-medium">ChemProp</div>
                  <div className="text-sm text-muted-foreground">Molecular property prediction</div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
