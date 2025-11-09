# Adaptive Fraud Hunter - Secure Onboarding Platform

A comprehensive AI-powered vendor and client onboarding system built with React, featuring multiple specialized agents for security assessment, fraud detection, and compliance verification.

## 🎯 Features

### 1. **Vendor Onboarding Portal** (`/`)
- Conversational chat interface with AI Intake Agent
- Real-time document upload with drag-and-drop
- Automatic PII detection and masking
- Progress tracking through onboarding stages
- Live agent status monitoring

### 2. **Admin Mission Control Dashboard** (`/admin`)
- Real-time activity feed of all agent actions
- Color-coded vendor risk assessment cards
- Live agent status panel showing 6 specialized agents:
  - 📋 Intake Agent
  - 🔍 Digital Forensics Agent
  - 💰 Financial Sleuth Agent
  - ⚖️ Compliance Orchestrator Agent
  - 🔒 Privacy Guardian Agent
  - 🎯 Risk Synthesizer Agent
- Quick search and filtering
- Stats dashboard with key metrics

### 3. **Vendor Detail View** (`/admin/vendor/:id`)
- Comprehensive timeline of agent activities
- Risk score visualization with circular gauge
- Detailed reports from each agent:
  - Digital Forensics findings
  - Financial analysis
  - Compliance assessment
  - Privacy scan results
- Inter-agent communication logs
- Approve/Reject/Request Info actions

## 🎨 Design

Built using **Goldman Sachs design system**:
- Primary color: `#7297c5` (GS Blue)
- Typography: Libre Baskerville (serif) for headings, Open Sans (sans) for body
- Clean, professional, minimalist aesthetic
- Smooth transitions and modern UI patterns

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
HACKUTD/
├── src/
│   ├── pages/
│   │   ├── VendorOnboarding.jsx    # Public vendor portal
│   │   ├── AdminDashboard.jsx      # Admin mission control
│   │   └── VendorDetail.jsx        # Detailed vendor view
│   ├── App.jsx                      # Main app with routing
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles with Tailwind
├── index.html                       # HTML template
├── tailwind.config.js               # Tailwind configuration
├── vite.config.js                   # Vite configuration
└── package.json                     # Dependencies

```

## 🔗 Routes

- `/` - Vendor Onboarding Portal (public-facing)
- `/admin` - Admin Dashboard (Mission Control)
- `/admin/vendor/:id` - Vendor Detail View

## 🤖 AI Agents

The system uses 6 specialized AI agents that work together:

1. **Intake Agent** - Conversational onboarding, collects vendor information
2. **Digital Forensics Agent** - Domain reputation, web presence, incident history
3. **Financial Sleuth Agent** - Credit checks, financial analysis, payment history
4. **Compliance Orchestrator Agent** - Security controls, IAM, encryption, logging
5. **Privacy Guardian Agent** - PII detection, data masking, privacy compliance
6. **Risk Synthesizer Agent** - Aggregates all findings into composite risk score

## 💡 Key Technologies

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool and dev server

## 🎭 Mock Data

The app includes realistic dummy data to demonstrate functionality:
- Simulated chat conversations with timing
- Random activity generation in dashboard
- Multiple vendor profiles with varying risk levels
- Detailed agent reports with scores and findings

## 🔒 Security Features Demonstrated

- PII detection and masking
- Document scanning
- Multi-stage approval workflow
- Agent-based security assessments
- Risk scoring and visualization
- Audit trail with timeline

## 📝 Next Steps for Production

To make this production-ready, you would need to:

1. Connect to NVIDIA NIM API for real AI agent processing
2. Add backend API for data persistence
3. Implement authentication and authorization
4. Add real-time WebSocket connections for live updates
5. Integrate with actual security scanning tools
6. Connect to financial data providers (credit bureaus, etc.)
7. Add document OCR and analysis
8. Implement email notification system

## 🏆 HackUTD Challenges Addressed

This project addresses both challenge tracks:

### Goldman Sachs Challenge
- ✅ Automated onboarding workflow
- ✅ Security assessment module
- ✅ Privacy module with PII detection
- ✅ Fraud detection and risk scoring
- ✅ Audit and reporting dashboard

### NVIDIA Challenge
- ✅ Multi-agent system with 6 specialized agents
- ✅ Workflow orchestration across multiple steps
- ✅ Agent reasoning and decision making
- ✅ Inter-agent communication
- ✅ Real-world business application

---

Built for HackUTD 2025 🎓

