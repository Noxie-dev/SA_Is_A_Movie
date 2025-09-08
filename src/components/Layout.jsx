import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SALogo from './SALogo';
import FooterLogo from './FooterLogo';
import AuthButton from './AuthButton';

const Layout = ({ children, showParticleBackground = false }) => {
  return (
    <div className="min-h-screen saisa-bg text-white flex flex-col">
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
            <Link to="/trending" className="hover:text-[#FFA500] transition-colors">Trending</Link>
            <Link to="/about" className="hover:text-[#FFA500] transition-colors">About</Link>
            <Link to="/contact" className="hover:text-[#FFA500] transition-colors">Contact</Link>
            <AuthButton />
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#FF66B2] text-center py-8 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <FooterLogo className="h-8 w-8" />
              <span className="text-white font-bold text-lg">
                SA IS A MOVIE
              </span>
            </div>
            
            <div className="text-white/80 text-sm">
              © {new Date().getFullYear()} SA IS A MOVIE. All rights reserved.
            </div>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-white/60 hover:text-white transition-colors">Terms</Link>
              <Link to="/contact" className="text-white/60 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;