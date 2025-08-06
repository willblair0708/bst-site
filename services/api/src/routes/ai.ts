import express from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler, createError } from '../middleware/errorHandler';
import crypto from 'crypto';
import YAML from 'yaml';

const router = express.Router();

// Mock OpenAI-style protocol generation
async function generateProtocolFromPrompt(prompt: string): Promise<any> {
  // In production, this would call OpenAI API with fine-tuned prompts
  // For demo, we'll generate realistic protocols based on prompt analysis
  
  const isOncology = prompt.toLowerCase().includes('oncology') || prompt.toLowerCase().includes('cancer');
  const isCardio = prompt.toLowerCase().includes('cardiovascular') || prompt.toLowerCase().includes('hypertension') || prompt.toLowerCase().includes('blood pressure');
  const isDiabetes = prompt.toLowerCase().includes('diabetes') || prompt.toLowerCase().includes('hba1c');
  
  // Extract parameters from prompt
  const participantsMatch = prompt.match(/(\d+)\s*patients?/i);
  const armsMatch = prompt.match(/(\d+)-?arm/i) || prompt.match(/(\d+)\s*arms?/i);
  const phaseMatch = prompt.match(/phase\s*([IVX]+|[1-4])/i);
  const durationMatch = prompt.match(/(\d+)\s*(weeks?|months?)/i);
  
  const participants = participantsMatch ? parseInt(participantsMatch[1]) : 100;
  const arms = armsMatch ? parseInt(armsMatch[1]) : 2;
  const phase = phaseMatch ? phaseMatch[1].toUpperCase() : 'II';
  const duration = durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : '12 weeks';
  
  // Generate protocol name
  const protocolName = isOncology ? 'oncology-pfs-trial' : 
                      isCardio ? 'cardiovascular-bp-trial' :
                      isDiabetes ? 'diabetes-hba1c-trial' : 'clinical-trial-study';
  
  // Select appropriate template based on domain
  let primaryEndpoint, intervention, population;
  
  if (isOncology) {
    primaryEndpoint = {
      name: 'Progression-Free Survival',
      type: 'time-to-event',
      timepoint: '6 months',
      description: 'Time from randomization to disease progression or death'
    };
    intervention = {
      experimental_arm: {
        name: 'Investigational Oncology Agent',
        type: 'Drug',
        description: 'Novel targeted therapy',
        dosage: '400mg',
        route: 'Oral',
        frequency: 'Once daily'
      }
    };
    population = {
      target_size: participants,
      inclusion_criteria: [
        'Age ≥ 18 years',
        'Histologically confirmed advanced solid tumor',
        'ECOG performance status 0-1',
        'Adequate organ function',
        'Life expectancy ≥ 12 weeks'
      ],
      exclusion_criteria: [
        'Prior systemic therapy within 4 weeks',
        'Active brain metastases',
        'Severe comorbidities',
        'Pregnancy or nursing'
      ]
    };
  } else if (isCardio) {
    primaryEndpoint = {
      name: 'Systolic Blood Pressure Reduction',
      type: 'efficacy',
      timepoint: '12 weeks',
      description: 'Mean change in systolic BP from baseline'
    };
    intervention = {
      experimental_arm: {
        name: 'Antihypertensive Agent',
        type: 'Drug',
        description: 'Novel ACE inhibitor',
        dosage: '10mg',
        route: 'Oral',
        frequency: 'Once daily'
      }
    };
    population = {
      target_size: participants,
      inclusion_criteria: [
        'Age ≥ 18 years and ≤ 75 years',
        'Diagnosis of essential hypertension',
        'SBP 140-179 mmHg',
        'On stable therapy ≥ 3 months'
      ],
      exclusion_criteria: [
        'Secondary hypertension',
        'Severe cardiovascular disease',
        'eGFR < 30 mL/min/1.73m²',
        'Pregnancy or nursing'
      ]
    };
  } else {
    primaryEndpoint = {
      name: 'Primary Efficacy Endpoint',
      type: 'efficacy',
      timepoint: duration,
      description: 'Primary measure of treatment effect'
    };
    intervention = {
      experimental_arm: {
        name: 'Investigational Agent',
        type: 'Drug',
        description: 'Novel therapeutic intervention',
        dosage: 'To be determined',
        route: 'Oral',
        frequency: 'Once daily'
      }
    };
    population = {
      target_size: participants,
      inclusion_criteria: [
        'Age ≥ 18 years',
        'Signed informed consent',
        'Adequate organ function'
      ],
      exclusion_criteria: [
        'Pregnancy or nursing',
        'Severe comorbidities',
        'Active infection'
      ]
    };
  }
  
  // Generate control arm
  const controlArm = {
    name: 'Placebo',
    type: 'Placebo',
    description: 'Matching placebo',
    dosage: 'Matching placebo',
    route: intervention.experimental_arm.route,
    frequency: intervention.experimental_arm.frequency
  };
  
  // Create full protocol structure
  const protocol = {
    apiVersion: 'bastion.dev/v1',
    kind: 'TrialProtocol',
    metadata: {
      name: protocolName,
      version: '1.0.0',
      phase: `PHASE_${phase}`,
      type: 'CLINICAL_TRIAL',
      title: `Phase ${phase} ${isOncology ? 'Oncology' : isCardio ? 'Cardiovascular' : 'Clinical'} Trial`,
      description: `Generated from prompt: ${prompt.substring(0, 100)}...`,
      sponsor: 'AI Generated Sponsor',
      principalInvestigator: {
        name: 'Dr. AI Principal Investigator',
        email: 'pi@example.com',
        affiliation: 'Research Institution'
      },
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    spec: {
      design: {
        type: 'Randomized Controlled Trial',
        allocation: 'Randomized',
        intervention_model: 'Parallel Assignment',
        primary_purpose: 'Treatment',
        masking: 'Double Blind (Subject, Investigator)',
        enrollment_type: 'Actual',
        randomization_ratio: arms === 2 ? '1:1' : '1:1:1'
      },
      population,
      objectives: {
        primary: `To evaluate the efficacy and safety of investigational agent compared to placebo`,
        secondary: [
          'To assess safety and tolerability',
          'To evaluate pharmacokinetics',
          'To assess quality of life'
        ]
      },
      intervention: {
        experimental_arm: intervention.experimental_arm,
        control_arm: controlArm
      },
      endpoints: {
        primary: primaryEndpoint,
        secondary: [
          {
            name: 'Safety Profile',
            type: 'safety',
            timepoint: 'Throughout study',
            description: 'Incidence of adverse events'
          },
          {
            name: 'Quality of Life',
            type: 'patient_reported',
            timepoint: 'Every 4 weeks',
            description: 'Patient-reported outcomes'
          }
        ]
      },
      statistics: {
        design_type: 'Superiority',
        alpha_level: 0.05,
        power: 0.80,
        sample_size_calculation: {
          primary_endpoint: primaryEndpoint.name,
          control_rate: isOncology ? 0.30 : 0.20,
          experimental_rate: isOncology ? 0.50 : 0.40,
          effect_size: 0.20,
          calculated_n: Math.floor(participants * 0.9),
          dropout_rate: 0.15,
          final_n: participants
        }
      }
    },
    compliance: {
      regulatory_framework: 'FDA',
      ethics_approval_required: true,
      informed_consent_required: true,
      data_privacy_framework: 'HIPAA',
      good_clinical_practice: true
    }
  };
  
  return {
    name: protocolName,
    yaml: YAML.stringify(protocol),
    metadata: {
      arms,
      participants,
      phase: `Phase ${phase}`,
      duration
    }
  };
}

// Generate protocol from natural language
router.post('/generate-protocol', [
  body('prompt').isString().isLength({ min: 10 }),
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid prompt', errors: errors.array() });
  }

  const { prompt } = req.body;

  try {
    // Add small delay to simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const protocol = await generateProtocolFromPrompt(prompt);
    
    // Log the generation for audit
    console.log(`AI Protocol Generated: ${protocol.name} from prompt: "${prompt.substring(0, 50)}..."`);
    
    res.json({
      success: true,
      protocol,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Protocol generation error:', error);
    res.status(500).json({ error: 'Failed to generate protocol' });
  }
}));

// Run AEGIS simulation on generated protocol
router.post('/run-simulation', [
  body('protocol').isString().isLength({ min: 100 }),
  body('protocolName').isString().isLength({ min: 1 })
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid simulation request', errors: errors.array() });
  }

  const { protocol, protocolName } = req.body;

  try {
    // Parse protocol to extract parameters
    const protocolData = YAML.parse(protocol);
    const participants = protocolData.spec?.population?.target_size || 100;
    const controlRate = protocolData.spec?.statistics?.sample_size_calculation?.control_rate || 0.2;
    const experimentalRate = protocolData.spec?.statistics?.sample_size_calculation?.experimental_rate || 0.4;
    
    // Add delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run Monte Carlo simulation (simplified version)
    const nSims = 1000;
    let significantResults = 0;
    const effectSizes: number[] = [];
    
    for (let i = 0; i < nSims; i++) {
      // Generate binomial data
      const controlEvents = Math.random() < controlRate ? 1 : 0;
      const treatmentEvents = Math.random() < experimentalRate ? 1 : 0;
      
      const effectSize = treatmentEvents - controlEvents;
      effectSizes.push(effectSize);
      
      // Simple significance test
      if (Math.abs(effectSize) > 0.1) {
        significantResults++;
      }
    }
    
    const power = significantResults / nSims;
    const meanEffect = effectSizes.reduce((a, b) => a + b, 0) / effectSizes.length;
    
    // Calculate AUC (simulated biomarker performance)
    const auc = 0.5 + (Math.abs(experimentalRate - controlRate) * 1.2) + (Math.random() - 0.5) * 0.15;
    const finalAuc = Math.max(0.5, Math.min(1.0, auc));
    
    // Determine pass/fail
    const passed = power >= 0.8 && finalAuc >= 0.6;
    
    const simulation = {
      id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: passed ? 'passed' : 'failed',
      metrics: {
        power: Math.max(0.6, Math.min(0.95, power)),
        auc: finalAuc,
        effectSize: Math.abs(meanEffect),
        dropoutRate: 0.1 + Math.random() * 0.1
      },
      recommendations: generateRecommendations(power, finalAuc, participants)
    };

    console.log(`Simulation completed for ${protocolName}: ${simulation.status}`);

    res.json({
      success: true,
      simulation,
      completedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Failed to run simulation' });
  }
}));

// Deploy protocol to Vigil OS (stub)
router.post('/deploy-protocol', [
  body('protocol').isString().isLength({ min: 100 }),
  body('simulation').isObject()
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid deployment request', errors: errors.array() });
  }

  const { protocol, simulation } = req.body;

  try {
    // Parse protocol to get name
    const protocolData = YAML.parse(protocol);
    const protocolName = protocolData.metadata?.name || 'unknown-trial';
    
    // Add delay to simulate deployment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate trial ID
    const trialId = `TRL-${Date.now().toString().slice(-6)}`;
    
    // Simulate deployment to Vigil OS
    const deployment = {
      trialId,
      status: 'scheduled',
      vigilOsUrl: `https://vigil-os.example.com/trials/${trialId}`,
      deployedAt: new Date().toISOString(),
      protocol: protocolName
    };

    console.log(`Protocol deployed: ${trialId} for ${protocolName}`);

    res.json({
      success: true,
      deployment,
      message: `Trial ${trialId} successfully scheduled on Vigil OS`
    });

  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({ error: 'Failed to deploy protocol' });
  }
}));

