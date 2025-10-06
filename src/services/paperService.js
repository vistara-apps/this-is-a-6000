import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": window.location.origin,
    "X-Title": "PaperForge"
  },
  dangerouslyAllowBrowser: true,
})

// Mock paper data for demo purposes
const mockPapers = {
  '1706.03762': {
    arxivId: '1706.03762',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'],
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    publishedDate: '2017-06-12',
    primaryCategory: 'cs.CL',
    citations: 75000,
    pdfUrl: 'https://arxiv.org/pdf/1706.03762.pdf'
  },
  '2010.11929': {
    arxivId: '2010.11929', 
    title: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
    authors: ['Alexey Dosovitskiy', 'Lucas Beyer', 'Alexander Kolesnikov', 'Dirk Weissenborn', 'Xiaohua Zhai', 'Thomas Unterthiner', 'Mostafa Dehghani', 'Matthias Minderer', 'Georg Heigold', 'Sylvain Gelly', 'Jakob Uszkoreit', 'Neil Houlsby'],
    abstract: 'While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. In vision, attention is either applied in conjunction with convolutional networks, or used to replace certain components of convolutional networks while keeping their overall structure in place. We show that this reliance on CNNs is not necessary and a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks.',
    publishedDate: '2020-10-22',
    primaryCategory: 'cs.CV',
    citations: 12000,
    pdfUrl: 'https://arxiv.org/pdf/2010.11929.pdf'
  }
}

// Enhanced paper URL parsing to support multiple sources
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
  
  // OpenReview (NeurIPS, ICLR, etc.)
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
      pdfUrl: null // IEEE PDFs require authentication
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

// Extract arXiv ID for backward compatibility
const extractArxivId = (input) => {
  const parsed = parsePaperUrl(input)
  return parsed && parsed.source === 'arxiv' ? parsed.id : null
}

// Fallback function to extract analysis from raw text when JSON parsing fails
const extractAnalysisFromText = (text) => {
  try {
    // Initialize default structure
    const analysis = {
      keyInnovations: [],
      problemStatement: "",
      methodology: "",
      applications: [],
      complexity: "intermediate",
      technicalBackground: [],
      nextSteps: []
    }

    // Try to extract key innovations
    const innovationsMatch = text.match(/(?:key innovations?|innovations?)[:\s]*(?:\n|$)((?:[-•*]\s*.+(?:\n|$))+)/i)
    if (innovationsMatch) {
      analysis.keyInnovations = innovationsMatch[1]
        .split(/\n/)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5)
    }

    // Try to extract problem statement
    const problemMatch = text.match(/(?:problem statement|problem)[:\s]*(?:\n|$)([^.]*\.(?:[^.]*\.)?(?:[^.]*\.)?)/i)
    if (problemMatch) {
      analysis.problemStatement = problemMatch[1].trim()
    }

    // Try to extract methodology
    const methodologyMatch = text.match(/(?:methodology|method)[:\s]*(?:\n|$)([^.]*\.(?:[^.]*\.)?(?:[^.]*\.)?(?:[^.]*\.)?)/i)
    if (methodologyMatch) {
      analysis.methodology = methodologyMatch[1].trim()
    }

    // Try to extract applications
    const applicationsMatch = text.match(/(?:applications?|uses?)[:\s]*(?:\n|$)((?:[-•*]\s*.+(?:\n|$))+)/i)
    if (applicationsMatch) {
      analysis.applications = applicationsMatch[1]
        .split(/\n/)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 4)
    }

    // Try to extract complexity
    const complexityMatch = text.match(/(?:complexity|difficulty)[:\s]*(?:\n|$)(\w+)/i)
    if (complexityMatch) {
      const complexity = complexityMatch[1].toLowerCase()
      if (['beginner', 'intermediate', 'advanced'].includes(complexity)) {
        analysis.complexity = complexity
      }
    }

    // Try to extract technical background
    const backgroundMatch = text.match(/(?:technical background|background|requirements?)[:\s]*(?:\n|$)((?:[-•*]\s*.+(?:\n|$))+)/i)
    if (backgroundMatch) {
      analysis.technicalBackground = backgroundMatch[1]
        .split(/\n/)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 4)
    }

    // Try to extract next steps
    const stepsMatch = text.match(/(?:next steps?|implementation|steps?)[:\s]*(?:\n|$)((?:[-•*]\s*.+(?:\n|$))+)/i)
    if (stepsMatch) {
      analysis.nextSteps = stepsMatch[1]
        .split(/\n/)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5)
    }

    // Fill in defaults if extraction failed
    if (analysis.keyInnovations.length === 0) {
      analysis.keyInnovations = ["Advanced AI techniques", "Novel architecture design", "Improved performance metrics"]
    }
    if (!analysis.problemStatement) {
      analysis.problemStatement = "This paper addresses important challenges in the field with innovative solutions."
    }
    if (!analysis.methodology) {
      analysis.methodology = "The paper presents a comprehensive methodology combining theoretical insights with practical implementation."
    }
    if (analysis.applications.length === 0) {
      analysis.applications = ["Machine learning applications", "Research and development", "Industry implementations"]
    }
    if (analysis.technicalBackground.length === 0) {
      analysis.technicalBackground = ["Machine learning fundamentals", "Programming experience", "Mathematical background"]
    }
    if (analysis.nextSteps.length === 0) {
      analysis.nextSteps = ["Review paper thoroughly", "Implement basic version", "Test and validate results"]
    }

    return analysis
  } catch (error) {
    console.error('Text extraction failed:', error)
    return {
      keyInnovations: ["Analysis extraction failed - manual review needed"],
      problemStatement: "Unable to extract problem statement from AI response",
      methodology: "Unable to extract methodology from AI response",
      applications: ["Manual analysis required"],
      complexity: "intermediate",
      technicalBackground: ["Review paper manually for requirements"],
      nextSteps: ["Analyze paper manually", "Consult additional resources"]
    }
  }
}

