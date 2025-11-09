// Risk Synthesizer Agent - Aggregates all agent findings and calculates final risk score

import messageBus from '../services/messageBus.js';
import { callAgent } from '../services/nvidiaService.js';

/**
 * Risk Synthesizer Agent combines all agent findings into final risk assessment
 * @param {object} allFindings - Results from all other agents
 * @param {object} vendorData - Original vendor data
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<object>} - Final risk assessment
 */
export const riskSynthesizerAgent = async (allFindings, vendorData, vendorId) => {
  const findings = [];
  const criticalIssues = [];
  const warnings = [];

  // Extract individual agent scores
  const scores = {
    intake: allFindings.intake?.score || 50,
    digital: allFindings.digital?.score || 50,
    privacy: allFindings.privacy?.score || 50,
    financial: allFindings.financial?.score || 50,
    compliance: allFindings.compliance?.score || 50
  };

  console.log('📊 Agent Scores:', scores);

  // Weighted scoring formula
  // Higher weights for more critical areas
  const weights = {
    intake: 0.15,      // 15% - Basic data quality
    digital: 0.20,     // 20% - Digital legitimacy
    privacy: 0.20,     // 20% - Privacy compliance
    financial: 0.25,   // 25% - Financial legitimacy (highest weight)
    compliance: 0.20   // 20% - Regulatory compliance
  };

  // Calculate weighted average (inverted to make higher scores = higher risk)
  let rawRiskScore = Object.entries(weights).reduce((total, [agent, weight]) => {
    const agentScore = scores[agent];
    // Invert: low agent score (bad) = high risk, high agent score (good) = low risk
    const riskContribution = (100 - agentScore) * weight;
    return total + riskContribution;
  }, 0);

  // Apply risk modifiers based on findings

  // CRITICAL ISSUES (add to risk)
  if (allFindings.intake?.missingFields?.length > 3) {
    rawRiskScore += 10;
    criticalIssues.push('Missing multiple required fields');
  }

  if (allFindings.financial?.riskIndicators?.some(r => r.includes('Tax ID'))) {
    rawRiskScore += 15;
    criticalIssues.push('Tax ID validation failed');
    
    messageBus.agentFinding(
      'Risk Synthesizer Agent',
      'Critical: Tax ID issues detected',
      'critical',
      vendorId
    );
  }

  if (allFindings.privacy?.piiDetected?.some(p => p.severity === 'critical')) {
    rawRiskScore += 10;
    criticalIssues.push('Critical PII exposed in submission');
  }

  if (!allFindings.digital?.websiteProvided) {
    rawRiskScore += 12;
    warnings.push('No website provided for verification');
  }

  if (allFindings.digital?.riskIndicators?.some(r => r.includes('Suspicious'))) {
    rawRiskScore += 15;
    criticalIssues.push('Suspicious digital footprint');
    
    messageBus.agentMessage(
      'Risk Synthesizer Agent',
      'Digital Forensics Agent',
      'Suspicious patterns require deeper investigation',
      'high',
      vendorId
    );
  }

  if (allFindings.compliance?.complianceGaps?.length > 2) {
    rawRiskScore += 8;
    warnings.push(`${allFindings.compliance.complianceGaps.length} compliance gaps identified`);
  }

  // POSITIVE FACTORS (reduce risk)
  if (allFindings.digital?.emailDomainMatch) {
    rawRiskScore -= 5;
  }

  if (allFindings.financial?.yearsInBusiness > 5) {
    rawRiskScore -= 8;
  }

  if (allFindings.compliance?.certifications?.length > 1) {
    rawRiskScore -= 10;
  }

  if (allFindings.privacy?.score > 80) {
    rawRiskScore -= 5;
  }

  // Detect contradictions across agents
  const contradictions = [];
  
  // Example: Claims certifications but website doesn't exist
  if (allFindings.compliance?.certifications?.length > 0 && !allFindings.digital?.websiteProvided) {
    contradictions.push('Claims certifications but has no verifiable web presence');
    rawRiskScore += 12;
  }

  // High revenue but brand new company
  if (allFindings.financial?.yearsInBusiness < 2 && 
      allFindings.financial?.riskIndicators?.some(r => r.includes('high revenue'))) {
    contradictions.push('High revenue claim for very new company');
    rawRiskScore += 10;
  }

  if (contradictions.length > 0) {
    findings.push('⚠️ CONTRADICTIONS DETECTED:');
    contradictions.forEach(c => findings.push(`  - ${c}`));
    
    messageBus.agentFinding(
      'Risk Synthesizer Agent',
      `Contradictions in vendor data: ${contradictions.join('; ')}`,
      'critical',
      vendorId
    );
  }

  // Clamp risk score between 0-100
  const riskScore = Math.min(100, Math.max(0, Math.round(rawRiskScore)));

  // Determine risk level
  let riskLevel, recommendation;
  if (riskScore <= 35) {
    riskLevel = 'low';
    recommendation = 'approve';
    findings.push('✅ LOW RISK - Vendor meets requirements for approval');
  } else if (riskScore <= 70) {
    riskLevel = 'medium';
    recommendation = 'review';
    findings.push('⚠️ MEDIUM RISK - Human review recommended');
  } else {
    riskLevel = 'high';
    recommendation = 'reject';
    findings.push('🚨 HIGH RISK - Recommend rejection or additional investigation');
  }

  // Generate executive summary
  const summary = generateExecutiveSummary(
    vendorData,
    riskScore,
    riskLevel,
    allFindings,
    criticalIssues,
    warnings,
    contradictions
  );

  // Use AI to generate insights (optional enhancement)
  try {
    const systemPrompt = `You are a Risk Assessment Executive summarizing vendor investigation results.

Based on all agent findings, provide strategic recommendations and key insights.

Return JSON with this structure:
{
  "executiveInsights": ["insight 1", "insight 2"],
  "keyRisks": ["risk 1", "risk 2"],
  "mitigationStrategies": ["strategy 1", "strategy 2"],
  "confidence": "high" | "medium" | "low"
}`;

    const userPrompt = `Synthesize these investigation results:

Vendor: ${vendorData.companyName}
Calculated Risk Score: ${riskScore}/100
Risk Level: ${riskLevel.toUpperCase()}

Agent Scores:
- Intake: ${scores.intake}/100
- Digital Forensics: ${scores.digital}/100
- Privacy: ${scores.privacy}/100
- Financial: ${scores.financial}/100
- Compliance: ${scores.compliance}/100

Critical Issues: ${criticalIssues.length > 0 ? criticalIssues.join('; ') : 'None'}
Warnings: ${warnings.length > 0 ? warnings.join('; ') : 'None'}
Contradictions: ${contradictions.length > 0 ? contradictions.join('; ') : 'None'}

Provide:
1. Executive-level insights for leadership
2. Key risks that require attention
3. Mitigation strategies if we proceed with this vendor`;

    messageBus.agentActivity(
      'Risk Synthesizer Agent',
      'Generating AI-powered executive insights...',
      vendorId
    );

    const aiResult = await callAgent(systemPrompt, userPrompt);
    
    if (aiResult.executiveInsights) {
      findings.push('');
      findings.push('🤖 AI-Generated Executive Insights:');
      aiResult.executiveInsights.forEach(insight => findings.push(`  • ${insight}`));
    }

    if (aiResult.mitigationStrategies) {
      findings.push('');
      findings.push('🛡️ Recommended Mitigation Strategies:');
      aiResult.mitigationStrategies.forEach(strategy => findings.push(`  • ${strategy}`));
    }

  } catch (aiError) {
    console.error('AI synthesis failed:', aiError);
    // Continue without AI insights
  }

  // Final result
  const result = {
    riskScore,
    riskLevel,
    recommendation,
    summary,
    findings,
    criticalIssues,
    warnings,
    contradictions,
    agentScores: scores,
    confidence: calculateConfidence(allFindings)
  };

  console.log(`🎯 Risk Synthesizer: Final Risk Score = ${riskScore}/100 (${riskLevel.toUpperCase()})`);
  console.log(`   Recommendation: ${recommendation.toUpperCase()}`);

  return result;
};

