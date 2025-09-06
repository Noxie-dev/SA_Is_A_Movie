import { motion } from "framer-motion";
import { Suspense } from "react";
import Layout from '../components/Layout';
import { lazy } from 'react';

// Lazy load the TrendingStories component
const TrendingStories = lazy(() => import('../components/TrendingStories'));

const TrendingPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-[#FFA500]">Trending</span>
            <br />
            <span className="text-[#FF66B2]">Now</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#00FFFF] font-light mb-8">
            What's Hot in South Africa Right Now
          </p>
        </motion.div>
      </section>

      {/* Trending Stories Section */}
      <Suspense fallback={
        <section className="py-20 bg-[#0A0A2A]">
          <div className="container mx-auto px-6 text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded mb-8 max-w-md mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      }>
        <TrendingStories />
      </Suspense>

      {/* Additional Trending Content */}
      <section className="px-6 py-20 saisa-bg">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 saisa-text-yellow">
              Trending Categories
            </h2>
            <p className="text-lg text-gray-300">
              Explore what's buzzing across different topics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Celebrity Drama", count: "24 stories", color: "bg-gradient-to-r from-pink-500 to-rose-500" },
              { name: "Political Scandals", count: "18 stories", color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
              { name: "Amapiano Events", count: "32 stories", color: "bg-gradient-to-r from-yellow-500 to-orange-500" },
              { name: "Viral Moments", count: "45 stories", color: "bg-gradient-to-r from-green-500 to-teal-500" }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-lg bg-[#1A1A3A]/50 border border-[#FFA500]/20 hover:border-[#FFA500] transition-all duration-300 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-lg ${category.color} mb-4`}></div>
                <h3 className="text-lg font-bold mb-2 saisa-text-yellow">{category.name}</h3>
                <p className="text-gray-400 text-sm">{category.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Trends */}
      <section className="px-6 py-20 bg-[#0A0A2A]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Social Media Buzz
            </h2>
            <p className="text-lg text-gray-300">
              What's trending on social platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { platform: "Twitter", hashtag: "#SaisAMovie", posts: "2.3K posts" },
              { platform: "Instagram", hashtag: "#MzansiDrama", posts: "1.8K posts" },
              { platform: "TikTok", hashtag: "#AmapianoVibes", posts: "5.2K posts" }
            ].map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-[#1A1A3A]/50 border border-[#FFA500]/20 text-center"
              >
                <h3 className="text-xl font-bold mb-2 saisa-text-yellow">{trend.platform}</h3>
                <p className="text-lg text-[#FFA500] mb-2">{trend.hashtag}</p>
                <p className="text-gray-400">{trend.posts}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-20 saisa-bg-dark">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 saisa-text-yellow text-shadow-neon">
              Don't Miss Out
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Stay updated with the latest trending stories and be the first to know what's happening in Mzansi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="saisa-bg-red text-white px-8 py-3 rounded-xl font-bold red-glow hover:scale-105 transition-all duration-300">
                Follow on Social Media
              </button>
              <button className="border border-[#FFA500] text-[#FFA500] px-8 py-3 rounded-xl font-bold hover:bg-[#FFA500] hover:text-black transition-all duration-300">
                Subscribe to Newsletter
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TrendingPage;