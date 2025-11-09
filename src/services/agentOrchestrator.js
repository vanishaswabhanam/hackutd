// Agent Orchestrator - Coordinates all AI agents during vendor investigation

import messageBus from './messageBus.js';
import { intakeAgent } from '../agents/intakeAgent.js';
import { digitalForensicsAgent } from '../agents/digitalForensicsAgent.js';
import { privacyGuardianAgent } from '../agents/privacyGuardianAgent.js';
import { financialSleuthAgent } from '../agents/financialSleuthAgent.js';
import { complianceOrchestratorAgent } from '../agents/complianceOrchestratorAgent.js';
import { riskSynthesizerAgent } from '../agents/riskSynthesizerAgent.js';

/**
 * Run complete vendor investigation with all agents
 * @param {object} vendorData - Complete vendor submission data
 * @returns {Promise<object>} - Investigation results with agent findings and risk score
 */
export const investigateVendor = async (vendorData) => {
  const vendorId = `vendor-${Date.now()}`;
  const startTime = Date.now();

  console.log(`🚀 Starting investigation for ${vendorData.companyName || 'Unknown Company'}`);
  
  // Clear previous activity log for this session
  localStorage.setItem('currentInvestigation', vendorId);

  try {
    // PHASE 1: Intake Agent (validates data completeness)
    messageBus.agentActivity('Intake Agent', 'Starting data validation...', vendorId);
    const intakeResult = await intakeAgent(vendorData, vendorId);
    messageBus.agentActivity('Intake Agent', 'Validation complete', vendorId, { 
      status: 'complete',
      score: intakeResult.score 
    });

    // PHASE 2: Run investigation agents in parallel
    messageBus.agentActivity('Investigation Team', 'Launching parallel investigations...', vendorId);
    
    const [
      digitalResult,
      privacyResult,
      financialResult,
      complianceResult
    ] = await Promise.all([
      runAgentSafely('Digital Forensics Agent', digitalForensicsAgent, vendorData, vendorId),
      runAgentSafely('Privacy Guardian Agent', privacyGuardianAgent, vendorData, vendorId),
      runAgentSafely('Financial Sleuth Agent', financialSleuthAgent, vendorData, vendorId),
      runAgentSafely('Compliance Orchestrator Agent', complianceOrchestratorAgent, vendorData, vendorId)
    ]);

    // PHASE 3: Risk Synthesizer aggregates all findings
    messageBus.agentActivity('Risk Synthesizer Agent', 'Analyzing all findings...', vendorId);
    
    const allFindings = {
      intake: intakeResult,
      digital: digitalResult,
      privacy: privacyResult,
      financial: financialResult,
      compliance: complianceResult
    };

    const riskResult = await riskSynthesizerAgent(allFindings, vendorData, vendorId);
    
    messageBus.agentActivity('Risk Synthesizer Agent', 
      `Investigation complete - Risk Score: ${riskResult.riskScore}`, 
      vendorId, 
      { status: 'complete', riskScore: riskResult.riskScore }
    );

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);

    console.log(`✅ Investigation complete in ${duration}s - Risk Score: ${riskResult.riskScore}`);

    // Return complete investigation results
    return {
      vendorId,
      timestamp: new Date().toISOString(),
      duration,
      vendorData,
      agentResults: allFindings,
      riskScore: riskResult.riskScore,
      riskLevel: riskResult.riskLevel,
      recommendation: riskResult.recommendation,
      summary: riskResult.summary,
      interAgentMessages: messageBus.getMessages(vendorId)
    };

  } catch (error) {
    console.error('Investigation failed:', error);
    messageBus.agentActivity('System', `Investigation error: ${error.message}`, vendorId, { 
      status: 'error' 
    });

    // Return error state with partial results
    return {
      vendorId,
      timestamp: new Date().toISOString(),
      vendorData,
      error: error.message,
      riskScore: 75, // Default to high risk on error
      riskLevel: 'high',
      recommendation: 'reject',
      summary: 'Investigation failed - manual review required'
    };
  }
};

/**
 * Run an agent with error handling
 * @param {string} agentName - Name of the agent
 * @param {function} agentFunction - Agent function to run
 * @param {object} vendorData - Vendor data
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<object>} - Agent results or error fallback
 */
const runAgentSafely = async (agentName, agentFunction, vendorData, vendorId) => {
  try {
    messageBus.agentActivity(agentName, 'Investigation started', vendorId, { status: 'running' });
    const result = await agentFunction(vendorData, vendorId);
    messageBus.agentActivity(agentName, 'Investigation complete', vendorId, { 
      status: 'complete',
      score: result.score 
    });
    return result;
  } catch (error) {
    console.error(`${agentName} error:`, error);
    messageBus.agentActivity(agentName, `Error: ${error.message}`, vendorId, { status: 'error' });
    
    // Return fallback result
    return {
      findings: [`Agent encountered an error: ${error.message}`],
      riskIndicators: ['Unable to complete analysis'],
      score: 50, // Neutral score on error
      confidence: 'low',
      error: error.message
    };
  }
};

/**
 * Get investigation status for a vendor
 * @param {string} vendorId - Vendor ID
 * @returns {object} - Current status and agent progress
 */
export const getInvestigationStatus = (vendorId) => {
  const messages = messageBus.getMessages(vendorId);
  const activities = messages.filter(m => m.type === 'activity');
  
  return {
    vendorId,
    activities,
    isComplete: activities.some(a => a.agent === 'Risk Synthesizer Agent' && a.action.includes('complete')),
    agentStatus: getAgentStatusSummary(activities)
  };
};

/**
 * Get summary of what each agent is doing
 * @param {Array} activities - Activity messages
 * @returns {object} - Status for each agent
 */
const getAgentStatusSummary = (activities) => {
  const agents = [
    'Intake Agent',
    'Digital Forensics Agent',
    'Privacy Guardian Agent',
    'Financial Sleuth Agent',
    'Compliance Orchestrator Agent',
    'Risk Synthesizer Agent'
  ];

  const status = {};
  agents.forEach(agent => {
    const agentActivities = activities.filter(a => a.agent === agent);
    const latest = agentActivities[agentActivities.length - 1];
    
    status[agent] = {
      status: latest?.metadata?.status || 'pending',
      action: latest?.action || 'Waiting...',
      timestamp: latest?.timestamp || null
    };
  });

  return status;
};

/**
 * Save investigation results to localStorage for admin dashboard
 * @param {object} results - Investigation results
 */
export const saveInvestigation = (results) => {
  try {
    // Get existing investigations
    const existing = JSON.parse(localStorage.getItem('investigations') || '[]');
    
    // Add new investigation
    existing.push(results);
    
    // Keep only last 50 investigations
    if (existing.length > 50) {
      existing.shift();
    }
    
    // Save back to localStorage
    localStorage.setItem('investigations', JSON.stringify(existing));
    
    console.log(`💾 Saved investigation ${results.vendorId}`);
  } catch (error) {
    console.error('Error saving investigation:', error);
  }
};

/**
 * Get all investigations from localStorage
 * @returns {Array} - Array of investigation results
 */
export const getAllInvestigations = () => {
  try {
    return JSON.parse(localStorage.getItem('investigations') || '[]');
  } catch (error) {
    console.error('Error loading investigations:', error);
    return [];
  }
};

/**
 * Get specific investigation by ID
 * @param {string} vendorId - Vendor ID
 * @returns {object|null} - Investigation results or null
 */
export const getInvestigation = (vendorId) => {
  const investigations = getAllInvestigations();
  return investigations.find(inv => inv.vendorId === vendorId) || null;
};

