// Digital Forensics Agent - Investigates digital presence and authenticity

import messageBus from '../services/messageBus.js';
import { callAgent, formatVendorData } from '../services/nvidiaService.js';

/**
 * Digital Forensics Agent investigates vendor's online presence
 * @param {object} vendorData - Vendor submission data
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<object>} - Investigation results
 */
export const digitalForensicsAgent = async (vendorData, vendorId) => {
  const findings = [];
  const riskIndicators = [];
  let score = 100;

  // Check if website is provided
  const website = vendorData.website || vendorData.companyWebsite || '';
  
  if (!website) {
    score -= 20;
    riskIndicators.push('No website provided');
    findings.push('⚠️ No company website provided - unable to verify digital presence');
    
    messageBus.agentFinding(
      'Digital Forensics Agent',
      'No website provided for verification',
      'warning',
      vendorId
    );
  } else {
    // Website format validation
    try {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`);
      findings.push(`Website URL: ${url.hostname}`);

      // Check domain characteristics
      const domain = url.hostname;
      
      // Suspicious TLD check
      const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.buzz', '.club'];
      if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
        score -= 25;
        riskIndicators.push('Suspicious domain extension');
        findings.push(`⚠️ Domain uses suspicious TLD: ${domain}`);
        
        messageBus.agentMessage(
          'Digital Forensics Agent',
          'Risk Synthesizer Agent',
          `Suspicious domain TLD detected: ${domain}`,
          'high',
          vendorId
        );
      }

      // Check for IP address instead of domain
      const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
      if (ipRegex.test(domain)) {
        score -= 30;
        riskIndicators.push('Website is IP address, not domain');
        findings.push('⚠️ Website URL is an IP address - professional businesses use domain names');
      }

      // Try to fetch website (basic reachability check)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url.toString(), {
          method: 'HEAD',
          mode: 'no-cors', // Avoid CORS issues in browser
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        findings.push('✓ Website is reachable');
        
      } catch (error) {
        score -= 15;
        riskIndicators.push('Website unreachable');
        findings.push('⚠️ Unable to reach website - may be offline or blocking automated requests');
        
        messageBus.agentFinding(
          'Digital Forensics Agent',
          `Website unreachable: ${error.message}`,
          'warning',
          vendorId
        );
      }

      // Use NVIDIA to analyze digital footprint
      try {
        const systemPrompt = `You are a Digital Forensics specialist analyzing a vendor's legitimacy based on their digital presence.
        
Your job is to assess authenticity indicators from the provided information.

Return JSON with this structure:
{
  "findings": ["finding 1", "finding 2", "finding 3"],
  "riskIndicators": ["risk 1", "risk 2"],
  "score": <number 0-100, where 100 is most legitimate>,
  "confidence": "high" | "medium" | "low",
  "legitimacyConcerns": ["concern 1", "concern 2"]
}`;

        const userPrompt = `Analyze this vendor's digital presence:

Company Name: ${vendorData.companyName}
Website: ${website}
Business Type: ${vendorData.businessType || 'Not specified'}
Years in Business: ${vendorData.yearsInBusiness || 'Not specified'}
Email Domain: ${vendorData.email ? vendorData.email.split('@')[1] : 'Not provided'}

Assess:
1. Does the email domain match the website domain? If not, is it suspicious?
2. Does the company name sound legitimate for their business type?
3. Are there any red flags in the digital footprint?
4. What additional verification would you recommend?`;

        messageBus.agentActivity(
          'Digital Forensics Agent',
          'Running AI analysis of digital footprint...',
          vendorId
        );

        const aiResult = await callAgent(systemPrompt, userPrompt);
        
        // Merge AI findings
        if (aiResult.findings) {
          findings.push(...aiResult.findings);
        }
        if (aiResult.riskIndicators) {
          riskIndicators.push(...aiResult.riskIndicators);
        }
        
        // Adjust score based on AI assessment
        if (aiResult.score !== undefined) {
          score = Math.round((score + aiResult.score) / 2);
        }

        if (aiResult.legitimacyConcerns && aiResult.legitimacyConcerns.length > 0) {
          messageBus.agentMessage(
            'Digital Forensics Agent',
            'Risk Synthesizer Agent',
            `AI detected legitimacy concerns: ${aiResult.legitimacyConcerns.join('; ')}`,
            'medium',
            vendorId
          );
        }

      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
        findings.push('Note: AI-powered analysis unavailable, using rule-based assessment only');
      }

    } catch (urlError) {
      score -= 20;
      riskIndicators.push('Invalid website URL format');
      findings.push(`⚠️ Website URL format invalid: ${website}`);
    }
  }

  // Email domain analysis
  if (vendorData.email && website) {
    const emailDomain = vendorData.email.split('@')[1];
    const websiteDomain = website.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    const freeEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    
    if (freeEmailProviders.includes(emailDomain.toLowerCase())) {
      score -= 15;
      riskIndicators.push('Using free email provider');
      findings.push('⚠️ Company uses free email provider - professional businesses typically use custom domains');
      
      messageBus.agentFinding(
        'Digital Forensics Agent',
        'Vendor using free email provider instead of corporate domain',
        'warning',
        vendorId
      );
    } else if (!emailDomain.toLowerCase().includes(websiteDomain.toLowerCase().split('.')[0])) {
      score -= 10;
      riskIndicators.push('Email domain does not match website');
      findings.push('⚠️ Email domain does not match company website');
    } else {
      findings.push('✓ Email domain matches company website');
    }
  }

  // Company name analysis
  const companyName = vendorData.companyName || '';
  if (companyName) {
    // Generic name check
    const genericWords = ['solutions', 'services', 'group', 'international', 'global'];
    const genericCount = genericWords.filter(word => 
      companyName.toLowerCase().includes(word)
    ).length;
    
    if (genericCount >= 2) {
      score -= 10;
      findings.push('Company name uses multiple generic business terms');
    }

    // Very short name
    if (companyName.length < 5) {
      score -= 5;
      findings.push('Company name is unusually short');
    }
  }

  score = Math.max(0, score);

  const result = {
    findings,
    riskIndicators,
    score,
    confidence: website ? 'medium' : 'low',
    websiteProvided: !!website,
    emailDomainMatch: vendorData.email && website ? 
      vendorData.email.split('@')[1].includes(website.split('.')[0]) : false
  };

  console.log(`🔍 Digital Forensics: Score ${score}/100, ${findings.length} findings`);

  return result;
};

