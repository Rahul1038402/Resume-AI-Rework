import { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = 'ai_mode_';

interface UseAIModeProps {
  section: string;
  defaultMode?: 'manual' | 'ai';
}

export const useAIMode = ({ section, defaultMode = 'manual' }: UseAIModeProps) => {
  const storageKey = `${STORAGE_PREFIX}${section}`;

  // Load saved mode from localStorage
  const loadSavedMode = (): 'manual' | 'ai' => {
    try {
      const saved = localStorage.getItem(storageKey);
      return (saved === 'ai' || saved === 'manual') ? saved : defaultMode;
    } catch (error) {
      console.error('Error loading AI mode:', error);
      return defaultMode;
    }
  };

  const [mode, setMode] = useState<'manual' | 'ai'>(loadSavedMode);
  const [showWelcome, setShowWelcome] = useState(false);

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, mode);
    } catch (error) {
      console.error('Error saving AI mode:', error);
    }
  }, [mode, storageKey]);

  // Toggle between manual and AI mode
  const toggleMode = useCallback(() => {
    setMode(prev => {
      const newMode = prev === 'manual' ? 'ai' : 'manual';
      
      // Show welcome message when switching to AI mode
      if (newMode === 'ai') {
        setShowWelcome(true);
      }
      
      return newMode;
    });
  }, []);

  // Set specific mode
  const setAIMode = useCallback((newMode: 'manual' | 'ai') => {
    setMode(newMode);
    if (newMode === 'ai') {
      setShowWelcome(true);
    }
  }, []);

  // Dismiss welcome message
  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
  }, []);

  // Check if AI mode is enabled
  const isAIMode = mode === 'ai';
  const isManualMode = mode === 'manual';

  return {
    mode,
    isAIMode,
    isManualMode,
    showWelcome,
    toggleMode,
    setAIMode,
    dismissWelcome
  };
};