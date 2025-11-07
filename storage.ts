import { GameState } from './types';
import { calculateXPForLevel } from './gameData';

const STORAGE_KEY = 'word_surge_2025_save';

export function getDefaultGameState(): GameState {
  return {
    level: 1,
    xp: 0,
    xpToNextLevel: calculateXPForLevel(1),
    coins: 1000,
    gems: 0,
    
    gameMode: null,
    screen: 'home',
    letters: [],
    currentGuess: [],
    foundWords: new Set(),
    allPossibleWords: new Set(),
    score: 0,
    timeRemaining: 0,
    combo: 0,
    maxCombo: 0,
    surgeMode: false,
    surgeMultiplier: 1,
    
    unlockedCities: ['baltimore'],
    currentCity: 'baltimore',
    achievements: [],
    dailyStreak: 0,
    lastPlayDate: null,
    
    unlockedStyles: ['neon'],
    equippedStyle: 'neon',
    wordCards: {},
    
    powerUps: {
      timeFreeze: 0,
      shuffle: 3,
      doublePoints: 0,
      hintBomb: 0,
      letterMagnet: 0,
    },
    activePowerUp: null,
    
    totalWordsFound: 0,
    totalGamesPlayed: 0,
    bestScore: 0,
    bestCombo: 0,
  };
}

export function saveGameState(state: GameState): void {
  try {
    const serialized = {
      ...state,
      foundWords: Array.from(state.foundWords),
      allPossibleWords: Array.from(state.allPossibleWords),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadGameState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getDefaultGameState();
    
    const parsed = JSON.parse(saved);
    return {
      ...getDefaultGameState(),
      ...parsed,
      foundWords: new Set(parsed.foundWords || []),
      allPossibleWords: new Set(parsed.allPossibleWords || []),
    };
  } catch (error) {
    console.error('Failed to load game state:', error);
    return getDefaultGameState();
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
}
