# 🚀 λ-Trial DSL Setup Guide

## **Quick Start**

### **1. Install bst CLI**

```bash
# From the bst project root directory
cd /path/to/bst
pip install -e .

# Add bst to your PATH (one-time setup)
echo 'export PATH="$HOME/Library/Python/3.11/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### **2. Verify Installation**

```bash
➜ bst --help
Usage: bst [OPTIONS] COMMAND [ARGS]...

  Bastion command-line interface.

Commands:
  add-protocol    Attach or update a protocol file under ./protocol/.
  ci-check        Run CI checks on a protocol (λ-Trial DSL validation).
  init            Scaffold a new Bastion trial repository in the current...
  power-analysis  Run power analysis for a protocol.
  twin-simulate   Generate a synthetic control cohort using protocol...
```

### **3. Create Your First Trial**

```bash
# Create a new directory for your trial
mkdir my-trial && cd my-trial

# Initialize with bst
➜ bst init --indication "NSCLC"
Initialised Bastion repo for NSCLC.

# Check what was created
➜ ls -la
drwxr-xr-x .ctrepo/     # Trial repository marker
drwxr-xr-x protocol/    # Protocol files
drwxr-xr-x schemas/     # Validation schemas
-rw-r--r-- bastion.yaml # Configuration
```

### **4. Add a Protocol**

```bash
# Copy our example protocol
cp /path/to/bst/protocol/enhanced_trial.yaml protocol/

# Add it to version control
➜ bst add-protocol protocol/enhanced_trial.yaml
✓ Schema validation passed
Protocol enhanced_trial.yaml added.
```

### **5. Run CI Checks**

```bash
# Validate your protocol
➜ bst ci-check protocol/enhanced_trial.yaml
✓ Schema validation passed
Power target: 0.8
Diversity badge target: silver
Running twin simulation (n=1500)...
✓ CI checks completed
```

### **6. Power Analysis**

```bash
➜ bst power-analysis protocol/enhanced_trial.yaml
Power Analysis Results:
  Sample size: 450
  Power target: 0.8
  Alpha: 0.05
  Estimated power: 0.847 (simulated)
  ✓ Recommendation: Sample size adequate
```

## **Common Issues**

### **"command not found: bst"**

**Problem**: You're either in the wrong directory or bst isn't in your PATH.

**Solutions**:
1. Make sure you're in the bst project root: `cd /Users/williamblair/bst`
2. Use the full Python module syntax: `python3 -m bst --help`
3. Add Python bin to PATH: `echo 'export PATH="$HOME/Library/Python/3.11/bin:$PATH"' >> ~/.zshrc`

### **"does not appear to be a Python project"**

**Problem**: You're trying to install from the wrong directory.

**Solution**: Make sure you're in the bst project root, not the `web/` subdirectory.

### **Web Development**

The web dashboard runs separately:

```bash
cd web
npm install
npm run dev
# → http://localhost:3004
```

## **Directory Structure**

```
bst/
├── bst/                  # Python CLI package
├── web/                  # Next.js dashboard
├── protocol/             # Example protocols
├── schemas/              # λ-Trial DSL schema
├── examples/             # Amendment prevention examples
└── .github/workflows/    # CI/CD pipeline
```

## **Next Steps**

1. **Create your protocol** using the λ-Trial DSL
2. **Set up CI/CD** with `.github/workflows/protocol-ci.yml`
3. **Integrate with your EDC** using FHIR mappings
4. **Monitor trials** with the web dashboard

**💡 Remember**: The λ-Trial DSL prevents $500k amendment errors by catching them at pull-request time!