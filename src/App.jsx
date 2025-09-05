import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Twitter, Facebook, Play, TrendingUp, Users, Calendar } from "lucide-react";
import typographyLogo from './assets/saisa_movie_typography_logo.png';
import iconLogo from './assets/saisa_movie_icon_logo.png';
import ParticleBackground from './components/ParticleBackground';
import CommentsSection from './components/CommentsSection';
import './App.css';

function App() {
  const trendingStories = [
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

  const stats = [
    { icon: Users, number: "500K+", label: "Followers" },
    { icon: TrendingUp, number: "1M+", label: "Monthly Views" },
    { icon: Calendar, number: "Daily", label: "Fresh Content" }
  ];

  return (
    <div className="min-h-screen saisa-bg text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-yellow-500/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3"
          >
            <img src={iconLogo} alt="SA IS A MOVIE Icon" className="h-10 w-10" />
            <span className="text-xl font-bold">
              SA IS A <span className="saisa-text-red">MOVIE</span>
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center space-x-6"
          >
            <a href="#trending" className="hover:text-yellow-400 transition-colors">Trending</a>
            <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
            <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
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
            className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-yellow-400 rounded-full"
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
            className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-pink-500 rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <img 
            src={typographyLogo} 
            alt="SA IS A MOVIE" 
            className="max-w-4xl w-full h-auto mb-8 mx-auto"
          />
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
          <Button className="saisa-bg-red text-white text-lg px-8 py-4 rounded-2xl font-bold red-glow hover:scale-105 transition-all duration-300">
            <Play className="mr-2 h-5 w-5" />
            Read Latest Stories
          </Button>
          <Button variant="outline" className="border-yellow-400 text-yellow-400 text-lg px-8 py-4 rounded-2xl font-bold neon-glow hover:bg-yellow-400 hover:text-black transition-all duration-300">
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
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {trendingStories.map((story, index) => (
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
                    
                    {/* Comments Section for each story */}
                    <CommentsSection 
                      postId={story.id} 
                      postTitle={story.title}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20 bg-black">
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
                  className="flex-1 px-4 py-3 rounded-xl bg-black border border-yellow-500/30 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
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
      <footer className="saisa-bg-red text-center py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src={iconLogo} alt="SA IS A MOVIE Icon" className="h-8 w-8" />
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

