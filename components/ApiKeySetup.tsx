import React, { useState } from 'react';
import { validateApiKey, setApiKey } from '../services/mathProblemService';
import LoadingSpinner from './LoadingSpinner';

interface ApiKeySetupProps {
  onComplete: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onComplete }) => {
  const [apiKey, setApiKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const isValid = await validateApiKey(apiKey);
      if (isValid) {
        setApiKey(apiKey);
        onComplete();
      } else {
        setError('Invalid API key. Please check your key and try again.');
      }
    } catch (error) {
      setError('Failed to validate API key. Please check your internet connection and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mobile-container">
      <div className="glass-card-strong rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 animate-slide-up">
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            🧠 Math Genius Challenge
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-indigo-100">
            Enter your Google Gemini API key to get started
          </p>
        </div>

        <div className="glass-card bg-blue-900/30 border border-blue-400/30 rounded-xl p-3 sm:p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-blue-300 text-lg sm:text-xl">🔑</span>
            <h3 className="text-base sm:text-lg font-semibold text-blue-200">Why do you need an API key?</h3>
          </div>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            This app uses Google's Gemini AI to generate personalized math problems. 
            To protect our costs and give you full control, you'll use your own API key. 
            Don't worry - it's free to get and use!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="api-key" className="block text-sm sm:text-base font-medium text-indigo-200 mb-2">
              Google Gemini API Key
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Enter your API key here..."
              className="w-full p-3 sm:p-4 text-white bg-gray-900/60 backdrop-blur-sm rounded-xl border-2 border-gray-600/50 focus:border-sky-400 focus:ring-2 focus:ring-sky-300 focus:bg-gray-800/80 outline-none transition-all placeholder:text-gray-400 input-mobile-optimized touch-target-comfortable"
              disabled={isValidating}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {error && (
            <div className="glass-card bg-red-500/20 border border-red-400/30 rounded-xl p-3 sm:p-4 animate-shake">
              <p className="text-red-200 text-sm sm:text-base break-words">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isValidating || !apiKey.trim()}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 active:from-green-600 active:to-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-lg sm:text-xl shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 touch-target-comfortable"
          >
            {isValidating ? (
              <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                <LoadingSpinner size="small" />
                <span>Validating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>Start Playing</span>
              </div>
            )}
          </button>
        </form>

        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-yellow-300 hover:text-yellow-200 active:text-yellow-400 text-sm sm:text-base underline transition-colors touch-target"
          >
            {showInstructions ? 'Hide' : 'Show'} instructions: How to get a free API key
          </button>

          {showInstructions && (
            <div className="glass-card bg-yellow-900/30 border border-yellow-400/30 rounded-xl p-3 sm:p-4 space-y-3 text-sm sm:text-base animate-scale-in">
              <h4 className="font-semibold text-yellow-200 text-base sm:text-lg">How to get your free Google Gemini API key:</h4>
              <ol className="text-yellow-100 space-y-2 list-decimal list-inside pl-2">
                <li>
                  Go to{' '}
                  <a 
                    href="https://aistudio.google.com/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-300 hover:text-blue-200 active:text-blue-400 underline transition-colors"
                  >
                    Google AI Studio
                  </a>
                </li>
                <li>Sign in with your Google account</li>
                <li>Click "Create API Key"</li>
                <li>Select or create a Google Cloud project</li>
                <li>Copy the generated API key</li>
                <li>Paste it above and start playing!</li>
              </ol>
              <div className="glass-card bg-yellow-800/30 rounded-lg p-3 mt-3">
                <p className="text-yellow-200 text-xs sm:text-sm">
                  <strong>Note:</strong> The free tier includes generous limits perfect for this game. 
                  Your API key is stored locally in your browser and never shared.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-indigo-300 text-xs sm:text-sm">
            🔒 Your API key is stored securely in your browser and never sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup; 