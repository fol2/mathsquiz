import React, { useEffect, useState } from 'react';
import { DifficultyLevel } from '../types';
import { DIFFICULTY_NAMES } from '../constants';
import { TrophyIcon, SparklesIcon, StarIcon } from './Icons';

interface LevelUpModalProps {
  level: DifficultyLevel;
  onClose: () => void;
}

const ConfettiPiece: React.FC<{ delay: number; color: string }> = ({ delay, color }) => (
  <div
    className={`absolute w-3 h-3 ${color} rounded-full opacity-80 animate-bounce`}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }}
  />
);

const AchievementBadge: React.FC<{
  icon: string;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => (
  <div
    className="glass-card p-3 rounded-lg text-center card-hover animate-bounce-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-sm font-bold text-yellow-300 mb-1">{title}</div>
    <div className="text-xs text-indigo-200">{description}</div>
  </div>
);

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  const [showCelebration, setShowCelebration] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);

  const celebrationMessages = [
    `🎉 Welcome to ${DIFFICULTY_NAMES[level]} Level!`,
    "🚀 You're becoming a Math Genius!",
    "⭐ Ready for bigger challenges?",
    "🧠 Your skills are evolving!"
  ];

  const levelPerks = {
    2: { title: "Enhanced Problems", description: "More complex algebra awaits" },
    3: { title: "Strategic Thinking", description: "Fractions and percentages" },
    4: { title: "Advanced Concepts", description: "Geometry and multi-step problems" },
    5: { title: "Genius Mode", description: "Ultimate mathematical challenges" }
  };

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % celebrationMessages.length);
    }, 2000);

    const celebrationTimer = setTimeout(() => {
      setShowCelebration(false);
    }, 4000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(celebrationTimer);
    };
  }, [celebrationMessages.length]);

  const handleContinue = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-scale-in">
      {/* Confetti Background */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }, (_, i) => (
            <ConfettiPiece
              key={i}
              delay={i * 0.1}
              color={[
                'bg-yellow-400',
                'bg-pink-400',
                'bg-purple-400',
                'bg-green-400',
                'bg-blue-400',
                'bg-red-400'
              ][i % 6]}
            />
          ))}
        </div>
      )}

      {/* Main Modal */}
      <div className="glass-card-strong rounded-2xl compact-spacing-lg max-w-xl w-full mx-auto text-center animate-bounce-in">
        {/* Header with Trophy */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <TrophyIcon className="w-16 h-16 text-yellow-400 animate-float animate-pulse-glow" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black mb-3 gradient-text tracking-tight">
            LEVEL UP!
          </h1>

          {/* Dynamic Message */}
          <div className="h-12 flex items-center justify-center">
            <div
              key={currentMessage}
              className="text-lg md:text-xl font-bold text-indigo-100 animate-slide-up"
            >
              {celebrationMessages[currentMessage]}
            </div>
          </div>
        </div>

        {/* Level Information */}
        <div className="glass-card p-4 rounded-xl mb-6 animate-scale-in" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="text-3xl font-black text-yellow-300 animate-number-pop">
              {level}
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-white">
                {DIFFICULTY_NAMES[level]}
              </div>
              <div className="text-sm text-indigo-200">
                {levelPerks[level as keyof typeof levelPerks]?.title}
              </div>
            </div>
          </div>

          <div className="text-indigo-200 text-center text-sm">
            {levelPerks[level as keyof typeof levelPerks]?.description}
          </div>
        </div>

        {/* Achievement Showcase */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <AchievementBadge
            icon="🏆"
            title="Level Master"
            description="Advanced to new level"
            delay={700}
          />
          <AchievementBadge
            icon="🔥"
            title="Streak Master"
            description="3 correct in a row"
            delay={900}
          />
          <AchievementBadge
            icon="⚡"
            title="Quick Solver"
            description="Rapid calculations"
            delay={1100}
          />
        </div>

        {/* Level Benefits */}
        <div className="glass-card p-4 rounded-xl mb-6 animate-slide-up" style={{ animationDelay: '1300ms' }}>
          <h3 className="text-base font-bold text-white mb-3 flex items-center justify-center space-x-2">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <span>New Level Benefits</span>
            <SparklesIcon className="w-5 h-5 text-purple-400" />
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-indigo-200">Higher point multiplier</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-indigo-200">More challenging problems</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-indigo-200">Extended thinking time</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-indigo-200">Advanced math concepts</span>
            </div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="glass-card p-3 rounded-xl mb-6 animate-scale-in" style={{ animationDelay: '1500ms' }}>
          <div className="text-sm text-indigo-200 mb-2">Your Journey</div>
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <div key={lvl} className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    lvl <= level
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white animate-pulse'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {lvl}
                </div>
                <div className="text-xs text-indigo-300 mt-1">
                  {DIFFICULTY_NAMES[lvl as DifficultyLevel].slice(0, 4)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleContinue}
          className="group w-full btn-primary text-white font-bold py-4 px-6 rounded-xl text-lg shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 animate-pulse-glow flex items-center justify-center space-x-3"
        >
          <StarIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span>Continue Challenge</span>
          <div className="text-lg group-hover:scale-110 transition-transform">🚀</div>
        </button>

        {/* Motivation Quote */}
        <div className="mt-4 animate-slide-up" style={{ animationDelay: '1700ms' }}>
          <div className="text-sm text-indigo-300 italic">
            "Mathematics is not about numbers, equations, or algorithms. It's about understanding." 
          </div>
          <div className="text-xs text-indigo-400 mt-1">
            - William Paul Thurston
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
    