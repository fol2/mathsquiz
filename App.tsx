import React, { useState, useEffect, useCallback } from 'react';
import { GameState, MathProblem, DifficultyLevel, ProblemType } from './types';
import { generateProblem, hasValidApiKey, loadApiKeyFromStorage, clearQuestionCache, clearBatchForLevel } from './services/mathProblemService';
import { STARTING_LEVEL, MAX_LEVEL, STRIKES_TO_LEVEL_UP, INITIAL_TIME_PER_QUESTION, TIME_PER_LEVEL, TOTAL_QUESTIONS, CORRECT_MESSAGES, INCORRECT_MESSAGES, LEVEL_UP_MESSAGES } from './constants';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import LevelUpModal from './components/LevelUpModal';
import ApiKeySetup from './components/ApiKeySetup';
import ErrorBoundary from './components/ErrorBoundary';
import { useGameProgress } from './hooks/useGameProgress';

const App = (): React.JSX.Element => {
  const [gameState, setGameState] = useState<GameState>(() => {
    loadApiKeyFromStorage();
    return hasValidApiKey() ? GameState.NOT_STARTED : GameState.API_KEY_SETUP;
  });
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>(STARTING_LEVEL);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [score, setScore] = useState<number>(0);
  const [strikes, setStrikes] = useState<number>(0);
  const [questionsAttempted, setQuestionsAttempted] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME_PER_QUESTION);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [correctSoundIndex, setCorrectSoundIndex] = useState<number>(0);
  const [isLoadingProblem, setIsLoadingProblem] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
  const [canProceedToNext, setCanProceedToNext] = useState<boolean>(false);

  const [nextProblemBuffer, setNextProblemBuffer] = useState<MathProblem | null>(null);
  const [isPrefetching, setIsPrefetching] = useState<boolean>(false);

  const { progress, updateGameEnd } = useGameProgress();

  const playSound = (soundId: string) => {
    const sound = document.getElementById(soundId) as HTMLAudioElement;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => console.warn("Audio play failed:", error));
    } else {
        console.warn(`Sound element with id ${soundId} not found.`);
    }
  };

  const playCorrectAnswerSound = useCallback(() => {
    const sounds = ["correctSoundAwesome", "correctSoundAmazing", "correctSoundAstonishing"];
    playSound(sounds[correctSoundIndex]);
    setCorrectSoundIndex((prevIndex) => (prevIndex + 1) % sounds.length);
  }, [correctSoundIndex]);

  const playLevelUpSound = useCallback(() => {
    playSound("levelUpSound");
  }, []);

  const computeTimerDuration = (level: DifficultyLevel): number => {
    return TIME_PER_LEVEL[level] ?? TIME_PER_LEVEL[STARTING_LEVEL];
  };


  const prefetchProblem = useCallback(async (level: DifficultyLevel) => {
    if (isPrefetching || nextProblemBuffer || !hasValidApiKey()) {
      return;
    }
    setIsPrefetching(true);
    try {
      const problem = await generateProblem(level);
      if (problem.problemType !== ProblemType.ERROR_GENERATING) {
        setNextProblemBuffer(problem);
      }
    } catch (error) {
      console.error("Error prefetching problem:", error);
    } finally {
      setIsPrefetching(false);
    }
  }, [isPrefetching, nextProblemBuffer]);

  const loadNextProblem = useCallback(async (levelOverride?: DifficultyLevel): Promise<void> => {
    setIsAnswerSubmitted(false);
    setFeedbackMessage('');
    setShowCorrectAnswer(false);
    setCanProceedToNext(false);

    const level = levelOverride ?? currentLevel;

    if (questionsAttempted >= TOTAL_QUESTIONS) {
      const gameEndTime = Date.now();
      const totalGameTime = gameEndTime - gameStartTime;
      const averageTimePerQuestion = totalGameTime / TOTAL_QUESTIONS / 1000;

      updateGameEnd(score, level, correctAnswersCount, averageTimePerQuestion);
      setGameState(GameState.GAME_OVER);
      return;
    }

    setIsLoadingProblem(true);
    setCurrentProblem(null);

    try {
      let problemToSet: MathProblem | null = null;
      if (nextProblemBuffer && nextProblemBuffer.difficulty === level) {
        problemToSet = nextProblemBuffer;
        setNextProblemBuffer(null);
        if (process.env.NODE_ENV === 'development') {
          console.warn("Loaded problem from PREFETCH BUFFER.", problemToSet);
        }
      } else {
        if (nextProblemBuffer && nextProblemBuffer.difficulty !== level) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                "Prefetch buffer had problem for different level, fetching new."
              );
            }
            setNextProblemBuffer(null);
        }
        problemToSet = await generateProblem(level);
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            problemToSet.problemType === ProblemType.AI_GENERATED
              ? 'Loaded problem from AI.'
              : problemToSet.problemType === ProblemType.ERROR_GENERATING
              ? 'AI generation failed - showing error.'
              : 'Loaded problem from unknown source.',
            problemToSet
          );
        }
      }

      setCurrentProblem(problemToSet);
      setTimeLeft(computeTimerDuration(level));
      setQuestionsAttempted(prev => prev + 1);

      if (questionsAttempted + 1 < TOTAL_QUESTIONS) {
          prefetchProblem(level);
      }

    } catch (error) {
        console.error("Failed to load next problem:", error);
        setCurrentProblem({
            id: 'error-load-critical',
            questionText: "Oops! Critical error loading question. Please refresh.",
            answer: 0,
            difficulty: level,
            problemType: ProblemType.ERROR_GENERATING
        });
    } finally {
        setIsLoadingProblem(false);
    }
  }, [currentLevel, questionsAttempted, nextProblemBuffer, prefetchProblem, score, gameStartTime, correctAnswersCount, updateGameEnd]);

  const handleAnswerSubmit = useCallback(async (answer: string): Promise<void> => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const parsedAnswer = parseFloat(answer);
    const isCorrect = currentProblem !== null && 
                      currentProblem.problemType !== ProblemType.ERROR_GENERATING &&
                      !isNaN(parsedAnswer) && 
                      parsedAnswer === currentProblem.answer;

    let leveledUp = false;
    if (isCorrect) {
      setScore(prevScore => prevScore + 10 * currentLevel);
      setCorrectAnswersCount(prev => prev + 1);
      setStrikes(prevStrikes => {
        const newStrikes = prevStrikes + 1;
        if (newStrikes >= STRIKES_TO_LEVEL_UP && currentLevel < MAX_LEVEL) {
          setCurrentLevel(prevLevel => {
            const newLevel = Math.min(MAX_LEVEL, prevLevel + 1) as DifficultyLevel;
            if (newLevel !== prevLevel) {
                clearBatchForLevel(newLevel);
                setNextProblemBuffer(null);
            }
            return newLevel;
          });
          setStrikes(0);
          setShowLevelUpModal(true);
          leveledUp = true;
          playLevelUpSound();
          setFeedbackMessage(LEVEL_UP_MESSAGES[Math.floor(Math.random() * LEVEL_UP_MESSAGES.length)]);
        }
        return newStrikes;
      });
      if (!leveledUp) {
        setFeedbackMessage(CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)]);
      }
      playCorrectAnswerSound();
    } else {
      setStrikes(0);
      setShowCorrectAnswer(true);
      if (currentProblem?.problemType === ProblemType.ERROR_GENERATING) {
        setFeedbackMessage("Let's try to get a new question.");
      } else if (answer === 'TIMEOUT_SUBMIT') {
        setFeedbackMessage("Time's up! Let's try the next one. ⌛");
      } else {
        setFeedbackMessage(INCORRECT_MESSAGES[Math.floor(Math.random() * INCORRECT_MESSAGES.length)]);
      }
    }
    
    setCanProceedToNext(true);
  }, [isAnswerSubmitted, currentProblem, currentLevel, playCorrectAnswerSound, playLevelUpSound]);

  const proceedToNextQuestion = useCallback(async (): Promise<void> => {
    await loadNextProblem();
  }, [loadNextProblem]);

  useEffect(() => {
    if (gameState === GameState.PLAYING && !isAnswerSubmitted && !isLoadingProblem && currentProblem?.problemType !== ProblemType.ERROR_GENERATING) {
      if (timeLeft <= 0) {
        handleAnswerSubmit('TIMEOUT_SUBMIT'); 
        return;
      } else {
        const timerId = setInterval(() => {
          setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerId);
      }
    }
    return undefined;
  }, [gameState, timeLeft, isAnswerSubmitted, handleAnswerSubmit, isLoadingProblem, currentProblem]);


  const startGame = async (level: DifficultyLevel = STARTING_LEVEL): Promise<void> => {
    clearQuestionCache();
    setScore(0);
    setStrikes(0);
    setCurrentLevel(level);
    setQuestionsAttempted(0);
    setCorrectAnswersCount(0);
    setGameStartTime(Date.now());
    setGameState(GameState.PLAYING);
    setCorrectSoundIndex(0);
    setNextProblemBuffer(null);
    setIsPrefetching(false);
    await loadNextProblem(level);
  };
  
  const closeLevelUpModal = async (): Promise<void> => {
    setShowLevelUpModal(false);
    await loadNextProblem(); 
  };

  const restartGame = (): void => {
    clearQuestionCache();
    setGameState(GameState.NOT_STARTED);
    setCurrentProblem(null);
    setTimeLeft(INITIAL_TIME_PER_QUESTION); 
    setShowLevelUpModal(false);
    setFeedbackMessage('');
    setIsAnswerSubmitted(false);
    setShowCorrectAnswer(false);
    setCanProceedToNext(false);
    setIsLoadingProblem(false);
    setQuestionsAttempted(0); 
    setCorrectAnswersCount(0);
    setGameStartTime(0);
    setNextProblemBuffer(null);
    setIsPrefetching(false); 
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center p-4 mobile-container keyboard-aware">
        {gameState === GameState.API_KEY_SETUP && (
          <ApiKeySetup onComplete={() => setGameState(GameState.NOT_STARTED)} />
        )}
        
        {gameState === GameState.NOT_STARTED && (
          <StartScreen
            onStart={startGame}
          />
        )}
        
        {gameState === GameState.PLAYING && (
          <GameScreen
            problem={currentProblem}
            level={currentLevel}
            score={score}
            strikes={strikes}
            timeLeft={timeLeft}
            questionsAttempted={questionsAttempted}
            totalQuestions={TOTAL_QUESTIONS}
            feedbackMessage={feedbackMessage}
            isAnswerSubmitted={isAnswerSubmitted}
            showCorrectAnswer={showCorrectAnswer}
            canProceedToNext={canProceedToNext}
            onAnswerSubmit={handleAnswerSubmit}
            onProceedToNext={proceedToNextQuestion}
            isLoadingProblem={isLoadingProblem}
          />
        )}
        
        {gameState === GameState.GAME_OVER && (
          <GameOverScreen
            finalScore={score}
            finalLevel={currentLevel}
            totalQuestions={questionsAttempted}
            onRestart={restartGame}
            correctAnswersCount={correctAnswersCount}
            progress={progress}
          />
        )}

        {showLevelUpModal && (
          <LevelUpModal 
            level={currentLevel}
            onClose={closeLevelUpModal}
          />
        )}

        {/* PWA Install Prompt for mobile users */}
        <div className="sr-only">
          <h1>Math Genius Challenge - AI-Powered Math Quiz Game</h1>
          <p>Challenge yourself with progressive difficulty levels and AI-generated math problems</p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
