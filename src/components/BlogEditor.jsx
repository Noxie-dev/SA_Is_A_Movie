import React, { useState } from 'react';
import ComplianceChecker from './ComplianceChecker';

// Example Blog Editor component showing how to integrate ComplianceChecker
const BlogEditor = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [images, setImages] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async (complianceResults) => {
    if (!complianceResults.canPublish) {
      alert('Please fix all compliance issues before publishing.');
      return;
    }

    setIsPublishing(true);
    
    try {
      // Your publish logic here
      const blogPost = {
        title,
        content,
        metaDescription,
        images,
        complianceScore: complianceResults.score,
        publishedAt: new Date().toISOString()
      };

      // Example: Save to your CMS/API
      const response = await fetch('/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogPost)
      });

      if (response.ok) {
        alert('Blog post published successfully!');
        // Reset form
        setContent('');
        setTitle('');
        setMetaDescription('');
        setImages([]);
      } else {
        throw new Error('Failed to publish blog post');
      }
    } catch (error) {
      console.error('Publishing error:', error);
      alert('Failed to publish blog post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      alt: '' // User should add alt text
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const updateImageAlt = (imageId, alt) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, alt } : img
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blog Editor</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog post title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter meta description for SEO..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="15"
              placeholder="Write your blog post content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {images.length > 0 && (
              <div className="mt-3 space-y-2">
                {images.map(image => (
                  <div key={image.id} className="flex items-center gap-3 p-2 border rounded">
                    <img src={image.url} alt={image.alt} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{image.name}</p>
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => updateImageAlt(image.id, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Alt text for accessibility..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compliance Checker Section */}
        <div>
          <ComplianceChecker
            content={content}
            title={title}
            metaDescription={metaDescription}
            images={images}
            onPublish={handlePublish}
          />
        </div>
      </div>

      {/* Publishing Status */}
      {isPublishing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-lg font-medium">Publishing your blog post...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
