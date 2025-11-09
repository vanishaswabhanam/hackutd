/**
 * Intelligent Document Parser
 * Extracts structured data from OCR text using pattern matching and NLP
 */

/**
 * Calculate confidence level based on pattern matching strength
 * @param {boolean} found - Whether the field was found
 * @param {number} matchQuality - Quality of the match (0-100)
 * @returns {string} Confidence level: 'high', 'medium', or 'low'
 */
function calculateConfidence(found, matchQuality = 50) {
  if (!found) return 'low';
  if (matchQuality > 80) return 'high';
  if (matchQuality > 40) return 'medium';
  return 'low';
}

/**
 * Extract company name from text
 */
function extractCompanyName(text) {
  // Look for common patterns
  const patterns = [
    /Company\s*Name[:\s]+([^\n]+)/i,
    /Business\s*Name[:\s]+([^\n]+)/i,
    /Legal\s*Name[:\s]+([^\n]+)/i,
    /Name\s*of\s*Business[:\s]+([^\n]+)/i,
    /^([A-Z][A-Za-z\s&,.]+(?:Inc|LLC|Corp|Corporation|Ltd|Limited))/m,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        value: match[1].trim(),
        confidence: 'high',
      };
    }
  }

  // Try to find capitalized name in first few lines
  const lines = text.split('\n').slice(0, 5);
  for (const line of lines) {
    if (line.length > 5 && line.length < 60 && /^[A-Z]/.test(line)) {
      return {
        value: line.trim(),
        confidence: 'medium',
      };
    }
  }

  return { value: '', confidence: 'low' };
}

/**
 * Extract Tax ID/EIN from text
 */
function extractTaxId(text) {
  // EIN format: XX-XXXXXXX
  const patterns = [
    /Tax\s*ID[:\s]+(\d{2}-?\d{7})/i,
    /EIN[:\s]+(\d{2}-?\d{7})/i,
    /Employer\s*Identification\s*Number[:\s]+(\d{2}-?\d{7})/i,
    /\b(\d{2}-\d{7})\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let taxId = match[1].replace(/[^\d-]/g, '');
      // Add dash if missing
      if (!taxId.includes('-') && taxId.length === 9) {
        taxId = taxId.slice(0, 2) + '-' + taxId.slice(2);
      }
      return {
        value: taxId,
        confidence: 'high',
      };
    }
  }

  return { value: '', confidence: 'low' };
}

/**
 * Extract email address from text
 */
function extractEmail(text) {
  const pattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(pattern);
  
  if (match) {
    return {
      value: match[0],
      confidence: 'high',
    };
  }

  return { value: '', confidence: 'low' };
}

/**
 * Extract phone number from text
 */
function extractPhone(text) {
  const patterns = [
    /Phone[:\s]+([+]?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/i,
    /Tel[:\s]+([+]?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/i,
    /\b([+]?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        value: match[1].trim(),
        confidence: 'high',
      };
    }
  }

  return { value: '', confidence: 'low' };
}

/**
 * Extract address from text
 */
function extractAddress(text) {
  // Look for address patterns
  const patterns = [
    /Address[:\s]+([^\n]+(?:\n[^\n]+)?)/i,
    /Street[:\s]+([^\n]+)/i,
    /(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)[^\n]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        value: match[1].trim().replace(/\n/g, ', '),
        confidence: 'high',
      };
    }
  }

  return { value: '', confidence: 'low' };
}

/**
 * Extract business type from text
 */
function extractBusinessType(text) {
  const types = {
    'Software Development': /software\s+development|software\s+engineering|technology\s+services/i,
    'Consulting': /consulting|advisory|professional\s+services/i,
    'Manufacturing': /manufacturing|production|fabrication/i,
    'Retail': /retail|e-commerce|online\s+store/i,
    'Healthcare': /healthcare|medical|health\s+services/i,
    'Financial Services': /financial|banking|investment/i,
    'Construction': /construction|building|contractor/i,
  };

  for (const [type, pattern] of Object.entries(types)) {
    if (pattern.test(text)) {
      return {
        value: type,
        confidence: 'medium',
      };
    }
  }

  return { value: '', confidence: 'low' };
}

