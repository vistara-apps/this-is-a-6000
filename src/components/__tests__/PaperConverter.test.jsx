import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PaperConverter } from '../PaperConverter'
import { AppProvider } from '../../context/AppContext'

// Mock the paper service
vi.mock('../../services/paperService', () => ({
  paperService: {
    processPaper: vi.fn().mockResolvedValue({
      id: 'test-id',
      title: 'Test Paper',
      aiPowered: true,
      extractedSummary: {
        keyInnovations: ['Test innovation'],
        tldr: 'Test summary'
      },
      codeTemplates: []
    })
  }
}))

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AppProvider>
        {component}
      </AppProvider>
    </BrowserRouter>
  )
}

describe('PaperConverter', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the paper converter modal', () => {
    renderWithProviders(<PaperConverter onClose={mockOnClose} />)
    
    expect(screen.getByText('Convert Research Paper')).toBeInTheDocument()
    expect(screen.getByText('🤖 AI-Powered Analysis Features:')).toBeInTheDocument()
  })

  it('shows enhanced URL input with multiple format support', () => {
    renderWithProviders(<PaperConverter onClose={mockOnClose} />)
    
    expect(screen.getByText('Research Paper URL or ID')).toBeInTheDocument()
    expect(screen.getByText('✅ arXiv: https://arxiv.org/abs/1706.03762 or 1706.03762')).toBeInTheDocument()
    expect(screen.getByText('✅ IEEE: https://ieeexplore.ieee.org/document/123456')).toBeInTheDocument()
    expect(screen.getByText('✅ ACM: https://dl.acm.org/doi/10.1145/123.456')).toBeInTheDocument()
    expect(screen.getByText('✅ DOI: https://doi.org/10.1038/nature12345')).toBeInTheDocument()
  })

  it('displays AI-powered features list', () => {
    renderWithProviders(<PaperConverter onClose={mockOnClose} />)
    
    expect(screen.getByText('AI-generated plain-English summary')).toBeInTheDocument()
    expect(screen.getByText('Key innovations extraction')).toBeInTheDocument()
    expect(screen.getByText('Smart code generation (PyTorch/TF/JAX)')).toBeInTheDocument()
    expect(screen.getByText('Methodology & results analysis')).toBeInTheDocument()
    expect(screen.getByText('Practical applications insights')).toBeInTheDocument()
    expect(screen.getByText('Implementation complexity assessment')).toBeInTheDocument()
  })

  it('shows OpenRouter GPT-4o-mini branding', () => {
    renderWithProviders(<PaperConverter onClose={mockOnClose} />)
    
    expect(screen.getByText('⚡ Powered by OpenRouter GPT-4o-mini for intelligent paper analysis')).toBeInTheDocument()
  })

  it('allows input type switching between URL and file upload', () => {
    renderWithProviders(<PaperConverter onClose={mockOnClose} />)
    
    const urlButton = screen.getByText('arXiv URL')
    const fileButton = screen.getByText('Upload PDF')
    
    expect(urlButton).toBeInTheDocument()
    expect(fileButton).toBeInTheDocument()
    
    fireEvent.click(fileButton)
    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument()
  })

  it('validates input before submission', async () => {
    renderWithProviders(<PaperConverter onClose={mockOnClose} />)
    
    const submitButton = screen.getByText('Convert Paper')
    fireEvent.click(submitButton)
    
    // Should not submit with empty input
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('processes valid arXiv URL', async () => {
    renderWithProviders(<PaperConverter onClose={mockOnClose} />)
    
    const input = screen.getByPlaceholderText(/https:\/\/arxiv\.org\/abs\/1706\.03762/)
    const submitButton = screen.getByText('Convert Paper')
    
    fireEvent.change(input, { target: { value: 'https://arxiv.org/abs/1706.03762' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })
  })

  it('closes modal when close button is clicked', () => {
    renderWithProviders(<PaperConverter onClose={mockOnClose} />)
    
    // The close button is the first button with no text content (just an X icon)
    const closeButton = screen.getAllByRole('button')[0]
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})