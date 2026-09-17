import React, { useState, useEffect } from 'react';
import { GameState, Category, AppSettings, GameStats } from './types';
import {
  loadSettings,
  saveSettings,
  loadActiveGame,
  saveActiveGame,
  clearActiveGame,
  loadStats,
  recordGameResult,
  resetStats,
} from './utils/storage';
import { createGame } from './utils/gameLogic';
import { sound } from './utils/sound';

import { Home } from './pages/Home';
import { Setup } from './pages/Setup';
import { Reveal } from './pages/Reveal';
import { Discussion } from './pages/Discussion';
import { Voting } from './pages/Voting';
import { Results } from './pages/Results';

import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { StatisticsModal } from './components/StatisticsModal';
import { ConfirmModal } from './components/ConfirmModal';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [stats, setStats] = useState<GameStats>(() => loadStats());
  const [gameState, setGameState] = useState<GameState | null>(() => loadActiveGame());

  // Navigation phase
  const [phase, setPhase] = useState<GameState['phase']>(() => {
    const saved = loadActiveGame();
    if (saved && saved.phase) {
      return saved.phase;
    }
    return 'HOME';
  });

  // Modals state
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isAbandonConfirmOpen, setIsAbandonConfirmOpen] = useState<boolean>(false);
  const [pendingActionAfterAbandon, setPendingActionAfterAbandon] = useState<'HOME' | 'SETUP' | null>(null);

  // Sync sound engine enabled state with settings
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Sync theme class with settings
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Sync active game state to localStorage for refresh recovery
  useEffect(() => {
    if (gameState) {
      saveActiveGame({ ...gameState, phase });
    } else {
      clearActiveGame();
    }
  }, [gameState, phase]);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Start round
  const handleStartRound = (
    playerCount: number,
    imposterCount: number,
    categories: Category[],
    playerNames: string[]
  ) => {
    try {
      const newGame = createGame(playerCount, imposterCount, categories, {
        playerNames,
        excludeWord: gameState?.lastSecretWord,
      });
      setGameState(newGame);
      setPhase('REVEAL');
    } catch (e) {
      console.error('Error creating game', e);
    }
  };

  // Move to next player in reveal sequence
  const handleNextPlayer = () => {
    if (!gameState) return;
    const nextIndex = gameState.currentRevealIndex + 1;
    if (nextIndex < gameState.playerCount) {
      setGameState({
        ...gameState,
        currentRevealIndex: nextIndex,
      });
    } else {
      setPhase('DISCUSSION');
    }
  };

  // Finish reveal sequence
  const handleFinishReveal = () => {
    setPhase('DISCUSSION');
  };

  // Discussion -> Voting
  const handleProceedToVoting = () => {
    setPhase('VOTING');
  };

  // Voting -> Results
  const handleRevealResults = (
    votesSummary: Record<number, number>,
    selectedSuspects: number[]
  ) => {
    if (!gameState) return;
    setGameState({
      ...gameState,
      votes: votesSummary,
      votedPlayers: selectedSuspects,
      phase: 'RESULTS',
    });
    setPhase('RESULTS');
  };

  // Direct reveal from Discussion screen
  const handleDirectReveal = () => {
    if (!gameState) return;
    sound.playSuspense();
    setPhase('RESULTS');
  };

  // Play Again: Keep players, imposters, and category; generate new word and random roles
  const handlePlayAgain = () => {
    if (!gameState) return;
    const categoriesPool =
      gameState.selectedCategories && gameState.selectedCategories.length > 0
        ? gameState.selectedCategories
        : [gameState.category];
    const newGame = createGame(
      gameState.playerCount,
      gameState.imposterCount,
      categoriesPool,
      {
        playerNames: gameState.playerNames,
        excludeWord: gameState.secretWord,
      }
    );
    setGameState(newGame);
    setPhase('REVEAL');
  };

  // New Game: Return to setup
  const handleNewGame = () => {
    setPhase('SETUP');
  };

  // Abandon active game confirmation
  const requestAbandonGame = (target: 'HOME' | 'SETUP' = 'HOME') => {
    if (phase === 'REVEAL' || phase === 'DISCUSSION' || phase === 'VOTING') {
      setPendingActionAfterAbandon(target);
      setIsAbandonConfirmOpen(true);
    } else {
      clearActiveGame();
      setGameState(null);
      setPhase(target);
    }
  };

  const confirmAbandon = () => {
    clearActiveGame();
    setGameState(null);
    setIsAbandonConfirmOpen(false);
    setPhase(pendingActionAfterAbandon || 'HOME');
    setPendingActionAfterAbandon(null);
  };

  // Record round outcome (Crew vs Imposters)
  const handleRecordWinner = (winner: 'PLAYERS' | 'IMPOSTERS') => {
    if (!gameState) return;
    const imposterCount = gameState.imposterIndices.length;
    const caught = winner === 'PLAYERS' ? imposterCount : 0;
    const updated = recordGameResult(gameState.category.name, winner, caught);
    setStats(updated);
  };

  const handleResetStats = () => {
    const fresh = resetStats();
    setStats(fresh);
  };

  const hasActiveGameInProgress =
    gameState !== null &&
    (phase === 'REVEAL' || phase === 'DISCUSSION' || phase === 'VOTING');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      {/* Dynamic Screen Rendering */}
      {phase === 'HOME' && (
        <Home
          onStartGame={() => setPhase('SETUP')}
          onResumeGame={hasActiveGameInProgress ? () => setPhase(gameState!.phase) : undefined}
          hasActiveGame={hasActiveGameInProgress}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
        />
      )}

      {phase === 'SETUP' && (
        <Setup
          onBack={() => setPhase('HOME')}
          onStartRound={handleStartRound}
          settings={settings}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          initialPlayerCount={gameState?.playerCount ?? 5}
          initialImposterCount={gameState?.imposterCount ?? 1}
          initialCategoryIds={
            gameState?.selectedCategories?.map((c) => c.id) ||
            (gameState?.category ? [gameState.category.id] : undefined)
          }
        />
      )}

      {phase === 'REVEAL' && gameState && (
        <Reveal
          gameState={gameState}
          onNextPlayer={handleNextPlayer}
          onFinishReveal={handleFinishReveal}
          onAbandonGame={() => requestAbandonGame('HOME')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() =>
            handleUpdateSettings({
              ...settings,
              soundEnabled: !settings.soundEnabled,
            })
          }
        />
      )}

      {phase === 'DISCUSSION' && gameState && (
        <Discussion
          gameState={gameState}
          onProceedToVoting={handleProceedToVoting}
          onDirectReveal={handleDirectReveal}
          onRestartRound={handlePlayAgain}
          onNewGame={() => requestAbandonGame('SETUP')}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        />
      )}

      {phase === 'VOTING' && gameState && (
        <Voting
          gameState={gameState}
          onBackToDiscussion={() => setPhase('DISCUSSION')}
          onRevealResults={handleRevealResults}
        />
      )}

      {phase === 'RESULTS' && gameState && (
        <Results
          gameState={gameState}
          onPlayAgain={handlePlayAgain}
          onNewGame={handleNewGame}
          onRecordWinner={handleRecordWinner}
        />
      )}

      {/* Global Modals */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onResetGameRequest={() => requestAbandonGame('HOME')}
        hasActiveGame={hasActiveGameInProgress}
      />

      <StatisticsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={handleResetStats}
      />

      <ConfirmModal
        isOpen={isAbandonConfirmOpen}
        title="Abandon Round?"
        message="Are you sure you want to end this round? Current player assignments and progress will be lost."
        confirmLabel="Abandon Game"
        cancelLabel="Continue Round"
        onConfirm={confirmAbandon}
        onCancel={() => setIsAbandonConfirmOpen(false)}
        isDestructive={true}
      />
    </div>
  );
}
