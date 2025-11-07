import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GameState, GameMode } from '@/lib/types';
import { loadGameState, saveGameState, getDefaultGameState } from '@/lib/storage';
import { loadDictionary, isValidWord, findAnagrams, generatePuzzle } from '@/lib/dictionary';
import { audioSystem } from '@/lib/audio';
import { calculateWordScore, calculateXPReward, calculateXPForLevel, CITIES } from '@/lib/gameData';
import { shakeScreen, flashScreen, createConfetti } from '@/lib/particles';

interface GameContextType {
  state: GameState;
  startGame: (mode: GameMode) => void;
  submitWord: () => void;
  selectLetter: (letter: string, index: number) => void;
  clearGuess: () => void;
  endGame: () => void;
  resetToHome: () => void;
  addCoins: (amount: number) => void;
  addXP: (amount: number) => void;
  unlockCity: (cityId: string) => void;
  unlockStyle: (styleId: string) => void;
  equipStyle: (styleId: string) => void;
  usePowerUp: (powerUpId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(getDefaultGameState());
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [comboTimer, setComboTimer] = useState<NodeJS.Timeout | null>(null);

  // Load game state on mount
  useEffect(() => {
    const loaded = loadGameState();
    setState(loaded);
    loadDictionary();
    audioSystem.initialize();
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // Timer logic
  useEffect(() => {
    if (state.gameMode && state.gameMode !== 'zen' && state.gameMode !== 'daily' && state.timeRemaining > 0) {
      const interval = setInterval(() => {
        setState(prev => {
          const newTime = prev.timeRemaining - 1;
          
          if (newTime <= 0) {
            endGame();
            return { ...prev, timeRemaining: 0 };
          }
          
          // Play tick sound for last 5 seconds
          if (newTime <= 5) {
            audioSystem.playTick();
          }
          
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
      
      setTimerInterval(interval);
      
      return () => clearInterval(interval);
    }
  }, [state.gameMode, state.timeRemaining]);

  const startGame = useCallback((mode: GameMode) => {
    // Generate puzzle
    const puzzle = generatePuzzle('medium');
    
    // Set initial time based on mode
    let timeRemaining = 0;
    if (mode === 'blitz') timeRemaining = 15;
    if (mode === 'marathon') timeRemaining = 60;
    
    setState(prev => ({
      ...prev,
      gameMode: mode,
      screen: 'game',
      letters: puzzle.letters,
      allPossibleWords: puzzle.words,
      foundWords: new Set(),
      currentGuess: [],
      score: 0,
      timeRemaining,
      combo: 0,
      maxCombo: 0,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
    }));
    
    audioSystem.playPowerUp();
  }, []);

  const selectLetter = useCallback((letter: string, index: number) => {
    setState(prev => {
      // Check if letter is already used
      if (prev.currentGuess.includes(letter + index)) return prev;
      
      audioSystem.playLetterTap(index);
      
      return {
        ...prev,
        currentGuess: [...prev.currentGuess, letter + index],
      };
    });
  }, []);

  const clearGuess = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentGuess: [],
    }));
  }, []);

  const submitWord = useCallback(() => {
    setState(prev => {
      // Extract just the letters from the guess
      const word = prev.currentGuess.map(g => g[0]).join('').toUpperCase();
      
      // Validate word
      if (!isValidWord(word)) {
        audioSystem.playWordInvalid();
        shakeScreen(0.5);
        return { ...prev, currentGuess: [] };
      }
      
      // Check if already found
      if (prev.foundWords.has(word)) {
        audioSystem.playWordInvalid();
        return { ...prev, currentGuess: [] };
      }
      
      // Valid new word!
      audioSystem.playWordValid();
      
      // Reset combo timer
      if (comboTimer) clearTimeout(comboTimer);
      const newComboTimer = setTimeout(() => {
        setState(s => ({ ...s, combo: 0, surgeMode: false, surgeMultiplier: 1 }));
      }, 5000);
      setComboTimer(newComboTimer);
      
      // Check if pangram
      const uniqueLetters = Array.from(new Set(prev.letters));
      const isPangram = uniqueLetters.every(l => word.includes(l));
      
      // Calculate score and XP
      const newCombo = prev.combo + 1;
      let wordScore = calculateWordScore(word, newCombo, isPangram);
      
      // Apply double points if active
      if (prev.activePowerUp === 'doublePoints') {
        wordScore *= 2;
      }
      
      // Apply surge mode multiplier
      if (prev.surgeMode) {
        wordScore = Math.floor(wordScore * prev.surgeMultiplier);
      }
      
      const xpReward = calculateXPReward(word);
      
      // Update state
      const newFoundWords = new Set(prev.foundWords);
      newFoundWords.add(word);
      
      const newScore = prev.score + wordScore;
      const newXP = prev.xp + xpReward;
      const newTotalWords = prev.totalWordsFound + 1;
      
      // Check for level up
      let newLevel = prev.level;
      let newXPToNextLevel = prev.xpToNextLevel;
      if (newXP >= prev.xpToNextLevel) {
        newLevel++;
        newXPToNextLevel = calculateXPForLevel(newLevel);
        audioSystem.playLevelUp();
        flashScreen('rgba(34, 211, 238, 0.3)');
        createConfetti(30);
      }
      
      // Surge Mode activation (3+ combo)
      let surgeMode = prev.surgeMode;
      let surgeMultiplier = prev.surgeMultiplier;
      
      if (newCombo >= 3 && !prev.surgeMode) {
        surgeMode = true;
        surgeMultiplier = 1.5;
        audioSystem.playSurgeMode();
        flashScreen('rgba(250, 204, 21, 0.4)');
        shakeScreen(1);
      } else if (newCombo >= 5) {
        surgeMultiplier = 2.0; // Increase multiplier at higher combos
        audioSystem.playSurgeMode();
        shakeScreen(1);
      } else if (newCombo >= 3) {
        audioSystem.playCombo(newCombo);
        shakeScreen(0.5);
      }
      
      // Surge Mode ends when combo breaks (handled in combo timer)
      
      // Pangram effects
      if (isPangram) {
        flashScreen('rgba(250, 204, 21, 0.3)');
        createConfetti(50);
      }
      
      return {
        ...prev,
        foundWords: newFoundWords,
        currentGuess: [],
        score: newScore,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNextLevel,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        surgeMode,
        surgeMultiplier,
        totalWordsFound: newTotalWords,
        bestScore: Math.max(prev.bestScore, newScore),
        bestCombo: Math.max(prev.bestCombo, newCombo),
        activePowerUp: prev.activePowerUp === 'doublePoints' ? null : prev.activePowerUp,
      };
    });
  }, []);

  const endGame = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    audioSystem.playGameOver();
    
    setState(prev => ({
      ...prev,
      screen: 'results',
      gameMode: null,
    }));
  }, [timerInterval]);

