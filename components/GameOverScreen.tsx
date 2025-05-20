
import React from 'react';
import { DifficultyLevel } from '../types';
import { DIFFICULTY_NAMES } from '../constants';
import { TrophyIcon, RefreshIcon } from './Icons';

interface GameOverScreenProps {
  score: number;
  level: DifficultyLevel;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, level, onRestart }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-md shadow-2xl rounded-xl p-8 text-center flex flex-col items-center">
      <TrophyIcon className="w-24 h-24 text-yellow-400 mb-6" />
      <h2 className="text-5xl font-extrabold mb-3 gradient-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">Game Over!</h2>
      <p className="text-2xl mb-2 text-indigo-100">
        You reached Level: <span className="font-bold text-sky-300">{DIFFICULTY_NAMES[level]}</span>
      </p>
      <p className="text-3xl font-bold mb-8 text-indigo-100">
        Final Score: <span className="text-green-300">{score}</span>
      </p>
      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-lg text-2xl shadow-lg transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        <RefreshIcon className="w-7 h-7" />
        <span>Play Again?</span>
      </button>
      <p className="mt-6 text-indigo-200 text-sm">Keep practicing to become a true Math Genius!</p>
    </div>
  );
};

export default GameOverScreen;
    