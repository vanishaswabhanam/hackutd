import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  ArrowLeft, Shield, AlertTriangle, CheckCircle, 
  FileText, Activity, MessageSquare, Clock,
  XCircle, Mail, Download, Eye
} from 'lucide-react'
import { getInvestigation } from '../services/agentOrchestrator'
import messageBus from '../services/messageBus'

const VendorDetail = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('timeline')
  const [investigation, setInvestigation] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load investigation data
  useEffect(() => {
    const loadInvestigation = () => {
      const data = getInvestigation(id)
      if (data) {
        setInvestigation(data)
        setLoading(false)
      }
    }

    loadInvestigation()
    
    // Poll for updates
    const interval = setInterval(loadInvestigation, 2000)
    return () => clearInterval(interval)
  }, [id])

  if (loading || !investigation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gs-blue mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Loading investigation...</p>
        </div>
      </div>
    )
  }

  // Transform investigation data to vendor format
  const vendor = {
    id: investigation.vendorId,
    name: investigation.vendorData.companyName || 'Unknown Company',
    status: investigation.recommendation === 'approve' ? 'approved' : 
            investigation.recommendation === 'reject' ? 'rejected' : 'under-review',
    riskScore: investigation.riskScore,
    riskLevel: investigation.riskLevel,
    submittedDate: new Date(investigation.timestamp).toLocaleDateString(),
    email: investigation.vendorData.email || 'Not provided',
    phone: investigation.vendorData.phone || 'Not provided',
    address: investigation.vendorData.address || 'Not provided',
    businessType: investigation.vendorData.businessType || 'Not specified',
    yearsInBusiness: investigation.vendorData.yearsInBusiness || 'Not specified',
    website: investigation.vendorData.website || investigation.vendorData.companyWebsite || 'Not provided',
    taxId: investigation.vendorData.taxId || 'Not provided',
  }

  // Build timeline from investigation messages
  const timeline = investigation.interAgentMessages
    ? investigation.interAgentMessages
        .filter(m => m.type === 'activity')
        .map((m, idx) => ({
          id: idx + 1,
          agent: m.agent,
          icon: m.agent.includes('Intake') ? '📋' :
                m.agent.includes('Digital') ? '🔍' :
                m.agent.includes('Financial') ? '💰' :
                m.agent.includes('Compliance') ? '⚖️' :
                m.agent.includes('Privacy') ? '🔒' :
                m.agent.includes('Risk') ? '🎯' : '🤖',
          action: m.action,
          details: m.metadata ? JSON.stringify(m.metadata) : '',
          time: new Date(m.timestamp).toLocaleString(),
          status: m.metadata?.status || 'completed'
        }))
    : []

  // Real agent reports from investigation
  const forensicsReport = investigation.agentResults?.digital || {
    findings: ['No digital forensics data available'],
    riskIndicators: [],
    score: 50,
  }

  const financialReport = investigation.agentResults?.financial || {
    findings: ['No financial data available'],
    riskIndicators: [],
    score: 50,
  }

  const complianceReport = investigation.agentResults?.compliance || {
    findings: ['No compliance data available'],
    complianceGaps: [],
    certifications: [],
    score: 50,
  }

  const privacyReport = investigation.agentResults?.privacy || {
    findings: ['No privacy data available'],
    piiDetected: [],
    score: 50,
  }

  const intakeReport = investigation.agentResults?.intake || {
    findings: ['No intake data available'],
    missingFields: [],
    score: 50,
  }

  // Real inter-agent communications
  const interAgentComms = investigation.interAgentMessages
    ? investigation.interAgentMessages
        .filter(m => m.type === 'communication')
        .map((m, idx) => ({
          id: idx + 1,
          from: m.from,
          to: m.to,
          message: m.message,
          time: new Date(m.timestamp).toLocaleTimeString(),
          priority: m.priority
        }))
    : []

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
                <div className="space-y-8">
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

                  <div className="border-t-2 border-gs-blue pt-6">
                    <h4 className="text-sm font-medium text-gs-navy mb-4">Findings</h4>
                    <div className="space-y-2">
                      {forensicsReport.findings && forensicsReport.findings.map((finding, idx) => (
                        <div key={idx} className="py-2 border-b border-gray-100 text-sm text-gray-700">
                          {finding}
                        </div>
                      ))}
                    </div>
                  </div>

                  {forensicsReport.riskIndicators && forensicsReport.riskIndicators.length > 0 && (
                    <div className="border-t-2 border-red-300 pt-6">
                      <h4 className="text-sm font-medium text-red-600 mb-4">Risk Indicators</h4>
                      <div className="space-y-2">
                        {forensicsReport.riskIndicators.map((indicator, idx) => (
                          <div key={idx} className="py-2 border-b border-gray-100 text-sm text-red-600">
                            ⚠️ {indicator}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Financial Tab */}
              {activeTab === 'financial' && (
                <div className="space-y-8">
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

                  <div className="border-t-2 border-gs-blue pt-6">
                    <h4 className="text-sm font-medium text-gs-navy mb-4">Findings</h4>
                    <div className="space-y-2">
                      {financialReport.findings && financialReport.findings.map((finding, idx) => (
                        <div key={idx} className="py-2 border-b border-gray-100 text-sm text-gray-700">
                          {finding}
                        </div>
                      ))}
                    </div>
                  </div>

                  {financialReport.riskIndicators && financialReport.riskIndicators.length > 0 && (
                    <div className="border-t-2 border-red-300 pt-6">
                      <h4 className="text-sm font-medium text-red-600 mb-4">Risk Indicators</h4>
                      <div className="space-y-2">
                        {financialReport.riskIndicators.map((indicator, idx) => (
                          <div key={idx} className="py-2 border-b border-gray-100 text-sm text-red-600">
                            ⚠️ {indicator}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Compliance Tab */}
              {activeTab === 'compliance' && (
                <div className="space-y-8">
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

                  <div className="border-t-2 border-gs-blue pt-6">
                    <h4 className="text-sm font-medium text-gs-navy mb-4">Findings</h4>
                    <div className="space-y-2">
                      {complianceReport.findings && complianceReport.findings.map((finding, idx) => (
                        <div key={idx} className="py-2 border-b border-gray-100 text-sm text-gray-700">
                          {finding}
                        </div>
                      ))}
                    </div>
                  </div>

                  {complianceReport.complianceGaps && complianceReport.complianceGaps.length > 0 && (
                    <div className="border-t-2 border-red-300 pt-6">
                      <h4 className="text-sm font-medium text-red-600 mb-4">Compliance Gaps</h4>
                      <div className="space-y-2">
                        {complianceReport.complianceGaps.map((gap, idx) => (
                          <div key={idx} className="py-2 border-b border-gray-100 text-sm text-red-600">
                            ⚠️ {gap}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {complianceReport.certifications && complianceReport.certifications.length > 0 && (
                    <div className="border-t-2 border-green-300 pt-6">
                      <h4 className="text-sm font-medium text-green-600 mb-4">Certifications Found</h4>
                      <div className="flex flex-wrap gap-2">
                        {complianceReport.certifications.map((cert, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded">
                            ✓ {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-8">
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

                  <div className="border-t-2 border-gs-blue pt-6">
                    <h4 className="text-sm font-medium text-gs-navy mb-4">Findings</h4>
                    <div className="space-y-2">
                      {privacyReport.findings && privacyReport.findings.map((finding, idx) => (
                        <div key={idx} className="py-2 border-b border-gray-100 text-sm text-gray-700">
                          {finding}
                        </div>
                      ))}
                    </div>
                  </div>

                  {privacyReport.piiDetected && privacyReport.piiDetected.length > 0 && (
                    <div className="border-t-2 border-yellow-300 pt-6">
                      <h4 className="text-sm font-medium text-yellow-700 mb-4">PII Detected</h4>
                      <div className="space-y-3">
                        {privacyReport.piiDetected.map((pii, idx) => (
                          <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-yellow-900">{pii.type}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                pii.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                pii.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {pii.severity?.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              Found {pii.count} instance{pii.count > 1 ? 's' : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

