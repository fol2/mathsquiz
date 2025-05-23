export enum GameState {
  NOT_STARTED = 'NOT_STARTED',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  API_KEY_SETUP = 'API_KEY_SETUP',
}

export enum DifficultyLevel {
  LEVEL_1 = 1,   // Age 7
  LEVEL_2 = 2,   // Age 8
  LEVEL_3 = 3,   // Age 9
  LEVEL_4 = 4,   // Age 10
  LEVEL_5 = 5,   // Age 11
  LEVEL_6 = 6,   // Age 12
  LEVEL_7 = 7,   // Age 13
  LEVEL_8 = 8,   // Age 14
  LEVEL_9 = 9,   // Age 15
  LEVEL_10 = 10, // Age 16
  LEVEL_11 = 11, // Age 17
  LEVEL_12 = 12, // Age 18
  LEVEL_13 = 13, // Age 19
  LEVEL_14 = 14, // Age 20
  LEVEL_15 = 15, // Age 21
  LEVEL_16 = 16, // Age 22
  LEVEL_17 = 17, // Age 23
  LEVEL_18 = 18, // Age 24
  LEVEL_19 = 19, // Age 25
  LEVEL_20 = 20, // Age 26 (MSc Math level)
}

export interface MathProblem {
  id: string;
  questionText: string;
  answer: number;
  difficulty: DifficultyLevel;
  problemType: ProblemType;
  explanation?: string; // For future use
  hasLatex?: boolean; // Indicates if question contains LaTeX
}

export enum ProblemType {
  AI_GENERATED = 'AI_GENERATED', // AI-generated questions
  ERROR_GENERATING = 'ERROR_GENERATING', // Type for when AI fails
}

export interface QuestionBatch {
  questions: MathProblem[];
  level: DifficultyLevel;
  timestamp: number;
}