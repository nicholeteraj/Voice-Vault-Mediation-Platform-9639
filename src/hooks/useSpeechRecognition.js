import { useState, useRef, useEffect, useCallback } from 'react';

const useSpeechRecognition = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const isManualStop = useRef(false);

  // Initialize speech recognition
  useEffect(() => {
    const initializeSpeechRecognition = () => {
      // Check for speech recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        setError('not_supported');
        setIsInitialized(true);
        return;
      }

      setIsSupported(true);
      
      try {
        recognitionRef.current = new SpeechRecognition();
        
        // Configure recognition
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;

        // Event handlers
        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
          setError(null);
        };

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript + ' ');
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          switch (event.error) {
            case 'not-allowed':
              setError('microphone_permission_denied');
              break;
            case 'no-speech':
              setError('no_speech_detected');
              break;
            case 'audio-capture':
              setError('no_microphone_found');
              break;
            case 'network':
              setError('network_error');
              break;
            case 'aborted':
              if (!isManualStop.current) {
                setError('recognition_aborted');
              }
              break;
            default:
              setError('recognition_error');
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          isManualStop.current = false;
        };

        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize speech recognition:', err);
        setError('initialization_failed');
        setIsSupported(false);
        setIsInitialized(true);
      }
    };

    initializeSpeechRecognition();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(async (timeout = 30000) => {
    if (!isSupported || !recognitionRef.current || !isInitialized) {
      setError('not_supported');
      return false;
    }

    if (isListening) {
      console.log('Already listening');
      return true;
    }

    try {
      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());

      setError(null);
      isManualStop.current = false;

      // Start recognition
      recognitionRef.current.start();

      // Set timeout
      if (timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          if (isListening) {
            stopListening();
            setError('timeout');
          }
        }, timeout);
      }

      return true;
    } catch (err) {
      console.error('Microphone access error:', err);
      setError('microphone_access_denied');
      return false;
    }
  }, [isSupported, isListening, isInitialized]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      isManualStop.current = true;
      recognitionRef.current.stop();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  const updateTranscript = useCallback((newTranscript) => {
    setTranscript(newTranscript);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    updateTranscript,
    isInitialized
  };
};

export default useSpeechRecognition;