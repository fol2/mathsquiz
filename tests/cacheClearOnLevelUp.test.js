import test from 'node:test';
import assert from 'node:assert/strict';

class FakeLocalStorage {
  constructor() { this.store = {}; }
  getItem(key) { return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null; }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
}

test('cached batch is removed when clearBatchForLevel is called', async () => {
  globalThis.localStorage = new FakeLocalStorage();

  const level = 2;
  const fakeBatch = {
    questions: [
      { id: 'q1', questionText: '1+1', answer: 2, difficulty: level, problemType: 'AI_GENERATED', hasLatex: false }
    ],
    level,
    timestamp: Date.now()
  };

  localStorage.setItem('mathGeniusBatches', JSON.stringify({ [level]: fakeBatch }));

  const { clearBatchForLevel } = await import('../dist-tests/services/mathProblemService.js');

  assert.ok(JSON.parse(localStorage.getItem('mathGeniusBatches')).hasOwnProperty(level));

  clearBatchForLevel(level);

  assert.deepEqual(JSON.parse(localStorage.getItem('mathGeniusBatches') ?? '{}'), {});
});
