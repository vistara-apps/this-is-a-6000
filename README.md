# PaperForge - Transform Research Papers into Production Code

A modern web application that converts cutting-edge AI research papers into digestible summaries, starter code templates, and benchmarking tools for ML engineers and researchers.

## 🆕 Latest Updates

- **Supabase Integration**: Full user authentication and payment processing
- **x402 Payment Model**: First paper conversion free, $5 for additional papers  
- **Enhanced JSON Parsing**: Robust AI response parsing with fallback mechanisms
- **User Management**: Complete user profiles, usage tracking, and payment history

## 🛠️ Quick Setup

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd paperforge
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Fill in your API keys (see SUPABASE_SETUP.md for details)
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```

4. **Supabase Setup**: Follow the detailed guide in `SUPABASE_SETUP.md`

## 🚀 Features

### Core Features
- **AI-Powered Paper Decoder**: Transform research papers from multiple sources into comprehensive analysis using GPT-4o-mini
- **Multi-Source Paper Support**: Parse papers from arXiv, ACL Anthology, OpenReview, IEEE Xplore, PubMed, and direct PDFs
- **Intelligent Code Generation**: Generate production-ready PyTorch/TensorFlow code templates using AI analysis
- **Implementation Guidance**: Get complexity assessments, technical requirements, and step-by-step implementation plans
- **Live Benchmarking Sandbox**: Automatically validate implementations against standardized datasets
- **Architecture Decision Assistant**: Get expert-level architecture recommendations for specific use cases
- **Paper Changelog Tracker**: Stay current with breakthrough research through AI-curated feeds
- **Collaborative Workspace**: Share analyses with teams and track implementation progress

### UI/UX Improvements Implemented

#### 🎨 Enhanced Visual Design
- **Modern Gradient Elements**: Added gradient backgrounds and text effects for visual appeal
- **Improved Typography**: Enhanced font rendering with better spacing and hierarchy
- **Glass Morphism Effects**: Implemented backdrop blur effects for modern UI elements
- **Enhanced Color System**: Improved color contrast and accessibility

#### ⚡ Smooth Animations & Interactions
- **Micro-interactions**: Added hover effects, scale transforms, and rotation animations
- **Loading States**: Enhanced loading indicators with pulsing effects and progress bars
- **Page Transitions**: Smooth fade-in and slide-up animations for better UX
- **Staggered Animations**: Feature cards animate in sequence for visual interest

#### 📱 Mobile-First Responsive Design
- **Adaptive Layouts**: Optimized grid systems for all screen sizes
- **Touch-Friendly**: Improved button sizes and touch targets
- **Mobile Navigation**: Enhanced mobile menu with smooth animations
- **Responsive Typography**: Fluid text sizing across devices

#### ♿ Accessibility Enhancements
- **Focus Management**: Improved focus states and keyboard navigation
- **Screen Reader Support**: Added semantic HTML and ARIA labels
- **Reduced Motion**: Respects user's motion preferences
- **High Contrast**: Enhanced color contrast ratios for better readability

#### 🔧 Better User Experience
- **Error Handling**: Comprehensive error boundary with user-friendly messages
- **Toast Notifications**: Real-time feedback for user actions
- **Loading Skeletons**: Better loading states for improved perceived performance
- **404 Page**: Custom not found page with helpful navigation options

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **AI Integration**: OpenRouter API with GPT-4o-mini
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Context API
- **Testing**: Vitest with jsdom
- **Build Tool**: Vite

## 🎨 Design System

### Colors
- **Primary**: `hsl(262, 83%, 58%)` - Purple gradient
- **Accent**: `hsl(192, 91%, 54%)` - Cyan accent
- **Success**: `hsl(142, 76%, 36%)` - Green success states
- **Warning**: `hsl(38, 92%, 50%)` - Orange warnings
- **Error**: `hsl(0, 84%, 60%)` - Red error states
- **Background**: `hsl(240, 10%, 4%)` - Dark background
- **Surface**: `hsl(240, 8%, 10%)` - Card backgrounds

### Typography
- **Font Smoothing**: Optimized for better rendering
- **Responsive Scaling**: Fluid typography across devices
- **Hierarchy**: Clear heading and body text distinction

### Animations
- **Duration**: 200-300ms for micro-interactions
- **Easing**: Custom cubic-bezier curves for natural motion
- **Reduced Motion**: Respects accessibility preferences

## 🤖 AI Paper Decoder

### Supported Paper Sources
- **arXiv**: `https://arxiv.org/abs/1706.03762` or `1706.03762`
- **ACL Anthology**: `https://aclanthology.org/2020.acl-main.1/`
- **OpenReview**: `https://openreview.net/forum?id=...`
- **IEEE Xplore**: `https://ieeexplore.ieee.org/document/...`
- **PubMed**: `https://pubmed.ncbi.nlm.nih.gov/...`
- **Direct PDF**: Any direct PDF URL

