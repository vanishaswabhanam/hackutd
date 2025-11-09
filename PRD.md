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

## Development Roadmap: Building Real Agent Intelligence

### Current State Assessment

**What's Working:**
- OCR document upload and parsing (real API integration)
- Form auto-fill with confidence indicators
- Complete UI for all 3 pages with Goldman Sachs styling
- Frontend state management and routing
- Mock data displaying properly in dashboards

**What's Simulated:**
- Agent investigations (UI shows status but no real processing)
- Risk scoring (hardcoded values, not calculated)
- Inter-agent communication (displayed but not happening)
- Background checks (no actual API calls to data sources)

### Implementation Strategy: Incremental Build Without Breaking UI

**Principle:** Build backend agent logic separately, then connect to existing frontend through well-defined interfaces. UI stays functional throughout development.

---

### Sprint 1: Agent Infrastructure (2-3 days)

**Goal:** Set up NVIDIA NIM API and create agent orchestration framework

**Tasks:**
1. **Create Agent Service Layer**
   - New file: `src/services/agentOrchestrator.js`
   - Defines agent interface: `runAgent(agentType, vendorData)` returns `{ findings, confidence, evidence, nextSteps }`
   - Manages agent state and coordination
   - Handles parallel execution with Promise.all

2. **NVIDIA NIM Integration**
   - New file: `src/services/nvidiaService.js`
   - Set up NVIDIA NIM API credentials
   - Create prompt templates for each agent type
   - Implement retry logic and error handling

3. **Message Bus for Inter-Agent Communication**
   - New file: `src/services/messageBus.js`
   - Event-driven system for agent-to-agent messages
   - Queue system for dependent investigations
   - Real-time updates pushed to frontend via WebSocket or polling

**Integration Point:** VendorOnboarding.jsx handleSubmit() calls agentOrchestrator.startInvestigation(formData) but UI continues working with fallback to mock data if API fails

---

### Sprint 2: Individual Agent Implementation (3-4 days)

**Goal:** Build each agent's investigation logic one at a time

**Agent 1: Digital Forensics (Start Here - Easiest to Demo)**

File: `src/agents/digitalForensicsAgent.js`

Tasks:
- Scrape company website using Puppeteer or Cheerio
- Extract: domain age via WHOIS API, SSL cert info, meta tags, contact info
- Check social media APIs (LinkedIn public profiles, Twitter/X)
- Domain reputation via VirusTotal API (free tier)
- Return structured findings with evidence URLs

Prompt Engineering:
```
Analyze this company data and web presence:
Company: {name}, Website: {url}, Industry: {type}

Your investigation should:
1. Verify website authenticity (look for stock photos, generic content)
2. Check domain age and hosting patterns
3. Analyze social media presence consistency
4. Identify red flags (missing contact info, suspicious patterns)

Return JSON: { findings: [], riskIndicators: [], confidenceScore: 0-100, evidence: [] }
```

**Agent 2: Privacy Guardian (Parallel with Forensics)**

File: `src/agents/privacyGuardianAgent.js`

Tasks:
- Enhance existing OCR parsing to detect PII patterns
- SSN: \d{3}-\d{2}-\d{4}
- Credit cards: \d{4}-\d{4}-\d{4}-\d{4}
- Addresses with regex for street patterns
- Auto-mask detected PII before storing
- Generate privacy report with masked count

**Agent 3: Financial Sleuth**

File: `src/agents/financialSleuthAgent.js`

Tasks:
- Tax ID validation via IRS TIN matching (if available) or checksum
- Business entity search via OpenCorporates API (free)
- SEC EDGAR search for public filings
- Credit data via Experian/Equifax APIs (may need sandbox accounts)
- Pattern analysis: claimed revenue vs. company age vs. employee count

**Agent 4: Compliance Orchestrator**

File: `src/agents/complianceOrchestratorAgent.js`

Tasks:
- Generate dynamic questionnaire based on business type
- Check SOC2 registry (varies by auditor)
- ISO certification lookup APIs
- Validate security claims against industry standards
- Score compliance based on documentation provided

**Agent 5: Risk Synthesizer (Build Last)**

File: `src/agents/riskSynthesizerAgent.js`

Tasks:
- Aggregate all agent findings
- Weight risk factors: fraud signals (high), missing docs (medium), age (low)
- Detect contradictions across agent reports
- Calculate composite risk score: 0-100 scale
- Generate executive summary with evidence links
- Make approve/reject/escalate decision based on thresholds

**Integration Pattern for Each Agent:**

In VendorOnboarding.jsx:
```javascript
// After form submit
const results = await agentOrchestrator.investigate(formData)
setAgentStatus(results.agentUpdates) // Updates UI in real-time
```

In AdminDashboard.jsx:
```javascript
// Poll for updates every 2 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    const updates = await fetchAgentActivity()
    setActivities(updates)
  }, 2000)
}, [])
```

---

### Sprint 3: Inter-Agent Communication (1-2 days)

**Goal:** Agents trigger each other based on findings

**Implementation:**

File: `src/services/messageBus.js` enhancement

Pattern:
```javascript
// Financial Sleuth finds suspicious Tax ID
messageBus.emit('suspicious-entity', { 
  from: 'Financial Sleuth',
  to: 'Digital Forensics',
  priority: 'high',
  data: { taxId, reason: 'Invalid checksum' }
})

// Digital Forensics listens and acts
messageBus.on('suspicious-entity', async (msg) => {
  await deepDomainInvestigation(msg.data)
})
```

