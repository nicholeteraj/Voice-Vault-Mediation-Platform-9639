import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const { FiMic, FiMicOff, FiEdit, FiCheck, FiAlertCircle, FiHelpCircle, FiShield, FiHeart, FiRefreshCw } = FiIcons;

function VoiceStoryInput({ onStorySubmitted, participantName = "User" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [showSupport, setShowSupport] = useState(false);
  const [hasStartedRecording, setHasStartedRecording] = useState(false);

  const {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    updateTranscript,
    isInitialized
  } = useSpeechRecognition();

  // Handle speech recognition errors
  useEffect(() => {
    if (error) {
      setHasStartedRecording(false);
      
      // Show text input for certain errors
      if (['not_supported', 'microphone_permission_denied', 'microphone_access_denied'].includes(error)) {
        setShowTextInput(true);
      }
    }
  }, [error]);

  // Auto-show text input if speech recognition is not supported
  useEffect(() => {
    if (!isSupported) {
      setShowTextInput(true);
    }
  }, [isSupported]);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'not_supported':
        return "Your browser doesn't support voice recording. Please use the text input below.";
      case 'microphone_permission_denied':
      case 'microphone_access_denied':
        return "Microphone access was denied. Please enable microphone permissions in your browser settings, or use the text input below.";
      case 'no_speech_detected':
        return "No speech was detected. Please try speaking again or use the text input below.";
      case 'no_microphone_found':
        return "No microphone was found. Please check your microphone connection or use the text input below.";
      case 'network_error':
        return "Network error occurred. Please check your connection and try again.";
      case 'timeout':
        return "Recording timed out after 30 seconds. Please try again or use the text input below.";
      case 'recognition_aborted':
        return "Recording was interrupted. Please try again.";
      default:
        return "Voice recording encountered an issue. Please try again or use the text input below.";
    }
  };

  const handleStartRecording = async () => {
    if (!isSupported) {
      setShowTextInput(true);
      return;
    }

    setHasStartedRecording(true);
    const success = await startListening();
    
    if (!success) {
      setShowTextInput(true);
    }
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleEditTranscript = () => {
    setIsEditing(true);
    setEditedTranscript(transcript);
  };

  const saveEditedTranscript = () => {
    // Update the transcript with edited content
    updateTranscript(editedTranscript);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedTranscript('');
  };

  const handleSubmit = () => {
    const story = transcript.trim() || textInput.trim();
    
    if (!story) {
      setShowSupport(true);
      return;
    }

    setConfirmationMessage("Thank you, I have received your story.");
    
    // Clear inputs after successful submission
    setTimeout(() => {
      resetTranscript();
      setTextInput('');
      setShowTextInput(false);
      setIsEditing(false);
      setHasStartedRecording(false);
      
      // Call the parent callback with the story
      if (onStorySubmitted) {
        onStorySubmitted(story, participantName);
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    resetTranscript();
    setTextInput('');
    setShowTextInput(false);
    setShowSupport(false);
    setHasStartedRecording(false);
  };

  const handleShowTextInput = () => {
    setShowTextInput(true);
    setShowSupport(false);
  };

  const currentContent = isEditing ? editedTranscript : transcript;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Main Prompt */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
          <SafeIcon icon={FiHeart} className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-calm-800 mb-4">
          {participantName}, I'm here to listen
        </h2>
        <div className="bg-primary-50 rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-calm-700 leading-relaxed text-lg">
            "Please tell me your version of the story. What hurt you? What matters most to you in this situation? 
            You may speak your answer, or type it below."
          </p>
        </div>
      </motion.div>

      {/* Voice Recording Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-6"
      >
        {/* Speech Recognition Status */}
        {!isInitialized && isSupported && (
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-calm-200 rounded-full flex items-center justify-center animate-pulse">
              <SafeIcon icon={FiRefreshCw} className="w-8 h-8 text-calm-600 animate-spin" />
            </div>
            <p className="text-calm-600">Initializing voice recognition...</p>
          </div>
        )}

        {/* Voice Recording Controls */}
        {isSupported && isInitialized && !showTextInput && (
          <div className="text-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isListening ? handleStopRecording : handleStartRecording}
              disabled={isEditing}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold shadow-lg transition-all duration-200 mx-auto mb-4 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              <SafeIcon 
                icon={isListening ? FiMicOff : FiMic} 
                className="w-8 h-8" 
              />
            </motion.button>
            
            <p className="text-calm-600 mb-2">
              {isListening ? 'Recording... Click to stop' : 'Click to start recording your story'}
            </p>
            
            {isListening && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-calm-500"
              >
                Speak clearly and take your time. I'm listening with care.
              </motion.p>
            )}

            {/* Alternative text input option */}
            {!isListening && !hasStartedRecording && (
              <button
                onClick={handleShowTextInput}
                className="mt-4 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 underline transition-colors"
              >
                Or type your story instead
              </button>
            )}
          </div>
        )}

        {/* Transcript Display */}
        <AnimatePresence>
          {transcript && !isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-calm-800">Your Story:</h3>
                <button
                  onClick={handleEditTranscript}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  Edit
                </button>
              </div>
              <div className="bg-calm-50 rounded-lg p-4 border-2 border-calm-200">
                <p className="text-calm-700 leading-relaxed whitespace-pre-wrap">
                  {transcript}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Transcript */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <h3 className="font-semibold text-calm-800 mb-2">Edit Your Story:</h3>
              <textarea
                value={editedTranscript}
                onChange={(e) => setEditedTranscript(e.target.value)}
                className="w-full h-32 p-4 border-2 border-primary-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors resize-none"
                placeholder="Edit your story here..."
                aria-label="Edit your story"
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={saveEditedTranscript}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <SafeIcon icon={FiCheck} className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-calm-400 text-white rounded-lg hover:bg-calm-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Input Fallback */}
        <AnimatePresence>
          {showTextInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <h3 className="font-semibold text-calm-800 mb-3">
                {isSupported ? "Type your story here:" : "Please type your story:"}
              </h3>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-32 p-4 border-2 border-calm-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors resize-none"
                placeholder="Share your story here. Take your time - this is a safe space..."
                aria-label="Type your story"
              />
              
              {isSupported && isInitialized && (
                <button
                  onClick={() => setShowTextInput(false)}
                  className="mt-3 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 underline transition-colors"
                >
                  Try voice recording instead
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!transcript.trim() && !textInput.trim()}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-3 mx-auto shadow-lg ${
              (transcript.trim() || textInput.trim())
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-xl'
                : 'bg-calm-400 cursor-not-allowed'
            }`}
          >
            <SafeIcon icon={FiCheck} className="w-5 h-5" />
            Submit My Story
          </button>
        </div>
      </motion.div>

      {/* Confirmation Message */}
      <AnimatePresence>
        {confirmationMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6 text-center"
          >
            <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-semibold text-lg">{confirmationMessage}</p>
            <p className="text-green-700 text-sm mt-2">
              Moving to the next step...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-start gap-3">
              <SafeIcon icon={FiAlertCircle} className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-orange-800 font-semibold mb-2">Let's try a different approach</p>
                <p className="text-orange-700 leading-relaxed">{getErrorMessage(error)}</p>
                
                <div className="flex gap-3 mt-4">
                  {!showTextInput && isSupported && (
                    <button
                      onClick={handleTryAgain}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Try Recording Again
                    </button>
                  )}
                  <button
                    onClick={handleShowTextInput}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Use Text Input
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Section */}
      <AnimatePresence>
        {showSupport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-calm-50 border-2 border-calm-200 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-start gap-3">
              <SafeIcon icon={FiHelpCircle} className="w-6 h-6 text-calm-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-calm-800 mb-2">Please share your story</h3>
                <p className="text-calm-700 mb-3">
                  To help with mediation, I need to understand your perspective. You can:
                </p>
                <ul className="text-calm-700 space-y-1 mb-3">
                  <li>• Record your voice by clicking the microphone button</li>
                  <li>• Type your story in the text area</li>
                  <li>• Take your time - this is a safe, private space</li>
                </ul>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSupport(false)}
                    className="px-4 py-2 bg-calm-600 text-white rounded-lg hover:bg-calm-700 transition-colors text-sm"
                  >
                    I'll Try Again
                  </button>
                  <button
                    onClick={handleShowTextInput}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    Use Text Input
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <div className="bg-primary-50 rounded-xl p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <SafeIcon icon={FiShield} className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-primary-800">Privacy Protected</span>
          </div>
          <p className="text-primary-700 text-sm leading-relaxed">
            Your story is private and will not be stored after this session. This is a safe space.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default VoiceStoryInput;