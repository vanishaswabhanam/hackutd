import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, Search, Filter, Activity, AlertTriangle, 
  CheckCircle, Clock, Eye, TrendingUp, Users 
} from 'lucide-react'
import { getAllInvestigations } from '../services/agentOrchestrator'
import messageBus from '../services/messageBus'

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([])
  const [activities, setActivities] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // Load investigations from localStorage
  useEffect(() => {
    const loadInvestigations = () => {
      const investigations = getAllInvestigations()
      
      // Transform investigations to vendor format
      const vendorData = investigations.map(inv => ({
        id: inv.vendorId,
        name: inv.vendorData.companyName || 'Unknown Company',
        status: inv.recommendation === 'approve' ? 'approved' : 
                inv.recommendation === 'reject' ? 'rejected' : 'under-review',
        riskScore: inv.riskScore,
        riskLevel: inv.riskLevel,
        stage: inv.recommendation === 'approve' ? 'Approved' :
               inv.recommendation === 'reject' ? 'Rejected' : 
               'Under Review',
        submittedDate: new Date(inv.timestamp).toLocaleDateString(),
        currentAgent: inv.recommendation === 'review' ? 'Awaiting Human Review' : null,
        duration: inv.duration,
      }))
      
      setVendors(vendorData.reverse()) // Show newest first
    }

    loadInvestigations()

    // Poll for updates every 2 seconds
    const interval = setInterval(loadInvestigations, 2000)

    return () => clearInterval(interval)
  }, [])

  // Load activity feed from message bus
  useEffect(() => {
    const loadActivities = () => {
      const messages = messageBus.getMessages()
      
      // Transform messages to activity format
      const activityData = messages
        .filter(m => m.type === 'activity' || m.type === 'finding')
        .slice(-20) // Last 20 activities
        .reverse()
        .map(m => ({
          id: m.id,
          agent: m.agent,
          action: m.action || m.finding || m.message,
          time: new Date(m.timestamp).toLocaleTimeString(),
          type: m.type,
          severity: m.severity || 'info'
        }))
      
      setActivities(activityData)
    }

    loadActivities()

    // Poll for new activities
    const interval = setInterval(loadActivities, 2000)

    return () => clearInterval(interval)
  }, [])

  const agents = [
    { id: 1, name: 'Intake Agent', status: 'idle', icon: '📋', tasksActive: 0, color: 'green' },
    { id: 2, name: 'Digital Forensics Agent', status: 'idle', icon: '🔍', tasksActive: 0, color: 'blue' },
    { id: 3, name: 'Financial Sleuth Agent', status: 'idle', icon: '💰', tasksActive: 0, color: 'yellow' },
    { id: 4, name: 'Compliance Orchestrator Agent', status: 'idle', icon: '⚖️', tasksActive: 0, color: 'purple' },
    { id: 5, name: 'Privacy Guardian Agent', status: 'idle', icon: '🔒', tasksActive: 0, color: 'pink' },
    { id: 6, name: 'Risk Synthesizer Agent', status: 'idle', icon: '🎯', tasksActive: 0, color: 'orange' },
  ]

  // No more mock vendor data - using real data from localStorage

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600'
      case 'flagged': return 'text-red-600'
      case 'under-review': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-12 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-normal text-gs-navy tracking-tight">Mission Control</h1>
              <p className="text-sm text-gray-500 mt-2 font-light">Real-time Onboarding Monitoring</p>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm text-gs-navy hover:opacity-70 transition-opacity">
                Vendor Portal
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <Shield className="text-gs-navy w-8 h-8" />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100 px-12 py-8">
        <div className="grid grid-cols-4 gap-12">
          <div>
            <p className="text-4xl font-serif font-normal text-gs-navy mb-2">12</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Active Reviews</p>
          </div>
          <div>
            <p className="text-4xl font-serif font-normal text-gs-navy mb-2">48</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Approved Today</p>
          </div>
          <div>
            <p className="text-4xl font-serif font-normal text-gs-navy mb-2">3</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">High Risk Flagged</p>
          </div>
          <div>
            <p className="text-4xl font-serif font-normal text-gs-navy mb-2">94%</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Accuracy Rate</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-12 py-12 bg-white">
        <div className="grid grid-cols-12 gap-8">
          {/* Activity Feed */}
          <div className="col-span-4">
            <div className="border-l-2 border-gs-blue pl-6">
              <div className="mb-8">
                <p className="text-xs text-gs-blue uppercase tracking-wider font-medium mb-4">Live Activity</p>
                <h2 className="font-serif text-2xl font-normal text-gs-navy">Real-time Updates</h2>
              </div>
              <div className="space-y-6 h-[calc(100vh-400px)] overflow-y-auto pr-4">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="border-b border-gray-100 pb-6 last:border-0"
                  >
                    <p className="text-xs font-medium text-gray-900 mb-1">{activity.agent}</p>
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">{activity.action}</p>
                    <p className="text-xs text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vendors & Agents */}
          <div className="col-span-8 space-y-12">
            {/* Agent Status Panel */}
            <div>
              <div className="mb-6">
                <p className="text-xs text-gs-blue uppercase tracking-wider font-medium mb-2">System Status</p>
                <h2 className="font-serif text-2xl font-normal text-gs-navy">Active Agents</h2>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {agents.map(agent => (
                  <div key={agent.id} className={`border-t-2 pt-4 ${agent.status === 'active' ? 'border-gs-blue' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs ${agent.status === 'active' ? 'text-gs-blue' : 'text-gray-500'}`}>
                        {agent.status === 'active' ? 'ACTIVE' : 'IDLE'}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm text-gs-navy mb-1">{agent.name}</h3>
                    <p className="text-xs text-gray-500">
                      {agent.tasksActive > 0 ? `${agent.tasksActive} tasks in progress` : 'Standing by'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendors Grid */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gs-blue uppercase tracking-wider font-medium mb-2">Portfolio</p>
                    <h2 className="font-serif text-2xl font-normal text-gs-navy">Under Review</h2>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search vendors"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-gs-navy transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {vendors.map(vendor => (
                  <Link
                    key={vendor.id}
                    to={`/admin/vendor/${vendor.id}`}
                    className="block border border-gray-200 p-6 hover:border-gs-navy transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-gs-navy mb-1 group-hover:text-gs-blue transition-colors">{vendor.name}</h3>
                        <p className="text-xs text-gray-400">Submitted {vendor.submittedDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-serif text-gs-blue">{vendor.riskScore}</p>
                        <p className="text-xs text-gray-400">Risk Score</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {vendor.stage}
                      </span>
                      {vendor.currentAgent && (
                        <span className="text-xs text-gray-400">
                          {vendor.currentAgent}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