// AI-powered paper analysis using OpenRouter GPT-4o-mini
const analyzePaperWithAI = async (paperData) => {
  try {
    const prompt = `Analyze this research paper and provide a comprehensive breakdown:

Title: ${paperData.title}
Abstract: ${paperData.abstract}
Authors: ${paperData.authors?.join(', ') || 'Unknown'}
Published: ${paperData.publishedDate || 'Unknown'}

Please provide:
1. Key innovations (3-5 bullet points)
2. Problem statement (2-3 sentences)
3. Methodology summary (3-4 sentences)
4. Potential applications (3-4 areas)
5. Implementation complexity (beginner/intermediate/advanced)
6. Required technical background
7. Suggested next steps for implementation

Format your response as JSON with the following structure:
{
  "keyInnovations": ["innovation1", "innovation2", ...],
  "problemStatement": "problem description",
  "methodology": "methodology description", 
  "applications": ["application1", "application2", ...],
  "complexity": "beginner|intermediate|advanced",
  "technicalBackground": ["requirement1", "requirement2", ...],
  "nextSteps": ["step1", "step2", ...]
}`

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert AI researcher and software engineer. Analyze research papers and provide practical insights for implementation. Always respond with valid JSON."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })

    const analysisText = response.choices[0].message.content
    
    // Enhanced JSON parsing with better error handling
    try {
      // Clean the response text to handle common JSON formatting issues
      let cleanedText = analysisText.trim()
      
      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      // Try to find JSON content if it's embedded in text
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanedText = jsonMatch[0]
      }
      
      // Parse the cleaned JSON
      const parsed = JSON.parse(cleanedText)
      
      // Validate that required fields exist
      const requiredFields = ['keyInnovations', 'problemStatement', 'methodology', 'applications', 'complexity', 'technicalBackground', 'nextSteps']
      const hasAllFields = requiredFields.every(field => parsed.hasOwnProperty(field))
      
      if (hasAllFields) {
        return parsed
      } else {
        console.warn('AI response missing required fields, using fallback')
        throw new Error('Missing required fields')
      }
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON:', parseError.message)
      console.log('Raw AI response:', analysisText)
      
      // Try to extract information from the raw text as fallback
      const fallbackAnalysis = extractAnalysisFromText(analysisText)
      return fallbackAnalysis
    }
  } catch (error) {
    console.error('AI analysis failed:', error)
    return {
      keyInnovations: ["Analysis unavailable - using fallback"],
      problemStatement: "AI analysis service temporarily unavailable",
      methodology: "Please refer to the original paper for methodology details",
      applications: ["Refer to paper for applications"],
      complexity: "intermediate", 
      technicalBackground: ["Machine learning knowledge recommended"],
      nextSteps: ["Read paper thoroughly", "Consult additional resources"]
    }
  }
}

