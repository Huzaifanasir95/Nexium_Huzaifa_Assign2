import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    // Use service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Creating blog_summaries table...');
    
    // Create the table
    const { error: tableError } = await supabaseAdmin.rpc('exec', {
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
      `
    });

    if (tableError) {
      console.error('Error creating table:', tableError);
      return NextResponse.json({ 
        success: false, 
        error: `Failed to create table: ${tableError.message}` 
      }, { status: 500 });
    }

    // Enable RLS
    const { error: rlsError } = await supabaseAdmin.rpc('exec', {
      sql: `ALTER TABLE blog_summaries ENABLE ROW LEVEL SECURITY;`
    });

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError);
    }

    // Create policies
    const { error: policyError1 } = await supabaseAdmin.rpc('exec', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Public can read blog_summaries" 
          ON blog_summaries
          FOR SELECT
          TO anon
          USING (true);
      `
    });

    const { error: policyError2 } = await supabaseAdmin.rpc('exec', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Authenticated users can insert blog_summaries" 
          ON blog_summaries
          FOR INSERT
          TO authenticated
          WITH CHECK (true);
      `
    });

    if (policyError1 || policyError2) {
      console.error('Error creating policies:', { policyError1, policyError2 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase schema created successfully',
      details: {
        table: 'blog_summaries created',
        rls: rlsError ? 'RLS setup failed' : 'RLS enabled',
        policies: (policyError1 || policyError2) ? 'Some policies failed' : 'Policies created'
      }
    });

  } catch (error) {
    console.error('Error setting up Supabase schema:', error);
    return NextResponse.json({
      success: false,
      error: `Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}
