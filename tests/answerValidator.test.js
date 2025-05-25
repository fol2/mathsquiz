import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateExpression, validateQuestionAnswer } from '../dist-tests/services/answerValidator.js';

test('evaluateExpression handles arithmetic', () => {
  assert.strictEqual(evaluateExpression('2 + 3 * 4'), 14);
});

test('validateQuestionAnswer returns true for correct answer', () => {
  assert.ok(validateQuestionAnswer('2 + 2', 4));
});

test('validateQuestionAnswer returns false for incorrect answer', () => {
  assert.equal(validateQuestionAnswer('2 + 2', 5), false);
});

test('validateQuestionAnswer returns false for invalid expression', () => {
  assert.equal(validateQuestionAnswer('2 + bad', 2), false);
});
