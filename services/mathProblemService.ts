import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MathProblem, DifficultyLevel, ProblemType, QuestionBatch } from '../types';

// Store for user-provided API key
let userApiKey: string | null = null;
let ai: GoogleGenAI | null = null;

// Question batches cache
const questionBatches = new Map<DifficultyLevel, QuestionBatch>();

// Batch size for API calls
const BATCH_SIZE = 5;
const BATCH_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

export const setApiKey = (apiKey: string): boolean => {
  try {
    userApiKey = apiKey.trim();
    if (userApiKey) {
      ai = new GoogleGenAI({ apiKey: userApiKey });
      // Clear existing batches when API key changes
      questionBatches.clear();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI with provided API key:", error);
    ai = null;
    userApiKey = null;
    return false;
  }
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const testAi = new GoogleGenAI({ apiKey: apiKey.trim() });
    // Test with a simple request
    const response = await testAi.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: "Test connection. Respond with just: OK",
      config: {
        maxOutputTokens: 10,
      }
    });
    return !!response.text;
  } catch (error) {
    console.error("API key validation failed:", error);
    return false;
  }
};

export const hasValidApiKey = (): boolean => {
  return !!userApiKey && !!ai;
};

const getDifficultyDescription = (level: DifficultyLevel): string => {
  switch (level) {
    case DifficultyLevel.LEVEL_1: return "very basic arithmetic (addition, subtraction, multiplication, division) with small positive integers. Single step.";
    case DifficultyLevel.LEVEL_2: return "simple algebra (e.g., find x in 2x + 3 = 7 or x/3 - 1 = 4) or slightly harder arithmetic. Single or two steps.";
    case DifficultyLevel.LEVEL_3: return "problems involving fractions, decimals, or percentages. May include simple word problems. Up to two or three steps.";
    case DifficultyLevel.LEVEL_4: return "basic geometry (area, perimeter of simple shapes like rectangles or squares), multi-step arithmetic, or intermediate word problems (e.g., rate/time/distance, simple ratios).";
    case DifficultyLevel.LEVEL_5: return "advanced algebra (multi-step equations, possibly with variables on both sides), or more complex multi-step word problems requiring careful reading.";
    default: return "general math for a 13-14 year old.";
  }
};

const getTopicHints = (level: DifficultyLevel): string[] => {
  const topicsByLevel: Record<DifficultyLevel, string[]> = {
    [DifficultyLevel.LEVEL_1]: ["addition", "subtraction", "multiplication", "division", "basic number operations"],
    [DifficultyLevel.LEVEL_2]: ["simple algebra with x", "order of operations", "two-step arithmetic", "basic equations"],
    [DifficultyLevel.LEVEL_3]: ["fractions operations", "decimal operations", "percentage calculations", "basic word problems", "mixed numbers"],
    [DifficultyLevel.LEVEL_4]: ["area of rectangles", "perimeter of rectangles", "rate-time-distance problems", "ratio and proportion problems", "circles and basic geometry"],
    [DifficultyLevel.LEVEL_5]: ["multi-step algebraic equations", "complex word problems involving multiple operations", "geometry word problems", "quadratic expressions", "systems of simple equations"],
  };
  return topicsByLevel[level] || topicsByLevel[DifficultyLevel.LEVEL_1];
};

