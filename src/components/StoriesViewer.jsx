import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  User, 
  Calendar, 
  Upload, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  BookOpen
} from 'lucide-react';
import { useLocalStories } from '../hooks/useLocalStories';
import { postStoryToBlog, getCopyrightStatusColor, getCopyrightStatusIcon } from '../services/copyrightService';
import { postLocalStoryToBlog, createLocalBlogPost } from '../services/localBlogService';

const StoriesViewer = () => {
  const { stories, loading, error } = useLocalStories();
  const [postingStory, setPostingStory] = useState(null);
  const [postResult, setPostResult] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  const handlePostStory = async (story) => {
    try {
      setPostingStory(story.id);
      setPostResult(null);

      // Try to post to blog using local story service
      const result = await postLocalStoryToBlog(story, story.author);
      
      setPostResult({
        success: true,
        message: result.message || 'Story successfully posted to blog!',
        blogPostId: result.blogPost?.sys?.id || result.blogPost?.slug
      });
    } catch (error) {
      console.error('Error posting story:', error);
      setPostResult({
        success: false,
        message: error.message || 'Failed to post story to blog'
      });
    } finally {
      setPostingStory(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <section className="px-6 py-20 saisa-bg-dark">
        <div className="container mx-auto text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#FFA500] mx-auto mb-4" />
          <p className="text-gray-300">Loading your saved stories...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-20 saisa-bg-dark">
        <div className="container mx-auto">
          <Alert className="bg-red-900/20 border-red-500 text-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error loading stories: {error}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20 saisa-bg-dark">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 saisa-text-yellow text-shadow-neon">
            Your Saved Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stories you've created and saved in the CMS. View, edit, and publish them to your blog.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-400">
            <FileText className="h-4 w-4" />
            <span>{stories.length} stories found</span>
          </div>
        </motion.div>

        {/* Post Result Alert */}
        {postResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Alert className={postResult.success ? "bg-green-900/20 border-green-500 text-green-200" : "bg-red-900/20 border-red-500 text-red-200"}>
              {postResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertDescription>
                {postResult.message}
                {postResult.blogPostId && (
                  <span className="block mt-1 text-xs">
                    Blog Post ID: {postResult.blogPostId}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group cursor-pointer"
            >
              <Card className="bg-[#0A0A2A] text-white border-2 border-[#FFA500]/30 rounded-2xl overflow-hidden hover:border-[#FFA500] transition-all duration-300 h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-bold uppercase tracking-wider ${story.color}`}>
                      {story.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${getCopyrightStatusColor(story.copyrightStatus)} border-current text-xs`}
                      >
                        {getCopyrightStatusIcon(story.copyrightStatus)}
                      </Badge>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl saisa-text-red mb-4 group-hover:text-[#FFA500] transition-colors">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed flex-grow mb-4">
                    {story.description}
                  </p>

                  {/* Author Details */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-[#1A1A3A]/50 rounded-lg">
                    <img 
                      src={story.author.avatar} 
                      alt={story.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{story.author.name}</p>
                      <p className="text-xs text-gray-400">{story.author.role}</p>
                    </div>
                  </div>

                  {/* Story Meta */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(story.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {story.filename}
                    </div>
                  </div>

                  {/* Tags */}
                  {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {story.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs bg-[#FFA500]/20 text-[#FFA500]">
                          #{tag}
                        </Badge>
                      ))}
                      {story.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-600/20 text-gray-400">
                          +{story.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent border-[#FFA500]/30 text-[#FFA500] hover:bg-[#FFA500]/10"
                      onClick={() => setSelectedStory(story)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent border-[#00FFFF]/30 text-[#00FFFF] hover:bg-[#00FFFF]/10"
                      onClick={() => window.open('/admin', '_blank')}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent border-green-500/30 text-green-400 hover:bg-green-500/10"
                      onClick={() => handlePostStory(story)}
                      disabled={postingStory === story.id}
                    >
                      {postingStory === story.id ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Globe className="h-3 w-3 mr-1" />
                      )}
                      {postingStory === story.id ? 'Posting...' : 'Post to Blog'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Stories Found</h3>
            <p className="text-gray-500 mb-6">
              You haven't created any stories yet. Start by creating your first story in the CMS.
            </p>
            <Button
              onClick={() => window.open('/admin', '_blank')}
              className="bg-[#FFA500] hover:bg-[#FFA500]/80 text-black font-semibold"
            >
              <Edit className="h-4 w-4 mr-2" />
              Create Your First Story
            </Button>
          </div>
        )}
      </div>

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A0A2A] rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#FFA500]/30"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold saisa-text-yellow">{selectedStory.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStory(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 whitespace-pre-wrap">
                {selectedStory.body}
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => window.open('/admin', '_blank')}
                className="bg-[#FFA500] hover:bg-[#FFA500]/80 text-black"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit in CMS
              </Button>
              <Button
                onClick={() => handlePostStory(selectedStory)}
                disabled={postingStory === selectedStory.id}
                className="bg-green-600 hover:bg-green-700"
              >
                {postingStory === selectedStory.id ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Globe className="h-4 w-4 mr-2" />
                )}
                {postingStory === selectedStory.id ? 'Posting...' : 'Post to Blog'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default StoriesViewer;
