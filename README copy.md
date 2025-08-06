# Bastion - GitHub for Clinical Trials

> **Protocol-as-Code Platform for Clinical Trial Management**

Bastion is a comprehensive platform that treats clinical trial protocols like software code, enabling version control, automated testing via digital-twin simulations, collaborative review, and seamless deployment to execution environments.

## 🎯 Overview

Bastion revolutionizes clinical trial management by applying software development best practices to protocol design and execution:

- **Protocol-as-Code**: Version control trial protocols with Git-like workflows
- **Digital Twin Simulation**: Integrate AEGIS simulations in CI/CD pipelines
- **Automated Execution**: Deploy to Vigil OS with one-click deployment
- **Regulatory Compliance**: Built-in 21 CFR Part 11, GDPR, and HIPAA compliance
- **Audit Trails**: Immutable blockchain-verified audit logs
- **Team Collaboration**: Role-based permissions and collaborative review

## 🏗️ Architecture

```
┌────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│  Bastion UI    │<--->│  API & CLI Layer  │<--->│  Core Services  │
│  (Next.js)     │     │  (Node.js/Express)│     │  (Microservices)│
└────────────────┘     └───────────────────┘     └─────────────────┘
        │                        │                         │
        │                        │                         │
        ▼                        ▼                         ▼
┌──────────────┐       ┌────────────────┐         ┌──────────────────┐
│ Git Repos    │       │  Simulation CI  │         │ Execution Engine │
│ (Protocols)  │       │  (AEGIS)       │         │ (Vigil OS)      │
└──────────────┘       └────────────────┘         └──────────────────┘
        │                        │                         │
        │                        │                         │
        ▼                        ▼                         ▼
┌────────────────┐       ┌────────────────┐         ┌────────────────┐
│ Compliance     │       │  Package       │         │  Audit &       │
│ & Validation   │       │  Registry      │         │  Blockchain    │
└────────────────┘       └────────────────┘         └────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)
- Kubernetes cluster (for production)
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/proofos/bastion.git
   cd bastion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development environment**
   ```bash
   docker-compose up -d
   npm run dev
   ```

5. **Access the platform**
   - UI: http://localhost:3001
   - API: http://localhost:3000
   - Grafana: http://localhost:3006

### Production Deployment

1. **Deploy to Kubernetes**
   ```bash
   # Create namespace and deploy
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/
   ```

2. **Install via Helm**
   ```bash
   helm repo add bastion https://charts.bastion.dev
   helm install bastion bastion/bastion-platform
   ```

## 📋 Core Components

### 🔧 Services

| Service | Port | Description |
|---------|------|-------------|
| **API** | 3000 | Core REST API and authentication |
| **UI** | 3001 | React/Next.js frontend application |
| **CLI** | - | Command-line interface for protocol management |
| **Repository Manager** | 3002 | Git-based protocol version control |
| **Simulation CI** | 3003 | AEGIS digital-twin simulation engine |
| **Package Registry** | 3004 | Protocol templates and module registry |
| **Audit Service** | 3005 | Blockchain audit logging |

### 🗄️ Infrastructure

- **PostgreSQL**: Primary database for metadata and audit logs
- **Redis**: Caching and job queues
- **Prometheus**: Metrics collection and monitoring
- **Grafana**: Analytics dashboards and alerting
- **Ganache**: Development blockchain for audit trails

## 🛠️ CLI Usage

### Installation

```bash
npm install -g @bastion/cli
```

### Commands

```bash
# Initialize new protocol repository
bastion init my-trial --phase PHASE_II --type CLINICAL_TRIAL

# Authenticate with platform
bastion auth login

# Validate protocol
bastion validate protocols/

# Run simulation
bastion simulate --type AEGIS_LIGHT --participants 100

# Deploy protocol
bastion deploy --environment staging

# Monitor status
bastion status --watch

# View metrics
bastion metrics --period 7d

