import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * OptimizedImage Component
 * Supports WebP/AVIF formats with fallbacks
 * Includes lazy loading and intersection observer
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  quality = 75,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Generate optimized image sources
  const generateImageSources = (originalSrc) => {
    const baseName = originalSrc.replace(/\.[^/.]+$/, '');
    const extension = originalSrc.split('.').pop();
    
    return {
      avif: `${baseName}.avif`,
      webp: `${baseName}.webp`,
      fallback: originalSrc
    };
  };

  const imageSources = generateImageSources(src);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
        {...props}
      >
        <span className="text-gray-400 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      {...props}
    >
      {/* Placeholder/Blur effect */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-700 animate-pulse"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: blurDataURL ? 'blur(10px)' : undefined
          }}
        />
      )}

      {/* Optimized Image with multiple formats */}
      {isInView && (
        <picture>
          {/* AVIF format (best compression) */}
          <source 
            srcSet={imageSources.avif} 
            type="image/avif"
            sizes={sizes}
          />
          
          {/* WebP format (good compression) */}
          <source 
            srcSet={imageSources.webp} 
            type="image/webp"
            sizes={sizes}
          />
          
          {/* Fallback to original format */}
          <motion.img
            src={imageSources.fallback}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={{ width, height }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </picture>
      )}

      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFA500]"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;