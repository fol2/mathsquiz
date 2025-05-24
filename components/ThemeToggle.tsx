import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors duration-200 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <span role="img" aria-label="sun" className="inline-block w-5 h-5 text-yellow-400">
          🌞
        </span>
      ) : (
        <span role="img" aria-label="moon" className="inline-block w-5 h-5 text-blue-300">
          🌜
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
