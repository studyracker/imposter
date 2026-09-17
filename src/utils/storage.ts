import { AppSettings, GameState, GameStats } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'imposter_settings_v1',
  GAME_STATE: 'imposter_active_game_v1',
  STATS: 'imposter_stats_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  theme: 'dark',
  customNamesEnabled: false,
  defaultPlayerNames: [],
  timerDurationSeconds: 120, // 2 minutes discussion default
};

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  imposterWins: 0,
  playerWins: 0,
  categoryCounts: {},
  totalImpostersCaught: 0,
};

export function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not load settings from localStorage', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Could not save settings to localStorage', e);
  }
}

export function loadActiveGame(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    if (saved) {
      const parsed = JSON.parse(saved) as GameState;
      // Basic integrity check
      if (parsed.playerCount && parsed.secretWord && parsed.imposterIndices) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not load active game from localStorage', e);
  }
  return null;
}

export function saveActiveGame(game: GameState | null): void {
  try {
    if (!game || game.phase === 'HOME' || game.phase === 'RESULTS') {
      // Don't store lingering secrets when round ends or at home
      localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    } else {
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(game));
    }
  } catch (e) {
    console.warn('Could not save active game to localStorage', e);
  }
}

export function clearActiveGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  } catch (e) {
    console.warn('Could not clear active game', e);
  }
}

export function loadStats(): GameStats {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.STATS);
    if (saved) {
      return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not load stats from localStorage', e);
  }
  return DEFAULT_STATS;
}

export function recordGameResult(
  categoryName: string,
  winner: 'PLAYERS' | 'IMPOSTERS',
  impostersCaughtCount: number
): GameStats {
  const current = loadStats();
  const updated: GameStats = {
    ...current,
    gamesPlayed: current.gamesPlayed + 1,
    imposterWins: winner === 'IMPOSTERS' ? current.imposterWins + 1 : current.imposterWins,
    playerWins: winner === 'PLAYERS' ? current.playerWins + 1 : current.playerWins,
    categoryCounts: {
      ...current.categoryCounts,
      [categoryName]: (current.categoryCounts[categoryName] || 0) + 1,
    },
    totalImpostersCaught: current.totalImpostersCaught + impostersCaughtCount,
  };

  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save stats to localStorage', e);
  }

  return updated;
}

export function resetStats(): GameStats {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(DEFAULT_STATS));
  } catch (e) {
    console.warn('Could not reset stats', e);
  }
  return DEFAULT_STATS;
}
