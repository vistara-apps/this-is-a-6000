import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  X, 
  FileText, 
  Upload, 
  Link as LinkIcon, 
  Loader2,
  CheckCircle,
  AlertTriangle,
  User,
  DollarSign
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { paperService } from '../services/paperService'
import { AuthModal } from './AuthModal'
import { PaymentModal } from './PaymentModal'

export const PaperConverter = ({ onClose }) => {
  const navigate = useNavigate()
  const { user, addPaper, toast, isAuthenticated, canAnalyzeForFree } = useApp()
  const { isAuthenticated: authStatus } = useAuth()
  const [inputType, setInputType] = useState('url')
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paperInfo, setPaperInfo] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!input.trim()) {
      toast.error('Please provide a paper URL or upload a file')
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    // Extract basic paper info for payment/analysis
    try {
      const basicInfo = {
        title: 'Research Paper Analysis',
        source: 'unknown'
      }
      
      // Try to extract more info if it's an arXiv URL
      const arxivMatch = input.match(/arxiv\.org\/abs\/(\d+\.\d+)/)
      if (arxivMatch) {
        basicInfo.source = 'arxiv'
        basicInfo.title = `arXiv:${arxivMatch[1]}`
      }
      
      setPaperInfo(basicInfo)
      setShowPaymentModal(true)
    } catch (error) {
      toast.error('Invalid paper URL format')
    }
  }

  const handlePaymentSuccess = async (paper, paymentInfo) => {
    try {
      addPaper(paper)
      
      if (paymentInfo.isFreeAnalysis) {
        toast.success('Free analysis completed! 🎉')
      } else {
        toast.success('Payment successful! Paper analyzed! 🎉')
      }
      
      // Navigate to paper analysis page
      navigate(`/paper/${paper.id}`)
      onClose()
    } catch (error) {
      toast.error('Error processing analysis result')
    } finally {
      setShowPaymentModal(false)
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
          {/* User Status Indicator */}
          {isAuthenticated ? (
            <div className="bg-bg border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Analysis Status</span>
                <span className="text-sm text-text-muted">
                  {user?.papersAnalyzed || 0} papers analyzed
                </span>
              </div>
              {canAnalyzeForFree ? (
                <div className="flex items-center space-x-2 text-success text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>First analysis is FREE! 🎉</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-primary text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>$5 per paper analysis</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Sign in required</span>
              </div>
              <p className="text-sm text-text-muted">
                Create an account to analyze papers and save your results
              </p>
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
                <label className="text-sm font-medium">Research Paper URL or ID</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="https://arxiv.org/abs/1706.03762 or DOI or IEEE link"
                  className="w-full input-field"
                  disabled={isProcessing}
                />
                <div className="text-xs text-text-muted space-y-1">
                  <p>✅ arXiv: https://arxiv.org/abs/1706.03762 or 1706.03762</p>
                  <p>✅ IEEE: https://ieeexplore.ieee.org/document/123456</p>
                  <p>✅ ACM: https://dl.acm.org/doi/10.1145/123.456</p>
                  <p>✅ DOI: https://doi.org/10.1038/nature12345</p>
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
              disabled={isProcessing || !input.trim()}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {isAuthenticated ? (
                    canAnalyzeForFree ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Analyze Paper (FREE)</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5" />
                        <span>Analyze Paper ($5)</span>
                      </>
                    )
                  ) : (
                    <>
                      <User className="w-5 h-5" />
                      <span>Sign In to Analyze</span>
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Features Preview */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-medium mb-3">🤖 AI-Powered Analysis Features:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>AI-generated plain-English summary</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Key innovations extraction</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Smart code generation (PyTorch/TF/JAX)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Methodology & results analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Practical applications insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span>Implementation complexity assessment</span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-primary font-medium">
                ⚡ Powered by OpenRouter GPT-4o-mini for intelligent paper analysis
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          initialMode="signup"
        />
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && paperInfo && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          paperInfo={paperInfo}
          paperInput={input}
          inputType={inputType}
        />
      )}
    </div>
  )
}