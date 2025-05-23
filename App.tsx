import React, { useState, useEffect, useCallback } from 'react';
import { GameState, MathProblem, DifficultyLevel, ProblemType } from './types';
import { generateProblem } from './services/mathProblemService';
import { STARTING_LEVEL, MAX_LEVEL, STRIKES_TO_LEVEL_UP, INITIAL_TIME_PER_QUESTION, TIME_INCREMENT_PER_LEVEL, TOTAL_QUESTIONS, CORRECT_MESSAGES, INCORRECT_MESSAGES, LEVEL_UP_MESSAGES } from './constants';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import LevelUpModal from './components/LevelUpModal';
import ErrorBoundary from './components/ErrorBoundary';
import { useGameProgress } from './hooks/useGameProgress';

const App = (): React.JSX.Element => {
  const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);
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

  const getTimerDuration = useCallback((): number => {
    return INITIAL_TIME_PER_QUESTION + (currentLevel - 1) * TIME_INCREMENT_PER_LEVEL;
  }, [currentLevel]);

  const prefetchProblem = useCallback(async () => {
    if (isPrefetching || nextProblemBuffer) {
      // console.log("Prefetch skipped: already prefetching or buffer full.");
      return;
    }
    // console.log(`Prefetching problem for level ${currentLevel}`);
    setIsPrefetching(true);
    try {
      const problem = await generateProblem(currentLevel);
      if (problem.problemType !== ProblemType.ERROR_GENERATING) {
        setNextProblemBuffer(problem);
        // console.log("Problem prefetched and buffered:", problem);
      } else {
        // console.log("Prefetch resulted in a fallback, not buffering.");
      }
    } catch (error) {
      console.error("Error prefetching problem:", error);
    } finally {
      setIsPrefetching(false);
    }
  }, [currentLevel, isPrefetching, nextProblemBuffer]);


  const loadNextProblem = useCallback(async (): Promise<void> => {
    setIsAnswerSubmitted(false);
    setFeedbackMessage('');
    
    if (questionsAttempted >= TOTAL_QUESTIONS) {
      // Save game progress before ending
      const gameEndTime = Date.now();
      const totalGameTime = gameEndTime - gameStartTime;
      const averageTimePerQuestion = totalGameTime / TOTAL_QUESTIONS / 1000; // in seconds
      
      updateGameEnd(score, currentLevel, correctAnswersCount, averageTimePerQuestion);
      setGameState(GameState.GAME_OVER);
      return;
    }
    
    setIsLoadingProblem(true);
    setCurrentProblem(null); // Clear old problem to ensure loading screen shows

    try {
      let problemToSet: MathProblem | null = null;
      if (nextProblemBuffer && nextProblemBuffer.difficulty === currentLevel) {
        problemToSet = nextProblemBuffer;
        setNextProblemBuffer(null);
        if (process.env.NODE_ENV === 'development') {
          console.log("Loaded problem from PREFETCH BUFFER.", problemToSet);
        }
      } else {
        if (nextProblemBuffer && nextProblemBuffer.difficulty !== currentLevel) {
            if (process.env.NODE_ENV === 'development') {
              console.log("Prefetch buffer had problem for different level, fetching new.");
            }
            setNextProblemBuffer(null); // Discard old buffer
        }
        problemToSet = await generateProblem(currentLevel);
        if (process.env.NODE_ENV === 'development') {
          console.log(
              problemToSet.problemType === ProblemType.AI_GENERATED 
                  ? "Loaded problem from AI." 
                  : problemToSet.problemType === ProblemType.ERROR_GENERATING 
                      ? "Loaded problem: FALLBACK (AI error)."
                      : "Loaded problem from local static generator (should not happen with AI setup).",
              problemToSet
          );
        }
      }
      
      setCurrentProblem(problemToSet);
      setTimeLeft(getTimerDuration());
      setQuestionsAttempted(prev => prev + 1);

      // Trigger prefetch for the *next* next problem
      if (questionsAttempted + 1 < TOTAL_QUESTIONS) { // +1 because questionsAttempted is updated above
          prefetchProblem();
      }

    } catch (error) {
        console.error("Failed to load next problem:", error);
        setCurrentProblem({
            id: 'error-load-critical',
            questionText: "Oops! Critical error loading question. Please refresh.",
            answer: 0,
            difficulty: currentLevel,
            problemType: ProblemType.ERROR_GENERATING
        });
    } finally {
        setIsLoadingProblem(false);
    }
  }, [currentLevel, questionsAttempted, getTimerDuration, nextProblemBuffer, prefetchProblem]);

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
            // If level actually changes, clear prefetch buffer as it's for the old level
            if (newLevel !== prevLevel) {
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
      if (currentProblem?.problemType === ProblemType.ERROR_GENERATING) {
        setFeedbackMessage("Let's try to get a new question.");
      } else if (answer === 'TIMEOUT_SUBMIT') {
        setFeedbackMessage("Time's up! Let's try the next one. ⌛");
      } else {
        setFeedbackMessage(INCORRECT_MESSAGES[Math.floor(Math.random() * INCORRECT_MESSAGES.length)]);
      }
    }
    
    const delayDuration = currentProblem?.problemType === ProblemType.ERROR_GENERATING ? 500 : (leveledUp ? 500 : 2000) ; // Shorter delay if leveling up as modal handles pause

    setTimeout(async () => {
        // Check current showLevelUpModal state directly, not the one captured in closure
        if (leveledUp) { // If leveledUp, modal will be shown, next problem loads on modal close
            // No immediate loadNextProblem needed here, modal closure handles it
        } else {
             await loadNextProblem();
        }
    }, delayDuration); 
  }, [isAnswerSubmitted, currentProblem, currentLevel, playCorrectAnswerSound, playLevelUpSound, loadNextProblem]);


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


  const startGame = async (): Promise<void> => {
    setScore(0);
    setStrikes(0);
    setCurrentLevel(STARTING_LEVEL);
    setQuestionsAttempted(0); 
    setCorrectAnswersCount(0);
    setGameStartTime(Date.now());
    setGameState(GameState.PLAYING);
    setCorrectSoundIndex(0); 
    setNextProblemBuffer(null); // Clear buffer for a fresh game
    setIsPrefetching(false);
    await loadNextProblem(); 
  };
  
  const closeLevelUpModal = async (): Promise<void> => {
    setShowLevelUpModal(false);
    await loadNextProblem(); 
  };

  const restartGame = (): void => {
    setGameState(GameState.NOT_STARTED);
    setCurrentProblem(null);
    setTimeLeft(INITIAL_TIME_PER_QUESTION); 
    setShowLevelUpModal(false);
    setFeedbackMessage('');
    setIsAnswerSubmitted(false);
    setIsLoadingProblem(false);
    setQuestionsAttempted(0); 
    setCorrectAnswersCount(0);
    setGameStartTime(0);
    setNextProblemBuffer(null); // Clear buffer
    setIsPrefetching(false); 
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white select-none">
        {showLevelUpModal && <LevelUpModal level={currentLevel} onClose={closeLevelUpModal} />}
        
        {gameState === GameState.NOT_STARTED && <StartScreen onStart={startGame} />}
        
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
            onAnswerSubmit={handleAnswerSubmit}
            isLoadingProblem={isLoadingProblem}
          />
        )}
        
        {gameState === GameState.GAME_OVER && (
          <GameOverScreen score={score} level={currentLevel} onRestart={restartGame} progress={progress} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
