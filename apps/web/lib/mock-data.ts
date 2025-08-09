import { RepoCard, RepoDetail, RepoRun, FileNode } from '@/lib/types'

const nowIso = () => new Date().toISOString()

export const mockRepoCards: RepoCard[] = [
  {
    owner: { handle: 'runix', avatarUrl: '/vercel.svg' },
    name: 'oncology-baseline',
    slug: 'runix/oncology-baseline',
    shortDesc: 'Clinical oncology baseline workflow with OTP and receipts',
    domain: ['oncology', 'clinical'],
    language: 'py',
    license: 'Apache-2.0',
    badges: {
      runnable: true,
      verifiedCount: 5,
      irbReady: true,
      safetyTier: 'S1',
      dataTier: 'Restricted',
    },
    stats: { runs30d: 32, replications: 4, updatedAt: nowIso() },
  },
  {
    owner: { handle: 'lab42', avatarUrl: '/next.svg' },
    name: 'materials-synth',
    slug: 'lab42/materials-synth',
    shortDesc: 'Wet-lab protocol for materials synthesis with provenance',
    domain: ['materials'],
    language: 'py',
    license: 'MIT',
    badges: {
      runnable: true,
      verifiedCount: 2,
      irbReady: false,
      safetyTier: 'S0',
      dataTier: 'Open',
    },
    stats: { runs30d: 12, replications: 1, updatedAt: nowIso() },
  },
]

export const mockFileTree: FileNode = {
  path: '/',
  type: 'dir',
  children: [
    { path: '/README.md', type: 'file', size: 2048 },
    { path: '/otp', type: 'dir', children: [
      { path: '/otp/protocol.md', type: 'file', size: 4096 },
      { path: '/otp/environment.lock', type: 'file', size: 1024 },
    ] },
    { path: '/workflows', type: 'dir', children: [
      { path: '/workflows/baseline.yaml', type: 'file', size: 512 },
    ] },
    { path: '/src', type: 'dir', children: [
      { path: '/src/train.py', type: 'file', size: 4096 },
      { path: '/src/utils.py', type: 'file', size: 1024 },
    ] },
  ],
}

export function getRepoDetail(owner: string, name: string): RepoDetail {
  const card = mockRepoCards.find((r) => r.owner.handle === owner && r.name === name)
  const fallback = mockRepoCards[0]
  const repo = card ?? fallback
  return {
    repo: { ...repo, defaultBranch: 'main' },
    otp: {
      protocolPath: '/otp/protocol.md',
      baseline: { epochs: 5, lr: 0.001, batch_size: 32 },
      envDigest: 'sha256:abc123',
      datasetCards: [
        { name: 'MIMIC-III subset', tier: 'Restricted', uri: 's3://datasets/mimic-iii' },
      ],
    },
    workflows: [
      { id: 'w1', name: 'Baseline', yamlUri: '/workflows/baseline.yaml' },
    ],
    latestRuns: [
      { id: 'r3', status: 'succeeded', startedAt: nowIso(), receiptId: 'rcpt-003' },
      { id: 'r2', status: 'failed', startedAt: nowIso(), receiptId: 'rcpt-002' },
      { id: 'r1', status: 'running', startedAt: nowIso() },
    ],
  }
}

export const mockRepoRuns: RepoRun[] = [
  {
    id: 'r3',
    repoSlug: 'runix/oncology-baseline',
    workflowId: 'w1',
    status: 'succeeded',
    startedAt: nowIso(),
    endedAt: nowIso(),
    durationSec: 420,
    costUsd: 1.23,
    inputs: { epochs: 5 },
    receiptId: 'rcpt-003',
  },
  {
    id: 'r2',
    repoSlug: 'runix/oncology-baseline',
    workflowId: 'w1',
    status: 'failed',
    startedAt: nowIso(),
    endedAt: nowIso(),
    durationSec: 300,
    costUsd: 0.87,
    inputs: { epochs: 3 },
    receiptId: 'rcpt-002',
  },
  {
    id: 'r1',
    repoSlug: 'runix/oncology-baseline',
    workflowId: 'w1',
    status: 'running',
    startedAt: nowIso(),
  },
]

import { ImpactCase, MissionMetrics, PillarStats, ProgramCard, SafetyCard } from '@/lib/types'

export const mockMissionMetrics: MissionMetrics = {
  timeToPilotDays: 42,
  otpRunnablePct: 76,
  verifiedReproductions30d: 18,
  asOf: new Date().toISOString(),
}

