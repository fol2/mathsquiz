import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MathProblem, DifficultyLevel, ProblemType } from '../types';

// IMPORTANT: The API key MUST be set in the environment variable process.env.API_KEY
// Do NOT hardcode the API key here or anywhere in the frontend code.
// For local development, you might use a .env file and a bundler that supports environment variables.
// In a deployed environment, this variable should be set securely.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI. Ensure API_KEY is valid.", error);
    // ai remains null, generateProblem will use fallback.
  }
} else {
  console.warn("API_KEY environment variable not found. Math problem generation will use fallbacks.");
}

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

const getTopicHint = (level: DifficultyLevel): string => {
  const topicsByLevel: Record<DifficultyLevel, string[]> = {
    [DifficultyLevel.LEVEL_1]: ["addition", "subtraction", "multiplication", "division"],
    [DifficultyLevel.LEVEL_2]: ["simple algebra with x", "order of operations", "two-step arithmetic"],
    [DifficultyLevel.LEVEL_3]: ["fractions operations", "decimal operations", "percentage calculations", "basic word problems"],
    [DifficultyLevel.LEVEL_4]: ["area of rectangles", "perimeter of rectangles", "rate-time-distance problems", "ratio and proportion problems"],
    [DifficultyLevel.LEVEL_5]: ["multi-step algebraic equations", "complex word problems involving multiple operations", "geometry word problems"],
  };
  const topics = topicsByLevel[level] || topicsByLevel[DifficultyLevel.LEVEL_1];
  return topics[Math.floor(Math.random() * topics.length)];
};

const generateFallbackProblem = (level: DifficultyLevel): MathProblem => {
  console.warn(`Falling back to local problem generator for level ${level}.`);
  const a = Math.floor(Math.random() * 10) + 1 * level;
  const b = Math.floor(Math.random() * 10) + 1;
  return {
    id: `fallback-${Date.now()}`,
    questionText: `Fallback: What is ${a} + ${b}? (Error generating AI question)`,
    answer: a + b,
    difficulty: level,
    problemType: ProblemType.ERROR_GENERATING,
  };
};


export const generateProblem = async (level: DifficultyLevel): Promise<MathProblem> => {
  if (!ai) {
    console.error("Gemini AI client not initialized. API_KEY might be missing or invalid.");
    return generateFallbackProblem(level);
  }

  const difficultyDescription = getDifficultyDescription(level);
  const topicHint = getTopicHint(level);

  const prompt = `
You are a math question generator. Your task is to create a math problem suitable for a Year 9 student (13-14 years old).
The difficulty level is: "${difficultyDescription}".
The problem should focus on the topic of: "${topicHint}".

Please provide your response as a single, valid JSON object with exactly two keys:
1. "questionText": A string containing the math problem. This should be the question only, e.g., "What is 5 + 7?" or "If a car travels at 60 km/h for 3 hours, how far does it travel?".
2. "answer": A number representing the correct answer.

Constraints:
- The questionText should be clear and concise.
- The answer must be a single numerical value. If the problem involves fractions or decimals, the answer should be the numerical result (e.g., 0.5 instead of 1/2, or 3.14).
- Ensure the question is solvable and appropriate for the specified difficulty and topic.
- Do not include any introductory text, explanations, or markdown formatting like \`\`\`json \`\`\` outside of the JSON object itself. Strictly only the JSON object.

Example of a valid response:
{
  "questionText": "If a rectangle has a length of 10 units and a width of 5 units, what is its area?",
  "answer": 50
}

Now, generate a new problem.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17", // Use the recommended text model
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });
    
    let jsonStr = response.text?.trim() || '';
    // Remove markdown fences if present (Gemini might sometimes add them)
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsed = JSON.parse(jsonStr);

    if (typeof parsed.questionText === 'string' && typeof parsed.answer === 'number') {
      return {
        id: `ai-${Date.now()}`,
        questionText: parsed.questionText,
        answer: parsed.answer,
        difficulty: level,
        problemType: ProblemType.AI_GENERATED,
      };
    } else {
      console.error("Gemini response format error: 'questionText' or 'answer' missing or wrong type.", parsed);
      return generateFallbackProblem(level);
    }
  } catch (error) {
    console.error("Error generating problem with Gemini API:", error);
    return generateFallbackProblem(level);
  }
};
