
import React, { useState, useEffect, FormEvent } from 'react';
import { MathProblem, DifficultyLevel, ProblemType } from '../types';
import { DIFFICULTY_NAMES, TOTAL_QUESTIONS } from '../constants';
import { TimerIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, StarIcon, TrendingUpIcon, AlertTriangleIcon } from './Icons'; // Added AlertTriangleIcon

interface GameScreenProps {
  problem: MathProblem | null; // Problem can be null initially or during loading/error
  level: DifficultyLevel;
  score: number;
  strikes: number;
  timeLeft: number;
  questionsAttempted: number;
  totalQuestions: number;
  feedbackMessage: string;
  isAnswerSubmitted: boolean;
  onAnswerSubmit: (answer: string) => void;
  isLoadingProblem: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({
  problem,
  level,
  score,
  strikes,
  timeLeft,
  questionsAttempted,
  totalQuestions,
  feedbackMessage,
  isAnswerSubmitted,
  onAnswerSubmit,
  isLoadingProblem,
}) => {
  const [userAnswer, setUserAnswer] = useState<string>('');

  useEffect(() => {
    setUserAnswer(''); 
    if (problem && !isAnswerSubmitted && !isLoadingProblem && problem.problemType !== ProblemType.ERROR_GENERATING) {
        const inputElement = document.getElementById('answer-input') as HTMLInputElement;
        if (inputElement) {
            inputElement.focus();
        }
    }
  }, [problem, isAnswerSubmitted, isLoadingProblem]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!isAnswerSubmitted && !isLoadingProblem && problem && problem.problemType !== ProblemType.ERROR_GENERATING) {
      onAnswerSubmit(userAnswer);
    }
  };

  const progressPercentage = (Math.max(0, questionsAttempted -1) / totalQuestions) * 100; // Adjust for 1-based display
  const isFeedbackPositive = feedbackMessage.includes('Awesome') || feedbackMessage.includes('Great') || feedbackMessage.includes('Fantastic') || feedbackMessage.includes('Super') || feedbackMessage.includes('LEVEL UP');
  
  const currentQuestionDisplay = Math.min(questionsAttempted, totalQuestions);


  if (isLoadingProblem && !problem) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-xl shadow-2xl rounded-xl p-6 md:p-8 flex flex-col items-center justify-center space-y-6 min-h-[400px]">
        <SparklesIcon className="w-16 h-16 text-yellow-300 animate-spin" />
        <p className="text-2xl font-semibold text-white">Generating a new challenge...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-xl shadow-2xl rounded-xl p-6 md:p-8 flex flex-col space-y-6">
      {/* Top Bar: Stats */}
      <div className="flex flex-wrap justify-between items-center gap-4 text-indigo-100">
        <div className="flex items-center space-x-2 bg-black/20 p-2 rounded-lg">
          <TrendingUpIcon className="w-6 h-6 text-sky-300" />
          <span className="font-bold text-lg">Level: <span className="text-yellow-300">{DIFFICULTY_NAMES[level]} ({level})</span></span>
        </div>
        <div className="flex items-center space-x-2 bg-black/20 p-2 rounded-lg">
          <StarIcon className="w-6 h-6 text-yellow-400" />
          <span className="font-bold text-lg">Score: <span className="text-green-300">{score}</span></span>
        </div>
        <div className="flex items-center space-x-2 bg-black/20 p-2 rounded-lg">
          <SparklesIcon className="w-6 h-6 text-pink-400" />
          <span className="font-bold text-lg">Strikes: <span className="text-orange-300">{strikes}</span></span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700/50 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-center text-indigo-200 -mt-2">Question {currentQuestionDisplay} of {TOTAL_QUESTIONS}</p>

      {/* Timer */}
       <div className={`flex items-center justify-center space-x-2 text-2xl font-bold bg-black/20 p-3 rounded-lg self-center ${problem?.problemType === ProblemType.ERROR_GENERATING ? 'opacity-50' : ''}`}>
        <TimerIcon className={`w-8 h-8 ${problem?.problemType === ProblemType.ERROR_GENERATING ? 'text-gray-500' : 'text-red-400 animate-pulse'}`} />
        <span className={` ${timeLeft <= 5 && timeLeft > 0 && problem?.problemType !== ProblemType.ERROR_GENERATING ? 'text-red-400 animate-ping' : timeLeft <=0 ? 'text-red-600' : 'text-white'}`}>{timeLeft}s</span>
      </div>

      {/* Question */}
      <div className="bg-black/20 p-6 rounded-lg text-center min-h-[100px] flex items-center justify-center">
        {isLoadingProblem && problem === null ? (
             <p className="text-xl font-semibold text-gray-300">Loading question...</p>
        ) : problem?.problemType === ProblemType.ERROR_GENERATING ? (
            <div className="text-red-300 flex flex-col items-center gap-2">
                <AlertTriangleIcon className="w-8 h-8" />
                <p className="text-lg font-semibold">{problem.questionText}</p>
                <p className="text-sm">A new question will be fetched shortly.</p>
            </div>
        ) : problem ? (
          <p className="text-2xl md:text-3xl font-bold text-white break-words">{problem.questionText}</p>
        ) : (
           <p className="text-xl font-semibold text-gray-400">Waiting for problem...</p>
        )}
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          id="answer-input"
          type="number"
          step="any"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your Answer"
          disabled={isAnswerSubmitted || isLoadingProblem || !problem || problem.problemType === ProblemType.ERROR_GENERATING}
          className="w-full p-4 text-2xl text-center text-gray-800 rounded-lg border-2 border-transparent focus:border-sky-400 focus:ring-2 focus:ring-sky-300 outline-none transition-all disabled:bg-gray-700/50 disabled:text-gray-100 disabled:cursor-not-allowed"
          autoFocus={!isLoadingProblem && problem?.problemType !== ProblemType.ERROR_GENERATING}
        />
        <button
          type="submit"
          disabled={isAnswerSubmitted || userAnswer.trim() === '' || isLoadingProblem || !problem || problem.problemType === ProblemType.ERROR_GENERATING}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-lg text-xl shadow-md transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isAnswerSubmitted ? 'Waiting...' : 'Submit Answer'}
        </button>
      </form>

      {/* Feedback Message */}
      {isAnswerSubmitted && feedbackMessage && (
        <div className={`mt-4 p-4 rounded-lg text-center text-lg font-semibold flex items-center justify-center space-x-2 ${isFeedbackPositive ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
          {isFeedbackPositive ? <CheckCircleIcon className="w-6 h-6" /> : <XCircleIcon className="w-6 h-6" />}
          <span>{feedbackMessage}</span>
        </div>
      )}
    </div>
  );
};

export default GameScreen;