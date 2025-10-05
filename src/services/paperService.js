import OpenAI from 'openai'
import axios from 'axios'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

// Use GPT-4o-mini as specified in the requirements
const AI_MODEL = 'openai/gpt-4o-mini'

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
const extractPaperInfo = (input) => {
  if (typeof input !== 'string') return null
  
  const cleanInput = input.trim()
  
  // ArXiv patterns
  const arxivUrlMatch = cleanInput.match(/arxiv\.org\/(?:abs|pdf)\/(\d+\.\d+)/)
  if (arxivUrlMatch) {
    return {
      source: 'arxiv',
      id: arxivUrlMatch[1],
      url: `https://arxiv.org/abs/${arxivUrlMatch[1]}`,
      pdfUrl: `https://arxiv.org/pdf/${arxivUrlMatch[1]}.pdf`
    }
  }
  
  // Direct arXiv ID
  const directArxivMatch = cleanInput.match(/^\d+\.\d+$/)
  if (directArxivMatch) {
    return {
      source: 'arxiv',
      id: cleanInput,
      url: `https://arxiv.org/abs/${cleanInput}`,
      pdfUrl: `https://arxiv.org/pdf/${cleanInput}.pdf`
    }
  }
  
  // IEEE Xplore
  const ieeeMatch = cleanInput.match(/ieeexplore\.ieee\.org\/document\/(\d+)/)
  if (ieeeMatch) {
    return {
      source: 'ieee',
      id: ieeeMatch[1],
      url: cleanInput,
      pdfUrl: null // PDF access varies on IEEE
    }
  }
  
  // ACM Digital Library
  const acmMatch = cleanInput.match(/dl\.acm\.org\/doi\/(?:abs\/)?10\.1145\/(\d+\.\d+)/)
  if (acmMatch) {
    return {
      source: 'acm',
      id: acmMatch[1],
      url: cleanInput,
      pdfUrl: null
    }
  }
  
  // Nature/Science/other DOI
  const doiMatch = cleanInput.match(/(?:doi\.org\/|doi:)(10\.\d+\/[^\s]+)/)
  if (doiMatch) {
    return {
      source: 'doi',
      id: doiMatch[1],
      url: `https://doi.org/${doiMatch[1]}`,
      pdfUrl: null
    }
  }
  
  // Generic PDF URL
  if (cleanInput.match(/\.pdf$/i)) {
    return {
      source: 'pdf',
      id: cleanInput.split('/').pop().replace('.pdf', ''),
      url: cleanInput,
      pdfUrl: cleanInput
    }
  }
  
  return null
}

// AI-powered paper analysis functions
const analyzeWithAI = async (paperContent, analysisType = 'summary') => {
  try {
    let prompt = ''
    
    switch (analysisType) {
      case 'summary':
        prompt = `Analyze this research paper and provide a comprehensive analysis. Extract:

1. Key Innovations (3-5 bullet points of the main contributions)
2. Problem Statement (what problem does this paper solve?)
3. Methodology (how do they solve it? technical approach)
4. Key Results (quantitative results, metrics, benchmarks)
5. Practical Applications (real-world use cases)
6. Technical Complexity (beginner/intermediate/advanced)

Paper content:
${paperContent}

Respond in JSON format:
{
  "keyInnovations": ["innovation 1", "innovation 2", ...],
  "problemStatement": "clear problem description",
  "methodology": "technical approach description", 
  "results": {"metric1": "value1", "metric2": "value2"},
  "applications": ["application 1", "application 2"],
  "complexity": "beginner|intermediate|advanced",
  "tldr": "one sentence summary"
}`
        break
        
      case 'code_analysis':
        prompt = `Analyze this research paper for code generation. Identify:

1. Main algorithms/architectures described
2. Key components that need implementation
3. Suggested framework (PyTorch, TensorFlow, JAX)
4. Implementation complexity
5. Required dependencies

Paper content:
${paperContent}

Respond in JSON format:
{
  "algorithms": ["algorithm 1", "algorithm 2"],
  "components": ["component 1", "component 2"],
  "recommendedFramework": "pytorch|tensorflow|jax",
  "complexity": "beginner|intermediate|advanced",
  "dependencies": ["dep1", "dep2"],
  "codeStructure": "description of how to structure the implementation"
}`
        break
        
      default:
        throw new Error(`Unknown analysis type: ${analysisType}`)
    }

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI researcher and software engineer who specializes in analyzing research papers and converting them into practical implementations. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })

    const result = response.choices[0].message.content
    return JSON.parse(result)
  } catch (error) {
    console.error('AI Analysis Error:', error)
    // Return fallback analysis
    return {
      keyInnovations: ['Analysis unavailable - please check API configuration'],
      problemStatement: 'AI analysis failed',
      methodology: 'Please configure OpenRouter API key',
      results: {},
      applications: [],
      complexity: 'unknown',
      tldr: 'AI analysis unavailable'
    }
  }
}

const generateAICodeTemplate = async (paperAnalysis, framework = 'pytorch') => {
  try {
    const prompt = `Generate production-ready ${framework} code based on this paper analysis:

Paper Analysis:
${JSON.stringify(paperAnalysis, null, 2)}

Requirements:
1. Create a complete, runnable implementation
2. Include proper imports and dependencies
3. Add comprehensive docstrings and comments
4. Follow ${framework} best practices
5. Include training loop and evaluation code
6. Make it modular and extensible

Generate clean, well-documented code that implements the key algorithms from the paper.`

    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an expert ${framework} developer. Generate clean, production-ready code with proper documentation.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 3000
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('Code Generation Error:', error)
    return `# Code generation failed - please check API configuration
# Error: ${error.message}

import ${framework === 'pytorch' ? 'torch' : 'tensorflow'} as ${framework === 'pytorch' ? 'torch' : 'tf'}

# Implementation would go here
# Please configure your OpenRouter API key to enable AI code generation
`
  }
}

