import { motion } from "framer-motion";
import { Suspense } from "react";
import Layout from '../components/Layout';
import { lazy } from 'react';

// Lazy load the StoriesViewer component
const StoriesViewer = lazy(() => import('../components/StoriesViewer'));

const StoriesPage = () => {
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
            <span className="text-[#FFA500]">Your</span>
            <br />
            <span className="text-[#FF66B2]">Stories</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#00FFFF] font-light mb-8">
            Manage and publish your SA IS A MOVIE content
          </p>
          <div className="flex gap-4 justify-center">
            <motion.a
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FFA500] hover:bg-[#FFA500]/80 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create New Story
            </motion.a>
            <motion.a
              href="/blog"
              className="bg-transparent border-2 border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF]/10 font-semibold px-6 py-3 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Blog
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Stories Viewer Section */}
      <Suspense fallback={
        <section className="py-20 bg-[#0A0A2A]">
          <div className="container mx-auto px-6 text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded mb-8 max-w-md mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      }>
        <StoriesViewer />
      </Suspense>

      {/* Quick Actions Section */}
      <section className="px-6 py-20 saisa-bg">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 saisa-text-yellow">
              Quick Actions
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#0A0A2A] p-6 rounded-2xl border-2 border-[#FFA500]/30 hover:border-[#FFA500] transition-all"
              >
                <h3 className="text-xl font-bold mb-4 saisa-text-blue">Create Story</h3>
                <p className="text-gray-400 mb-4">
                  Write new trending stories and entertainment content
                </p>
                <a
                  href="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#FFA500] hover:bg-[#FFA500]/80 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Open CMS
                </a>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#0A0A2A] p-6 rounded-2xl border-2 border-[#00FFFF]/30 hover:border-[#00FFFF] transition-all"
              >
                <h3 className="text-xl font-bold mb-4 saisa-text-cyan">View Blog</h3>
                <p className="text-gray-400 mb-4">
                  See all published blog posts and content
                </p>
                <a
                  href="/blog"
                  className="inline-block bg-[#00FFFF] hover:bg-[#00FFFF]/80 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  View Blog
                </a>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#0A0A2A] p-6 rounded-2xl border-2 border-[#FF66B2]/30 hover:border-[#FF66B2] transition-all"
              >
                <h3 className="text-xl font-bold mb-4 saisa-text-pink">Analytics</h3>
                <p className="text-gray-400 mb-4">
                  Track your content performance and engagement
                </p>
                <button className="inline-block bg-[#FF66B2] hover:bg-[#FF66B2]/80 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                  Coming Soon
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default StoriesPage;
