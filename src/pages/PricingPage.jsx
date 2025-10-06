import React from 'react'
import { Check, Crown, Zap, Users, X } from 'lucide-react'

export const PricingPage = () => {
  const plans = [
    {
      name: 'Pay-per-Use',
      price: '$0',
      period: 'to start',
      description: 'Perfect for trying out PaperForge with x402 payments',
      features: [
        '1 FREE paper conversion',
        '$5 per additional paper',
        'Full AI-powered analysis',
        'Code templates for PyTorch & TensorFlow',
        'Architecture recommendations',
        'Export to multiple formats'
      ],
      limitations: [
        'No monthly subscription',
        'Pay only for what you use',
        'No upfront commitment'
      ],
      cta: 'Start Free',
      popular: true,
      color: 'bg-primary/10 border-primary'
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      description: 'For serious ML engineers and researchers',
      features: [
        'Unlimited paper conversions',
        'Full benchmarking suite',
        'Architecture decision assistant',
        'Priority support',
        'Export to multiple formats',
        'Advanced code templates',
        'Performance analytics'
      ],
      limitations: [
        'Limited team collaboration',
        'No API access'
      ],
      cta: 'Start Pro Trial',
      popular: false,
      color: 'bg-surface border-border'
    },
    {
      name: 'Team',
      price: '$99',
      period: 'per month',
      description: 'For research teams and organizations',
      features: [
        '500 paper conversions per month',
        'Everything in Pro',
        'Team collaboration tools',
        'Shared collections',
        'API access (10k calls/month)',
        'Custom integrations',
        'Priority email support',
        'Team analytics dashboard'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      color: 'bg-surface border-border'
    }
  ]

  const faq = [
    {
      question: 'How accurate are the code templates?',
      answer: 'Our code templates are generated using state-of-the-art language models and are validated against the original paper implementations. We achieve 90%+ functional accuracy with proper documentation and best practices.'
    },
    {
      question: 'Can I use my own models for benchmarking?',
      answer: 'Yes! You can upload your trained models in popular formats (.pth, .h5, .safetensors) and benchmark them against standardized datasets from the research community.'
    },
    {
      question: 'Do you support frameworks other than PyTorch?',
      answer: 'Currently we support PyTorch and TensorFlow, with JAX coming soon. Our templates include proper setup instructions and dependency management for each framework.'
    },
    {
      question: 'Is there an API for enterprise use?',
      answer: 'Yes, our Team plan includes API access with 10k calls per month. For higher volumes or custom integrations, please contact our sales team for enterprise pricing.'
    },
    {
      question: 'How does the collaborative workspace work?',
      answer: 'Team members can share paper analyses, add annotations, track implementation status, and export comprehensive reports. All changes are synced in real-time with proper version control.'
    }
  ]

  return (
    <div className="py-8 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          Choose the plan that fits your research workflow. All plans include our core paper conversion features.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-xl p-8 ${plan.color} ${
              plan.popular ? 'ring-2 ring-primary shadow-glow' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-text-muted">/{plan.period}</span>
                </div>
                <p className="text-sm text-text-muted">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.map((limitation, limitIndex) => (
                  <div key={limitIndex} className="flex items-center space-x-3 opacity-50">
                    <X className="w-5 h-5 text-error flex-shrink-0" />
                    <span className="text-sm line-through">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'bg-surface border border-border hover:bg-surface-hover'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Examples */}
      <div className="bg-surface border border-border rounded-xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Perfect for every use case</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-accent/20 text-accent rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">Individual Researchers</h3>
            <p className="text-sm text-text-muted">
              Stay current with latest papers and implement new architectures quickly for your projects.
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-lg flex items-center justify-center mx-auto">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">ML Engineers</h3>
            <p className="text-sm text-text-muted">
              Bridge the research-production gap with validated implementations and benchmarking tools.
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-success/20 text-success rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">Research Teams</h3>
            <p className="text-sm text-text-muted">
              Collaborate on paper analysis and track implementation progress across your organization.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          {faq.map((item, index) => (
            <div key={index} className="bg-surface border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-3">{item.question}</h3>
              <p className="text-text-muted leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-6 bg-surface border border-border rounded-xl p-8 max-w-2xl mx-auto">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Ready to transform your research workflow?</h2>
          <p className="text-text-muted">
            Join thousands of researchers who are implementing AI papers faster than ever.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors">
            Start Free Trial
          </button>
          <button className="bg-surface border border-border text-text px-6 py-3 rounded-lg font-medium hover:bg-surface-hover transition-colors">
            Schedule Demo
          </button>
        </div>
      </div>
    </div>
  )
}