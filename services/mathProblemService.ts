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
  const age = level + 6; // Level 1 = Age 7, Level 2 = Age 8, etc.
  
  if (age <= 10) {
    return `age ${age} elementary school level math. Focus on basic arithmetic, simple number operations, and foundational concepts appropriate for a ${age}-year-old child.`;
  } else if (age <= 14) {
    return `age ${age} middle school level math. Include pre-algebra, basic geometry, fractions, decimals, percentages, and word problems suitable for a ${age}-year-old student.`;
  } else if (age <= 18) {
    return `age ${age} high school level math. Cover algebra, geometry, trigonometry, and advanced mathematical concepts appropriate for a ${age}-year-old high school student.`;
  } else if (age <= 22) {
    return `age ${age} undergraduate college level math. Include calculus, linear algebra, statistics, and university-level mathematical concepts suitable for a ${age}-year-old college student.`;
  } else {
    return `age ${age} graduate/MSc level mathematics. Focus on advanced mathematical theory, complex analysis, abstract algebra, and research-level mathematical concepts appropriate for graduate studies.`;
  }
};

const getTopicHints = (level: DifficultyLevel): string[] => {
  const age = level + 6; // Level 1 = Age 7, etc.
  
  if (age <= 8) {
    return ["counting", "addition", "subtraction", "simple number recognition", "basic shapes"];
  } else if (age <= 10) {
    return ["multiplication", "division", "basic fractions", "time", "money", "measurement"];
  } else if (age <= 12) {
    return ["decimals", "percentages", "area", "perimeter", "basic algebra", "simple equations"];
  } else if (age <= 14) {
    return ["linear equations", "coordinate geometry", "probability", "statistics", "ratio and proportion"];
  } else if (age <= 16) {
    return ["quadratic equations", "functions", "trigonometry basics", "exponentials", "logarithms"];
  } else if (age <= 18) {
    return ["advanced trigonometry", "calculus introduction", "sequences and series", "complex numbers"];
  } else if (age <= 20) {
    return ["differential calculus", "integral calculus", "linear algebra", "discrete mathematics"];
  } else if (age <= 22) {
    return ["multivariable calculus", "differential equations", "abstract algebra", "real analysis"];
  } else {
    return ["topology", "functional analysis", "measure theory", "advanced number theory", "algebraic geometry"];
  }
};

const generateErrorProblem = (level: DifficultyLevel, errorMessage: string = "Unable to generate AI question"): MathProblem => {
  return {
    id: `error-${level}-${Date.now()}`,
    questionText: errorMessage,
    answer: 0,
    difficulty: level,
    problemType: ProblemType.ERROR_GENERATING,
    hasLatex: false,
  };
};

const generateQuestionBatch = async (level: DifficultyLevel): Promise<QuestionBatch> => {
  if (!ai) {
    throw new Error("AI client not initialized");
  }

  const age = level + 6; // Level 1 = Age 7, etc.
  const difficultyDescription = getDifficultyDescription(level);
  const topics = getTopicHints(level);
  
  const educationalLevel = age <= 10 ? "elementary school" : 
                          age <= 14 ? "middle school" : 
                          age <= 18 ? "high school" : 
                          age <= 22 ? "undergraduate university" : 
                          "graduate/MSc level";
  
  const prompt = `
You are an expert mathematics educator creating ${BATCH_SIZE} diverse math problems for ${educationalLevel} level.

Target Age: ${age} years old
Educational Context: ${difficultyDescription}
Mathematical Topics: ${topics.join(', ')}

Requirements:
1. Generate exactly ${BATCH_SIZE} different problems appropriate for a ${age}-year-old student
2. Each problem should cover different mathematical concepts from the topic list
3. Problems should be challenging but achievable for the target age
4. Use LaTeX formatting for mathematical expressions (fractions, equations, symbols, etc.)
5. Each answer must be a single numerical value (integer or decimal)
6. Ensure problems are educationally appropriate and engaging

Examples of LaTeX formatting:
- Fractions: \\\\frac{3}{4}, \\\\frac{x+1}{2}
- Exponents: x^2, 2^3, e^x
- Square roots: \\\\sqrt{16}, \\\\sqrt{x^2 + 1}
- Greek letters: \\\\pi, \\\\theta, \\\\alpha
- Integrals: \\\\int_0^1 x^2 \\, dx
- Matrices: \\\\begin{pmatrix} a & b \\\\ c & d \\\\end{pmatrix}
- Limits: \\\\lim_{x \\to 0} \\\\frac{\\\\sin x}{x}

Age-specific guidelines:
${age <= 10 ? "- Use concrete, visual problems with small numbers\n- Include real-world contexts (toys, animals, food)\n- Keep language simple and clear" :
  age <= 14 ? "- Include word problems with relatable scenarios\n- Introduce abstract thinking gradually\n- Use moderate computational complexity" :
  age <= 18 ? "- Include advanced mathematical concepts and notation\n- Problems can be multi-step and require deeper reasoning\n- Use mathematical terminology appropriately" :
  age <= 22 ? "- Include university-level mathematical rigor\n- Problems should demonstrate understanding of advanced concepts\n- Use formal mathematical language and notation" :
  "- Include graduate-level mathematical sophistication\n- Problems should require deep mathematical insight\n- Use advanced mathematical theory and abstract concepts"}

Response format (JSON array):
[
  {
    "questionText": "Question here with proper LaTeX formatting",
    "answer": 42.5,
    "hasLatex": true
  },
  ...
]

Generate ${BATCH_SIZE} problems now:
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 3072, // Increased for more complex problems
        temperature: 0.8, // Add some creativity
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
    return generateErrorProblem(level, "No API key configured. Please set up your Google AI API key.");
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
    console.error("Failed to generate AI problem:", error);
    return generateErrorProblem(level, "Failed to generate AI question. Please check your connection.");
  }
};

// Clear all cached batches (useful when changing API keys or restarting)
export const clearQuestionCache = (): void => {
  questionBatches.clear();
};