/**
 * Generate executive summary text
 */
const generateExecutiveSummary = (
  vendorData,
  riskScore,
  riskLevel,
  allFindings,
  criticalIssues,
  warnings,
  contradictions
) => {
  const parts = [];
  
  parts.push(`${vendorData.companyName || 'Vendor'} has been assessed with a risk score of ${riskScore}/100 (${riskLevel.toUpperCase()} risk).`);
  
  if (criticalIssues.length > 0) {
    parts.push(`${criticalIssues.length} critical issue(s) identified: ${criticalIssues.join(', ')}.`);
  }
  
  if (warnings.length > 0) {
    parts.push(`${warnings.length} warning(s) flagged for review.`);
  }
  
  if (contradictions.length > 0) {
    parts.push(`Data contradictions detected that require clarification.`);
  }

  // Positive notes
  const positives = [];
  if (allFindings.financial?.yearsInBusiness > 5) {
    positives.push('established business history');
  }
  if (allFindings.compliance?.certifications?.length > 0) {
    positives.push('security certifications');
  }
  if (allFindings.digital?.websiteProvided) {
    positives.push('verifiable web presence');
  }
  
  if (positives.length > 0) {
    parts.push(`Positive factors include: ${positives.join(', ')}.`);
  }

  return parts.join(' ');
};

/**
 * Calculate overall confidence in the assessment
 */
const calculateConfidence = (allFindings) => {
  const confidences = Object.values(allFindings)
    .map(f => f?.confidence)
    .filter(c => c);

  const confidenceScores = {
    'high': 3,
    'medium': 2,
    'low': 1
  };

  const avgConfidence = confidences.reduce((sum, c) => sum + (confidenceScores[c] || 1), 0) / confidences.length;

  if (avgConfidence >= 2.5) return 'high';
  if (avgConfidence >= 1.5) return 'medium';
  return 'low';
};

