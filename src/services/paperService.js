import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
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
  },
  '1512.03385': {
    arxivId: '1512.03385',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.',
    publishedDate: '2015-12-10',
    primaryCategory: 'cs.CV',
    citations: 89000,
    pdfUrl: 'https://arxiv.org/pdf/1512.03385.pdf'
  },
  '1406.2661': {
    arxivId: '1406.2661',
    title: 'Generative Adversarial Networks',
    authors: ['Ian J. Goodfellow', 'Jean Pouget-Abadie', 'Mehdi Mirza', 'Bing Xu', 'David Warde-Farley', 'Sherjil Ozair', 'Aaron Courville', 'Yoshua Bengio'],
    abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.',
    publishedDate: '2014-06-10',
    primaryCategory: 'stat.ML',
    citations: 45000,
    pdfUrl: 'https://arxiv.org/pdf/1406.2661.pdf'
  },
  '2005.14165': {
    arxivId: '2005.14165',
    title: 'Language Models are Few-Shot Learners',
    authors: ['Tom B. Brown', 'Benjamin Mann', 'Nick Ryder', 'Melanie Subbiah', 'Jared Kaplan', 'Prafulla Dhariwal'],
    abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples.',
    publishedDate: '2020-05-28',
    primaryCategory: 'cs.CL',
    citations: 25000,
    pdfUrl: 'https://arxiv.org/pdf/2005.14165.pdf'
  }
}

const extractArxivId = (input) => {
  if (typeof input !== 'string') return null
  
  // Extract arXiv ID from URL or direct ID
  const urlMatch = input.match(/arxiv\.org\/abs\/(\d+\.\d+)/)
  if (urlMatch) return urlMatch[1]
  
  const directMatch = input.match(/^\d+\.\d+$/)
  if (directMatch) return input
  
  return null
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
      const arxivId = extractArxivId(input)
      
      if (arxivId && mockPapers[arxivId]) {
        const paperData = mockPapers[arxivId]
      
      // Generate analysis
      const analysis = {
        keyInnovations: [
          "Introduces self-attention mechanism as primary building block",
          "Eliminates recurrent and convolutional layers entirely", 
          "Achieves state-of-the-art results with better parallelization",
          "Demonstrates transferability across different sequence tasks"
        ],
        problemStatement: "Existing sequence models rely on recurrent or convolutional neural networks, which are computationally expensive and difficult to parallelize. This paper proposes using only attention mechanisms for sequence transduction.",
        methodology: "The Transformer uses multi-head self-attention and position-wise feed-forward networks in both encoder and decoder stacks. Positional encodings are added to input embeddings to inject sequence order information.",
        results: {
          "WMT 2014 EN-DE": "28.4 BLEU",
          "WMT 2014 EN-FR": "41.8 BLEU", 
          "Training Time": "3.5 days on 8 P100 GPUs",
          "Parameters": "65M (base) / 213M (big)"
        }
      }
      
      // Generate code templates
      const codeTemplates = [
        {
          framework: 'pytorch',
          language: 'python',
          code: await generateCodeTemplate(paperData, 'pytorch'),
          estimatedComplexity: 'intermediate'
        },
        {
          framework: 'tensorflow',
          language: 'python', 
          code: await generateCodeTemplate(paperData, 'tensorflow'),
          estimatedComplexity: 'intermediate'
        }
      ]
      
      return {
        id: Date.now().toString(),
        ...paperData,
        processingStatus: 'completed',
        extractedSummary: analysis,
        codeTemplates,
        architectureDiagram: '/api/placeholder/600/400',
        benchmarkResults: [],
        createdAt: new Date().toISOString()
      }
    }
    
    // For non-mock papers, create a simulated response
    return {
      id: Date.now().toString(),
      arxivId: arxivId || 'unknown',
      title: 'Sample Research Paper',
      authors: ['Author Name'],
      abstract: 'This is a sample paper processed from your input.',
      publishedDate: new Date().toISOString().split('T')[0],
      primaryCategory: 'cs.AI',
      citations: 0,
      processingStatus: 'completed',
      extractedSummary: {
        keyInnovations: ['Sample innovation'],
        problemStatement: 'Sample problem statement',
        methodology: 'Sample methodology',
        results: {}
      },
      codeTemplates: [],
      architectureDiagram: '/api/placeholder/600/400',
      benchmarkResults: [],
      createdAt: new Date().toISOString()
    }
    } catch (error) {
      console.error('Error processing paper:', error)
      throw new Error('Failed to process paper. Please try again.')
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