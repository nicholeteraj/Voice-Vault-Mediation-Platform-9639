import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMediation } from '../contexts/MediationContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBrain, FiHeart, FiTarget, FiArrowRight, FiCheck, FiEdit } = FiIcons;

function CognitiveAlignment() {
  const navigate = useNavigate();
  const { state, dispatch } = useMediation();
  const [summaries, setSummaries] = useState([]);
  const [conflictSnapshot, setConflictSnapshot] = useState(null);
  const [approved, setApproved] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    generateSummaries();
  }, [state.voiceTranscripts, state.emotionalAnalysis]);

  const generateSummaries = () => {
    const participantSummaries = state.participants.map(participant => {
      const transcript = state.voiceTranscripts.find(t => t.participantId === participant.id);
      const emotion = state.emotionalAnalysis.find(e => e.participantId === participant.id);
      
      if (!transcript) return null;

      return {
        participantId: participant.id,
        participantName: participant.displayName,
        painPoints: extractPainPoints(transcript.transcript),
        values: extractValues(transcript.transcript),
        needs: extractNeeds(transcript.transcript),
        dominantEmotion: emotion?.dominant || 'neutral',
        emotionIntensity: emotion?.intensity || 0,
        rawTranscript: transcript.transcript
      };
    }).filter(Boolean);

    setSummaries(participantSummaries);
    generateConflictSnapshot(participantSummaries);
  };

  const extractPainPoints = (text) => {
    const painIndicators = ['hurt', 'frustrated', 'angry', 'disappointed', 'upset', 'bothered', 'annoyed'];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    return sentences.filter(sentence => 
      painIndicators.some(indicator => 
        sentence.toLowerCase().includes(indicator)
      )
    ).slice(0, 3);
  };

  const extractValues = (text) => {
    const valueKeywords = {
      'respect': ['respect', 'dignity', 'honor'],
      'trust': ['trust', 'honesty', 'reliability'],
      'communication': ['communication', 'listening', 'understanding'],
      'fairness': ['fair', 'equal', 'just'],
      'support': ['support', 'help', 'care'],
      'autonomy': ['independence', 'freedom', 'choice']
    };

    const foundValues = [];
    const lowerText = text.toLowerCase();
    
    Object.keys(valueKeywords).forEach(value => {
      if (valueKeywords[value].some(keyword => lowerText.includes(keyword))) {
        foundValues.push(value);
      }
    });

    return foundValues.slice(0, 3);
  };

  const extractNeeds = (text) => {
    const needPatterns = [
      /I need/gi,
      /I want/gi,
      /I require/gi,
      /I wish/gi,
      /I hope/gi
    ];

    const needs = [];
    needPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        const sentences = text.split(/[.!?]+/);
        sentences.forEach(sentence => {
          if (pattern.test(sentence)) {
            needs.push(sentence.trim());
          }
        });
      }
    });

    return needs.slice(0, 3);
  };

  const generateConflictSnapshot = (summaries) => {
    const commonValues = findCommonValues(summaries);
    const conflictingNeeds = findConflictingNeeds(summaries);
    const emotionalPatterns = analyzeEmotionalPatterns(summaries);

    const snapshot = {
      commonValues,
      conflictingNeeds,
      emotionalPatterns,
      keyMisunderstandings: identifyMisunderstandings(summaries),
      resolutionOpportunities: identifyOpportunities(summaries, commonValues)
    };

    setConflictSnapshot(snapshot);
  };

  const findCommonValues = (summaries) => {
    const allValues = summaries.flatMap(s => s.values);
    const valueCount = {};
    
    allValues.forEach(value => {
      valueCount[value] = (valueCount[value] || 0) + 1;
    });

    return Object.keys(valueCount).filter(value => valueCount[value] > 1);
  };

  const findConflictingNeeds = (summaries) => {
    return summaries.map(summary => ({
      participant: summary.participantName,
      needs: summary.needs
    }));
  };

  const analyzeEmotionalPatterns = (summaries) => {
    const emotions = summaries.map(s => s.dominantEmotion);
    const highIntensity = summaries.filter(s => s.emotionIntensity > 0.5);
    
    return {
      dominantEmotions: emotions,
      highIntensityParticipants: highIntensity.map(s => s.participantName),
      overallTone: emotions.includes('anger') ? 'tense' : emotions.includes('sadness') ? 'hurt' : 'neutral'
    };
  };

  const identifyMisunderstandings = (summaries) => {
    return [
      "Different perspectives on the same events",
      "Unmet expectations about communication",
      "Assumptions about intentions"
    ];
  };

  const identifyOpportunities = (summaries, commonValues) => {
    const opportunities = [];
    
    if (commonValues.length > 0) {
      opportunities.push(`Shared values: ${commonValues.join(', ')}`);
    }
    
    opportunities.push("Willingness to engage in mediation");
    opportunities.push("Desire for resolution");
    
    return opportunities;
  };

  const handleApprove = () => {
    dispatch({ type: 'SET_CONFLICT_SNAPSHOT', payload: conflictSnapshot });
    setApproved(true);
    setTimeout(() => navigate('/mediation'), 1000);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index, newSummary) => {
    const updatedSummaries = [...summaries];
    updatedSummaries[index] = { ...updatedSummaries[index], ...newSummary };
    setSummaries(updatedSummaries);
    setEditingIndex(-1);
    generateConflictSnapshot(updatedSummaries);
  };

  if (!summaries.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 grace-avatar rounded-full flex items-center justify-center">
            <SafeIcon icon={FiBrain} className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-calm-600">Analyzing your stories...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 grace-avatar rounded-full flex items-center justify-center">
            <SafeIcon icon={FiBrain} className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-calm-800 mb-2">
            Cognitive Alignment
          </h1>
          <p className="text-lg text-calm-600">
            Let me reflect what I've understood from each of you
          </p>
        </motion.div>

        <div className="space-y-6 mb-8">
          {summaries.map((summary, index) => (
            <motion.div
              key={summary.participantId}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiHeart} className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-calm-800">
                    {summary.participantName}
                  </h2>
                </div>
                <button
                  onClick={() => handleEdit(index)}
                  className="p-2 text-calm-500 hover:text-primary-600 transition-colors"
                >
                  <SafeIcon icon={FiEdit} className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-calm-800 mb-2">Pain Points</h3>
                  <ul className="text-calm-600 text-sm space-y-1">
                    {summary.painPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-calm-800 mb-2">Values</h3>
                  <div className="flex flex-wrap gap-2">
                    {summary.values.map((value, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-calm-800 mb-2">Needs</h3>
                  <ul className="text-calm-600 text-sm space-y-1">
                    {summary.needs.map((need, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{need}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-calm-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-calm-600">Emotional tone:</span>
                  <span className={`font-semibold ${
                    summary.dominantEmotion === 'anger' ? 'text-red-600' :
                    summary.dominantEmotion === 'sadness' ? 'text-blue-600' :
                    summary.dominantEmotion === 'fear' ? 'text-orange-600' :
                    summary.dominantEmotion === 'joy' ? 'text-green-600' :
                    'text-calm-600'
                  }`}>
                    {summary.dominantEmotion}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {conflictSnapshot && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <SafeIcon icon={FiTarget} className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-calm-800">
                Conflict Snapshot
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-calm-800 mb-2">Common Values</h3>
                <div className="space-y-2">
                  {conflictSnapshot.commonValues.map((value, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                      <span className="text-calm-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-calm-800 mb-2">Resolution Opportunities</h3>
                <div className="space-y-2">
                  {conflictSnapshot.resolutionOpportunities.map((opportunity, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <SafeIcon icon={FiTarget} className="w-4 h-4 text-primary-500" />
                      <span className="text-calm-700">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-calm-600 mb-6">
            Do you both agree with this reflection? If not, please use the edit buttons to clarify.
          </p>
          
          <button
            onClick={handleApprove}
            disabled={approved}
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-3 mx-auto shadow-lg ${
              approved
                ? 'bg-green-500'
                : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-xl'
            }`}
          >
            <SafeIcon icon={FiCheck} className="w-5 h-5" />
            {approved ? 'Approved - Moving to Mediation' : 'This Reflection is Accurate'}
            {!approved && <SafeIcon icon={FiArrowRight} className="w-5 h-5" />}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CognitiveAlignment;