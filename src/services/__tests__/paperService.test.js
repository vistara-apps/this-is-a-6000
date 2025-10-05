import { describe, it, expect, vi, beforeEach } from 'vitest'
import { paperService } from '../paperService'

// Mock OpenAI
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{
            message: {
              content: JSON.stringify({
                keyInnovations: ['Test innovation'],
                problemStatement: 'Test problem',
                methodology: 'Test methodology',
                results: { 'Test Metric': 'Test Value' },
                applications: ['Test application'],
                complexity: 'intermediate',
                tldr: 'Test summary'
              })
            }
          }]
        })
      }
    }
  }))
}))

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: `
        <entry>
          <title>Test Paper Title</title>
          <summary>Test abstract content</summary>
          <name>Test Author</name>
          <published>2023-01-01T00:00:00Z</published>
          <category term="cs.AI" />
        </entry>
      `
    })
  }
}))

describe('paperService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('processPaper', () => {
    it('should process arXiv URL correctly', async () => {
      const result = await paperService.processPaper('https://arxiv.org/abs/1234.5678', 'url')
      
      expect(result).toBeDefined()
      expect(result.source).toBe('arxiv')
      expect(result.aiPowered).toBe(true)
      expect(result.extractedSummary).toBeDefined()
      expect(result.codeTemplates).toBeDefined()
      expect(result.codeTemplates.length).toBeGreaterThan(0)
    })

    it('should process direct arXiv ID correctly', async () => {
      const result = await paperService.processPaper('1234.5678', 'url')
      
      expect(result).toBeDefined()
      expect(result.source).toBe('arxiv')
      // The ID should be the arXiv ID from the paperInfo, but the result.id is generated as timestamp
      expect(result.arxivId).toBe('1234.5678')
    })

    it('should process IEEE URL correctly', async () => {
      const result = await paperService.processPaper('https://ieeexplore.ieee.org/document/123456', 'url')
      
      expect(result).toBeDefined()
      expect(result.source).toBe('ieee')
      expect(result.id).toBe('123456')
    })

    it('should process DOI URL correctly', async () => {
      const result = await paperService.processPaper('https://doi.org/10.1038/nature12345', 'url')
      
      expect(result).toBeDefined()
      expect(result.source).toBe('doi')
      expect(result.id).toBe('10.1038/nature12345')
    })

    it('should throw error for invalid input', async () => {
      await expect(paperService.processPaper('invalid-input', 'url')).rejects.toThrow()
    })

    it('should generate code templates for all frameworks', async () => {
      const result = await paperService.processPaper('1234.5678', 'url')
      
      expect(result.codeTemplates).toBeDefined()
      expect(result.codeTemplates.length).toBe(3) // pytorch, tensorflow, jax
      
      const frameworks = result.codeTemplates.map(t => t.framework)
      expect(frameworks).toContain('pytorch')
      expect(frameworks).toContain('tensorflow')
      expect(frameworks).toContain('jax')
    })

    it('should include AI analysis in results', async () => {
      const result = await paperService.processPaper('1234.5678', 'url')
      
      expect(result.extractedSummary).toBeDefined()
      expect(result.extractedSummary.keyInnovations).toBeDefined()
      expect(result.extractedSummary.problemStatement).toBeDefined()
      expect(result.extractedSummary.methodology).toBeDefined()
      expect(result.extractedSummary.codeInsights).toBeDefined()
    })
  })

  describe('searchPapers', () => {
    it('should search papers by title', async () => {
      const results = await paperService.searchPapers('attention')
      
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
    })

    it('should search papers by abstract', async () => {
      const results = await paperService.searchPapers('transformer')
      
      expect(results).toBeDefined()
      expect(Array.isArray(results)).toBe(true)
    })
  })
})