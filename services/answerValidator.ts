export const evaluateExpression = (expr: string): number => {
  const allowed = /^[0-9+\-*/().\s]+$/;
  if (!allowed.test(expr.trim())) {
    throw new Error('Expression contains invalid characters');
  }
  try {
    const result = Function(`"use strict"; return (${expr})`)();
    if (typeof result !== 'number' || Number.isNaN(result)) {
      throw new Error('Expression did not evaluate to a number');
    }
    return result;
  } catch {
    throw new Error('Failed to evaluate expression');
  }
};

export const validateQuestionAnswer = (
  questionText: string,
  answer: number,
  tolerance = 1e-6
): boolean => {
  try {
    const computed = evaluateExpression(questionText);
    return Math.abs(computed - answer) < tolerance;
  } catch {
    return false;
  }
};