export const mockPillarStats: PillarStats = {
  policy: { templatesAdopted: 27 },
  collaboration: { replications: 124 },
  research: { activeSDLs: 9 },
  innovation: { spinouts: 2 },
}

export const mockPrograms: ProgramCard[] = [
  {
    slug: 'ai-sepsis-alert',
    title: 'AI Sepsis Alert Pilot',
    lead: 'Cedars-Sinai',
    status: 'pilot',
    nextMilestoneAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    otpSlug: 'cedars/sepsis-alert',
  },
  {
    slug: 'arpa-h-dossier',
    title: 'ARPA-H Proving Ground Dossier',
    lead: 'Consortium',
    status: 'design',
  },
  {
    slug: 'rare-disease-microtrials',
    title: 'Rare Disease Micro-Trials',
    lead: 'Foundations',
    status: 'multisite',
    nextMilestoneAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
]

export const mockImpactCases: ImpactCase[] = [
  {
    id: 'case-1',
    title: 'Sepsis Alert: From Lab Signal to ICU Pilot in 6 Weeks',
    summary:
      'Question: Can an EMR pipeline cut sepsis time-to-antibiotics? Approach: Forked OTP, ICU-specific cohort; Result: 14% faster antibiotics.',
    receiptId: 'rxp_abc123',
    cta: 'Open receipt',
  },
  {
    id: 'case-2',
    title: 'ARPA-H Dossier: SBOM Over PDFs',
    summary:
      'Question: Can a signed OTP replace a 200-page appendix? Approach: Proving-Ground Mode; Result: 35% review-cycle reduction.',
    receiptId: 'rxp_def456',
    cta: 'Open receipt',
  },
  {
    id: 'case-3',
    title: 'N-of-1 Gene Therapy: Pooling Evidence',
    summary:
      'Question: Can micro-trials aggregate? Approach: Reusable OTP + receipts; Result: pooled stats unlocked.',
    receiptId: 'rxp_xyz789',
    cta: 'Open receipt',
  },
]

export const mockSafetyCard: SafetyCard = {
  title: 'Safety & Governance',
  summary:
    'We ship with sIRB templates, export-control tiers, and incident reporting. Every run has a provenance receipt.',
  policyUrl: '/policy',
  incidentReportUrl: '/safety',
}

import { Artifact, Receipt, Repo, Run, ModelCard, ModelDetail, ModelVersion } from './types'

export const mockRepos: Repo[] = [
  {
    id: 'vousso/vitamin-d-outcomes',
    owner: 'vousso',
    name: 'vitamin-d-outcomes',
    description: 'Observational outcomes modeling for Vitamin D supplementation',
    verified: true,
    badges: ['Verified', 'Reproducible']
  },
  {
    id: 'oncology/cox-models',
    owner: 'oncology',
    name: 'cox-models',
    description: 'Cox proportional hazards models for oncology cohorts',
    badges: ['IRB-ready']
  }
]

const demoArtifacts: Artifact[] = [
  { type: 'metric', id: 'm1', name: 'c_index', value: 0.71 },
  { type: 'artifact', id: 'a1', name: 'fig1.png', digest: 'sha256:demo', uri: 's3://bucket/fig1.png' },
]

export const mockReceipt: Receipt = {
  run_id: 'r_01J7X8',
  timestamp: new Date().toISOString(),
  user: 'wblair',
  repo: 'vousso/vitamin-d-outcomes',
  commit: '8f1c2a',
  code_digest: 'sha256:code',
  env_digest: 'sha256:env',
  sbom: 'sha256:sbom',
  data_inputs: [
    { uri: 's3://vousso/ds/ukb/phenos.parquet', digest: 'sha256:ds', tier: 'Restricted' }
  ],
  params: { model: 'cox', covariates: ['age', 'sex', 'bmi'] },
  seed: 1337,
  hardware: { cpu: 'c7i.large', gpu: null, ram_gb: 8 },
  runner: { backend: 'k8s', image: 'ghcr.io/vousso/cox:1.2.0' },
  outputs: demoArtifacts,
  parents: ['r_01J7WZ'],
  signature: 'cosign://demo'
}

export const mockRuns: Run[] = [
  { id: 'r_01J7X8', status: 'success', receipt: mockReceipt },
  { id: 'r_01J7WZ', status: 'success', receipt: { ...mockReceipt, run_id: 'r_01J7WZ', timestamp: new Date(Date.now()-86400000).toISOString() } },
]


// Mock models catalog data
export const mockModelCards: ModelCard[] = [
  {
    slug: 'esm-2',
    name: 'ESM-2',
    owner: { id: 'meta', handle: 'meta-ai' },
    shortDesc: 'Evolutionary scale modeling for protein sequence analysis',
    task: 'sequence-modeling',
    modalities: ['sequence'],
    domain: ['computational-biology'],
    license: 'MIT',
    latest: { semver: '2.0.1', digest: 'sha256:esm2', updatedAt: new Date().toISOString() },
    badges: { verifiedRuns: 5, safetyTier: 'S1', dataTier: 'Restricted' },
    stats: { runs30d: 231, reproductions: 12 },
  },
  {
    slug: 'alphafold-2',
    name: 'AlphaFold 2',
    owner: { id: 'deepmind', handle: 'deepmind' },
    shortDesc: 'Accurate protein structure prediction',
    task: 'structure-prediction',
    modalities: ['sequence', 'structure'],
    domain: ['structural-biology'],
    license: 'Apache-2.0',
    latest: { semver: '2.3.1', digest: 'sha256:af2', updatedAt: new Date(Date.now()-86400000*5).toISOString() },
    badges: { verifiedRuns: 20, safetyTier: 'S1', dataTier: 'Open' },
    stats: { runs30d: 980, reproductions: 55 },
  },
  {
    slug: 'gpt-chem',
    name: 'GPT-Chem',
    owner: { id: 'chemlabs', handle: 'chemlabs' },
    shortDesc: 'Chemical compound generation and property prediction',
    task: 'generation',
    modalities: ['text', 'chem'],
    domain: ['drug-discovery'],
    license: 'RPL-1.5',
    latest: { semver: '0.9.0', digest: 'sha256:gptchem', updatedAt: new Date(Date.now()-86400000*15).toISOString() },
    badges: { verifiedRuns: 0, safetyTier: 'S2', dataTier: 'Regulated' },
    stats: { runs30d: 102, reproductions: 3 },
  },
]

const versionsBySlug: Record<string, ModelVersion[]> = {
  'esm-2': [
    {
      semver: '2.0.1',
      digest: 'sha256:esm2',
      framework: 'pytorch',
      params: { layers: 33, params_b: 0.65 },
      artifactUri: 's3://models/esm2/2.0.1/weights.pt',
      sbomUri: 's3://models/esm2/2.0.1/sbom.json',
      trainingReceiptId: 'r_01J7WZ',
      evalSummary: { 'spearman_rho': 0.73, 'auc_roc': 0.92 },
    },
    {
      semver: '2.0.0',
      digest: 'sha256:esm2-200',
      framework: 'pytorch',
      params: { layers: 33 },
      artifactUri: 's3://models/esm2/2.0.0/weights.pt',
      sbomUri: 's3://models/esm2/2.0.0/sbom.json',
    },
  ],
  'alphafold-2': [
    {
      semver: '2.3.1',
      digest: 'sha256:af2',
      framework: 'jax',
      params: { config: 'monomer' },
      artifactUri: 's3://models/alphafold-2/2.3.1/weights.tar.gz',
      sbomUri: 's3://models/alphafold-2/2.3.1/sbom.json',
    },
  ],
  'gpt-chem': [
    {
      semver: '0.9.0',
      digest: 'sha256:gptchem',
      framework: 'tf',
      params: { size: '1.3B' },
      artifactUri: 's3://models/gpt-chem/0.9.0/weights.safetensors',
      sbomUri: 's3://models/gpt-chem/0.9.0/sbom.json',
    },
  ],
}

export const mockModelDetails: Record<string, ModelDetail> = Object.fromEntries(
  mockModelCards.map((card) => [
    card.slug,
    {
      model: card,
      versions: versionsBySlug[card.slug] ?? [],
      artifacts: (versionsBySlug[card.slug] ?? []).map((v) => ({ kind: 'weights', uri: v.artifactUri, digest: v.digest })),
      evals: [
        {
          version: (versionsBySlug[card.slug] ?? [])[0]?.semver ?? card.latest.semver,
          benchmark: 'ProteinGym',
          dataset: 'ProteinGym',
          split: 'test',
          metric: 'spearman_rho',
          value: 0.73,
          ci_low: 0.71,
          ci_high: 0.75,
          receipt_id: 'r_01J7X8',
          created_at: new Date().toISOString(),
        },
      ],
      card: { json: { intended_use: 'Research only' } },
    },
  ]),
)

