import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, Heart, Laugh, Angry, Flame, Send, MessageCircle } from 'lucide-react';

const CommentForm = ({ postId, postTitle, onCommentSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
    reactions: {
      like: 0,
      love: 0,
      laugh: 0,
      angry: 0,
      fire: 0
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const reactionIcons = {
    like: { icon: ThumbsUp, label: 'Like', emoji: '👍' },
    love: { icon: Heart, label: 'Love', emoji: '❤️' },
    laugh: { icon: Laugh, label: 'Laugh', emoji: '😂' },
    angry: { icon: Angry, label: 'Angry', emoji: '😡' },
    fire: { icon: Flame, label: 'Fire', emoji: '🔥' }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReactionClick = (reactionType) => {
    setFormData(prev => ({
      ...prev,
      reactions: {
        ...prev.reactions,
        [reactionType]: prev.reactions[reactionType] === 0 ? 1 : 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/.netlify/functions/submit-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          postId,
          postTitle
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message
        });
        setFormData({
          name: '',
          email: '',
          comment: '',
          reactions: { like: 0, love: 0, laugh: 0, angry: 0, fire: 0 }
        });
        if (onCommentSubmit) {
          onCommentSubmit(result);
        }
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to submit comment'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-black/90 border-2 border-yellow-500/30 rounded-2xl backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl saisa-text-yellow flex items-center justify-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Drop Your Thoughts
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Share your reaction and join the conversation about "{postTitle}"
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reaction Buttons */}
            <div className="text-center">
              <p className="text-gray-300 mb-4 text-sm font-medium">How does this story make you feel?</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {Object.entries(reactionIcons).map(([key, { icon: Icon, label, emoji }]) => (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => handleReactionClick(key)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                      formData.reactions[key] > 0
                        ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{label}</span>
                    <span className="text-lg">{emoji}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
                Your Comment *
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none transition-colors resize-none"
                placeholder="Share your thoughts on this story..."
              />
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || !formData.comment.trim()}
                className="w-full saisa-bg-yellow text-black font-bold text-lg py-4 rounded-xl hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Submit Comment
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Status Message */}
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-center ${
                  submitStatus.type === 'success'
                    ? 'bg-green-900/50 border border-green-500 text-green-300'
                    : 'bg-red-900/50 border border-red-500 text-red-300'
                }`}
              >
                {submitStatus.message}
              </motion.div>
            )}

            {/* Info Text */}
            <div className="text-center text-gray-500 text-sm">
              <p>
                Your comment will be reviewed before being published. 
                We appreciate your engagement with SA IS A MOVIE! 🎬
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommentForm;