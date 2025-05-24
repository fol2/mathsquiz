import { DifficultyLevel } from './types.js';

export const STARTING_LEVEL: DifficultyLevel = DifficultyLevel.LEVEL_1;
export const MAX_LEVEL: DifficultyLevel = DifficultyLevel.LEVEL_20;
export const STRIKES_TO_LEVEL_UP: number = 3;
export const TIME_AT_LEVEL_ONE: number = 15; // seconds
export const TIME_AT_MAX_LEVEL: number = 600; // seconds
export const REVERSE_LOG_BASE: number = 10;
export const INITIAL_TIME_PER_QUESTION: number = TIME_AT_LEVEL_ONE;
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
    [DifficultyLevel.LEVEL_1]: "Little Explorer (Age 7)",
    [DifficultyLevel.LEVEL_2]: "Number Friend (Age 8)",
    [DifficultyLevel.LEVEL_3]: "Math Detective (Age 9)",
    [DifficultyLevel.LEVEL_4]: "Problem Solver (Age 10)",
    [DifficultyLevel.LEVEL_5]: "Math Adventurer (Age 11)",
    [DifficultyLevel.LEVEL_6]: "Equation Explorer (Age 12)",
    [DifficultyLevel.LEVEL_7]: "Algebra Apprentice (Age 13)",
    [DifficultyLevel.LEVEL_8]: "Math Navigator (Age 14)",
    [DifficultyLevel.LEVEL_9]: "Formula Fighter (Age 15)",
    [DifficultyLevel.LEVEL_10]: "Geometry Guardian (Age 16)",
    [DifficultyLevel.LEVEL_11]: "Calculus Cadet (Age 17)",
    [DifficultyLevel.LEVEL_12]: "Math Strategist (Age 18)",
    [DifficultyLevel.LEVEL_13]: "Advanced Analyst (Age 19)",
    [DifficultyLevel.LEVEL_14]: "Mathematical Mind (Age 20)",
    [DifficultyLevel.LEVEL_15]: "Logic Master (Age 21)",
    [DifficultyLevel.LEVEL_16]: "Theory Tactician (Age 22)",
    [DifficultyLevel.LEVEL_17]: "Abstract Ace (Age 23)",
    [DifficultyLevel.LEVEL_18]: "Mathematical Maestro (Age 24)",
    [DifficultyLevel.LEVEL_19]: "Research Researcher (Age 25)",
    [DifficultyLevel.LEVEL_20]: "Mathematics Scholar (MSc Level)"
};