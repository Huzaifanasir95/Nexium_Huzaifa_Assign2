-- Create blog_summaries table in Supabase
CREATE TABLE IF NOT EXISTS blog_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  urdu_summary TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the blog_summaries table
ALTER TABLE blog_summaries ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public access (read and write) to blog_summaries
CREATE POLICY "Allow public access to blog_summaries" 
  ON blog_summaries
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
