import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  const results = {
    mongodb: { success: false, message: '', details: {} },
    supabase: { success: false, message: '', details: {} },
  };

  // Test MongoDB connection
  try {
    console.log('Testing MongoDB connection...');
    const mongoose = await connectToDatabase();
    
    results.mongodb.success = true;
    results.mongodb.message = 'MongoDB connection successful';
    results.mongodb.details = {
      host: mongoose.connection.host,
      database: mongoose.connection.name || 'Default DB',
      state: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    };
  } catch (error) {
    results.mongodb.message = `MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }

  // Test Supabase connection
  try {
    console.log('Testing Supabase connection...');
    
    // Try to access the blog_summaries table
    const { data, error } = await supabase
      .from('blog_summaries')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // relation doesn't exist
        results.supabase.message = 'Supabase connection successful, but blog_summaries table does not exist.';
        
        // Creating table would go here, but we'll just report status for now
        results.supabase.details = {
          error: 'Table not found',
          code: error.code,
          message: error.message
        };
      } else {
        results.supabase.message = `Supabase error: ${error.message}`;
        results.supabase.details = {
          error: 'Access error',
          code: error.code,
          message: error.message
        };
      }
    } else {
      results.supabase.success = true;
      results.supabase.message = 'Supabase connection successful';
      results.supabase.details = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'URL configured',
      };
    }
  } catch (error) {
    results.supabase.message = `Supabase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    allSuccessful: results.mongodb.success && results.supabase.success,
    results
  });
}
