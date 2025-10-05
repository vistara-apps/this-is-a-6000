import React, { useState } from 'react'
import { BarChart3, PlayCircle, Clock, TrendingUp, Award } from 'lucide-react'

export const BenchmarkingPage = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const mockBenchmarks = [
    {
      id: '1',
      paperTitle: 'Attention Is All You Need',
      dataset: 'WMT14 EN-DE',
      metric: 'BLEU',
      yourScore: 27.8,
      paperScore: 28.4,
      baselineScore: 24.1,
      status: 'completed',
      date: '2024-01-15',
      reproducibilityScore: 92
    },
    {
      id: '2',
      paperTitle: 'Vision Transformer',
      dataset: 'ImageNet',
      metric: 'Top-1 Accuracy',
      yourScore: 0.841,
      paperScore: 0.857,
      baselineScore: 0.789,
      status: 'running',
      date: '2024-01-14',
      reproducibilityScore: null
    }
  ]

  const leaderboards = [
    {
      category: 'Language Models',
      datasets: ['GLUE', 'SuperGLUE', 'HellaSwag'],
      topModel: 'GPT-4',
      recentEntries: 156
    },
    {
      category: 'Computer Vision',
      datasets: ['ImageNet', 'COCO', 'ADE20K'],
      topModel: 'ViT-G/14',
      recentEntries: 89
    },
    {
      category: 'Speech',
      datasets: ['LibriSpeech', 'CommonVoice', 'VCTK'],
      topModel: 'Whisper-Large',
      recentEntries: 34
    }
  ]

  const getScoreColor = (score, paperScore) => {
    const ratio = score / paperScore
    if (ratio >= 0.95) return 'text-success'
    if (ratio >= 0.85) return 'text-warning'
    return 'text-error'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success'
      case 'running': return 'bg-warning/20 text-warning'
      case 'failed': return 'bg-error/20 text-error'
      default: return 'bg-text-muted/20 text-text-muted'
    }
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Benchmarking Dashboard</h1>
        <p className="text-text-muted max-w-2xl mx-auto">
          Track your model implementations against paper baselines and community standards.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'leaderboards', label: 'Leaderboards', icon: Award },
            { id: 'history', label: 'Your Benchmarks', icon: Clock }
          ].map(({ id, label, icon: Icon }) => (
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
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-text-muted">Total Benchmarks</span>
            </div>
            <div className="text-2xl font-bold">24</div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm font-medium text-text-muted">Avg Reproducibility</span>
            </div>
            <div className="text-2xl font-bold text-success">89%</div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <PlayCircle className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium text-text-muted">Running Now</span>
            </div>
            <div className="text-2xl font-bold text-warning">3</div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Award className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-text-muted">Top 10 Results</span>
            </div>
            <div className="text-2xl font-bold text-accent">7</div>
          </div>
        </div>
      )}

      {activeTab === 'leaderboards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaderboards.map((board, index) => (
              <div key={index} className="bg-surface border border-border rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{board.category}</h3>
                    <span className="text-sm text-text-muted">{board.recentEntries} entries</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-text-muted">Datasets</div>
                    <div className="flex flex-wrap gap-1">
                      {board.datasets.map((dataset) => (
                        <span
                          key={dataset}
                          className="px-2 py-1 text-xs bg-bg border border-border rounded-full"
                        >
                          {dataset}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <div className="text-sm text-text-muted">Current Leader</div>
                      <div className="font-medium">{board.topModel}</div>
                    </div>
                    <Award className="w-5 h-5 text-warning" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Your Benchmark History</h3>
            </div>
            
            <div className="divide-y divide-border">
              {mockBenchmarks.map((benchmark) => (
                <div key={benchmark.id} className="p-6 hover:bg-surface-hover transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="font-medium">{benchmark.paperTitle}</div>
                      <div className="text-sm text-text-muted">
                        {benchmark.dataset} • {benchmark.metric}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(benchmark.status)}`}>
                        {benchmark.status}
                      </span>
                      <div className="text-sm text-text-muted">
                        {new Date(benchmark.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {benchmark.status === 'completed' && (
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-text-muted">Your Score</div>
                        <div className={`font-medium ${getScoreColor(benchmark.yourScore, benchmark.paperScore)}`}>
                          {benchmark.yourScore}
                        </div>
                      </div>
                      <div>
                        <div className="text-text-muted">Paper Score</div>
                        <div className="font-medium">{benchmark.paperScore}</div>
                      </div>
                      <div>
                        <div className="text-text-muted">Reproducibility</div>
                        <div className="font-medium text-success">{benchmark.reproducibilityScore}%</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}