import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Code, 
  Download, 
  Copy, 
  ExternalLink,
  PlayCircle,
  BookOpen,
  Lightbulb,
  BarChart3,
  Share2,
  Star,
  Calendar,
  Users,
  Tag
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CodeViewer } from '../components/CodeViewer'
import { BenchmarkPanel } from '../components/BenchmarkPanel'

export const PaperAnalysisPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { papers } = useApp()
  const [activeTab, setActiveTab] = useState('summary')
  const [selectedFramework, setSelectedFramework] = useState('pytorch')
  
  const paper = papers.find(p => p.id === id)
  
  useEffect(() => {
    if (!paper) {
      navigate('/')
    }
  }, [paper, navigate])
  
  if (!paper) {
    return (
      <div className="py-16 text-center">
        <div className="text-text-muted">Paper not found</div>
      </div>
    )
  }

  const tabs = [
    { id: 'summary', label: 'Summary', icon: BookOpen },
    { id: 'code', label: 'Code Templates', icon: Code },
    { id: 'benchmark', label: 'Benchmarking', icon: BarChart3 },
  ]

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors">
            <Star className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Paper Info */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h1 className="text-2xl font-bold leading-tight">{paper.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="w-4 h-4" />
                  <span>{paper.primaryCategory}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>{paper.citations?.toLocaleString()} citations</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-6">
              <span className={`px-3 py-1 text-sm rounded-full ${
                paper.processingStatus === 'completed' 
                  ? 'bg-success/20 text-success' 
                  : 'bg-warning/20 text-warning'
              }`}>
                {paper.processingStatus}
              </span>
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View PDF</span>
              </a>
            </div>
          </div>
          
          <p className="text-text-muted leading-relaxed">{paper.abstract}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Innovations */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-warning" />
                <h2 className="text-lg font-semibold">Key Innovations</h2>
              </div>
              <div className="space-y-3">
                {paper.extractedSummary?.keyInnovations?.map((innovation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{innovation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Problem Statement</h2>
              <p className="text-text-muted leading-relaxed text-sm">
                {paper.extractedSummary?.problemStatement}
              </p>
            </div>

            {/* Methodology */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Methodology</h2>
              <p className="text-text-muted leading-relaxed text-sm">
                {paper.extractedSummary?.methodology}
              </p>
            </div>

            {/* Results */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Key Results</h2>
              <div className="space-y-3">
                {Object.entries(paper.extractedSummary?.results || {}).map(([metric, value]) => (
                  <div key={metric} className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">{metric}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            {/* Framework Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Framework:</span>
              <div className="flex space-x-2">
                {['pytorch', 'tensorflow', 'jax'].map((framework) => (
                  <button
                    key={framework}
                    onClick={() => setSelectedFramework(framework)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      selectedFramework === framework
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-surface-hover'
                    }`}
                  >
                    {framework.charAt(0).toUpperCase() + framework.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Template */}
            <CodeViewer 
              code={paper.codeTemplates?.find(t => t.framework === selectedFramework)?.code || '# Code template coming soon...'}
              language="python"
              framework={selectedFramework}
            />
          </div>
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkPanel paper={paper} />
        )}
      </div>
    </div>
  )
}