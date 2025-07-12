import { connectToDatabase } from '@/lib/mongodb';

async function testMongoDBConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const mongoose = await connectToDatabase();
    console.log('✅ MongoDB connection successful!');
    console.log('MongoDB connection details:');
    console.log(`  - Connected to: ${mongoose.connection.host}`);
    console.log(`  - Database name: ${mongoose.connection.name || 'Default DB'}`);
    console.log(`  - Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Test creating a document in a temporary collection
    const TestModel = mongoose.model('ConnectionTest', new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now }
    }));
    
    await TestModel.create({ test: 'Connection test successful' });
    console.log('✅ Successfully created test document in MongoDB');
    
    // Clean up the test document
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropCollection('connectiontests');
      console.log('✅ Cleaned up test collection');
    }
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}

export default testMongoDBConnection;

// If script is run directly (not imported)
if (require.main === module) {
  testMongoDBConnection()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
