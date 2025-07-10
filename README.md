# Nexium_Huzaifa_Assign2

A Node.js project with Prisma and PostgreSQL database connection.

## 🚀 Setup

This project is configured to connect to a local PostgreSQL database using Prisma ORM.

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL installed locally
- PostgreSQL service running

### Database Configuration

The project connects to PostgreSQL with the following credentials:
- **Host**: localhost
- **Port**: 5432 (default)
- **Database**: nexium_db
- **Username**: postgres
- **Password**: localpassword123

## 📦 Installation

```bash
npm install
```

## 🗄️ Database Commands

### Generate Prisma Client
```bash
npm run db:generate
```

### Run Database Migrations
```bash
npm run db:migrate
```

### Reset Database (⚠️ This will delete all data)
```bash
npm run db:reset
```

### Open Prisma Studio (Database GUI)
```bash
npm run db:studio
```

## 🏃 Running the Application

### Run in Development Mode
```bash
npm run dev
```

### Build and Run in Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── src/
│   └── database.ts          # Database connection and example queries
├── prisma/
│   ├── schema.prisma        # Database schema definition
│   └── migrations/          # Database migration files
├── .env                     # Environment variables (database URL)
├── package.json
└── tsconfig.json
```

## 🔧 Database Schema

The project includes two example models:

### User Model
- `id`: Auto-incrementing primary key
- `email`: Unique email address
- `name`: Optional user name
- `posts`: Relation to Post model
- `createdAt` & `updatedAt`: Timestamps

### Post Model
- `id`: Auto-incrementing primary key
- `title`: Post title
- `content`: Optional post content
- `published`: Boolean flag
- `authorId`: Foreign key to User
- `author`: Relation to User model
- `createdAt` & `updatedAt`: Timestamps

## 🔍 Example Operations

The `src/database.ts` file demonstrates:
- Connecting to the database
- Creating users and posts
- Querying data with relations
- Proper error handling and disconnection

## 🛠️ Useful Prisma Commands

```bash
# View current migration status
npx prisma migrate status

# Format the schema file
npx prisma format

# Validate the schema
npx prisma validate

# Generate migration from schema changes
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Seed the database (if seed file exists)
npx prisma db seed
```

## 📝 Environment Variables

Make sure your `.env` file contains:

```env
DATABASE_URL="postgresql://postgres:localpassword123@localhost:5432/nexium_db?schema=public"
```

## 🔗 Connection String Format

```
postgresql://[username]:[password]@[host]:[port]/[database]?schema=public
```

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)