import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Twitter, Facebook, Play, TrendingUp, Users, Calendar } from "lucide-react";
import typographyLogo from './assets/saisa_movie_typography_logo.png';
import iconLogo from './assets/saisa_movie_icon_logo.png';
import SALogo from './components/SALogo';
import ParticleBackground from './components/ParticleBackground';
import CommentsSection from './components/CommentsSection';
import AuthButton from './components/AuthButton';
import { lazy, Suspense } from 'react';
import './App.css';

// Lazy load heavy components for better code splitting
const BlogPage = lazy(() => import('./pages/BlogPage'));
const TrendingStories = lazy(() => import('./components/TrendingStories'));
const RecentPosts = lazy(() => import('./components/RecentPosts'));

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/blog/*" 
          element={
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFA500]"></div>
              </div>
            }>
              <BlogPage />
            </Suspense>
          } 
        />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  const stats = [
    { icon: Users, number: "500K+", label: "Followers" },
    { icon: TrendingUp, number: "1M+", label: "Monthly Views" },
    { icon: Calendar, number: "Daily", label: "Fresh Content" }
  ];

  return (
    <div className="min-h-screen saisa-bg text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A2A]/80 backdrop-blur-sm border-b border-[#FFA500]/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <SALogo className="h-10 w-10" />
              <span className="text-xl font-bold">
                SA IS A <span className="saisa-text-red">MOVIE</span>
              </span>
            </motion.div>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center space-x-6"
          >
            <Link to="/" className="hover:text-[#FFA500] transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-[#FFA500] transition-colors">Blog</Link>
            <a href="#trending" className="hover:text-[#FFA500] transition-colors">Trending</a>
            <a href="#about" className="hover:text-[#FFA500] transition-colors">About</a>
            <a href="#contact" className="hover:text-[#FFA500] transition-colors">Contact</a>
            <AuthButton />
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Interactive Particle Background */}
        <ParticleBackground />
        
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10 z-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[#FFA500] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-[#FF66B2] rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4 leading-tight">
            <span className="text-[#FFA500]">SA IS A</span>
            <br />
            <span className="text-[#FF66B2]">MOVIE</span>
          </h1>
          <p className="text-2xl md:text-3xl text-[#00FFFF] font-light mb-8">
            LIGHTS, CAMERA, DRAMA
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-300 max-w-4xl mb-8 leading-relaxed relative z-10"
        >
          Breaking down South Africa's hottest scandals, celebrity drama, and Amapiano events. 
          Your ultimate source for entertainment that keeps Mzansi talking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mb-12 relative z-10"
        >
          <Link to="/blog">
            <Button className="saisa-bg-red text-white text-lg px-8 py-4 rounded-2xl font-bold red-glow hover:scale-105 transition-all duration-300">
              <Play className="mr-2 h-5 w-5" />
              Read Latest Stories
            </Button>
          </Link>
          <Button variant="outline" className="border-[#FFA500] text-[#FFA500] text-lg px-8 py-4 rounded-2xl font-bold neon-glow hover:bg-[#FFA500] hover:text-black transition-all duration-300">
            <TrendingUp className="mr-2 h-5 w-5" />
            Trending Now
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-3 gap-8 max-w-md mx-auto relative z-10"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="h-8 w-8 mx-auto mb-2 saisa-text-yellow" />
              <div className="text-2xl font-bold saisa-text-yellow">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Trending Topics Section */}
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
        <TrendingStories />
      </Suspense>

      {/* Recent Blog Posts Section */}
      <Suspense fallback={
        <section className="py-12 bg-[#0A0A2A]">
          <div className="mx-auto max-w-7xl px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4 max-w-xs mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded mb-8 max-w-md mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      }>
        <RecentPosts />
      </Suspense>

      {/* About Section */}
      <section id="about" className="px-6 py-20 bg-[#0A0A2A]">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
              Why SA IS A MOVIE?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Because South Africa is literally a movie! From the drama in parliament to the beats dropping 
              in the townships, from celebrity scandals to viral TikTok dances - we're here to capture it all. 
              We're not just reporting the news; we're telling the story of a nation that never stops entertaining.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Our mission is simple: keep you in the loop with the most engaging, witty, and street-smart 
              coverage of everything that makes South Africa the most entertaining country on the continent. 
              We speak your language, we get your humor, and we're always ready with the perfect meme.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="contact" className="px-6 py-20 saisa-bg-dark">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 saisa-text-yellow text-shadow-neon">
              Join the Movement
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Follow us on socials for daily scandals, events, and hot takes. 
              Be part of the conversation that's shaping South African entertainment culture.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="saisa-bg-yellow text-black font-bold text-lg px-8 py-4 rounded-2xl neon-glow hover:bg-yellow-300 transition-all duration-300 min-w-[160px]">
                  <Instagram className="mr-2 h-5 w-5" />
                  Instagram
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="saisa-bg-yellow text-black font-bold text-lg px-8 py-4 rounded-2xl neon-glow hover:bg-yellow-300 transition-all duration-300 min-w-[160px]">
                  <Twitter className="mr-2 h-5 w-5" />
                  Twitter
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="saisa-bg-yellow text-black font-bold text-lg px-8 py-4 rounded-2xl neon-glow hover:bg-yellow-300 transition-all duration-300 min-w-[160px]">
                  <Facebook className="mr-2 h-5 w-5" />
                  Facebook
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-gray-400"
            >
              <p className="mb-4">Get notified when we drop the hottest content</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#0A0A2A] border border-[#FFA500]/30 text-white placeholder-gray-500 focus:border-[#FFA500] focus:outline-none"
                />
                <Button className="saisa-bg-red text-white px-6 py-3 rounded-xl font-bold red-glow hover:scale-105 transition-all duration-300">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FF66B2] text-center py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <SALogo className="h-8 w-8" />
              <span className="text-white font-bold text-lg">
                SA IS A MOVIE
              </span>
            </div>
            
            <div className="text-white/80 text-sm">
              © {new Date().getFullYear()} SA IS A MOVIE. All rights reserved.
            </div>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

