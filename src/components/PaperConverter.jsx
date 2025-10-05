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
  const { user, addPaper, setError } = useApp()
  const [inputType, setInputType] = useState('url')
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')

  const canConvert = user && user.monthlyConversionsUsed < user.monthlyConversionsLimit

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!canConvert) {
      setError('Monthly conversion limit reached. Please upgrade to continue.')
      return
    }

    if (!input.trim()) {
      setError('Please provide a paper URL or upload a file')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Simulate processing steps
      setProcessingStep('Extracting paper metadata...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setProcessingStep('Analyzing methodology...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setProcessingStep('Generating code templates...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setProcessingStep('Creating visual diagrams...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Process the paper
      const paper = await paperService.processPaper(input, inputType)
      addPaper(paper)

      // Navigate to paper analysis page
      navigate(`/paper/${paper.id}`)
      onClose()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsProcessing(false)
      setProcessingStep('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  {user.monthlyConversionsUsed}/{user.monthlyConversionsLimit}
                </span>
              </div>
              <div className="w-full bg-surface-hover rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    canConvert ? 'bg-primary' : 'bg-error'
                  }`}
                  style={{ 
                    width: `${Math.min((user.monthlyConversionsUsed / user.monthlyConversionsLimit) * 100, 100)}%` 
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
                <span>arXiv URL</span>
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
                <label className="text-sm font-medium">arXiv URL or Paper ID</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="https://arxiv.org/abs/1706.03762 or 1706.03762"
                  className="w-full input-field"
                  disabled={isProcessing}
                />
                <p className="text-xs text-text-muted">
                  Example: https://arxiv.org/abs/1706.03762 (Attention Is All You Need)
                </p>
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
              <div className="bg-bg border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <div>
                    <div className="text-sm font-medium">Processing Paper</div>
                    <div className="text-xs text-text-muted">{processingStep}</div>
                  </div>
                </div>
                <div className="mt-3 w-full bg-surface-hover rounded-full h-1">
                  <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
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
            <h3 className="text-sm font-medium mb-3">What you'll get:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Plain-English summary</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Architecture diagrams</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>PyTorch/TensorFlow code</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Benchmarking tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}