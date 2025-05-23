import { useState, useEffect } from 'react';
import { DifficultyLevel } from '../types';

interface GameProgress {
  highScore: number;
  bestLevel: DifficultyLevel;
  gamesPlayed: number;
  totalCorrectAnswers: number;
  averageTime: number;
}

const STORAGE_KEY = 'mathGeniusProgress';

const defaultProgress: GameProgress = {
  highScore: 0,
  bestLevel: DifficultyLevel.LEVEL_1,
  gamesPlayed: 0,
  totalCorrectAnswers: 0,
  averageTime: 0,
};

export const useGameProgress = () => {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress({ ...defaultProgress, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load game progress:', error);
    }
  }, []);

  const updateProgress = (updates: Partial<GameProgress>) => {
    const newProgress = { ...progress, ...updates };
    setProgress(newProgress);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (error) {
      console.warn('Failed to save game progress:', error);
    }
  };

  const updateGameEnd = (finalScore: number, finalLevel: DifficultyLevel, correctAnswers: number, avgTime: number) => {
    updateProgress({
      highScore: Math.max(progress.highScore, finalScore),
      bestLevel: Math.max(progress.bestLevel, finalLevel),
      gamesPlayed: progress.gamesPlayed + 1,
      totalCorrectAnswers: progress.totalCorrectAnswers + correctAnswers,
      averageTime: progress.gamesPlayed === 0 ? avgTime : 
                   (progress.averageTime * progress.gamesPlayed + avgTime) / (progress.gamesPlayed + 1),
    });
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to reset game progress:', error);
    }
  };

  return {
    progress,
    updateProgress,
    updateGameEnd,
    resetProgress,
  };
}; 