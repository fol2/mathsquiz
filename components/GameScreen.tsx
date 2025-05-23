import React, { useState, useEffect, FormEvent, memo, useCallback } from 'react';
import { MathProblem, DifficultyLevel, ProblemType } from '../types';
import { DIFFICULTY_NAMES, TOTAL_QUESTIONS } from '../constants';
import { TimerIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, StarIcon, TrendingUpIcon, AlertTriangleIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';
import MathRenderer from './MathRenderer';
import DrawingCanvas from './DrawingCanvas';
import ThemeToggle from './ThemeToggle';

interface GameScreenProps {
  problem: MathProblem | null;
  level: DifficultyLevel;
  score: number;
  strikes: number;
  timeLeft: number;
  questionsAttempted: number;
  totalQuestions: number;
  feedbackMessage: string;
  isAnswerSubmitted: boolean;
  showCorrectAnswer: boolean;
  canProceedToNext: boolean;
  onAnswerSubmit: (answer: string) => void;
  onProceedToNext: () => void;
  isLoadingProblem: boolean;
}

const GameScreen: React.FC<GameScreenProps> = memo(({
  problem,
  level,
  score,
  strikes,
  timeLeft,
  questionsAttempted,
  totalQuestions,
  feedbackMessage,
  isAnswerSubmitted,
  showCorrectAnswer,
  canProceedToNext,
  onAnswerSubmit,
  onProceedToNext,
  isLoadingProblem,
}) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showDrawingCanvas, setShowDrawingCanvas] = useState<boolean>(false);

  useEffect(() => {
    setUserAnswer(''); 
    if (problem && !isAnswerSubmitted && !isLoadingProblem && problem.problemType !== ProblemType.ERROR_GENERATING) {
        const inputElement = document.getElementById('answer-input') as HTMLInputElement;
        if (inputElement) {
            inputElement.focus();
        }
    }
  }, [problem, isAnswerSubmitted, isLoadingProblem]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswerSubmitted || isLoadingProblem || !problem || problem.problemType === ProblemType.ERROR_GENERATING) {
        return;
      }
      
      if (e.key === 'Escape') {
        e.preventDefault();
        setUserAnswer('');
        const inputElement = document.getElementById('answer-input') as HTMLInputElement;
        inputElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerSubmitted, isLoadingProblem, problem]);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!isAnswerSubmitted && !isLoadingProblem && problem && problem.problemType !== ProblemType.ERROR_GENERATING) {
      onAnswerSubmit(userAnswer);
    }
  }, [isAnswerSubmitted, isLoadingProblem, problem, userAnswer, onAnswerSubmit]);

  const handleAnswerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  }, []);

  const toggleDrawingCanvas = useCallback(() => {
    setShowDrawingCanvas(prev => !prev);
  }, []);

  const progressPercentage = (Math.max(0, questionsAttempted -1) / totalQuestions) * 100;
  const isFeedbackPositive = feedbackMessage.includes('Awesome') || feedbackMessage.includes('Great') || feedbackMessage.includes('Fantastic') || feedbackMessage.includes('Super') || feedbackMessage.includes('LEVEL UP');
  
  const currentQuestionDisplay = Math.min(questionsAttempted, totalQuestions);

  if (isLoadingProblem && !problem) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-xl shadow-2xl rounded-xl p-6 md:p-8 flex flex-col items-center justify-center space-y-6 min-h-[400px]">
        <LoadingSpinner message="Generating a new challenge..." size="large" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-xl shadow-2xl rounded-xl p-6 md:p-8 flex flex-col space-y-6">
        {/* Top Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={toggleDrawingCanvas}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
              title="Open drawing pad for calculations"
            >
              <span>📝</span>
              <span>Draw</span>
            </button>
          </div>
          <ThemeToggle />
        </div>

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
        <div className="bg-black/20 p-6 rounded-lg text-center min-h-[120px] flex items-center justify-center">
          {isLoadingProblem && problem === null ? (
               <p className="text-xl font-semibold text-gray-300">Loading question...</p>
          ) : problem?.problemType === ProblemType.ERROR_GENERATING ? (
              <div className="text-red-300 flex flex-col items-center gap-2">
                  <AlertTriangleIcon className="w-8 h-8" />
                  <p className="text-lg font-semibold">{problem.questionText}</p>
                  <p className="text-sm">A new question will be fetched shortly.</p>
              </div>
          ) : problem ? (
            <div id="question-text" className="text-2xl md:text-3xl font-bold text-white break-words" role="heading" aria-level={2}>
              {problem.hasLatex ? (
                <MathRenderer className="text-center">{problem.questionText}</MathRenderer>
              ) : (
                problem.questionText
              )}
            </div>
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
            onChange={handleAnswerChange}
            placeholder="Your Answer"
            disabled={isAnswerSubmitted || isLoadingProblem || !problem || problem.problemType === ProblemType.ERROR_GENERATING}
            className="w-full p-4 text-2xl text-center text-gray-800 rounded-lg border-2 border-transparent focus:border-sky-400 focus:ring-2 focus:ring-sky-300 outline-none transition-all disabled:bg-gray-700/50 disabled:text-gray-100 disabled:cursor-not-allowed"
            autoFocus={!isLoadingProblem && problem?.problemType !== ProblemType.ERROR_GENERATING}
            aria-label="Enter your answer to the math problem"
            aria-describedby="question-text"
          />
          <button
            type="submit"
            disabled={isAnswerSubmitted || userAnswer.trim() === '' || isLoadingProblem || !problem || problem.problemType === ProblemType.ERROR_GENERATING}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-lg text-xl shadow-md transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Submit your answer"
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

        {/* Correct Answer Display */}
        {showCorrectAnswer && problem && problem.problemType !== ProblemType.ERROR_GENERATING && (
          <div className="mt-4 p-4 rounded-lg text-center bg-blue-500/80">
            <p className="text-lg font-semibold text-white">
              The correct answer was: <span className="text-yellow-300 text-xl">{problem.answer}</span>
            </p>
          </div>
        )}

        {/* Question Source Status */}
        {problem && (
          <div className="flex justify-center">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              problem.problemType === ProblemType.AI_GENERATED 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : problem.problemType === ProblemType.ERROR_GENERATING
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {problem.problemType === ProblemType.AI_GENERATED 
                ? '🤖 AI Generated' 
                : problem.problemType === ProblemType.ERROR_GENERATING
                ? '⚠️ Fallback Question'
                : '📚 Question Bank'}
            </div>
          </div>
        )}

        {/* Next Question Button */}
        {canProceedToNext && (
          <button
            onClick={onProceedToNext}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg text-xl shadow-md transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
            aria-label="Proceed to next question"
          >
            Next Question →
          </button>
        )}
      </div>

      {/* Drawing Canvas Modal */}
      <DrawingCanvas 
        isVisible={showDrawingCanvas}
        onToggle={toggleDrawingCanvas}
      />
    </>
  );
});

export default GameScreen;