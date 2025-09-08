import React from 'react';
import { ExternalLink, BookOpen, Calendar, Globe } from 'lucide-react';

const SourceLinks = ({ sourceLinks, className = '' }) => {
  if (!sourceLinks || sourceLinks.length === 0) {
    return null;
  }

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  const getDomainIcon = (url) => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      if (hostname.includes('youtube') || hostname.includes('youtu.be')) {
        return '🎥';
      } else if (hostname.includes('twitter') || hostname.includes('x.com')) {
        return '🐦';
      } else if (hostname.includes('linkedin')) {
        return '💼';
      } else if (hostname.includes('facebook')) {
        return '📘';
      } else if (hostname.includes('instagram')) {
        return '📷';
      } else if (hostname.includes('reddit')) {
        return '🔴';
      } else if (hostname.includes('medium')) {
        return '📝';
      } else if (hostname.includes('github')) {
        return '💻';
      } else if (hostname.includes('wikipedia')) {
        return '📚';
      } else if (hostname.includes('news') || hostname.includes('bbc') || hostname.includes('cnn')) {
        return '📰';
      } else {
        return '🌐';
      }
    } catch {
      return '🌐';
    }
  };

  return (
    <div className={`mt-12 pt-8 border-t border-gray-200 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Sources & References</h3>
      </div>
      
      <div className="space-y-4">
        {sourceLinks.map((link, index) => (
          <div key={link.id || index} className="group">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="flex-shrink-0 mt-1">
                <span className="text-lg">{getDomainIcon(link.url)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {link.title ? (
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </h4>
                    ) : (
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {formatUrl(link.url)}
                      </h4>
                    )}
                    
                    {link.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {link.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Globe className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 font-mono">
                        {formatUrl(link.url)}
                      </span>
                    </div>
                  </div>
                  
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label={`Open source link: ${link.title || formatUrl(link.url)}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Transparency Note</h4>
            <p className="text-sm text-blue-700 mt-1">
              All sources and references are provided for transparency and to help readers verify information. 
              External links open in new tabs for your convenience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceLinks;
