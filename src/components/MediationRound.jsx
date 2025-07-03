import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMediation } from '../contexts/MediationContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiUsers, FiArrowRight, FiPause, FiRefreshCw, FiCheck, FiAlertTriangle } = FiIcons;

const MEDIATION_PHASES = {
  ACKNOWLEDGMENT: 'acknowledgment',
  CLARIFICATION: 'clarification',
  RESOLUTION: 'resolution'
};

function MediationRound() {
  const navigate = useNavigate();
  const { state, dispatch } = useMediation();
  const [currentPhase, setCurrentPhase] = useState(MEDIATION_PHASES.ACKNOWLEDGMENT);
  const [currentParticipant, setCurrentParticipant] = useState(0);
  const [responses, setResponses] = useState({});
  const [resolutionProposals, setResolutionProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [escalationWarning, setEscalationWarning] = useState(false);
  const [pauseSession, setPauseSession] = useState(false);

  useEffect(() => {
    if (currentPhase === MEDIATION_PHASES.RESOLUTION) {
      generateResolutionProposals();
    }
  }, [currentPhase]);

  const generateResolutionProposals = () => {
    const snapshot = state.conflictSnapshot;
    if (!snapshot) return;

    const proposals = [
      {
        id: 1,
        title: "Structured Communication Plan",
        description: "Establish regular check-ins with agreed-upon communication guidelines",
        details: [
          "Weekly 30-minute conversations",
          "Use 'I' statements to express feelings",
          "Listen without interrupting",
          "Focus on solutions, not blame"
        ]
      },
      {
        id: 2,
        title: "Mutual Respect Agreement",
        description: "Create clear boundaries and expectations based on shared values",
        details: [
          `Honor shared values: ${snapshot.commonValues.join(', ')}`,
          "Respect each other's perspectives",
          "Acknowledge past hurts without dwelling",
          "Commit to moving forward constructively"
        ]
      },
      {
        id: 3,
        title: "Graduated Resolution Steps",
        description: "Start with small changes and build trust gradually",
        details: [
          "Begin with one specific area of improvement",
          "Check progress weekly",
          "Celebrate small wins together",
          "Address larger issues as trust rebuilds"
        ]
      }
    ];

    setResolutionProposals(proposals);
  };

  const handlePhaseComplete = () => {
    if (currentPhase === MEDIATION_PHASES.ACKNOWLEDGMENT) {
      setCurrentPhase(MEDIATION_PHASES.CLARIFICATION);
      setCurrentParticipant(0);
    } else if (currentPhase === MEDIATION_PHASES.CLARIFICATION) {
      setCurrentPhase(MEDIATION_PHASES.RESOLUTION);
    } else {
      // Resolution phase complete
      if (selectedProposal) {
        dispatch({
          type: 'SET_RESOLUTION_DRAFT',
          payload: selectedProposal
        });
        navigate('/resolution');
      }
    }
  };

  const handleResponse = (participantId, response) => {
    setResponses(prev => ({
      ...prev,
      [`${currentPhase}_${participantId}`]: response
    }));

    // Simple escalation detection
    const escalationKeywords = ['never', 'always', 'hate', 'stupid', 'idiot', 'shut up'];
    const hasEscalation = escalationKeywords.some(keyword => 
      response.toLowerCase().includes(keyword)
    );

    if (hasEscalation) {
      setEscalationWarning(true);
      setTimeout(() => setEscalationWarning(false), 5000);
    }

    // Move to next participant
    if (currentParticipant < state.participants.length - 1) {
      setCurrentParticipant(currentParticipant + 1);
    }
  };

  const handlePauseSession = () => {
    setPauseSession(true);
    dispatch({
      type: 'SET_ESCALATION',
      payload: {
        detected: true,
        reason: 'Heightened emotions detected - session paused for cooling down'
      }
    });
  };

  const handleResumeSession = () => {
    setPauseSession(false);
    dispatch({
      type: 'SET_ESCALATION',
      payload: {
        detected: false,
        reason: null
      }
    });
  };

  const getPhaseInstructions = () => {
    switch (currentPhase) {
      case MEDIATION_PHASES.ACKNOWLEDGMENT:
        return {
          title: "Acknowledgment Phase",
          instruction: "Let's start by acknowledging each other. Please reflect on what you heard from the other person.",
          prompt: "What did you hear from their perspective? What can you acknowledge about their experience?"
        };
      case MEDIATION_PHASES.CLARIFICATION:
        return {
          title: "Clarification Phase",
          instruction: "Now, let's clarify any misunderstandings.",
          prompt: "Is there anything you'd like to ask or explain? What would help the other person understand your perspective better?"
        };
      case MEDIATION_PHASES.RESOLUTION:
        return {
          title: "Resolution Proposals",
          instruction: "Based on what I've heard, here are some neutral ideas for moving forward.",
          prompt: "Which approach feels right to you? Feel free to suggest modifications or your own ideas."
        };
      default:
        return {};
    }
  };

  const phaseInstructions = getPhaseInstructions();

  if (pauseSession) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-orange-500 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiPause} className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-calm-800 mb-4">
            Session Paused
          </h1>
          <p className="text-lg text-calm-600 mb-8">
            I'm sensing some heightened emotions. Let's take a brief pause to cool down. 
            We can resume when you're ready, or you can return to this session later.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleResumeSession}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Resume Session
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-calm-400 text-white rounded-xl font-semibold hover:bg-calm-500 transition-colors"
            >
              End Session
            </button>
          </div>
        </div>
      </motion.div>
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
            <SafeIcon icon={FiUsers} className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-calm-800 mb-2">
            Mediation Round
          </h1>
          <p className="text-lg text-calm-600">
            Structured dialogue for understanding and resolution
          </p>
        </motion.div>

        {escalationWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-100 border border-orange-400 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-semibold text-orange-800">Emotional Intensity Detected</p>
              <p className="text-orange-700 text-sm">
                Let's take a moment to breathe and refocus on understanding each other.
              </p>
            </div>
            <button
              onClick={handlePauseSession}
              className="ml-auto px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
            >
              Pause Session
            </button>
          </motion.div>
        )}

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {Object.values(MEDIATION_PHASES).map((phase, index) => (
              <div key={phase} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentPhase === phase
                      ? 'bg-primary-600 text-white'
                      : Object.values(MEDIATION_PHASES).indexOf(currentPhase) > index
                      ? 'bg-green-500 text-white'
                      : 'bg-calm-300 text-calm-600'
                  }`}
                >
                  {Object.values(MEDIATION_PHASES).indexOf(currentPhase) > index ? (
                    <SafeIcon icon={FiCheck} className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < Object.values(MEDIATION_PHASES).length - 1 && (
                  <div className="w-12 h-0.5 bg-calm-300 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-semibold text-calm-800 mb-4">
            {phaseInstructions.title}
          </h2>
          
          <div className="bg-primary-50 rounded-xl p-6 mb-6">
            <p className="text-calm-700 leading-relaxed italic">
              "{phaseInstructions.instruction}"
            </p>
          </div>

          {currentPhase === MEDIATION_PHASES.RESOLUTION ? (
            <div className="space-y-4">
              <p className="text-calm-700 mb-4">{phaseInstructions.prompt}</p>
              
              <div className="grid gap-4">
                {resolutionProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      selectedProposal?.id === proposal.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-calm-200 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedProposal(proposal)}
                  >
                    <h3 className="font-semibold text-calm-800 mb-2">{proposal.title}</h3>
                    <p className="text-calm-600 text-sm mb-3">{proposal.description}</p>
                    <ul className="space-y-1">
                      {proposal.details.map((detail, i) => (
                        <li key={i} className="text-calm-600 text-sm flex items-start gap-2">
                          <span className="text-primary-500 mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-calm-700">{phaseInstructions.prompt}</p>
              
              {state.participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className={`border rounded-xl p-4 ${
                    index === currentParticipant
                      ? 'border-primary-500 bg-primary-50'
                      : responses[`${currentPhase}_${participant.id}`]
                      ? 'border-green-500 bg-green-50'
                      : 'border-calm-200'
                  }`}
                >
                  <h3 className="font-semibold text-calm-800 mb-3">
                    {participant.displayName}
                  </h3>
                  
                  {responses[`${currentPhase}_${participant.id}`] ? (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-calm-700">{responses[`${currentPhase}_${participant.id}`]}</p>
                    </div>
                  ) : index === currentParticipant ? (
                    <div className="space-y-3">
                      <textarea
                        placeholder="Share your thoughts..."
                        className="w-full p-3 border border-calm-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                        rows="3"
                        id={`response-${participant.id}`}
                      />
                      <button
                        onClick={() => {
                          const textarea = document.getElementById(`response-${participant.id}`);
                          if (textarea.value.trim()) {
                            handleResponse(participant.id, textarea.value.trim());
                          }
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Submit Response
                      </button>
                    </div>
                  ) : (
                    <p className="text-calm-500 italic">Waiting for their turn...</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={handlePhaseComplete}
            disabled={
              currentPhase === MEDIATION_PHASES.RESOLUTION 
                ? !selectedProposal 
                : !state.participants.every(p => responses[`${currentPhase}_${p.id}`])
            }
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-3 mx-auto shadow-lg ${
              (currentPhase === MEDIATION_PHASES.RESOLUTION 
                ? selectedProposal 
                : state.participants.every(p => responses[`${currentPhase}_${p.id}`]))
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-xl'
                : 'bg-calm-400 cursor-not-allowed'
            }`}
          >
            {currentPhase === MEDIATION_PHASES.RESOLUTION ? (
              <>
                <SafeIcon icon={FiCheck} className="w-5 h-5" />
                Create Peace Pact
              </>
            ) : (
              <>
                Continue to Next Phase
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default MediationRound;