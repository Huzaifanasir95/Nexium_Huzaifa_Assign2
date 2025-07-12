'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type BlogSummary = {
  id: string;
  title: string;
  summary: string;
  urdu_summary: string;
  url: string;
  created_at: string;
};

export default function BlogSummaryList() {
  const [summaries, setSummaries] = useState<BlogSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/blogs');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch summaries');
        }

        setSummaries(result.data);
      } catch (error) {
        toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500">No blog summaries found. Try adding a new blog!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 mt-8">
      <h2 className="text-2xl font-bold">Recent Blog Summaries</h2>
      {summaries.map((summary) => (
        <Card key={summary.id} className="w-full">
          <CardHeader>
            <CardTitle>{summary.title}</CardTitle>
            <CardDescription>
              <a href={summary.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {summary.url}
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{summary.summary}</p>
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium mb-2">Urdu Summary:</h3>
              <p className="text-sm" dir="rtl">{summary.urdu_summary}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/blog/${summary.id}`} passHref>
              <Button variant="outline">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
