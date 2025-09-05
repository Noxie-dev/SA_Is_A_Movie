import { useState } from 'react';
import { useAllPosts, useCategories, useSearchPosts } from '../hooks/useSanity';
import BlogPostCard from './BlogPostCard';

const BlogList = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { posts: allPosts, loading: postsLoading, error: postsError } = useAllPosts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { posts: searchResults, loading: searchLoading } = useSearchPosts(searchQuery);

  // Determine which posts to display
  const displayPosts = searchQuery ? searchResults : allPosts;
  const loading = postsLoading || searchLoading;

  // Filter posts by category if one is selected and not searching
  const filteredPosts = selectedCategory && !searchQuery
    ? displayPosts.filter(post => 
        post.categories?.some(cat => cat.title === selectedCategory)
      )
    : displayPosts;

  if (postsError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-red-800">Error loading blog posts: {postsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Blog Posts
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Stay updated with the latest stories and insights
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4 md:flex md:items-center md:space-y-0 md:space-x-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Category Filter */}
        <div className="md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={categoriesLoading}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.title}>
                {category.title} ({category.postCount})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
      )}

      {/* Posts Grid */}
      {!loading && filteredPosts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No posts found' : 'No posts available'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? `No posts match your search for "${searchQuery}"`
              : 'Check back later for new content'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Results Summary */}
      {!loading && filteredPosts.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-600">
          {searchQuery ? (
            <p>
              Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          ) : selectedCategory ? (
            <p>
              Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} in "{selectedCategory}"
            </p>
          ) : (
            <p>
              Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogList;