// Fetch paper metadata from various sources
const fetchPaperMetadata = async (paperInfo) => {
  try {
    if (paperInfo.source === 'arxiv') {
      // Fetch from arXiv API
      const response = await fetch(`https://export.arxiv.org/api/query?id_list=${paperInfo.id}`)
      const xmlText = await response.text()
      
      // Parse XML response (simplified parsing)
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
      const entry = xmlDoc.querySelector('entry')
      
      if (entry) {
        const title = entry.querySelector('title')?.textContent?.trim()
        const summary = entry.querySelector('summary')?.textContent?.trim()
        const authors = Array.from(entry.querySelectorAll('author name')).map(name => name.textContent?.trim())
        const published = entry.querySelector('published')?.textContent?.trim()
        const category = entry.querySelector('category')?.getAttribute('term')
        
        return {
          arxivId: paperInfo.id,
          title: title || 'Unknown Title',
          authors: authors || ['Unknown Author'],
          abstract: summary || 'No abstract available',
          publishedDate: published ? published.split('T')[0] : new Date().toISOString().split('T')[0],
          primaryCategory: category || 'cs.AI',
          citations: Math.floor(Math.random() * 1000), // Placeholder
          pdfUrl: paperInfo.pdfUrl,
          source: paperInfo.source,
          url: paperInfo.url
        }
      }
    }
    
    // For other sources, return basic structure with placeholder data
    return {
      id: paperInfo.id,
      title: `Paper from ${paperInfo.source.toUpperCase()}`,
      authors: ['Unknown Author'],
      abstract: 'Paper metadata will be extracted and analyzed by AI.',
      publishedDate: new Date().toISOString().split('T')[0],
      primaryCategory: 'cs.AI',
      citations: 0,
      pdfUrl: paperInfo.pdfUrl,
      source: paperInfo.source,
      url: paperInfo.url
    }
  } catch (error) {
    console.error('Failed to fetch paper metadata:', error)
    
    // Return fallback metadata
    return {
      id: paperInfo.id,
      title: 'Paper Analysis',
      authors: ['Unknown Author'],
      abstract: 'Unable to fetch paper metadata. AI analysis will be performed on the provided URL.',
      publishedDate: new Date().toISOString().split('T')[0],
      primaryCategory: 'cs.AI',
      citations: 0,
      pdfUrl: paperInfo.pdfUrl,
      source: paperInfo.source,
      url: paperInfo.url
    }
  }
}

// Generate AI-powered code templates
const generateAICodeTemplate = async (paperData, framework = 'pytorch') => {
  try {
    const prompt = `Generate production-ready ${framework} code for implementing the methodology described in this research paper:

Title: ${paperData.title}
Abstract: ${paperData.abstract}

Requirements:
1. Create a complete, runnable implementation
2. Include proper imports and dependencies
3. Add comprehensive comments explaining each part
4. Follow best practices for ${framework}
5. Include training loop and evaluation code
6. Make it modular and extensible

Focus on the core algorithmic contributions of the paper. The code should be educational but production-ready.`

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert ${framework} developer and ML engineer. Generate clean, well-documented, production-ready code that implements research paper methodologies. Always include proper error handling and best practices.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 3000
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('AI code generation failed:', error)
    // Fall back to existing template generation
    return generateCodeTemplate(paperData, framework)
  }
}

