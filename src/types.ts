export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  words: string[];
}

export type PlayerRole = 'NORMAL' | 'IMPOSTER';

export interface PlayerInfo {
  index: number; // 0-based
  playerNumber: number; // 1-based: Player 1, Player 2, etc.
  name: string; // "Player 1" or custom name
  isImposter: boolean;
  word: string; // The secret word for normal players, or "" / redacted for imposters
}

export interface GameState {
  playerCount: number;
  imposterCount: number;
  category: Category;
  selectedCategories?: Category[];
  secretWord: string;
  imposterIndices: number[]; // 0-based indexes
  playerNames: string[];
  currentRevealIndex: number; // 0 to playerCount - 1
  phase: 'HOME' | 'SETUP' | 'REVEAL' | 'DISCUSSION' | 'VOTING' | 'RESULTS';
  // Discussion state
  discussionSeconds: number;
  isTimerRunning: boolean;
  // Voting state: mapping of voterIndex or tallied votes
  votes: Record<number, number>; // playerIndex -> voteCount
  votedPlayers?: number[]; // list of players selected as suspect
  winningTeam?: 'PLAYERS' | 'IMPOSTERS' | null;
  startedAt: number;
  lastSecretWord?: string;
}

export interface GameStats {
  gamesPlayed: number;
  imposterWins: number;
  playerWins: number;
  categoryCounts: Record<string, number>;
  totalImpostersCaught: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  theme: 'dark' | 'light';
  customNamesEnabled: boolean;
  defaultPlayerNames: string[];
  timerDurationSeconds: number;
}
