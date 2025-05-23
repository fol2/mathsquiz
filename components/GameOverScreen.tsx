import React from 'react';
import { DifficultyLevel } from '../types';
import { DIFFICULTY_NAMES } from '../constants';
import { TrophyIcon, RefreshIcon, StarIcon, TrendingUpIcon } from './Icons';

interface GameProgress {
  highScore: number;
  bestLevel: DifficultyLevel;
  gamesPlayed: number;
  totalCorrectAnswers: number;
  averageTime: number;
}

interface GameOverScreenProps {
  score: number;
  level: DifficultyLevel;
  onRestart: () => void;
  progress?: GameProgress;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, level, onRestart, progress }) => {
  const isNewHighScore = progress && score > progress.highScore;
  const isNewBestLevel = progress && level > progress.bestLevel;

  return (
    <div className="w-full max-w-lg mx-auto bg-white/20 backdrop-blur-md shadow-2xl rounded-xl p-8 text-center flex flex-col items-center space-y-6">
      <TrophyIcon className="w-24 h-24 text-yellow-400" />
      
      <div className="space-y-2">
        <h2 className="text-5xl font-extrabold gradient-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
          Game Over!
        </h2>
        {(isNewHighScore || isNewBestLevel) && (
          <div className="flex items-center justify-center space-x-2 text-yellow-300">
            <StarIcon className="w-5 h-5" />
            <span className="font-semibold">
              {isNewHighScore && isNewBestLevel ? 'New High Score & Best Level!' :
               isNewHighScore ? 'New High Score!' : 'New Best Level!'}
            </span>
            <StarIcon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="w-full space-y-4">
        <div className="bg-black/20 rounded-lg p-4 space-y-2">
          <p className="text-xl text-indigo-100">
            Level Reached: <span className="font-bold text-sky-300">{DIFFICULTY_NAMES[level]}</span>
          </p>
          <p className="text-2xl font-bold text-indigo-100">
            Final Score: <span className="text-green-300">{score}</span>
          </p>
        </div>

        {progress && (
          <div className="bg-black/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center space-x-2 text-indigo-200 mb-2">
              <TrendingUpIcon className="w-5 h-5" />
              <span className="font-semibold">Your Progress</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-indigo-100">
                High Score: <span className="font-bold text-yellow-300">{progress.highScore}</span>
              </div>
              <div className="text-indigo-100">
                Best Level: <span className="font-bold text-sky-300">{DIFFICULTY_NAMES[progress.bestLevel]}</span>
              </div>
              <div className="text-indigo-100">
                Games Played: <span className="font-bold text-pink-300">{progress.gamesPlayed}</span>
              </div>
              <div className="text-indigo-100">
                Total Correct: <span className="font-bold text-green-300">{progress.totalCorrectAnswers}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-lg text-2xl shadow-lg transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        <RefreshIcon className="w-7 h-7" />
        <span>Play Again?</span>
      </button>
      
      <p className="text-indigo-200 text-sm">Keep practicing to become a true Math Genius!</p>
    </div>
  );
};

export default GameOverScreen;
    