import { useParams } from 'react-router-dom';
import { usePost } from '../hooks/useSanity';
import BlogPost from '../components/BlogPost';
import BlogList from '../components/BlogList';
import BlogLayout from '../components/BlogLayout';
import PostsList from '../components/PostsList';
import PostPage from '../components/PostPage';

const BlogPage = () => {
  const { slug } = useParams();

  // If we have a slug, show individual post
  if (slug) {
    return (
      <BlogLayout>
        <PostPage slug={slug} />
      </BlogLayout>
    );
  }

  // Otherwise show blog list - you can choose between the simple or advanced version
  return (
    <BlogLayout>
      {/* Simple version (matches your examples) */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Posts</h1>
        <PostsList />
      </div>
      
      {/* Advanced version (with search and filters) - uncomment to use */}
      {/* <BlogList /> */}
    </BlogLayout>
  );
};

const BlogPostPage = ({ slug }) => {
  const { post, loading, error } = usePost(slug);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse">
          <div className="mb-8">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6">
          <h1 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Post
          </h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </a>
        </div>
      </div>
    );
  }

  return <BlogPost post={post} />;
};

export default BlogPage;