const generateBetterFallbackProblem = (level: DifficultyLevel): MathProblem => {
  console.warn(`Using improved fallback problem generator for level ${level}.`);
  
  const fallbacksByLevel: Record<DifficultyLevel, () => MathProblem> = {
    [DifficultyLevel.LEVEL_1]: () => {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 15) + 1;
      const operations = [
        { op: '+', question: `\\text{What is } ${a} + ${b}\\text{?}`, answer: a + b },
        { op: '-', question: `\\text{What is } ${Math.max(a, b)} - ${Math.min(a, b)}\\text{?}`, answer: Math.max(a, b) - Math.min(a, b) },
        { op: '×', question: `\\text{What is } ${Math.min(a, 10)} \\times ${Math.min(b, 8)}\\text{?}`, answer: Math.min(a, 10) * Math.min(b, 8) },
        { op: '÷', question: `\\text{What is } ${a * b} \\div ${b}\\text{?}`, answer: a },
      ];
      const chosen = operations[Math.floor(Math.random() * operations.length)];
      return {
        id: `fallback-L1-${Date.now()}`,
        questionText: chosen.question,
        answer: chosen.answer,
        difficulty: level,
        problemType: ProblemType.ERROR_GENERATING,
        hasLatex: true,
      };
    },
    
    [DifficultyLevel.LEVEL_2]: () => {
      const x = Math.floor(Math.random() * 10) + 1;
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 20) + 1;
      const equations = [
        { question: `\\text{Solve for } x\\text{: } ${a}x + ${b} = ${a * x + b}`, answer: x },
        { question: `\\text{Find } x\\text{: } \\frac{x}{${a}} + ${b} = ${Math.floor(x/a) + b}`, answer: x },
        { question: `\\text{What is } x \\text{ if } ${a}x - ${b} = ${a * x - b}\\text{?}`, answer: x },
      ];
      const chosen = equations[Math.floor(Math.random() * equations.length)];
      return {
        id: `fallback-L2-${Date.now()}`,
        questionText: chosen.question,
        answer: chosen.answer,
        difficulty: level,
        problemType: ProblemType.ERROR_GENERATING,
        hasLatex: true,
      };
    },
    
    [DifficultyLevel.LEVEL_3]: () => {
      const problems = [
        { question: "\\text{What is } \\frac{1}{2} + \\frac{1}{4}\\text{?}", answer: 0.75 },
        { question: "\\text{What is } 0.5 \\times 6\\text{?}", answer: 3 },
        { question: "\\text{What is } 25\\% \\text{ of } 80\\text{?}", answer: 20 },
        { question: "\\text{Convert } \\frac{3}{4} \\text{ to a decimal}", answer: 0.75 },
        { question: "\\text{What is } 2.5 + 1.75\\text{?}", answer: 4.25 },
      ];
      const chosen = problems[Math.floor(Math.random() * problems.length)];
      return {
        id: `fallback-L3-${Date.now()}`,
        questionText: chosen.question,
        answer: chosen.answer,
        difficulty: level,
        problemType: ProblemType.ERROR_GENERATING,
        hasLatex: true,
      };
    },
    
    [DifficultyLevel.LEVEL_4]: () => {
      const length = Math.floor(Math.random() * 10) + 5;
      const width = Math.floor(Math.random() * 8) + 3;
      const problems = [
        { question: `\\text{What is the area of a rectangle with length } ${length} \\text{ and width } ${width}\\text{?}`, answer: length * width },
        { question: `\\text{What is the perimeter of a rectangle with length } ${length} \\text{ and width } ${width}\\text{?}`, answer: 2 * (length + width) },
        { question: `\\text{A car travels } 60 \\text{ km/h for } 2 \\text{ hours. How far does it travel?}`, answer: 120 },
        { question: `\\text{If } 3 \\text{ apples cost } \\$6\\text{, how much do } 5 \\text{ apples cost?}`, answer: 10 },
      ];
      const chosen = problems[Math.floor(Math.random() * problems.length)];
      return {
        id: `fallback-L4-${Date.now()}`,
        questionText: chosen.question,
        answer: chosen.answer,
        difficulty: level,
        problemType: ProblemType.ERROR_GENERATING,
        hasLatex: true,
      };
    },
    
    [DifficultyLevel.LEVEL_5]: () => {
      const x = Math.floor(Math.random() * 8) + 2;
      const problems = [
        { question: `\\text{Solve: } 3x + 7 = 2x + 15`, answer: 8 },
        { question: `\\text{Find } x\\text{: } 2(x + 3) = 18`, answer: 6 },
        { question: `\\text{What is } x \\text{ if } x^2 - 9 = 16\\text{?}`, answer: 5 },
        { question: `\\text{If } y = 2x + 1 \\text{ and } y = 7\\text{, what is } x\\text{?}`, answer: 3 },
      ];
      const chosen = problems[Math.floor(Math.random() * problems.length)];
      return {
        id: `fallback-L5-${Date.now()}`,
        questionText: chosen.question,
        answer: chosen.answer,
        difficulty: level,
        problemType: ProblemType.ERROR_GENERATING,
        hasLatex: true,
      };
    },
  };

  return fallbacksByLevel[level]();
};

