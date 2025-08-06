# Bastion Quickstart Guide

Get up and running with Bastion - the GitHub for Clinical Trials platform - in just 5 steps.

## Overview

Bastion transforms clinical trial protocol development by applying software engineering best practices to clinical research. This guide will help you:

1. Set up your development environment
2. Create your first protocol repository
3. Run digital twin simulations
4. Validate regulatory compliance
5. Deploy to production

## Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **Git** for version control
- **Python** 3.11+ (for statistical analysis)

## Step 1: Environment Setup

### Option A: Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/bastion-platform.git
   cd bastion-platform
   ```

2. **Start the platform:**
   ```bash
   docker-compose up -d
   ```

3. **Verify services are running:**
   ```bash
   docker-compose ps
   ```

   You should see:
   - `bastion-api` (API Server) - http://localhost:3000
   - `bastion-ui` (Web Dashboard) - http://localhost:3001  
   - `bastion-package-registry` - http://localhost:3004
   - `postgres` (Database)
   - `redis` (Cache)
   - `prometheus` (Metrics)
   - `grafana` (Dashboards) - http://localhost:3005

### Option B: Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d postgres redis
   
   # Run database migrations
   cd services/api
   npm run db:migrate
   npm run db:seed
   ```

3. **Start services:**
   ```bash
   # Terminal 1: API Server
   npm run dev:api
   
   # Terminal 2: Web UI
   npm run dev:ui
   
   # Terminal 3: Package Registry
   npm run dev:registry
   ```

## Step 2: Install Bastion CLI

The Bastion CLI is your primary interface for protocol management.

```bash
# Install globally
npm install -g @bastion/cli

# Verify installation
bastion --version
bastion help
```

### Configure CLI

```bash
# Set up authentication (optional for local dev)
bastion auth login

# Configure package registry
bastion config set registry http://localhost:3004
```

## Step 3: Create Your First Protocol

### Initialize a New Protocol Repository

```bash
# Create a new protocol repository
bastion init my-cancer-trial

# Follow the interactive prompts:
# - Trial Name: My Cancer Trial
# - Phase: PHASE_II
# - Type: CLINICAL_TRIAL
# - Template: protocol-template-clinical-trial
# - Description: A Phase II trial for cancer treatment
```

This creates a complete protocol repository with:

```
my-cancer-trial/
├── bastion.yml              # Configuration
├── protocol.yaml            # Main protocol definition
├── protocols/               # Protocol versions
├── analysis/                # Statistical analysis scripts
│   └── power_analysis.py    # Sample size calculations
├── docs/                    # Documentation
├── .github/                 # CI/CD workflows
│   └── workflows/
│       └── bastion-ci.yml   # Automated validation
└── README.md                # Project overview
```

### Explore the Protocol Structure

```bash
cd my-cancer-trial

# View the protocol schema
cat protocol.yaml

# Check configuration
cat bastion.yml
```

## Step 4: Validate and Simulate

### Validate Protocol Compliance

```bash
# Run regulatory validation
bastion validate

# Run with automatic fixes
bastion validate --fix

# View validation results
bastion validate --format json | jq '.'
```

### Run Digital Twin Simulation

```bash
# Run AEGIS light simulation
bastion simulate --local --participants 100 --duration 90

# View simulation results
cat simulation_results.json
cat simulation_results_report.md
```

Example simulation output:
```
🔬 Simulation Results:
   Status: PASSED
   Power: 85%
   AUC: 0.72
   Effect Size: 0.23
   P-value: 0.032

✅ Simulation PASSED (Power ≥ 80%, AUC ≥ 0.6)
```

### Run Statistical Analysis

```bash
# Execute power analysis
python analysis/power_analysis.py --protocol protocol.yaml

# Generate statistical report
python analysis/power_analysis.py --output analysis_report.txt
```

## Step 5: Version Control and CI/CD

### Initialize Git Repository

```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial protocol version"

# Add remote repository
git remote add origin https://github.com/your-org/my-cancer-trial.git
git push -u origin main
```

### Create a Protocol Update

1. **Edit the protocol:**
   ```bash
   # Make changes to protocol.yaml
   vim protocol.yaml
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b update-sample-size
   git add .
   git commit -m "Increase sample size based on simulation results"
   git push origin update-sample-size
   ```

3. **Create a Pull Request:**
   
   The CI/CD pipeline automatically:
   - ✅ Validates protocol schema
   - 🔬 Runs AEGIS simulation
   - 📋 Checks regulatory compliance
   - 📊 Reports metrics and recommendations

4. **Review CI Results:**
   
   Example CI report:
   ```markdown
   # 🧬 Bastion Protocol CI Report
   
   ## 📋 Validation Results
   - ✅ Schema Validation: PASSED
   - 📊 Compliance Score: 95%
   
   ## 🔬 Simulation Results  
   - ✅ AEGIS Simulation: PASSED
   - Power: 87%
   - AUC: 0.74
   
   ## 🎯 Summary
   🎉 Overall Status: READY FOR MERGE
   ```

