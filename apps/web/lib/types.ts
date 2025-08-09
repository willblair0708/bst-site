export type SafetyTier = 'S0' | 'S1' | 'S2'
export type DataTier = 'Open' | 'Restricted' | 'Regulated'

export type RepoCard = {
  owner: { handle: string; avatarUrl?: string }
  name: string
  slug: string
  shortDesc: string
  domain: string[]
  language: string
  license: string
  badges: {
    runnable: boolean
    verifiedCount: number
    irbReady: boolean
    safetyTier: SafetyTier
    dataTier: DataTier
  }
  stats: { runs30d: number; replications: number; updatedAt: string }
}

export type WorkflowSummary = { id: string; name: string; yamlUri: string }

export type RepoDetail = {
  repo: RepoCard & { defaultBranch: string }
  otp?: {
    protocolPath: string
    baseline: Record<string, unknown>
    envDigest: string
    datasetCards: Array<{ name: string; tier: string; uri: string }>
  }
  workflows: Array<WorkflowSummary>
  latestRuns: Array<{ id: string; status: string; startedAt: string; receiptId?: string }>
}

export type RepoRun = {
  id: string
  repoSlug: string
  workflowId: string
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'canceled'
  startedAt: string
  endedAt?: string
  durationSec?: number
  costUsd?: number
  inputs?: Record<string, unknown>
  receiptId?: string
}

export type FileNode = {
  path: string
  type: 'file' | 'dir'
  size?: number
  children?: FileNode[]
}

export type MissionMetrics = {
  timeToPilotDays: number
  otpRunnablePct: number
  verifiedReproductions30d: number
  asOf: string
}

export type PillarStats = {
  policy: { templatesAdopted: number }
  collaboration: { replications: number }
  research: { activeSDLs: number }
  innovation: { spinouts: number }
}

export type ProgramCard = {
  slug: string
  title: string
  lead: string
  status: 'design' | 'pilot' | 'multisite'
  nextMilestoneAt?: string
  otpSlug?: string
}

export type ImpactCase = {
  id: string
  title: string
  summary: string
  receiptId: string
  cta?: string
}

export type SafetyCard = {
  title: string
  summary: string
  policyUrl?: string
  incidentReportUrl?: string
}

export type Repo = {
  id: string
  owner: string
  name: string
  description?: string
  verified?: boolean
  badges?: string[]
}

export type OTP = {
  id: string
  repoId: string
  protocolPath: string
  environmentLockPath: string
  workflowPath: string
  baselinePath?: string
  provenancePath?: string
  datasetCardPath?: string
}

export type Artifact = {
  id: string
  name: string
  uri?: string
  digest?: string
  mimeType?: string
  type?: 'metric' | 'artifact'
  value?: unknown
}

export type Receipt = {
  run_id: string
  timestamp: string
  user: string
  repo: string
  commit: string
  code_digest: string
  env_digest: string
  sbom?: string
  data_inputs: Array<{ uri: string; digest: string; tier: 'Open' | 'Restricted' | 'Regulated' }>
  params: Record<string, unknown>
  seed?: number
  hardware?: { cpu?: string; gpu?: string | null; ram_gb?: number }
  runner?: { backend: string; image?: string }
  outputs: Artifact[]
  parents?: string[]
  signature?: string
}

export type Run = {
  id: string
  otpId?: string
  receipt: Receipt
  status: 'queued' | 'running' | 'success' | 'failure'
}

export type Dataset = {
  id: string
  name: string
  accessTier: 'Open' | 'Restricted' | 'Regulated'
  description?: string
}

export type Claim = {
  id: string
  text: string
  receipts: string[]
}

export type PolicyObject = {
  id: string
  type: 'IRB' | 'DataUse' | 'SafetyChecklist'
  title: string
  version: string
}


// Model catalog/detail types
export type ModelCard = {
  slug: string
  name: string
  owner: { id: string; handle: string }
  shortDesc: string
  task: string
  modalities: string[]
  domain: string[]
  license: string
  latest: { semver: string; digest: string; updatedAt: string }
  badges: { verifiedRuns: number; safetyTier: 'S0' | 'S1' | 'S2'; dataTier: 'Open' | 'Restricted' | 'Regulated' }
  stats: { runs30d: number; reproductions: number }
}

export type ModelVersion = {
  semver: string
  digest: string
  framework: 'pytorch' | 'jax' | 'tf'
  params: Record<string, any>
  artifactUri: string
  sbomUri: string
  trainingReceiptId?: string
  evalSummary?: { [metric: string]: number }
}

export type ModelDetail = {
  model: ModelCard
  versions: ModelVersion[]
  artifacts?: Array<{ kind: string; uri: string; bytes?: number; digest?: string }>
  evals?: Array<{
    version: string
    benchmark: string
    dataset: string
    split: string
    metric: string
    value: number
    ci_low?: number
    ci_high?: number
    receipt_id?: string
    created_at: string
  }>
  card?: { mdx?: string; json?: Record<string, unknown> }
}

