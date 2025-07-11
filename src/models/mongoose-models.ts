import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for User document
export interface IUser extends Document {
  email: string;
  name?: string;
  age?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  getFullInfo(): string;
}

// Interface for Post document
export interface IPost extends Document {
  title: string;
  content?: string;
  published: boolean;
  authorId: mongoose.Types.ObjectId;
  author?: IUser;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  getPostSummary(): string;
}

// Interface for User model with static methods
export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

// Interface for Post model with static methods
export interface IPostModel extends Model<IPost> {
  findPublished(): Promise<IPost[]>;
}

// User Schema
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  name: {
    type: String,
    trim: true,
    maxlength: 50
  },
  age: {
    type: Number,
    min: 0,
    max: 120
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Post Schema
const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    trim: true
  },
  published: {
    type: Boolean,
    default: false
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for author
PostSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware for User
UserSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    console.log(`User email being saved: ${this.email}`);
  }
  next();
});

// Pre-save middleware for Post
PostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    console.log(`Post title being saved: ${this.title}`);
  }
  next();
});

// Instance methods
UserSchema.methods.getFullInfo = function() {
  return `${this.name} (${this.email}) - Active: ${this.isActive}`;
};

PostSchema.methods.getPostSummary = function() {
  return `${this.title} - Published: ${this.published}`;
};

// Static methods
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email });
};

PostSchema.statics.findPublished = function() {
  return this.find({ published: true });
};

// Export models with proper typing
export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);
export const Post = mongoose.model<IPost, IPostModel>('Post', PostSchema);
