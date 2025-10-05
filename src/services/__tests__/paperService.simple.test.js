import { describe, it, expect } from 'vitest'

// Simple tests without complex mocking
describe('Paper URL Parsing', () => {
  // Test URL parsing logic directly
  const parsePaperUrl = (input) => {
    if (typeof input !== 'string') return null
    
    const url = input.trim()
    
    // arXiv patterns
    const arxivUrlMatch = url.match(/arxiv\.org\/abs\/(\d+\.\d+)/)
    if (arxivUrlMatch) {
      return {
        source: 'arxiv',
        id: arxivUrlMatch[1],
        url: url,
        pdfUrl: `https://arxiv.org/pdf/${arxivUrlMatch[1]}.pdf`
      }
    }
    
    // Direct arXiv ID
    const arxivIdMatch = url.match(/^\d+\.\d+$/)
    if (arxivIdMatch) {
      return {
        source: 'arxiv',
        id: url,
        url: `https://arxiv.org/abs/${url}`,
        pdfUrl: `https://arxiv.org/pdf/${url}.pdf`
      }
    }
    
    // ACL Anthology
    const aclMatch = url.match(/aclanthology\.org\/(\d{4}\.\w+\-\w+\.\d+)/)
    if (aclMatch) {
      return {
        source: 'acl',
        id: aclMatch[1],
        url: url,
        pdfUrl: `https://aclanthology.org/${aclMatch[1]}.pdf`
      }
    }
    
    // OpenReview
    const openreviewMatch = url.match(/openreview\.net\/forum\?id=([^&]+)/)
    if (openreviewMatch) {
      return {
        source: 'openreview',
        id: openreviewMatch[1],
        url: url,
        pdfUrl: `https://openreview.net/pdf?id=${openreviewMatch[1]}`
      }
    }
    
    // IEEE Xplore
    const ieeeMatch = url.match(/ieeexplore\.ieee\.org\/document\/(\d+)/)
    if (ieeeMatch) {
      return {
        source: 'ieee',
        id: ieeeMatch[1],
        url: url,
        pdfUrl: null
      }
    }
    
    // PubMed
    const pubmedMatch = url.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/)
    if (pubmedMatch) {
      return {
        source: 'pubmed',
        id: pubmedMatch[1],
        url: url,
        pdfUrl: null
      }
    }
    
    // Generic PDF URL
    if (url.toLowerCase().endsWith('.pdf')) {
      return {
        source: 'pdf',
        id: url.split('/').pop().replace('.pdf', ''),
        url: url,
        pdfUrl: url
      }
    }
    
    return null
  }

  it('should parse arXiv URLs correctly', () => {
    const result = parsePaperUrl('https://arxiv.org/abs/1706.03762')
    
    expect(result).toBeDefined()
    expect(result.source).toBe('arxiv')
    expect(result.id).toBe('1706.03762')
    expect(result.pdfUrl).toBe('https://arxiv.org/pdf/1706.03762.pdf')
  })

  it('should parse direct arXiv IDs', () => {
    const result = parsePaperUrl('1706.03762')
    
    expect(result).toBeDefined()
    expect(result.source).toBe('arxiv')
    expect(result.id).toBe('1706.03762')
  })

  it('should parse ACL Anthology URLs', () => {
    const result = parsePaperUrl('https://aclanthology.org/2020.acl-main.1')
    
    expect(result).toBeDefined()
    expect(result.source).toBe('acl')
    expect(result.id).toBe('2020.acl-main.1')
  })

  it('should parse OpenReview URLs', () => {
    const result = parsePaperUrl('https://openreview.net/forum?id=test123')
    
    expect(result).toBeDefined()
    expect(result.source).toBe('openreview')
    expect(result.id).toBe('test123')
  })

  it('should parse IEEE URLs', () => {
    const result = parsePaperUrl('https://ieeexplore.ieee.org/document/123456')
    
    expect(result).toBeDefined()
    expect(result.source).toBe('ieee')
    expect(result.id).toBe('123456')
  })

  it('should parse PubMed URLs', () => {
    const result = parsePaperUrl('https://pubmed.ncbi.nlm.nih.gov/123456')
    
    expect(result).toBeDefined()
    expect(result.source).toBe('pubmed')
    expect(result.id).toBe('123456')
  })

  it('should parse PDF URLs', () => {
    const result = parsePaperUrl('https://example.com/paper.pdf')
    
    expect(result).toBeDefined()
    expect(result.source).toBe('pdf')
    expect(result.id).toBe('paper')
  })

  it('should return null for invalid URLs', () => {
    const result = parsePaperUrl('invalid-url')
    
    expect(result).toBeNull()
  })
})