const generateCodeTemplate = async (paper, framework = 'pytorch') => {
  const isTransformer = paper.title.toLowerCase().includes('transformer') || 
                      paper.title.toLowerCase().includes('attention')
  
  if (framework === 'pytorch') {
    if (isTransformer) {
      return `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads, dropout=0.1):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.w_q = nn.Linear(d_model, d_model)
        self.w_k = nn.Linear(d_model, d_model)
        self.w_v = nn.Linear(d_model, d_model)
        self.w_o = nn.Linear(d_model, d_model)
        
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)
        
        # Linear transformations and split into heads
        q = self.w_q(query).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        k = self.w_k(key).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        v = self.w_v(value).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        # Scaled dot-product attention
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_k)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
            
        attention_weights = F.softmax(scores, dim=-1)
        attention_weights = self.dropout(attention_weights)
        
        context = torch.matmul(attention_weights, v)
        
        # Concatenate heads and project
        context = context.transpose(1, 2).contiguous().view(
            batch_size, -1, self.d_model
        )
        
        return self.w_o(context)

class TransformerBlock(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        self.attention = MultiHeadAttention(d_model, num_heads, dropout)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        
        self.feed_forward = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )
        
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x, mask=None):
        # Self-attention with residual connection
        attn_out = self.attention(x, x, x, mask)
        x = self.norm1(x + self.dropout(attn_out))
        
        # Feed forward with residual connection
        ff_out = self.feed_forward(x)
        x = self.norm2(x + self.dropout(ff_out))
        
        return x

class TransformerModel(nn.Module):
    def __init__(self, vocab_size, d_model=512, num_heads=8, num_layers=6, d_ff=2048, max_len=1000, dropout=0.1):
        super().__init__()
        self.d_model = d_model
        
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.positional_encoding = self.create_positional_encoding(max_len, d_model)
        
        self.transformer_blocks = nn.ModuleList([
            TransformerBlock(d_model, num_heads, d_ff, dropout)
            for _ in range(num_layers)
        ])
        
        self.dropout = nn.Dropout(dropout)
        self.output_projection = nn.Linear(d_model, vocab_size)
        
    def create_positional_encoding(self, max_len, d_model):
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len).unsqueeze(1).float()
        
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * 
                           -(math.log(10000.0) / d_model))
        
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        
        return pe.unsqueeze(0)
        
    def forward(self, x, mask=None):
        seq_len = x.size(1)
        
        # Embedding + positional encoding
        x = self.embedding(x) * math.sqrt(self.d_model)
        x = x + self.positional_encoding[:, :seq_len, :].to(x.device)
        x = self.dropout(x)
        
        # Pass through transformer blocks
        for transformer in self.transformer_blocks:
            x = transformer(x, mask)
            
        # Output projection
        return self.output_projection(x)

# Training setup
def train_model():
    model = TransformerModel(vocab_size=30000)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    criterion = nn.CrossEntropyLoss()
    
    # Your training loop here
    for epoch in range(num_epochs):
        for batch in dataloader:
            optimizer.zero_grad()
            outputs = model(batch['input_ids'])
            loss = criterion(outputs.view(-1, outputs.size(-1)), batch['labels'].view(-1))
            loss.backward()
            optimizer.step()
            
if __name__ == "__main__":
    train_model()`
    } else {
      return `import torch
import torch.nn as nn
import torch.nn.functional as F

class ConvolutionalNetwork(nn.Module):
    def __init__(self, num_classes=1000):
        super().__init__()
        
        # Feature extraction layers
        self.features = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        
        # Classification head
        self.classifier = nn.Sequential(
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten(),
            nn.Linear(256, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes)
        )
        
    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

# Training setup
def train_model():
    model = ConvolutionalNetwork()
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    criterion = nn.CrossEntropyLoss()
    
    # Your training loop here
    for epoch in range(num_epochs):
        for batch_idx, (data, target) in enumerate(dataloader):
            optimizer.zero_grad()
            output = model(data)
            loss = criterion(output, target)
            loss.backward()
            optimizer.step()
            
if __name__ == "__main__":
    train_model()`
    }
  }
  
  // Similar structure for TensorFlow
  return `# TensorFlow implementation coming soon...`
}

