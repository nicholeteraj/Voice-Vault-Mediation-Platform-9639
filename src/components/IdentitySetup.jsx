import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMediation } from '../contexts/MediationContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiUsers, FiArrowRight, FiPlus, FiMinus } = FiIcons;

function IdentitySetup() {
  const navigate = useNavigate();
  const { dispatch } = useMediation();
  const [participantCount, setParticipantCount] = useState(2);
  const [participants, setParticipants] = useState([
    { id: 1, alias: '', preferredName: '' },
    { id: 2, alias: '', preferredName: '' }
  ]);

  const handleParticipantCountChange = (newCount) => {
    setParticipantCount(newCount);
    const newParticipants = Array.from({ length: newCount }, (_, i) => ({
      id: i + 1,
      alias: participants[i]?.alias || '',
      preferredName: participants[i]?.preferredName || ''
    }));
    setParticipants(newParticipants);
  };

  const handleParticipantChange = (id, field, value) => {
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleProceed = () => {
    const validParticipants = participants.map(p => ({
      ...p,
      displayName: p.alias || p.preferredName || `Participant ${p.id}`
    }));

    validParticipants.forEach(participant => {
      dispatch({ type: 'ADD_PARTICIPANT', payload: participant });
    });

    navigate('/voice-intake');
  };

  const canProceed = participants.every(p => p.alias || p.preferredName);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 grace-avatar rounded-full flex items-center justify-center">
            <SafeIcon icon={FiUsers} className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-calm-800 mb-2">
            Let's Set Up Your Session
          </h1>
          <p className="text-lg text-calm-600 leading-relaxed">
            To create a comfortable distance, you may choose an alias or role label for this session. 
            This helps reduce emotional escalation and creates a safe space for dialogue.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
        >
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-calm-800 mb-4">
              Number of Participants
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleParticipantCountChange(Math.max(2, participantCount - 1))}
                disabled={participantCount <= 2}
                className="w-10 h-10 rounded-full bg-calm-200 hover:bg-calm-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <SafeIcon icon={FiMinus} className="w-5 h-5" />
              </button>
              <span className="text-2xl font-semibold text-calm-800 w-12 text-center">
                {participantCount}
              </span>
              <button
                onClick={() => handleParticipantCountChange(Math.min(6, participantCount + 1))}
                disabled={participantCount >= 6}
                className="w-10 h-10 rounded-full bg-calm-200 hover:bg-calm-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-calm-800">
              Participant Identities
            </h2>
            
            {participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="border border-calm-200 rounded-xl p-6 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiUser} className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-calm-800">
                    Participant {participant.id}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-calm-700 mb-2">
                      Alias or Role Label (Recommended)
                    </label>
                    <input
                      type="text"
                      value={participant.alias}
                      onChange={(e) => handleParticipantChange(participant.id, 'alias', e.target.value)}
                      placeholder="e.g., Partner A, Friend 1, Team Member, etc."
                      className="w-full px-4 py-3 rounded-lg border border-calm-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-calm-700 mb-2">
                      Or Your Preferred Name
                    </label>
                    <input
                      type="text"
                      value={participant.preferredName}
                      onChange={(e) => handleParticipantChange(participant.id, 'preferredName', e.target.value)}
                      placeholder="Your real name if you prefer"
                      className="w-full px-4 py-3 rounded-lg border border-calm-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={handleProceed}
            disabled={!canProceed}
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-3 mx-auto shadow-lg ${
              canProceed
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-xl'
                : 'bg-calm-400 cursor-not-allowed'
            }`}
          >
            Continue to Voice Intake
            <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
          </button>
          
          {!canProceed && (
            <p className="text-calm-500 text-sm mt-4">
              Please provide either an alias or preferred name for each participant.
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default IdentitySetup;