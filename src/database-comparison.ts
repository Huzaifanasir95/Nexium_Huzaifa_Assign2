import { PrismaClient } from '@prisma/client';
import { demonstrateMongooseCRUD } from './mongodb-mongoose';

const prisma = new PrismaClient();

// Function to demonstrate Prisma (PostgreSQL) operations
const demonstratePrismaCRUD = async (): Promise<void> => {
  console.log('🔵 === PRISMA (PostgreSQL) OPERATIONS ===\n');
  
  try {
    // Connect to PostgreSQL
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL with Prisma');
    
    // Clear existing data
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('🧹 Cleaned up existing PostgreSQL data');
    
    // CREATE Operations
    console.log('\n📝 Creating users with Prisma...');
    const prismaUser1 = await prisma.user.create({
      data: {
        email: 'prisma.user1@example.com',
        name: 'Prisma User 1',
      },
    });
    
    const prismaUser2 = await prisma.user.create({
      data: {
        email: 'prisma.user2@example.com',
        name: 'Prisma User 2',
      },
    });
    
    console.log('✅ Prisma users created:', prismaUser1.name, prismaUser2.name);
    
    // Create posts
    console.log('\n📝 Creating posts with Prisma...');
    const prismaPost1 = await prisma.post.create({
      data: {
        title: 'Prisma with PostgreSQL',
        content: 'This post was created using Prisma ORM with PostgreSQL',
        published: true,
        authorId: prismaUser1.id,
      },
    });
    
    const prismaPost2 = await prisma.post.create({
      data: {
        title: 'Database Comparison',
        content: 'Comparing Prisma and Mongoose approaches',
        published: false,
        authorId: prismaUser2.id,
      },
    });
    
    console.log('✅ Prisma posts created:', prismaPost1.title, prismaPost2.title);
    
    // READ Operations
    console.log('\n📖 Reading data with Prisma...');
    const prismaUsersWithPosts = await prisma.user.findMany({
      include: {
        posts: true,
      },
    });
    
    console.log('📖 Prisma users with posts:', prismaUsersWithPosts.length);
    
    // UPDATE Operations
    console.log('\n🔄 Updating data with Prisma...');
    const updatedUser = await prisma.user.update({
      where: { id: prismaUser1.id },
      data: { name: 'Updated Prisma User' },
    });
    
    console.log('✅ Updated Prisma user:', updatedUser.name);
    
    // DELETE Operations
    console.log('\n🗑️ Deleting data with Prisma...');
    await prisma.post.delete({
      where: { id: prismaPost2.id },
    });
    
    console.log('✅ Deleted Prisma post');
    
    // Final state
    console.log('\n📊 Final Prisma state:');
    const finalUsers = await prisma.user.findMany({
      include: { posts: true },
    });
    
    console.log(`📊 Final users: ${finalUsers.length}`);
    finalUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Posts: ${user.posts.length}`);
    });
    
  } catch (error) {
    console.error('❌ Prisma demo error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from PostgreSQL\n');
  }
};

// Main function to run both demos
const runDatabaseComparison = async (): Promise<void> => {
  console.log('🎯 === DATABASE COMPARISON DEMO ===\n');
  console.log('This demo shows CRUD operations using both:');
  console.log('🔵 Prisma ORM with PostgreSQL');
  console.log('🟢 Mongoose ODM with MongoDB\n');
  
  try {
    // Run Prisma demo first
    await demonstratePrismaCRUD();
    
    // Add separation
    console.log('='.repeat(60));
    console.log('🟢 === MONGOOSE (MongoDB) OPERATIONS ===\n');
    
    // Run Mongoose demo
    await demonstrateMongooseCRUD();
    
    console.log('\n🎉 === COMPARISON COMPLETE ===');
    console.log('✅ Both Prisma (PostgreSQL) and Mongoose (MongoDB) demos completed successfully!');
    
  } catch (error) {
    console.error('❌ Database comparison demo failed:', error);
  }
};

// Export the comparison function
export { runDatabaseComparison };

// Run the comparison if this file is executed directly
if (require.main === module) {
  runDatabaseComparison();
}
