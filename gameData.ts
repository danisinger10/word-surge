import { City, LetterStyle, PowerUp } from './types';

export const CITIES: Record<string, City> = {
  baltimore: {
    id: 'baltimore',
    name: 'Baltimore',
    cost: 0,
    x: 80,
    y: 60,
    color: '#f472b6',
    puzzles: [
      { letters: ['R', 'A', 'V', 'E', 'N'] },
      { letters: ['H', 'A', 'R', 'B', 'O'] },
      { letters: ['C', 'R', 'A', 'B', 'S'] },
    ],
    wordCards: ['RAVEN', 'HARBOR', 'CRAB', 'CHARM'],
  },
  paris: {
    id: 'paris',
    name: 'Paris',
    cost: 1000,
    x: 140,
    y: 55,
    color: '#60a5fa',
    puzzles: [
      { letters: ['L', 'O', 'U', 'V', 'R', 'E'] },
      { letters: ['E', 'I', 'F', 'F', 'E', 'L'] },
      { letters: ['A', 'R', 'T', 'I', 'S'] },
    ],
    wordCards: ['LOUVRE', 'EIFFEL', 'ARTIST', 'WINE'],
  },
  tokyo: {
    id: 'tokyo',
    name: 'Tokyo',
    cost: 2500,
    x: 240,
    y: 65,
    color: '#f87171',
    puzzles: [
      { letters: ['S', 'U', 'S', 'H', 'I'] },
      { letters: ['K', 'A', 'R', 'A', 'T', 'E'] },
      { letters: ['N', 'I', 'N', 'J', 'A'] },
    ],
    wordCards: ['SUSHI', 'KARATE', 'NINJA', 'RAMEN'],
  },
};

export const LETTER_STYLES: LetterStyle[] = [
  {
    id: 'neon',
    name: 'Neon',
    cost: 0,
    className: 'bg-primary/20 border-primary text-primary',
  },
  {
    id: 'cyber',
    name: 'Cyber',
    cost: 500,
    className: 'bg-secondary/20 border-secondary text-secondary',
  },
  {
    id: 'gold',
    name: 'Gold',
    cost: 1000,
    className: 'bg-accent/20 border-accent text-accent',
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    cost: 2000,
    className: 'bg-gradient-to-br from-primary via-secondary to-accent border-primary text-white',
  },
];

export const POWER_UPS: PowerUp[] = [
  {
    id: 'timeFreeze',
    name: 'Time Freeze',
    description: 'Stop the timer for 5 seconds',
    cost: 150,
    icon: '❄️',
    duration: 5000,
  },
  {
    id: 'shuffle',
    name: 'Letter Shuffle',
    description: 'Rearrange the letters',
    cost: 100,
    icon: '🔀',
  },
  {
    id: 'doublePoints',
    name: 'Double Points',
    description: '2x points for 30 seconds',
    cost: 200,
    icon: '⭐',
    duration: 30000,
  },
  {
    id: 'hintBomb',
    name: 'Hint Bomb',
    description: 'Reveal 3 random words',
    cost: 250,
    icon: '💡',
  },
  {
    id: 'letterMagnet',
    name: 'Letter Magnet',
    description: 'Auto-complete current word',
    cost: 175,
    icon: '🧲',
  },
];

export const ACHIEVEMENTS = [
  {
    id: 'first_word',
    name: 'First Steps',
    description: 'Find your first word',
    icon: '🎯',
    goal: 1,
  },
  {
    id: 'word_master',
    name: 'Word Master',
    description: 'Find 1000 total words',
    icon: '📚',
    goal: 1000,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Find 10 words in 30 seconds',
    icon: '⚡',
    goal: 10,
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 5 perfect rounds',
    icon: '💎',
    goal: 5,
  },
  {
    id: 'combo_king',
    name: 'Combo King',
    description: 'Reach 10x combo',
    icon: '🔥',
    goal: 10,
  },
  {
    id: 'pangram_hunter',
    name: 'Pangram Hunter',
    description: 'Find 50 pangrams',
    icon: '🎨',
    goal: 50,
  },
  {
    id: 'city_explorer',
    name: 'City Explorer',
    description: 'Unlock all cities',
    icon: '🌍',
    goal: 3,
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: '30-day login streak',
    icon: '🔥',
    goal: 30,
  },
];

export const COMMON_TWO_LETTER_WORDS = new Set([
  'OF', 'TO', 'IN', 'IS', 'IT', 'BE', 'AS', 'AT', 'SO', 'WE',
  'HE', 'BY', 'OR', 'MY', 'UP', 'US', 'GO', 'NO', 'AN', 'DO',
  'IF', 'ME', 'ON', 'AM', 'MA', 'PA', 'HA', 'LA', 'OH', 'AH',
]);

export const XP_PER_LEVEL = 100;
export const XP_MULTIPLIER = 1.15;

export function calculateXPForLevel(level: number): number {
  return Math.floor(XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
}

export function calculateWordScore(word: string, combo: number, isPangram: boolean): number {
  const baseScore = word.length * 10;
  const comboMultiplier = 1 + (combo * 0.2);
  const pangramBonus = isPangram ? 100 : 0;
  return Math.floor((baseScore * comboMultiplier) + pangramBonus);
}

export function calculateXPReward(word: string): number {
  return word.length * 5;
}
