import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMediation } from '../contexts/MediationContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiShield, FiMic, FiCpu, FiCheck, FiX } = FiIcons;

function ConsentScreen() {
  const navigate = useNavigate();
  const { dispatch } = useMediation();
  const [consents, setConsents] = useState({
    emotionalSafety: false,
    voiceTranscription: false,
    aiArbitration: false,
    privacyPolicy: false
  });

  const handleConsentChange = (type) => {
    setConsents(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const allConsentsGiven = Object.values(consents).every(Boolean);

  const handleProceed = () => {
    if (allConsentsGiven) {
      dispatch({ type: 'SET_CONSENT', payload: true });
      navigate('/identity');
    }
  };

  const handleDecline = () => {
    navigate('/');
  };

  const consentItems = [
    {
      key: 'emotionalSafety',
      icon: FiHeart,
      title: 'Emotional Safety Code',
      description: 'I agree to engage respectfully and understand that Grace will monitor for escalation to maintain a safe environment.'
    },
    {
      key: 'voiceTranscription',
      icon: FiMic,
      title: 'Private Voice Transcription',
      description: 'I consent to voice-to-text transcription for this session only. No recordings are stored permanently.'
    },
    {
      key: 'aiArbitration',
      icon: FiCpu,
      title: 'Non-Human Arbitration Logic',
      description: 'I understand that Grace is an AI mediator operating under RAIN OS v3.0 with GOD CODE ethical directives.'
    },
    {
      key: 'privacyPolicy',
      icon: FiShield,
      title: 'Privacy & Memory Shield',
      description: 'I acknowledge that session data is not stored post-session and this is a temporary, private space.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-3xl mx-auto">
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
            Hello, I'm Grace
          </h1>
          <p className="text-lg text-calm-600 leading-relaxed max-w-2xl mx-auto">
            I'm your AI mediator for The Voice Vault™. I'm here to guide you through a safe, 
            private space to resolve conflict. Before we begin, I need your consent to proceed.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
        >
          <h2 className="text-xl font-semibold text-calm-800 mb-6">
            Consent Requirements
          </h2>
          
          <div className="space-y-4">
            {consentItems.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-calm-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <button
                    onClick={() => handleConsentChange(item.key)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      consents[item.key]
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'border-calm-300 hover:border-primary-400'
                    }`}
                  >
                    {consents[item.key] && <SafeIcon icon={FiCheck} className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <SafeIcon icon={item.icon} className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-calm-800">{item.title}</h3>
                  </div>
                  <p className="text-calm-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <button
            onClick={handleDecline}
            className="px-6 py-3 rounded-xl font-semibold text-calm-600 bg-white/80 hover:bg-white transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
            I Need to Think About This
          </button>
          <button
            onClick={handleProceed}
            disabled={!allConsentsGiven}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-2 shadow-lg ${
              allConsentsGiven
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-xl'
                : 'bg-calm-400 cursor-not-allowed'
            }`}
          >
            <SafeIcon icon={FiCheck} className="w-5 h-5" />
            I Agree to Proceed
          </button>
        </motion.div>

        {!allConsentsGiven && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-calm-500 text-sm mt-4"
          >
            Please review and accept all consent items to continue.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default ConsentScreen;