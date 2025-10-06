# PaperForge Deployment Guide

Complete guide to deploy PaperForge with Supabase database persistence and Stripe payments.

## 🚀 Quick Setup Overview

1. **Database**: Supabase (PostgreSQL with Row Level Security)
2. **Authentication**: Supabase Auth
3. **Payments**: Stripe ($5 per analysis, first one free)
4. **AI**: OpenRouter GPT-4o-mini
5. **Frontend**: React + Vite (deployable to Vercel/Netlify)

## 📋 Prerequisites

- Node.js 16+
- Supabase account
- Stripe account
- OpenRouter account
- Deployment platform (Vercel/Netlify recommended)

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Wait for setup to complete
4. Note down your project URL and anon key

### 2. Run Database Schema

1. Go to your Supabase dashboard → SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the query to create all tables, policies, and triggers

### 3. Configure Authentication

1. Go to Authentication → Settings
2. Enable email confirmation (optional)
3. Configure any additional auth providers if needed
4. Set up email templates (optional)

## 💳 Stripe Setup

### 1. Create Stripe Account

1. Go to [Stripe](https://stripe.com)
2. Create account and complete verification
3. Get your publishable and secret keys

### 2. Configure Webhooks (Production)

For production, you'll need to set up webhooks to handle payment confirmations:

```bash
# Webhook endpoint (you'll need to implement this in your backend)
POST /api/webhooks/stripe

# Events to listen for:
- payment_intent.succeeded
- payment_intent.payment_failed
```

## 🤖 OpenRouter Setup

1. Go to [OpenRouter](https://openrouter.ai)
2. Create account and add credits
3. Generate API key
4. Test with GPT-4o-mini model

## 🔧 Environment Configuration

Create `.env` file with all required variables:

```env
# OpenRouter API (Required)
VITE_OPENAI_API_KEY=your_openrouter_api_key_here

# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (Required)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Optional: Analytics, monitoring, etc.
VITE_ANALYTICS_ID=your_analytics_id
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**:
   ```bash
   # Push to GitHub/GitLab
   git add .
   git commit -m "Add Supabase and Stripe integration"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy

3. **Configure Environment Variables** in Vercel dashboard

### Option 2: Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Add all `.env` variables

### Option 3: Self-Hosted

```bash
# Build for production
npm run build

# Serve the dist folder with any static server
# Example with nginx, Apache, or Node.js serve
```

## 🔒 Security Checklist

### Supabase Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Proper user policies implemented
- ✅ API keys properly configured
- ✅ Database backups enabled

### Stripe Security

- ✅ Use publishable keys in frontend only
- ✅ Validate payments on backend
- ✅ Implement webhook signature verification
- ✅ Handle payment failures gracefully

### General Security

- ✅ HTTPS enabled
- ✅ Environment variables secured
- ✅ API rate limiting (if needed)
- ✅ Input validation and sanitization

## 📊 Monitoring & Analytics

### Database Monitoring

Monitor these key metrics in Supabase:
- User registrations
- Paper analysis requests
- Payment success rates
- API usage

### Payment Monitoring

Track in Stripe dashboard:
- Successful payments
- Failed payments
- Refund requests
- Revenue metrics

### Application Monitoring

Consider adding:
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API monitoring

## 🔧 Backend API Endpoints (Optional)

For production, implement these backend endpoints:

### Payment Processing

```javascript
// POST /api/create-payment-intent
{
  "amount": 500,
  "currency": "usd",
  "metadata": {
    "userId": "user_id",
    "paperTitle": "Paper Title"
  }
}

// POST /api/webhooks/stripe
// Handle Stripe webhook events
```

### Paper Processing

```javascript
// POST /api/analyze-paper
{
  "paperUrl": "https://arxiv.org/abs/1234.5678",
  "userId": "user_id",
  "paymentIntentId": "pi_xxx"
}
```

## 🧪 Testing

### Test Payment Flow

1. Use Stripe test cards:
   - Success: `4242424242424242`
   - Decline: `4000000000000002`

2. Test scenarios:
   - Free first analysis
   - Paid subsequent analyses
   - Payment failures
   - User authentication

### Test Database

1. Verify user registration
2. Test paper saving and retrieval
3. Verify RLS policies work
4. Test collection management

## 📈 Scaling Considerations

### Database Scaling

- Monitor connection usage
- Consider connection pooling
- Set up read replicas if needed
- Regular database maintenance

### Payment Scaling

- Monitor Stripe rate limits
- Implement retry logic
- Handle high-volume scenarios
- Set up proper error handling

### AI API Scaling

- Monitor OpenRouter usage
- Implement rate limiting
- Cache results when possible
- Handle API failures gracefully

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Issues**:
   - Verify URL and keys
   - Check network connectivity
   - Verify RLS policies

2. **Stripe Payment Issues**:
   - Check API keys
   - Verify webhook endpoints
   - Test with Stripe CLI

3. **OpenRouter API Issues**:
   - Verify API key and credits
   - Check rate limits
   - Handle model availability

### Debug Mode

Enable debug logging:

```javascript
// In development
localStorage.setItem('debug', 'paperforge:*')
```

## 📞 Support

### Getting Help

1. **Supabase**: [Documentation](https://supabase.com/docs) | [Discord](https://discord.supabase.com)
2. **Stripe**: [Documentation](https://stripe.com/docs) | [Support](https://support.stripe.com)
3. **OpenRouter**: [Documentation](https://openrouter.ai/docs)

### Community

- GitHub Issues for bug reports
- Discord for community support
- Documentation for guides

## 🎯 Production Checklist

Before going live:

- [ ] Database schema deployed
- [ ] RLS policies tested
- [ ] Stripe webhooks configured
- [ ] Payment flow tested
- [ ] Error handling implemented
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] User acceptance testing passed

## 💰 Pricing Strategy

Current implementation:
- **First analysis**: FREE
- **Additional analyses**: $5 each
- **Payment method**: Stripe
- **Currency**: USD

Easy to modify in `src/lib/stripe.js`:

```javascript
export const PAPER_ANALYSIS_PRICE = 500 // $5.00 in cents
```

## 🔄 Updates & Maintenance

### Regular Tasks

1. **Weekly**: Monitor error rates and performance
2. **Monthly**: Review usage analytics and costs
3. **Quarterly**: Security audit and dependency updates
4. **As needed**: Feature updates and bug fixes

### Backup Strategy

1. **Database**: Automated Supabase backups
2. **Code**: Git repository with tags
3. **Environment**: Document all configurations
4. **Monitoring**: Set up alerts for critical issues

---

**Ready to deploy!** 🚀

Your PaperForge instance will be ready to serve users with AI-powered paper analysis, secure payments, and persistent data storage.