// Generate audit hash for blockchain
router.post('/generate-audit', [
  body('protocol').isString().isLength({ min: 100 }),
  body('simulation').isObject(),
  body('userPrompt').isString()
], asyncHandler(async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid audit request', errors: errors.array() });
  }

  const { protocol, simulation, userPrompt } = req.body;

  try {
    // Create audit data
    const auditData = {
      timestamp: new Date().toISOString(),
      userPrompt: userPrompt.substring(0, 500), // Truncate for hash
      protocolHash: crypto.createHash('sha256').update(protocol).digest('hex'),
      simulationResult: simulation.status,
      simulationMetrics: simulation.metrics,
      action: 'ai_protocol_generation'
    };
    
    // Generate Merkle hash
    const merkleHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(auditData))
      .digest('hex');
    
    // In production, this would be stored on blockchain
    console.log(`Audit hash generated: ${merkleHash.substring(0, 16)}...`);

    res.json({
      success: true,
      merkleHash,
      auditData: {
        timestamp: auditData.timestamp,
        action: auditData.action
      }
    });

  } catch (error) {
    console.error('Audit generation error:', error);
    res.status(500).json({ error: 'Failed to generate audit hash' });
  }
}));

function generateRecommendations(power: number, auc: number, participants: number): string[] {
  const recommendations: string[] = [];
  
  if (power < 0.8) {
    recommendations.push(`Consider increasing sample size to achieve adequate power (≥80%). Current: ${(power * 100).toFixed(1)}%`);
  }
  
  if (auc < 0.6) {
    recommendations.push('Biomarker performance below threshold - consider alternative endpoints or stratification');
  }
  
  if (participants < 50) {
    recommendations.push('Small sample size may limit generalizability - consider multi-site enrollment');
  }
  
  if (power >= 0.8 && auc >= 0.6) {
    recommendations.push('Trial design appears robust - ready for regulatory submission');
    recommendations.push('Consider adaptive design elements for efficiency optimization');
  }
  
  recommendations.push('Implement interim analysis at 50% enrollment for futility assessment');
  recommendations.push('Ensure adequate safety monitoring and data quality measures');
  
  return recommendations;
}

export default router;