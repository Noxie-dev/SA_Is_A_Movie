import { Link } from 'react-router-dom';
import { useRecentPosts } from '../hooks/useSanity';
import BlogPostCard from './BlogPostCard';

const RecentPosts = ({ limit = 3, showHeader = true }) => {
  const { posts, loading, error } = useRecentPosts(limit);

  if (error) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-red-800">Error loading recent posts: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        {showHeader && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Stories
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Discover our most recent posts and insights
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/9] rounded-lg bg-gray-200"></div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post._id} post={post} />
              ))}
            </div>
            
            {showHeader && (
              <div className="mt-8 text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  View All Posts
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No posts available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentPosts;

