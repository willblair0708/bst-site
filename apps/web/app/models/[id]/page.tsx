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
    'alphafold-3': {
      id: 'alphafold-3',
      name: 'AlphaFold 3',
      author: 'DeepMind',
      authorAvatar: '/avatars/deepmind.png',
      description: 'Revolutionary protein structure prediction achieving atomic-level accuracy for all life\'s molecules',
      longDescription: `AlphaFold 3 represents a paradigm shift in computational biology, extending far beyond traditional protein folding to encompass the entire molecular universe of life. This groundbreaking model leverages advanced diffusion networks and transformer architectures to predict structures and interactions for proteins, DNA, RNA, ligands, and other biomolecules with unprecedented accuracy.

The model's revolutionary approach combines evolutionary information, physical constraints, and deep learning to achieve near-experimental accuracy across diverse molecular systems. It has been rigorously validated against experimental structures and demonstrates exceptional performance in predicting protein-protein interactions, enzyme-substrate complexes, and drug-target binding sites.

Key innovations include multi-modal training on diverse molecular data, attention mechanisms that capture long-range dependencies, and confidence estimation that enables reliable uncertainty quantification. The model has been trained on millions of experimental structures and validated through extensive benchmarking against crystallographic and cryo-EM data.`,
      category: 'Protein Structure',
      domain: 'Structural Biology',
      downloads: 125000,
      likes: 8420,
      lastModified: '2024-01-15',
      tags: ['protein-folding', 'structural-biology', 'deep-learning', 'molecular-dynamics', 'drug-discovery'],
      license: 'Apache 2.0',
      size: '2.1 GB',
      framework: 'TensorFlow',
      language: 'Python',
      featured: true,
      trending: true,
      verified: true,
      accuracy: 92.5,
      computeReq: 'GPU Required',
      paperUrl: 'https://arxiv.org/abs/2105.13413',
      codeUrl: 'https://github.com/deepmind/alphafold',
      version: '3.0.2',
      citations: 15420,
      reproducibilityScore: 96.8,
      validationTests: 142,
      benchmarkRank: 1,
      requirements: {
        memory: '16 GB RAM',
        gpu: 'NVIDIA V100 or A100',
        storage: '5 GB available space',
        python: '3.8+',
        cuda: '11.0+',
        dependencies: 'TensorFlow 2.8+, NumPy, SciPy'
      },
      metrics: {
        accuracy: '92.5%',
        speed: '0.8 seconds per protein',
        coverage: '98.5% of known proteins',
        confidence: '95.2% high confidence',
        resolution: 'Atomic-level (1.5Å)',
        validation: 'Cross-validated on 10,000+ structures'
      },
      scientificMetrics: {
        gdt_ts: 87.2,
        lddt: 91.5,
        rmsd: 1.8,
        tm_score: 0.92,
        qa_score: 0.89
      },
      useCases: [
        'Drug discovery and development',
        'Protein engineering and design',
        'Understanding disease mechanisms',
        'Enzyme optimization',
        'Structural biology research',
        'Molecular dynamics simulations',
        'Protein-protein interaction prediction',
        'Allosteric site identification'
      ],
      quickStart: `# Install AlphaFold 3
pip install alphafold3

# Basic protein structure prediction
from alphafold3 import predict_structure
import alphafold3.visualization as viz

# Predict structure from sequence
sequence = "MKTVRQERLKSIVRILERSKEPVSGAQLAEELSVSRQVIVQDIAYLRSLGYNIVATPRGYVLAGG"
result = predict_structure(
    sequence=sequence,
    model_type="alphafold3_base",
    confidence_threshold=0.7
)

# Access predictions
structure = result.structure
confidence = result.confidence_scores
coordinates = result.coordinates

# Visualize results
viz.plot_structure(structure, confidence=confidence)
viz.save_pdb(structure, "predicted_structure.pdb")

# Advanced usage with molecular interactions
from alphafold3 import predict_complex

# Predict protein-ligand complex
complex_result = predict_complex(
    protein_sequence=sequence,
    ligand_smiles="CCO",  # ethanol
    interaction_confidence=0.8
)`,
      apiReference: [
        {
          function: 'predict_structure',
          description: 'Predicts the 3D structure of a protein from its amino acid sequence',
          parameters: {
            sequence: 'str - Amino acid sequence in single-letter format',
            model_type: 'str - Model variant (alphafold3_base, alphafold3_large)',
            confidence_threshold: 'float - Minimum confidence threshold (0.0-1.0)',
            output_format: 'str - Output format (pdb, cif, numpy)',
            return_confidence: 'bool - Include per-residue confidence scores'
          },
          returns: 'StructurePrediction object with coordinates, confidence, and metadata'
        },
        {
          function: 'predict_complex',
          description: 'Predicts structures and interactions for molecular complexes',
          parameters: {
            protein_sequence: 'str - Primary protein sequence',
            ligand_smiles: 'str - SMILES representation of ligand',
            interaction_confidence: 'float - Binding site confidence threshold',
            ensemble_size: 'int - Number of conformations to generate'
          },
          returns: 'ComplexPrediction with binding poses, affinities, and interaction maps'
        }
      ],
      changelog: [
        {
          version: '3.0.2',
          date: '2024-01-15',
          changes: [
            'Enhanced membrane protein prediction accuracy by 12%',
            'Added support for modified amino acids and PTMs',
            'Improved GPU memory efficiency for large proteins',
            'Fixed rare convergence issues in diffusion sampling',
            'Updated confidence calibration for small proteins'
          ]
        },
        {
          version: '3.0.1', 
          date: '2024-01-08',
          changes: [
            'Added native support for protein-RNA complexes',
            'Implemented multi-chain prediction pipeline',
            '25% faster inference through kernel optimizations',
            'Enhanced training data with 50,000 new structures',
            'Improved handling of disordered regions'
          ]
        },
        {
          version: '3.0.0',
          date: '2023-12-20',
          changes: [
            'Revolutionary diffusion-based architecture',
            'Support for all biological molecules',
            'Atomic-level accuracy improvements',
            'Real-time confidence estimation',
            'Multi-modal training paradigm'
          ]
        }
      ],
      benchmarks: [
        {
          dataset: 'CASP15',
          metric: 'GDT-TS',
          score: 87.2,
          rank: 1,
          participants: 150
        },
        {
          dataset: 'CAMEO',
          metric: 'lDDT',
          score: 91.5,
          rank: 1,
          participants: 45
        },
        {
          dataset: 'PDB Validation',
          metric: 'TM-Score',
          score: 0.92,
          rank: 1,
          participants: 25
        }
      ],
      relatedModels: [
        {
          id: 'esm-2',
          name: 'ESM-2',
          description: 'Protein language model for sequence analysis',
          similarity: 0.85
        },
        {
          id: 'chemprop',
          name: 'ChemProp',
          description: 'Molecular property prediction',
          similarity: 0.72
        },
        {
          id: 'scbert',
          name: 'scBERT',
          description: 'Single-cell RNA analysis',
          similarity: 0.68
        }
      ]
    },
    'deepchem': {
      id: 'deepchem',
      name: 'DeepChem',
      author: 'DeepChem Team',
      authorAvatar: '/avatars/deepchem.png',
      description: 'Deep learning for drug discovery and quantum chemistry',
      longDescription: `DeepChem represents a comprehensive toolkit for applying deep learning to drug discovery and quantum chemistry. This powerful framework provides a unified interface for molecular machine learning, enabling researchers to build, train, and deploy models for chemical property prediction, drug design, and materials discovery.

The platform integrates state-of-the-art molecular representations, including graph neural networks, transformers, and physics-informed models. DeepChem supports diverse chemical tasks from molecular property prediction to protein-ligand binding affinity estimation, making it an essential tool for computational chemists and drug discovery teams.

Key features include extensive molecular featurization options, pre-trained models for common chemical tasks, and seamless integration with popular machine learning frameworks. The toolkit has been validated across numerous benchmark datasets and deployed in real-world drug discovery pipelines.`,
      category: 'Chemistry',
      domain: 'Drug Discovery',
      downloads: 156000,
      likes: 7800,
      lastModified: '2024-01-14',
      tags: ['deep-learning', 'chemistry', 'drug-discovery', 'quantum', 'molecular-modeling'],
      license: 'MIT',
      size: '300 MB',
      framework: 'TensorFlow',
      language: 'Python',
      featured: false,
      trending: false,
      verified: true,
      accuracy: 87.3,
      computeReq: 'CPU/GPU',
      paperUrl: 'https://arxiv.org/abs/1611.03199',
      codeUrl: 'https://github.com/deepchem/deepchem',
      version: '2.7.1',
      citations: 8900,
      reproducibilityScore: 94.2,
      validationTests: 85,
      benchmarkRank: 3,
      requirements: {
        memory: '8 GB RAM',
        gpu: 'Optional (NVIDIA GTX 1060+)',
        storage: '2 GB available space',
        python: '3.7+',
        cuda: '10.0+ (optional)',
        dependencies: 'TensorFlow 2.4+, RDKit, Scikit-learn'
      },
      metrics: {
        accuracy: '87.3%',
        speed: '100ms per molecule',
        coverage: '95% of chemical space',
        confidence: '92% reliable predictions',
        resolution: 'Molecular-level',
        validation: 'Cross-validated on 50+ datasets'
      },
      scientificMetrics: {
        r2_score: 0.89,
        mae: 0.45,
        rmse: 0.62,
        auroc: 0.91,
        precision: 0.88
      },
      useCases: [
        'Molecular property prediction',
        'Drug-target interaction modeling',
        'ADMET property estimation',
        'Chemical reaction prediction',
        'Materials property prediction',
        'Toxicity assessment',
        'Lead compound optimization',
        'Virtual screening'
      ],
      quickStart: `# Install DeepChem
pip install deepchem

# Basic molecular property prediction
import deepchem as dc
import numpy as np

# Load a molecular dataset
tasks, datasets, transformers = dc.molnet.load_tox21(featurizer='GraphConv')
train_dataset, valid_dataset, test_dataset = datasets

# Create a graph convolutional model
model = dc.models.GraphConvModel(n_tasks=len(tasks), mode='classification')

# Train the model
model.fit(train_dataset, nb_epoch=50)

# Make predictions
predictions = model.predict(test_dataset)

# Evaluate performance
metric = dc.metrics.Metric(dc.metrics.roc_auc_score)
scores = model.evaluate(test_dataset, [metric])
print(f"Test AUC: {scores}")`,
      apiReference: [
        {
          function: 'GraphConvModel',
          description: 'Graph convolutional neural network for molecular property prediction',
          parameters: {
            n_tasks: 'int - Number of prediction tasks',
            graph_conv_layers: 'list - Hidden layer sizes for graph convolution',
            dense_layer_size: 'int - Size of dense layers',
            dropout: 'float - Dropout probability',
            mode: 'str - "classification" or "regression"'
          },
          returns: 'Trained GraphConvModel instance for molecular predictions'
        },
        {
          function: 'load_tox21',
          description: 'Loads the Tox21 toxicity prediction benchmark dataset',
          parameters: {
            featurizer: 'str - Molecular featurization method',
            split: 'str - Dataset splitting strategy',
            reload: 'bool - Whether to reload cached data',
            data_dir: 'str - Directory to store dataset'
          },
          returns: 'Tuple of (tasks, datasets, transformers) for model training'
        }
      ],
      changelog: [
        {
          version: '2.7.1',
          date: '2024-01-14',
          changes: [
            'Added support for transformer-based molecular models',
            'Improved GPU memory efficiency for large molecules',
            'Enhanced molecular featurization with RDKit 2023',
            'Fixed compatibility issues with TensorFlow 2.11',
            'Added new benchmark datasets for materials properties'
          ]
        },
        {
          version: '2.7.0', 
          date: '2023-12-10',
          changes: [
            'Major update with PyTorch backend support',
            'New graph attention networks implementation',
            'Enhanced molecular descriptors library',
            'Improved documentation and tutorials',
            'Performance optimizations for large-scale screening'
          ]
        }
      ],
      benchmarks: [
        {
          dataset: 'Tox21',
          metric: 'ROC-AUC',
          score: 0.91,
          rank: 2,
          participants: 25
        },
        {
          dataset: 'ESOL',
          metric: 'RMSE',
          score: 0.62,
          rank: 1,
          participants: 15
        },
        {
          dataset: 'FreeSolv',
          metric: 'MAE',
          score: 0.45,
          rank: 3,
          participants: 20
        }
      ],
      relatedModels: [
        {
          id: 'chemprop',
          name: 'ChemProp',
          description: 'Message passing neural networks for molecules',
          similarity: 0.92
        },
        {
          id: 'alphafold-3',
          name: 'AlphaFold 3',
          description: 'Protein structure prediction',
          similarity: 0.68
        },
        {
          id: 'esm-2',
          name: 'ESM-2',
          description: 'Protein language model',
          similarity: 0.55
        }
      ]
    },
    'chemprop': {
      id: 'chemprop',
      name: 'ChemProp',
      author: 'MIT CSAIL',
      authorAvatar: '/avatars/mit.png',
      description: 'Molecular property prediction using message passing neural networks',
      longDescription: `ChemProp implements state-of-the-art message passing neural networks (MPNNs) for molecular property prediction. Developed at MIT, this framework has become the gold standard for molecular machine learning, achieving exceptional performance across diverse chemical property prediction tasks.

The model uses directed message passing on molecular graphs, where atoms and bonds are represented as nodes and edges. Through iterative message passing, the network learns rich molecular representations that capture both local chemical environments and global molecular properties. This approach has proven highly effective for predicting ADMET properties, bioactivity, and physicochemical characteristics.

ChemProp's success stems from its principled molecular representation learning, extensive hyperparameter optimization, and robust evaluation protocols. The framework has been validated on hundreds of molecular datasets and is widely used in pharmaceutical research and chemical discovery pipelines.`,
      category: 'Chemistry',
      domain: 'Drug Discovery',
      downloads: 67000,
      likes: 3400,
      lastModified: '2024-01-08',
      tags: ['chemistry', 'drug-discovery', 'molecular-properties', 'mpnn', 'graph-neural-networks'],
      license: 'MIT',
      size: '120 MB',
      framework: 'PyTorch',
      language: 'Python',
      featured: true,
      trending: false,
      verified: true,
      accuracy: 85.7,
      computeReq: 'CPU',
      paperUrl: 'https://arxiv.org/abs/1904.01561',
      codeUrl: 'https://github.com/chemprop/chemprop',
      version: '1.6.1',
      citations: 5200,
      reproducibilityScore: 96.1,
      validationTests: 120,
      benchmarkRank: 2,
      requirements: {
        memory: '4 GB RAM',
        gpu: 'Optional (any CUDA-capable)',
        storage: '1 GB available space',
        python: '3.8+',
        cuda: '11.0+ (optional)',
        dependencies: 'PyTorch 1.12+, RDKit, Scikit-learn'
      },
      metrics: {
        accuracy: '85.7%',
        speed: '50ms per molecule',
        coverage: '98% of drug-like molecules',
        confidence: '94% calibrated predictions',
        resolution: 'Molecular-level',
        validation: 'Cross-validated on 100+ datasets'
      },
      scientificMetrics: {
        r2_score: 0.86,
        mae: 0.38,
        rmse: 0.52,
        pearson_r: 0.91,
        spearman_rho: 0.89
      },
      useCases: [
        'ADMET property prediction',
        'Bioactivity modeling',
        'Physicochemical property estimation',
        'Drug-target interaction prediction',
        'Chemical safety assessment',
        'Lead optimization',
        'Virtual compound screening',
        'Chemical space exploration'
      ],
      quickStart: `# Install ChemProp
pip install chemprop

# Train a molecular property prediction model
from chemprop.train import cross_validate
from chemprop.data import get_data
from chemprop.utils import save_checkpoint

# Prepare data (CSV with SMILES and targets)
args = {
    'data_path': 'molecular_data.csv',
    'dataset_type': 'regression',
    'save_dir': 'model_checkpoints',
    'epochs': 50,
    'hidden_size': 300,
    'depth': 3
}

# Train with cross-validation
mean_score, std_score = cross_validate(args)

# Make predictions on new molecules
from chemprop.train import predict

predictions = predict(
    test_path='new_molecules.csv',
    checkpoint_dir='model_checkpoints',
    preds_path='predictions.csv'
)`,
      apiReference: [
        {
          function: 'cross_validate',
          description: 'Train and evaluate ChemProp models with cross-validation',
          parameters: {
            data_path: 'str - Path to CSV file with SMILES and targets',
            dataset_type: 'str - "regression" or "classification"',
            save_dir: 'str - Directory to save model checkpoints',
            epochs: 'int - Number of training epochs',
            hidden_size: 'int - Hidden layer dimensionality'
          },
          returns: 'Tuple of (mean_score, std_score) for model performance'
        },
        {
          function: 'predict',
          description: 'Make predictions using trained ChemProp models',
          parameters: {
            test_path: 'str - Path to CSV with SMILES for prediction',
            checkpoint_dir: 'str - Directory containing saved models',
            preds_path: 'str - Output path for predictions',
            uncertainty: 'bool - Include prediction uncertainty'
          },
          returns: 'Array of predictions for input molecules'
        }
      ],
      changelog: [
        {
          version: '1.6.1',
          date: '2024-01-08',
          changes: [
            'Added uncertainty quantification via ensemble methods',
            'Improved handling of stereochemistry information',
            'Enhanced molecular descriptors integration',
            'Fixed memory leaks in large-scale prediction',
            'Updated RDKit compatibility to 2023.09'
          ]
        },
        {
          version: '1.6.0', 
          date: '2023-11-15',
          changes: [
            'Major architecture improvements for scalability',
            'Added support for multi-task learning',
            'Improved hyperparameter optimization',
            'Enhanced molecular featurization options',
            'Better integration with popular ML pipelines'
          ]
        }
      ],
      benchmarks: [
        {
          dataset: 'BBBP',
          metric: 'ROC-AUC',
          score: 0.86,
          rank: 1,
          participants: 18
        },
        {
          dataset: 'ClinTox',
          metric: 'ROC-AUC',
          score: 0.89,
          rank: 2,
          participants: 22
        },
        {
          dataset: 'ESOL',
          metric: 'RMSE',
          score: 0.52,
          rank: 2,
          participants: 15
        }
      ],
      relatedModels: [
        {
          id: 'deepchem',
          name: 'DeepChem',
          description: 'Comprehensive chemical machine learning toolkit',
          similarity: 0.92
        },
        {
          id: 'alphafold-3',
          name: 'AlphaFold 3',
          description: 'Protein structure prediction',
          similarity: 0.65
        },
        {
          id: 'esm-2',
          name: 'ESM-2',
          description: 'Protein sequence analysis',
          similarity: 0.58
        }
      ]
    },
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
    },
    'scbert': {
      id: 'scbert',
      name: 'scBERT',
      author: 'TencentAI',
      authorAvatar: '/avatars/tencent.png',
      description: 'Transformer-powered single-cell RNA sequencing analysis with state-of-the-art cell type classification',
      longDescription: `scBERT revolutionizes single-cell RNA sequencing analysis by applying transformer architecture to gene expression data. This pioneering model treats genes as tokens and cells as sequences, enabling the learning of complex gene regulatory patterns and cellular states through self-attention mechanisms.

The model has been trained on millions of single cells across diverse tissues and conditions, learning universal representations of cellular biology. scBERT excels at cell type classification, trajectory inference, and identifying disease-associated cellular states. Its attention-based approach provides interpretable insights into gene regulatory networks and cellular relationships.

Key innovations include the gene-as-token paradigm, position-aware encoding for gene expression levels, and multi-scale attention that captures both local gene interactions and global cellular programs. The model has been validated across numerous single-cell datasets and integrated into computational biology workflows.`,
      category: 'Genomics',
      domain: 'Single Cell Analysis',
      downloads: 45000,
      likes: 2100,
      lastModified: '2024-01-10',
      tags: ['single-cell', 'rna-seq', 'transformer', 'genomics', 'cell-biology'],
      license: 'MIT',
      size: '850 MB',
      framework: 'PyTorch',
      language: 'Python',
      featured: false,
      trending: false,
      verified: true,
      accuracy: 89.2,
      computeReq: 'CPU/GPU',
      paperUrl: 'https://arxiv.org/abs/2106.15253',
      codeUrl: 'https://github.com/TencentAILabHealthcare/scBERT',
      version: '1.2.0',
      citations: 3240,
      reproducibilityScore: 93.5,
      validationTests: 67,
      benchmarkRank: 2,
      requirements: {
        memory: '16 GB RAM',
        gpu: 'Optional (NVIDIA GTX 1080+)',
        storage: '3 GB available space',
        python: '3.8+',
        cuda: '10.2+ (optional)',
        dependencies: 'PyTorch 1.9+, scanpy, anndata'
      },
      metrics: {
        accuracy: '89.2%',
        speed: '5ms per cell',
        coverage: '95% of cell types',
        confidence: '91% reliable classifications',
        resolution: 'Single-cell level',
        validation: 'Cross-validated on 50+ datasets'
      },
      scientificMetrics: {
        f1_score: 0.88,
        precision: 0.90,
        recall: 0.86,
        silhouette_score: 0.72,
        ari_score: 0.79
      },
      useCases: [
        'Cell type classification',
        'Cell state identification',
        'Trajectory inference',
        'Gene regulatory network analysis',
        'Disease biomarker discovery',
        'Drug response prediction',
        'Developmental biology studies',
        'Cancer cell characterization'
      ],
      quickStart: `# Install scBERT
pip install scbert-pytorch

# Basic cell type classification
import scbert
import scanpy as sc
import pandas as pd

# Load single-cell data
adata = sc.read_h5ad('single_cell_data.h5ad')

# Preprocess data
sc.pp.normalize_total(adata, target_sum=1e4)
sc.pp.log1p(adata)

# Initialize scBERT model
model = scbert.scBERT(
    vocab_size=len(adata.var),
    d_model=512,
    nhead=8,
    nlayers=6
)

# Train the model
model.fit(adata, epochs=100, batch_size=32)

# Predict cell types
predictions = model.predict(adata)
adata.obs['predicted_celltype'] = predictions

# Visualize results
sc.pl.umap(adata, color='predicted_celltype')`,
      apiReference: [
        {
          function: 'scBERT',
          description: 'Initialize scBERT transformer model for single-cell analysis',
          parameters: {
            vocab_size: 'int - Number of genes in vocabulary',
            d_model: 'int - Model dimensionality',
            nhead: 'int - Number of attention heads',
            nlayers: 'int - Number of transformer layers',
            dropout: 'float - Dropout probability'
          },
          returns: 'scBERT model instance ready for training or inference'
        },
        {
          function: 'fit',
          description: 'Train scBERT model on single-cell RNA-seq data',
          parameters: {
            adata: 'AnnData - Annotated data object with gene expression',
            epochs: 'int - Number of training epochs',
            batch_size: 'int - Training batch size',
            learning_rate: 'float - Optimizer learning rate'
          },
          returns: 'Trained model with learned cellular representations'
        }
      ],
      changelog: [
        {
          version: '1.2.0',
          date: '2024-01-10',
          changes: [
            'Added support for spatial transcriptomics data',
            'Improved memory efficiency for large datasets',
            'Enhanced cell trajectory inference capabilities',
            'Fixed compatibility with latest scanpy versions',
            'Added pre-trained models for common cell types'
          ]
        },
        {
          version: '1.1.0', 
          date: '2023-09-20',
          changes: [
            'Implemented attention visualization tools',
            'Added batch effect correction methods',
            'Improved model interpretability features',
            'Enhanced integration with existing workflows',
            'Performance optimizations for CPU inference'
          ]
        }
      ],
      benchmarks: [
        {
          dataset: 'PanglaoDB',
          metric: 'F1-Score',
          score: 0.88,
          rank: 2,
          participants: 10
        },
        {
          dataset: 'CellMarker',
          metric: 'Accuracy',
          score: 0.89,
          rank: 1,
          participants: 15
        },
        {
          dataset: 'Tabula Muris',
          metric: 'ARI',
          score: 0.79,
          rank: 3,
          participants: 8
        }
      ],
      relatedModels: [
        {
          id: 'geneformer',
          name: 'Geneformer',
          description: 'Gene network transformer model',
          similarity: 0.89
        },
        {
          id: 'esm-2',
          name: 'ESM-2',
          description: 'Protein sequence modeling',
          similarity: 0.72
        },
        {
          id: 'alphafold-3',
          name: 'AlphaFold 3',
          description: 'Protein structure prediction',
          similarity: 0.65
        }
      ]
    },
    'geneformer': {
      id: 'geneformer',
      name: 'Geneformer',
      author: 'Gladstone Institutes',
      authorAvatar: '/avatars/gladstone.png',
      description: 'Transformer model for gene network analysis and cell state prediction',
      longDescription: `Geneformer pioneers the application of transformer architecture to gene regulatory networks, treating genes as tokens in a sequence and learning the complex dependencies that govern cellular behavior. This innovative model has been trained on vast collections of single-cell data to understand the hierarchical organization of gene expression programs.

The model excels at predicting gene expression changes, identifying regulatory targets, and modeling cellular responses to perturbations. Geneformer's attention mechanisms capture both direct gene interactions and higher-order regulatory modules, providing unprecedented insights into cellular decision-making processes.

Key innovations include rank-based gene encoding, dynamic attention masking for gene regulatory inference, and multi-task learning across diverse cellular contexts. The model has been validated on numerous gene perturbation datasets and successfully applied to drug discovery and cellular reprogramming applications.`,
      category: 'Genomics',
      domain: 'Gene Networks',
      downloads: 34000,
      likes: 1900,
      lastModified: '2024-01-09',
      tags: ['gene-networks', 'transformer', 'cell-biology', 'genomics', 'regulatory-networks'],
      license: 'Apache 2.0',
      size: '1.8 GB',
      framework: 'PyTorch',
      language: 'Python',
      featured: false,
      trending: false,
      verified: true,
      accuracy: 91.8,
      computeReq: 'GPU Recommended',
      paperUrl: 'https://arxiv.org/abs/2305.12023',
      codeUrl: 'https://github.com/gladstoneai/geneformer',
      version: '1.1.2',
      citations: 1850,
      reproducibilityScore: 92.7,
      validationTests: 45,
      benchmarkRank: 4,
      requirements: {
        memory: '12 GB RAM',
        gpu: 'NVIDIA GTX 1660+ (recommended)',
        storage: '4 GB available space',
        python: '3.8+',
        cuda: '11.0+ (optional)',
        dependencies: 'PyTorch 1.11+, transformers, datasets'
      },
      metrics: {
        accuracy: '91.8%',
        speed: '50ms per gene prediction',
        coverage: '92% of human genes',
        confidence: '89% reliable predictions',
        resolution: 'Gene-level',
        validation: 'Validated on perturbation datasets'
      },
      scientificMetrics: {
        pearson_correlation: 0.84,
        mean_absolute_error: 0.23,
        r2_score: 0.81,
        top_k_recall: 0.87,
        enrichment_score: 0.76
      },
      useCases: [
        'Gene regulatory network inference',
        'Perturbation response prediction',
        'Cell state transition modeling',
        'Drug target identification',
        'Pathway analysis',
        'Cellular reprogramming guidance',
        'Disease mechanism discovery',
        'Biomarker identification'
      ],
      quickStart: `# Install Geneformer
pip install geneformer

# Gene network analysis
from geneformer import GeneformerModel, GeneTokenizer
import pandas as pd

# Initialize tokenizer and model
tokenizer = GeneTokenizer()
model = GeneformerModel.from_pretrained("gladstone/geneformer")

# Prepare gene expression data
gene_data = pd.read_csv('expression_data.csv')
tokenized_data = tokenizer(gene_data)

# Predict gene interactions
with torch.no_grad():
    predictions = model(tokenized_data)

# Extract attention weights for network inference
attention_weights = model.get_attention_weights()

# Analyze gene regulatory relationships
network = tokenizer.decode_attention(attention_weights)`,
      apiReference: [
        {
          function: 'GeneformerModel.from_pretrained',
          description: 'Load pre-trained Geneformer model for gene network analysis',
          parameters: {
            model_name: 'str - Pre-trained model identifier',
            device: 'str - Device to load model on',
            torch_dtype: 'torch.dtype - Model precision'
          },
          returns: 'Pre-trained Geneformer model ready for inference'
        },
        {
          function: 'predict_perturbation',
          description: 'Predict cellular response to gene perturbations',
          parameters: {
            gene_expression: 'tensor - Input gene expression profile',
            perturbation_genes: 'list - Genes to perturb',
            perturbation_type: 'str - "knockout", "overexpress", or "knockdown"'
          },
          returns: 'Predicted gene expression changes after perturbation'
        }
      ],
      changelog: [
        {
          version: '1.1.2',
          date: '2024-01-09',
          changes: [
            'Added support for multi-species gene networks',
            'Improved perturbation prediction accuracy',
            'Enhanced model interpretability tools',
            'Fixed memory issues with large gene sets',
            'Added integration with pathway databases'
          ]
        },
        {
          version: '1.1.0', 
          date: '2023-10-15',
          changes: [
            'Implemented dynamic attention masking',
            'Added cell type-specific fine-tuning',
            'Improved gene tokenization strategies',
            'Enhanced downstream task performance',
            'Added visualization tools for gene networks'
          ]
        }
      ],
      benchmarks: [
        {
          dataset: 'PERTURB-seq',
          metric: 'Correlation',
          score: 0.84,
          rank: 1,
          participants: 6
        },
        {
          dataset: 'CRISPRi',
          metric: 'Top-K Recall',
          score: 0.87,
          rank: 2,
          participants: 8
        },
        {
          dataset: 'Drug Response',
          metric: 'R² Score',
          score: 0.81,
          rank: 3,
          participants: 12
        }
      ],
      relatedModels: [
        {
          id: 'scbert',
          name: 'scBERT',
          description: 'Single-cell transformer model',
          similarity: 0.89
        },
        {
          id: 'esm-2',
          name: 'ESM-2',
          description: 'Protein sequence modeling',
          similarity: 0.68
        },
        {
          id: 'alphafold-3',
          name: 'AlphaFold 3',
          description: 'Protein structure prediction',
          similarity: 0.62
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
      <div className="max-w-7xl mx-auto px-6 py-8">
                  {/* Hero Section - Enhanced Design */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* Header with improved spacing and layout */}
          <div className="bg-gradient-to-br from-card/30 to-card/10 border border-border/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex items-start gap-6 flex-1">
                <div className="relative">
                  <Avatar className="h-20 w-20 ring-2 ring-border shadow-xl">
                    <AvatarImage src={model.authorAvatar} alt={model.author} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {model.author.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
            </Avatar>
                  {model.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                      <Verified className="h-3 w-3 text-background" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-foreground">
                        {model.name}
                      </h1>
                      <div className="flex gap-2">
                {model.featured && (
                          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-sm">
                            <Trophy className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                        {model.trending && (
                          <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground border-0 shadow-sm">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                  </Badge>
                )}
            </div>
          </div>
          
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">by</span>
                      <span className="font-semibold text-foreground">{model.author}</span>
                      <span className="text-muted-foreground">•</span>
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        v{model.version}
                      </Badge>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">Updated {new Date(model.lastModified).toLocaleDateString()}</span>
                    </div>
        </div>

                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                    {model.description}
                  </p>
          </div>
          </div>
              
              <div className="lg:ml-8">
                                <ModelActions likes={model.likes} />
          </div>
          </div>
        </div>

          {/* Enhanced Metrics Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Download className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary mb-1">{formatNumber(model.downloads)}</div>
                  <div className="text-xs text-muted-foreground font-medium">Downloads</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="text-center bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:border-accent/30 transition-colors">
                <CardContent className="p-6">
                  <Star className="h-5 w-5 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent mb-1">{formatNumber(model.likes)}</div>
                  <div className="text-xs text-muted-foreground font-medium">Stars</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Trophy className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary mb-1">{formatNumber(model.citations)}</div>
                  <div className="text-xs text-muted-foreground font-medium">Citations</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="text-center bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:border-accent/30 transition-colors">
                <CardContent className="p-6">
                  <BarChart3 className="h-5 w-5 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent mb-1">{model.accuracy}%</div>
                  <div className="text-xs text-muted-foreground font-medium">Accuracy</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="text-center bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20 hover:border-green-500/30 transition-colors">
                <CardContent className="p-6">
                  <Shield className="h-5 w-5 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600 mb-1">{model.reproducibilityScore}%</div>
                  <div className="text-xs text-muted-foreground font-medium">Reproducible</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Target className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary mb-1">#{model.benchmarkRank}</div>
                  <div className="text-xs text-muted-foreground font-medium">Global Rank</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div 
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg transition-all">
              <Play className="h-4 w-4 mr-2" />
              Run Model
            </Button>
            
            <Button variant="outline" size="lg" className="border-border/50 hover:bg-muted/50 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            
            <Button variant="outline" size="lg" className="border-border/50 hover:bg-muted/50 transition-colors">
              <GitFork className="h-4 w-4 mr-2" />
              Fork
            </Button>
            
            <Button variant="outline" size="lg" asChild className="border-border/50 hover:bg-muted/50 transition-colors">
              <Link href={model.codeUrl} target="_blank">
                <Code className="h-4 w-4 mr-2" />
                View Code
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className="border-border/50 hover:bg-muted/50 transition-colors">
              <Link href={model.paperUrl} target="_blank">
                <FileText className="h-4 w-4 mr-2" />
                Read Paper
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
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
              <div className="mb-8">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-card/50 border border-border/50 p-1 rounded-xl backdrop-blur-sm">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                    <Brain className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="quickstart" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                    <Zap className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Quick Start</span>
                  </TabsTrigger>
                  <TabsTrigger value="benchmarks" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                    <Trophy className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Benchmarks</span>
                  </TabsTrigger>
                  <TabsTrigger value="api" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                    <Terminal className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">API Docs</span>
                  </TabsTrigger>
                  <TabsTrigger value="validation" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Validation</span>
                  </TabsTrigger>
                  <TabsTrigger value="changelog" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
                    <Clock className="h-4 w-4 mr-2" />
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
                  <TabsContent value="overview" className="space-y-8">
                    <Card className="bg-gradient-to-br from-card/40 to-card/20 border-border/50 shadow-sm">
                      <CardHeader className="pb-6">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          About This Model
                        </CardTitle>
                </CardHeader>
                <CardContent>
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
                      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 shadow-sm">
                        <CardHeader className="pb-6">
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-accent/10 rounded-lg">
                              <Target className="h-5 w-5 text-accent" />
                            </div>
                            Use Cases
                          </CardTitle>
                </CardHeader>
                <CardContent>
                          <div className="space-y-4">
                            {model.useCases.map((useCase: string, index: number) => (
                              <motion.div 
                                key={index} 
                                className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/30"
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

                      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
                        <CardHeader className="pb-6">
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            Performance Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Object.entries(model.metrics).map(([key, value]: [string, string], index: number) => (
                              <motion.div 
                                key={key} 
                                className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border/30"
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
                    <Card className="bg-card/50 border-border/50">
                <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Quick Start Guide
                        </CardTitle>
                  <CardDescription>Get started with {model.name} in minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                          <div className="relative">
                            <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto border border-border/50">
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
                    <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          Benchmark Results
                        </CardTitle>
                        <CardDescription>Performance across scientific evaluation datasets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                          {model.benchmarks.map((benchmark: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                              <div>
                                <div className="font-medium">{benchmark.dataset}</div>
                                <div className="text-sm text-muted-foreground">{benchmark.metric}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">{benchmark.score}</div>
                                <div className="text-sm text-muted-foreground">
                                  Rank #{benchmark.rank} of {benchmark.participants}
                                </div>
                              </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                    <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="h-5 w-5" />
                          Scientific Metrics
                        </CardTitle>
                  </CardHeader>
                  <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.entries(model.scientificMetrics).map(([key, value]: [string, number]) => (
                            <div key={key} className="text-center p-3 bg-muted/30 rounded-lg border border-border/50">
                              <div className="text-lg font-bold text-accent">{value}</div>
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
                    <Card className="bg-card/50 border-border/50">
                <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Terminal className="h-5 w-5" />
                          API Reference
                        </CardTitle>
                        <CardDescription>Complete API documentation for {model.name}</CardDescription>
                </CardHeader>
                <CardContent>
                        <div className="space-y-6">
                          {model.apiReference.map((api: any, index: number) => (
                            <div key={index} className="border border-border/50 rounded-lg p-4 bg-muted/30">
                              <h4 className="font-mono font-medium mb-2 text-primary">{api.function}()</h4>
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
                    <Card className="bg-card/50 border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Reproducibility & Validation
                        </CardTitle>
                        <CardDescription>Scientific validation and reproducibility metrics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                            <div className="text-2xl font-bold text-accent mb-2">{model.reproducibilityScore}%</div>
                            <div className="text-sm text-muted-foreground">Reproducibility Score</div>
                          </div>
                          <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="text-2xl font-bold text-primary mb-2">{model.validationTests}</div>
                            <div className="text-sm text-muted-foreground">Validation Tests</div>
                          </div>
                          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="text-2xl font-bold text-green-700 mb-2">✓ Verified</div>
                            <div className="text-sm text-muted-foreground">Scientific Review</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="changelog" className="space-y-6">
              <div className="space-y-4">
                      {model.changelog.map((release: any, index: number) => (
                        <Card key={index} className="bg-card/50 border-border/50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Version {release.version}</CardTitle>
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