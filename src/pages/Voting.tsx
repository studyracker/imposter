import React, { useState } from 'react';
import { GameState } from '../types';
import { Button } from '../components/Button';
import { Vote, Eye, Minus, Plus, AlertCircle, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface VotingProps {
  gameState: GameState;
  onBackToDiscussion: () => void;
  onRevealResults: (votesSummary: Record<number, number>, selectedSuspects: number[]) => void;
}

export const Voting: React.FC<VotingProps> = ({
  gameState,
  onBackToDiscussion,
  onRevealResults,
}) => {
  // Support both vote tallying (each person voted) and suspect selection
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    for (let i = 0; i < gameState.playerCount; i++) {
      initial[i] = 0;
    }
    return initial;
  });

  const [selectedSuspects, setSelectedSuspects] = useState<number[]>([]);
  const [mode, setMode] = useState<'quick' | 'tally'>('quick');

  const maxSelectable = gameState.imposterCount;

  const handleToggleSuspect = (playerIndex: number) => {
    sound.playClick();
    if (selectedSuspects.includes(playerIndex)) {
      setSelectedSuspects(selectedSuspects.filter((i) => i !== playerIndex));
    } else {
      if (selectedSuspects.length >= maxSelectable) {
        // Replace oldest or keep max
        setSelectedSuspects([...selectedSuspects.slice(1), playerIndex]);
      } else {
        setSelectedSuspects([...selectedSuspects, playerIndex]);
      }
    }
  };

  const handleAdjustVote = (playerIndex: number, delta: number) => {
    sound.playClick();
    setVoteCounts((prev) => {
      const current = prev[playerIndex] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [playerIndex]: updated };
    });
  };

  const handleProceed = () => {
    sound.playSuspense();
    onRevealResults(voteCounts, selectedSuspects);
  };

  const totalVotesCast = (Object.values(voteCounts) as number[]).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto px-4 py-4 select-none pb-8">
      {/* Top Header */}
      <header className="flex items-center justify-between gap-3 mb-2">
        <button
          onClick={onBackToDiscussion}
          aria-label="Back to discussion"
          className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="font-display font-black text-xl text-white">Cast Your Votes</h2>
        </div>

        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="my-auto flex flex-col gap-4 py-3">
        {/* Instructions Banner */}
        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 text-center shadow-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Vote className="w-3.5 h-3.5" />
            <span>
              {maxSelectable === 1 ? '1 Imposter to Find' : `${maxSelectable} Imposters to Find`}
            </span>
          </div>
          <h3 className="font-display font-black text-xl text-white">
            Who do you suspect?
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Tap the most suspicious player{maxSelectable > 1 ? 's' : ''} or record individual votes.
          </p>

          {/* Mode Switcher */}
          <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-neutral-800/80">
            <button
              onClick={() => {
                sound.playClick();
                setMode('quick');
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                mode === 'quick'
                  ? 'bg-pink-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Quick Suspect Selection ({selectedSuspects.length}/{maxSelectable})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setMode('tally');
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                mode === 'tally'
                  ? 'bg-purple-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Vote Tally ({totalVotesCast})
            </button>
          </div>
        </div>

        {/* Player Voting Cards List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {Array.from({ length: gameState.playerCount }, (_, i) => {
            const playerName = gameState.playerNames[i] || `Player ${i + 1}`;
            const isSelected = selectedSuspects.includes(i);
            const votes = voteCounts[i] || 0;

            if (mode === 'quick') {
              return (
                <div
                  key={i}
                  onClick={() => handleToggleSuspect(i)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-950/50 border-red-500 shadow-md shadow-red-500/20'
                      : 'bg-neutral-900 hover:bg-neutral-800/90 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-sm ${
                        isSelected
                          ? 'bg-red-500 text-white'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm sm:text-base text-white">
                        {playerName}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {isSelected ? 'Marked as prime suspect' : 'Tap to mark as suspect'}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-red-500 border-red-400 text-white'
                        : 'border-neutral-700 bg-neutral-800 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              );
            }

            // Tally mode
            return (
              <div
                key={i}
                className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 flex items-center justify-center font-display font-bold text-sm text-neutral-300">
                    {i + 1}
                  </div>
                  <span className="font-display font-bold text-sm text-white">{playerName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdjustVote(i, -1)}
                    disabled={votes === 0}
                    aria-label={`Decrease votes for ${playerName}`}
                    className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-display font-black text-base text-white">
                    {votes}
                  </span>
                  <button
                    onClick={() => handleAdjustVote(i, 1)}
                    aria-label={`Increase votes for ${playerName}`}
                    className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Summary Notice */}
        {mode === 'quick' && selectedSuspects.length > 0 && (
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>
              Suspecting:{' '}
              <strong className="text-pink-400">
                {selectedSuspects
                  .map((idx) => gameState.playerNames[idx] || `Player ${idx + 1}`)
                  .join(', ')}
              </strong>
            </span>
          </div>
        )}
      </main>

      {/* Action CTA */}
      <footer className="w-full pt-2">
        <Button
          id="reveal-imposters-btn"
          variant="primary"
          size="xl"
          fullWidth
          icon={<Eye className="w-5 h-5" />}
          onClick={handleProceed}
        >
          REVEAL IMPOSTERS
        </Button>
      </footer>
    </div>
  );
};
