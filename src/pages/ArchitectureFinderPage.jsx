import React, { useState } from 'react'
import { Search, Brain, Zap, Clock, TrendingUp, ExternalLink, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const ArchitectureFinderPage = () => {
  const navigate = useNavigate()
  const [taskDescription, setTaskDescription] = useState('')
  const [performancePriority, setPerformancePriority] = useState(0.5)
  const [complexityLevel, setComplexityLevel] = useState('intermediate')
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const complexityOptions = [
    { value: 'beginner', label: 'Beginner', description: 'Simple, well-documented models' },
    { value: 'intermediate', label: 'Intermediate', description: 'Moderate complexity, good performance' },
    { value: 'advanced', label: 'Advanced', description: 'State-of-the-art, complex architectures' }
  ]

  const mockRecommendations = [
    {
      id: '1',
      title: 'YOLOv8: Real-Time Object Detection',
      arxivId: '2305.09972',
      authors: ['Jocher, G.', 'Qiu, J.', 'Chaurasia, A.'],
      matchScore: 95,
      reasoning: 'Optimized for real-time inference on edge devices with excellent speed-accuracy trade-off for object detection tasks.',
      expectedAccuracy: 'mAP 53.7% on COCO',
      inferenceSpeed: '1.2ms on A100',
      complexityScore: 7,
      pretrainedAvailable: true,
      implementationDifficulty: 'Easy',
      tags: ['Computer Vision', 'Object Detection', 'Real-time', 'Edge Computing']
    },
    {
      id: '2', 
      title: 'EfficientDet: Scalable Object Detection',
      arxivId: '1911.09070',
      authors: ['Tan, M.', 'Pang, R.', 'Le, Q.V.'],
      matchScore: 88,
      reasoning: 'Excellent balance between accuracy and efficiency with compound scaling for various deployment scenarios.',
      expectedAccuracy: 'mAP 52.2% on COCO',
      inferenceSpeed: '2.8ms on A100', 
      complexityScore: 8,
      pretrainedAvailable: true,
      implementationDifficulty: 'Moderate',
      tags: ['Computer Vision', 'Object Detection', 'Efficient', 'Scalable']
    },
    {
      id: '3',
      title: 'Mask R-CNN: Instance Segmentation',
      arxivId: '1703.06870',
      authors: ['He, K.', 'Gkioxari, G.', 'Dollár, P.', 'Girshick, R.'],
      matchScore: 75,
      reasoning: 'Highly accurate for detailed object detection and segmentation but slower inference speed.',
      expectedAccuracy: 'mAP 38.2% on COCO',
      inferenceSpeed: '15ms on A100',
      complexityScore: 9,
      pretrainedAvailable: true,
      implementationDifficulty: 'Hard',
      tags: ['Computer Vision', 'Instance Segmentation', 'High Accuracy']
    }
  ]

  const handleSearch = async () => {
    if (!taskDescription.trim()) return
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRecommendations(mockRecommendations)
    setIsLoading(false)
  }

  const getComplexityColor = (score) => {
    if (score <= 6) return 'text-success'
    if (score <= 8) return 'text-warning'
    return 'text-error'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/20 text-success'
      case 'Moderate': return 'bg-warning/20 text-warning'
      case 'Hard': return 'bg-error/20 text-error'
      default: return 'bg-text-muted/20 text-text-muted'
    }
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Architecture Decision Assistant</h1>
        <p className="text-text-muted max-w-2xl mx-auto">
          Get expert-level architecture recommendations tailored to your specific use case and requirements.
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-4xl mx-auto bg-surface border border-border rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Description</label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="e.g., Real-time video object detection for edge devices with limited compute..."
              rows={3}
              className="w-full input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Priority */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Performance Priority</label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={performancePriority}
                  onChange={(e) => setPerformancePriority(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Speed</span>
                  <span>Balance</span>
                  <span>Accuracy</span>
                </div>
              </div>
            </div>

            {/* Complexity Level */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Implementation Complexity</label>
              <div className="space-y-2">
                {complexityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      complexityLevel === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-surface-hover'
                    }`}
                  >
                    <input
                      type="radio"
                      name="complexity"
                      value={option.value}
                      checked={complexityLevel === option.value}
                      onChange={(e) => setComplexityLevel(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-text-muted">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={!taskDescription.trim() || isLoading}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Brain className="w-5 h-5 animate-pulse" />
              <span>Analyzing Requirements...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Find Architectures</span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recommended Architectures</h2>
            <span className="text-sm text-text-muted">
              {recommendations.length} matches found
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-surface border border-border rounded-xl p-6 hover:bg-surface-hover transition-colors">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold leading-tight">{rec.title}</h3>
                      <div className="flex items-center space-x-1 text-primary text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        <span>{rec.matchScore}%</span>
                      </div>
                    </div>
                    <div className="text-sm text-text-muted">
                      {rec.authors.join(', ')} • {rec.arxivId}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {rec.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-bg border border-border rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Reasoning */}
                  <p className="text-sm text-text-muted leading-relaxed">
                    {rec.reasoning}
                  </p>

                  {/* Metrics */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted">Expected Performance</span>
                      <span className="font-medium">{rec.expectedAccuracy}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted">Inference Speed</span>
                      <span className="font-medium">{rec.inferenceSpeed}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted">Complexity</span>
                      <span className={`font-medium ${getComplexityColor(rec.complexityScore)}`}>
                        {rec.complexityScore}/10
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(rec.implementationDifficulty)}`}>
                        {rec.implementationDifficulty}
                      </span>
                      {rec.pretrainedAvailable && (
                        <span className="px-2 py-1 text-xs bg-success/20 text-success rounded-full">
                          Pretrained
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => navigate(`/paper/${rec.id}`)}
                      className="flex items-center space-x-1 text-primary hover:text-primary-hover text-sm font-medium"
                    >
                      <span>Implement</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recommendations.length === 0 && !isLoading && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <Brain className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Ready to Find Your Perfect Architecture</h3>
          <p className="text-text-muted">
            Describe your task above and we'll recommend the best architectures based on your requirements.
          </p>
        </div>
      )}
    </div>
  )
}