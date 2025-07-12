import { supabase } from '@/lib/supabase';

async function createSupabaseSchema() {
  try {
    console.log('Attempting to create Supabase schema for blog_summaries table...');
    
    // SQL to create the blog_summaries table if it doesn't exist
    const { error } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS blog_summaries (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          summary TEXT NOT NULL,
          urdu_summary TEXT NOT NULL,
          url TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create a policy to allow public access (read-only) to blog_summaries
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM pg_policies 
            WHERE tablename = 'blog_summaries' AND policyname = 'Public can read blog_summaries'
          ) THEN
            CREATE POLICY "Public can read blog_summaries" 
              ON blog_summaries
              FOR SELECT
              TO anon
              USING (true);
          END IF;
        END
        $$;
        
        -- Create a policy to allow authenticated users to insert blog_summaries
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT FROM pg_policies 
            WHERE tablename = 'blog_summaries' AND policyname = 'Authenticated users can insert blog_summaries'
          ) THEN
            CREATE POLICY "Authenticated users can insert blog_summaries" 
              ON blog_summaries
              FOR INSERT
              TO authenticated
              WITH CHECK (true);
          END IF;
        END
        $$;
        
        -- Enable RLS on the blog_summaries table
        ALTER TABLE blog_summaries ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (error) {
      console.error('❌ Failed to create Supabase schema:', error);
      return false;
    }
    
    console.log('✅ Successfully created or verified Supabase schema');
    return true;
  } catch (error) {
    console.error('❌ Error creating Supabase schema:', error);
    return false;
  }
}

export default createSupabaseSchema;

// If script is run directly (not imported)
if (require.main === module) {
  createSupabaseSchema()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
