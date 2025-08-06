# BST Frontend - GitHub for Science

A comprehensive frontend for Biostatistics Simulation Tool (BST) trials, providing a GitHub-like interface for scientific trial management.

## Features

### 🏠 **Trial Overview**
- GitHub-style repository view for trials
- README with study information and quick links
- Real-time trial statistics and progress tracking
- Quick actions sidebar with common tasks
- Compliance status indicators

### 📁 **Files & Documentation**
- File browser for protocols, data, and documentation
- Version-controlled file management
- Protocol editor with YAML validation
- Real-time collaboration on documents
- File history and diff viewing

### 🐛 **Issues & Amendments**
- GitHub-style issue tracking for:
  - Protocol amendments
  - Regulatory feedback
  - Safety events
  - Data quality issues
- Priority levels and status tracking
- Assignment and labeling system
- Comment threads and discussions

### 🔄 **Pull Requests**
- Collaborative protocol change management
- Automated validation and compliance checks
- Review and approval workflows
- Branch-based development for protocols
- Merge conflict resolution

### ⚡ **Actions & Workflows**
- Automated validation pipelines
- Synthetic twin generation
- Compliance checking
- Data quality monitoring
- CI/CD for trial processes

### 📊 **Analytics & Insights**
- Real-time enrollment tracking
- Site performance metrics
- Safety monitoring dashboards
- Demographics analysis
- Synthetic twin validation metrics
- Power analysis visualization

### 📋 **Project Boards**
- Kanban-style project management
- Task tracking and assignment
- Progress visualization
- Timeline management
- Team collaboration tools

### 👥 **People & Teams**
- Investigator management
- Role-based permissions
- Team activity tracking
- Contact information
- Performance metrics

### 📚 **Wiki & Knowledge Base**
- Collaborative documentation
- Protocol guides and SOPs
- Best practices documentation
- Searchable knowledge base
- Version-controlled pages

### ⚙️ **Settings & Compliance**
- Trial configuration management
- Security and access controls
- Data management settings
- Compliance monitoring
- Integration management
- Audit trails

## Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Code Editor**: Monaco Editor
- **YAML Processing**: js-yaml
- **TypeScript**: Full type safety

## File Structure

```
web/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Trial overview
│   │   ├── files/             # File browser
│   │   ├── issues/            # Issue tracking
│   │   ├── pull-requests/     # PR management
│   │   ├── actions/           # Workflows
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── projects/          # Project boards
│   │   ├── people/            # Team management
│   │   ├── wiki/              # Documentation
│   │   ├── settings/          # Configuration
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   │   ├── ui/                # Base UI components
│   │   ├── navigation.tsx     # Main navigation
│   │   ├── trial-dashboard.tsx
│   │   ├── protocol-editor.tsx
│   │   └── git-workflow.tsx
│   └── lib/                   # Utilities
└── package.json
```

## Key Components

### Navigation System
- GitHub-style top navigation with trial context
- Tab-based navigation between major sections
- Contextual breadcrumbs and status indicators

### Protocol Editor
- Monaco-based YAML editor with syntax highlighting
- Real-time validation and error reporting
- Split-view preview mode
- Version control integration

### Trial Dashboard
- Real-time metrics and KPIs
- Enrollment tracking and forecasting
- Safety monitoring alerts
- Synthetic twin generation status

### Issue Tracking
- GitHub-style issue management
- Custom issue types for clinical trials
- Priority and status workflows
- Assignment and notification system

### Analytics Dashboard
- Multi-tab analytics interface
- Interactive charts and visualizations
- Real-time data updates
- Export capabilities

## Installation

1. **Install dependencies**:
   ```bash
   cd web
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## API Integration

The frontend connects to the BST backend through API routes in `/src/app/api/`:

- `/api/dashboard` - Trial metrics and status
- `/api/protocol` - Protocol management
- `/api/simulate` - Synthetic twin generation
- Additional endpoints for full functionality

## Usage

### Getting Started
1. Navigate to the trial overview page to see high-level status
2. Use the file browser to explore protocols and documentation
3. Create issues for amendments or feedback
4. Set up pull requests for collaborative protocol changes
5. Monitor progress through analytics and project boards

### Common Workflows

**Protocol Amendment:**
1. Create issue describing the amendment
2. Create pull request with protocol changes
3. Review and validate changes through automated checks
4. Merge after approval and regulatory review

**Safety Monitoring:**
1. View real-time safety metrics in analytics
2. Create issues for safety events
3. Track resolution through project boards
4. Generate reports through actions/workflows

**Team Collaboration:**
1. Manage team members and permissions in People
2. Use wiki for documentation and SOPs
3. Track activity through project boards
4. Communicate through issue comments

## Security & Compliance

- Multi-factor authentication support
- Role-based access control
- Audit trail logging
- Data encryption at rest and in transit
- Regulatory compliance monitoring
- HIPAA/GCP compliance features

## Customization

The frontend is highly customizable through:
- Theme configuration in Tailwind CSS
- Component composition in React
- API endpoint configuration
- Role and permission customization
- Workflow automation setup

## Support

This frontend provides a complete GitHub-like experience for clinical trial management, enabling:
- Collaborative protocol development
- Real-time trial monitoring
- Regulatory compliance tracking
- Team coordination and communication
- Data-driven decision making

Built with modern web technologies and scientific workflow requirements in mind.