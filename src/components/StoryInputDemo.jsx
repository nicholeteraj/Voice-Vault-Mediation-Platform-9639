import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VoiceStoryInput from './VoiceStoryInput';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft, FiArrowRight, FiUsers, FiCheck, FiShield } = FiIcons;

function StoryInputDemo() {
  const [currentStep, setCurrentStep] = useState('input');
  const [submittedStory, setSubmittedStory] = useState('');
  const [participantName, setParticipantName] = useState('');

  const handleStorySubmitted = (story, participant) => {
    setSubmittedStory(story);
    setParticipantName(participant);
    setCurrentStep('complete');
  };

  const handleReset = () => {
    setCurrentStep('input');
    setSubmittedStory('');
    setParticipantName('');
  };

  const handleBackToVault = () => {
    // Navigate back to main app
    window.location.href = '/';
  };

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-calm-50 to-primary-50 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <SafeIcon icon={FiCheck} className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-calm-800 mb-2">
              Story Received Successfully
            </h1>
            <p className="text-lg text-calm-600">
              Thank you for sharing your experience with Grace
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
          >
            <h2 className="text-xl font-semibold text-calm-800 mb-4">
              What happens next?
            </h2>
            <div className="space-y-4 text-calm-700">
              <div className="flex items-start gap-3">
                <span className="text-primary-500 font-semibold">1.</span>
                <p>Grace will analyze your story with empathy and understanding</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-500 font-semibold">2.</span>
                <p>She'll identify key emotions, values, and needs from your perspective</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-500 font-semibold">3.</span>
                <p>This information will be used to create a neutral summary for mediation</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-500 font-semibold">4.</span>
                <p>You'll have a chance to review and edit before proceeding</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white text-calm-700 rounded-xl font-semibold hover:bg-calm-50 transition-colors border border-calm-300 flex items-center gap-2"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={handleBackToVault}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              Continue to Mediation
              <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <div className="bg-primary-50 rounded-xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <SafeIcon icon={FiShield} className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-primary-800">Privacy Reminder</span>
              </div>
              <p className="text-primary-700 text-sm leading-relaxed">
                Your story remains private and will be cleared after this session. 
                Only you and the other participants will see the mediation summary.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-50 to-primary-50">
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-calm-800">
              The Voice Vault™
            </h1>
          </div>
          <p className="text-calm-600">
            Voice Story Input - Trauma-Aware Mediation Platform
          </p>
        </motion.div>

        <VoiceStoryInput 
          onStorySubmitted={handleStorySubmitted}
          participantName="Participant"
        />
      </div>
    </div>
  );
}

export default StoryInputDemo;