  const addCoins = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  }, []);

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXPToNextLevel = prev.xpToNextLevel;
      
      if (newXP >= prev.xpToNextLevel) {
        newLevel++;
        newXPToNextLevel = calculateXPForLevel(newLevel);
        audioSystem.playLevelUp();
      }
      
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNextLevel,
      };
    });
  }, []);

  const unlockCity = useCallback((cityId: string) => {
    setState(prev => {
      if (prev.unlockedCities.includes(cityId)) return prev;
      
      const city = CITIES[cityId];
      if (!city || prev.coins < city.cost) return prev;
      
      audioSystem.playAchievement();
      createConfetti(40);
      
      return {
        ...prev,
        unlockedCities: [...prev.unlockedCities, cityId],
        coins: prev.coins - city.cost,
      };
    });
  }, []);

  const unlockStyle = useCallback((styleId: string) => {
    setState(prev => {
      if (prev.unlockedStyles.includes(styleId)) return prev;
      
      return {
        ...prev,
        unlockedStyles: [...prev.unlockedStyles, styleId],
      };
    });
  }, []);

  const equipStyle = useCallback((styleId: string) => {
    setState(prev => ({
      ...prev,
      equippedStyle: styleId,
    }));
  }, []);

  const usePowerUp = useCallback((powerUpId: string) => {
    setState(prev => {
      const powerUps = prev.powerUps as any;
      if (powerUps[powerUpId] <= 0) return prev;
      
      audioSystem.playPowerUp();
      flashScreen('rgba(250, 204, 21, 0.2)');
      
      let newState = {
        ...prev,
        powerUps: {
          ...prev.powerUps,
          [powerUpId]: powerUps[powerUpId] - 1,
        },
        activePowerUp: powerUpId,
      };
      
      // Implement each power-up's effect
      switch (powerUpId) {
        case 'timeFreeze':
          // Time Freeze: Add 10 seconds to timer
          newState.timeRemaining = prev.timeRemaining + 10;
          break;
          
        case 'letterShuffle':
          // Letter Shuffle: Randomize letter positions using Fisher-Yates
          const shuffled = [...prev.letters];
          // Perform multiple shuffles to ensure visible change
          for (let shuffle = 0; shuffle < 3; shuffle++) {
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
          }
          // Force a new array reference to trigger React re-render
          newState = {
            ...newState,
            letters: shuffled,
            currentGuess: [], // Clear current guess when shuffling
          };
          break;
          
        case 'doublePoints':
          // Double Points: Set flag for next word submission
          newState.activePowerUp = 'doublePoints';
          break;
          
        case 'hintBomb':
          // Hint Bomb: Reveal one unfound word
          const unfoundWords = Array.from(prev.allPossibleWords)
            .filter(w => !prev.foundWords.has(w))
            .sort((a, b) => a.length - b.length); // Start with shorter words
          
          if (unfoundWords.length > 0) {
            const hintWord = unfoundWords[0];
            const newFoundWords = new Set(Array.from(prev.foundWords));
            newFoundWords.add(hintWord);
            newState.foundWords = newFoundWords;
            newState.score = prev.score + hintWord.length * 10;
          }
          break;
          
        case 'letterMagnet':
          // Letter Magnet: Auto-complete a valid word
          const availableWords = Array.from(prev.allPossibleWords)
            .filter(w => !prev.foundWords.has(w))
            .sort((a, b) => b.length - a.length); // Prefer longer words
          
          if (availableWords.length > 0) {
            const autoWord = availableWords[0];
            const newFoundWordsAuto = new Set(Array.from(prev.foundWords));
            newFoundWordsAuto.add(autoWord);
            newState.foundWords = newFoundWordsAuto;
            newState.score = prev.score + autoWord.length * 10;
            newState.combo = prev.combo + 1;
          }
          break;
      }
      
      // Clear active power-up after a delay (except doublePoints which clears on next word)
      if (powerUpId !== 'doublePoints') {
        setTimeout(() => {
          setState(current => ({
            ...current,
            activePowerUp: null,
          }));
        }, 3000);
      }
      
      return newState;
    });
  }, []);

  const resetToHome = useCallback(() => {
    setState(prev => ({
      ...prev,
      screen: 'home',
      gameMode: null,
      letters: [],
      currentGuess: [],
      foundWords: new Set(),
      allPossibleWords: new Set(),
      score: 0,
      combo: 0,
      timeRemaining: 0,
    }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        submitWord,
        selectLetter,
        clearGuess,
        endGame,
        resetToHome,
        addCoins,
        addXP,
        unlockCity,
        unlockStyle,
        equipStyle,
        usePowerUp,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
