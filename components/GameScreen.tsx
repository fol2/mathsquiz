import React, { useState, useEffect, FormEvent, memo, useCallback } from 'react';
import { MathProblem, DifficultyLevel, ProblemType } from '../types';
import { DIFFICULTY_NAMES } from '../constants';
import { isPositiveFeedback } from '../utils/feedback';
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

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  animate?: boolean;
}> = ({ icon, label, value, color, animate = false }) => (
  <div className={`glass-card p-2 sm:p-3 rounded-lg card-hover flex items-center space-x-2 touch-target ${animate ? 'animate-number-pop' : ''}`}>
    <div className={`text-lg sm:text-xl ${color}`}>{icon}</div>
    <div className="min-w-0 flex-1">
      <div className={`text-sm sm:text-base font-bold ${color} truncate`}>{value}</div>
      <div className="text-xs text-indigo-200 font-medium truncate">{label}</div>
    </div>
  </div>
);

const ProgressIndicator: React.FC<{
  current: number;
  total: number;
  strikes: number;
}> = ({ current, total, strikes }) => {
  const progressPercentage = (Math.max(0, current - 1) / total) * 100;
  const strikesPercentage = (strikes / 3) * 100;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-indigo-200 font-medium">Quiz Progress</span>
          <span className="text-indigo-100 font-bold">{Math.min(current, total)}/{total}</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2 sm:h-3 overflow-hidden">
          <div
            className="progress-bar h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Level Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-indigo-200 font-medium">Level Progress</span>
          <span className="text-yellow-300 font-bold">{strikes}/3</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${strikesPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

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
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  const [lastScore, setLastScore] = useState<number>(score);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  // Mobile keyboard detection and handling
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const isKeyboardOpen = window.visualViewport.height < window.innerHeight * 0.8;
        setKeyboardVisible(isKeyboardOpen);
        
        // Scroll to input when keyboard opens
        if (isKeyboardOpen && !isAnswerSubmitted) {
          setTimeout(() => {
            const inputElement = document.getElementById('answer-input');
            if (inputElement) {
              inputElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest' 
              });
            }
          }, 150);
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => {
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleViewportChange);
        }
      };
    }
    return undefined;
  }, [isAnswerSubmitted]);

  useEffect(() => {
    setUserAnswer(''); 
    if (problem && !isAnswerSubmitted && !isLoadingProblem && problem.problemType !== ProblemType.ERROR_GENERATING) {
        const inputElement = document.getElementById('answer-input') as HTMLInputElement;
        if (inputElement) {
            // Delay focus on mobile to prevent immediate keyboard popup
            if (window.innerWidth > 640) {
              inputElement.focus();
            } else {
              // On mobile, only focus if user is actively interacting
              setTimeout(() => {
                if (document.hasFocus()) {
                  inputElement.focus();
                }
              }, 100);
            }
        }
    }
  }, [problem, isAnswerSubmitted, isLoadingProblem]);

  // Score animation effect
  useEffect(() => {
    if (score > lastScore) {
      setLastScore(score);
    }
  }, [score, lastScore]);

  // Animation effects for correct vs incorrect answers
  useEffect(() => {
    if (isAnswerSubmitted && feedbackMessage) {
      const isCorrectAnswer = isPositiveFeedback(feedbackMessage);
      
      console.warn(
        `Feedback: "${feedbackMessage}" | Detected as: ${isCorrectAnswer ? 'CORRECT' : 'INCORRECT'}`
      );
      
      if (isCorrectAnswer) {
        setIsCelebrating(true);
        const timer = setTimeout(() => setIsCelebrating(false), 600);
        return () => clearTimeout(timer);
      } else {
        setIsShaking(true);
        const timer = setTimeout(() => setIsShaking(false), 600);
        return () => clearTimeout(timer);
      }
    }
    return undefined;
  }, [isAnswerSubmitted, feedbackMessage]);

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

  const handleAnswerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!isAnswerSubmitted) {
      setUserAnswer(e.target.value);
    }
  }, [isAnswerSubmitted]);

  const toggleDrawingCanvas = useCallback((): void => {
    setShowDrawingCanvas(prev => !prev);
  }, []);

  const isFeedbackPositive = isPositiveFeedback(feedbackMessage);

  const getTimerClass = () => {
    if (problem?.problemType === ProblemType.ERROR_GENERATING) return 'text-gray-500';
    if (timeLeft <= 3) return 'timer-critical';
    if (timeLeft <= 5) return 'timer-warning';
    return 'text-white';
  };

  if (isLoadingProblem && !problem) {
    return (
      <div className="w-full max-w-3xl mx-auto glass-card-strong rounded-2xl compact-spacing-lg flex flex-col items-center justify-center space-y-4 min-h-[250px] sm:min-h-[300px]">
        <LoadingSpinner message="Generating your next challenge..." size="large" />
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold text-indigo-100">🤖 AI is thinking...</div>
          <div className="text-sm text-indigo-200">Creating a perfect challenge for Level {level}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full max-w-3xl mx-auto space-y-3 sm:space-y-4 mobile-container ${keyboardVisible ? 'keyboard-safe' : ''}`}>
        {/* Header with Stats */}
        <div className="glass-card-strong rounded-xl compact-spacing animate-slide-up">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="text-xl sm:text-2xl">🧠</div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold gradient-text-static truncate">Math Genius Challenge</h1>
                <div className="text-xs sm:text-sm text-indigo-200 truncate">{DIFFICULTY_NAMES[level]} Level</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <button
                onClick={toggleDrawingCanvas}
                className="btn-secondary text-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all hover:scale-105 flex items-center space-x-1 sm:space-x-2 touch-target"
                title="Open drawing pad for calculations"
              >
                <span>📝</span>
                <span className="hidden sm:inline">Draw</span>
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <StatCard
              icon={<TrendingUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              label="Level"
              value={level}
              color="text-yellow-300"
            />
            <StatCard
              icon={<StarIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              label="Score"
              value={score}
              color="text-green-300"
              animate={score > lastScore}
            />
            <StatCard
              icon={<SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              label="Streak"
              value={strikes}
              color="text-orange-300"
            />
          </div>

          {/* Progress Indicators */}
          <div className="mt-3 sm:mt-4">
            <ProgressIndicator
              current={questionsAttempted}
              total={totalQuestions}
              strikes={strikes}
            />
          </div>
        </div>

        {/* Main Game Area */}
        <div className={`glass-card-strong rounded-2xl compact-spacing-lg animate-scale-in ${
          isShaking ? 'animate-shake' : isCelebrating ? 'animate-celebrate' : ''
        } ${keyboardVisible ? 'compact-landscape' : ''}`}>
          {/* Timer */}
          <div className={`flex items-center justify-center space-x-2 text-xl sm:text-2xl font-bold glass-card p-2 sm:p-3 rounded-xl mb-4 sm:mb-6 ${problem?.problemType === ProblemType.ERROR_GENERATING ? 'opacity-50' : ''}`}>
            <TimerIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${problem?.problemType === ProblemType.ERROR_GENERATING ? 'text-gray-500' : 'text-red-400'} ${timeLeft <= 5 && timeLeft > 0 ? 'animate-pulse' : ''}`} />
            <span className={getTimerClass()}>{Math.ceil(timeLeft)}s</span>
            {timeLeft <= 5 && timeLeft > 0 && problem?.problemType !== ProblemType.ERROR_GENERATING && (
              <div className="text-xs sm:text-sm text-red-400 font-medium animate-bounce">HURRY!</div>
            )}
          </div>

          {/* Question */}
          <div className="glass-card p-3 sm:p-6 rounded-xl text-center min-h-[80px] sm:min-h-[100px] flex items-center justify-center mb-4 sm:mb-6">
            {isLoadingProblem && problem === null ? (
                 <div className="space-y-3">
                   <div className="loading-shimmer h-4 sm:h-6 rounded-lg"></div>
                   <div className="text-base sm:text-lg font-semibold text-gray-300">Loading question...</div>
                 </div>
            ) : problem?.problemType === ProblemType.ERROR_GENERATING ? (
                <div className="text-red-300 flex flex-col items-center gap-3 animate-bounce-in">
                    <AlertTriangleIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                    <p className="text-base sm:text-lg font-semibold px-2">{problem.questionText}</p>
                    <p className="text-xs sm:text-sm opacity-80">Click "Next Question" to try again.</p>
                </div>
            ) : problem ? (
              <div key={problem.id} id="question-text" className="animate-bounce-in w-full" role="heading" aria-level={2}>
                {problem.hasLatex ? (
                  <MathRenderer className="text-center text-lg sm:text-xl md:text-3xl font-bold text-white">{problem.questionText}</MathRenderer>
                ) : (
                  <div className="text-lg sm:text-xl md:text-3xl font-bold text-white break-words px-2">{problem.questionText}</div>
                )}
              </div>
            ) : (
               <div className="space-y-3">
                 <div className="loading-shimmer h-4 sm:h-6 rounded-lg"></div>
                 <div className="text-base sm:text-lg font-semibold text-gray-400">Waiting for problem...</div>
               </div>
            )}
          </div>

          {/* Answer Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="relative">
              <input
                id="answer-input"
                type="number"
                step="any"
                value={userAnswer}
                onChange={handleAnswerChange}
                placeholder="Enter your answer..."
                disabled={isAnswerSubmitted || isLoadingProblem || !problem || problem.problemType === ProblemType.ERROR_GENERATING}
                className="w-full p-3 sm:p-4 text-lg sm:text-xl text-center rounded-xl border-2 border-transparent focus:border-sky-400 focus:ring-2 focus:ring-sky-300/50 outline-none transition-all input-enhanced input-mobile-optimized focus-ring"
                autoFocus={false}
                aria-label="Enter your answer to the math problem"
                aria-describedby="question-text"
                inputMode="decimal"
              />
              {userAnswer && !isAnswerSubmitted && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            
            <button
              type={canProceedToNext ? "button" : "submit"}
              onClick={canProceedToNext ? onProceedToNext : undefined}
              disabled={(!canProceedToNext && (isAnswerSubmitted || userAnswer.trim() === '' || isLoadingProblem || !problem || problem.problemType === ProblemType.ERROR_GENERATING))}
              className="w-full btn-primary text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-lg sm:text-xl shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 sm:space-x-3 touch-target-comfortable"
              aria-label={canProceedToNext ? "Proceed to next question" : "Submit your answer"}
            >
              {isAnswerSubmitted && !canProceedToNext ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : canProceedToNext ? (
                <>
                  <span>Next Challenge</span>
                  <div className="text-xl sm:text-2xl">🚀</div>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Feedback Section */}
        {(feedbackMessage || showCorrectAnswer || canProceedToNext) && (
          <div className="space-y-3 sm:space-y-4 animate-slide-up">
            {/* Feedback Message */}
            {isAnswerSubmitted && feedbackMessage && (
              <div className={`glass-card p-4 sm:p-6 rounded-2xl text-center text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 sm:space-x-3 ${isFeedbackPositive ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'} animate-bounce-in`}>
                {isFeedbackPositive ? (
                  <CheckCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 flex-shrink-0" />
                )}
                <span className={`${isFeedbackPositive ? 'text-green-100' : 'text-red-100'} break-words`}>{feedbackMessage}</span>
                {isFeedbackPositive && <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-spin flex-shrink-0" />}
              </div>
            )}

            {/* Correct Answer Display */}
            {showCorrectAnswer && problem && problem.problemType !== ProblemType.ERROR_GENERATING && (
              <div className="glass-card p-4 sm:p-6 rounded-2xl text-center bg-blue-500/20 border-blue-500/30 animate-scale-in">
                <p className="text-base sm:text-lg font-semibold text-blue-100 break-words">
                  The correct answer was: <span className="text-yellow-300 text-xl sm:text-2xl font-bold animate-number-pop">{problem.answer}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drawing Canvas Modal */}
      {showDrawingCanvas && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 focus-trap">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Drawing Pad</h3>
              <button
                onClick={toggleDrawingCanvas}
                className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors touch-target"
                aria-label="Close drawing pad"
              >
                ×
              </button>
            </div>
            <DrawingCanvas />
          </div>
        </div>
      )}
    </>
  );
});

GameScreen.displayName = 'GameScreen';
export default GameScreen;
