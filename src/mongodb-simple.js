import mongoose from 'mongoose';

// Simple MongoDB connection
const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexium_mongo_db';
    await mongoose.connect(mongoUri);
    console.log('🟢 Successfully connected to MongoDB with Mongoose!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
    min: 0,
    max: 120,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

// Post Schema
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [String]
}, {
  timestamps: true,
});

// Models
const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// CRUD Operations
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    const savedUser = await user.save();
    console.log('✅ User created:', savedUser.email);
    return savedUser;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
};

const createPost = async (postData) => {
  try {
    const post = new Post(postData);
    const savedPost = await post.save();
    console.log('✅ Post created:', savedPost.title);
    return savedPost;
  } catch (error) {
    console.error('❌ Error creating post:', error);
    throw error;
  }
};

const findAllUsers = async () => {
  try {
    const users = await User.find({});
    console.log(`📖 Found ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error finding users:', error);
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      console.log('📖 User found:', user.email);
    } else {
      console.log('❌ User not found with email:', email);
    }
    return user;
  } catch (error) {
    console.error('❌ Error finding user by email:', error);
    throw error;
  }
};

const findPostsWithAuthors = async () => {
  try {
    const posts = await Post.find({}).populate('authorId', 'name email');
    console.log(`📖 Found ${posts.length} posts with authors`);
    return posts;
  } catch (error) {
    console.error('❌ Error finding posts with authors:', error);
    throw error;
  }
};

const updateUser = async (userId, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (user) {
      console.log('✅ User updated:', user.email);
    }
    return user;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const result = await User.findByIdAndDelete(userId);
    if (result) {
      console.log('✅ User deleted:', result.email);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
};

// Demo function
const demonstrateMongooseCRUD = async () => {
  try {
    console.log('🚀 Starting Mongoose CRUD Operations Demo...\n');
    
    // Connect to MongoDB
    await connectMongoDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('🧹 Cleaned up existing data\n');
    
    // CREATE Operations
    console.log('📝 === CREATE Operations ===');
    const user1 = await createUser({
      email: 'john.doe@example.com',
      name: 'John Doe',
      age: 30,
      isActive: true
    });
    
    const user2 = await createUser({
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      age: 25,
      isActive: true
    });
    
    // Create posts
    const post1 = await createPost({
      title: 'Introduction to Mongoose',
      content: 'Mongoose is a powerful ODM for MongoDB and Node.js...',
      published: true,
      authorId: user1._id,
      tags: ['mongoose', 'mongodb', 'nodejs']
    });
    
    const post2 = await createPost({
      title: 'Advanced MongoDB Queries',
      content: 'Learn how to perform complex queries with MongoDB...',
      published: false,
      authorId: user2._id,
      tags: ['mongodb', 'queries', 'advanced']
    });
    
    console.log('\n📖 === READ Operations ===');
    
    // Find all users
    await findAllUsers();
    
    // Find user by email
    await findUserByEmail('john.doe@example.com');
    
    // Find posts with authors
    await findPostsWithAuthors();
    
    console.log('\n🔄 === UPDATE Operations ===');
    
    // Update user
    await updateUser(user1._id, { age: 31, name: 'John Doe Sr.' });
    
    console.log('\n🗑️ === DELETE Operations ===');
    
    // Delete a user
    await deleteUser(user2._id);
    
    console.log('\n📊 === Final State ===');
    await findAllUsers();
    await findPostsWithAuthors();
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run demo if this file is executed directly
demonstrateMongooseCRUD();
