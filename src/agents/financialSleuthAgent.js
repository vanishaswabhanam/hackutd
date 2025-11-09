// Financial Sleuth Agent - Investigates financial legitimacy and health

import messageBus from '../services/messageBus.js';
import { callAgent } from '../services/nvidiaService.js';

/**
 * Financial Sleuth Agent investigates vendor's financial legitimacy
 * @param {object} vendorData - Vendor submission data
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<object>} - Investigation results
 */
export const financialSleuthAgent = async (vendorData, vendorId) => {
  const findings = [];
  const riskIndicators = [];
  let score = 100;

  // Tax ID validation
  const taxId = vendorData.taxId || vendorData.ein || '';
  if (!taxId) {
    score -= 25;
    riskIndicators.push('No Tax ID provided');
    findings.push('⚠️ No Tax ID/EIN provided - cannot verify business registration');
    
    messageBus.agentFinding(
      'Financial Sleuth Agent',
      'No Tax ID provided for verification',
      'warning',
      vendorId
    );
  } else {
    // EIN format validation (XX-XXXXXXX)
    const einRegex = /^\d{2}-?\d{7}$/;
    const cleanTaxId = taxId.replace(/\s/g, '');
    
    if (einRegex.test(cleanTaxId)) {
      findings.push('✓ Tax ID format appears valid');
      
      // Basic EIN checksum validation (first 2 digits should be valid IRS prefix)
      const prefix = parseInt(cleanTaxId.substring(0, 2));
      if (prefix < 1 || prefix > 99 || prefix === 7 || prefix === 8 || prefix === 9 || prefix === 17 || prefix === 18 || prefix === 19 || prefix === 28 || prefix === 29 || prefix === 49 || prefix === 69 || prefix === 70 || prefix === 78 || prefix === 79 || prefix === 89) {
        score -= 20;
        riskIndicators.push('Tax ID prefix is invalid');
        findings.push('⚠️ Tax ID prefix does not match valid IRS ranges');
        
        messageBus.agentMessage(
          'Financial Sleuth Agent',
          'Digital Forensics Agent',
          'Suspicious Tax ID detected - please verify company registration',
          'high',
          vendorId
        );
      }
    } else {
      score -= 20;
      riskIndicators.push('Tax ID format invalid');
      findings.push('⚠️ Tax ID does not match standard EIN format (XX-XXXXXXX)');
    }
  }

  // Revenue analysis
  const revenue = vendorData.annualRevenue || '';
  const yearsInBusiness = parseInt(vendorData.yearsInBusiness) || 0;
  
  if (revenue) {
    // Extract numeric value from revenue string
    const revenueValue = parseFloat(revenue.toString().replace(/[$,]/g, ''));
    
    if (revenueValue > 0) {
      findings.push(`Annual revenue reported: $${revenueValue.toLocaleString()}`);
      
      // Sanity check: revenue vs. years in business
      if (yearsInBusiness > 0) {
        const revenuePerYear = revenueValue / yearsInBusiness;
        
        // Suspicious if very new company claims huge revenue
        if (yearsInBusiness < 2 && revenueValue > 1000000) {
          score -= 15;
          riskIndicators.push('Unusually high revenue for new company');
          findings.push('⚠️ Revenue seems high for a company this new - requires verification');
          
          messageBus.agentFinding(
            'Financial Sleuth Agent',
            `New company (${yearsInBusiness} years) claiming $${revenueValue.toLocaleString()} revenue`,
            'warning',
            vendorId
          );
        }
        
        // Suspicious if old company has very low revenue
        if (yearsInBusiness > 10 && revenueValue < 50000) {
          score -= 10;
          findings.push('Note: Low revenue for established company - may be struggling');
        }
      }
    } else {
      score -= 10;
      findings.push('Revenue value could not be parsed');
    }
  } else {
    score -= 15;
    riskIndicators.push('No revenue information');
    findings.push('No annual revenue information provided');
  }

  // Years in business assessment
  if (yearsInBusiness === 0) {
    score -= 5;
    findings.push('⚠️ Brand new company - limited track record');
    riskIndicators.push('No business history');
    
    messageBus.agentMessage(
      'Financial Sleuth Agent',
      'Risk Synthesizer Agent',
      'New vendor with no business history - recommend enhanced monitoring',
      'medium',
      vendorId
    );
  } else if (yearsInBusiness < 2) {
    score -= 3;
    findings.push('Company is relatively new (< 2 years)');
  } else if (yearsInBusiness >= 5) {
    findings.push(`✓ Established company with ${yearsInBusiness} years of operation`);
  }

  // Business type assessment
  const businessType = vendorData.businessType || '';
  const highRiskTypes = ['sole proprietorship', 'individual'];
  
  if (highRiskTypes.some(type => businessType.toLowerCase().includes(type))) {
    score -= 10;
    findings.push('Business structure is high-risk for large contracts');
  } else if (businessType.toLowerCase().includes('llc') || businessType.toLowerCase().includes('corporation')) {
    findings.push('✓ Formal business structure (LLC or Corporation)');
  }

  // Insurance information
  const insurance = vendorData.insuranceInfo || vendorData.insurance || '';
  if (!insurance || insurance.toLowerCase().includes('none')) {
    score -= 15;
    riskIndicators.push('No insurance information');
    findings.push('⚠️ No business insurance information provided');
    
    messageBus.agentMessage(
      'Financial Sleuth Agent',
      'Compliance Orchestrator Agent',
      'No insurance information - may be compliance issue',
      'medium',
      vendorId
    );
  } else {
    findings.push('✓ Insurance information provided');
  }

  // AI-powered financial analysis
  try {
    const systemPrompt = `You are a Financial Investigation specialist analyzing vendor financial legitimacy.

Assess the financial health and authenticity indicators from the provided data.

Return JSON with this structure:
{
  "findings": ["finding 1", "finding 2"],
  "riskIndicators": ["risk 1"],
  "score": <number 0-100>,
  "confidence": "high" | "medium" | "low",
  "redFlags": ["flag 1", "flag 2"]
}`;

    const userPrompt = `Analyze this vendor's financial profile:

Company: ${vendorData.companyName}
Business Type: ${businessType || 'Not specified'}
Years in Business: ${yearsInBusiness || 'Not specified'}
Annual Revenue: ${revenue || 'Not specified'}
Tax ID Provided: ${taxId ? 'Yes' : 'No'}
Insurance: ${insurance || 'Not specified'}

Assess:
1. Do the revenue claims seem realistic for this business type and age?
2. Are there any financial red flags?
3. What is the likelihood this is a shell company or fraudulent entity?
4. What financial documentation should be requested for verification?`;

    messageBus.agentActivity(
      'Financial Sleuth Agent',
      'Running AI financial analysis...',
      vendorId
    );

    const aiResult = await callAgent(systemPrompt, userPrompt);
    
    if (aiResult.findings) {
      findings.push(...aiResult.findings);
    }
    if (aiResult.riskIndicators) {
      riskIndicators.push(...aiResult.riskIndicators);
    }
    if (aiResult.score !== undefined) {
      score = Math.round((score + aiResult.score) / 2);
    }
    if (aiResult.redFlags && aiResult.redFlags.length > 0) {
      messageBus.agentMessage(
        'Financial Sleuth Agent',
        'Risk Synthesizer Agent',
        `AI detected financial red flags: ${aiResult.redFlags.join('; ')}`,
        'high',
        vendorId
      );
    }

  } catch (aiError) {
    console.error('AI analysis failed:', aiError);
    findings.push('Note: AI financial analysis unavailable, using rule-based assessment');
  }

  score = Math.max(0, score);

  const result = {
    findings,
    riskIndicators,
    score,
    confidence: taxId && revenue ? 'medium' : 'low',
    taxIdValid: !!taxId,
    revenueProvided: !!revenue,
    yearsInBusiness,
    hasInsurance: !!insurance
  };

  console.log(`💰 Financial Sleuth: Score ${score}/100, ${riskIndicators.length} risk indicators`);

  return result;
};

