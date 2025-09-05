import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp, Heart, Laugh, Angry, Flame, User, Calendar } from 'lucide-react';

const CommentDisplay = ({ comments = [] }) => {
  const reactionIcons = {
    like: { icon: ThumbsUp, emoji: '👍', color: 'text-blue-400' },
    love: { icon: Heart, emoji: '❤️', color: 'text-red-400' },
    laugh: { icon: Laugh, emoji: '😂', color: 'text-yellow-400' },
    angry: { icon: Angry, emoji: '😡', color: 'text-orange-400' },
    fire: { icon: Flame, emoji: '🔥', color: 'text-red-500' }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (comments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-gray-500 text-lg">
          No comments yet. Be the first to share your thoughts! 💭
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold saisa-text-yellow mb-6">
        Community Reactions ({comments.length})
      </h3>
      
      {comments.map((comment, index) => (
        <motion.div
          key={comment.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-black/80 border border-gray-700 rounded-xl hover:border-yellow-500/50 transition-all duration-300">
            <CardContent className="p-6">
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{comment.name}</h4>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(comment.date)}
                    </div>
                  </div>
                </div>
                
                {/* Reactions Display */}
                {comment.reactions && (
                  <div className="flex gap-2">
                    {Object.entries(comment.reactions).map(([reaction, count]) => {
                      if (count > 0) {
                        const { emoji, color } = reactionIcons[reaction];
                        return (
                          <div
                            key={reaction}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800 ${color}`}
                          >
                            <span>{emoji}</span>
                            <span className="text-xs font-medium">{count}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {comment.body}
              </div>

              {/* Comment Footer */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {comment.email && `Email: ${comment.email}`}
                  </div>
                  {comment.approved && (
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Approved
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default CommentDisplay;