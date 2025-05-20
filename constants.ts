
import { DifficultyLevel } from './types';

export const STARTING_LEVEL: DifficultyLevel = DifficultyLevel.LEVEL_1;
export const MAX_LEVEL: DifficultyLevel = DifficultyLevel.LEVEL_5;
export const STRIKES_TO_LEVEL_UP: number = 3;
export const INITIAL_TIME_PER_QUESTION: number = 30; // seconds (Increased from 20)
export const TIME_INCREMENT_PER_LEVEL: number = 3; // seconds (Was TIME_DECREMENT_PER_LEVEL, now time increases)
export const TOTAL_QUESTIONS: number = 10;

export const CORRECT_MESSAGES: string[] = [
  "Awesome! You nailed it! ✨",
  "You're a math whiz! 🧠💡",
  "Great job! Keep shining! ⭐",
  "Fantastic! That's the way! 🚀",
  "Super! You're on a roll! 🎉"
];

export const INCORRECT_MESSAGES: string[] = [
  "Not quite, but don't give up! 💪",
  "Almost there! Keep trying! 🎯",
  "Math is a journey! Let's try the next one. 🚶‍♂️",
  "Oops! Check your calculation. Every mistake is a lesson! 📚",
  "That's a tricky one! You'll get it next time! 👍"
];

export const LEVEL_UP_MESSAGES: string[] = [
  "LEVEL UP! You're unstoppable! 🏆",
  "Woohoo! New challenge unlocked! 🔓",
  "Amazing! You're getting smarter! 🌟",
  "Incredible! Prepare for tougher questions! 🔥",
  "You're a Math Genius in the making! 🌠"
];

export const DIFFICULTY_NAMES: Record<DifficultyLevel, string> = {
    [DifficultyLevel.LEVEL_1]: "Explorer",
    [DifficultyLevel.LEVEL_2]: "Solver",
    [DifficultyLevel.LEVEL_3]: "Strategist",
    [DifficultyLevel.LEVEL_4]: "Virtuoso",
    [DifficultyLevel.LEVEL_5]: "Genius"
};