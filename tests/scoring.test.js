import test from 'node:test';
import assert from 'node:assert/strict';
import { pointsForLevel } from '../dist-tests/services/scoring.js';
import { DifficultyLevel } from '../dist-tests/types.js';

test('pointsForLevel awards 10 points per level', () => {
  assert.strictEqual(pointsForLevel(DifficultyLevel.LEVEL_1), 10);
  assert.strictEqual(pointsForLevel(DifficultyLevel.LEVEL_5), 50);
});

test('pointsForLevel throws for invalid level', () => {
  assert.throws(() => pointsForLevel(0), /Invalid difficulty level/);
});
