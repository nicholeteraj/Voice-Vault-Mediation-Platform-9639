import React, { createContext, useContext, useReducer } from 'react';

const MediationContext = createContext();

const initialState = {
  sessionId: null,
  consentGiven: false,
  participants: [],
  currentParticipant: 0,
  voiceTranscripts: [],
  emotionalAnalysis: [],
  conflictSnapshot: null,
  mediationRounds: [],
  currentRound: 0,
  resolutionDraft: null,
  sessionComplete: false,
  escalationDetected: false,
  pauseReason: null
};

function mediationReducer(state, action) {
  switch (action.type) {
    case 'SET_CONSENT':
      return { ...state, consentGiven: action.payload };
    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [...state.participants, action.payload]
      };
    case 'SET_CURRENT_PARTICIPANT':
      return { ...state, currentParticipant: action.payload };
    case 'ADD_VOICE_TRANSCRIPT':
      return {
        ...state,
        voiceTranscripts: [...state.voiceTranscripts, action.payload]
      };
    case 'ADD_EMOTIONAL_ANALYSIS':
      return {
        ...state,
        emotionalAnalysis: [...state.emotionalAnalysis, action.payload]
      };
    case 'SET_CONFLICT_SNAPSHOT':
      return { ...state, conflictSnapshot: action.payload };
    case 'ADD_MEDIATION_ROUND':
      return {
        ...state,
        mediationRounds: [...state.mediationRounds, action.payload]
      };
    case 'SET_CURRENT_ROUND':
      return { ...state, currentRound: action.payload };
    case 'SET_RESOLUTION_DRAFT':
      return { ...state, resolutionDraft: action.payload };
    case 'SET_ESCALATION':
      return {
        ...state,
        escalationDetected: action.payload.detected,
        pauseReason: action.payload.reason
      };
    case 'COMPLETE_SESSION':
      return { ...state, sessionComplete: true };
    case 'RESET_SESSION':
      return { ...initialState, sessionId: Date.now().toString() };
    default:
      return state;
  }
}

export function MediationProvider({ children }) {
  const [state, dispatch] = useReducer(mediationReducer, {
    ...initialState,
    sessionId: Date.now().toString()
  });

  return (
    <MediationContext.Provider value={{ state, dispatch }}>
      {children}
    </MediationContext.Provider>
  );
}

export function useMediation() {
  const context = useContext(MediationContext);
  if (!context) {
    throw new Error('useMediation must be used within a MediationProvider');
  }
  return context;
}