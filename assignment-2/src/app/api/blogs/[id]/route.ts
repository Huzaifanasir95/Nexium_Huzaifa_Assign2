import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Blog } from '@/models/Blog';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Connect to MongoDB
    await connectToDatabase();

    // Find the blog in MongoDB
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Fetch the summary from Supabase
    const { data: summaryData, error } = await supabase
      .from('blog_summaries')
      .select('*')
      .eq('id', blog.summaryId)
      .single();

    if (error) {
      throw new Error(`Error fetching summary: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        title: blog.title,
        summary: summaryData.summary,
        urduSummary: summaryData.urdu_summary,
        url: blog.url,
        fullText: blog.fullText,
        id: blog._id,
        summaryId: blog.summaryId,
        createdAt: blog.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: `Error fetching blog: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
