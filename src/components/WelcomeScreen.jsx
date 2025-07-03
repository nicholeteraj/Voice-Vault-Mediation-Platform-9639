import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiShield, FiHeart, FiUsers, FiArrowRight } = FiIcons;

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 grace-avatar rounded-full flex items-center justify-center">
            <SafeIcon icon={FiShield} className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-calm-800 mb-4 text-shadow">
            The Voice Vault™
          </h1>
          <p className="text-xl text-calm-600 mb-2">
            AI-Guided Private Mediation Platform
          </p>
          <p className="text-lg text-calm-500">
            Powered by Grace, your empathetic AI mediator
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <SafeIcon icon={FiShield} className="w-8 h-8 text-primary-600 mb-3 mx-auto" />
            <h3 className="font-semibold text-calm-800 mb-2">Private & Secure</h3>
            <p className="text-calm-600 text-sm">
              No data stored. Complete privacy with Memory Shield protection.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <SafeIcon icon={FiHeart} className="w-8 h-8 text-primary-600 mb-3 mx-auto" />
            <h3 className="font-semibold text-calm-800 mb-2">Emotionally Aware</h3>
            <p className="text-calm-600 text-sm">
              Trauma-informed mediation with real-time emotional analysis.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-primary-600 mb-3 mx-auto" />
            <h3 className="font-semibold text-calm-800 mb-2">Neutral Ground</h3>
            <p className="text-calm-600 text-sm">
              Structured mediation rounds for fair, balanced resolution.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiHeart} className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-calm-800 mb-3">
            Meet Grace, Your AI Mediator
          </h2>
          <p className="text-calm-600 leading-relaxed max-w-2xl mx-auto">
            Grace operates under RAIN OS v3.0 with active GOD CODE directives, ensuring
            harmlessness, truth, helpfulness, fairness, privacy, and transparency in every
            interaction. She's designed to create a safe space for conflict resolution.
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/consent')}
          className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 mx-auto"
        >
          Begin Mediation Session
          <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default WelcomeScreen;