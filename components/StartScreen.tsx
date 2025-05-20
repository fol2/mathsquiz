
import React from 'react';
import { GeniusIcon } from './Icons';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-md shadow-2xl rounded-xl p-8 text-center flex flex-col items-center">
      <GeniusIcon className="w-32 h-32 text-yellow-300 mb-6" />
      <h1 className="text-5xl font-extrabold mb-4 gradient-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">Math Genius</h1>
      <p className="text-lg mb-8 text-indigo-100">
        Ready to challenge your math skills? Answer questions, beat the clock, and level up to become a true Math Genius!
      </p>
      <button
        onClick={onStart}
        className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-2xl shadow-lg transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        Start Challenge!
      </button>
       <p className="mt-6 text-xs text-indigo-200">
        Get 3 correct answers in a row to level up!
      </p>
    </div>
  );
};

export default StartScreen;
    