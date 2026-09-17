import { Category, GameState, PlayerInfo } from '../types';
import { pickRandomIndices, pickRandomWord } from './random';

export function getMaxImposters(playerCount: number): number {
  if (playerCount <= 2) return 1;
  if (playerCount <= 5) return 1;
  if (playerCount <= 8) return 2;
  return 3;
}

export function getMinImposters(): number {
  return 1;
}

export function validateGameConfig(
  playerCount: number,
  imposterCount: number,
  categoryOrCategories: Category | Category[] | null | undefined
): { valid: boolean; error?: string } {
  if (!playerCount || playerCount < 3 || playerCount > 12) {
    return { valid: false, error: 'Please choose between 3 and 12 players.' };
  }

  const maxAllowed = getMaxImposters(playerCount);
  if (!imposterCount || imposterCount < 1) {
    return { valid: false, error: 'Must have at least 1 imposter.' };
  }

  if (imposterCount > maxAllowed) {
    return {
      valid: false,
      error: `For ${playerCount} players, you can have at most ${maxAllowed} imposter${maxAllowed > 1 ? 's' : ''}.`
    };
  }

  if (imposterCount >= playerCount) {
    return {
      valid: false,
      error: 'Number of imposters cannot be greater than or equal to the number of players.'
    };
  }

  if (!categoryOrCategories) {
    return { valid: false, error: 'Please select at least one category.' };
  }

  const categories = Array.isArray(categoryOrCategories) ? categoryOrCategories : [categoryOrCategories];

  if (categories.length === 0) {
    return { valid: false, error: 'Please select at least one category.' };
  }

  for (const cat of categories) {
    if (!cat.words || cat.words.length === 0) {
      return { valid: false, error: `Category "${cat.name}" has no words available.` };
    }
  }

  return { valid: true };
}

export function assignImposters(playerCount: number, imposterCount: number): number[] {
  return pickRandomIndices(playerCount, imposterCount);
}

export function getRandomWord(category: Category, excludeWord?: string): string {
  return pickRandomWord(category.words, excludeWord);
}

export function createGame(
  playerCount: number,
  imposterCount: number,
  categoryOrCategories: Category | Category[],
  options?: {
    playerNames?: string[];
    excludeWord?: string;
  }
): GameState {
  const validation = validateGameConfig(playerCount, imposterCount, categoryOrCategories);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid game configuration');
  }

  const categories = Array.isArray(categoryOrCategories) ? categoryOrCategories : [categoryOrCategories];
  // Select one category at random from the selected categories for this round
  const chosenCategory = categories[Math.floor(Math.random() * categories.length)];
  const secretWord = getRandomWord(chosenCategory, options?.excludeWord);
  const imposterIndices = assignImposters(playerCount, imposterCount);

  // Generate or sanitize player names
  const playerNames: string[] = [];
  for (let i = 0; i < playerCount; i++) {
    if (options?.playerNames && options.playerNames[i] && options.playerNames[i].trim()) {
      playerNames.push(options.playerNames[i].trim());
    } else {
      playerNames.push(`Player ${i + 1}`);
    }
  }

  return {
    playerCount,
    imposterCount,
    category: chosenCategory,
    selectedCategories: categories,
    secretWord,
    imposterIndices,
    playerNames,
    currentRevealIndex: 0,
    phase: 'REVEAL',
    discussionSeconds: 0,
    isTimerRunning: false,
    votes: {},
    votedPlayers: [],
    winningTeam: null,
    startedAt: Date.now(),
    lastSecretWord: secretWord,
  };
}

export function getPlayerRole(playerIndex: number, gameState: GameState): PlayerInfo {
  const isImposter = gameState.imposterIndices.includes(playerIndex);
  const name = gameState.playerNames[playerIndex] || `Player ${playerIndex + 1}`;

  return {
    index: playerIndex,
    playerNumber: playerIndex + 1,
    name,
    isImposter,
    // IMPORTANT: Imposters NEVER receive the secret word
    word: isImposter ? '' : gameState.secretWord,
  };
}
