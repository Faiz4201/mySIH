import { useState, useEffect } from 'react';

export const useVoiceAdvisory = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setSupported(false);
    }
  }, []);

  const speak = (text, languageCode = 'hi-IN') => {
    if (!supported) return alert("Text-to-speech is not supported in this browser.");

    // Stop any ongoing speech before starting a new one
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map your UI languages to browser speech codes
    // Fallback to Hindi if Punjabi voice isn't installed on the specific device
    const langMap = {
      'English': 'en-IN',
      'Hindi': 'hi-IN',
      'Punjabi': 'hi-IN' // Most basic Android TTS engines fall back to Hindi for regional dialects, or use 'pa-IN' if testing on high-end Androids.
    };

    utterance.lang = langMap[languageCode] || 'hi-IN';
    utterance.rate = 0.9; // Slightly slower for better comprehension by farmers
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { speak, stop, isSpeaking, supported };
};