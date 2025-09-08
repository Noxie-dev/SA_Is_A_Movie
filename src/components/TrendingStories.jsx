import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Calendar, Upload, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTrendingStories } from '../hooks/useContentful';
import { postStoryToBlog, getCopyrightStatusColor, getCopyrightStatusIcon } from '../services/copyrightService';
import CopyrightChecker from './CopyrightChecker';

// Fallback static data
const fallbackStories = [
  {
    id: 1,
    title: "Amapiano Festival Rocks Johannesburg",
    description: "The biggest Amapiano event of the year had Sandton shaking with beats that could be heard from Cape Town. DJ Maphorisa and Kabza De Small delivered an unforgettable night.",
    category: "music",
    color: "saisa-text-blue",
    author: {
      name: "Thabo Mthembu",
      role: "Music Reporter",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    publishedDate: new Date().toISOString(),
    copyrightStatus: "approved"
  },
  {
    id: 2,
    title: "Political Drama Unfolds in Parliament",
    description: "SA politics serving more drama than Generations! The latest parliamentary session had more plot twists than your favorite soapie. Keep the popcorn ready.",
    category: "scandal",
    color: "saisa-text-pink",
    author: {
      name: "Nomsa Dlamini",
      role: "Political Correspondent",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    publishedDate: new Date().toISOString(),
    copyrightStatus: "approved"
  },
  {
    id: 3,
    title: "Celebrity Couple's Public Breakup",
    description: "The entertainment industry is buzzing with the latest celebrity split that's got everyone talking. Social media is on fire with reactions and memes.",
    category: "celebrity",
    color: "saisa-text-yellow",
    author: {
      name: "Lerato Molefe",
      role: "Entertainment Reporter",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    publishedDate: new Date().toISOString(),
    copyrightStatus: "approved"
  },
  {
    id: 4,
    title: "Viral TikTok Dance Takes Over Mzansi",
    description: "From Cape Town to Durban, everyone's doing the latest dance craze. This viral sensation has united the nation in rhythm and laughter.",
    category: "culture",
    color: "saisa-text-blue",
    author: {
      name: "Sipho Nkosi",
      role: "Culture Writer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    publishedDate: new Date().toISOString(),
    copyrightStatus: "approved"
  },
  {
    id: 5,
    title: "Government Scandal Rocks Social Media",
    description: "The latest government controversy has Twitter fingers working overtime. Memes, reactions, and hot takes are flooding timelines across the country.",
    category: "scandal",
    color: "saisa-text-pink",
    author: {
      name: "Nomsa Dlamini",
      role: "Political Correspondent",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    publishedDate: new Date().toISOString(),
    copyrightStatus: "approved"
  },
  {
    id: 6,
    title: "Music Awards Night Drama",
    description: "The South African Music Awards delivered more than just performances. Behind-the-scenes drama and unexpected moments kept viewers glued to their screens.",
    category: "music",
    color: "saisa-text-yellow",
    author: {
      name: "Thabo Mthembu",
      role: "Music Reporter",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    publishedDate: new Date().toISOString(),
    copyrightStatus: "approved"
  }
];

const TrendingStories = () => {
  const { stories, loading, error } = useTrendingStories();
  const [postingStory, setPostingStory] = useState(null);
  const [postResult, setPostResult] = useState(null);
  
  // Use Contentful data if available, otherwise fallback to static data
  const displayStories = stories.length > 0 ? stories : fallbackStories;
  
  // Transform Contentful data to match expected format
  const transformedStories = stories.length > 0 
    ? stories.map(story => ({
        id: story.sys.id,
        title: story.fields.title,
        description: story.fields.description,
        category: story.fields.category,
        color: story.fields.color,
        featuredImage: story.fields.featuredImage,
        publishedDate: story.fields.publishedDate,
        isActive: story.fields.isActive,
        author: story.fields.author || {
          name: "SA IS A MOVIE Team",
          role: "Editor",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        copyrightStatus: story.fields.copyrightStatus || "pending"
      }))
    : fallbackStories;

  const handlePostStory = async (story) => {
    setPostingStory(story.id);
    setPostResult(null);

    try {
      const result = await postStoryToBlog(story.id, story.author);
      setPostResult({ success: true, story: story.title, blogPostId: result.blogPost.sys.id });
    } catch (error) {
      setPostResult({ success: false, error: error.message });
    } finally {
      setPostingStory(null);
    }
  };

  const handleCopyrightStatusChange = (storyId, status) => {
    // Update the story's copyright status
    const updatedStories = transformedStories.map(story => 
      story.id === storyId ? { ...story, copyrightStatus: status.status } : story
    );
    // Note: In a real app, you'd update this in your state management or Contentful
  };

  if (loading) {
    return (
      <section id="trending" className="px-6 py-20 saisa-bg-dark">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 saisa-text-yellow text-shadow-neon">
              Loading Trending Topics...
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-800 rounded-2xl h-64"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.warn('Contentful error, using fallback data:', error);
  }

  return (
    <section id="trending" className="px-6 py-20 saisa-bg-dark">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 saisa-text-yellow text-shadow-neon">
            Trending Topics
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The hottest stories that have Mzansi buzzing. From political drama to celebrity scandals, 
            we've got the tea that everyone's talking about.
          </p>
          {stories.length > 0 && (
            <p className="text-sm text-green-400 mt-2">
              📡 Powered by Contentful CMS
            </p>
          )}
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {transformedStories.map((story, index) => (
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
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
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
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{story.author.name}</p>
                      <p className="text-xs text-gray-400">{story.author.role}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(story.publishedDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Copyright Checker */}
                  {story.featuredImage && (
                    <div className="mb-4">
                      <CopyrightChecker 
                        imageUrl={story.featuredImage.fields?.file?.url}
                        onStatusChange={(status) => handleCopyrightStatusChange(story.id, status)}
                      />
                    </div>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-gray-700 space-y-3">
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        className="text-[#FFA500] hover:text-black hover:bg-[#FFA500] transition-all duration-300 p-0 h-auto font-semibold flex-1"
                      >
                        Read More →
                      </Button>
                      <Button 
                        onClick={() => handlePostStory(story)}
                        disabled={postingStory === story.id || story.copyrightStatus === 'rejected'}
                        className="bg-[#FF66B2] hover:bg-[#FF66B2]/80 text-white transition-all duration-300"
                        size="sm"
                      >
                        {postingStory === story.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-1" />
                            Post Story
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {story.copyrightStatus === 'rejected' && (
                      <Alert variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3" />
                        <AlertDescription>
                          Cannot post: Copyright issues detected
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Post Result Messages */}
        {postResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Alert className={`w-80 ${postResult.success ? 'bg-green-900 border-green-500' : 'bg-red-900 border-red-500'}`}>
              {postResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription className="text-white">
                {postResult.success 
                  ? `"${postResult.story}" successfully posted to blog!`
                  : `Failed to post story: ${postResult.error}`
                }
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TrendingStories;


