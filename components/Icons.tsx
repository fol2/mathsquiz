import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export const TimerIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="timer" className={`inline-block ${className}`} {...props}>
    ⏱️
  </span>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="correct" className={`inline-block ${className}`} {...props}>
    ✅
  </span>
);

export const XCircleIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="incorrect" className={`inline-block ${className}`} {...props}>
    ❌
  </span>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="sparkles" className={`inline-block ${className}`} {...props}>
    ✨
  </span>
);

export const StarIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="star" className={`inline-block ${className}`} {...props}>
    ⭐
  </span>
);

export const TrendingUpIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="trending up" className={`inline-block ${className}`} {...props}>
    📈
  </span>
);

export const ArrowUpIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="arrow up" className={`inline-block ${className}`} {...props}>
    ⬆️
  </span>
);

export const TrophyIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="trophy" className={`inline-block ${className}`} {...props}>
    🏆
  </span>
);

export const RefreshIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="refresh" className={`inline-block ${className}`} {...props}>
    🔄
  </span>
);

export const GeniusIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="genius" className={`inline-block ${className}`} {...props}>
    🧠
  </span>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="alert" className={`inline-block ${className}`} {...props}>
    ⚠️
  </span>
);

export const PlayIcon: React.FC<IconProps> = ({ className = '', ...props }) => (
  <span role="img" aria-label="play" className={`inline-block ${className}`} {...props}>
    ▶️
  </span>
);
