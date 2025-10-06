# Supabase Setup Guide for PaperForge

This guide will help you set up Supabase for the PaperForge application with payment integration and user management.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Basic understanding of SQL

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `paperforge`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql` from this repository
3. Paste it into the SQL Editor and run it
4. This will create all necessary tables and security policies

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Get these values from your Supabase dashboard:
   - Go to Settings → API
   - Copy the Project URL and anon/public key

## Step 4: Configure Authentication

1. In Supabase dashboard, go to Authentication → Settings
2. Configure your site URL:
   - Site URL: `http://localhost:5173` (for development)
   - Additional redirect URLs: Add your production domain when deploying

3. Enable email authentication:
   - Go to Authentication → Providers
   - Ensure Email is enabled
   - Configure email templates if needed

## Step 5: Set Up Row Level Security (RLS)

The schema file already includes RLS policies, but verify they're active:

1. Go to Authentication → Policies
2. Ensure all tables have appropriate policies
3. Test that users can only access their own data

## Step 6: Optional - Set Up Email Templates

1. Go to Authentication → Email Templates
2. Customize the confirmation and recovery email templates
3. Add your branding and styling

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the following features:
   - User registration
   - User login
   - Paper conversion (free first conversion)
   - Payment processing for additional papers
   - Usage tracking

## Database Tables Overview

### `users`
- Extends Supabase auth.users with additional profile information
- Tracks subscription tier and usage limits

### `payments`
- Records all payment transactions
- Supports different payment types (paper_conversion, subscription)
- Integrates with payment processors

### `paper_conversions`
- Tracks each paper conversion
- Links to payments for paid conversions
- Stores AI analysis results

### `usage_logs`
- Analytics and usage tracking
- Helps with billing and user behavior analysis

### `collections`
- User-created paper collections
- Supports public/private collections

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure API key management
- Authentication required for all operations

## Payment Integration

The current implementation includes:
- x402 payment model (first paper free, $5 for additional)
- Payment tracking and history
- Usage analytics
- Subscription tier management

For production, integrate with:
- Stripe for credit card processing
- PayPal for alternative payments
- Webhook handling for payment confirmations

## Monitoring and Analytics

Set up monitoring for:
- User registration and activity
- Payment success/failure rates
- Paper conversion usage
- API performance

## Backup and Recovery

- Supabase automatically backs up your database
- Set up additional monitoring for critical operations
- Consider implementing data export functionality

## Scaling Considerations

- Monitor database performance as usage grows
- Consider read replicas for heavy read workloads
- Implement caching for frequently accessed data
- Set up proper indexing for query optimization

## Support and Troubleshooting

Common issues and solutions:

### Authentication Issues
- Check CORS settings in Supabase
- Verify redirect URLs are correct
- Ensure RLS policies are properly configured

### Payment Issues
- Verify payment service integration
- Check webhook configurations
- Monitor payment logs for errors

### Performance Issues
- Review database queries and add indexes
- Implement proper caching strategies
- Monitor API usage and rate limits

For additional help, refer to the [Supabase documentation](https://supabase.com/docs) or open an issue in this repository.