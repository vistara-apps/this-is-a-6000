import React, { useState } from 'react'
import { Upload, PlayCircle, BarChart3, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export const BenchmarkPanel = ({ paper }) => {
  const [benchmarkStep, setBenchmarkStep] = useState('upload') // upload, running, results
  const [selectedDataset, setSelectedDataset] = useState('')
  const [uploadedModel, setUploadedModel] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  const datasets = [
    { id: 'wmt14_en_de', name: 'WMT14 EN-DE', type: 'translation', metrics: ['BLEU', 'METEOR'] },
    { id: 'glue', name: 'GLUE Benchmark', type: 'nlp', metrics: ['Accuracy', 'F1'] },
    { id: 'imagenet', name: 'ImageNet', type: 'vision', metrics: ['Top-1 Acc', 'Top-5 Acc'] },
    { id: 'coco', name: 'MS COCO', type: 'vision', metrics: ['mAP', 'IoU'] }
  ]

  const mockResults = {
    'wmt14_en_de': {
      'BLEU': { yours: 27.8, paper: 28.4, baseline: 24.1 },
      'METEOR': { yours: 0.62, paper: 0.65, baseline: 0.58 }
    },
    'glue': {
      'Accuracy': { yours: 0.89, paper: 0.92, baseline: 0.85 },
      'F1': { yours: 0.88, paper: 0.91, baseline: 0.83 }
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedModel(file)
    }
  }

  const runBenchmark = async () => {
    if (!uploadedModel || !selectedDataset) return
    
    setIsRunning(true)
    setBenchmarkStep('running')
    
    // Simulate benchmark execution
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsRunning(false)
    setBenchmarkStep('results')
  }

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Upload */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Your Model</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              {uploadedModel ? (
                <div className="space-y-2">
                  <CheckCircle className="w-8 h-8 text-success mx-auto" />
                  <p className="text-sm font-medium">{uploadedModel.name}</p>
                  <p className="text-xs text-text-muted">Model uploaded successfully</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-text-muted mx-auto" />
                  <p className="text-sm text-text-muted">Click to upload model checkpoint</p>
                  <p className="text-xs text-text-muted">Supports .pth, .h5, .safetensors files</p>
                </div>
              )}
              <input
                type="file"
                accept=".pth,.h5,.safetensors,.pkl"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Dataset Selection */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Select Benchmark Dataset</h3>
          <div className="space-y-3">
            {datasets.map((dataset) => (
              <label
                key={dataset.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDataset === dataset.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-surface-hover'
                }`}
              >
                <input
                  type="radio"
                  name="dataset"
                  value={dataset.id}
                  checked={selectedDataset === dataset.id}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="text-primary"
                />
                <div className="flex-1">
                  <div className="font-medium">{dataset.name}</div>
                  <div className="text-sm text-text-muted">
                    {dataset.type} • Metrics: {dataset.metrics.join(', ')}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={runBenchmark}
        disabled={!uploadedModel || !selectedDataset}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <PlayCircle className="w-5 h-5" />
        <span>Run Benchmark</span>
      </button>
    </div>
  )

  const renderRunningStep = () => (
    <div className="bg-surface border border-border rounded-xl p-8 text-center">
      <div className="space-y-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Running Benchmark</h3>
          <p className="text-text-muted">
            Evaluating your model on {datasets.find(d => d.id === selectedDataset)?.name}...
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-text-muted mb-2">
            <span>Progress</span>
            <span>67%</span>
          </div>
          <div className="w-full bg-surface-hover rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '67%' }} />
          </div>
        </div>
      </div>
    </div>
  )

  const renderResultsStep = () => {
    const results = mockResults[selectedDataset] || {}
    const datasetInfo = datasets.find(d => d.id === selectedDataset)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Benchmark Results</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-sm text-success font-medium">Reproducibility Score: 92%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(results).map(([metric, scores]) => (
            <div key={metric} className="bg-surface border border-border rounded-xl p-6">
              <h4 className="font-semibold mb-4">{metric}</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Your Implementation</span>
                  <span className="font-medium text-primary">{scores.yours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Original Paper</span>
                  <span className="font-medium">{scores.paper}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Community Baseline</span>
                  <span className="font-medium text-text-muted">{scores.baseline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-bg border border-border rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-medium mb-2">Analysis</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                Your implementation achieves 98% of the original paper's performance on {datasetInfo?.name}. 
                This suggests a highly successful reproduction with minor differences that could be due to 
                training dynamics or hyperparameter variations.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setBenchmarkStep('upload')}
          className="w-full bg-surface border border-border text-text py-3 px-6 rounded-lg font-medium hover:bg-surface-hover transition-colors"
        >
          Run Another Benchmark
        </button>
      </div>
    )
  }

  return (
    <div>
      {benchmarkStep === 'upload' && renderUploadStep()}
      {benchmarkStep === 'running' && renderRunningStep()}
      {benchmarkStep === 'results' && renderResultsStep()}
    </div>
  )
}