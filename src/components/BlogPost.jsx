import { PortableText } from '@portabletext/react';
import { urlFor } from '../services/sanity';
import { format } from 'date-fns';
import AITools from './AITools';

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
            className="rounded-lg shadow-md"
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
      <h1 className="mb-4 text-3xl font-bold text-gray-900">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 text-2xl font-semibold text-gray-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 text-lg font-semibold text-gray-900">{children}</h4>
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

const BlogPost = ({ post }) => {
  if (!post) return null;

  const { title, publishedAt, mainImage, author, categories, body } = post;

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category.title}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {category.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
          {title}
        </h1>

        {/* Meta */}
        <div className="mb-6 flex items-center space-x-4 text-sm text-gray-600">
          {author && (
            <div className="flex items-center space-x-2">
              {author.image && (
                <img
                  src={urlFor(author.image).width(40).height(40).url()}
                  alt={author.name}
                  className="h-10 w-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{author.name}</p>
                {author.bio && (
                  <p className="text-xs text-gray-500">{author.bio}</p>
                )}
              </div>
            </div>
          )}
          {publishedAt && (
            <time dateTime={publishedAt} className="text-gray-500">
              {format(new Date(publishedAt), 'MMMM d, yyyy')}
            </time>
          )}
        </div>

        {/* Featured Image */}
        {mainImage && (
          <div className="mb-8">
            <img
              src={urlFor(mainImage).width(800).url()}
              alt={mainImage.alt || title}
              className="w-full rounded-lg shadow-lg"
            />
            {mainImage.caption && (
              <p className="mt-2 text-center text-sm text-gray-600">
                {mainImage.caption}
              </p>
            )}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {body && <PortableText value={body} components={portableTextComponents} />}
      </div>

      {/* AI Tools */}
      {body && <AITools content={body} />}

      {/* Author Bio */}
      {author && author.bio && (
        <div className="mt-12 rounded-lg bg-gray-50 p-6">
          <div className="flex items-start space-x-4">
            {author.image && (
              <img
                src={urlFor(author.image).width(80).height(80).url()}
                alt={author.name}
                className="h-20 w-20 rounded-full"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                About {author.name}
              </h3>
              <p className="mt-2 text-gray-700">{author.bio}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogPost;

