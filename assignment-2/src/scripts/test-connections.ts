import testMongoDBConnection from './test-mongodb';
import testSupabaseConnection from './test-supabase';

async function testAllConnections() {
  console.log('====================================');
  console.log('🔌 TESTING DATABASE CONNECTIONS');
  console.log('====================================\n');
  
  // Test MongoDB connection
  console.log('\n📊 MONGODB CONNECTION TEST');
  console.log('----------------------------');
  const mongoResult = await testMongoDBConnection();
  
  // Test Supabase connection
  console.log('\n📊 SUPABASE CONNECTION TEST');
  console.log('----------------------------');
  const supabaseResult = await testSupabaseConnection();
  
  // Summary
  console.log('\n====================================');
  console.log('📝 TEST RESULTS SUMMARY');
  console.log('====================================');
  console.log(`MongoDB: ${mongoResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Supabase: ${supabaseResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log('====================================\n');
  
  if (mongoResult && supabaseResult) {
    console.log('🎉 All database connections are working correctly!');
    console.log('   Your Blog Summarizer app should function properly.\n');
    return true;
  } else {
    console.log('❗ Some database connections failed.');
    console.log('   Please check the error messages above and verify your environment variables in .env.local\n');
    return false;
  }
}

// Run tests if called directly
if (require.main === module) {
  testAllConnections()
    .then((result) => {
      process.exit(result ? 0 : 1);
    })
    .catch((error) => {
      console.error('Error running tests:', error);
      process.exit(1);
    });
}
