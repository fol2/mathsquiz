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
    <div className="w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-xl shadow-2xl rounded-xl p-6 md:p-8 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          🧠 Math Genius Challenge
        </h1>
        <p className="text-xl text-indigo-100">
          Enter your Google Gemini API key to get started
        </p>
      </div>

      <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-blue-300 text-lg">🔑</span>
          <h3 className="text-lg font-semibold text-blue-200">Why do you need an API key?</h3>
        </div>
        <p className="text-blue-100 text-sm leading-relaxed">
          This app uses Google's Gemini AI to generate personalized math problems. 
          To protect our costs and give you full control, you'll use your own API key. 
          Don't worry - it's free to get and use!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-indigo-200 mb-2">
            Google Gemini API Key
          </label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Enter your API key here..."
            className="w-full p-4 text-lg bg-gray-800/90 text-white placeholder-gray-300 rounded-lg border-2 border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/50 outline-none transition-all duration-300 backdrop-blur-sm shadow-lg"
            disabled={isValidating}
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isValidating || !apiKey.trim()}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md transform transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isValidating ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="small" />
              <span>Validating...</span>
            </div>
          ) : (
            'Start Playing'
          )}
        </button>
      </form>

      <div className="space-y-3">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="text-yellow-300 hover:text-yellow-200 text-sm underline transition-colors"
        >
          {showInstructions ? 'Hide' : 'Show'} instructions: How to get a free API key
        </button>

        {showInstructions && (
          <div className="bg-yellow-900/30 border border-yellow-400/30 rounded-lg p-4 space-y-3 text-sm">
            <h4 className="font-semibold text-yellow-200">How to get your free Google Gemini API key:</h4>
            <ol className="text-yellow-100 space-y-2 list-decimal list-inside">
              <li>
                Go to{' '}
                <a 
                  href="https://aistudio.google.com/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-300 hover:text-blue-200 underline"
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
            <div className="bg-yellow-800/30 rounded p-2 mt-3">
              <p className="text-yellow-200 text-xs">
                <strong>Note:</strong> The free tier includes generous limits perfect for this game. 
                Your API key is stored locally in your browser and never shared.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-indigo-300 text-xs">
          Your API key is stored securely in your browser and never sent to our servers.
        </p>
      </div>
    </div>
  );
};

export default ApiKeySetup; 