### AI Analysis Features
- **Key Innovations**: Automatically extracted research contributions
- **Problem Statement**: Clear explanation of the research problem
- **Methodology**: Simplified explanation of the approach
- **Applications**: Practical use cases and applications
- **Implementation Complexity**: Beginner/Intermediate/Advanced rating
- **Technical Background**: Required knowledge and skills
- **Next Steps**: Step-by-step implementation guidance
- **AI-Generated Code**: Production-ready PyTorch/TensorFlow templates

### OpenRouter Integration
The application uses OpenRouter's API to access GPT-4o-mini for paper analysis. To use the AI features:

1. Get an API key from [OpenRouter](https://openrouter.ai/)
2. Set the environment variable: `VITE_OPENROUTER_API_KEY=your_api_key`
3. The app will automatically use AI analysis for all paper processing

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- OpenRouter API key (optional, for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd paperforge
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up environment variables:
```bash
echo "VITE_OPENROUTER_API_KEY=your_api_key_here" > .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.jsx   # Main navigation
│   ├── FeatureCard.jsx  # Feature display cards
│   ├── PaperConverter.jsx # Paper conversion modal
│   ├── CodeViewer.jsx   # Code display component
│   ├── BenchmarkPanel.jsx # Benchmarking interface
│   ├── LoadingSkeleton.jsx # Loading states
│   ├── ErrorBoundary.jsx # Error handling
│   ├── Toast.jsx        # Notification system
│   └── Button.jsx       # Enhanced button component
├── pages/               # Page components
│   ├── HomePage.jsx     # Landing page
│   ├── PaperAnalysisPage.jsx # Paper analysis view
│   ├── ArchitectureFinderPage.jsx # Architecture recommendations
│   ├── BenchmarkingPage.jsx # Benchmarking dashboard
│   ├── CollectionsPage.jsx # Collections management
│   ├── PricingPage.jsx  # Pricing information
│   └── NotFoundPage.jsx # 404 error page
├── context/             # React Context
│   └── AppContext.jsx   # Global state management
├── services/            # API services
│   └── paperService.js  # Paper processing service
├── index.css           # Global styles and Tailwind
└── main.jsx            # Application entry point
```

## 🎯 Key Improvements Made

### 1. Enhanced Visual Hierarchy
- Added gradient text effects for headlines
- Improved spacing and typography
- Better visual separation between sections

### 2. Smooth Animations
- Hover effects on interactive elements
- Loading state animations
- Page transition effects
- Staggered feature card animations

### 3. Better Mobile Experience
- Responsive navigation with smooth mobile menu
- Touch-friendly button sizes
- Optimized layouts for small screens

### 4. Accessibility Features
- Proper focus management
- Screen reader support
- Reduced motion preferences
- High contrast color scheme

### 5. User Feedback Systems
- Toast notification system
- Enhanced error handling
- Loading skeleton screens
- Progress indicators

### 6. Performance Optimizations
- Optimized animations for 60fps
- Efficient re-renders
- Proper loading states
- Bundle size optimization

## 🔧 Customization

The design system is built with CSS custom properties and Tailwind CSS, making it easy to customize:

1. **Colors**: Update the color palette in `tailwind.config.js`
2. **Typography**: Modify font settings in the config
3. **Animations**: Adjust animation timings and effects
4. **Components**: All components are modular and reusable

## 📈 Performance

- **Build Size**: ~354KB (gzipped: ~101KB)
- **CSS Size**: ~30KB (gzipped: ~6KB)
- **First Contentful Paint**: Optimized for fast loading
- **Accessibility Score**: 95+ (Lighthouse)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspiration from modern AI/ML tools
- Icons provided by Lucide React
- Built with React and Vite for optimal performance