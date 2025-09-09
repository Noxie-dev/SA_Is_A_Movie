import React, { useEffect, useState } from 'react';
import { sanityApi, urlFor } from '../services/sanity';
import { PortableText } from '@portabletext/react';

// Custom components for PortableText
const portableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <div className="my-6">
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            className="rounded-lg shadow-md w-full"
          />
          {value.caption && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-900 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-blue-500 pl-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc list-inside space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal list-inside space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-gray-700">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-gray-700">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : '_self'}
        rel={value.blank ? 'noopener noreferrer' : ''}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-gray-100 px-1 py-0.5 text-sm font-mono text-gray-800">
        {children}
      </code>
    ),
  },
};

export default function PostPage({ slug }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await sanityApi.getPostBySlug(slug);
        setPost(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

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
        <p className="text-red-600">Error loading post: {error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Post not found</p>
      </div>
    );
  }

  return (
    <article className="prose lg:prose-xl mx-auto my-8 max-w-4xl px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
          {post.author && (
            <div className="flex items-center space-x-2">
              {post.author.image && (
                <img
                  src={urlFor(post.author.image).width(40).height(40).url()}
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full"
                />
              )}
              <span>By {post.author.name}</span>
            </div>
          )}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString()}
            </time>
          )}
        </div>

        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((category, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {category.title}
              </span>
            ))}
          </div>
        )}

        {post.mainImage && (
          <img 
            src={urlFor(post.mainImage).width(800).url()} 
            alt={post.title}
            className="w-full rounded-lg shadow-lg mb-8"
          />
        )}
      </header>

      <div className="prose prose-lg max-w-none">
        {post.body && <PortableText value={post.body} components={portableTextComponents} />}
      </div>

      {post.author && post.author.bio && (
        <div className="mt-12 rounded-lg bg-gray-50 p-6">
          <div className="flex items-start space-x-4">
            {post.author.image && (
              <img
                src={urlFor(post.author.image).width(80).height(80).url()}
                alt={post.author.name}
                className="h-20 w-20 rounded-full"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                About {post.author.name}
              </h3>
              <div className="mt-2 text-gray-700">
                <PortableText value={post.author.bio} />
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}








