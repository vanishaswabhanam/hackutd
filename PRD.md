# Product Requirements Document
## Adaptive Fraud Hunter - AI Multi-Agent Onboarding System

**Version:** 1.0  
**Last Updated:** November 9, 2025  
**Target Challenges:** Goldman Sachs Secure Onboarding Hub + NVIDIA Intelligent Agents

---

## Executive Summary

Adaptive Fraud Hunter is an intelligent multi-agent system that automates and secures vendor/client onboarding for financial institutions. The platform replaces manual, weeks-long processes with an AI-orchestrated investigation that completes in hours while detecting fraud patterns that humans miss. Six specialized AI agents work in parallel, communicate findings, and make autonomous decisions based on collective intelligence.

**Core Innovation:** Rather than forcing users through rigid forms, vendors upload existing documentation. OCR extracts data, triggering immediate background investigations by autonomous agents that adapt their approach based on real-time findings.

---

## Problem Statement

### Current Pain Points

**For Enterprises (Goldman Sachs Context):**
- Vendor onboarding takes 2-6 weeks due to manual reviews
- Security teams overwhelmed validating compliance requirements
- Fraud detection relies on reactive red flags, not proactive investigation
- No unified view of vendor risk across departments
- PII exposure during document handling creates liability

**For Vendors:**
- Repetitive form filling with information they already documented
- Long wait times with zero visibility into review status
- Unclear requirements lead to resubmissions

### Market Gap

Existing solutions offer either workflow automation OR fraud detection, but not intelligent investigation. No platform orchestrates multiple specialized AI agents that actively investigate, communicate findings, and make autonomous decisions.

---

## Solution Overview

### Intelligent Document Upload
Vendors upload existing business documents (W9, licenses, insurance certificates). OCR Space API extracts text, intelligent parser structures data, form auto-fills with confidence indicators.

### Multi-Agent Investigation System
Six specialized NVIDIA Nemotron agents activate immediately upon data extraction:

**1. Intake Agent**
- Validates completeness of extracted data
- Identifies gaps requiring clarification
- Routes vendor to appropriate investigation depth based on risk profile

**2. Digital Forensics Agent**
- Scrapes company website for authenticity signals
- Analyzes domain age, SSL certificates, hosting patterns
- Cross-references social media presence (LinkedIn, Twitter)
- Detects shell company indicators (stock photos, plagiarized content)
- Checks historical incidents and reputation

**3. Financial Sleuth Agent**
- Validates Tax ID against public records
- Analyzes financial health indicators from available data
- Detects pattern anomalies (mismatched revenue claims, suspicious addresses)
- Identifies bankruptcy history or payment defaults
- Cross-checks entity registration databases

**4. Compliance Orchestrator Agent**
- Generates dynamic security assessments based on vendor type
- Validates stated certifications (SOC2, ISO 27001)
- Checks encryption standards, access controls, logging practices
- Identifies compliance gaps in baseline security requirements
- Adapts questionnaire depth based on risk tier

**5. Privacy Guardian Agent**
- Scans all uploaded documents for PII exposure
- Auto-masks SSNs, account numbers, personal addresses
- Flags documents with improper data handling
- Validates GDPR/CCPA compliance claims
- Monitors data retention policies

**6. Risk Synthesizer Agent**
- Aggregates findings from all agents
- Identifies contradictions (claimed certifications vs. actual security posture)
- Weighs risk factors using learned patterns
- Makes autonomous approval/rejection/escalation decision
- Generates executive summary with evidence trails

### Agent Orchestration & Communication

Agents operate asynchronously but communicate critical findings:
- Financial Sleuth detects suspicious Tax ID → triggers deeper Digital Forensics investigation
- Privacy Guardian finds excessive PII → alerts Compliance Orchestrator to security gaps
- Digital Forensics discovers contradictory social presence → Financial Sleuth validates entity authenticity
- Risk Synthesizer detects pattern across findings → escalates to human review

