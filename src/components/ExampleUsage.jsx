import React, { useEffect, useState } from 'react';
import { sanityClient, urlFor } from '../client';
import { PortableText } from '@portabletext/react';

/**
 * Example Usage Component
 * 
 * This demonstrates the exact usage patterns you requested:
 * 1. Fetch all posts with GROQ query
 * 2. Render posts in a component
 * 3. Fetch single post by slug
 * 4. Render with PortableText
 */

// Example 1: Fetch all posts (as per your example)
export function ExamplePostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    sanityClient.fetch(`
      *[_type == "post"]{
        title,
        slug,
        mainImage{ asset->{url} },
        "authorName": author->name
      }
    `).then((data) => setPosts(data))
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map(post => (
        <div key={post.slug.current} className="border rounded-lg overflow-hidden shadow-md">
          <img src={urlFor(post.mainImage).width(600).url()} alt={post.title} className="w-full h-64 object-cover"/>
          <div className="p-4">
            <h2 className="font-bold text-xl">{post.title}</h2>
            <p className="text-gray-500 mt-2">By {post.authorName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Example 2: Fetch single post by slug (as per your example)
export function ExamplePostPage({ slug }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    sanityClient.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        mainImage{ asset->{url} },
        "authorName": author->name,
        body
      }`,
      { slug }
    ).then(setPost).catch(console.error);
  }, [slug]);

  if (!post) return <p>Loading...</p>;

  return (
    <article className="prose lg:prose-xl mx-auto my-8">
      <h1>{post.title}</h1>
      <p>By {post.authorName}</p>
      <img src={urlFor(post.mainImage).width(800).url()} alt={post.title}/>
      <PortableText value={post.body}/>
    </article>
  );
}

// Example 3: More advanced query with categories and published date
export function AdvancedPostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    sanityClient.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        publishedAt,
        mainImage {
          asset-> {
            _id,
            url
          },
          alt
        },
        author-> {
          name,
          image
        },
        categories[]-> {
          title
        },
        excerpt
      }
    `).then((data) => setPosts(data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <div key={post._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          {post.mainImage && (
            <img 
              src={urlFor(post.mainImage).width(600).url()} 
              alt={post.mainImage.alt || post.title} 
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
              {post.author && (
                <div className="flex items-center space-x-2">
                  {post.author.image && (
                    <img
                      src={urlFor(post.author.image).width(24).height(24).url()}
                      alt={post.author.name}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <span>{post.author.name}</span>
                </div>
              )}
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString()}
                </time>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
            
            {post.excerpt && (
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
            )}
            
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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
            
            <a 
              href={`/blog/${post.slug.current}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Read More
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// Example 4: Search functionality
export function SearchPosts() {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setPosts([]);
      return;
    }

    setLoading(true);
    sanityClient.fetch(`
      *[_type == "post" && (title match $query || body[].children[].text match $query)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        mainImage{ asset->{url} },
        "authorName": author->name
      }
    `, { query: `*${query}*` })
    .then((data) => {
      setPosts(data);
      setLoading(false);
    })
    .catch(console.error);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {loading && <p>Searching...</p>}
      
      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <div key={post._id} className="border rounded-lg overflow-hidden shadow-md">
              <img src={urlFor(post.mainImage).width(600).url()} alt={post.title} className="w-full h-64 object-cover"/>
              <div className="p-4">
                <h2 className="font-bold text-xl">{post.title}</h2>
                <p className="text-gray-500 mt-2">By {post.authorName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {query.length >= 2 && posts.length === 0 && !loading && (
        <p className="text-gray-500">No posts found for "{query}"</p>
      )}
    </div>
  );
}

export default {
  ExamplePostsList,
  ExamplePostPage,
  AdvancedPostsList,
  SearchPosts
};






