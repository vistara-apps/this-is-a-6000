import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Database schema for reference:
/*

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  papers_analyzed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Papers table
CREATE TABLE public.papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  authors TEXT[],
  abstract TEXT,
  arxiv_id TEXT,
  source TEXT NOT NULL, -- 'arxiv', 'ieee', 'acm', 'doi', 'pdf'
  source_url TEXT,
  pdf_url TEXT,
  published_date DATE,
  primary_category TEXT,
  citations INTEGER DEFAULT 0,
  processing_status TEXT DEFAULT 'pending',
  ai_powered BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Analysis table
CREATE TABLE public.paper_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
  key_innovations TEXT[],
  problem_statement TEXT,
  methodology TEXT,
  results JSONB,
  applications TEXT[],
  complexity TEXT,
  tldr TEXT,
  code_insights JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Code Templates table
CREATE TABLE public.code_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
  framework TEXT NOT NULL, -- 'pytorch', 'tensorflow', 'jax'
  language TEXT DEFAULT 'python',
  code TEXT NOT NULL,
  estimated_complexity TEXT,
  dependencies TEXT[],
  algorithms TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  paper_id UUID REFERENCES public.papers(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- 'pending', 'succeeded', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collections table (for organizing papers)
CREATE TABLE public.collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  paper_ids UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own papers" ON public.papers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own papers" ON public.papers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own papers" ON public.papers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view analyses of own papers" ON public.paper_analyses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.papers 
      WHERE papers.id = paper_analyses.paper_id 
      AND papers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analyses for own papers" ON public.paper_analyses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.papers 
      WHERE papers.id = paper_analyses.paper_id 
      AND papers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view code templates of own papers" ON public.code_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.papers 
      WHERE papers.id = code_templates.paper_id 
      AND papers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert code templates for own papers" ON public.code_templates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.papers 
      WHERE papers.id = code_templates.paper_id 
      AND papers.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own collections" ON public.collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own collections" ON public.collections
  FOR ALL USING (auth.uid() = user_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_papers_updated_at BEFORE UPDATE ON public.papers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

*/