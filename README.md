# PaperForge - Transform Research Papers into Production Code

A modern web application that converts cutting-edge AI research papers into digestible summaries, starter code templates, and benchmarking tools for ML engineers and researchers.

## 🚀 Features

### Core Features
- **🤖 AI-Powered Paper Decoder**: Transform dense research papers into clear summaries using OpenRouter GPT-4o-mini
- **🔍 Multi-Source Paper Support**: Process papers from arXiv, IEEE, ACM, DOI, and direct PDF uploads
- **⚡ Smart Code Generation**: Generate production-ready PyTorch/TensorFlow/JAX code with AI insights
- **🧠 Intelligent Analysis**: Extract key innovations, methodology, and practical applications automatically
- **📊 Implementation Insights**: Get complexity assessments and framework recommendations
- **🎯 Live Benchmarking Sandbox**: Automatically validate implementations against standardized datasets
- **🏗️ Architecture Decision Assistant**: Get expert-level architecture recommendations for specific use cases
- **📈 Paper Changelog Tracker**: Stay current with breakthrough research through AI-curated feeds
- **🤝 Collaborative Workspace**: Share analyses with teams and track implementation progress

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
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth
- **Payments**: Stripe with $5 per analysis pricing
- **AI Integration**: OpenRouter API with GPT-4o-mini
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Axios for API requests
- **Testing**: Vitest with React Testing Library
- **Build Tool**: Vite

## 🆕 New Features Added

### 💾 Data Persistence
- **Supabase Integration**: All papers and analyses saved to PostgreSQL database
- **User Accounts**: Secure authentication with email/password
- **Row Level Security**: Data isolated per user with proper security policies
- **Collections**: Organize papers into custom collections
- **Analysis History**: Access all your previous analyses anytime

### 💳 Payment System
- **Free First Analysis**: Every new user gets one free paper analysis
- **$5 Per Analysis**: Subsequent analyses cost $5 each via Stripe
- **Secure Payments**: PCI-compliant payment processing
- **Payment History**: Track all your purchases and analyses
- **Instant Processing**: Papers analyzed immediately after payment

### 🔐 User Management
- **Email Authentication**: Secure sign-up and sign-in
- **Profile Management**: Update your account details
- **Usage Tracking**: Monitor your analysis count and spending
- **Password Reset**: Secure password recovery via email

### 📊 Enhanced Analytics
- **Personal Dashboard**: View your analysis statistics
- **Paper Library**: Browse all your analyzed papers
- **Search & Filter**: Find papers by title, author, or category
- **Export Options**: Download analyses and code templates

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

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- OpenRouter API key (for AI features)

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

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your OpenRouter API key:
```env
VITE_OPENAI_API_KEY=your_openrouter_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### 🤖 AI Features Setup

To enable AI-powered paper analysis:

1. **Get OpenRouter API Key**: 
   - Visit [OpenRouter](https://openrouter.ai/keys)
   - Create an account and generate an API key
   - Add credits to your account for API usage

2. **Set up Supabase Database**:
   - Create a [Supabase](https://supabase.com) project
   - Run the SQL schema from `supabase-schema.sql`
   - Get your project URL and anon key

3. **Configure Stripe Payments**:
   - Create a [Stripe](https://stripe.com) account
   - Get your publishable key
   - Set up webhooks for production

4. **Configure Environment**:
   - Copy `.env.example` to `.env`
   - Add all required API keys and URLs

5. **Supported Paper Sources**:
   - ✅ arXiv (URL or ID): `https://arxiv.org/abs/1706.03762` or `1706.03762`
   - ✅ IEEE Xplore: `https://ieeexplore.ieee.org/document/123456`
   - ✅ ACM Digital Library: `https://dl.acm.org/doi/10.1145/123.456`
   - ✅ DOI Links: `https://doi.org/10.1038/nature12345`
   - ✅ Direct PDF URLs

### 💳 Payment & Pricing

- **First Analysis**: FREE for all new users
- **Additional Analyses**: $5 per paper
- **Payment Processing**: Secure Stripe integration
- **Data Persistence**: All analyses saved to your account

### 🧪 Running Tests

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

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