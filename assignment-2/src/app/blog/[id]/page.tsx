import BlogDetail from '@/components/BlogDetail';
import Layout from '@/components/Layout';

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <Layout>
      <BlogDetail id={resolvedParams.id} />
    </Layout>
  );
}