## Step 6: Deploy to Production

### Validate Deployment

```bash
# Dry-run deployment validation
bastion deploy --dry-run --environment staging

# Check deployment status
bastion status --trial-id my-cancer-trial
```

### Deploy Protocol

```bash
# Deploy to staging
bastion deploy --environment staging

# Deploy to production (after approval)
bastion deploy --environment production
```

## Step 7: Monitor and Manage

### Access Web Dashboard

1. **Open Bastion Dashboard:** http://localhost:3001

2. **Key Features:**
   - 📊 **Dashboard:** Overview of all protocols and simulations
   - 🔬 **Protocols:** Browse and manage protocol repositories  
   - 📈 **Simulations:** View simulation results and metrics
   - 👥 **Teams:** Manage collaborators and permissions
   - 📋 **Audit:** Immutable audit trail with blockchain verification

### Monitor Platform Metrics

1. **Open Grafana:** http://localhost:3005 (admin/admin)

2. **Key Dashboards:**
   - **Bastion Overview:** Platform activity and KPIs
   - **Proof Velocity (Pv):** Time from protocol to deployment  
   - **Control Commons Coverage (CCC):** Reuse of standard components
   - **Simulation Quality:** Power analysis and effect size metrics

### Package Management

```bash
# Browse available packages
bastion package list

# Search for specific packages
bastion package search "oncology"

# Install protocol templates
bastion package install control-arm-placebo --save

# View package information
bastion package info endpoint-analytics-survival
```

## Example Workflows

### Workflow 1: Protocol Development

```bash
# 1. Create repository
bastion init oncology-phase-3 --template oncology-trial

# 2. Install dependencies
bastion package install control-arm-placebo
bastion package install endpoint-analytics-survival

# 3. Customize protocol
vim protocol.yaml

# 4. Validate and simulate
bastion validate --fix
bastion simulate --participants 500 --duration 180

# 5. Commit and push
git add . && git commit -m "Add survival endpoint analysis"
git push origin main
```

### Workflow 2: Collaborative Review

```bash
# 1. Create feature branch
git checkout -b add-biomarker-analysis

# 2. Add biomarker endpoint
bastion package install biomarker-analytics
# Edit protocol to include biomarker endpoints

# 3. Validate changes
bastion validate
bastion simulate --local

# 4. Create pull request
git push origin add-biomarker-analysis
# Open PR in GitHub - CI runs automatically

# 5. Review and merge
# Colleagues review simulation results and compliance
# Automated checks ensure regulatory compliance
```

### Workflow 3: Regulatory Submission

```bash
# 1. Generate compliance report
bastion validate --format json > compliance-report.json

# 2. Run final simulation
bastion simulate --participants 1000 --duration 365 --output final-simulation.json

# 3. Generate audit trail
curl http://localhost:3000/api/audit > audit-trail.json

# 4. Package for submission
tar -czf regulatory-submission.tar.gz \
  protocol.yaml \
  compliance-report.json \
  final-simulation.json \
  audit-trail.json \
  docs/
```

## Troubleshooting

### Common Issues

**1. CLI Authentication Issues:**
```bash
# Clear auth cache
bastion auth logout
bastion auth login
```

**2. Simulation Fails:**
```bash
# Check protocol syntax
bastion validate --format json

# Run with debug mode
bastion simulate --local --debug
```

**3. Docker Services Not Starting:**
```bash
# Check logs
docker-compose logs api

# Restart services
docker-compose restart
```

**4. Database Migration Issues:**
```bash
# Reset database
cd services/api
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Getting Help

- **Documentation:** https://docs.bastion.dev
- **API Reference:** http://localhost:3000/api/docs
- **Community Forum:** https://community.bastion.dev
- **Issue Tracker:** https://github.com/your-org/bastion-platform/issues

## Next Steps

Now that you have Bastion running:

1. **Read the User Guide:** Learn advanced features and best practices
2. **Explore Templates:** Check out the protocol template library
3. **Join the Community:** Connect with other clinical trial developers
4. **Contribute:** Help improve the platform and share your templates

## Configuration Reference

### Environment Variables

```bash
# API Configuration
BASTION_API_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/bastion
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Blockchain
BLOCKCHAIN_ENDPOINT=http://localhost:7545

# Package Registry
PACKAGE_REGISTRY_URL=http://localhost:3004
```

### CLI Configuration

```yaml
# ~/.bastion/config.yml
registry: http://localhost:3004
api_url: http://localhost:3000
auth:
  token: your-auth-token
defaults:
  template: protocol-template-clinical-trial
  phase: PHASE_II
  participants: 100
```

That's it! You now have a fully functional Bastion platform for managing clinical trial protocols as code. 

Happy protocol developing! 🧬✨