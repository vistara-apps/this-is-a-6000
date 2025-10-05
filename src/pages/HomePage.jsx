import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  Code, 
  BarChart3, 
  Brain, 
  Users, 
  Bell,
  ArrowRight,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react'
import { PaperConverter } from '../components/PaperConverter'
import { FeatureCard } from '../components/FeatureCard'
import { useApp } from '../context/AppContext'

export const HomePage = () => {
  const navigate = useNavigate()
  const { user, papers } = useApp()
  const [showConverter, setShowConverter] = useState(false)

  const features = [
    {
      icon: FileText,
      title: "Instant Paper Decoder",
      description: "Transform dense research papers into clear summaries with visual explanations in under 5 minutes.",
      stats: "4-8 hours → 5 minutes",
      color: "accent"
    },
    {
      icon: Code,
      title: "Code Template Generator", 
      description: "Generate production-ready PyTorch/TensorFlow starter code from paper methodology.",
      stats: "2-3 weeks → 1 hour",
      color: "primary"
    },
    {
      icon: BarChart3,
      title: "Live Benchmarking Sandbox",
      description: "Automatically validate your implementation against standardized datasets and metrics.",
      stats: "92% reproducibility score",
      color: "success"
    },
    {
      icon: Brain,
      title: "Architecture Decision Assistant",
      description: "Get expert-level architecture recommendations for your specific use case.",
      stats: "3-5 ranked options",
      color: "warning"
    },
    {
      icon: Bell,
      title: "Paper Changelog Tracker",
      description: "Stay current with breakthrough research through AI-curated weekly digests.",
      stats: "100+ papers/day → curated feed",
      color: "accent"
    },
    {
      icon: Users,
      title: "Collaborative Workspace",
      description: "Share analyses with your team and track implementation progress together.",
      stats: "Team collaboration tools",
      color: "primary"
    }
  ]

  const recentPapers = papers.slice(0, 3)

  return (
    <div className="py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 fade-in">
        <div className="space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4 animate-bounce-gentle">
            <Zap className="w-4 h-4 mr-2" />
            Transform AI Research in Minutes
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Transform Research Papers into
            <span className="text-primary block mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Production-Ready Code
            </span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
            Stop spending weeks deciphering academic jargon. Get structured summaries, 
            starter code templates, and benchmarking tools in minutes.
          </p>
        </div>

        {/* Paper Input */}
        <div className="max-w-2xl mx-auto slide-up">
          <div className="glass-effect rounded-xl p-6 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-text-muted">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
                </div>
                <span>Paste arXiv URL or upload PDF to get started</span>
              </div>
              <button
                onClick={() => setShowConverter(true)}
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-lg font-medium hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <FileText className="w-5 h-5 group-hover:animate-bounce" />
                <span>Convert Your First Paper</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              {user && (
                <div className="text-sm text-text-muted">
                  {user.monthlyConversionsUsed}/{user.monthlyConversionsLimit} free conversions used this month
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-surface border border-border rounded-lg p-6 text-center hover:bg-surface-hover transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-primary group-hover:animate-spin" />
            </div>
            <div className="text-3xl font-bold text-primary mb-1">5 min</div>
            <div className="text-sm text-text-muted">Average conversion time</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-6 text-center hover:bg-surface-hover transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-success group-hover:animate-bounce" />
            </div>
            <div className="text-3xl font-bold text-success mb-1">92%</div>
            <div className="text-sm text-text-muted">Reproducibility score</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-6 text-center hover:bg-surface-hover transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-accent group-hover:animate-pulse" />
            </div>
            <div className="text-3xl font-bold text-accent mb-1">10k+</div>
            <div className="text-sm text-text-muted">Papers converted</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Everything you need to implement AI research</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            From paper comprehension to production deployment, we've got every step of your research-to-code journey covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Papers */}
      {recentPapers.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Recent Papers</h2>
            <button
              onClick={() => navigate('/collections')}
              className="text-primary hover:text-primary-hover font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPapers.map((paper) => (
              <div key={paper.id} className="paper-card">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold line-clamp-2">{paper.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      paper.processingStatus === 'completed' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {paper.processingStatus}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted line-clamp-3">{paper.abstract}</p>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
                    <span>{paper.primaryCategory}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="text-center space-y-6 bg-surface border border-border rounded-xl p-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold">Ready to accelerate your research?</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Join thousands of ML engineers and researchers who are implementing state-of-the-art models faster than ever.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowConverter(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            Start Converting Papers
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="bg-surface border border-border text-text px-6 py-3 rounded-lg font-medium hover:bg-surface-hover transition-colors"
          >
            View Pricing
          </button>
        </div>
      </section>

      {/* Paper Converter Modal */}
      {showConverter && (
        <PaperConverter onClose={() => setShowConverter(false)} />
      )}
    </div>
  )
}