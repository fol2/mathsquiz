# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set the `GEMINI_API_KEY` to your Gemini API key
3. Run the app:
   `npm run dev`

## Audio Files

The app expects a `sounds/` directory in the project root containing the
following files:

```
sounds/
├─ awesome.mp3
├─ amazing.mp3
├─ astonishing.mp3
└─ level_up.mp3
```

These sound effects are not included in the repository. You can create your own
or download free alternatives from a royalty‑free sound library (e.g.
[freesound.org](https://freesound.org)). Place the files in the `sounds/`
directory before running the app to hear audio cues when answering correctly or
leveling up.
