# PaperForge

Transform research papers into production-ready code in minutes, not weeks.

## 🚀 Features

- **Instant Paper Decoder**: Transform dense research papers into clear summaries with visual explanations
- **Code Template Generator**: Generate production-ready PyTorch/TensorFlow starter code from paper methodology
- **Live Benchmarking Sandbox**: Automatically validate implementations against standardized datasets
- **Architecture Decision Assistant**: Get expert-level architecture recommendations for your use case
- **Collaborative Workspace**: Share analyses with your team and track implementation progress

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **AI Integration**: OpenAI API / OpenRouter
- **HTTP Client**: Axios

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paperforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎯 Usage

1. **Convert a Paper**: Paste an arXiv URL or upload a PDF on the homepage
2. **Analyze Results**: Review the generated summary, code templates, and architecture diagrams
3. **Benchmark Implementation**: Upload your model and test against standard datasets
4. **Find Architectures**: Use the Architecture Finder to get recommendations for your use case
5. **Organize Collections**: Create collections to organize and share your research

## 🔧 Configuration

The application can be configured through environment variables:

- `VITE_OPENAI_API_KEY`: Your OpenAI API key for AI features
- `VITE_API_BASE_URL`: Base URL for the backend API
- `VITE_ENABLE_BENCHMARKING`: Enable/disable benchmarking features

See `.env.example` for all available options.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@paperforge.ai or join our community Discord.

## 🗺️ Roadmap

- [ ] JAX/Flax code template support
- [ ] Real-time collaboration features
- [ ] Advanced benchmarking metrics
- [ ] Custom model architecture builder
- [ ] Integration with popular ML platforms
- [ ] Mobile app for paper reading

---

Built with ❤️ for the AI research community.