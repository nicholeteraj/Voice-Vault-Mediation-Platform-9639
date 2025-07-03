import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MediationProvider } from './contexts/MediationContext';
import WelcomeScreen from './components/WelcomeScreen';
import ConsentScreen from './components/ConsentScreen';
import IdentitySetup from './components/IdentitySetup';
import VoiceIntake from './components/VoiceIntake';
import CognitiveAlignment from './components/CognitiveAlignment';
import MediationRound from './components/MediationRound';
import ResolutionDraft from './components/ResolutionDraft';
import SessionComplete from './components/SessionComplete';
import StoryInputDemo from './components/StoryInputDemo';
import './App.css';

function App() {
  return (
    <MediationProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-calm-50 to-primary-50">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/consent" element={<ConsentScreen />} />
              <Route path="/identity" element={<IdentitySetup />} />
              <Route path="/voice-intake" element={<VoiceIntake />} />
              <Route path="/alignment" element={<CognitiveAlignment />} />
              <Route path="/mediation" element={<MediationRound />} />
              <Route path="/resolution" element={<ResolutionDraft />} />
              <Route path="/complete" element={<SessionComplete />} />
              <Route path="/story-demo" element={<StoryInputDemo />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </MediationProvider>
  );
}

export default App;