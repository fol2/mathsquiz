export const POSITIVE_FEEDBACK_PATTERNS = [
  'Awesome',
  'Great',
  'Fantastic',
  'Super',
  'LEVEL UP',
  'Woohoo',
  'Amazing',
  'Incredible',
  'math whiz',
  'Math Genius',
  'nailed it',
  'Keep shining',
  'way!',
  'on a roll',
  'unstoppable',
  'unlocked',
  'smarter',
  'tougher questions',
  '✨',
  '🧠💡',
  '⭐',
  '🚀',
  '🎉',
  '🏆',
  '🔓',
  '🌟',
  '🔥',
  '🌠',
];

export const isPositiveFeedback = (message: string | null | undefined): boolean => {
  if (!message) return false;
  return POSITIVE_FEEDBACK_PATTERNS.some(pattern => message.includes(pattern));
};
