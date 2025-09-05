import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CommentForm from './CommentForm';
import CommentDisplay from './CommentDisplay';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const CommentsSection = ({ postId, postTitle }) => {
  const [comments, setComments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // In a real implementation, you would fetch comments from your CMS
  // For now, we'll use mock data or empty array
  useEffect(() => {
    // This would typically fetch from your CMS or API
    // const fetchComments = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await fetch(`/api/comments/${postId}`);
    //     const data = await response.json();
    //     setComments(data.filter(comment => comment.approved));
    //   } catch (error) {
    //     console.error('Error fetching comments:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchComments();
    
    // For demo purposes, we'll start with empty comments
    setComments([]);
  }, [postId]);

  const handleCommentSubmit = (result) => {
    // In a real implementation, you might want to refresh the comments
    // or show a success message
    console.log('Comment submitted:', result);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-12"
    >
      {/* Comments Toggle Header */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer bg-black/50 border-2 border-yellow-500/30 rounded-xl p-6 mb-6 hover:border-yellow-500/60 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 saisa-text-yellow" />
            <h2 className="text-2xl font-bold saisa-text-yellow">
              Comments & Reactions
            </h2>
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
              {comments.length}
            </span>
          </div>
          <div className="saisa-text-yellow">
            {isExpanded ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
        </div>
        <p className="text-gray-400 mt-2">
          {isExpanded 
            ? 'Click to collapse comments section' 
            : 'Click to join the conversation and see what others are saying'
          }
        </p>
      </motion.div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Comment Form */}
          <CommentForm
            postId={postId}
            postTitle={postTitle}
            onCommentSubmit={handleCommentSubmit}
          />

          {/* Comments Display */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading comments...</p>
            </div>
          ) : (
            <CommentDisplay comments={comments} />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CommentsSection;