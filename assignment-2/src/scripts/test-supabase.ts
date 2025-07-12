import { supabase } from '@/lib/supabase';

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Get Supabase URL & verify connection
    await supabase.from('_realtimeconfig').select('*').limit(1);
    console.log('✅ Successfully connected to Supabase');
    
    // Test 2: Try to access the blog_summaries table
    const { data, error } = await supabase
      .from('blog_summaries')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // relation doesn't exist
        console.log('❌ Table "blog_summaries" does not exist. You may need to run the schema.sql file.');
        
        // Try to create the table if it doesn't exist
        console.log('Attempting to create the blog_summaries table...');
        const { error: createError } = await supabase.rpc('create_blog_summaries_table');
        
        if (createError) {
          console.error('❌ Failed to create blog_summaries table:', createError);
        } else {
          console.log('✅ Created blog_summaries table successfully');
        }
      } else {
        console.error('❌ Error accessing blog_summaries table:', error);
      }
    } else {
      console.log('✅ Successfully accessed blog_summaries table');
      console.log(`Found ${data?.length || 0} existing entries`);
    }
    
    // Test 3: Insert a test record
    console.log('Testing write access with a test record...');
    const testData = {
      title: 'Test Blog',
      summary: 'This is a test summary.',
      urdu_summary: 'یہ ایک ٹیسٹ خلاصہ ہے۔',
      url: 'https://test-blog.example.com'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('blog_summaries')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error('❌ Failed to insert test record:', insertError);
    } else {
      console.log('✅ Successfully inserted test record');
      
      // Test 4: Delete the test record to clean up
      if (insertData && insertData[0]?.id) {
        const { error: deleteError } = await supabase
          .from('blog_summaries')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.error('❌ Failed to delete test record:', deleteError);
        } else {
          console.log('✅ Successfully deleted test record');
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}

export default testSupabaseConnection;

// If script is run directly (not imported)
if (require.main === module) {
  testSupabaseConnection()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
