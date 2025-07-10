import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔗 Connecting to PostgreSQL database with Prisma...')
  
  try {
    // Test the connection
    await prisma.$connect()
    console.log('✅ Successfully connected to the database!')

    // Create a sample user
    console.log('\n📝 Creating a sample user...')
    const user = await prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
    })
    console.log('✅ User created:', user)

    // Create a sample post for the user
    console.log('\n📝 Creating a sample post...')
    const post = await prisma.post.create({
      data: {
        title: 'My First Post',
        content: 'This is my first post using Prisma with PostgreSQL!',
        published: true,
        authorId: user.id,
      },
    })
    console.log('✅ Post created:', post)

    // Fetch all users with their posts
    console.log('\n📖 Fetching all users with their posts...')
    const usersWithPosts = await prisma.user.findMany({
      include: {
        posts: true,
      },
    })
    console.log('✅ Users with posts:', JSON.stringify(usersWithPosts, null, 2))

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
    console.log('\n🔌 Disconnected from database')
  }
}

main()
  .catch((e) => {
    throw e
  })
