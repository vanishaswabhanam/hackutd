// Intake Agent - Validates data completeness and quality

import messageBus from '../services/messageBus.js';

/**
 * Intake Agent validates vendor data completeness
 * @param {object} vendorData - Vendor submission data
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<object>} - Validation results
 */
export const intakeAgent = async (vendorData, vendorId) => {
  const findings = [];
  const riskIndicators = [];
  let score = 100; // Start perfect, deduct for issues

  // Required fields check
  const requiredFields = [
    'companyName',
    'address',
    'email',
    'phone',
    'businessType',
    'servicesDescription'
  ];

  const missingFields = requiredFields.filter(field => 
    !vendorData[field] || vendorData[field].toString().trim() === ''
  );

  if (missingFields.length > 0) {
    score -= missingFields.length * 10;
    riskIndicators.push(`Missing ${missingFields.length} required fields`);
    findings.push(`Missing required information: ${missingFields.join(', ')}`);
    
    messageBus.agentFinding(
      'Intake Agent',
      `Missing fields: ${missingFields.join(', ')}`,
      'warning',
      vendorId
    );
  } else {
    findings.push('All required fields provided');
  }

  // Email validation
  if (vendorData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(vendorData.email)) {
      score -= 15;
      riskIndicators.push('Invalid email format');
      findings.push(`Email format appears invalid: ${vendorData.email}`);
      
      messageBus.agentFinding(
        'Intake Agent',
        'Invalid email format detected',
        'warning',
        vendorId
      );
    } else {
      findings.push('Email format valid');
    }
  }

  // Phone validation
  if (vendorData.phone) {
    const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    if (!phoneRegex.test(vendorData.phone)) {
      score -= 10;
      riskIndicators.push('Invalid phone format');
      findings.push(`Phone format appears invalid: ${vendorData.phone}`);
    } else {
      findings.push('Phone format valid');
    }
  }

  // Tax ID validation (basic format check)
  if (vendorData.taxId) {
    const taxIdRegex = /^\d{2}-?\d{7}$/;
    if (!taxIdRegex.test(vendorData.taxId.replace(/\s/g, ''))) {
      score -= 20;
      riskIndicators.push('Tax ID format invalid');
      findings.push('Tax ID does not match standard EIN format');
      
      messageBus.agentMessage(
        'Intake Agent',
        'Financial Sleuth Agent',
        'Tax ID format appears invalid - please verify',
        'high',
        vendorId
      );
    } else {
      findings.push('Tax ID format appears valid');
    }
  } else {
    score -= 15;
    riskIndicators.push('No Tax ID provided');
    findings.push('Tax ID not provided');
  }

  // Website check (if provided)
  if (vendorData.website) {
    try {
      new URL(vendorData.website);
      findings.push('Website URL format valid');
      
      // Trigger digital forensics
      messageBus.agentMessage(
        'Intake Agent',
        'Digital Forensics Agent',
        `Website provided: ${vendorData.website} - please investigate`,
        'medium',
        vendorId
      );
    } catch (error) {
      score -= 10;
      riskIndicators.push('Invalid website URL');
      findings.push('Website URL format invalid');
    }
  }

  // Data quality assessment
  const avgFieldLength = Object.values(vendorData)
    .filter(v => typeof v === 'string')
    .reduce((sum, v) => sum + v.length, 0) / Object.keys(vendorData).length;

  if (avgFieldLength < 5) {
    score -= 15;
    riskIndicators.push('Suspiciously short field values');
    findings.push('Many fields contain very little information');
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  const result = {
    findings,
    riskIndicators,
    score,
    confidence: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
    completenessPercentage: Math.round((requiredFields.length - missingFields.length) / requiredFields.length * 100),
    missingFields
  };

  console.log(`📋 Intake Agent: Score ${score}/100, ${findings.length} findings`);

  return result;
};

