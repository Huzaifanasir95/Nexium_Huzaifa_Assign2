import mongoose from 'mongoose';
import { User, Post, IUser, IPost } from './models/mongoose-models';

// MongoDB connection configuration
const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexium_mongo_db';
    
    await mongoose.connect(mongoUri, {
      // These options are no longer needed in Mongoose 6+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    
    console.log('🟢 Successfully connected to MongoDB with Mongoose!');
    
    // Optional: Log connection details
    const connection = mongoose.connection;
    console.log(`📍 Connected to database: ${connection.name}`);
    console.log(`🔗 Host: ${connection.host}:${connection.port}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// CRUD Operations with Mongoose

// CREATE Operations
const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  try {
    const user = new User(userData);
    const savedUser = await user.save();
    console.log('✅ User created:', savedUser.getFullInfo());
    return savedUser;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
};

const createPost = async (postData: Partial<IPost>): Promise<IPost> => {
  try {
    const post = new Post(postData);
    const savedPost = await post.save();
    console.log('✅ Post created:', savedPost.getPostSummary());
    return savedPost;
  } catch (error) {
    console.error('❌ Error creating post:', error);
    throw error;
  }
};

// Create multiple users
const createMultipleUsers = async (usersData: Partial<IUser>[]): Promise<IUser[]> => {
  try {
    const users = await User.insertMany(usersData);
    console.log(`✅ ${users.length} users created successfully`);
    return users;
  } catch (error) {
    console.error('❌ Error creating multiple users:', error);
    throw error;
  }
};

// READ Operations
const findAllUsers = async (): Promise<IUser[]> => {
  try {
    const users = await User.find({});
    console.log(`📖 Found ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error finding users:', error);
    throw error;
  }
};

const findUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const user = await User.findByEmail(email);
    if (user) {
      console.log('📖 User found:', user.getFullInfo());
    } else {
      console.log('❌ User not found with email:', email);
    }
    return user;
  } catch (error) {
    console.error('❌ Error finding user by email:', error);
    throw error;
  }
};

const findPostsWithAuthors = async (): Promise<IPost[]> => {
  try {
    const posts = await Post.find({})
      .populate('author', 'name email') // Populate author details
      .sort({ createdAt: -1 }); // Sort by newest first
    
    console.log(`📖 Found ${posts.length} posts with authors`);
    return posts;
  } catch (error) {
    console.error('❌ Error finding posts with authors:', error);
    throw error;
  }
};

const findPublishedPosts = async (): Promise<IPost[]> => {
  try {
    const posts = await Post.findPublished();
    console.log(`📖 Found ${posts.length} published posts`);
    return posts;
  } catch (error) {
    console.error('❌ Error finding published posts:', error);
    throw error;
  }
};

// UPDATE Operations
const updateUser = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true } // Return updated document and run validators
    );
    
    if (user) {
      console.log('✅ User updated:', user.getFullInfo());
    } else {
      console.log('❌ User not found for update');
    }
    return user;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
};

const updatePost = async (postId: string, updateData: Partial<IPost>): Promise<IPost | null> => {
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (post) {
      console.log('✅ Post updated:', post.getPostSummary());
    } else {
      console.log('❌ Post not found for update');
    }
    return post;
  } catch (error) {
    console.error('❌ Error updating post:', error);
    throw error;
  }
};

// UPDATE Multiple documents
const updateMultipleUsers = async (filter: any, updateData: Partial<IUser>): Promise<number> => {
  try {
    const result = await User.updateMany(filter, updateData);
    console.log(`✅ ${result.modifiedCount} users updated`);
    return result.modifiedCount;
  } catch (error) {
    console.error('❌ Error updating multiple users:', error);
    throw error;
  }
};

// DELETE Operations
const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const result = await User.findByIdAndDelete(userId);
    if (result) {
      console.log('✅ User deleted:', result.email);
      return true;
    } else {
      console.log('❌ User not found for deletion');
      return false;
    }
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
};

const deletePost = async (postId: string): Promise<boolean> => {
  try {
    const result = await Post.findByIdAndDelete(postId);
    if (result) {
      console.log('✅ Post deleted:', result.title);
      return true;
    } else {
      console.log('❌ Post not found for deletion');
      return false;
    }
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    throw error;
  }
};

// DELETE Multiple documents
const deleteMultiplePosts = async (filter: any): Promise<number> => {
  try {
    const result = await Post.deleteMany(filter);
    console.log(`✅ ${result.deletedCount} posts deleted`);
    return result.deletedCount;
  } catch (error) {
    console.error('❌ Error deleting multiple posts:', error);
    throw error;
  }
};

// Advanced queries
const findUsersWithPagination = async (page: number = 1, limit: number = 10): Promise<{users: IUser[], total: number}> => {
  try {
    const skip = (page - 1) * limit;
    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments({});
    
    console.log(`📖 Found ${users.length} users (Page ${page}, Total: ${total})`);
    return { users, total };
  } catch (error) {
    console.error('❌ Error finding users with pagination:', error);
    throw error;
  }
};

const searchPosts = async (searchTerm: string): Promise<IPost[]> => {
  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    }).populate('author', 'name email');
    
    console.log(`🔍 Found ${posts.length} posts matching "${searchTerm}"`);
    return posts;
  } catch (error) {
    console.error('❌ Error searching posts:', error);
    throw error;
  }
};

// Main demonstration function
const demonstrateMongooseCRUD = async (): Promise<void> => {
  try {
    console.log('🚀 Starting Mongoose CRUD Operations Demo...\n');
    
    // Connect to MongoDB
    await connectMongoDB();
    
    // Clear existing data for clean demo
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('🧹 Cleaned up existing data\n');
    
    // CREATE Operations
    console.log('📝 === CREATE Operations ===');
    
    // Create single user
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
    
    // Create multiple users
    const multipleUsers = await createMultipleUsers([
      { email: 'alice@example.com', name: 'Alice Johnson', age: 28 },
      { email: 'bob@example.com', name: 'Bob Wilson', age: 35 },
      { email: 'charlie@example.com', name: 'Charlie Brown', age: 22 }
    ]);
    
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
    
    // Find published posts
    await findPublishedPosts();
    
    // Pagination
    await findUsersWithPagination(1, 3);
    
    // Search posts
    await searchPosts('mongoose');
    
    console.log('\n🔄 === UPDATE Operations ===');
    
    // Update single user
    await updateUser(user1._id.toString(), { age: 31, name: 'John Doe Sr.' });
    
    // Update single post
    await updatePost(post2._id.toString(), { published: true });
    
    // Update multiple users
    await updateMultipleUsers({ age: { $lt: 30 } }, { isActive: false });
    
    console.log('\n🗑️ === DELETE Operations ===');
    
    // Delete a user
    if (multipleUsers.length > 0) {
      await deleteUser(multipleUsers[0]._id.toString());
    }
    
    // Delete unpublished posts
    await deleteMultiplePosts({ published: false });
    
    console.log('\n📊 === Final State ===');
    await findAllUsers();
    await findPostsWithAuthors();
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Export functions for use in other files
export {
  connectMongoDB,
  createUser,
  createPost,
  createMultipleUsers,
  findAllUsers,
  findUserByEmail,
  findPostsWithAuthors,
  findPublishedPosts,
  updateUser,
  updatePost,
  updateMultipleUsers,
  deleteUser,
  deletePost,
  deleteMultiplePosts,
  findUsersWithPagination,
  searchPosts,
  demonstrateMongooseCRUD
};

// Run the demo if this file is executed directly
if (require.main === module) {
  demonstrateMongooseCRUD();
}
