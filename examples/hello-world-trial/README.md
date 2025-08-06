# Hello World Clinical Trial

A simple example protocol repository to demonstrate Bastion platform capabilities.

## Overview

This is a basic Phase II clinical trial protocol for demonstrating the Bastion "GitHub for Clinical Trials" platform. It includes:

- 📋 **Complete Protocol Definition** - YAML-based protocol specification
- 🔬 **Digital Twin Simulation** - AEGIS simulation configuration
- 📊 **Statistical Analysis** - Power analysis and sample size calculations
- ✅ **Regulatory Compliance** - Built-in validation and audit trails
- 🚀 **CI/CD Integration** - Automated testing and deployment

## Quick Start

### Prerequisites

- [Bastion CLI](https://github.com/your-org/bastion-platform) installed
- Node.js 18+ and Python 3.11+
- Docker (optional, for local development)

### 1. Clone and Explore

```bash
# Clone this repository
git clone https://github.com/your-org/hello-world-trial.git
cd hello-world-trial

# Explore the structure
ls -la
cat protocol.yaml
```

### 2. Validate Protocol

```bash
# Check protocol compliance
bastion validate

# Run with automatic fixes
bastion validate --fix
```

### 3. Run Simulation

```bash
# Run digital twin simulation
bastion simulate --local --participants 50 --duration 60

# View results
cat simulation_results_report.md
```

### 4. Statistical Analysis

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run power analysis
python analysis/power_analysis.py --protocol protocol.yaml
```

## Protocol Details

### Study Design

- **Phase:** Phase II
- **Type:** Randomized, Double-Blind, Placebo-Controlled
- **Population:** Adults with mild hypertension
- **Sample Size:** 50 participants (25 per arm)
- **Duration:** 8 weeks treatment + 4 weeks follow-up
- **Primary Endpoint:** Change in systolic blood pressure from baseline

### Randomization

- **Ratio:** 1:1 (Treatment:Placebo)
- **Stratification:** Age (<65, ≥65 years)
- **Allocation:** Computer-generated randomization

### Treatment Arms

1. **Experimental Arm:** Investigational antihypertensive agent 10mg daily
2. **Control Arm:** Matching placebo daily

### Key Endpoints

- **Primary:** Mean change in systolic BP from baseline to Week 8
- **Secondary:** 
  - Mean change in diastolic BP
  - Proportion achieving target BP (<140/90 mmHg)
  - Safety and tolerability
  - Quality of life measures

## Files and Structure

```
hello-world-trial/
├── README.md                    # This file
├── protocol.yaml               # Complete protocol definition
├── bastion.yml                 # Bastion configuration
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
├── .github/
│   └── workflows/
│       └── bastion-ci.yml      # CI/CD pipeline
├── analysis/
│   ├── power_analysis.py       # Statistical analysis
│   └── data_analysis_plan.md   # Analysis plan
├── docs/
│   ├── protocol_summary.md     # Protocol summary
│   ├── consent_form.md         # Sample consent form
│   └── investigator_guide.md   # Site guidance
└── scripts/
    ├── randomization.py        # Randomization scripts
    └── data_validation.py      # Data quality checks
```

## Expected Results

When you run the simulation, you should see output like:

```
🔬 Simulation Results:
   Protocol: Hello World Trial
   Type: AEGIS_LIGHT
   Participants: 50
   Duration: 60 days
   Status: PASSED

📊 Key Metrics:
   Power: 82.3%
   Effect Size: 0.45
   P-value: 0.024
   AUC: 0.67

✅ Result: PASS (AUC >= 0.6)

📋 Recommendations:
- Trial design appears robust - ready for regulatory submission
- Consider interim analysis at 50% enrollment for futility
```

## Customization

### Modify Sample Size

Edit `protocol.yaml`:

```yaml
spec:
  population:
    target_size: 100  # Change from 50 to 100
    enrollment_cap: 120
```

Then re-run validation and simulation:

```bash
bastion validate
bastion simulate --local
```

### Add Biomarker Endpoints

1. Install biomarker package:
   ```bash
   bastion package install biomarker-analytics
   ```

2. Update protocol endpoints:
   ```yaml
   spec:
     endpoints:
       secondary:
         - name: "Inflammatory Biomarkers"
           type: "biomarker"
           timepoint: "Baseline, Week 4, Week 8"
           description: "Changes in CRP, IL-6, TNF-alpha"
   ```

### Configure for Different Populations

```yaml
spec:
  population:
    inclusion_criteria:
      - "Age ≥ 18 years and ≤ 80 years"
      - "Diagnosis of essential hypertension"
      - "SBP 140-179 mmHg and DBP 90-109 mmHg"
      - "On stable antihypertensive therapy for ≥ 3 months"
    
    exclusion_criteria:
      - "Secondary hypertension"
      - "Severe cardiovascular disease"
      - "Pregnancy or nursing"
      - "eGFR < 30 mL/min/1.73m²"
```

## Next Steps

### Learn More

1. **Read the Full Documentation:** [Bastion Docs](https://docs.bastion.dev)
2. **Try Advanced Features:** Package management, team collaboration
3. **Explore Templates:** Browse the protocol template library
4. **Join the Community:** Connect with other clinical trial developers

### Extend This Example

- Add adaptive design elements
- Include pharmacokinetic sampling
- Implement electronic patient-reported outcomes
- Add multi-site coordination features

### Deploy to Production

```bash
# Validate for production deployment
bastion deploy --dry-run --environment production

# Deploy when ready
bastion deploy --environment production
```

## Contributing

Found an issue or want to improve this example? Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This example is licensed under MIT License. See LICENSE file for details.

## Support

- 📚 **Documentation:** https://docs.bastion.dev
- 💬 **Community:** https://community.bastion.dev  
- 🐛 **Issues:** https://github.com/your-org/bastion-platform/issues

---

**Ready to revolutionize clinical trial development?** Start building with Bastion today! 🚀