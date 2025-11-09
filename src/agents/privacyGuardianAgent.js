// Privacy Guardian Agent - Detects PII and privacy risks

import messageBus from '../services/messageBus.js';

/**
 * Privacy Guardian Agent scans for PII and privacy issues
 * @param {object} vendorData - Vendor submission data
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<object>} - Privacy scan results
 */
export const privacyGuardianAgent = async (vendorData, vendorId) => {
  const findings = [];
  const riskIndicators = [];
  const piiDetected = [];
  let score = 100; // Start perfect, deduct for issues

  // Convert all data to searchable text
  const allText = Object.entries(vendorData)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  // PII Detection Patterns
  const piiPatterns = [
    {
      name: 'Social Security Number',
      regex: /\b\d{3}-\d{2}-\d{4}\b/g,
      severity: 'critical',
      penalty: 25
    },
    {
      name: 'Credit Card',
      regex: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
      severity: 'critical',
      penalty: 30
    },
    {
      name: 'Email Address',
      regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      severity: 'low',
      penalty: 5
    },
    {
      name: 'Phone Number',
      regex: /\b\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      severity: 'low',
      penalty: 5
    },
    {
      name: 'Driver License Pattern',
      regex: /\b(?:DL|DRIVER(?:'?S)?\s*LIC(?:ENSE)?)\s*#?\s*[A-Z0-9]{5,15}\b/gi,
      severity: 'high',
      penalty: 20
    },
    {
      name: 'Passport Number',
      regex: /\b[A-Z]{1,2}\d{6,9}\b/g,
      severity: 'high',
      penalty: 20
    },
    {
      name: 'Date of Birth',
      regex: /\b(?:DOB|DATE\s+OF\s+BIRTH)[:\s]*\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/gi,
      severity: 'medium',
      penalty: 15
    }
  ];

  // Scan for each PII type
  piiPatterns.forEach(pattern => {
    const matches = allText.match(pattern.regex);
    if (matches) {
      const count = matches.length;
      piiDetected.push({
        type: pattern.name,
        count,
        severity: pattern.severity,
        samples: matches.slice(0, 2).map(m => maskPII(m)) // Show masked samples
      });

      score -= pattern.penalty * count;
      riskIndicators.push(`${pattern.name} detected (${count} instance${count > 1 ? 's' : ''})`);
      
      messageBus.agentFinding(
        'Privacy Guardian Agent',
        `Detected ${count} ${pattern.name}(s) in submission`,
        pattern.severity === 'critical' ? 'critical' : 'warning',
        vendorId
      );
    }
  });

  // Check for excessive PII
  const criticalPII = piiDetected.filter(p => p.severity === 'critical');
  if (criticalPII.length > 0) {
    findings.push(`⚠️ CRITICAL: Found ${criticalPII.length} types of sensitive PII that should not be submitted`);
    
    // Alert compliance team
    messageBus.agentMessage(
      'Privacy Guardian Agent',
      'Compliance Orchestrator Agent',
      `Critical PII detected in submission - enhanced privacy controls required`,
      'high',
      vendorId
    );
  }

  // Check if services involve PII handling
  const servicesText = (vendorData.servicesDescription || '').toLowerCase();
  const piiRelatedKeywords = ['personal', 'data', 'information', 'customers', 'users', 'patient', 'health', 'financial'];
  const handlesPII = piiRelatedKeywords.some(keyword => servicesText.includes(keyword));

  if (handlesPII) {
    findings.push('Vendor services may involve handling personal data');
    
    messageBus.agentMessage(
      'Privacy Guardian Agent',
      'Compliance Orchestrator Agent',
      'Vendor services suggest PII handling - verify GDPR/CCPA compliance',
      'medium',
      vendorId
    );
  }

  // Generate findings summary
  if (piiDetected.length === 0) {
    findings.push('✓ No sensitive PII detected in submission');
  } else {
    findings.push(`Detected ${piiDetected.length} types of PII in submission documents`);
    findings.push('Recommendation: Implement data masking before storage');
  }

  // Privacy score assessment
  score = Math.max(0, score);
  const privacyRating = score > 80 ? 'Excellent' : 
                        score > 60 ? 'Good' : 
                        score > 40 ? 'Needs Attention' : 
                        'Critical Issues';

  const result = {
    findings,
    riskIndicators,
    score,
    confidence: piiDetected.length === 0 ? 'high' : 'medium',
    piiDetected,
    privacyRating,
    requiresDataMasking: criticalPII.length > 0,
    handlesPII
  };

  console.log(`🔒 Privacy Guardian: Score ${score}/100, ${piiDetected.length} PII types detected`);

  return result;
};

/**
 * Mask PII for display purposes
 * @param {string} pii - PII string to mask
 * @returns {string} - Masked version
 */
const maskPII = (pii) => {
  if (pii.length <= 4) return '***';
  return pii.substring(0, 2) + '*'.repeat(pii.length - 4) + pii.substring(pii.length - 2);
};

