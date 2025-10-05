import React, { useState } from 'react'
import { Plus, FolderOpen, Search, Filter, MoreVertical, Star, Share2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export const CollectionsPage = () => {
  const { collections, papers, createCollection } = useApp()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const mockCollections = [
    {
      id: '1',
      name: 'Transformer Architectures',
      description: 'Evolution of attention mechanisms in deep learning',
      isPublic: true,
      tags: ['NLP', 'Attention', 'Transformers'],
      paperCount: 12,
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Computer Vision 2024',
      description: 'Latest breakthrough papers in computer vision',
      isPublic: false,
      tags: ['Computer Vision', 'CNN', 'ViT'],
      paperCount: 8,
      createdAt: '2024-01-05',
      lastUpdated: '2024-01-14'
    },
    {
      id: '3',
      name: 'Efficient ML Models',
      description: 'Resource-efficient architectures for production deployment',
      isPublic: true,
      tags: ['Efficiency', 'Mobile', 'Edge Computing'],
      paperCount: 15,
      createdAt: '2023-12-20',
      lastUpdated: '2024-01-12'
    }
  ]

  const allCollections = [...collections, ...mockCollections]

  const filteredCollections = allCollections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedFilter === 'public') return matchesSearch && collection.isPublic
    if (selectedFilter === 'private') return matchesSearch && !collection.isPublic
    return matchesSearch
  })

  const handleCreateCollection = (collectionData) => {
    createCollection(collectionData)
    setShowCreateModal(false)
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-text-muted mt-1">
            Organize and share your research paper analyses
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-text-muted" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-surface border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Collections</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {/* Collections Grid */}
      {filteredCollections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection) => (
            <div key={collection.id} className="bg-surface border border-border rounded-xl p-6 hover:bg-surface-hover transition-colors group">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">{collection.name}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-surface-hover rounded">
                      <Star className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-surface-hover rounded">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-surface-hover rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                  {collection.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {collection.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-bg border border-border rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {collection.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs text-text-muted">
                      +{collection.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-4 text-sm text-text-muted">
                    <span>{collection.paperCount} papers</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      collection.isPublic 
                        ? 'bg-success/20 text-success' 
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {collection.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-text-muted">
                    Updated {new Date(collection.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Collections Found</h3>
          <p className="text-text-muted mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first collection to get started'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
            >
              Create Collection
            </button>
          )}
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <CreateCollectionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCollection}
        />
      )}
    </div>
  )
}

const CreateCollectionModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: []
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    
    onCreate(formData)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">Create New Collection</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Collection Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Computer Vision Papers"
              className="w-full input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this collection is about..."
              rows={3}
              className="w-full input-field resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag..."
                className="flex-1 input-field"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-bg border border-border rounded-full flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-text-muted hover:text-error"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="isPublic" className="text-sm">
              Make this collection public
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Create Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}