### Real-Time Admin Dashboard

Live monitoring interface showing:
- Active vendor investigations with progress indicators
- Agent activity feed displaying real-time actions
- Risk score calculations as they evolve
- Inter-agent communications when triggered
- Color-coded vendor cards (green/yellow/red) based on emerging risk
- Timeline view of investigation milestones

---

## User Flows

### Vendor Journey
1. Land on onboarding portal
2. Upload business documentation (single or multiple files)
3. OCR processing extracts data (15-30 seconds)
4. Form auto-populates with confidence highlighting
5. Review/correct extracted fields
6. Submit for investigation
7. Receive status updates as agents complete reviews
8. Get approval decision with turnaround under 24 hours

### Admin Journey
1. Access Mission Control dashboard
2. View real-time agent activity across all vendors
3. Click vendor card to see detailed investigation
4. Review agent reports with evidence links
5. See inter-agent communications explaining decisions
6. Override automated decisions when necessary
7. Export audit trail for compliance records

---

## Technical Architecture

### Frontend Stack
- React 18 with functional components
- Tailwind CSS with Goldman Sachs design system
- React Router for multi-page navigation
- Lucide React for iconography

### API Integrations

**Current:**
- OCR Space API for document text extraction

**Planned for Full Implementation:**
- NVIDIA NIM API for Nemotron agent orchestration
- Financial data APIs (credit bureaus, SEC EDGAR)
- Domain reputation services (VirusTotal, AlienVault)
- Social media APIs (LinkedIn, Twitter/X)
- Certification registries (SOC2, ISO databases)

### Agent Framework (NVIDIA Nemotron)

Each agent operates as autonomous reasoning unit:
- Input: Context from previous agents + extracted data
- Processing: Multi-step reasoning with external tool calls
- Output: Structured findings + confidence scores + next actions
- Communication: JSON messages to other agents via orchestrator

### Data Flow

1. Document upload → OCR Service → Parser → Form state
2. Form submit → Trigger all agents in parallel
3. Agents query APIs, scrape data, analyze patterns
4. Intermediate findings shared via message bus
5. Risk Synthesizer awaits all reports
6. Final decision persisted with full audit trail

---

## Key Features

### Differentiated Capabilities

**Adaptive Investigation Depth**
System adjusts scrutiny based on initial findings. High-risk patterns trigger deeper investigations automatically.

**Inter-Agent Learning**
Agents learn from collective patterns. Financial anomalies inform what Digital Forensics searches for. Privacy violations correlate with other risk factors.

**Evidence-Based Decisions**
Every risk score backed by specific evidence. Admins see exact documents, web pages, or data points that triggered flags.

**PII Auto-Protection**
Privacy Guardian operates independently, masking sensitive data before human review. Reduces liability exposure.

**Intelligent Form Parsing**
Parser understands context, not just regex. Handles varying document formats, infers missing data, validates consistency.

### NVIDIA Challenge Alignment

**Reasoning Beyond Single Prompts:**
- Agents conduct multi-step investigations with conditional logic
- Digital Forensics: "Found suspicious domain → scrape wayback archive → check historical employees → cross-reference LinkedIn"
- Financial Sleuth: "Tax ID valid → pull credit history → analyze payment patterns → detect anomalies"

**Workflow Orchestration:**
- Six agents coordinate without hardcoded sequences
- Dynamic routing based on vendor type (SaaS company gets different security checks than manufacturer)
- Escalation paths trigger when thresholds crossed

**External Tool Integration:**
- OCR for document processing
- Web scraping for digital footprint
- API calls to financial databases
- Social media analysis
- Domain reputation services

**Clear Practical Value:**
- Reduces onboarding time by 75% (weeks to days)
- Catches fraud patterns invisible to manual review
- Scales across unlimited vendors without hiring
- Creates defensible audit trails for regulatory compliance

---

## Success Metrics

