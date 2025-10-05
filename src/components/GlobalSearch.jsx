import React, { useState, useEffect, useRef } from 'react'
import { Search, FileText, Users, Calendar, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export const GlobalSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { papers, collections } = useApp()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ papers: [], collections: [] })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults({ papers: [], collections: [] })
      return
    }

    const searchQuery = query.toLowerCase()
    
    const filteredPapers = papers.filter(paper =>
      paper.title.toLowerCase().includes(searchQuery) ||
      paper.authors.some(author => author.toLowerCase().includes(searchQuery)) ||
      paper.abstract.toLowerCase().includes(searchQuery)
    ).slice(0, 5)

    const filteredCollections = collections.filter(collection =>
      collection.name.toLowerCase().includes(searchQuery) ||
      collection.description.toLowerCase().includes(searchQuery) ||
      collection.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    ).slice(0, 3)

    setResults({ papers: filteredPapers, collections: filteredCollections })
    setSelectedIndex(0)
  }, [query, papers, collections])

  const totalResults = results.papers.length + results.collections.length
  const allItems = [...results.papers.map(p => ({ type: 'paper', ...p })), ...results.collections.map(c => ({ type: 'collection', ...c }))]

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % totalResults)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + totalResults) % totalResults)
        break
      case 'Enter':
        e.preventDefault()
        if (allItems[selectedIndex]) {
          handleSelect(allItems[selectedIndex])
        }
        break
      case 'Escape':
        onClose()
        break
    }
  }

  const handleSelect = (item) => {
    if (item.type === 'paper') {
      navigate(`/paper/${item.id}`)
    } else {
      navigate('/collections')
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-surface border border-border rounded-xl max-w-2xl w-full mx-4 shadow-2xl">
        {/* Search Input */}
        <div className="flex items-center space-x-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search papers, collections, authors..."
            className="flex-1 bg-transparent text-text placeholder-text-muted focus:outline-none"
          />
          <div className="text-xs text-text-muted">ESC to close</div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query && totalResults === 0 && (
            <div className="p-8 text-center text-text-muted">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          )}

          {/* Papers */}
          {results.papers.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wide">
                Papers ({results.papers.length})
              </div>
              {results.papers.map((paper, index) => (
                <button
                  key={paper.id}
                  onClick={() => handleSelect({ type: 'paper', ...paper })}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedIndex === index
                      ? 'bg-primary/10 border border-primary'
                      : 'hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm line-clamp-1">{paper.title}</div>
                      <div className="text-xs text-text-muted mt-1">
                        {paper.authors.slice(0, 2).join(', ')}
                        {paper.authors.length > 2 && ` +${paper.authors.length - 2}`}
                      </div>
                    </div>
                    <div className="text-xs text-text-muted">
                      {new Date(paper.publishedDate).getFullYear()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Collections */}
          {results.collections.length > 0 && (
            <div className="p-2 border-t border-border">
              <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wide">
                Collections ({results.collections.length})
              </div>
              {results.collections.map((collection, index) => (
                <button
                  key={collection.id}
                  onClick={() => handleSelect({ type: 'collection', ...collection })}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedIndex === results.papers.length + index
                      ? 'bg-primary/10 border border-primary'
                      : 'hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm line-clamp-1">{collection.name}</div>
                      <div className="text-xs text-text-muted mt-1 line-clamp-1">
                        {collection.description}
                      </div>
                    </div>
                    <div className="text-xs text-text-muted">
                      {collection.paperCount} papers
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {!query && (
            <div className="p-4 border-t border-border">
              <div className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">
                Quick Actions
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate('/architecture-finder')
                    onClose()
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Search className="w-5 h-5 text-warning" />
                    <span className="text-sm">Find Architecture</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    navigate('/changelog')
                    onClose()
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-accent" />
                    <span className="text-sm">Latest Papers</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}