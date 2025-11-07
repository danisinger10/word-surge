import { COMMON_TWO_LETTER_WORDS } from './gameData';

let dictionary: Set<string> = new Set();
let isLoaded = false;

export async function loadDictionary(): Promise<void> {
  if (isLoaded) return;
  
  try {
    const response = await fetch('/words.json');
    const words: string[] = await response.json();
    dictionary = new Set(words.map(w => w.toUpperCase()));
    isLoaded = true;
    console.log(`Dictionary loaded: ${dictionary.size} words`);
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    // Fallback to a minimal dictionary
    dictionary = new Set([
      'CAT', 'DOG', 'BIRD', 'FISH', 'GAME', 'PLAY', 'WORD', 'SURGE',
      'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL',
      'CAN', 'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY',
      ...Array.from(COMMON_TWO_LETTER_WORDS),
    ]);
    isLoaded = true;
  }
}

export function isValidWord(word: string): boolean {
  const upperWord = word.toUpperCase();
  
  // Two-letter words from common list
  if (upperWord.length === 2) {
    return COMMON_TWO_LETTER_WORDS.has(upperWord);
  }
  
  // Three+ letter words from dictionary
  if (upperWord.length >= 3) {
    return dictionary.has(upperWord);
  }
  
  return false;
}

export function findAnagrams(letters: string[]): {
  words: Set<string>;
  pangram: string | null;
  longestWord: string;
} {
  const results = {
    words: new Set<string>(),
    pangram: null as string | null,
    longestWord: '',
  };
  
  const uniqueLetters = Array.from(new Set(letters.map(l => l.toUpperCase())));
  const letterCounts: Record<string, number> = {};
  
  for (const letter of letters) {
    const l = letter.toUpperCase();
    letterCounts[l] = (letterCounts[l] || 0) + 1;
  }
  
  function solve(currentWord: string, counts: Record<string, number>) {
    const upperWord = currentWord.toUpperCase();
    
    // Check if it's a valid word
    if (isValidWord(upperWord)) {
      results.words.add(upperWord);
      
      // Update longest word
      if (upperWord.length > results.longestWord.length) {
        results.longestWord = upperWord;
      }
      
      // Check if it's a pangram
      if (upperWord.length >= uniqueLetters.length) {
        const hasAllLetters = uniqueLetters.every(l => upperWord.includes(l));
        if (hasAllLetters && !results.pangram) {
          results.pangram = upperWord;
        }
      }
    }
    
    // Stop recursion if word is too long
    if (currentWord.length >= 15) return;
    
    // Try adding each available letter
    for (const char in counts) {
      if (counts[char] > 0) {
        counts[char]--;
        solve(currentWord + char.toLowerCase(), counts);
        counts[char]++;
      }
    }
  }
  
  solve('', { ...letterCounts });
  
  return results;
}

export function generatePuzzle(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): {
  letters: string[];
  words: Set<string>;
  pangram: string | null;
  longestWord: string;
} {
  // Common letter combinations that make many words
  const letterSets = {
    easy: [
      ['C', 'A', 'T', 'S'],
      ['D', 'O', 'G', 'S'],
      ['P', 'L', 'A', 'Y'],
      ['R', 'E', 'A', 'D'],
      ['T', 'E', 'A', 'M'],
    ],
    medium: [
      ['P', 'O', 'W', 'E', 'R'],
      ['S', 'T', 'A', 'R', 'E'],
      ['B', 'R', 'A', 'V', 'E'],
      ['S', 'T', 'O', 'R', 'M'],
      ['D', 'R', 'E', 'A', 'M'],
      ['L', 'I', 'G', 'H', 'T'],
      ['M', 'A', 'G', 'I', 'C'],
      ['S', 'P', 'A', 'R', 'K'],
    ],
    hard: [
      ['S', 'T', 'R', 'O', 'N', 'G'],
      ['C', 'H', 'A', 'N', 'G', 'E'],
      ['P', 'L', 'A', 'N', 'E', 'T'],
      ['W', 'I', 'N', 'T', 'E', 'R'],
      ['S', 'U', 'M', 'M', 'E', 'R'],
    ],
  };
  
  const pool = letterSets[difficulty];
  const letters = pool[Math.floor(Math.random() * pool.length)];
  
  const { words, pangram, longestWord } = findAnagrams(letters);
  
  return {
    letters,
    words,
    pangram,
    longestWord,
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
