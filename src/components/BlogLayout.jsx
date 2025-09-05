import { Link } from 'react-router-dom';
import iconLogo from '../assets/saisa_movie_icon_logo.png';
import AuthButton from './AuthButton';

const BlogLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src={iconLogo} alt="SA IS A MOVIE Icon" className="h-8 w-8" />
            <span className="text-lg font-bold text-gray-900">
              SA IS A <span className="text-red-600">MOVIE</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
              Blog
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src={iconLogo} alt="SA IS A MOVIE Icon" className="h-6 w-6" />
              <span className="text-white font-bold">
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
};

export default BlogLayout;
