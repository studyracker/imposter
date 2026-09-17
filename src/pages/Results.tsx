import React, { useEffect, useState } from 'react';
import { GameState } from '../types';
import { Button } from '../components/Button';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  UserX,
  PlusCircle,
  Home,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onNewGame: () => void;
  onRecordWinner: (winner: 'PLAYERS' | 'IMPOSTERS') => void;
}

export const Results: React.FC<ResultsProps> = ({
  gameState,
  onPlayAgain,
  onNewGame,
  onRecordWinner,
}) => {
  const [winnerClaimed, setWinnerClaimed] = useState<'PLAYERS' | 'IMPOSTERS' | null>(
    gameState.winningTeam || null
  );

  // Trigger confetti and victory fanfare on mount
  useEffect(() => {
    sound.playVictory();

    const fireConfetti = () => {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        console.log('Confetti triggered', e);
      }
    };

    fireConfetti();
    const timer = setTimeout(() => {
      fireConfetti();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleClaimWinner = (team: 'PLAYERS' | 'IMPOSTERS') => {
    sound.playClick();
    setWinnerClaimed(team);
    onRecordWinner(team);
  };

  const imposterNames = gameState.imposterIndices.map(
    (idx) => gameState.playerNames[idx] || `Player ${idx + 1}`
  );

  // Votes summary display if any votes were tallied
  const hasVotes = (Object.values(gameState.votes) as number[]).some((v: number) => v > 0);
  const sortedVoteEntries = (Object.entries(gameState.votes) as [string, number][])
    .map(([idxStr, count]) => ({
      index: Number(idxStr),
      name: gameState.playerNames[Number(idxStr)] || `Player ${Number(idxStr) + 1}`,
      count: Number(count),
      isImposter: gameState.imposterIndices.includes(Number(idxStr)),
    }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto px-4 py-4 select-none pb-8">
      {/* Top Header */}
      <header className="flex items-center justify-between gap-3 mb-2">
        <button
          onClick={onNewGame}
          aria-label="New Game"
          className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Home className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Round Summary</span>
        </div>

        <div className="w-10" />
      </header>

      {/* Main Results Content */}
      <main className="my-auto flex flex-col items-center text-center gap-5 py-3">
        {/* Title */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-1"
        >
          <div className="text-4xl sm:text-5xl animate-bounce">🎉</div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
            ROUND COMPLETE!
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            The secret is out and roles are uncovered.
          </p>
        </motion.div>

        {/* Secret Word Reveal Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="w-full p-5 rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border-2 border-pink-500/50 shadow-xl shadow-pink-500/10"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
            The Secret Word Was
          </div>
          <div className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-purple-300 tracking-wider py-1 break-words">
            {gameState.secretWord.toUpperCase()}
          </div>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-xs text-neutral-300">
            <span>{gameState.category.icon}</span>
            <span className="font-semibold">{gameState.category.name}</span>
            {gameState.selectedCategories && gameState.selectedCategories.length > 1 && (
              <span className="text-[10px] text-pink-400 font-medium">
                (from {gameState.selectedCategories.length} categories)
              </span>
            )}
          </div>
        </motion.div>

        {/* Imposter Reveal Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full p-5 rounded-3xl bg-red-950/40 border-2 border-red-500/60 shadow-xl shadow-red-950/50"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>The Imposter{imposterNames.length > 1 ? 's Were' : ' Was'}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {imposterNames.map((name) => (
              <div
                key={name}
                className="px-4 py-2 rounded-2xl bg-red-600 text-white font-display font-black text-lg sm:text-xl shadow-md shadow-red-600/40 flex items-center gap-2"
              >
                <span>🤫</span>
                <span>{name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Optional Votes Breakdown */}
        {hasVotes && sortedVoteEntries.length > 0 && (
          <div className="w-full p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-left">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-400 mb-2">
              Voting Tally Results
            </h4>
            <div className="space-y-1.5">
              {sortedVoteEntries.map((item) => (
                <div
                  key={item.index}
                  className="flex items-center justify-between text-xs sm:text-sm p-1.5 rounded-xl bg-neutral-800/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.name}</span>
                    {item.isImposter && (
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        Imposter
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-pink-300">
                    {item.count} vote{item.count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Outcome Selector: Update Game Stats */}
        <div className="w-full p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Who won this round?
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleClaimWinner('PLAYERS')}
              className={`p-2.5 rounded-2xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                winnerClaimed === 'PLAYERS'
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Crew Won</span>
            </button>

            <button
              onClick={() => handleClaimWinner('IMPOSTERS')}
              className={`p-2.5 rounded-2xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                winnerClaimed === 'IMPOSTERS'
                  ? 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-600/30'
                  : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-300'
              }`}
            >
              <UserX className="w-4 h-4" />
              <span>Imposters Won</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Action Buttons */}
      <footer className="w-full flex flex-col gap-2.5">
        <Button
          id="play-again-btn"
          variant="primary"
          size="xl"
          fullWidth
          icon={<RotateCcw className="w-5 h-5" />}
          onClick={onPlayAgain}
        >
          PLAY AGAIN
        </Button>

        <Button
          id="new-game-btn"
          variant="secondary"
          size="lg"
          fullWidth
          icon={<PlusCircle className="w-5 h-5 text-neutral-400" />}
          onClick={onNewGame}
        >
          NEW GAME
        </Button>
      </footer>
    </div>
  );
};
