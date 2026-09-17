import React from 'react';
import { Button } from '../components/Button';
import { Play, HelpCircle, BarChart3, Settings, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onStartGame: () => void;
  onResumeGame?: () => void;
  hasActiveGame: boolean;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onStartGame,
  onResumeGame,
  hasActiveGame,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenStats,
}) => {
  return (
    <div className="min-h-[88vh] flex flex-col justify-between items-center px-4 py-6 max-w-md mx-auto w-full select-none text-center">
      {/* Top action bar */}
      <header className="w-full flex items-center justify-between">
        <button
          id="home-stats-btn"
          onClick={onOpenStats}
          aria-label="View statistics"
          className="p-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer shadow-md"
        >
          <BarChart3 className="w-5 h-5 text-emerald-400" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/70 border border-neutral-800 text-xs font-semibold text-neutral-400">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Local Party Game</span>
        </div>

        <button
          id="home-settings-btn"
          onClick={onOpenSettings}
          aria-label="Open settings"
          className="p-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer shadow-md"
        >
          <Settings className="w-5 h-5 text-pink-400" />
        </button>
      </header>

      {/* Main hero badge & title */}
      <main className="my-auto flex flex-col items-center gap-6 py-6">
        {/* Animated Neon Logo Graphic */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative"
        >
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 p-[2px] shadow-2xl shadow-pink-600/30">
            <div className="w-full h-full bg-neutral-950 rounded-[22px] flex flex-col items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent" />
              <span className="text-5xl sm:text-6xl animate-pulse">🤫</span>
              <div className="absolute bottom-2 text-[10px] font-black uppercase tracking-widest text-pink-400">
                PASS &bull; PLAY
              </div>
            </div>
          </div>
          {/* Subtle surrounding glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-2xl -z-10" />
        </motion.div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm"
          >
            IMPOSTER
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-neutral-300 font-medium max-w-[280px] mx-auto leading-snug"
          >
            One word. One secret.<br />
            <span className="text-pink-400 font-bold">Find the imposter.</span>
          </motion.p>
        </div>

        {/* Quick pass-the-phone highlight badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-400">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Pass 1 phone between 3 to 12 friends</span>
        </div>
      </main>

      {/* Bottom CTA Buttons */}
      <footer className="w-full flex flex-col gap-3 pb-2">
        {hasActiveGame && onResumeGame && (
          <Button
            id="resume-game-btn"
            variant="accent"
            size="xl"
            fullWidth
            icon={<Play className="w-5 h-5 fill-current" />}
            onClick={onResumeGame}
          >
            RESUME ACTIVE ROUND
          </Button>
        )}

        <Button
          id="start-game-btn"
          variant="primary"
          size="xl"
          fullWidth
          icon={<Play className="w-5 h-5 fill-current" />}
          onClick={onStartGame}
        >
          {hasActiveGame ? 'START NEW GAME' : 'START GAME'}
        </Button>

        <Button
          id="how-to-play-btn"
          variant="secondary"
          size="lg"
          fullWidth
          icon={<HelpCircle className="w-5 h-5 text-neutral-400" />}
          onClick={onOpenHowToPlay}
        >
          HOW TO PLAY
        </Button>
      </footer>
    </div>
  );
};
