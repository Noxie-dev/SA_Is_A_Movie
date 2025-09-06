import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTrendingStories } from '../hooks/useContentful';

// Fallback static data
const fallbackStories = [
  {
    id: 1,
    title: "Amapiano Festival Rocks Johannesburg",
    description: "The biggest Amapiano event of the year had Sandton shaking with beats that could be heard from Cape Town. DJ Maphorisa and Kabza De Small delivered an unforgettable night.",
    category: "music",
    color: "saisa-text-blue"
  },
  {
    id: 2,
    title: "Political Drama Unfolds in Parliament",
    description: "SA politics serving more drama than Generations! The latest parliamentary session had more plot twists than your favorite soapie. Keep the popcorn ready.",
    category: "scandal",
    color: "saisa-text-pink"
  },
  {
    id: 3,
    title: "Celebrity Couple's Public Breakup",
    description: "The entertainment industry is buzzing with the latest celebrity split that's got everyone talking. Social media is on fire with reactions and memes.",
    category: "celebrity",
    color: "saisa-text-yellow"
  },
  {
    id: 4,
    title: "Viral TikTok Dance Takes Over Mzansi",
    description: "From Cape Town to Durban, everyone's doing the latest dance craze. This viral sensation has united the nation in rhythm and laughter.",
    category: "culture",
    color: "saisa-text-blue"
  },
  {
    id: 5,
    title: "Government Scandal Rocks Social Media",
    description: "The latest government controversy has Twitter fingers working overtime. Memes, reactions, and hot takes are flooding timelines across the country.",
    category: "scandal",
    color: "saisa-text-pink"
  },
  {
    id: 6,
    title: "Music Awards Night Drama",
    description: "The South African Music Awards delivered more than just performances. Behind-the-scenes drama and unexpected moments kept viewers glued to their screens.",
    category: "music",
    color: "saisa-text-yellow"
  }
];

const TrendingStories = () => {
  const { stories, loading, error } = useTrendingStories();
  
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
        isActive: story.fields.isActive
      }))
    : fallbackStories;

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
              <Card className="bg-black text-white border-2 border-yellow-500/30 rounded-2xl overflow-hidden hover:border-yellow-500 transition-all duration-300 h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-bold uppercase tracking-wider ${story.color}`}>
                      {story.category}
                    </span>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </div>
                  
                  <h3 className="font-bold text-xl saisa-text-red mb-4 group-hover:text-yellow-400 transition-colors">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed flex-grow">
                    {story.description}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <Button variant="ghost" className="text-yellow-400 hover:text-black hover:bg-yellow-400 transition-all duration-300 p-0 h-auto font-semibold">
                      Read More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingStories;


