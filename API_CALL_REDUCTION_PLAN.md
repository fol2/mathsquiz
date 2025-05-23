# API Call Reduction Strategy

This guide outlines approaches to reduce Google Gemini API calls while preserving the gameplay experience. The goal is to limit requests to **one call per game cycle** (ten questions) whenever possible, even when players level up.

## Key Concepts
- **Game Cycle:** A round of `TOTAL_QUESTIONS` questions. Currently `TOTAL_QUESTIONS = 10`.
- **Batch Size:** `BATCH_SIZE` controls how many questions are fetched per API request. It now matches `TOTAL_QUESTIONS` so a single call can serve a full cycle.
- **Leveling:** Players level up after `STRIKES_TO_LEVEL_UP` consecutive correct answers (default `3`). Leveling clears the current batch and fetches a new one for the higher difficulty.

## Strategies

1. **Increase Batch Size**
   - Set `BATCH_SIZE` equal to `TOTAL_QUESTIONS` so a single call provides enough questions for the entire cycle.
   - Adjust the AI prompt in `mathProblemService.ts` to request `BATCH_SIZE` questions in one call.
   - This guarantees one request if the player stays on the same level for the whole cycle.

2. **Predict Level Progression**
   - Since reaching high levels within one cycle is rare, ask the API for questions for several difficulty levels in the same call.
   - Modify `generateQuestionBatch` to return a structure containing problems for levels 1‑5. Distribute them as the player levels up.
   - If the player exceeds the predicted levels, make a fallback request for higher difficulty, but this is unlikely in current gameplay.

3. **Persist Unused Questions**
   - Store remaining questions in `localStorage` when the game ends or the page reloads.
   - On startup, load saved batches before making any API call. If enough questions remain from the previous cycle, no request is needed.
   - Use `clearQuestionCache` when changing the API key or wanting a fresh start.

4. **Adjust Game Rules**
   - Increasing `STRIKES_TO_LEVEL_UP` slows down leveling, reducing the need for multiple difficulty batches.
   - Limiting the maximum level reachable in one cycle (e.g., up to level 5) keeps the initial batch relevant.
   - Document any rule changes in this file to evaluate API usage impact.

## Recommended Configuration Example

```ts
// constants.ts
export const TOTAL_QUESTIONS = 10;
export const STRIKES_TO_LEVEL_UP = 3; // adjust if leveling too quickly

// services/mathProblemService.ts
const BATCH_SIZE = TOTAL_QUESTIONS; // one API call per cycle
```

With this setup, the game requests one batch of 10 questions when starting a cycle. Unused questions are saved to `localStorage` so restarting the game reuses them.

## Future Updates
When modifying difficulty progression or question count, revisit these guidelines:
- Ensure `BATCH_SIZE` is large enough for the new cycle length.
- Update the predicted maximum level if players begin reaching higher tiers within one cycle.
- Consider refreshing stored questions when rule changes make old batches obsolete.

