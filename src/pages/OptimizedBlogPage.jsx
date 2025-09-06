// ============================================
// EXAMPLE: OPTIMIZED BLOG PAGE INTEGRATION
// ============================================

import React from 'react';
import { AdOptimizedBlogPost } from '../components/AdOptimizedBlogPost';

// Example blog post data (replace with your actual data source)
const exampleBlogPost = {
  id: 'amapiano-festival-2024',
  title: 'Amapiano Festival Rocks Johannesburg - The Biggest Event of the Year',
  category: 'music',
  content: `
    <p>The biggest Amapiano event of the year had Sandton shaking this weekend as thousands of music lovers gathered for the annual festival.</p>
    
    <h2>The Lineup Was Absolutely Fire</h2>
    <p>From Kabza De Small to DJ Maphorisa, the stage was packed with South Africa's hottest Amapiano artists. The energy was electric from start to finish.</p>
    
    <p>Fans traveled from all over the country to witness this incredible celebration of South African music culture. The festival grounds were packed with people dancing to the infectious beats that have taken the world by storm.</p>
    
    <h2>What Made This Year Special</h2>
    <p>This year's festival featured some incredible collaborations that we've never seen before. The surprise performances had everyone talking on social media.</p>
    
    <p>The food vendors were also on point, serving up traditional South African dishes alongside international favorites. It was a true celebration of our diverse culture.</p>
    
    <h2>The Aftermath</h2>
    <p>Social media has been buzzing with videos and photos from the event. The hashtag #AmapianoFest2024 has been trending all weekend.</p>
    
    <p>If you missed this year's festival, don't worry - they're already planning something even bigger for next year. This is just the beginning of Amapiano's global domination.</p>
  `,
  author: 'SA IS A MOVIE Team',
  publishDate: '2024-12-05',
  tags: ['amapiano', 'music', 'johannesburg', 'festival', 'south africa']
};

export function OptimizedBlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-orange-600">SA IS A MOVIE</h1>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Entertainment News</span>
            </div>
            <nav className="flex space-x-6">
              <a href="/" className="text-gray-600 hover:text-orange-600">Home</a>
              <a href="/trending" className="text-gray-600 hover:text-orange-600">Trending</a>
              <a href="/music" className="text-gray-600 hover:text-orange-600">Music</a>
              <a href="/celebrity" className="text-gray-600 hover:text-orange-600">Celebrity</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AdOptimizedBlogPost
          postId={exampleBlogPost.id}
          content={exampleBlogPost.content}
          title={exampleBlogPost.title}
          category={exampleBlogPost.category}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-orange-500 mb-4">SA IS A MOVIE</h3>
              <p className="text-gray-400">
                Breaking down South Africa's hottest scandals, entertainment news, and viral moments. 
                Because South Africa is literally a movie!
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/music" className="hover:text-orange-500">Music</a></li>
                <li><a href="/celebrity" className="hover:text-orange-500">Celebrity</a></li>
                <li><a href="/scandal" className="hover:text-orange-500">Scandal</a></li>
                <li><a href="/culture" className="hover:text-orange-500">Culture</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-500">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-orange-500">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-orange-500">TikTok</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SA IS A MOVIE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default OptimizedBlogPage;
