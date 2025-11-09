import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  ArrowLeft, Shield, AlertTriangle, CheckCircle, 
  FileText, Activity, MessageSquare, Clock,
  XCircle, Mail, Download, Eye
} from 'lucide-react'

const VendorDetail = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('timeline')

  // Mock vendor data
  const vendor = {
    id: parseInt(id),
    name: 'TechCorp Solutions',
    status: 'under-review',
    riskScore: 35,
    riskLevel: 'low',
    submittedDate: '2025-11-09',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, San Francisco, CA 94105',
    businessType: 'Software Development',
    yearsInBusiness: 8,
  }

  const timeline = [
    {
      id: 1,
      agent: 'Intake Agent',
      icon: '📋',
      action: 'Vendor submission received',
      details: 'All required documents uploaded successfully',
      time: '2025-11-09 09:00 AM',
      status: 'completed'
    },
    {
      id: 2,
      agent: 'Privacy Guardian',
      icon: '🔒',
      action: 'PII detection scan completed',
      details: 'Found and masked 8 PII fields across 3 documents',
      time: '2025-11-09 09:15 AM',
      status: 'completed'
    },
    {
      id: 3,
      agent: 'Digital Forensics',
      icon: '🔍',
      action: 'Domain reputation check',
      details: 'Domain age: 8 years. No suspicious activity detected.',
      time: '2025-11-09 09:30 AM',
      status: 'completed'
    },
    {
      id: 4,
      agent: 'Financial Sleuth',
      icon: '💰',
      action: 'Credit and financial analysis',
      details: 'Credit score: 720. Financial statements verified.',
      time: '2025-11-09 10:00 AM',
      status: 'in-progress'
    },
    {
      id: 5,
      agent: 'Compliance Orchestrator',
      icon: '⚖️',
      action: 'Baseline security controls check',
      details: 'Pending completion of financial review',
      time: 'Queued',
      status: 'pending'
    },
    {
      id: 6,
      agent: 'Risk Synthesizer',
      icon: '🎯',
      action: 'Final risk assessment',
      details: 'Awaiting all agent reports',
      time: 'Queued',
      status: 'pending'
    },
  ]

  const forensicsReport = {
    domain: {
      age: '8 years 3 months',
      reputation: 'Excellent',
      ssl: 'Valid (expires 2026-03-15)',
      blacklisted: false,
    },
    socialMedia: {
      linkedin: 'Active (1,200+ employees)',
      twitter: 'Active (5,400 followers)',
      verified: true,
    },
    webPresence: {
      traffic: 'High (500K+ monthly visits)',
      backlinks: '1,200+ quality backlinks',
      contentAge: 'Regularly updated',
    },
    incidents: {
      dataBreaches: 0,
      lawsuits: 0,
      complaints: 2,
      resolved: 2,
    },
    score: 92,
  }

  const financialReport = {
    creditScore: 720,
    creditRating: 'Good',
    annualRevenue: '$12.5M',
    yearlyGrowth: '+18%',
    debtToEquity: '0.45',
    paymentHistory: 'Excellent (98% on-time)',
    bankruptcies: 0,
    taxCompliance: 'Current',
    bankReferences: 2,
    score: 85,
  }

  const complianceReport = {
    identityManagement: {
      status: 'compliant',
      details: 'MFA enabled, SSO implemented',
    },
    encryption: {
      status: 'compliant',
      details: 'AES-256 for data at rest, TLS 1.3 for transit',
    },
    logging: {
      status: 'compliant',
      details: 'Centralized logging with 90-day retention',
    },
    networkSecurity: {
      status: 'partial',
      details: 'Firewall configured, IDS/IPS pending verification',
    },
    accessControl: {
      status: 'compliant',
      details: 'RBAC implemented with quarterly audits',
    },
    score: 78,
  }

  const privacyReport = {
    piiFields: 8,
    piiMasked: 8,
    piiTypes: ['SSN', 'Email', 'Phone', 'Address', 'DOB'],
    dataCategories: ['Customer Data', 'Employee Records', 'Financial Info'],
    retention: 'Compliant with GDPR/CCPA',
    encryption: 'All PII encrypted at rest',
    accessLogs: 'Enabled with audit trail',
    score: 95,
  }

  const interAgentComms = [
    {
      id: 1,
      from: 'Digital Forensics',
      to: 'Financial Sleuth',
      message: 'Found clean domain history. Recommend standard financial review.',
      time: '09:35 AM',
    },
    {
      id: 2,
      from: 'Privacy Guardian',
      to: 'Compliance Orchestrator',
      message: 'All PII successfully masked. Safe to proceed with compliance checks.',
      time: '09:20 AM',
    },
    {
      id: 3,
      from: 'Financial Sleuth',
      to: 'Risk Synthesizer',
      message: 'Financial health looks good. Minor concerns with debt ratio, but within acceptable range.',
      time: '10:15 AM',
    },
  ]

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
      case 'pending': return <Clock className="w-5 h-5 text-gray-400" />
      default: return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/admin" className="mr-6 hover:opacity-70 transition-opacity">
                <ArrowLeft className="w-5 h-5 text-gs-navy" />
              </Link>
              <div>
                <h1 className="text-3xl font-serif font-normal text-gs-navy tracking-tight">{vendor.name}</h1>
                <p className="text-sm text-gray-500 mt-2 font-light">ID #{vendor.id} • Submitted {vendor.submittedDate}</p>
              </div>
            </div>
            <Shield className="text-gs-navy w-8 h-8" />
          </div>
        </div>
      </header>

      {/* Risk Score Header */}
      <div className="bg-white border-b border-gray-100 px-12 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-16">
            {/* Risk Score */}
            <div>
              <p className="text-7xl font-serif font-normal text-gs-blue">{vendor.riskScore}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-2">Risk Assessment</p>
            </div>

            {/* Vendor Info */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Business Type</p>
                <p className="font-normal text-gs-navy">{vendor.businessType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Experience</p>
                <p className="font-normal text-gs-navy">{vendor.yearsInBusiness} years</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
                <p className="font-normal text-gs-navy">{vendor.status.replace('-', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border border-gray-300 text-gs-navy text-sm hover:border-gs-navy transition-colors">
              Request Info
            </button>
            <button className="px-5 py-2.5 bg-white border border-gray-300 text-gs-navy text-sm hover:border-gs-navy transition-colors">
              Reject
            </button>
            <button className="px-5 py-2.5 bg-gs-navy text-white text-sm hover:opacity-90 transition-opacity">
              Approve
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 py-12 bg-white">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Timeline */}
          <div className="col-span-4">
            <div className="border-l-2 border-gs-blue pl-6">
              <div className="mb-8">
                <p className="text-xs text-gs-blue uppercase tracking-wider font-medium mb-4">Progress</p>
                <h2 className="font-serif text-2xl font-normal text-gs-navy">Agent Activity</h2>
              </div>
              <div>
                <div className="space-y-8">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="border-b border-gray-100 pb-6 last:border-0">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{event.agent}</p>
                      <p className="text-sm text-gray-900 mb-2 leading-relaxed">{event.action}</p>
                      <p className="text-xs text-gray-600 mb-3">{event.details}</p>
                      <p className="text-xs text-gray-400">{event.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reports */}
          <div className="col-span-8">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`pb-4 text-sm transition-colors ${
                    activeTab === 'timeline'
                      ? 'border-b-2 border-gs-blue text-gs-blue font-medium'
                      : 'text-gray-500 hover:text-gs-blue'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('forensics')}
                  className={`pb-4 text-sm transition-colors ${
                    activeTab === 'forensics'
                      ? 'border-b-2 border-gs-blue text-gs-blue font-medium'
                      : 'text-gray-500 hover:text-gs-blue'
                  }`}
                >
                  Digital Forensics
                </button>
                <button
                  onClick={() => setActiveTab('financial')}
                  className={`pb-4 text-sm transition-colors ${
                    activeTab === 'financial'
                      ? 'border-b-2 border-gs-blue text-gs-blue font-medium'
                      : 'text-gray-500 hover:text-gs-blue'
                  }`}
                >
                  Financial
                </button>
                <button
                  onClick={() => setActiveTab('compliance')}
                  className={`pb-4 text-sm transition-colors ${
                    activeTab === 'compliance'
                      ? 'border-b-2 border-gs-blue text-gs-blue font-medium'
                      : 'text-gray-500 hover:text-gs-blue'
                  }`}
                >
                  Compliance
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`pb-4 text-sm transition-colors ${
                    activeTab === 'privacy'
                      ? 'border-b-2 border-gs-blue text-gs-blue font-medium'
                      : 'text-gray-500 hover:text-gs-blue'
                  }`}
                >
                  Privacy
                </button>
                <button
                  onClick={() => setActiveTab('comms')}
                  className={`pb-4 text-sm transition-colors ${
                    activeTab === 'comms'
                      ? 'border-b-2 border-gs-blue text-gs-blue font-medium'
                      : 'text-gray-500 hover:text-gs-blue'
                  }`}
                >
                  Agent Comms
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {/* Overview Tab */}
              {activeTab === 'timeline' && (
                <div className="space-y-12">
                  <div>
                    <p className="text-xs text-gs-blue uppercase tracking-wider mb-4">Contact Information</p>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gs-navy">{vendor.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm text-gs-navy">{vendor.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-sm text-gs-navy">{vendor.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-12">
                    <p className="text-xs text-gs-blue uppercase tracking-wider mb-6">Assessment Scores</p>
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gs-navy">Digital Forensics</span>
                          <span className="text-lg font-serif text-gs-blue">{forensicsReport.score}</span>
                        </div>
                      </div>
                      <div className="border-b border-gray-100 pb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gs-navy">Financial Sleuth</span>
                          <span className="text-lg font-serif text-gs-blue">{financialReport.score}</span>
                        </div>
                      </div>
                      <div className="border-b border-gray-100 pb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gs-navy">Compliance Orchestrator</span>
                          <span className="text-lg font-serif text-gs-blue">{complianceReport.score}</span>
                        </div>
                      </div>
                      <div className="border-b border-gray-100 pb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gs-navy">Privacy Guardian</span>
                          <span className="text-lg font-serif text-gs-blue">{privacyReport.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Forensics Tab */}
              {activeTab === 'forensics' && (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gs-blue uppercase tracking-wider mb-2">Report</p>
                      <h3 className="font-serif text-2xl font-normal text-gs-navy">Digital Forensics</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-serif text-gs-blue">{forensicsReport.score}</p>
                      <p className="text-xs text-gray-500 mt-1">Assessment Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="border-t-2 border-gs-blue pt-4">
                      <h4 className="text-sm font-medium text-gs-navy mb-4">
                        Domain Analysis
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">Age</span>
                          <span className="text-gs-navy">{forensicsReport.domain.age}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">Reputation</span>
                          <span className="text-gs-navy">{forensicsReport.domain.reputation}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">SSL Status</span>
                          <span className="text-gs-navy">{forensicsReport.domain.ssl}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Blacklisted</span>
                          <span className="text-gs-navy">No</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-gs-blue pt-4">
                      <h4 className="text-sm font-medium text-gs-navy mb-4">
                        Social Media Presence
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">LinkedIn</span>
                          <span className="text-gs-navy">{forensicsReport.socialMedia.linkedin}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">Twitter</span>
                          <span className="text-gs-navy">{forensicsReport.socialMedia.twitter}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Verified</span>
                          <span className="text-gs-navy">Yes</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-gs-blue pt-4">
                      <h4 className="text-sm font-medium text-gs-navy mb-4">
                        Web Presence
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">Traffic</span>
                          <span className="text-gs-navy">{forensicsReport.webPresence.traffic}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">Backlinks</span>
                          <span className="text-gs-navy">{forensicsReport.webPresence.backlinks}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Content</span>
                          <span className="text-gs-navy">{forensicsReport.webPresence.contentAge}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-gs-blue pt-4">
                      <h4 className="text-sm font-medium text-gs-navy mb-4">
                        Incident History
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">Data Breaches</span>
                          <span className="text-gs-navy">{forensicsReport.incidents.dataBreaches}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">Lawsuits</span>
                          <span className="text-gs-navy">{forensicsReport.incidents.lawsuits}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">Complaints</span>
                          <span className="text-gs-navy">{forensicsReport.incidents.complaints}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Resolved</span>
                          <span className="text-gs-navy">{forensicsReport.incidents.resolved}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Tab */}
              {activeTab === 'financial' && (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gs-blue uppercase tracking-wider mb-2">Report</p>
                      <h3 className="font-serif text-2xl font-normal text-gs-navy">Financial Analysis</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-serif text-gs-blue">{financialReport.score}</p>
                      <p className="text-xs text-gray-500 mt-1">Assessment Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gs-gray p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Credit Profile</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Credit Score:</span>
                          <span className="font-medium text-green-600">{financialReport.creditScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <span className="font-medium">{financialReport.creditRating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment History:</span>
                          <span className="font-medium">{financialReport.paymentHistory}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gs-gray p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Financial Health</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual Revenue:</span>
                          <span className="font-medium">{financialReport.annualRevenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Growth:</span>
                          <span className="font-medium text-green-600">{financialReport.yearlyGrowth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Debt/Equity:</span>
                          <span className="font-medium">{financialReport.debtToEquity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance Tab */}
              {activeTab === 'compliance' && (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gs-blue uppercase tracking-wider mb-2">Report</p>
                      <h3 className="font-serif text-2xl font-normal text-gs-navy">Compliance Assessment</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-serif text-gs-blue">{complianceReport.score}</p>
                      <p className="text-xs text-gray-500 mt-1">Assessment Score</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(complianceReport).filter(([key]) => key !== 'score').map(([key, value]) => (
                      <div key={key} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            value.status === 'compliant' ? 'bg-green-100 text-green-700' :
                            value.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {value.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{value.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gs-blue uppercase tracking-wider mb-2">Report</p>
                      <h3 className="font-serif text-2xl font-normal text-gs-navy">Privacy Scan</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-serif text-gs-blue">{privacyReport.score}</p>
                      <p className="text-xs text-gray-500 mt-1">Assessment Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gs-gray p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">PII Detection</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fields Found:</span>
                          <span className="font-medium">{privacyReport.piiFields}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fields Masked:</span>
                          <span className="font-medium text-green-600">{privacyReport.piiMasked}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 mb-2">Types Detected:</p>
                        <div className="flex flex-wrap gap-1">
                          {privacyReport.piiTypes.map(type => (
                            <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gs-gray p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Data Protection</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          <span>{privacyReport.encryption}</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          <span>{privacyReport.retention}</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          <span>{privacyReport.accessLogs}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Agent Communications Tab */}
              {activeTab === 'comms' && (
                <div className="space-y-8">
                  <div>
                    <p className="text-xs text-gs-blue uppercase tracking-wider mb-2">Communications</p>
                    <h3 className="font-serif text-2xl font-normal text-gs-navy">Inter-Agent Activity</h3>
                  </div>
                  {interAgentComms.map(comm => (
                    <div key={comm.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 text-gs-blue mr-2" />
                          <span className="font-semibold text-sm">{comm.from}</span>
                          <span className="mx-2 text-gray-400">→</span>
                          <span className="font-semibold text-sm">{comm.to}</span>
                        </div>
                        <span className="text-xs text-gray-400">{comm.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 ml-6">{comm.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDetail

