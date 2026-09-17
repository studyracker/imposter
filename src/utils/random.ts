/**
 * Unbiased random utilities for Imposter game
 */

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Select n unique random indexes from 0 to totalCount - 1
export function pickRandomIndices(totalCount: number, pickCount: number): number[] {
  if (pickCount >= totalCount) {
    throw new Error('Pick count must be strictly less than total count');
  }
  const indices = Array.from({ length: totalCount }, (_, i) => i);
  const shuffled = shuffleArray(indices);
  return shuffled.slice(0, pickCount).sort((a, b) => a - b);
}

// Select a random element from an array, optionally avoiding a specific previous item
export function pickRandomWord(words: string[], excludeWord?: string): string {
  if (!words || words.length === 0) {
    throw new Error('Word pool cannot be empty');
  }
  if (words.length === 1) {
    return words[0];
  }
  const eligible = excludeWord ? words.filter(w => w.toLowerCase() !== excludeWord.toLowerCase()) : words;
  const pool = eligible.length > 0 ? eligible : words;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
