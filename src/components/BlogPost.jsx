import React from 'react';
import SourceLinks from './SourceLinks';
import { Calendar, Clock, User, Tag } from 'lucide-react';

const BlogPost = ({ 
  title, 
  content, 
  metaDescription, 
  images, 
  sourceLinks, 
  author = 'SA_isaMovie Team',
  publishedAt,
  readingTime,
  tags = [],
  complianceScore
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const renderContent = (content) => {
    // Simple markdown-like rendering for demonstration
    // In a real implementation, you'd use a proper markdown parser
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-gray-900 mt-6 mb-3">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-medium text-gray-900 mt-4 mb-2">{line.substring(4)}</h3>;
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index} className="text-gray-700 leading-relaxed mb-4">{line}</p>;
        }
      });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>
        
        {metaDescription && (
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {metaDescription}
          </p>
        )}
        
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          
          {publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(publishedAt)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime || calculateReadingTime(content)}</span>
          </div>
          
          {complianceScore && (
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                complianceScore >= 80 ? 'bg-green-500' : 
                complianceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span>Quality Score: {complianceScore}%</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      
      {/* Featured Images */}
      {images && images.length > 0 && (
        <div className="mb-8">
          {images.map((image, index) => (
            <div key={image.id || index} className="mb-4">
              <img
                src={image.url}
                alt={image.alt || `Blog post image ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-md"
              />
              {image.alt && (
                <p className="text-sm text-gray-500 mt-2 italic text-center">
                  {image.alt}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {renderContent(content)}
      </div>
      
      {/* Source Links */}
      <SourceLinks sourceLinks={sourceLinks} />
      
      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center text-gray-500 text-sm">
          <p>
            Published by <strong>SA_isaMovie</strong> • 
            Last updated: {formatDate(publishedAt || new Date().toISOString())}
          </p>
          {complianceScore && (
            <p className="mt-2">
              This content has been reviewed for quality and compliance standards.
            </p>
          )}
        </div>
      </footer>
    </article>
  );
};

export default BlogPost;