const generateQuestionBatch = async (level: DifficultyLevel): Promise<QuestionBatch> => {
  if (!ai) {
    throw new Error("AI client not initialized");
  }

  const difficultyDescription = getDifficultyDescription(level);
  const topics = getTopicHints(level);
  
  const prompt = `
You are a math question generator. Create exactly ${BATCH_SIZE} diverse math problems suitable for Year 9 students (13-14 years old).

Difficulty Level: "${difficultyDescription}"
Topics to include (use variety): ${topics.join(', ')}

Requirements:
1. Generate exactly ${BATCH_SIZE} different problems
2. Each problem should have different topics/approaches
3. Include some problems that benefit from LaTeX formatting (fractions, equations, etc.)
4. Answer must be a single numerical value
5. Problems should be clear and solvable

Response format (JSON array):
[
  {
    "questionText": "Question here (use LaTeX for math expressions like \\\\frac{1}{2} or x^2)",
    "answer": 42,
    "hasLatex": true
  },
  ...
]

Examples of LaTeX usage:
- Fractions: \\\\frac{3}{4}
- Exponents: x^2, 2^3
- Square roots: \\\\sqrt{16}
- Equations: 2x + 3 = 7

Generate ${BATCH_SIZE} problems now:
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
      }
    });
    
    let jsonStr = response.text?.trim() || '';
    
    // Clean up response
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsed = JSON.parse(jsonStr);
    
    if (Array.isArray(parsed) && parsed.length === BATCH_SIZE) {
      const questions: MathProblem[] = parsed.map((item, index) => {
        if (typeof item.questionText === 'string' && typeof item.answer === 'number') {
          return {
            id: `ai-batch-${level}-${Date.now()}-${index}`,
            questionText: item.questionText,
            answer: item.answer,
            difficulty: level,
            problemType: ProblemType.AI_GENERATED,
            hasLatex: item.hasLatex || false,
          };
        } else {
          throw new Error(`Invalid question format at index ${index}`);
        }
      });
      
      return {
        questions,
        level,
        timestamp: Date.now(),
      };
    } else {
      throw new Error(`Expected ${BATCH_SIZE} questions, got ${Array.isArray(parsed) ? parsed.length : 'non-array'}`);
    }
  } catch (error) {
    console.error("Error generating question batch:", error);
    throw error;
  }
};

const getFromBatch = (level: DifficultyLevel): MathProblem | null => {
  const batch = questionBatches.get(level);
  if (!batch) return null;
  
  // Check if batch is expired
  if (Date.now() - batch.timestamp > BATCH_EXPIRY_TIME) {
    questionBatches.delete(level);
    return null;
  }
  
  // Get next question from batch
  const question = batch.questions.shift();
  if (!question) {
    questionBatches.delete(level);
    return null;
  }
  
  return question;
};

const prefetchBatch = async (level: DifficultyLevel): Promise<void> => {
  if (!hasValidApiKey()) return;
  
  try {
    const batch = await generateQuestionBatch(level);
    questionBatches.set(level, batch);
    console.log(`Prefetched batch of ${batch.questions.length} questions for level ${level}`);
  } catch (error) {
    console.error(`Failed to prefetch batch for level ${level}:`, error);
  }
};

export const generateProblem = async (level: DifficultyLevel): Promise<MathProblem> => {
  if (!hasValidApiKey()) {
    console.warn("No valid API key available, using fallback problem");
    return generateBetterFallbackProblem(level);
  }

  // Try to get from existing batch first
  const batchQuestion = getFromBatch(level);
  if (batchQuestion) {
    // Prefetch new batch if this was the last question
    const remainingBatch = questionBatches.get(level);
    if (!remainingBatch || remainingBatch.questions.length <= 1) {
      prefetchBatch(level); // Don't wait for this
    }
    return batchQuestion;
  }

  // No batch available, generate new one
  try {
    const batch = await generateQuestionBatch(level);
    const question = batch.questions.shift();
    if (!question) {
      throw new Error("Generated batch was empty");
    }
    
    // Store remaining questions
    if (batch.questions.length > 0) {
      questionBatches.set(level, batch);
    }
    
    return question;
  } catch (error) {
    console.error("Failed to generate AI problem, using fallback:", error);
    return generateBetterFallbackProblem(level);
  }
};

// Clear all cached batches (useful when changing API keys or restarting)
export const clearQuestionCache = (): void => {
  questionBatches.clear();
};