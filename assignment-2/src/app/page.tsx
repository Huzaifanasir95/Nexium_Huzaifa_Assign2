import BlogUrlForm from '@/components/BlogUrlForm';
import BlogSummaryList from '@/components/BlogSummaryList';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Summarizer</h1>
          <p className="text-xl text-gray-600 mb-8">
            Enter a blog URL to get an AI-powered summary and Urdu translation
          </p>
          <BlogUrlForm />
        </section>
        
        <section>
          <BlogSummaryList />
        </section>
      </div>
    </Layout>
  );
}