# Package management
bastion package search oncology
bastion package install protocol-template-oncology
```

## 📊 Dashboard Features

### Repository Management
- Create and manage protocol repositories
- Branch-based development workflows
- Pull request reviews and approvals
- Collaborative editing and commenting

### Protocol Design
- YAML-based protocol definitions
- Visual protocol designer
- Template library and marketplace
- Validation and compliance checking

### Simulation & Testing
- AEGIS digital-twin integration
- Power analysis and sample size calculation
- Safety signal detection
- Efficacy prediction modeling

### Deployment & Monitoring
- One-click deployment to Vigil OS
- Real-time protocol execution monitoring
- Participant enrollment tracking
- Adverse event reporting

### Analytics & Reporting
- Protocol velocity metrics
- Credibility budget tracking
- Regulatory submission reports
- Audit trail visualization

## 🔐 Security & Compliance

### Built-in Compliance
- **21 CFR Part 11**: Electronic records and signatures
- **GDPR**: Data privacy and right to erasure
- **HIPAA**: Protected health information security
- **GCP**: Good Clinical Practice guidelines

### Security Features
- Multi-factor authentication
- Role-based access control (RBAC)
- End-to-end encryption
- Immutable audit trails
- Blockchain verification

### Audit Capabilities
- Complete action logging
- Tamper-proof records
- Regulatory reporting
- Model card generation
- Version history tracking

## 👥 User Roles

| Role | Permissions | Description |
|------|-------------|-------------|
| **Admin** | Full system access | Platform administration |
| **Data Steward** | Data governance | Data privacy and compliance |
| **Clinical Ops** | Protocol execution | Trial operations management |
| **Biostats** | Analysis and reporting | Statistical analysis and reporting |
| **Researcher** | Protocol design | Protocol development and testing |
| **Regulator** | Audit and review | Regulatory oversight and inspection |
| **Viewer** | Read-only access | Stakeholder visibility |

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/bastion
REDIS_URL=redis://host:6379
JWT_SECRET=your-jwt-secret

# GitHub Integration
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret

# Blockchain
BLOCKCHAIN_ENDPOINT=http://blockchain:8545
BLOCKCHAIN_PRIVATE_KEY=your-private-key

# External Services
VIGIL_OS_ENDPOINT=https://vigil.yourdomain.com
AEGIS_ENDPOINT=https://aegis.yourdomain.com
```

### Protocol Configuration

```yaml
# bastion.yml
name: my-clinical-trial
version: 1.0.0
phase: PHASE_II
type: CLINICAL_TRIAL

settings:
  autoValidation: true
  autoSimulation: false
  requireReview: true

simulation:
  defaultType: AEGIS_LIGHT
  defaultParticipants: 100
  defaultDuration: 90

compliance:
  regulatoryFramework: FDA
  dataPrivacy: HIPAA
  auditRequired: true
```

## 📈 Monitoring

### Metrics

- **Protocol Velocity**: Time from design to deployment
- **Simulation Success Rate**: Digital twin accuracy
- **Compliance Score**: Regulatory adherence metrics
- **Credibility Budget**: Statistical evidence accumulation
- **System Performance**: Infrastructure health

### Alerts

- Protocol validation failures
- Simulation errors
- Security violations
- System performance issues
- Compliance threshold breaches

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Document all public APIs
- Ensure regulatory compliance
- Maintain backward compatibility

## 📚 Documentation

- [API Reference](docs/api.md)
- [CLI Documentation](docs/cli.md)
- [Protocol Schema](docs/schema.md)
- [Deployment Guide](docs/deployment.md)
- [Security Guide](docs/security.md)
- [Compliance Guide](docs/compliance.md)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core platform and API
- ✅ Web UI and CLI
- ✅ Protocol-as-Code workflows
- ✅ Basic simulation integration

### Phase 2 (Q2 2024)
- 🔄 Advanced AEGIS integration
- 🔄 Regulatory submission tools
- 🔄 AI-powered protocol assistance
- 🔄 Real-world evidence integration

### Phase 3 (Q3 2024)
- 📋 Multi-site trial management
- 📋 Patient portal integration
- 📋 Regulatory authority APIs
- 📋 Advanced analytics and ML

### Phase 4 (Q4 2024)
- 📋 Federated trial networks
- 📋 Decentralized protocols
- 📋 Global regulatory harmonization
- 📋 AI-driven trial optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.bastion.dev](https://docs.bastion.dev)
- **Community**: [Discord](https://discord.gg/bastion)
- **Issues**: [GitHub Issues](https://github.com/proofos/bastion/issues)
- **Email**: support@bastion.dev

## 🏢 About ProofOS

Bastion is developed by ProofOS, a company dedicated to accelerating clinical research through innovative technology solutions. Learn more at [proofos.com](https://proofos.com).

---

**"Treating clinical trials like code - because better software leads to better medicine."**