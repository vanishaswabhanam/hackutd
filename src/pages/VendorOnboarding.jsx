import React, { useState, useEffect } from 'react'
import { Upload, Shield, CheckCircle, Clock, FileText, AlertTriangle, Loader } from 'lucide-react'
import { extractTextFromDocument, isValidFileType, isValidFileSize } from '../services/ocrService'
import { parseVendorDocument } from '../services/documentParser'

const VendorOnboarding = () => {
  const [currentStage, setCurrentStage] = useState(0)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
    services: '',
    yearsInBusiness: '',
    annualRevenue: '',
    insurance: '',
    certifications: '',
  })

  const [fieldConfidence, setFieldConfidence] = useState({})
  const [agentStatus, setAgentStatus] = useState([
    { name: 'Intake Agent', status: 'active', task: 'Awaiting document upload' },
    { name: 'Digital Forensics', status: 'idle', task: 'Standing by' },
    { name: 'Financial Sleuth', status: 'idle', task: 'Standing by' },
    { name: 'Privacy Guardian', status: 'idle', task: 'Standing by' },
  ])

  const stages = [
    { name: 'Upload', icon: Upload, status: 'active' },
    { name: 'Review', icon: FileText, status: 'pending' },
    { name: 'Submit', icon: CheckCircle, status: 'pending' },
    { name: 'Investigation', icon: Shield, status: 'pending' }
  ]

  // Simulate agent activation when data is extracted
  useEffect(() => {
    if (formData.companyName) {
      setTimeout(() => {
        setAgentStatus(prev => prev.map(agent => 
          agent.name === 'Digital Forensics'
            ? { ...agent, status: 'active', task: 'Investigating domain' }
            : agent
        ))
      }, 1000)
    }
    
    if (formData.taxId) {
      setTimeout(() => {
        setAgentStatus(prev => prev.map(agent => 
          agent.name === 'Financial Sleuth'
            ? { ...agent, status: 'active', task: 'Verifying financial data' }
            : agent
        ))
      }, 2000)
    }

    if (uploadedFile) {
      setTimeout(() => {
        setAgentStatus(prev => prev.map(agent => 
          agent.name === 'Privacy Guardian'
            ? { ...agent, status: 'active', task: 'Scanning for PII' }
            : agent
        ))
      }, 1500)
    }
  }, [formData.companyName, formData.taxId, uploadedFile])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file) => {
    setError('')
    
    // Validate file type
    if (!isValidFileType(file)) {
      setError('Please upload a valid file (PDF, JPG, PNG, GIF, or BMP)')
      return
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      setError('File size must be less than 1MB')
      return
    }

    setUploadedFile(file)
    setIsProcessing(true)
    setProcessingStatus('Uploading document...')
    setCurrentStage(0)

    try {
      // Step 1: Extract text using OCR
      setProcessingStatus('Extracting text from document...')
      const ocrResult = await extractTextFromDocument(file)

      if (!ocrResult.success) {
        throw new Error(ocrResult.error || 'OCR processing failed')
      }

      // Step 2: Parse extracted text
      setProcessingStatus('Analyzing document content...')
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate processing
      
      const parsedData = parseVendorDocument(ocrResult.text)

      // Step 3: Auto-fill form
      setProcessingStatus('Auto-filling form fields...')
      await new Promise(resolve => setTimeout(resolve, 500))

      const newFormData = {}
      const newConfidence = {}

      Object.keys(parsedData).forEach(key => {
        newFormData[key] = parsedData[key].value
        newConfidence[key] = parsedData[key].confidence
      })

      setFormData(newFormData)
      setFieldConfidence(newConfidence)
      
      setCurrentStage(1) // Move to Review stage
      setProcessingStatus('')
      
      setAgentStatus(prev => prev.map(agent => 
        agent.name === 'Intake Agent'
          ? { ...agent, task: 'Document processed successfully' }
          : agent
      ))

    } catch (err) {
      console.error('Processing error:', err)
      setError(err.message || 'Failed to process document')
      setProcessingStatus('')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Reset confidence when user manually edits
    if (fieldConfidence[field]) {
      setFieldConfidence(prev => ({
        ...prev,
        [field]: 'high' // User-edited fields are high confidence
      }))
    }
  }

  const getConfidenceClass = (field) => {
    const confidence = fieldConfidence[field]
    if (!confidence || confidence === 'low') return 'border-gray-300'
    if (confidence === 'medium') return 'border-yellow-400 bg-yellow-50'
    return 'border-green-400 bg-green-50'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setCurrentStage(3)
    setAgentStatus(prev => prev.map(agent => ({
      ...agent,
      status: 'active',
      task: agent.name === 'Intake Agent' ? 'Submission complete' : 'Analyzing vendor data'
    })))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-12 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-normal text-gs-navy tracking-tight">Adaptive Fraud Hunter</h1>
              <p className="text-sm text-gray-500 mt-2 font-light">Secure & Intelligent Onboarding Platform</p>
            </div>
            <Shield className="text-gs-navy w-8 h-8" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100 px-12 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => {
              const Icon = stage.icon
              const isActive = index === currentStage
              const isCompleted = index < currentStage
              
              return (
                <div key={stage.name} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted ? 'bg-gs-blue border-gs-blue' : 
                      isActive ? 'border-gs-blue bg-white' : 
                      'border-gray-300 bg-white'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isCompleted ? 'text-white' : isActive ? 'text-gs-blue' : 'text-gray-400'
                      }`} />
                    </div>
                    <span className={`mt-3 text-xs uppercase tracking-wider ${
                      isActive || isCompleted ? 'text-gs-blue font-medium' : 'text-gray-400'
                    }`}>
                      {stage.name}
                    </span>
                  </div>
                  {index < stages.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-6 ${
                      index < currentStage ? 'bg-gs-blue' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Document Upload Zone */}
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="font-serif text-2xl font-normal text-gs-navy mb-2">Upload Vendor Documents</h2>
              <p className="text-sm text-gray-500 mb-6">Upload your W9, business license, or vendor documentation to auto-fill the form</p>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed p-12 text-center transition-all ${
                  isDragging ? 'border-gs-blue bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                {!isProcessing ? (
                  <>
                    <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg text-gray-700 mb-2">Drag & drop your document here</p>
                    <p className="text-sm text-gray-500 mb-6">Supports PDF, JPG, PNG, GIF, BMP (max 1MB)</p>
                    <label className="cursor-pointer">
                      <span className="px-6 py-3 bg-gs-blue text-white text-sm hover:bg-gs-blue-dark transition-colors inline-block">
                        Browse Files
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Need a test document?</p>
                      <a 
                        href="/sample-vendor-info.txt" 
                        download 
                        className="text-xs text-gs-blue hover:underline"
                      >
                        Download sample vendor form →
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="py-8">
                    <Loader className="w-12 h-12 text-gs-blue mx-auto mb-4 animate-spin" />
                    <p className="text-lg text-gray-700 mb-2">Processing Document</p>
                    <p className="text-sm text-gray-500">{processingStatus}</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-xs text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {uploadedFile && !isProcessing && (
                <div className="mt-4 p-4 border border-green-200 bg-green-50 flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Document Processed</p>
                    <p className="text-xs text-green-700 mt-1">{uploadedFile.name} - Form auto-filled below</p>
                  </div>
                </div>
              )}
            </div>

            {/* Smart Form */}
            <div className="bg-white border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-normal text-gs-navy">Vendor Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Review and complete the information below</p>
                </div>
                {uploadedFile && (
                  <div className="text-right">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 mr-1.5"></div>
                        <span className="text-gray-600">High confidence</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 mr-1.5"></div>
                        <span className="text-gray-600">Needs review</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="border-t-2 border-gs-blue pt-6">
                  <p className="text-xs text-gs-blue uppercase tracking-wider mb-4">Company Information</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('companyName')}`}
                        placeholder="Enter company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Tax ID / EIN *</label>
                      <input
                        type="text"
                        required
                        value={formData.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('taxId')}`}
                        placeholder="XX-XXXXXXX"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm text-gray-700 mb-2">Business Address *</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('address')}`}
                        placeholder="Street, City, State, ZIP"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('email')}`}
                        placeholder="contact@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('phone')}`}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Business Details</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Business Type *</label>
                      <input
                        type="text"
                        required
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('businessType')}`}
                        placeholder="e.g., Software Development"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Years in Business</label>
                      <input
                        type="text"
                        value={formData.yearsInBusiness}
                        onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('yearsInBusiness')}`}
                        placeholder="e.g., 8"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm text-gray-700 mb-2">Services Description *</label>
                      <textarea
                        required
                        rows="3"
                        value={formData.services}
                        onChange={(e) => handleInputChange('services', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('services')}`}
                        placeholder="Describe the services your company provides"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Annual Revenue</label>
                      <input
                        type="text"
                        value={formData.annualRevenue}
                        onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('annualRevenue')}`}
                        placeholder="e.g., $12.5M"
                      />
                    </div>
                  </div>
                </div>

                {/* Compliance & Insurance */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Compliance & Insurance</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Insurance Information</label>
                      <input
                        type="text"
                        value={formData.insurance}
                        onChange={(e) => handleInputChange('insurance', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('insurance')}`}
                        placeholder="Policy number and expiration"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Certifications</label>
                      <input
                        type="text"
                        value={formData.certifications}
                        onChange={(e) => handleInputChange('certifications', e.target.value)}
                        className={`w-full px-4 py-2.5 border text-sm focus:outline-none focus:border-gs-blue transition-colors ${getConfidenceClass('certifications')}`}
                        placeholder="e.g., SOC2, ISO 27001"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gs-navy text-white text-sm hover:opacity-90 transition-opacity font-medium"
                  >
                    Submit for Review
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Our agents will review your submission and complete background investigation
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar - Agent Status */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-serif text-lg font-normal text-gs-navy mb-5">Agent Status</h3>
              <div className="space-y-4">
                {agentStatus.map((agent, index) => (
                  <div key={index} className={`border-t-2 pt-3 ${agent.status === 'active' ? 'border-gs-blue' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gs-navy">{agent.name}</span>
                      <span className={`text-xs uppercase tracking-wider ${
                        agent.status === 'active' ? 'text-gs-blue' : 'text-gray-400'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{agent.task}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-serif text-lg font-normal text-gs-navy mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>Upload any of the following documents:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>W9 Tax Form</li>
                  <li>Business License</li>
                  <li>Vendor Agreement</li>
                  <li>Insurance Certificate</li>
                  <li>SOC2/ISO Certification</li>
                </ul>
                <p className="text-xs text-gray-500 mt-4">
                  Our AI will automatically extract and fill in your information. You can review and edit any field before submitting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorOnboarding
