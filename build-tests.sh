#!/bin/sh
# Compile TypeScript files needed for tests to dist-tests using tsc
# We only compile selected files to keep it lightweight.
rm -rf dist-tests
npx tsc services/scoring.ts services/mathProblemService.ts types.ts constants.ts \
  --module ES2020 \
  --moduleResolution node \
  --target ES2020 \
  --outDir dist-tests
