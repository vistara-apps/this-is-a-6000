import React, { useState } from 'react'
import { Copy, Download, CheckCircle, ExternalLink } from 'lucide-react'

export const CodeViewer = ({ code, language = 'python', framework }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `model_${framework}.py`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-error rounded-full" />
            <div className="w-3 h-3 bg-warning rounded-full" />
            <div className="w-3 h-3 bg-success rounded-full" />
          </div>
          <span className="text-sm font-medium">model_{framework}.py</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-text leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border bg-bg">
        <div className="flex items-center justify-between text-sm text-text-muted">
          <div className="flex items-center space-x-4">
            <span>Language: {language}</span>
            <span>Framework: {framework}</span>
            <span>Lines: {code.split('\n').length}</span>
          </div>
          
          <a
            href={`https://pytorch.org/docs/stable/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-text transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Documentation</span>
          </a>
        </div>
      </div>
    </div>
  )
}