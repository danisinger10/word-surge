export type GameMode = 'blitz' | 'marathon' | 'zen' | 'daily';

export type GameScreen = 'home' | 'mode-select' | 'game' | 'results';

export interface GameState {
  // Player progression
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
  
  // Current game
  gameMode: GameMode | null;
  screen: GameScreen;
  letters: string[];
  currentGuess: string[];
  foundWords: Set<string>;
  allPossibleWords: Set<string>;
  score: number;
  timeRemaining: number;
  combo: number;
  maxCombo: number;
  surgeMode: boolean;
  surgeMultiplier: number;
  
  // Progression
  unlockedCities: string[];
  currentCity: string;
  achievements: string[];
  dailyStreak: number;
  lastPlayDate: string | null;
  
  // Collections
  unlockedStyles: string[];
  equippedStyle: string;
  wordCards: Record<string, boolean>;
  
  // Power-ups
  powerUps: {
    timeFreeze: number;
    shuffle: number;
    doublePoints: number;
    hintBomb: number;
    letterMagnet: number;
  };
  activePowerUp: string | null;
  
  // Stats
  totalWordsFound: number;
  totalGamesPlayed: number;
  bestScore: number;
  bestCombo: number;
}

export interface City {
  id: string;
  name: string;
  cost: number;
  x: number;
  y: number;
  color: string;
  puzzles: Puzzle[];
  wordCards: string[];
}

export interface Puzzle {
  letters: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  goal: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  duration?: number;
}

export interface LetterStyle {
  id: string;
  name: string;
  cost: number;
  className: string;
}

export interface DailyMission {
  id: string;
  type: string;
  goal: number;
  progress: number;
  reward: number;
  text: string;
}
