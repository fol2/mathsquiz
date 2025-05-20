
import React from 'react';
import { DifficultyLevel } from '../types';
import { LEVEL_UP_MESSAGES, DIFFICULTY_NAMES } from '../constants';
import { ArrowUpIcon, SparklesIcon } from './Icons';

interface LevelUpModalProps {
  level: DifficultyLevel;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  const randomMessage = LEVEL_UP_MESSAGES[Math.floor(Math.random() * LEVEL_UP_MESSAGES.length)];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-xl shadow-2xl text-center text-white max-w-md w-full transform transition-all scale-100 opacity-100">
        <SparklesIcon className="w-20 h-20 text-yellow-300 mx-auto mb-4 animate-pulse" />
        <h2 className="text-4xl font-extrabold mb-3 gradient-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400">LEVEL UP!</h2>
        <p className="text-xl mb-4">{randomMessage}</p>
        <p className="text-2xl font-bold mb-6">
          You've reached <span className="text-sky-300">{DIFFICULTY_NAMES[level]} (Level {level})</span>!
        </p>
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          <ArrowUpIcon className="w-6 h-6" />
          <span>Continue Challenge!</span>
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
    