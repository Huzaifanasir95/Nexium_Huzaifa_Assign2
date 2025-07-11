# Nexium_Huzaifa_Assign2

A Node.js project demonstrating both **Prisma ORM with PostgreSQL** and **Mongoose ODM with MongoDB** database connections.

## 🚀 Setup

This project showcases two different database approaches:
- 🔵 **Prisma ORM** with PostgreSQL (SQL database)
- 🟢 **Mongoose ODM** with MongoDB (NoSQL database)

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL installed locally with service running
- MongoDB installed locally with service running
- MongoDB Compass (optional, for GUI database management)

### Database Configurations

#### PostgreSQL (Prisma)
- **Host**: localhost
- **Port**: 5432 (default)
- **Database**: nexium_db
- **Username**: postgres
- **Password**: localpassword123

#### MongoDB (Mongoose)
- **Host**: localhost
- **Port**: 27017 (default)
- **Database**: nexium_mongo_db (created automatically)

## 📦 Installation

```bash
npm install
```

## 🏃 Running the Applications

### PostgreSQL with Prisma
```bash
npm run dev
```

### MongoDB with Mongoose
```bash
npm run dev:mongo
```

### Database Comparison Demo
```bash
npm run dev:comparison
```

## 🗄️ Database Commands

### Prisma (PostgreSQL) Commands

#### Generate Prisma Client
```bash
npm run db:generate
```

#### Run Database Migrations
```bash
npm run db:migrate
```

#### Reset Database (⚠️ This will delete all data)
```bash
npm run db:reset
```

#### Open Prisma Studio (Database GUI)
```bash
npm run db:studio
```

## 📁 Project Structure

```
├── src/
│   ├── database.ts              # Prisma PostgreSQL connection and examples
│   ├── mongodb-simple.js        # Mongoose MongoDB CRUD operations
│   ├── mongodb-mongoose.ts      # Advanced Mongoose with TypeScript
│   ├── database-comparison.ts   # Side-by-side comparison
│   └── models/
│       └── mongoose-models.ts   # Mongoose schemas and models
├── prisma/
│   ├── schema.prisma           # Prisma database schema
│   └── migrations/             # Database migration files
├── .env                        # Environment variables
├── package.json
└── tsconfig.json
```

## 🔧 Database Schemas

### PostgreSQL Schema (Prisma)
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### MongoDB Schema (Mongoose)
```javascript
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  age: { type: Number, min: 0, max: 120 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  published: { type: Boolean, default: false },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String]
}, { timestamps: true });
```

## 🔍 CRUD Operations Demonstrated

Both implementations show:
- **CREATE**: Insert single and multiple records
- **READ**: Find all, find by criteria, populate relationships
- **UPDATE**: Update single and multiple records
- **DELETE**: Delete single and multiple records

### MongoDB Specific Features
- Automatic database creation
- Flexible schema design
- Document-based storage
- Population of references

### PostgreSQL Specific Features
- Strict schema enforcement
- ACID transactions
- Relational integrity
- Advanced SQL queries

## 🎯 Key Differences

| Feature | PostgreSQL (Prisma) | MongoDB (Mongoose) |
|---------|-------------------|------------------|
| **Schema** | Strict, predefined | Flexible, dynamic |
| **Relationships** | Foreign keys | References/Embedding |
| **Queries** | SQL-like | MongoDB query language |
| **Data Types** | Strongly typed | Flexible typing |
| **Transactions** | ACID compliant | Limited transactions |
| **Scaling** | Vertical scaling | Horizontal scaling |

## 🛠️ Useful Commands

### Prisma Commands
```bash
# View migration status
npx prisma migrate status

# Format schema
npx prisma format

# Generate client
npx prisma generate

# Reset database
npx prisma migrate reset
```

### MongoDB Commands
```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use database
use nexium_mongo_db

# Show collections
show collections

# Find documents
db.users.find()
```

## 📝 Environment Variables

Your `.env` file should contain:

```env
# PostgreSQL Connection
DATABASE_URL="postgresql://postgres:localpassword123@localhost:5432/nexium_db?schema=public"

# MongoDB Connection
MONGODB_URI="mongodb://localhost:27017/nexium_mongo_db"
```

## 🔗 Connection String Formats

### PostgreSQL
```
postgresql://[username]:[password]@[host]:[port]/[database]?schema=public
```

### MongoDB
```
mongodb://[host]:[port]/[database]
```

## 🎉 What You've Learned

1. **Database Setup**: How to configure both SQL and NoSQL databases
2. **ORM vs ODM**: Differences between Prisma and Mongoose
3. **CRUD Operations**: Implementation in both database types
4. **Schema Design**: Relational vs Document-based approaches
5. **Data Relationships**: Foreign keys vs References
6. **Database Tools**: Prisma Studio vs MongoDB Compass

## 📚 Next Steps

- Explore advanced Prisma features (transactions, raw queries)
- Learn MongoDB aggregation pipelines
- Implement authentication and authorization
- Add data validation and error handling
- Performance optimization and indexing
- Database deployment and production considerations

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)