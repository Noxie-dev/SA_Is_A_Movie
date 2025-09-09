import { useState, useEffect } from 'react';

// Hook to load local markdown stories from src/content/trending/
export const useLocalStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocalStories = async () => {
      try {
        setLoading(true);
        
        // Use fetch to load markdown files from public directory
        const storyFiles = [
          '/content/trending/2024-12-05-amapiano-festival-rocks-johannesburg.md',
          '/content/trending/2024-12-05-your-first-blog-post.md'
        ];

        const storyPromises = storyFiles.map(async (filePath, index) => {
          try {
            const response = await fetch(filePath);
            if (!response.ok) {
              throw new Error(`Failed to load ${filePath}`);
            }
            const content = await response.text();
            
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
            
            if (!frontmatterMatch) {
              throw new Error('Invalid markdown format');
            }

            const [, frontmatterStr, body] = frontmatterMatch;
            const frontmatter = {};
            
            // Parse frontmatter
            frontmatterStr.split('\n').forEach(line => {
              const [key, ...valueParts] = line.split(':');
              if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                // Remove quotes and handle arrays
                if (value.startsWith('[') && value.endsWith(']')) {
                  frontmatter[key.trim()] = JSON.parse(value);
                } else if (value.startsWith('"') && value.endsWith('"')) {
                  frontmatter[key.trim()] = value.slice(1, -1);
                } else if (value === 'true') {
                  frontmatter[key.trim()] = true;
                } else if (value === 'false') {
                  frontmatter[key.trim()] = false;
                } else {
                  frontmatter[key.trim()] = value;
                }
              }
            });

            return {
              id: `local-${index}`,
              title: frontmatter.title || 'Untitled Story',
              description: frontmatter.description || '',
              category: frontmatter.category || 'culture',
              color: frontmatter.color || 'saisa-text-blue',
              featured_image: frontmatter.featured_image || '',
              date: frontmatter.date || new Date().toISOString(),
              featured: frontmatter.featured || false,
              tags: frontmatter.tags || [],
              body: body.trim(),
              author: {
                name: "SA IS A MOVIE Team",
                role: "Editor",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              },
              copyrightStatus: "approved",
              isLocal: true,
              filename: index === 0 ? '2024-12-05-amapiano-festival-rocks-johannesburg.md' : '2024-12-05-your-first-blog-post.md'
            };
          } catch (fileError) {
            console.warn(`Failed to load story ${index}:`, fileError);
            return null;
          }
        });

        const storyResults = await Promise.all(storyPromises);
        const validStories = storyResults.filter(story => story !== null);

        setStories(validStories);
        setError(null);
      } catch (err) {
        console.error('Error loading local stories:', err);
        setError(err.message);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalStories();
  }, []);

  return { stories, loading, error };
};