**Agent Communication Scenarios:**

1. Privacy Guardian finds excessive PII → Compliance Orchestrator checks security controls
2. Digital Forensics finds shell company signals → Financial Sleuth validates entity registration
3. Multiple red flags from any agent → Risk Synthesizer escalates to human review
4. All agents report clean → Risk Synthesizer auto-approves

**UI Integration:**

VendorDetail.jsx "Agent Comms" tab pulls real messages from:
```javascript
const comms = await fetchInterAgentMessages(vendorId)
// Display in chronological order with actual content
```

---

### Sprint 4: Real-Time Dashboard Updates (1 day)

**Goal:** Admin sees live agent activity as it happens

**Options:**

**Option A: WebSocket (Ideal for hackathon demo)**
- Set up simple WebSocket server
- Agents push events: `ws.send({ type: 'agent-update', agent: 'Digital Forensics', action: 'Scraping website' })`
- Frontend subscribes and updates UI instantly

**Option B: Polling (Easier implementation)**
- Backend stores agent events in memory array
- Frontend polls `/api/activity` every 2 seconds
- Append new activities to feed

**Implementation:**

In AdminDashboard.jsx:
```javascript
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3001')
  ws.onmessage = (event) => {
    const activity = JSON.parse(event.data)
    setActivities(prev => [activity, ...prev])
  }
}, [])
```

---

### Sprint 5: Risk Scoring Algorithm (1 day)

**Goal:** Calculate actual risk scores from agent findings

**Scoring Logic:**

File: `src/services/riskCalculator.js`

Formula:
```
Risk Score = weighted sum of:
- Domain age < 1 year: +20 points
- No social media presence: +15 points
- Tax ID invalid: +30 points (major flag)
- Missing insurance: +10 points
- No certifications: +5 points
- PII exposure in docs: +15 points
- Compliance gaps: +10 per gap
- Shell company indicators: +40 points

Thresholds:
0-35: Low risk (green) → Auto-approve
36-70: Medium risk (yellow) → Human review
71-100: High risk (red) → Reject or escalate
```

**Integration:**

VendorDetail.jsx displays calculated score with breakdown showing which factors contributed

---

### Sprint 6: Evidence Trail & Audit Log (1 day)

**Goal:** Every decision backed by evidence, full audit trail

**Implementation:**

File: `src/services/auditLogger.js`

Each agent logs:
- Timestamp
- Action taken
- Data sources accessed
- Findings discovered
- Evidence URLs/screenshots
- Reasoning for conclusion

Storage: localStorage for hackathon demo, database for production

UI shows:
- Timeline of agent actions with timestamps
- Clickable evidence links
- Export audit report as PDF

---

### Sprint 7: Error Handling & Polish (1 day)

**Goal:** Graceful degradation when APIs fail

**Patterns:**

1. **API Timeout:** If NVIDIA NIM takes >30 seconds, show "Agent investigating..." but continue
2. **Rate Limits:** Queue investigations, show estimated wait time
3. **Missing Data:** Agents report "Insufficient data" instead of failing
4. **Network Errors:** Fall back to partial investigation with lower confidence

**UI Indicators:**
- Loading spinners during processing
- "Agent encountered issue" badges
- Retry buttons for failed investigations
- Clear error messages for users

---

### Testing Strategy

**Unit Tests:**
- Each agent function with mock data
- Parser accuracy with various document formats
- Risk calculator with known scenarios

**Integration Tests:**
- Full vendor flow: upload → parse → investigate → score → display
- Agent communication triggers
- UI updates when agent status changes

**Demo Scenarios:**
1. **Clean vendor:** TechCorp (auto-approves, low risk)
2. **Suspicious vendor:** Fake company with red flags (high risk)
3. **Medium risk:** Missing some docs, needs review

---

### Deployment for Hackathon Demo

**Minimum Viable Demo:**
- Working OCR upload ✓ (already done)
- At least 2 agents with real logic (Digital Forensics + Privacy Guardian)
- Risk score calculation (even if simplified)
- Real-time dashboard updates (polling is fine)
- One full end-to-end demo path working perfectly

**Nice to Have:**
- All 6 agents implemented
- Inter-agent communication visible
- WebSocket real-time updates
- Evidence links clickable

**Can Skip for Demo:**
- Database persistence (use state/localStorage)
- Authentication
- Multi-tenant support
- Production hosting

---

### Development Timeline Estimate

**Aggressive (Hackathon pace): 7-10 days**
- 2 days: Agent infrastructure
- 3 days: Core agents (Forensics + Privacy + Financial)
- 1 day: Risk scoring
- 1 day: Real-time updates
- 1 day: Polish and testing

**Realistic (High quality): 2-3 weeks**
- All agents fully implemented
- Robust error handling
- Comprehensive testing
- Production-ready code

**Current to MVP: 3-5 days** (if focusing on demo path only)
- Digital Forensics agent (1 day)
- Privacy Guardian enhancement (1 day)
- Risk scoring (1 day)
- Dashboard real-time (1 day)
- Testing and polish (1 day)

---

### Critical Path for Success

**Must Have:**
1. One fully working agent that does real investigation (Digital Forensics recommended)
2. Risk score that changes based on findings
3. Dashboard shows real activity updates
4. End-to-end demo works without crashes

**Should Have:**
2-3 agents working
Inter-agent communication demo
Evidence links

**Could Have:**
All 6 agents
Full audit trail
Advanced error handling

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

