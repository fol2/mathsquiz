import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProblem } from '../dist-tests/services/mathProblemService.js';
import { DifficultyLevel, ProblemType } from '../dist-tests/types.js';

// When no API key is configured, generateProblem should still
// return a placeholder problem with the requested difficulty.

test('first generated problem matches requested level', async () => {
  const level = DifficultyLevel.LEVEL_3;
  const problem = await generateProblem(level);
  assert.equal(problem.difficulty, level);
  assert.equal(problem.problemType, ProblemType.ERROR_GENERATING);
});
