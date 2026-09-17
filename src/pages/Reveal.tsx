import React from 'react';
import { GameState } from '../types';
import { getPlayerRole } from '../utils/gameLogic';
import { PlayerCard } from '../components/PlayerCard';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { Volume2, VolumeX, Home, Settings } from 'lucide-react';
import { sound } from '../utils/sound';

interface RevealProps {
  gameState: GameState;
  onNextPlayer: () => void;
  onFinishReveal: () => void;
  onAbandonGame: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Reveal: React.FC<RevealProps> = ({
  gameState,
  onNextPlayer,
  onFinishReveal,
  onAbandonGame,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
}) => {
  const currentIndex = gameState.currentRevealIndex;
  const currentPlayer = getPlayerRole(currentIndex, gameState);
  const isLastPlayer = currentIndex === gameState.playerCount - 1;

  const handleAdvance = () => {
    if (isLastPlayer) {
      onFinishReveal();
    } else {
      onNextPlayer();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto px-4 py-4 select-none">
      {/* Top Navigation & Status Bar */}
      <header className="flex items-center justify-between gap-3 mb-2">
        <button
          onClick={onAbandonGame}
          aria-label="Exit Game"
          className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Progress Indicator */}
        <ProgressIndicator
          current={currentIndex}
          total={gameState.playerCount}
        />

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            aria-label="Toggle Sound"
            className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-pink-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-500" />
            )}
          </button>
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </header>

      {/* Main Interactive Player Card */}
      <main className="my-auto py-2 w-full">
        <PlayerCard
          key={currentIndex}
          player={currentPlayer}
          category={gameState.category}
          isLastPlayer={isLastPlayer}
          nextPlayerName={
            !isLastPlayer ? gameState.playerNames[currentIndex + 1] : undefined
          }
          onNextPlayer={handleAdvance}
        />
      </main>
    </div>
  );
};
