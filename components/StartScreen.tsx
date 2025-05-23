import React, { useState, useEffect } from 'react';
import { GeniusIcon, StarIcon, TrendingUpIcon, SparklesIcon, PlayIcon } from './Icons';

interface StartScreenProps {
  onStart: () => void;
}

const FloatingParticle: React.FC<{ delay: number; duration: number }> = ({ delay, duration }) => (
  <div
    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-300 to-pink-400 rounded-full opacity-70 animate-float"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  />
);

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => (
  <div
    className="glass-card p-4 rounded-xl card-hover animate-bounce-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center space-x-3 mb-2">
      <div className="text-2xl">{icon}</div>
      <h3 className="font-semibold text-white text-sm">{title}</h3>
    </div>
    <p className="text-xs text-indigo-200 leading-relaxed">{description}</p>
  </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "🎯 Get 3 correct answers in a row to level up!",
    "⚡ Each level has more time but harder questions",
    "🎨 Use the drawing pad for complex calculations",
    "🔢 Decimals and fractions are accepted",
    "🎵 Turn on sound for the best experience!"
  ];

  useEffect(() => {
    setIsLoaded(true);
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(tipInterval);
  }, [tips.length]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            duration={6 + Math.random() * 4}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto">
        {/* Hero Section */}
        <div
          className={`glass-card-strong rounded-3xl p-8 md:p-12 text-center mb-8 card-hover ${
            isLoaded ? 'animate-bounce-in' : 'opacity-0'
          }`}
        >
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <GeniusIcon className="w-32 h-32 md:w-40 md:h-40 text-yellow-300 animate-float animate-pulse-glow" />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-4 gradient-text font-['Space_Grotesk'] tracking-tight">
              Math Genius
            </h1>
            
            <div className="text-lg md:text-xl text-indigo-100 mb-2 font-medium">
              Challenge • Learn • Conquer
            </div>
            
            <p className="text-base md:text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              Embark on an epic mathematical journey powered by AI. Solve progressively challenging problems, 
              unlock achievements, and become a true Math Genius!
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-6">
            <button
              onClick={onStart}
              className="group relative w-full max-w-md mx-auto btn-primary text-white font-bold py-6 px-8 rounded-2xl text-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 animate-pulse-glow flex items-center justify-center space-x-3"
            >
              <PlayIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span>Start Your Journey</span>
              <SparklesIcon className="w-6 h-6 animate-spin" />
            </button>

            {/* Rotating Tips */}
            <div className="glass-card p-4 rounded-xl max-w-md mx-auto">
              <div
                key={currentTip}
                className="text-sm text-indigo-100 animate-slide-up font-medium"
              >
                {tips[currentTip]}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <FeatureCard
            icon={<TrendingUpIcon className="w-6 h-6 text-green-400" />}
            title="Progressive Difficulty"
            description="From basic arithmetic to advanced algebra across 5 challenging levels"
            delay={200}
          />
          
          <FeatureCard
            icon={<SparklesIcon className="w-6 h-6 text-purple-400" />}
            title="AI-Powered Questions"
            description="Dynamic problems generated by Google's Gemini AI for endless variety"
            delay={400}
          />
          
          <FeatureCard
            icon={<StarIcon className="w-6 h-6 text-yellow-400" />}
            title="Smart Scoring"
            description="Earn points based on difficulty and build streaks to level up faster"
            delay={600}
          />
        </div>

        {/* Achievement Preview */}
        <div
          className={`glass-card rounded-2xl p-6 mt-8 text-center ${
            isLoaded ? 'animate-slide-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '800ms' }}
        >
          <h3 className="text-xl font-bold text-white mb-4 gradient-text-static">
            Unlock Achievements & Track Progress
          </h3>
          
          <div className="flex justify-center space-x-6 text-indigo-200">
            <div className="text-center">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-xs font-medium">Level Master</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs font-medium">Speed Demon</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-xs font-medium">Perfect Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🧠</div>
              <div className="text-xs font-medium">Math Genius</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <div className="text-xs text-indigo-300 mb-2">
            Ready to challenge your mathematical prowess?
          </div>
          <div className="flex justify-center items-center space-x-2 text-indigo-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">AI System Ready</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
    