// Fetch paper metadata from arXiv API
const fetchArxivMetadata = async (arxivId) => {
  try {
    const response = await axios.get(`https://export.arxiv.org/api/query?id_list=${arxivId}`)
    const xmlText = response.data
    
    // Parse XML response (basic parsing)
    const titleMatch = xmlText.match(/<title>(.*?)<\/title>/s)
    const summaryMatch = xmlText.match(/<summary>(.*?)<\/summary>/s)
    const authorsMatch = xmlText.match(/<name>(.*?)<\/name>/g)
    const publishedMatch = xmlText.match(/<published>(.*?)<\/published>/)
    const categoryMatch = xmlText.match(/<category term="([^"]*)"/)
    
    return {
      title: titleMatch ? titleMatch[1].replace(/\n\s+/g, ' ').trim() : 'Unknown Title',
      abstract: summaryMatch ? summaryMatch[1].replace(/\n\s+/g, ' ').trim() : 'No abstract available',
      authors: authorsMatch ? authorsMatch.map(match => match.replace(/<\/?name>/g, '')) : ['Unknown Author'],
      publishedDate: publishedMatch ? publishedMatch[1].split('T')[0] : new Date().toISOString().split('T')[0],
      primaryCategory: categoryMatch ? categoryMatch[1] : 'cs.AI',
      arxivId,
      pdfUrl: `https://arxiv.org/pdf/${arxivId}.pdf`,
      url: `https://arxiv.org/abs/${arxivId}`
    }
  } catch (error) {
    console.error('ArXiv API Error:', error)
    return null
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
    const paperInfo = extractPaperInfo(input)
    
    if (!paperInfo) {
      throw new Error('Invalid paper URL or format. Please provide a valid arXiv, IEEE, ACM, or DOI link.')
    }
    
    let paperData = null
    
    // Try to get from mock data first (for demo purposes)
    if (paperInfo.source === 'arxiv' && mockPapers[paperInfo.id]) {
      paperData = mockPapers[paperInfo.id]
    } else if (paperInfo.source === 'arxiv') {
      // Fetch real arXiv data
      paperData = await fetchArxivMetadata(paperInfo.id)
    }
    
    // Fallback for non-arXiv or failed fetches
    if (!paperData) {
      paperData = {
        title: 'Research Paper Analysis',
        authors: ['Unknown Author'],
        abstract: 'Paper content will be analyzed using AI...',
        publishedDate: new Date().toISOString().split('T')[0],
        primaryCategory: 'cs.AI',
        citations: 0,
        ...paperInfo
      }
    }
    
    // Create paper content for AI analysis
    const paperContent = `
Title: ${paperData.title}
Authors: ${paperData.authors.join(', ')}
Abstract: ${paperData.abstract}
Category: ${paperData.primaryCategory}
Published: ${paperData.publishedDate}
    `.trim()
    
    // AI-powered analysis
    const aiAnalysis = await analyzeWithAI(paperContent, 'summary')
    const codeAnalysis = await analyzeWithAI(paperContent, 'code_analysis')
    
    // Generate AI-powered code templates
    const frameworks = ['pytorch', 'tensorflow', 'jax']
    const codeTemplates = []
    
    for (const framework of frameworks) {
      try {
        const code = await generateAICodeTemplate(aiAnalysis, framework)
        codeTemplates.push({
          framework,
          language: 'python',
          code,
          estimatedComplexity: aiAnalysis.complexity || 'intermediate',
          dependencies: codeAnalysis.dependencies || [],
          algorithms: codeAnalysis.algorithms || []
        })
      } catch (error) {
        console.error(`Failed to generate ${framework} code:`, error)
        codeTemplates.push({
          framework,
          language: 'python',
          code: `# ${framework.charAt(0).toUpperCase() + framework.slice(1)} implementation\n# Code generation failed - please check API configuration`,
          estimatedComplexity: 'unknown',
          dependencies: [],
          algorithms: []
        })
      }
    }
    
    // Enhanced analysis with AI insights
    const enhancedAnalysis = {
      ...aiAnalysis,
      keyInnovations: aiAnalysis.keyInnovations || ['AI analysis in progress...'],
      problemStatement: aiAnalysis.problemStatement || 'Analyzing problem statement...',
      methodology: aiAnalysis.methodology || 'Analyzing methodology...',
      results: aiAnalysis.results || {},
      applications: aiAnalysis.applications || [],
      complexity: aiAnalysis.complexity || 'intermediate',
      tldr: aiAnalysis.tldr || 'AI-powered summary in progress...',
      codeInsights: {
        algorithms: codeAnalysis.algorithms || [],
        components: codeAnalysis.components || [],
        recommendedFramework: codeAnalysis.recommendedFramework || 'pytorch',
        codeStructure: codeAnalysis.codeStructure || 'Analysis in progress...'
      }
    }
    
    return {
      id: Date.now().toString(),
      ...paperData,
      source: paperInfo.source,
      processingStatus: 'completed',
      extractedSummary: enhancedAnalysis,
      codeTemplates,
      architectureDiagram: '/api/placeholder/600/400',
      benchmarkResults: [],
      createdAt: new Date().toISOString(),
      aiPowered: true
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