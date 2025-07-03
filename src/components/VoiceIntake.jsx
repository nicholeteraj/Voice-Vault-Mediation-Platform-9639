import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMediation } from '../contexts/MediationContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const { FiMic, FiMicOff, FiHeart, FiArrowRight, FiUser, FiCheck, FiEdit2, FiRefreshCw } = FiIcons;

function VoiceIntake() {
  const navigate = useNavigate();
  const { state, dispatch } = useMediation();
  const [currentParticipant, setCurrentParticipant] = useState(0);
  const [completedParticipants, setCompletedParticipants] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

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

  useEffect(() => {
    if (!isSupported) {
      setShowTextInput(true);
    }
  }, [isSupported]);

  const analyzeEmotion = (text) => {
    const emotions = {
      anger: ['angry', 'furious', 'mad', 'hate', 'frustrated', 'annoyed', 'pissed', 'outraged'],
      sadness: ['sad', 'hurt', 'disappointed', 'broken', 'devastated', 'upset', 'depressed', 'heartbroken'],
      fear: ['scared', 'worried', 'anxious', 'nervous', 'afraid', 'concerned', 'terrified', 'panicked'],
      joy: ['happy', 'glad', 'pleased', 'grateful', 'thankful', 'hopeful', 'excited', 'delighted'],
      neutral: []
    };

    const lowerText = text.toLowerCase();
    const emotionScores = {};

    Object.keys(emotions).forEach(emotion => {
      emotionScores[emotion] = emotions[emotion].filter(word => 
        lowerText.includes(word)
      ).length;
    });

    const dominantEmotion = Object.keys(emotionScores).reduce((a, b) => 
      emotionScores[a] > emotionScores[b] ? a : b
    );

    return {
      dominant: dominantEmotion,
      scores: emotionScores,
      intensity: Math.max(...Object.values(emotionScores)) / 10
    };
  };

  const handleStartRecording = async () => {
    if (!isSupported) {
      setShowTextInput(true);
      return;
    }

    resetTranscript();
    setTextInput('');
    await startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleComplete = () => {
    const story = transcript.trim() || textInput.trim();
    
    if (!story) {
      setShowTextInput(true);
      return;
    }

    const participant = state.participants[currentParticipant];
    const emotionalAnalysis = analyzeEmotion(story);

    dispatch({
      type: 'ADD_VOICE_TRANSCRIPT',
      payload: {
        participantId: participant.id,
        participantName: participant.displayName,
        transcript: story,
        timestamp: new Date().toISOString()
      }
    });

    dispatch({
      type: 'ADD_EMOTIONAL_ANALYSIS',
      payload: {
        participantId: participant.id,
        participantName: participant.displayName,
        ...emotionalAnalysis,
        timestamp: new Date().toISOString()
      }
    });

    setCompletedParticipants([...completedParticipants, currentParticipant]);

    if (currentParticipant < state.participants.length - 1) {
      setCurrentParticipant(currentParticipant + 1);
      resetTranscript();
      setTextInput('');
      setShowTextInput(false);
    } else {
      navigate('/alignment');
    }
  };

  const handleSkipToNext = () => {
    if (currentParticipant < state.participants.length - 1) {
      setCurrentParticipant(currentParticipant + 1);
      resetTranscript();
      setTextInput('');
      setShowTextInput(false);
    } else {
      navigate('/alignment');
    }
  };

  const currentParticipantData = state.participants[currentParticipant];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 grace-avatar rounded-full flex items-center justify-center">
            <SafeIcon icon={FiHeart} className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-calm-800 mb-2">
            Grace is Listening
          </h1>
          <p className="text-lg text-calm-600">
            Share your story in a safe, private space
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SafeIcon icon={FiUser} className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-calm-800">
                {currentParticipantData?.displayName}
              </h2>
            </div>
            <div className="text-sm text-calm-500">
              {currentParticipant + 1} of {state.participants.length}
            </div>
          </div>

          <div className="bg-primary-50 rounded-xl p-6 mb-6">
            <p className="text-calm-700 leading-relaxed italic">
              "I'm listening. Please tell me your version of the story. What hurt you? What matters most to you in this situation? Take your time."
            </p>
          </div>

          <div className="space-y-6">
            {/* Speech Recognition Status */}
            {!isInitialized && isSupported && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-calm-200 rounded-full flex items-center justify-center animate-pulse">
                  <SafeIcon icon={FiRefreshCw} className="w-8 h-8 text-calm-600 animate-spin" />
                </div>
                <p className="text-calm-600">Initializing voice recognition...</p>
              </div>
            )}

            {/* Voice Recording Controls */}
            {isSupported && isInitialized && !showTextInput && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isListening ? handleStopRecording : handleStartRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-semibold shadow-lg transition-all duration-200 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 recording-indicator'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  <SafeIcon icon={isListening ? FiMicOff : FiMic} className="w-8 h-8" />
                </motion.button>
                
                <p className="text-calm-600 mt-3">
                  {isListening ? 'Recording... Click to stop' : 'Click to start recording'}
                </p>

                {!isListening && (
                  <button
                    onClick={() => setShowTextInput(true)}
                    className="mt-4 px-4 py-2 text-sm text-primary-600 hover:text-primary-700 underline transition-colors"
                  >
                    Or type your story instead
                  </button>
                )}
              </div>
            )}

            {/* Transcript Display */}
            {transcript && (
              <div className="bg-calm-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-calm-800">Your Story:</h3>
                  <button
                    onClick={() => setShowTextInput(true)}
                    className="flex items-center gap-1 px-2 py-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <p className="text-calm-700 leading-relaxed">{transcript}</p>
              </div>
            )}

            {/* Text Input */}
            {showTextInput && (
              <div className="space-y-4">
                <h3 className="font-semibold text-calm-800">
                  {isSupported ? "Type or edit your story:" : "Please type your story:"}
                </h3>
                <textarea
                  value={textInput || transcript}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full h-32 p-4 border-2 border-calm-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors resize-none"
                  placeholder="Share your story here. Take your time - this is a safe space..."
                />
                
                {isSupported && isInitialized && (
                  <button
                    onClick={() => setShowTextInput(false)}
                    className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 underline transition-colors"
                  >
                    Try voice recording instead
                  </button>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-orange-800 font-semibold mb-2">Voice Recording Issue</p>
                <p className="text-orange-700 text-sm mb-3">
                  {error === 'not_supported' && "Your browser doesn't support voice recording."}
                  {error === 'microphone_permission_denied' && "Microphone access was denied."}
                  {error === 'no_speech_detected' && "No speech was detected. Please try again."}
                  {error === 'timeout' && "Recording timed out. Please try again."}
                  {!['not_supported', 'microphone_permission_denied', 'no_speech_detected', 'timeout'].includes(error) && "There was an issue with voice recording."}
                </p>
                <button
                  onClick={() => setShowTextInput(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  Use Text Input Instead
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleSkipToNext}
                className="px-6 py-3 rounded-xl font-semibold text-calm-600 bg-white hover:bg-calm-50 transition-colors border border-calm-300"
              >
                Skip for Now
              </button>
              
              <button
                onClick={handleComplete}
                disabled={!transcript.trim() && !textInput.trim()}
                className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
                  (transcript.trim() || textInput.trim())
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-xl'
                    : 'bg-calm-400 cursor-not-allowed'
                }`}
              >
                <SafeIcon icon={FiCheck} className="w-5 h-5" />
                {currentParticipant < state.participants.length - 1 ? 'Next Participant' : 'Complete Intake'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-2"
        >
          {state.participants.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                completedParticipants.includes(index)
                  ? 'bg-green-500'
                  : index === currentParticipant
                  ? 'bg-primary-600'
                  : 'bg-calm-300'
              }`}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default VoiceIntake;