export const paperService = {
  async processPaper(input, inputType) {
    try {
      // Parse the paper URL/input
      const paperInfo = parsePaperUrl(input)
      
      if (!paperInfo) {
        throw new Error('Unable to parse paper URL. Please provide a valid arXiv, ACL, OpenReview, IEEE, PubMed URL, or direct PDF link.')
      }

      // Check if we have mock data for this paper (for demo purposes)
      const arxivId = extractArxivId(input)
      if (arxivId && mockPapers[arxivId]) {
        const paperData = mockPapers[arxivId]
        
        // Use AI analysis for mock papers too
        const aiAnalysis = await analyzePaperWithAI(paperData)
        
        // Generate AI-powered code templates
        const codeTemplates = await Promise.all([
          {
            framework: 'pytorch',
            language: 'python',
            code: await generateAICodeTemplate(paperData, 'pytorch'),
            estimatedComplexity: aiAnalysis.complexity || 'intermediate'
          },
          {
            framework: 'tensorflow',
            language: 'python',
            code: await generateAICodeTemplate(paperData, 'tensorflow'),
            estimatedComplexity: aiAnalysis.complexity || 'intermediate'
          }
        ])
        
        return {
          id: Date.now().toString(),
          ...paperData,
          processingStatus: 'completed',
          extractedSummary: {
            keyInnovations: aiAnalysis.keyInnovations,
            problemStatement: aiAnalysis.problemStatement,
            methodology: aiAnalysis.methodology,
            applications: aiAnalysis.applications,
            complexity: aiAnalysis.complexity,
            technicalBackground: aiAnalysis.technicalBackground,
            nextSteps: aiAnalysis.nextSteps,
            results: {
              "WMT 2014 EN-DE": "28.4 BLEU",
              "WMT 2014 EN-FR": "41.8 BLEU", 
              "Training Time": "3.5 days on 8 P100 GPUs",
              "Parameters": "65M (base) / 213M (big)"
            }
          },
          codeTemplates,
          architectureDiagram: '/api/placeholder/600/400',
          benchmarkResults: [],
          createdAt: new Date().toISOString()
        }
      }

      // Fetch paper metadata from the source
      const paperData = await fetchPaperMetadata(paperInfo)
      
      // Perform AI analysis
      const aiAnalysis = await analyzePaperWithAI(paperData)
      
      // Generate AI-powered code templates
      const codeTemplates = await Promise.all([
        {
          framework: 'pytorch',
          language: 'python',
          code: await generateAICodeTemplate(paperData, 'pytorch'),
          estimatedComplexity: aiAnalysis.complexity || 'intermediate'
        },
        {
          framework: 'tensorflow',
          language: 'python',
          code: await generateAICodeTemplate(paperData, 'tensorflow'),
          estimatedComplexity: aiAnalysis.complexity || 'intermediate'
        }
      ])
      
      return {
        id: Date.now().toString(),
        ...paperData,
        processingStatus: 'completed',
        extractedSummary: {
          keyInnovations: aiAnalysis.keyInnovations,
          problemStatement: aiAnalysis.problemStatement,
          methodology: aiAnalysis.methodology,
          applications: aiAnalysis.applications,
          complexity: aiAnalysis.complexity,
          technicalBackground: aiAnalysis.technicalBackground,
          nextSteps: aiAnalysis.nextSteps,
          results: {}
        },
        codeTemplates,
        architectureDiagram: '/api/placeholder/600/400',
        benchmarkResults: [],
        createdAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Paper processing failed:', error)
      throw new Error(`Failed to process paper: ${error.message}`)
    }
  },
  
  async searchPapers(query) {
    // Mock search functionality
    return Object.values(mockPapers).filter(paper =>
      paper.title.toLowerCase().includes(query.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(query.toLowerCase())
    )
  }
}