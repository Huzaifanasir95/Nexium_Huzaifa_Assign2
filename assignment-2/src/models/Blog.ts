import mongoose, { Schema } from 'mongoose';

// Define the Blog schema
const blogSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    fullText: {
      type: String,
      required: true,
    },
    summaryId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model exists before creating it (prevents model overwrite error in Next.js development)
export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
