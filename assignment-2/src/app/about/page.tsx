import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>About Blog Summarizer</CardTitle>
            <CardDescription>
              Assignment 2 for Nexium
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">Project Overview</h2>
              <p className="text-gray-700">
                This application allows users to enter a blog URL, scrape the text content, generate a summary,
                translate the summary to Urdu, and save the data in a database.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Features</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Scrape text content from any blog URL</li>
                <li>Generate a concise summary of the blog content</li>
                <li>Translate the summary to Urdu</li>
                <li>Store summaries in Supabase</li>
                <li>Store full text in MongoDB</li>
                <li>Responsive UI using ShadCN components</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Technologies Used</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Next.js (App Router)</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>ShadCN UI</li>
                <li>Supabase (for storing summaries)</li>
                <li>MongoDB (for storing full text)</li>
                <li>Cheerio (for web scraping)</li>
                <li>Google Gemini AI API (simulated for this assignment)</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