### User Experience
- Form auto-fill accuracy: >85% of fields extracted correctly
- Vendor submission time: <10 minutes (vs. 45 mins manual)
- Admin review time: <15 minutes per vendor (vs. 2-4 hours)

### Business Impact
- Onboarding cycle: <24 hours (vs. 2-6 weeks)
- Fraud detection rate: >95% of known patterns caught
- False positive rate: <10% requiring human override
- Cost per onboarding: 90% reduction vs. manual process

### Technical Performance
- OCR processing: <30 seconds per document
- Agent investigation: Complete within 4 hours
- Dashboard real-time updates: <2 second latency
- System uptime: 99.5%+ availability

---

## Goldman Sachs Challenge Requirements

### Secure Onboarding Hub Components

**Onboarding Portal:** ✓ Document upload with dynamic form  
**Automated Workflow:** ✓ Agent orchestration with routing  
**Security Assessment:** ✓ Compliance Orchestrator validates controls  
**Privacy Module:** ✓ Privacy Guardian with PII masking  
**Fraud Detection:** ✓ Financial Sleuth + Digital Forensics  
**Audit Dashboard:** ✓ Mission Control with reporting  

### Baseline Security Controls Validation

System validates vendor compliance with:
- Identity & Access Management (MFA, SSO)
- Encryption standards (AES-256, TLS 1.3)
- Logging & monitoring capabilities
- Network security (firewalls, IDS/IPS)
- Incident response procedures

Compliance Orchestrator generates custom checklists based on vendor service type and adapts questions based on responses.

---

## NVIDIA Challenge Requirements

### Intelligent Agent Capabilities

**Planning:** Agents break complex investigations into subtasks. Digital Forensics plans scraping strategy based on discovered site structure.

**Execution:** Autonomous API calls, web scraping, data analysis without human intervention.

**Adaptation:** Investigation depth adjusts based on findings. Clean initial results → fast-track approval. Red flags → extended scrutiny.

**Communication:** JSON-based inter-agent messages. Example: Financial Sleuth alerts Risk Synthesizer of credit default → Risk Synthesizer requests Digital Forensics deep dive.

### Multi-Step Workflow Example

Financial Sleuth Agent investigating Tax ID:
1. Validate format and checksum
2. Query IRS business entity database
3. Cross-reference with state registration
4. Check credit bureau for payment history
5. Detect anomalies in reported vs. actual data
6. If discrepancy found → message Digital Forensics for address verification
7. Compile evidence-backed report with confidence score

Each step involves conditional logic, external API calls, and reasoning about next actions.

---

## Competitive Advantage

**vs. Traditional Workflow Tools:** We don't just route forms, we investigate like fraud analysts.

**vs. RPA Solutions:** Agents reason and adapt, not rigid script execution.

**vs. Manual Review:** 24-hour turnaround, catches subtle patterns, scales infinitely.

**vs. Single-Agent AI:** Specialized expertise + collaboration beats generalist approach.

---

## Implementation Phases

### Phase 1: Current State (MVP for Hackathon)
- OCR document upload and parsing
- Form auto-fill with confidence indicators
- Simulated agent status (frontend only)
- Admin dashboard with mock data
- Goldman Sachs design system

### Phase 2: Agent Intelligence (Post-Hackathon)
- NVIDIA Nemotron integration for all 6 agents
- Real API calls to data sources
- Actual inter-agent communication
- Machine learning for fraud pattern detection
- Audit trail persistence

### Phase 3: Enterprise Scale (Production)
- Multi-tenant architecture
- Custom agent configurations per client
- Historical learning from past decisions
- Regulatory compliance reporting
- SLA guarantees and uptime monitoring

---

## OVERNIGHT SPRINT: Building Full Agent System for Morning Demo

### Current State
**Working:** OCR upload, form auto-fill, complete UI  
**Missing:** Real agent intelligence, actual investigations, risk scoring

