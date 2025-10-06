# Supabase Integration for PaperForge x402 Payments

## Overview

This implementation adds Supabase integration to PaperForge for tracking x402 micropayments and user usage. The system provides:

- **First paper conversion free** for all users
- **$5 per additional paper** via x402 micropayments
- **Usage tracking** and payment history
- **Improved JSON parsing** for AI responses

## Features Implemented

### 1. JSON Parsing Fix ✅
- Enhanced error handling for AI response parsing
- Fallback text extraction when JSON parsing fails
- Better cleanup of markdown code blocks and formatting
- Structured fallback responses when parsing completely fails

### 2. Supabase Integration ✅
- Complete database schema with proper RLS policies
- User management with subscription tiers
- Payment tracking with x402 protocol support
- Usage logging for analytics and billing

### 3. Payment System ✅
- x402 micropayment integration (simulated)
- First paper conversion free per month
- $5 charge for additional conversions
- Payment status tracking (pending, completed, failed)

### 4. Frontend Integration ✅
- Updated PaperConverter with payment flow
- New PaymentsPage for usage statistics
- Payment information in navigation
- User-friendly payment status indicators

## Database Schema

The following tables are created in Supabase:

### PaperForge Users Table
```sql
paperforge_users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  monthly_conversions_limit INTEGER DEFAULT 1,
  research_interests TEXT[],
  preferred_frameworks TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```
*Note: Renamed to `paperforge_users` to avoid conflicts with existing users table*

### Papers Table
```sql
papers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES paperforge_users(id),
  title VARCHAR(500),
  authors TEXT[],
  abstract TEXT,
  arxiv_id VARCHAR(50),
  paper_url VARCHAR(1000),
  pdf_url VARCHAR(1000),
  source VARCHAR(50),
  published_date DATE,
  primary_category VARCHAR(100),
  citations INTEGER,
  processing_status VARCHAR(50),
  extracted_summary JSONB,
  code_templates JSONB,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Payments Table
```sql
payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES paperforge_users(id),
  paper_id UUID REFERENCES papers(id),
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'x402',
  transaction_id VARCHAR(255),
  paper_url VARCHAR(1000),
  processed_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Usage Logs Table
```sql
usage_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES paperforge_users(id),
  paper_id UUID REFERENCES papers(id),
  payment_id UUID REFERENCES payments(id),
  paper_url VARCHAR(1000),
  action_type VARCHAR(50),
  was_payment_required BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP
)
```

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
4. Enable Row Level Security (RLS) policies (included in schema)

### 2. Environment Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENROUTER_API_KEY=your-openrouter-api-key
```

### 3. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 4. Run the Application

```bash
npm run dev
```

## Usage Flow

### For Free Users (Demo Mode)
1. User gets 1 free paper conversion per month
2. Additional conversions require $5 payment via x402
3. Payment is processed before paper analysis begins
4. Usage is tracked in the database

### Payment Process
1. User submits paper URL
2. System checks if payment is required
3. If required, creates payment record
4. Processes x402 micropayment (simulated)
5. On successful payment, proceeds with paper analysis
6. Logs usage for billing and analytics

## API Integration Points

### PaymentService
- `canUserConvertPaper(userId)` - Check if user can convert
- `createPayment(userId, paperUrl, amount)` - Create payment record  
- `processX402Payment(paymentId, details)` - Process micropayment
- `logPaperConversion(userId, paperId, paperUrl, wasPaymentRequired, paymentId)` - Log usage

### PaperService
- Updated `processPaper(input, inputType, userId)` to integrate payments
- Enhanced JSON parsing with fallback mechanisms
- Payment information included in response

## x402 Protocol Integration

The current implementation simulates x402 payments. To integrate with real x402:

1. Replace `simulateX402Payment()` in `PaymentService`
2. Implement actual x402 protocol headers and validation
3. Add webhook endpoints for payment confirmation
4. Update payment status based on actual x402 responses

## Security Features

- Row Level Security (RLS) policies ensure users only access their data
- Payment validation before processing
- Secure API key handling via environment variables
- Input validation and sanitization

## Monitoring and Analytics

The system tracks:
- Monthly conversion counts per user
- Payment success/failure rates
- Total revenue and user spending
- Paper conversion patterns

Access analytics via the `/payments` page or query the database directly.

## Error Handling

### JSON Parsing Errors
- Automatic fallback to text extraction
- Structured error responses
- Detailed logging for debugging

### Payment Errors
- Clear error messages for users
- Payment retry mechanisms
- Failed payment tracking

### Database Errors
- Graceful fallbacks to demo mode
- Error logging and user notifications
- Connection retry logic

## Testing

Run the test suite:
```bash
npm test
```

Test payment flow:
1. Navigate to the app
2. Try converting a paper (first should be free)
3. Try converting another paper (should require payment)
4. Check `/payments` page for usage statistics

## Next Steps

1. **Real x402 Integration**: Replace simulated payments with actual x402 protocol
2. **Authentication**: Add Supabase Auth for user registration/login
3. **Subscription Management**: Implement premium tiers with higher limits
4. **Analytics Dashboard**: Build admin dashboard for payment analytics
5. **Webhook Integration**: Add webhooks for real-time payment updates

## Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Check environment variables
   - Verify Supabase project is active
   - Ensure RLS policies are correctly set

2. **Payment Processing Failures**
   - Check payment service logs
   - Verify user has sufficient permissions
   - Ensure payment records are created properly

3. **JSON Parsing Issues**
   - Check OpenRouter API responses
   - Verify AI model is responding correctly
   - Review fallback mechanisms

### Debug Mode

Enable debug logging by setting:
```env
VITE_DEBUG=true
```

This will provide detailed console logs for troubleshooting.

## Support

For issues with this integration:
1. Check the console for error messages
2. Verify Supabase connection and permissions
3. Test with demo mode first
4. Review payment flow logs

The implementation provides a solid foundation for x402 micropayments with room for future enhancements and real protocol integration.