import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMediation } from '../contexts/MediationContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFileText, FiEdit, FiCheck, FiDownload, FiArrowRight } = FiIcons;

function ResolutionDraft() {
  const navigate = useNavigate();
  const { state, dispatch } = useMediation();
  const [peacePact, setPeacePact] = useState(generatePeacePact());
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [approved, setApproved] = useState(false);

  function generatePeacePact() {
    const today = new Date().toLocaleDateString();
    const participantNames = state.participants.map(p => p.displayName).join(' and ');
    const proposal = state.resolutionDraft;
    
    return {
      title: "Peace Pact Agreement",
      date: today,
      participants: participantNames,
      content: `
**Peace Pact Agreement**

Date: ${today}
Participants: ${participantNames}

**Our Commitment to Resolution**

We, ${participantNames}, have engaged in mediation with Grace, an AI mediator, to address our conflict and find a path forward. Through this process, we have:

✓ Shared our perspectives openly and honestly
✓ Listened to each other with empathy
✓ Identified our common values and shared goals
✓ Acknowledged the pain and misunderstandings between us

**Our Agreed Resolution: ${proposal?.title}**

${proposal?.description}

**Specific Actions We Will Take:**

${proposal?.details.map(detail => `• ${detail}`).join('\n')}

**Our Commitments Moving Forward:**

• We will treat each other with respect and dignity
• We will communicate openly and honestly
• We will assume positive intent in our interactions
• We will address concerns directly rather than letting them fester
• We will revisit this agreement in 30 days to assess our progress

**Conflict Resolution Process:**

If disagreements arise, we agree to:
1. Take a 24-hour cooling-off period if emotions are high
2. Use "I" statements to express our feelings
3. Focus on solutions rather than blame
4. Seek mediation again if needed

**Signatures:**

${state.participants.map(p => `${p.displayName}: ________________    Date: ________`).join('\n\n')}

**Mediation Facilitator:** Grace AI Mediator, The Voice Vault™
**Session ID:** ${state.sessionId}
**Date:** ${today}

---

*This agreement was created through AI-mediated conflict resolution. While not legally binding, it represents our mutual commitment to positive change and respectful interaction.*
      `.trim()
    };
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(peacePact.content);
  };

  const handleSaveEdit = () => {
    setPeacePact(prev => ({
      ...prev,
      content: editedContent
    }));
    setIsEditing(false);
  };

  const handleApprove = () => {
    setApproved(true);
    dispatch({ type: 'COMPLETE_SESSION' });
    setTimeout(() => navigate('/complete'), 1000);
  };

  const handleDownload = () => {
    const blob = new Blob([peacePact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Peace-Pact-${state.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
            <SafeIcon icon={FiFileText} className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-calm-800 mb-2">
            Your Peace Pact
          </h1>
          <p className="text-lg text-calm-600">
            A summary of your agreement and commitment to resolution
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl mb-8"
        >
          <div className="p-6 border-b border-calm-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-calm-800">
                  {peacePact.title}
                </h2>
                <p className="text-calm-600 text-sm">
                  Created on {peacePact.date} • Session {state.sessionId}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="p-2 text-calm-600 hover:text-primary-600 transition-colors"
                  title="Download as text file"
                >
                  <SafeIcon icon={FiDownload} className="w-5 h-5" />
                </button>
                <button
                  onClick={handleEdit}
                  className="p-2 text-calm-600 hover:text-primary-600 transition-colors"
                  title="Edit agreement"
                >
                  <SafeIcon icon={FiEdit} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 p-4 border border-calm-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors font-mono text-sm"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-calm-400 text-white rounded-lg hover:bg-calm-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-calm-700 leading-relaxed font-sans">
                  {peacePact.content}
                </pre>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-primary-50 rounded-2xl p-6 mb-8"
        >
          <h3 className="font-semibold text-calm-800 mb-2">
            Grace's Final Message
          </h3>
          <p className="text-calm-700 leading-relaxed italic">
            "Here's your Peace Pact - a summary of what we've agreed on together. 
            This document represents your commitment to positive change and respectful interaction. 
            While not legally binding, it serves as a reminder of the understanding you've reached 
            and the steps you've agreed to take. Does this feel right to both of you? 
            If not, let's revise it together."
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-4"
        >
          <p className="text-calm-600">
            Please review the agreement above. You can edit it if needed, then approve when ready.
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-white text-calm-700 rounded-xl font-semibold hover:bg-calm-50 transition-colors border border-calm-300"
            >
              Make Changes
            </button>
            <button
              onClick={handleApprove}
              disabled={approved}
              className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-3 shadow-lg ${
                approved
                  ? 'bg-green-500'
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-xl'
              }`}
            >
              <SafeIcon icon={FiCheck} className="w-5 h-5" />
              {approved ? 'Agreement Approved!' : 'Approve Agreement'}
              {!approved && <SafeIcon icon={FiArrowRight} className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-calm-500 text-sm mt-8"
        >
          <p>
            Remember: As a reminder, your session data is not stored. This is a safe, temporary space.
            Please save or download your Peace Pact for your records.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ResolutionDraft;