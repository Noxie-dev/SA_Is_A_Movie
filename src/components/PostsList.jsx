import React, { useEffect, useState } from 'react';
import { sanityApi, urlFor } from '../services/sanity';
import { PortableText } from '@portabletext/react';

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await sanityApi.getAllPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading posts: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map(post => (
        <div key={post.slug?.current || post._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          {post.mainImage && (
            <img 
              src={urlFor(post.mainImage).width(600).url()} 
              alt={post.title} 
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="font-bold text-xl mb-2">{post.title}</h2>
            <p className="text-gray-500 mt-2">
              By {post.author?.name || 'Unknown Author'}
            </p>
            {post.categories && post.categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.categories.map((category, index) => (
                  <span 
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}
            {post.publishedAt && (
              <p className="text-sm text-gray-400 mt-2">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


