'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type BlogDetail = {
  id: string;
  title: string;
  summary: string;
  urduSummary: string;
  url: string;
  fullText: string;
  createdAt: string;
};

export default function BlogDetail({ id }: { id: string }) {
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blogs/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch blog');
        }

        setBlog(result.data);
      } catch (error) {
        toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500">Blog not found</p>
          <Link href="/" passHref>
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <Link href="/" passHref>
        <Button variant="outline" className="mb-4">
          &larr; Back to Home
        </Button>
      </Link>

      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>{blog.title}</CardTitle>
          <CardDescription>
            <div className="flex flex-col gap-1">
              <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {blog.url}
              </a>
              <span className="text-sm text-gray-500">
                Processed on {formatDate(blog.createdAt)}
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-gray-700">{blog.summary}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Urdu Summary</h3>
            <p className="text-gray-700" dir="rtl">{blog.urduSummary}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Full Content</h3>
            <div className="relative">
              <div 
                className={`text-gray-700 overflow-hidden ${!showFullText ? 'max-h-40' : ''}`}
              >
                {blog.fullText}
              </div>
              {!showFullText && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
              )}
            </div>
            <Button variant="outline" onClick={toggleFullText} className="mt-2">
              {showFullText ? 'Show Less' : 'Show Full Text'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
