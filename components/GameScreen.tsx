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

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  animate?: boolean;
}> = ({ icon, label, value, color, animate = false }) => (
  <div className={`glass-card p-3 md:p-2 rounded-lg card-hover flex items-center justify-between md:justify-start md:space-x-2 ${animate ? 'animate-number-pop' : ''}`}>
    <div className="flex items-center space-x-2 md:space-x-2">
      <div className={`text-lg ${color}`}>{icon}</div>
      <div className="md:block">
        <div className={`text-sm md:text-sm font-bold ${color}`}>{value}</div>
        <div className="text-xs text-indigo-200 font-medium">{label}</div>
      </div>
    </div>
    <div className="block md:hidden">
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  </div>
);

const ProgressIndicator: React.FC<{
  current: number;
  total: number;
  strikes: number;
  level: DifficultyLevel;
}> = ({ current, total, strikes, level }) => {
  const progressPercentage = (Math.max(0, current - 1) / total) * 100;
  const strikesPercentage = (strikes / 3) * 100;

  return (
    <div className="space-y-4">
      {/* Main Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-indigo-200 font-medium">Quiz Progress</span>
          <span className="text-indigo-100 font-bold">{Math.min(current, total)}/{total}</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <div
            className="progress-bar h-3 rounded-full transition-all duration-500 ease-out"
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
  const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState<boolean>(false);

  // Mobile keyboard detection
  useEffect(() => {
    const detectKeyboard = () => {
      const initialViewportHeight = window.visualViewport?.height || window.innerHeight;
      
      const handleViewportChange = () => {
        const currentHeight = window.visualViewport?.height || window.innerHeight;
        const heightDifference = initialViewportHeight - currentHeight;
        
        // If viewport height decreased by more than 150px, keyboard is likely open
        setIsMobileKeyboardOpen(heightDifference > 150);
      };

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportChange);
        return () => window.visualViewport?.removeEventListener('resize', handleViewportChange);
      } else {
        window.addEventListener('resize', handleViewportChange);
        return () => window.removeEventListener('resize', handleViewportChange);
      }
    };

    return detectKeyboard();
  }, []);

  useEffect(() => {
    setUserAnswer(''); 
    if (problem && !isAnswerSubmitted && !isLoadingProblem && problem.problemType !== ProblemType.ERROR_GENERATING) {
        const inputElement = document.getElementById('answer-input') as HTMLInputElement;
        if (inputElement) {
            // Delay focus slightly on mobile to prevent layout issues
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
              setTimeout(() => inputElement.focus(), 100);
            } else {
              inputElement.focus();
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
      // More comprehensive detection of correct answer messages
      const isCorrectAnswer = 
        // Standard correct messages from constants.ts
        feedbackMessage.includes('Awesome') || 
        feedbackMessage.includes('Great') || 
        feedbackMessage.includes('Fantastic') || 
        feedbackMessage.includes('Super') || 
        // Level up messages
        feedbackMessage.includes('LEVEL UP') ||
        feedbackMessage.includes('Woohoo') ||
        feedbackMessage.includes('Amazing') ||
        feedbackMessage.includes('Incredible') ||
        // Additional variations that might appear
        feedbackMessage.includes('math whiz') ||
        feedbackMessage.includes('Math Genius') ||
        feedbackMessage.includes('nailed it') ||
        feedbackMessage.includes('Keep shining') ||
        feedbackMessage.includes('way!') ||
        feedbackMessage.includes('on a roll') ||
        feedbackMessage.includes('unstoppable') ||
        feedbackMessage.includes('unlocked') ||
        feedbackMessage.includes('smarter') ||
        feedbackMessage.includes('tougher questions') ||
        // Check for positive emojis/symbols
        feedbackMessage.includes('✨') ||
        feedbackMessage.includes('🧠💡') ||
        feedbackMessage.includes('⭐') ||
        feedbackMessage.includes('🚀') ||
        feedbackMessage.includes('🎉') ||
        feedbackMessage.includes('🏆') ||
        feedbackMessage.includes('🔓') ||
        feedbackMessage.includes('🌟') ||
        feedbackMessage.includes('🔥') ||
        feedbackMessage.includes('🌠');
      
      console.log(`Feedback: "${feedbackMessage}" | Detected as: ${isCorrectAnswer ? 'CORRECT' : 'INCORRECT'}`);
      
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

  const handleAnswerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  }, []);

  const toggleDrawingCanvas = useCallback(() => {
    setShowDrawingCanvas(prev => !prev);
  }, []);

  const isFeedbackPositive = 
    // Standard correct messages from constants.ts
    feedbackMessage.includes('Awesome') || 
    feedbackMessage.includes('Great') || 
    feedbackMessage.includes('Fantastic') || 
    feedbackMessage.includes('Super') || 
    // Level up messages
    feedbackMessage.includes('LEVEL UP') ||
    feedbackMessage.includes('Woohoo') ||
    feedbackMessage.includes('Amazing') ||
    feedbackMessage.includes('Incredible') ||
    // Additional variations that might appear
    feedbackMessage.includes('math whiz') ||
    feedbackMessage.includes('Math Genius') ||
    feedbackMessage.includes('nailed it') ||
    feedbackMessage.includes('Keep shining') ||
    feedbackMessage.includes('way!') ||
    feedbackMessage.includes('on a roll') ||
    feedbackMessage.includes('unstoppable') ||
    feedbackMessage.includes('unlocked') ||
    feedbackMessage.includes('smarter') ||
    feedbackMessage.includes('tougher questions') ||
    // Check for positive emojis/symbols
    feedbackMessage.includes('✨') ||
    feedbackMessage.includes('🧠💡') ||
    feedbackMessage.includes('⭐') ||
    feedbackMessage.includes('🚀') ||
    feedbackMessage.includes('🎉') ||
    feedbackMessage.includes('🏆') ||
    feedbackMessage.includes('🔓') ||
    feedbackMessage.includes('🌟') ||
    feedbackMessage.includes('🔥') ||
    feedbackMessage.includes('🌠');
  
  const getTimerClass = () => {
    if (problem?.problemType === ProblemType.ERROR_GENERATING) return 'text-gray-500';
    if (timeLeft <= 3) return 'timer-critical';
    if (timeLeft <= 5) return 'timer-warning';
    return 'text-white';
  };

  if (isLoadingProblem && !problem) {
    return (
      <div className="w-full max-w-3xl mx-auto glass-card-strong rounded-2xl compact-spacing-lg flex flex-col items-center justify-center space-y-4 min-h-[300px]">
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
      <div className={`w-full max-w-3xl mx-auto space-y-4 ${isMobileKeyboardOpen ? 'mobile-keyboard-adjust' : ''}`}>
        {/* Header with Stats */}
        <div className="glass-card-strong rounded-xl compact-spacing animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🧠</div>
              <div>
                <h1 className="text-lg md:text-xl font-bold gradient-text-static">Math Genius Challenge</h1>
                <div className="text-sm text-indigo-200">{DIFFICULTY_NAMES[level]} Level</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDrawingCanvas}
                className="btn-secondary text-white px-2 py-2 md:px-3 md:py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center space-x-1 md:space-x-2 min-h-[44px] min-w-[44px]"
                title="Open drawing pad for calculations"
              >
                <span>📝</span>
                <span className="hidden sm:inline">Draw</span>
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile-optimized Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
            <StatCard
              icon={<TrendingUpIcon className="w-4 h-4 md:w-5 md:h-5" />}
              label="Level"
              value={level}
              color="text-yellow-300"
            />
            <StatCard
              icon={<StarIcon className="w-4 h-4 md:w-5 md:h-5" />}
              label="Score"
              value={score}
              color="text-green-300"
              animate={score > lastScore}
            />
            <StatCard
              icon={<SparklesIcon className="w-4 h-4 md:w-5 md:h-5" />}
              label="Streak"
              value={strikes}
              color="text-orange-300"
            />
          </div>

          {/* Progress Indicators - Compact on mobile keyboard */}
          {!isMobileKeyboardOpen && (
            <div className="mt-4">
              <ProgressIndicator
                current={questionsAttempted}
                total={totalQuestions}
                strikes={strikes}
                level={level}
              />
            </div>
          )}
        </div>

        {/* Main Game Area - Adaptive height */}
        <div className={`glass-card-strong rounded-2xl compact-spacing-lg animate-scale-in ${
          isShaking ? 'animate-shake' : isCelebrating ? 'animate-celebrate' : ''
        } ${isMobileKeyboardOpen ? 'min-h-0' : ''}`}>
          {/* Timer - Compact on mobile keyboard */}
          <div className={`flex items-center justify-center space-x-2 text-xl md:text-2xl font-bold glass-card p-2 md:p-3 rounded-xl ${isMobileKeyboardOpen ? 'mb-3' : 'mb-6'} ${problem?.problemType === ProblemType.ERROR_GENERATING ? 'opacity-50' : ''}`}>
            <TimerIcon className={`w-6 h-6 md:w-8 md:h-8 ${problem?.problemType === ProblemType.ERROR_GENERATING ? 'text-gray-500' : 'text-red-400'} ${timeLeft <= 5 && timeLeft > 0 ? 'animate-pulse' : ''}`} />
            <span className={getTimerClass()}>{timeLeft}s</span>
            {timeLeft <= 5 && timeLeft > 0 && problem?.problemType !== ProblemType.ERROR_GENERATING && (
              <div className="text-sm text-red-400 font-medium animate-bounce">HURRY!</div>
            )}
          </div>

          {/* Question - Adaptive sizing */}
          <div className={`glass-card p-3 md:p-6 rounded-xl text-center ${isMobileKeyboardOpen ? 'min-h-[80px] mb-3' : 'min-h-[100px] mb-6'} flex items-center justify-center`}>
            {isLoadingProblem && problem === null ? (
                 <div className="space-y-3">
                   <div className="loading-shimmer h-6 rounded-lg"></div>
                   <div className="text-sm md:text-lg font-semibold text-gray-300">Loading question...</div>
                 </div>
            ) : problem?.problemType === ProblemType.ERROR_GENERATING ? (
                <div className="text-red-300 flex flex-col items-center gap-3 animate-bounce-in">
                    <AlertTriangleIcon className="w-8 h-8 md:w-10 md:h-10" />
                    <p className="text-base md:text-lg font-semibold">{problem.questionText}</p>
                    <p className="text-sm opacity-80">Click "Next Question" to try again.</p>
                </div>
            ) : problem ? (
              <div key={problem.id} id="question-text" className="animate-bounce-in" role="heading" aria-level={2}>
                {problem.hasLatex ? (
                  <MathRenderer className="text-center text-lg md:text-xl lg:text-3xl font-bold text-white">{problem.questionText}</MathRenderer>
                ) : (
                  <div className="text-lg md:text-xl lg:text-3xl font-bold text-white break-words">{problem.questionText}</div>
                )}
              </div>
            ) : (
               <div className="space-y-3">
                 <div className="loading-shimmer h-6 rounded-lg"></div>
                 <div className="text-sm md:text-lg font-semibold text-gray-400">Waiting for problem...</div>
               </div>
            )}
          </div>

          {/* Answer Form - Mobile optimized */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div className="relative">
              <input
                id="answer-input"
                type="number"
                step="any"
                value={userAnswer}
                onChange={handleAnswerChange}
                placeholder="Enter your answer..."
                disabled={isAnswerSubmitted || isLoadingProblem || !problem || problem.problemType === ProblemType.ERROR_GENERATING}
                className="w-full p-3 md:p-4 text-lg md:text-xl text-center rounded-xl border-2 border-transparent focus:border-sky-400 focus:ring-2 focus:ring-sky-300/50 outline-none transition-all input-enhanced focus-ring focus-enhanced"
                autoFocus={!isLoadingProblem && problem?.problemType !== ProblemType.ERROR_GENERATING}
                aria-label="Enter your answer to the math problem"
                aria-describedby="question-text"
                inputMode="decimal"
              />
              {userAnswer && !isAnswerSubmitted && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isAnswerSubmitted || userAnswer.trim() === '' || isLoadingProblem || !problem || problem.problemType === ProblemType.ERROR_GENERATING}
              className="w-full btn-primary text-white font-bold py-3 md:py-4 px-6 rounded-xl text-lg md:text-xl shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 min-h-[48px]"
              aria-label="Submit your answer"
            >
              {isAnswerSubmitted ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Feedback Section */}
        {(feedbackMessage || showCorrectAnswer || canProceedToNext) && (
          <div className="space-y-4 animate-slide-up">
            {/* Feedback Message */}
            {isAnswerSubmitted && feedbackMessage && (
              <div className={`glass-card p-6 rounded-2xl text-center text-lg font-semibold flex items-center justify-center space-x-3 ${isFeedbackPositive ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'} animate-bounce-in`}>
                {isFeedbackPositive ? (
                  <CheckCircleIcon className="w-8 h-8 text-green-400" />
                ) : (
                  <XCircleIcon className="w-8 h-8 text-red-400" />
                )}
                <span className={isFeedbackPositive ? 'text-green-100' : 'text-red-100'}>{feedbackMessage}</span>
                {isFeedbackPositive && <SparklesIcon className="w-6 h-6 text-yellow-400 animate-spin" />}
              </div>
            )}

            {/* Correct Answer Display */}
            {showCorrectAnswer && problem && problem.problemType !== ProblemType.ERROR_GENERATING && (
              <div className="glass-card p-6 rounded-2xl text-center bg-blue-500/20 border-blue-500/30 animate-scale-in">
                <p className="text-lg font-semibold text-blue-100">
                  The correct answer was: <span className="text-yellow-300 text-2xl font-bold animate-number-pop">{problem.answer}</span>
                </p>
              </div>
            )}

            {/* Next Question Button */}
            {canProceedToNext && (
              <button
                onClick={onProceedToNext}
                className="w-full btn-secondary text-white font-bold py-6 px-8 rounded-2xl text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 animate-bounce-in flex items-center justify-center space-x-3"
                aria-label="Proceed to next question"
              >
                <span>Next Challenge</span>
                <div className="text-2xl">🚀</div>
              </button>
            )}
          </div>
        )}

        {/* Question Source Status */}
        {problem && (
          <div className="flex justify-center animate-scale-in">
            <div className={`px-4 py-2 rounded-full text-sm font-medium glass-card ${
              problem.problemType === ProblemType.AI_GENERATED 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : problem.problemType === ProblemType.ERROR_GENERATING
                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            }`}>
              {problem.problemType === ProblemType.AI_GENERATED 
                ? '🤖 AI Generated Challenge' 
                : problem.problemType === ProblemType.ERROR_GENERATING
                ? '❌ Error Loading Question'
                : '📚 Curated Challenge'}
            </div>
          </div>
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