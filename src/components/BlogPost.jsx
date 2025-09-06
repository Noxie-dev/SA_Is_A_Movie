import { PortableText } from '@portabletext/react';
import { urlFor } from '../services/sanity';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import AITools from './AITools';

// Custom components for PortableText with dark theme
const portableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <div className="my-8">
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            className="rounded-lg shadow-lg border border-[#FFA500]/20"
          />
          {value.caption && (
            <p className="mt-3 text-center text-sm text-gray-400">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="mb-6 text-3xl font-bold text-white saisa-text-yellow">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 text-2xl font-semibold text-white saisa-text-yellow">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 text-xl font-semibold text-white saisa-text-yellow">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 text-lg font-semibold text-white saisa-text-yellow">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-6 text-gray-300 leading-relaxed text-lg">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-[#FFA500] pl-6 italic text-gray-300 bg-[#1A1A3A]/50 rounded-r-lg py-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc list-inside space-y-3 text-gray-300">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal list-inside space-y-3 text-gray-300">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-gray-300 leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-gray-300 leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-white saisa-text-yellow">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-200">{children}</em>
    ),
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : '_self'}
        rel={value.blank ? 'noopener noreferrer' : ''}
        className="text-[#FFA500] hover:text-[#FF66B2] underline transition-colors"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-[#1A1A3A] px-2 py-1 text-sm font-mono text-[#FFA500] border border-[#FFA500]/20">
        {children}
      </code>
    ),
  },
};

const BlogPost = ({ post }) => {
  if (!post) return null;

  const { title, publishedAt, mainImage, author, categories, body } = post;

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            to="/blog" 
            className="inline-flex items-center text-[#FFA500] hover:text-[#FF66B2] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Blog
          </Link>
        </motion.div>
      </div>

      <article className="container mx-auto max-w-4xl px-6 pb-20">
        {/* Header */}
        <motion.header 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {categories.map((category) => (
                <span
                  key={category.title}
                  className="inline-flex items-center rounded-full bg-[#FFA500]/20 border border-[#FFA500]/30 px-4 py-2 text-sm font-medium text-[#FFA500]"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="mb-8 text-4xl md:text-6xl font-bold leading-tight">
            <span className="text-white">{title}</span>
          </h1>

          {/* Meta */}
          <div className="mb-8 flex flex-wrap items-center gap-6 text-gray-300">
            {author && (
              <div className="flex items-center space-x-3">
                {author.image && (
                  <img
                    src={urlFor(author.image).width(40).height(40).url()}
                    alt={author.name}
                    className="h-12 w-12 rounded-full border-2 border-[#FFA500]/30"
                  />
                )}
                <div>
                  <p className="font-medium text-white flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {author.name}
                  </p>
                  {author.bio && (
                    <p className="text-sm text-gray-400">{author.bio}</p>
                  )}
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex items-center text-gray-300">
                <Calendar className="h-4 w-4 mr-2" />
                <time dateTime={publishedAt}>
                  {format(new Date(publishedAt), 'MMMM d, yyyy')}
                </time>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {mainImage && (
            <div className="mb-12">
              <img
                src={urlFor(mainImage).width(1200).url()}
                alt={mainImage.alt || title}
                className="w-full rounded-xl shadow-2xl border border-[#FFA500]/20"
              />
              {mainImage.caption && (
                <p className="mt-4 text-center text-sm text-gray-400">
                  {mainImage.caption}
                </p>
              )}
            </div>
          )}
        </motion.header>

        {/* Content */}
        <motion.div 
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {body && <PortableText value={body} components={portableTextComponents} />}
        </motion.div>

        {/* AI Tools */}
        {body && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12"
          >
            <AITools content={body} />
          </motion.div>
        )}

        {/* Author Bio */}
        {author && author.bio && (
          <motion.div 
            className="mt-16 rounded-xl bg-[#1A1A3A]/50 border border-[#FFA500]/20 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-start space-x-6">
              {author.image && (
                <img
                  src={urlFor(author.image).width(100).height(100).url()}
                  alt={author.name}
                  className="h-24 w-24 rounded-full border-2 border-[#FFA500]/30"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 saisa-text-yellow">
                  About {author.name}
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">{author.bio}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Related Posts or Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-[#1A1A3A]/50 border border-[#FFA500]/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4 saisa-text-yellow">
              Enjoyed This Story?
            </h3>
            <p className="text-gray-300 mb-6">
              Stay updated with the latest South African entertainment news and drama.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/blog" 
                className="saisa-bg-red text-white px-8 py-3 rounded-xl font-bold red-glow hover:scale-105 transition-all duration-300"
              >
                Read More Stories
              </Link>
              <Link 
                to="/trending" 
                className="border border-[#FFA500] text-[#FFA500] px-8 py-3 rounded-xl font-bold hover:bg-[#FFA500] hover:text-black transition-all duration-300"
              >
                Check Trending
              </Link>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPost;