### Target: ALL 6 AGENTS WORKING BY MORNING

---

## HOUR-BY-HOUR BUILD PLAN (10-12 hours)

### HOUR 1-2: Foundation Setup (CRITICAL - DO FIRST)

**Task 1.1: NVIDIA NIM Integration (45 min)**
- Create `src/services/nvidiaService.js`
- Get NVIDIA NIM API key from build.nvidia.com
- Test basic prompt/response with Nemotron model
- Create reusable `callAgent(systemPrompt, userPrompt)` function

**Task 1.2: Agent Orchestrator (45 min)**
- Create `src/services/agentOrchestrator.js`
- Function: `investigateVendor(vendorData)` runs all 6 agents in parallel
- Returns: `{ agentResults, riskScore, recommendations }`
- Store results in localStorage for persistence

**Task 1.3: Message Bus (30 min)**
- Create `src/services/messageBus.js`
- Simple event emitter for agent-to-agent messages
- Store messages in array for UI display

---

### HOUR 3-6: BUILD ALL 6 AGENTS (PARALLEL - MOST CRITICAL)

**Each agent = 30-40 min max, keep it simple but functional**

**Agent 1: Digital Forensics (40 min)**
File: `src/agents/digitalForensicsAgent.js`

Simplified approach:
- Take company website from form data
- Use NVIDIA to analyze if URL looks legitimate
- Check domain with simple fetch (is it live?)
- Return findings with confidence score
- SKIP web scraping for now (too time consuming)

**Agent 2: Privacy Guardian (30 min)**
File: `src/agents/privacyGuardianAgent.js`

Use existing OCR text:
- Regex scan for PII: SSN, credit cards, phone with area code
- Count PII instances
- Mark fields that had PII detected
- Return privacy score (fewer PII = better)

**Agent 3: Financial Sleuth (40 min)**
File: `src/agents/financialSleuthAgent.js`

Simplified:
- Validate Tax ID format (XX-XXXXXXX)
- Check if revenue makes sense for years in business
- Use NVIDIA to analyze if financial claims are realistic
- Return financial health score

**Agent 4: Compliance Orchestrator (40 min)**
File: `src/agents/complianceOrchestratorAgent.js`

Simple rules-based:
- Check if certifications mentioned (SOC2, ISO)
- Validate insurance info present
- Use NVIDIA to assess if compliance claims match business type
- Return compliance score

**Agent 5: Intake Agent (30 min)**
File: `src/agents/intakeAgent.js`

Data validation:
- Check all required fields filled
- Validate email format
- Validate phone format
- Flag missing critical info
- Return completeness score

**Agent 6: Risk Synthesizer (40 min)**
File: `src/agents/riskSynthesizerAgent.js`

Aggregate all findings:
- Weighted average of all agent scores
- Detect contradictions (claimed SOC2 but no website)
- Generate final risk score 0-100
- Return recommendation: approve/review/reject

---

### HOUR 7: Risk Scoring Algorithm (1 hour)

**File: `src/services/riskCalculator.js`**

Simple weighted formula:
```
Risk Score = 
  (100 - Digital Forensics score) * 0.25 +
  (100 - Financial score) * 0.25 +
  (100 - Compliance score) * 0.20 +
  (Privacy issues * 5) +
  (Missing fields * 10)

0-35: Green (auto-approve)
36-70: Yellow (human review)
71-100: Red (reject)
```

Update `VendorDetail.jsx` to use calculated risk score instead of hardcoded

---

### HOUR 8: Inter-Agent Communication (1 hour)

**Make agents actually talk to each other**

Pattern in each agent:
```javascript
if (suspiciousPattern) {
  messageBus.emit('alert', {
    from: 'Financial Sleuth',
    to: 'Digital Forensics',
    message: 'Suspicious Tax ID - verify domain authenticity',
    priority: 'high'
  })
}
```

Update `VendorDetail.jsx` Agent Comms tab to show real messages from localStorage

