import { DifficultyLevel } from '../types.js';

/**
 * Calculate the points awarded for a correct answer at a given difficulty level.
 * Each level awards 10 points multiplied by the numeric level.
 * @param level The difficulty level of the question.
 * @returns Number of points awarded.
 */
export const pointsForLevel = (level: DifficultyLevel): number => {
  if (level < DifficultyLevel.LEVEL_1 || level > DifficultyLevel.LEVEL_20) {
    throw new Error('Invalid difficulty level');
  }
  return level * 10;
};
