import React, { useState, useEffect } from 'react';
import { DifficultyLevel } from '../types';
import { DIFFICULTY_NAMES, TOTAL_QUESTIONS } from '../constants';
import { TrophyIcon, RefreshIcon, StarIcon, SparklesIcon, TrendingUpIcon } from './Icons';

interface GameProgress {
  gamesPlayed: number;
  totalScore: number;
  highScore: number;
  averageScore: number;
  accuracyRate: number;
  averageLevel: number;
  lastPlayedDate: string;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  fastestAnswer: number;
  levelProgression: { [key: number]: number };
  achievements: string[];
}

interface GameOverScreenProps {
  score: number;
  level: DifficultyLevel;
  onRestart: () => void;
  progress: GameProgress;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}> = ({ title, value, subtitle, icon, color, delay }) => (
  <div
    className={`glass-card p-6 rounded-2xl text-center card-hover animate-bounce-in ${color}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-3xl mb-3">{icon}</div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-sm font-medium mb-1">{title}</div>
    {subtitle && <div className="text-xs opacity-80">{subtitle}</div>}
  </div>
);

const AchievementBadge: React.FC<{
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  delay: number;
}> = ({ icon, title, description, unlocked, delay }) => (
  <div
    className={`glass-card p-4 rounded-xl text-center transition-all duration-300 ${
      unlocked 
        ? 'border-yellow-400/50 bg-yellow-500/10 card-hover animate-bounce-in' 
        : 'opacity-50 bg-gray-600/20'
    }`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`text-3xl mb-2 ${unlocked ? 'animate-float' : 'grayscale'}`}>
      {icon}
    </div>
    <div className={`text-sm font-bold mb-1 ${unlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
      {title}
    </div>
    <div className={`text-xs ${unlocked ? 'text-indigo-200' : 'text-gray-500'}`}>
      {description}
    </div>
    {unlocked && (
      <div className="mt-2">
        <div className="w-2 h-2 bg-green-400 rounded-full mx-auto animate-pulse"></div>
      </div>
    )}
  </div>
);

const PerformanceChart: React.FC<{
  level: DifficultyLevel;
  score: number;
  accuracy: number;
  questions: number;
}> = ({ level, score, accuracy, questions }) => {
  const maxScore = TOTAL_QUESTIONS * 10 * 5; // Max possible score
  const scorePercentage = (score / maxScore) * 100;

  return (
    <div className="glass-card p-6 rounded-2xl animate-scale-in" style={{ animationDelay: '800ms' }}>
      <h3 className="text-xl font-bold text-white mb-6 text-center">Performance Overview</h3>
      
      <div className="space-y-6">
        {/* Score Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-indigo-200">Total Score</span>
            <span className="text-sm font-bold text-green-300">{score} pts</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3">
            <div
              className="progress-bar h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(scorePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Accuracy */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-indigo-200">Accuracy</span>
            <span className="text-sm font-bold text-blue-300">{accuracy.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Level Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-indigo-200">Level Reached</span>
            <span className="text-sm font-bold text-yellow-300">{DIFFICULTY_NAMES[level]}</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(level / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, level, onRestart, progress }) => {
  const [showCelebration, setShowCelebration] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const motivationalQuotes = [
    "Every expert was once a beginner! 🌟",
    "Mathematics is the poetry of logical ideas! 📐",
    "You're building your mathematical intuition! 🧠",
    "Practice makes progress! Keep going! 🚀"
  ];

  const accuracy = progress.totalQuestionsAnswered > 0 
    ? (progress.correctAnswers / progress.totalQuestionsAnswered) * 100 
    : 0;

  const achievements = [
    {
      icon: "🎯",
      title: "First Steps",
      description: "Complete your first game",
      unlocked: progress.gamesPlayed >= 1
    },
    {
      icon: "🔥",
      title: "Streak Master",
      description: "Get 5+ correct in a row",
      unlocked: progress.bestStreak >= 5
    },
    {
      icon: "🏆",
      title: "High Scorer",
      description: "Score 500+ points",
      unlocked: progress.highScore >= 500
    },
    {
      icon: "⚡",
      title: "Speed Demon",
      description: "Answer in under 5 seconds",
      unlocked: progress.fastestAnswer < 5 && progress.fastestAnswer > 0
    },
    {
      icon: "🧠",
      title: "Math Genius",
      description: "Reach Level 5",
      unlocked: progress.averageLevel >= 5
    },
    {
      icon: "💎",
      title: "Perfectionist",
      description: "95%+ accuracy",
      unlocked: accuracy >= 95 && progress.totalQuestionsAnswered >= 20
    }
  ];

  const isNewHighScore = score === progress.highScore && score > 0;
  const gameRating = accuracy >= 90 ? "Excellent!" : accuracy >= 75 ? "Great!" : accuracy >= 60 ? "Good!" : "Keep Practicing!";

  useEffect(() => {
    const celebrationTimer = setTimeout(() => {
      setShowCelebration(false);
    }, 3000);

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 3000);

    return () => {
      clearTimeout(celebrationTimer);
      clearInterval(quoteInterval);
    };
  }, [motivationalQuotes.length]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-slide-up">
      {/* Header */}
      <div className="text-center glass-card-strong rounded-3xl p-8 animate-bounce-in">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <TrophyIcon className={`w-20 h-20 ${isNewHighScore ? 'text-yellow-400 animate-pulse-glow' : 'text-indigo-300'}`} />
            {isNewHighScore && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            )}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-4 gradient-text">
          {isNewHighScore ? "NEW HIGH SCORE!" : "Game Complete!"}
        </h1>

        {/* Dynamic Quote */}
        <div className="h-12 flex items-center justify-center mb-6">
          <div
            key={currentQuote}
            className="text-lg md:text-xl text-indigo-100 animate-slide-up"
          >
            {motivationalQuotes[currentQuote]}
          </div>
        </div>

        {/* Game Rating */}
        <div className="glass-card p-4 rounded-2xl mb-6 inline-block">
          <div className="text-2xl font-bold text-white mb-1">{gameRating}</div>
          <div className="text-sm text-indigo-200">Overall Performance</div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Final Score"
          value={score.toLocaleString()}
          {...(isNewHighScore ? { subtitle: "New Record!" } : {})}
          icon={<StarIcon className="w-8 h-8" />}
          color={isNewHighScore ? "border-yellow-400/50 bg-yellow-500/10" : ""}
          delay={200}
        />
        <StatCard
          title="Level Reached"
          value={level}
          subtitle={DIFFICULTY_NAMES[level]}
          icon={<TrendingUpIcon className="w-8 h-8" />}
          color="text-yellow-300"
          delay={400}
        />
        <StatCard
          title="Accuracy"
          value={`${accuracy.toFixed(1)}%`}
          subtitle={`${progress.correctAnswers}/${progress.totalQuestionsAnswered || TOTAL_QUESTIONS} correct`}
          icon={<div className="text-2xl">🎯</div>}
          color="text-blue-300"
          delay={600}
        />
        <StatCard
          title="High Score"
          value={progress.highScore.toLocaleString()}
          subtitle="Personal Best"
          icon={<div className="text-2xl">👑</div>}
          color="text-purple-300"
          delay={800}
        />
      </div>

      {/* Performance Chart */}
      <PerformanceChart
        level={level}
        score={score}
        accuracy={accuracy}
        questions={progress.totalQuestionsAnswered || TOTAL_QUESTIONS}
      />

      {/* Achievements Section */}
      <div className="glass-card-strong rounded-3xl p-8 animate-scale-in" style={{ animationDelay: '1000ms' }}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-purple-400" />
          <span>Achievements</span>
          <SparklesIcon className="w-8 h-8 text-purple-400" />
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement, index) => (
            <AchievementBadge
              key={achievement.title}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
              unlocked={achievement.unlocked}
              delay={1200 + index * 100}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="text-sm text-indigo-200">
            Unlocked: {achievements.filter(a => a.unlocked).length}/{achievements.length} achievements
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="glass-card-strong rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '1400ms' }}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-left flex items-center justify-between text-xl font-bold text-white mb-4"
        >
          <span>Detailed Statistics</span>
          <div className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </button>

        {showDetails && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-scale-in">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">{progress.gamesPlayed}</div>
              <div className="text-sm text-indigo-200">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">{progress.averageScore.toFixed(0)}</div>
              <div className="text-sm text-indigo-200">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-300">{progress.bestStreak}</div>
              <div className="text-sm text-indigo-200">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">{progress.averageLevel.toFixed(1)}</div>
              <div className="text-sm text-indigo-200">Average Level</div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 animate-bounce-in" style={{ animationDelay: '1600ms' }}>
        <button
          onClick={onRestart}
          className="flex-1 btn-primary text-white font-bold py-6 px-8 rounded-2xl text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 flex items-center justify-center space-x-3"
        >
          <RefreshIcon className="w-6 h-6" />
          <span>Play Again</span>
          <div className="text-2xl">🚀</div>
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="flex-1 btn-secondary text-white font-bold py-6 px-8 rounded-2xl text-xl shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 flex items-center justify-center space-x-3"
        >
          <div className="text-2xl">🏠</div>
          <span>Main Menu</span>
        </button>
      </div>

      {/* Motivational Footer */}
      <div className="text-center glass-card p-6 rounded-2xl animate-slide-up" style={{ animationDelay: '1800ms' }}>
        <div className="text-lg font-semibold text-white mb-2">
          🎓 Keep Learning, Keep Growing!
        </div>
        <div className="text-sm text-indigo-200">
          Mathematics is a journey, not a destination. Every problem solved makes you stronger! 💪
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
    