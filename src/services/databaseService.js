import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export const databaseService = {
  // User Profile Management
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') { // Not found is ok
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  },

  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...updates })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  async incrementPapersAnalyzed(userId) {
    try {
      const { data, error } = await supabase.rpc('increment_papers_analyzed', {
        user_id: userId
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error incrementing papers analyzed:', error)
      // Fallback: manual increment
      const profile = await this.getUserProfile(userId)
      if (profile) {
        return await this.updateUserProfile(userId, {
          papers_analyzed: (profile.papers_analyzed || 0) + 1
        })
      }
      throw error
    }
  },

  // Paper Management
  async savePaper(paperData) {
    try {
      const paperId = uuidv4()
      
      const { data, error } = await supabase
        .from('papers')
        .insert({
          id: paperId,
          user_id: paperData.user_id,
          title: paperData.title,
          authors: paperData.authors || [],
          abstract: paperData.abstract,
          arxiv_id: paperData.arxivId,
          source: paperData.source,
          source_url: paperData.url,
          pdf_url: paperData.pdfUrl,
          published_date: paperData.publishedDate,
          primary_category: paperData.primaryCategory,
          citations: paperData.citations || 0,
          processing_status: paperData.processingStatus || 'completed',
          ai_powered: paperData.aiPowered || true
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving paper:', error)
      throw error
    }
  },

  async getUserPapers(userId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select(`
          *,
          paper_analyses(*),
          code_templates(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user papers:', error)
      throw error
    }
  },

  async getPaper(paperId) {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select(`
          *,
          paper_analyses(*),
          code_templates(*)
        `)
        .eq('id', paperId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching paper:', error)
      throw error
    }
  },

  // Analysis Management
  async saveAnalysis(paperId, analysisData) {
    try {
      const { data, error } = await supabase
        .from('paper_analyses')
        .insert({
          paper_id: paperId,
          key_innovations: analysisData.keyInnovations || [],
          problem_statement: analysisData.problemStatement,
          methodology: analysisData.methodology,
          results: analysisData.results || {},
          applications: analysisData.applications || [],
          complexity: analysisData.complexity,
          tldr: analysisData.tldr,
          code_insights: analysisData.codeInsights || {}
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving analysis:', error)
      throw error
    }
  },

  // Code Templates Management
  async saveCodeTemplates(paperId, templates) {
    try {
      const templatePromises = templates.map(template => 
        supabase
          .from('code_templates')
          .insert({
            paper_id: paperId,
            framework: template.framework,
            language: template.language || 'python',
            code: template.code,
            estimated_complexity: template.estimatedComplexity,
            dependencies: template.dependencies || [],
            algorithms: template.algorithms || []
          })
      )
      
      const results = await Promise.all(templatePromises)
      
      // Check for errors
      const errors = results.filter(result => result.error)
      if (errors.length > 0) {
        throw new Error(`Failed to save ${errors.length} code templates`)
      }
      
      return results.map(result => result.data).flat()
    } catch (error) {
      console.error('Error saving code templates:', error)
      throw error
    }
  },

  // Payment Management
  async createPayment(userId, paperId, stripePaymentIntentId, amount) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          paper_id: paperId,
          stripe_payment_intent_id: stripePaymentIntentId,
          amount,
          currency: 'usd',
          status: 'pending'
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating payment record:', error)
      throw error
    }
  },

  async updatePaymentStatus(paymentIntentId, status) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ status })
        .eq('stripe_payment_intent_id', paymentIntentId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating payment status:', error)
      throw error
    }
  },

  async getUserPayments(userId) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          papers(title, created_at)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user payments:', error)
      throw error
    }
  },

  // Collections Management
  async createCollection(userId, name, description = '') {
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          user_id: userId,
          name,
          description,
          paper_ids: []
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating collection:', error)
      throw error
    }
  },

  async getUserCollections(userId) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching collections:', error)
      throw error
    }
  },

  async addPaperToCollection(collectionId, paperId) {
    try {
      // First get the current paper_ids
      const { data: collection, error: fetchError } = await supabase
        .from('collections')
        .select('paper_ids')
        .eq('id', collectionId)
        .single()
      
      if (fetchError) throw fetchError
      
      const currentPaperIds = collection.paper_ids || []
      if (!currentPaperIds.includes(paperId)) {
        const updatedPaperIds = [...currentPaperIds, paperId]
        
        const { data, error } = await supabase
          .from('collections')
          .update({ paper_ids: updatedPaperIds })
          .eq('id', collectionId)
          .select()
          .single()
        
        if (error) throw error
        return data
      }
      
      return collection
    } catch (error) {
      console.error('Error adding paper to collection:', error)
      throw error
    }
  },

  // Analytics
  async getUserStats(userId) {
    try {
      const [papersResult, paymentsResult] = await Promise.all([
        supabase
          .from('papers')
          .select('id, created_at, processing_status')
          .eq('user_id', userId),
        supabase
          .from('payments')
          .select('amount, status, created_at')
          .eq('user_id', userId)
      ])
      
      if (papersResult.error) throw papersResult.error
      if (paymentsResult.error) throw paymentsResult.error
      
      const papers = papersResult.data || []
      const payments = paymentsResult.data || []
      
      return {
        totalPapers: papers.length,
        completedPapers: papers.filter(p => p.processing_status === 'completed').length,
        totalSpent: payments
          .filter(p => p.status === 'succeeded')
          .reduce((sum, p) => sum + p.amount, 0),
        successfulPayments: payments.filter(p => p.status === 'succeeded').length
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw error
    }
  }
}