/**
 * Extract services description from text
 */
function extractServices(text) {
  const patterns = [
    /Services[:\s]+([^\n]+(?:\n(?!\n)[^\n]+)*)/i,
    /Description[:\s]+([^\n]+(?:\n(?!\n)[^\n]+)*)/i,
    /Business\s+Description[:\s]+([^\n]+(?:\n(?!\n)[^\n]+)*)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        value: match[1].trim().replace(/\n/g, ' '),
        confidence: 'high',
      };
    }
  }

  return { value: '', confidence: 'low' };
}

/**
 * Extract years in business from text
 */
function extractYearsInBusiness(text) {
  const patterns = [
    /Years\s+in\s+Business[:\s]+(\d+)/i,
    /Established[:\s]+(\d{4})/i,
    /Founded[:\s]+(\d{4})/i,
    /Since[:\s]+(\d{4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let years = match[1];
      // If it's a year, calculate years from now
      if (years.length === 4) {
        years = new Date().getFullYear() - parseInt(years);
      }
      return {
        value: years.toString(),
        confidence: 'high',
      };
    }
  }

  return { value: '', confidence: 'low' };
}

/**
 * Extract annual revenue from text
 */
function extractAnnualRevenue(text) {
  const patterns = [
    /Annual\s+Revenue[:\s]+\$?([\d,]+(?:\.\d{2})?)\s*([MB])?/i,
    /Revenue[:\s]+\$?([\d,]+(?:\.\d{2})?)\s*([MB])?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let amount = match[1].replace(/,/g, '');
      const unit = match[2];
      if (unit === 'M') amount = `$${amount}M`;
      else if (unit === 'B') amount = `$${amount}B`;
      else amount = `$${amount}`;
      
      return {
        value: amount,
        confidence: 'medium',
      };
    }
  }

  return { value: '', confidence: 'low' };
}

/**
 * Extract insurance information from text
 */
function extractInsurance(text) {
  const patterns = [
    /Insurance[:\s]+([^\n]+)/i,
    /Policy[:\s#]+([^\n]+)/i,
    /GL\s+Policy[:\s#]+([^\n]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        value: match[1].trim(),
        confidence: 'high',
      };
    }
  }

  return { value: '', confidence: 'low' };
}

/**
 * Extract certifications from text
 */
function extractCertifications(text) {
  const certifications = [];
  
  if (/SOC\s*2/i.test(text)) certifications.push('SOC2 Type II');
  if (/ISO\s*27001/i.test(text)) certifications.push('ISO 27001');
  if (/PCI\s*DSS/i.test(text)) certifications.push('PCI DSS');
  if (/HIPAA/i.test(text)) certifications.push('HIPAA Compliant');

  if (certifications.length > 0) {
    return {
      value: certifications.join(', '),
      confidence: 'high',
    };
  }

  return { value: '', confidence: 'low' };
}

/**
 * Main parser function - extracts all fields from OCR text
 * @param {string} text - Raw OCR extracted text
 * @returns {Object} Structured data with confidence levels
 */
export function parseVendorDocument(text) {
  if (!text || typeof text !== 'string') {
    return {
      companyName: { value: '', confidence: 'low' },
      taxId: { value: '', confidence: 'low' },
      email: { value: '', confidence: 'low' },
      phone: { value: '', confidence: 'low' },
      address: { value: '', confidence: 'low' },
      businessType: { value: '', confidence: 'low' },
      services: { value: '', confidence: 'low' },
      yearsInBusiness: { value: '', confidence: 'low' },
      annualRevenue: { value: '', confidence: 'low' },
      insurance: { value: '', confidence: 'low' },
      certifications: { value: '', confidence: 'low' },
    };
  }

  return {
    companyName: extractCompanyName(text),
    taxId: extractTaxId(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    address: extractAddress(text),
    businessType: extractBusinessType(text),
    services: extractServices(text),
    yearsInBusiness: extractYearsInBusiness(text),
    annualRevenue: extractAnnualRevenue(text),
    insurance: extractInsurance(text),
    certifications: extractCertifications(text),
  };
}

