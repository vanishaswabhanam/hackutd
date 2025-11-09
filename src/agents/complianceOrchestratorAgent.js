// Compliance Orchestrator Agent - Assesses regulatory and security compliance

import messageBus from '../services/messageBus.js';
import { callAgent } from '../services/nvidiaService.js';

/**
 * Compliance Orchestrator Agent assesses compliance with security and regulatory requirements
 * @param {object} vendorData - Vendor submission data
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<object>} - Compliance assessment results
 */
export const complianceOrchestratorAgent = async (vendorData, vendorId) => {
  const findings = [];
  const riskIndicators = [];
  const complianceGaps = [];
  let score = 100;

  // Check for security certifications
  const certifications = (vendorData.certifications || '').toLowerCase();
  const servicesDescription = (vendorData.servicesDescription || '').toLowerCase();
  
  // Key certifications to look for
  const certificationChecks = [
    { name: 'SOC 2', keywords: ['soc 2', 'soc2', 'soc ii'], importance: 'high' },
    { name: 'ISO 27001', keywords: ['iso 27001', 'iso27001'], importance: 'high' },
    { name: 'PCI DSS', keywords: ['pci', 'pci dss', 'pci-dss'], importance: 'medium' },
    { name: 'HIPAA', keywords: ['hipaa', 'health insurance portability'], importance: 'high' },
    { name: 'GDPR', keywords: ['gdpr', 'general data protection'], importance: 'medium' },
    { name: 'FedRAMP', keywords: ['fedramp', 'fed ramp'], importance: 'medium' }
  ];

  const foundCertifications = [];
  certificationChecks.forEach(cert => {
    const hasCert = cert.keywords.some(keyword => 
      certifications.includes(keyword) || servicesDescription.includes(keyword)
    );
    
    if (hasCert) {
      foundCertifications.push(cert.name);
      findings.push(`✓ ${cert.name} certification claimed`);
    }
  });

  if (foundCertifications.length === 0) {
    score -= 20;
    complianceGaps.push('No security certifications provided');
    findings.push('⚠️ No recognized security certifications (SOC 2, ISO 27001, etc.)');
    
    messageBus.agentFinding(
      'Compliance Orchestrator Agent',
      'No security certifications detected',
      'warning',
      vendorId
    );
  } else {
    findings.push(`Found ${foundCertifications.length} security certification(s): ${foundCertifications.join(', ')}`);
  }

  // Industry-specific compliance requirements
  const industryIndicators = {
    healthcare: ['health', 'medical', 'patient', 'hipaa', 'clinical'],
    financial: ['financial', 'banking', 'payment', 'transaction', 'money'],
    government: ['government', 'federal', 'state', 'public sector', 'fedramp'],
    ecommerce: ['ecommerce', 'e-commerce', 'payment', 'credit card', 'shopping']
  };

  let detectedIndustry = 'general';
  let industryRequirements = [];

  Object.entries(industryIndicators).forEach(([industry, keywords]) => {
    if (keywords.some(keyword => servicesDescription.includes(keyword))) {
      detectedIndustry = industry;
      
      switch (industry) {
        case 'healthcare':
          industryRequirements = ['HIPAA compliance', 'BAA agreement', 'Patient data encryption'];
          if (!foundCertifications.includes('HIPAA')) {
            score -= 25;
            complianceGaps.push('HIPAA compliance required but not demonstrated');
            
            messageBus.agentMessage(
              'Compliance Orchestrator Agent',
              'Risk Synthesizer Agent',
              'Healthcare services detected but no HIPAA compliance - HIGH RISK',
              'high',
              vendorId
            );
          }
          break;
          
        case 'financial':
          industryRequirements = ['PCI DSS', 'SOC 2 Type II', 'Data encryption', 'Audit logs'];
          if (!foundCertifications.includes('SOC 2') && !foundCertifications.includes('ISO 27001')) {
            score -= 20;
            complianceGaps.push('Financial services require SOC 2 or ISO 27001');
          }
          break;
          
        case 'government':
          industryRequirements = ['FedRAMP authorization', 'FISMA compliance', 'US data residency'];
          if (!foundCertifications.includes('FedRAMP')) {
            score -= 15;
            complianceGaps.push('Government contracts typically require FedRAMP');
          }
          break;
          
        case 'ecommerce':
          industryRequirements = ['PCI DSS', 'Payment security', 'TLS encryption'];
          if (!foundCertifications.includes('PCI DSS')) {
            score -= 15;
            complianceGaps.push('E-commerce handling requires PCI DSS compliance');
          }
          break;
      }
    }
  });

  if (detectedIndustry !== 'general') {
    findings.push(`Industry detected: ${detectedIndustry.toUpperCase()}`);
    findings.push(`Required compliance: ${industryRequirements.join(', ')}`);
  }

  // Insurance assessment
  const insurance = vendorData.insuranceInfo || vendorData.insurance || '';
  if (!insurance || insurance.toLowerCase().includes('none')) {
    score -= 15;
    complianceGaps.push('No liability insurance');
    findings.push('⚠️ No liability insurance - may not meet procurement requirements');
  } else {
    // Check for cyber liability insurance
    if (insurance.toLowerCase().includes('cyber')) {
      findings.push('✓ Cyber liability insurance noted');
    } else {
      score -= 5;
      findings.push('Note: Cyber liability insurance not explicitly mentioned');
    }
  }

  // Data handling assessment
  const dataKeywords = ['data', 'information', 'personal', 'customer', 'user'];
  const handlesData = dataKeywords.some(keyword => servicesDescription.includes(keyword));
  
  if (handlesData) {
    findings.push('Vendor services involve data handling');
    
    // Check for data privacy policies
    if (!certifications.includes('gdpr') && !certifications.includes('privacy')) {
      score -= 10;
      complianceGaps.push('Data handling requires privacy compliance (GDPR, CCPA)');
      
      messageBus.agentMessage(
        'Compliance Orchestrator Agent',
        'Privacy Guardian Agent',
        'Vendor handles data but no privacy compliance mentioned',
        'medium',
        vendorId
      );
    }
  }

  // Security controls assessment
  const securityControls = {
    encryption: ['encryption', 'encrypted', 'aes', 'tls', 'ssl'],
    accessControl: ['access control', 'authentication', 'authorization', 'mfa', '2fa'],
    monitoring: ['monitoring', 'logging', 'audit', 'siem'],
    backup: ['backup', 'disaster recovery', 'business continuity']
  };

  const mentionedControls = [];
  Object.entries(securityControls).forEach(([control, keywords]) => {
    if (keywords.some(keyword => 
      servicesDescription.includes(keyword) || certifications.includes(keyword)
    )) {
      mentionedControls.push(control);
    }
  });

  if (mentionedControls.length > 0) {
    findings.push(`Security controls mentioned: ${mentionedControls.join(', ')}`);
  } else {
    score -= 15;
    complianceGaps.push('No specific security controls mentioned');
    findings.push('⚠️ No security controls or practices described');
  }

  // AI-powered compliance analysis
  try {
    const systemPrompt = `You are a Compliance and Security Assessment specialist.

Analyze vendor compliance posture and identify regulatory gaps.

Return JSON with this structure:
{
  "findings": ["finding 1", "finding 2"],
  "riskIndicators": ["risk 1"],
  "score": <number 0-100>,
  "confidence": "high" | "medium" | "low",
  "complianceGaps": ["gap 1", "gap 2"],
  "recommendations": ["rec 1", "rec 2"]
}`;

    const userPrompt = `Assess compliance for this vendor:

Company: ${vendorData.companyName}
Business Type: ${vendorData.businessType || 'Not specified'}
Services: ${vendorData.servicesDescription || 'Not specified'}
Certifications: ${certifications || 'None provided'}
Insurance: ${insurance || 'None'}
Industry Context: ${detectedIndustry}

Analyze:
1. What compliance frameworks apply to their services?
2. What certifications should they have but don't?
3. What are the security compliance gaps?
4. What documentation should be requested?`;

    messageBus.agentActivity(
      'Compliance Orchestrator Agent',
      'Running AI compliance assessment...',
      vendorId
    );

    const aiResult = await callAgent(systemPrompt, userPrompt);
    
    if (aiResult.findings) {
      findings.push(...aiResult.findings);
    }
    if (aiResult.riskIndicators) {
      riskIndicators.push(...aiResult.riskIndicators);
    }
    if (aiResult.complianceGaps) {
      complianceGaps.push(...aiResult.complianceGaps);
    }
    if (aiResult.score !== undefined) {
      score = Math.round((score + aiResult.score) / 2);
    }

  } catch (aiError) {
    console.error('AI analysis failed:', aiError);
    findings.push('Note: AI compliance analysis unavailable');
  }

  score = Math.max(0, score);

  const result = {
    findings,
    riskIndicators,
    complianceGaps,
    score,
    confidence: foundCertifications.length > 0 ? 'medium' : 'low',
    certifications: foundCertifications,
    industry: detectedIndustry,
    requiresAdditionalReview: complianceGaps.length > 2
  };

  console.log(`📋 Compliance Orchestrator: Score ${score}/100, ${complianceGaps.length} gaps identified`);

  return result;
};

