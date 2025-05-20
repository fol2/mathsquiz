export enum GameState {
  NOT_STARTED = 'NOT_STARTED',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export enum DifficultyLevel {
  LEVEL_1 = 1, // Basic Arithmetic: +, -, *, / with small integers
  LEVEL_2 = 2, // Simple Algebra: e.g., 2x + 3 = 7, or x/2 - 1 = 3
  LEVEL_3 = 3, // Fractions/Decimals/Percentages: e.g., 1/2 + 1/4, 0.5 * 3, 20% of 50. Basic word problems.
  LEVEL_4 = 4, // Geometry: Area/Perimeter. Multi-step arithmetic. Intermediate word problems.
  LEVEL_5 = 5, // Advanced Algebra/Multi-step equations. More complex word problems.
}

export interface MathProblem {
  id: string;
  questionText: string;
  answer: number;
  difficulty: DifficultyLevel;
  problemType: ProblemType;
  explanation?: string; // For future use
}

export enum ProblemType {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION',
  SIMPLE_ALGEBRA_X = 'SIMPLE_ALGEBRA_X', // e.g. ax + b = c
  SIMPLE_ALGEBRA_DIV_X = 'SIMPLE_ALGEBRA_DIV_X', // e.g. x/a + b = c
  FRACTION_ADD_SUB = 'FRACTION_ADD_SUB',
  DECIMAL_OPERATIONS = 'DECIMAL_OPERATIONS', 
  PERCENTAGE_OF_NUMBER = 'PERCENTAGE_OF_NUMBER',
  AREA_RECTANGLE = 'AREA_RECTANGLE',
  PERIMETER_RECTANGLE = 'PERIMETER_RECTANGLE',
  ALGEBRA_MULTI_STEP = 'ALGEBRA_MULTI_STEP',
  WORD_PROBLEM_BASIC_OPERATIONS = 'WORD_PROBLEM_BASIC_OPERATIONS',
  WORD_PROBLEM_RATE_TIME_DISTANCE = 'WORD_PROBLEM_RATE_TIME_DISTANCE',
  WORD_PROBLEM_RATIO_PROPORTION = 'WORD_PROBLEM_RATIO_PROPORTION',
  WORD_PROBLEM_MULTI_STEP_ARITHMETIC = 'WORD_PROBLEM_MULTI_STEP_ARITHMETIC',
  AI_GENERATED = 'AI_GENERATED', // New type for AI-generated questions
  ERROR_GENERATING = 'ERROR_GENERATING', // Type for when AI fails
}