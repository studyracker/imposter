import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { Button } from '../components/Button';
import {
  Users,
  Play,
  Pause,
  RotateCcw,
  Vote,
  Eye,
  HelpCircle,
  Home,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface DiscussionProps {
  gameState: GameState;
  onProceedToVoting: () => void;
  onDirectReveal: () => void;
  onRestartRound: () => void;
  onNewGame: () => void;
  onOpenHowToPlay: () => void;
}

export const Discussion: React.FC<DiscussionProps> = ({
  gameState,
  onProceedToVoting,
  onDirectReveal,
  onRestartRound,
  onNewGame,
  onOpenHowToPlay,
}) => {
  // 2-minute default countdown timer for discussion
  const [secondsRemaining, setSecondsRemaining] = useState<number>(120);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            sound.playSuspense();
            setIsTimerActive(false);
            return 0;
          }
          if (prev <= 6 && prev > 1) {
            sound.playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, secondsRemaining]);

  const toggleTimer = () => {
    sound.playClick();
    setIsTimerActive((prev) => !prev);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsTimerActive(false);
    setSecondsRemaining(120);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-md mx-auto px-4 py-4 select-none pb-8">
      {/* Top Header */}
      <header className="flex items-center justify-between gap-3 mb-2">
        <button
          onClick={onNewGame}
          aria-label="Home"
          className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <Home className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-400">
          <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
          <span>Discussion Phase</span>
        </div>

        <button
          onClick={onOpenHowToPlay}
          aria-label="Rules"
          className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <HelpCircle className="w-5 h-5 text-neutral-400" />
        </button>
      </header>

      {/* Main Discussion Content */}
      <main className="my-auto flex flex-col items-center text-center gap-5 py-4">
        {/* Celebration check badge */}
        <div className="w-16 h-16 rounded-3xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-3xl shadow-inner">
          🤫
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            Everyone has seen their word!
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Pass the phone to the table and begin giving clues.
          </p>
        </div>

        {/* Selected Category Pill */}
        <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 w-full shadow-lg">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
            Round Category
          </div>
          <div className="flex items-center justify-center gap-2.5 text-2xl font-black text-amber-300">
            <span>{gameState.category.icon}</span>
            <span className="font-display">{gameState.category.name}</span>
          </div>
          {gameState.selectedCategories && gameState.selectedCategories.length > 1 && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-300">
              <Sparkles className="w-3 h-3" />
              <span>Drawn from {gameState.selectedCategories.length} selected categories</span>
            </div>
          )}
          <p className="text-xs text-neutral-400 mt-2 italic">
            &ldquo;Give clues without saying the secret word.&rdquo;
          </p>
        </div>

        {/* Discussion Timer Widget */}
        <div className="w-full p-4 rounded-3xl bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Round Timer
            </div>
            <div className={`font-display text-3xl font-black tabular-nums ${
              secondsRemaining <= 10 && secondsRemaining > 0 ? 'text-red-400 animate-pulse' : 'text-white'
            }`}>
              {formatTime(secondsRemaining)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTimer}
              className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              {isTimerActive ? (
                <>
                  <Pause className="w-4 h-4 text-amber-400" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400 fill-current" />
                  <span>Start</span>
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              aria-label="Reset Timer"
              className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How Clues Work Guide Card */}
        <div className="w-full p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-left text-xs text-neutral-400 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>How to give clues:</span>
          </div>
          <p>
            &bull; Go clockwise around the group. Each player states a short clue or association.
          </p>
          <p>
            &bull; <strong>Normal players:</strong> Don&rsquo;t be too obvious or the imposter will deduce the word!
          </p>
          <p>
            &bull; <strong>Imposters:</strong> Blend in with vague clues based on the category!
          </p>
        </div>
      </main>

      {/* Action Buttons */}
      <footer className="w-full flex flex-col gap-2.5">
        <Button
          id="proceed-to-vote-btn"
          variant="primary"
          size="xl"
          fullWidth
          icon={<Vote className="w-5 h-5" />}
          onClick={onProceedToVoting}
        >
          START VOTING
        </Button>

        <Button
          id="direct-reveal-btn"
          variant="secondary"
          size="lg"
          fullWidth
          icon={<Eye className="w-5 h-5 text-rose-400" />}
          onClick={onDirectReveal}
        >
          REVEAL IMPOSTERS
        </Button>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="outline"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={onRestartRound}
          >
            Restart Round
          </Button>
          <Button
            variant="ghost"
            size="md"
            icon={<Users className="w-4 h-4" />}
            onClick={onNewGame}
          >
            New Game
          </Button>
        </div>
      </footer>
    </div>
  );
};
