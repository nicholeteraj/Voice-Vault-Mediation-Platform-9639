import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMediation } from '../contexts/MediationContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiStar, FiRefreshCw, FiHome, FiMessageCircle } = FiIcons;

function SessionComplete() {
  const navigate = useNavigate();
  const { dispatch } = useMediation();
  const [feedback, setFeedback] = useState({
    rating: 0,
    helpful: '',
    suggestions: '',
    wouldRecommend: null
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleRatingClick = (rating) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleSubmitFeedback = () => {
    // In a real app, this would send feedback to a server
    console.log('Feedback submitted:', feedback);
    setFeedbackSubmitted(true);
  };

  const handleNewSession = () => {
    dispatch({ type: 'RESET_SESSION' });
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <SafeIcon icon={FiHeart} className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-calm-800 mb-4">
            Session Complete
          </h1>
          <p className="text-xl text-calm-600 leading-relaxed">
            Congratulations on taking this important step toward resolution
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 grace-avatar rounded-full flex items-center justify-center">
              <SafeIcon icon={FiHeart} className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-calm-800 mb-3">
              Thank You from Grace
            </h2>
            <p className="text-calm-700 leading-relaxed max-w-2xl mx-auto">
              "It has been an honor to guide you through this mediation process. You've shown courage 
              in facing conflict directly and commitment to finding resolution. Remember that healing 
              takes time, and the work continues beyond this session. I believe in your ability to 
              build a better relationship moving forward."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-primary-50 rounded-xl">
              <SafeIcon icon={FiHeart} className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold text-calm-800 mb-1">Emotional Safety</h3>
              <p className="text-calm-600 text-sm">
                You maintained a safe space for dialogue
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <SafeIcon icon={FiMessageCircle} className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-calm-800 mb-1">Open Communication</h3>
              <p className="text-calm-600 text-sm">
                You shared your perspectives honestly
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <SafeIcon icon={FiStar} className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-calm-800 mb-1">Commitment</h3>
              <p className="text-calm-600 text-sm">
                You created a plan for moving forward
              </p>
            </div>
          </div>

          <div className="bg-calm-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-calm-800 mb-3">Important Reminders:</h3>
            <ul className="space-y-2 text-calm-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Your session data has been cleared for privacy - no information is stored</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Keep your Peace Pact accessible for future reference</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Consider scheduling a follow-up session in 30 days to assess progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Remember that professional counseling is available if needed</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {!feedbackSubmitted ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
          >
            <h2 className="text-xl font-semibold text-calm-800 mb-6">
              Help Us Improve
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-calm-700 font-medium mb-2">
                  How would you rate your experience with Grace?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      className={`w-8 h-8 transition-colors ${
                        star <= feedback.rating ? 'text-yellow-500' : 'text-calm-300'
                      }`}
                    >
                      <SafeIcon icon={FiStar} className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-calm-700 font-medium mb-2">
                  Did Grace support you effectively?
                </label>
                <textarea
                  value={feedback.helpful}
                  onChange={(e) => setFeedback(prev => ({ ...prev, helpful: e.target.value }))}
                  placeholder="What worked well? What could be improved?"
                  className="w-full p-3 border border-calm-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-calm-700 font-medium mb-2">
                  Any suggestions for improvement?
                </label>
                <textarea
                  value={feedback.suggestions}
                  onChange={(e) => setFeedback(prev => ({ ...prev, suggestions: e.target.value }))}
                  placeholder="How can we make the mediation experience better?"
                  className="w-full p-3 border border-calm-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                  rows="3"
                />
              </div>

              <button
                onClick={handleSubmitFeedback}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center"
          >
            <SafeIcon icon={FiHeart} className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 mb-2">Thank You!</h3>
            <p className="text-green-700">
              Your feedback helps us improve The Voice Vault™ for future users.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white text-calm-700 rounded-xl font-semibold hover:bg-calm-50 transition-colors border border-calm-300 flex items-center gap-2"
          >
            <SafeIcon icon={FiHome} className="w-5 h-5" />
            Return Home
          </button>
          <button
            onClick={handleNewSession}
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            Start New Session
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SessionComplete;