---

### HOUR 9: Connect Agents to UI (1 hour)

**Wire everything together**

**VendorOnboarding.jsx:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  setIsProcessing(true)
  
  // Run all agents
  const results = await agentOrchestrator.investigateVendor(formData)
  
  // Update UI with real findings
  setAgentStatus(results.agentStatus)
  setRiskScore(results.riskScore)
  
  // Store for admin dashboard
  localStorage.setItem(`vendor-${Date.now()}`, JSON.stringify({
    ...formData,
    ...results,
    timestamp: new Date()
  }))
  
  setIsProcessing(false)
  setCurrentStage(3)
}
```

**AdminDashboard.jsx:**
Load vendors from localStorage, show real risk scores

**VendorDetail.jsx:**
Load specific vendor data, show real agent findings in each tab

---

### HOUR 10: Real-Time Updates (1 hour)

**Simple polling approach (faster than WebSocket)**

**In agent orchestrator:**
```javascript
const activityLog = []

function logActivity(agent, action) {
  activityLog.push({
    id: Date.now(),
    agent,
    action,
    time: new Date()
  })
  localStorage.setItem('agentActivity', JSON.stringify(activityLog))
}
```

**In AdminDashboard.jsx:**
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    const activity = JSON.parse(localStorage.getItem('agentActivity') || '[]')
    setActivities(activity.slice(0, 20)) // Latest 20
  }, 2000)
  return () => clearInterval(interval)
}, [])
```

---

### HOUR 11: Testing & Bug Fixes (1 hour)

**Test full flow:**
1. Upload sample document
2. Verify OCR works
3. Submit form
4. Watch agents run (should take 10-30 seconds)
5. Check dashboard shows activity
6. Click vendor card
7. Verify all tabs show real data
8. Check risk score makes sense

**Fix common issues:**
- NVIDIA API timeout → add 30 sec timeout
- Missing data → handle gracefully
- UI breaking → add error boundaries
- Scores not calculating → check formula

---

### HOUR 12: Polish & Demo Prep (1 hour)

**Make demo smooth:**
1. Create 2-3 test vendors with different risk levels
2. Add loading states everywhere
3. Improve error messages
4. Test demo flow 3 times
5. Prepare fallback if API fails during demo

**Demo script:**
1. "Here's our vendor onboarding portal" (show upload)
2. Upload document, show OCR auto-fill
3. "Watch our 6 AI agents investigate in parallel" (submit)
4. Switch to admin dashboard (show live activity feed)
5. Click vendor card (show detailed findings)
6. "Each agent did real investigation" (show tabs)
7. "Final risk score based on evidence" (show score breakdown)

---

## TECHNICAL SHORTCUTS FOR SPEED

**NVIDIA Prompts (Keep Simple):**
```
You are a {agent_type} investigating vendor {company_name}.

Data: {vendor_data}

Analyze and return JSON:
{
  "findings": ["finding 1", "finding 2"],
  "riskIndicators": ["risk 1", "risk 2"],
  "score": 0-100,
  "confidence": "high/medium/low"
}
```

**API Calls (Minimize):**
- Use NVIDIA for analysis (already have key)
- Skip external APIs if no free tier immediately available
- Use NVIDIA to "fake" external checks ("analyze if this domain seems legitimate")
- Focus on making it WORK, not perfect

**Storage:**
- localStorage for everything (no backend needed)
- JSON.stringify/parse for persistence
- Clear localStorage when testing

**Error Handling:**
```javascript
try {
  const result = await callAgent(...)
  return result
} catch (error) {
  console.error(error)
  return { findings: ['Error occurred'], score: 50, confidence: 'low' }
}
```

---

## PRIORITY ORDER

**MUST HAVE (Hours 1-9):**
1. NVIDIA integration working
2. All 6 agents returning results
3. Risk score calculating
4. UI showing real data

