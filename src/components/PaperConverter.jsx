import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, 
  FileText, 
  Upload, 
  Link as LinkIcon, 
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { paperService } from '../services/paperService'

export const PaperConverter = ({ onClose }) => {
  const navigate = useNavigate()
  const { user, addPaper, toast } = useApp()
  const [inputType, setInputType] = useState('url')
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')

  const canConvert = user && (
    user.monthlyConversionsUsed < user.monthly_conversions_limit || 
    user.monthlyConversionsUsed === 0 // First one is always free
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!canConvert) {
      toast.error('Monthly conversion limit reached. Please upgrade to continue.')
      return
    }

    if (!input.trim()) {
      toast.error('Please provide a paper URL or upload a file')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate processing steps with AI analysis
      setProcessingStep('Parsing paper URL and extracting metadata...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setProcessingStep('Fetching paper content from source...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProcessingStep('AI analysis with GPT-4o-mini in progress...')
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setProcessingStep('Generating AI-powered code templates...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setProcessingStep('Finalizing analysis and insights...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Process the paper with user ID for payment tracking
      const paper = await paperService.processPaper(input, inputType, user?.id)
      addPaper(paper)

      toast.success('Paper converted successfully! 🎉')
      
      // Navigate to paper analysis page
      navigate(`/paper/${paper.id}`)
      onClose()
    } catch (error) {
      toast.error(`Failed to process paper: ${error.message}`)
    } finally {
      setIsProcessing(false)
      setProcessingStep('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Convert Research Paper</h2>
            <p className="text-sm text-text-muted">
              Transform any research paper into actionable insights and code
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Usage Indicator */}
          {user && (
            <div className="bg-bg border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Monthly Usage</span>
                <span className="text-sm text-text-muted">
                  {user.monthlyConversionsUsed}/{user.monthly_conversions_limit}
                </span>
              </div>
              <div className="w-full bg-surface-hover rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    canConvert ? 'bg-primary' : 'bg-error'
                  }`}
                  style={{ 
                    width: `${Math.min((user.monthlyConversionsUsed / user.monthly_conversions_limit) * 100, 100)}%` 
                  }}
                />
              </div>
              {!canConvert && (
                <div className="flex items-center space-x-2 mt-2 text-error text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Limit reached. Upgrade to continue converting papers.</span>
                </div>
              )}
            </div>
          )}

          {/* Input Type Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Input Method</label>
            <div className="flex space-x-2">
                <button
                onClick={() => setInputType('url')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  inputType === 'url'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-surface-hover'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Paper URL</span>
              </button>
              <button
                onClick={() => setInputType('file')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  inputType === 'file'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-surface-hover'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload PDF</span>
              </button>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {inputType === 'url' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Paper URL or ID</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="https://arxiv.org/abs/1706.03762 or paper URL"
                  className="w-full input-field"
                  disabled={isProcessing}
                />
                <div className="text-xs text-text-muted space-y-1">
                  <p><strong>Supported sources:</strong></p>
                  <p>• arXiv: https://arxiv.org/abs/1706.03762 or 1706.03762</p>
                  <p>• ACL Anthology: https://aclanthology.org/2020.acl-main.1/</p>
                  <p>• OpenReview: https://openreview.net/forum?id=...</p>
                  <p>• IEEE Xplore: https://ieeexplore.ieee.org/document/...</p>
                  <p>• PubMed: https://pubmed.ncbi.nlm.nih.gov/...</p>
                  <p>• Direct PDF links</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload PDF</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-muted mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-text-muted">PDF files up to 10MB</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setInput(e.target.files[0]?.name || '')}
                    className="hidden"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <div className="absolute inset-0 w-5 h-5 border-2 border-primary/20 rounded-full animate-ping" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary">Processing Paper</div>
                    <div className="text-xs text-text-muted">{processingStep}</div>
                  </div>
                </div>
                <div className="mt-3 w-full bg-surface-hover rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full animate-pulse transition-all duration-1000" style={{ width: '60%' }} />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canConvert || isProcessing || !input.trim()}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Convert Paper</span>
                </>
              )}
            </button>
          </form>

          {/* Features Preview */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-medium mb-3">AI-Powered Analysis includes:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Key innovations & insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Implementation complexity</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>AI-generated code templates</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Practical applications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Technical background needed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Step-by-step implementation guide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}