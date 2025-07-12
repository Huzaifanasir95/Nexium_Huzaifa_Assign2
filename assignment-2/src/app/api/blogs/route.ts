import { NextRequest, NextResponse } from 'next/server';
import { scrapeBlogContent } from '@/lib/scraper';
import { generateSummary, translateToUrdu } from '@/lib/ai';
import { supabase } from '@/lib/supabase';
import connectToDatabase from '@/lib/mongodb';
import { Blog } from '@/models/Blog';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Check if the blog URL is already processed
    const existingBlog = await Blog.findOne({ url });
    if (existingBlog) {
      // Fetch the summary from Supabase
      const { data: summaryData, error } = await supabase
        .from('blog_summaries')
        .select('*')
        .eq('id', existingBlog.summaryId)
        .single();

      if (error) {
        throw new Error(`Error fetching summary: ${error.message}`);
      }

      return NextResponse.json({
        success: true,
        message: 'Blog already processed',
        data: {
          title: existingBlog.title,
          summary: summaryData.summary,
          urduSummary: summaryData.urdu_summary,
          url: existingBlog.url,
          id: existingBlog._id,
          summaryId: existingBlog.summaryId,
        },
      });
    }

    // Scrape the blog content
    const { title, content } = await scrapeBlogContent(url);

    // Generate a summary
    const summary = await generateSummary(content);

    // Translate to Urdu
    const urduSummary = await translateToUrdu(summary);

    // Store the summary in Supabase
    const { data: summaryData, error: summaryError } = await supabase
      .from('blog_summaries')
      .insert([
        {
          summary,
          urdu_summary: urduSummary,
          title,
          url,
        },
      ])
      .select()
      .single();

    if (summaryError) {
      throw new Error(`Error storing summary in Supabase: ${summaryError.message}`);
    }

    // Store the full text in MongoDB
    const blog = new Blog({
      url,
      title,
      fullText: content,
      summaryId: summaryData.id,
    });

    await blog.save();

    return NextResponse.json({
      success: true,
      data: {
        title,
        summary,
        urduSummary,
        url,
        id: blog._id,
        summaryId: summaryData.id,
      },
    });
  } catch (error) {
    console.error('Error processing blog:', error);
    return NextResponse.json(
      { error: `Error processing blog: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Get all summaries
export async function GET() {
  try {
    // Get summaries from Supabase
    const { data: summaries, error } = await supabase
      .from('blog_summaries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching summaries: ${error.message}`);
    }

    return NextResponse.json({ success: true, data: summaries });
  } catch (error) {
    console.error('Error fetching summaries:', error);
    return NextResponse.json(
      { error: `Error fetching summaries: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