**SHOULD HAVE (Hours 10-11):**
5. Real-time dashboard updates
6. Agent communication messages
7. Testing and bug fixes

**NICE TO HAVE (Hour 12):**
8. Polish and loading states
9. Multiple demo scenarios
10. Fallback handling

---

## IF RUNNING OUT OF TIME

**Simplify to 3 agents:**
- Digital Forensics (domain check)
- Privacy Guardian (PII detection)
- Risk Synthesizer (aggregate scores)

**Skip:**
- Inter-agent communication (just log messages, don't act on them)
- Real-time updates (just refresh page)
- Evidence links (just show findings as text)

**STILL DEMO-READY because:**
- OCR works (impressive)
- Agents actually run and analyze
- Risk score is real
- UI is beautiful
- Shows multi-agent orchestration

---

## REALITY CHECK

**You WILL finish if you:**
- Start with NVIDIA integration immediately
- Keep each agent under 40 minutes
- Use NVIDIA for analysis, skip complex APIs
- Focus on making it WORK, then polish

**You WILL NOT finish if you:**
- Try to perfect each agent
- Add web scraping/complex APIs
- Build backend server
- Overthink architecture

**SHIP > PERFECT**

---

## Risk Mitigation

**API Rate Limits:** Implement caching, queue systems for batch processing  
**False Positives:** Human review workflow for borderline cases  
**Data Privacy:** Encrypt at rest, mask PII before storage, compliance certifications  
**Agent Hallucinations:** Require evidence citations, confidence thresholds for auto-decisions  
**System Downtime:** Graceful degradation to manual review if agents unavailable  

---

## Success Criteria for Hackathon

### Demonstration Requirements

**Functional:**
- End-to-end vendor upload to approval flow
- OCR auto-fill working with real documents
- Agent status updates showing parallel investigation
- Admin dashboard with detailed vendor view
- Risk score calculation with evidence

**Technical:**
- Clean Goldman Sachs aesthetic throughout
- Responsive design across devices
- No critical bugs in demo path
- Smooth transitions and loading states

**Presentation:**
- Clear problem/solution narrative
- Live demo showing document upload
- Highlight agent orchestration concept
- Explain fraud detection capabilities
- Connect to both Goldman Sachs and NVIDIA challenges

### Judging Criteria Alignment

**Goldman Sachs:**
- Addresses manual onboarding inefficiency
- Demonstrates security validation
- Shows PII protection
- Clear audit capabilities

**NVIDIA:**
- Multi-agent system with specialized roles
- Reasoning and workflow orchestration
- External tool integration (OCR + future APIs)
- Real-world business impact
- Scalable architecture

---

## Future Enhancements

**Agent Capabilities:**
- Legal Risk Agent analyzing contract terms and liability exposure
- Geopolitical Agent assessing sanctions and trade restrictions
- ESG Agent evaluating sustainability and ethics claims

**Learning Systems:**
- Historical pattern analysis improving fraud detection
- Industry-specific risk models
- Automated policy recommendations

**Integration Expansion:**
- ERP system connectors (SAP, Oracle)
- Procurement platform APIs (Coupa, Ariba)
- Identity verification services (Onfido, Jumio)

**User Features:**
- Vendor self-service portal with status tracking
- Mobile app for document capture
- Multi-language support
- White-label customization for clients

---

## Conclusion

Adaptive Fraud Hunter transforms vendor onboarding from manual bottleneck to intelligent automation. By orchestrating specialized AI agents that investigate, communicate, and decide autonomously, we deliver Goldman Sachs-grade security with startup-speed execution. The system demonstrates NVIDIA's vision for agentic AI: reasoning beyond prompts, orchestrating complex workflows, integrating external tools, and solving real-world problems with measurable impact.

**Core Value Proposition:** What takes security teams weeks and often misses sophisticated fraud, our AI agents complete in hours with higher accuracy—all while reducing costs by 90% and creating defensible audit trails.

