import React, { useState, useEffect } from 'react'
import { Bell, TrendingUp, Calendar, ExternalLink, Filter, Star, BookOpen, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export const ChangelogPage = () => {
  const navigate = useNavigate()
  const { user } = useApp()
  const [selectedCategories, setSelectedCategories] = useState(['all'])
  const [timeFilter, setTimeFilter] = useState('week')
  const [subscriptions, setSubscriptions] = useState([])

  const categories = [
    { id: 'all', name: 'All Papers', count: 47 },
    { id: 'computer-vision', name: 'Computer Vision', count: 15 },
    { id: 'nlp', name: 'Natural Language Processing', count: 12 },
    { id: 'ml-theory', name: 'ML Theory', count: 8 },
    { id: 'reinforcement-learning', name: 'Reinforcement Learning', count: 7 },
    { id: 'generative-ai', name: 'Generative AI', count: 5 }
  ]

  const mockPapers = [
    {
      id: '1',
      title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
      authors: ['Albert Gu', 'Tri Dao'],
      arxivId: '2312.00752',
      publishedDate: '2024-01-15T10:00:00Z',
      category: 'nlp',
      impactScore: 95,
      summary: 'Introduces Mamba, a new architecture that achieves linear scaling in sequence length while maintaining the modeling power of Transformers through selective state space models.',
      keyInnovations: [
        'Selective state space mechanism',
        'Linear complexity in sequence length',
        'Hardware-efficient implementation'
      ],
      shouldImplement: 'High Priority',
      comparisonToExisting: 'Outperforms Transformers on long sequences with 5x better efficiency',
      trending: true,
      citationVelocity: 89
    },
    {
      id: '2',
      title: 'Scalable Diffusion Models with Transformers',
      authors: ['William Peebles', 'Saining Xie'],
      arxivId: '2212.09748',
      publishedDate: '2024-01-14T14:30:00Z',
      category: 'computer-vision',
      impactScore: 88,
      summary: 'DiT (Diffusion Transformers) replaces U-Net backbone in diffusion models with transformers, achieving better scalability and performance on image generation tasks.',
      keyInnovations: [
        'Transformer-based diffusion architecture',
        'Improved scalability properties',
        'Better FID scores on ImageNet'
      ],
      shouldImplement: 'Medium Priority',
      comparisonToExisting: '2x better FID scores compared to U-Net based diffusion models',
      trending: false,
      citationVelocity: 67
    },
    {
      id: '3',
      title: 'Constitutional AI: Harmlessness from AI Feedback',
      authors: ['Yuntao Bai', 'Andy Jones', 'Kamal Ndousse'],
      arxivId: '2212.08073',
      publishedDate: '2024-01-13T09:15:00Z',
      category: 'ml-theory',
      impactScore: 82,
      summary: 'Presents Constitutional AI (CAI), a method for training AI systems to be harmless and helpful by using AI feedback to critique and revise their own outputs.',
      keyInnovations: [
        'Self-supervised harmlessness training',
        'Constitutional principles for AI',
        'Reduced need for human feedback'
      ],
      shouldImplement: 'High Priority',
      comparisonToExisting: 'Reduces harmful outputs by 3x while maintaining helpfulness',
      trending: true,
      citationVelocity: 94
    },
    {
      id: '4',
      title: 'RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control',
      authors: ['Anthony Brohan', 'Noah Brown', 'Justice Carbajal'],
      arxivId: '2307.15818',
      publishedDate: '2024-01-12T16:45:00Z',
      category: 'reinforcement-learning',
      impactScore: 79,
      summary: 'RT-2 shows how vision-language models can be adapted for robotic control by co-fine-tuning on web and robotics data.',
      keyInnovations: [
        'Web-scale pre-training for robotics',
        'Vision-language-action modeling',
        'Emergent capabilities from scale'
      ],
      shouldImplement: 'Low Priority',
      comparisonToExisting: '3x improvement in success rate on novel tasks',
      trending: false,
      citationVelocity: 45
    }
  ]

  const userSubscriptions = [
    { category: 'computer-vision', enabled: true },
    { category: 'nlp', enabled: true },
    { category: 'generative-ai', enabled: false }
  ]

  useEffect(() => {
    setSubscriptions(userSubscriptions)
  }, [])

  const filteredPapers = mockPapers.filter(paper => {
    const categoryMatch = selectedCategories.includes('all') || selectedCategories.includes(paper.category)
    
    const now = new Date()
    const paperDate = new Date(paper.publishedDate)
    const daysDiff = (now - paperDate) / (1000 * 60 * 60 * 24)
    
    let timeMatch = true
    if (timeFilter === 'day') timeMatch = daysDiff <= 1
    else if (timeFilter === 'week') timeMatch = daysDiff <= 7
    else if (timeFilter === 'month') timeMatch = daysDiff <= 30
    
    return categoryMatch && timeMatch
  })

  const toggleCategory = (categoryId) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all'])
    } else {
      setSelectedCategories(prev => {
        const newSelection = prev.filter(id => id !== 'all')
        if (newSelection.includes(categoryId)) {
          const filtered = newSelection.filter(id => id !== categoryId)
          return filtered.length === 0 ? ['all'] : filtered
        } else {
          return [...newSelection, categoryId]
        }
      })
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High Priority': return 'bg-error/20 text-error'
      case 'Medium Priority': return 'bg-warning/20 text-warning'
      case 'Low Priority': return 'bg-success/20 text-success'
      default: return 'bg-text-muted/20 text-text-muted'
    }
  }

  const getImpactColor = (score) => {
    if (score >= 90) return 'text-error'
    if (score >= 80) return 'text-warning'
    if (score >= 70) return 'text-primary'
    return 'text-text-muted'
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Paper Changelog Tracker</h1>
        <p className="text-text-muted max-w-2xl mx-auto">
          Stay current with breakthrough research through AI-curated weekly digests and impact analysis.
        </p>
      </div>

      {/* Subscription Management */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Subscriptions</h2>
          <div className="flex items-center space-x-2 text-sm text-text-muted">
            <Bell className="w-4 h-4" />
            <span>Weekly digest enabled</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.filter(cat => cat.id !== 'all').map((category) => {
            const subscription = subscriptions.find(sub => sub.category === category.id)
            return (
              <div
                key={category.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  subscription?.enabled
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-surface-hover'
                }`}
                onClick={() => {
                  setSubscriptions(prev => prev.map(sub =>
                    sub.category === category.id
                      ? { ...sub, enabled: !sub.enabled }
                      : sub
                  ))
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{category.name}</div>
                    <div className="text-xs text-text-muted">{category.count} papers this week</div>
                  </div>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    subscription?.enabled
                      ? 'border-primary bg-primary'
                      : 'border-border'
                  }`}>
                    {subscription?.enabled && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-text-muted" />
          <span className="text-sm font-medium">Categories:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedCategories.includes(category.id)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-surface-hover'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-text-muted" />
          <span className="text-sm font-medium">Time:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="day">Last 24 hours</option>
            <option value="week">Last week</option>
            <option value="month">Last month</option>
          </select>
        </div>
      </div>

      {/* Papers Feed */}
      <div className="space-y-6">
        {filteredPapers.map((paper) => (
          <div key={paper.id} className="bg-surface border border-border rounded-xl p-6 hover:bg-surface-hover transition-colors">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold leading-tight">{paper.title}</h3>
                    {paper.trending && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-error/20 text-error rounded-full text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>Trending</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-text-muted">
                    <span>{paper.authors.slice(0, 2).join(', ')}{paper.authors.length > 2 && ` +${paper.authors.length - 2}`}</span>
                    <span>{paper.arxivId}</span>
                    <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 ml-6">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getImpactColor(paper.impactScore)}`}>
                      {paper.impactScore}
                    </div>
                    <div className="text-xs text-text-muted">Impact Score</div>
                  </div>
                  
                  <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <p className="text-text-muted leading-relaxed">{paper.summary}</p>

              {/* Key Innovations */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Key Innovations:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {paper.keyInnovations.map((innovation, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Zap className="w-3 h-3 text-primary flex-shrink-0" />
                      <span>{innovation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="text-sm font-medium mb-1">Should I implement this?</div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(paper.shouldImplement)}`}>
                    {paper.shouldImplement}
                  </span>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">vs. Existing Approaches</div>
                  <div className="text-sm text-text-muted">{paper.comparisonToExisting}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-2 text-sm text-text-muted">
                  <TrendingUp className="w-4 h-4" />
                  <span>Citation velocity: {paper.citationVelocity}/week</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <a
                    href={`https://arxiv.org/abs/${paper.arxivId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary hover:text-primary-hover text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Read Paper</span>
                  </a>
                  
                  <button
                    onClick={() => navigate(`/paper/${paper.id}`)}
                    className="flex items-center space-x-1 bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover transition-colors text-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Analyze & Implement</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPapers.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Papers Found</h3>
          <p className="text-text-muted">
            Try adjusting your filters or check back later for new papers.
          </p>
        </div>
      )}
    </div>
  )
}