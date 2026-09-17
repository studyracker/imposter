import React, { useState, useEffect } from 'react';
import { PlayerInfo, Category } from '../types';
import { sound } from '../utils/sound';
import { Button } from './Button';
import { Lock, Eye, EyeOff, ShieldAlert, ArrowRight, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlayerCardProps {
  player: PlayerInfo;
  category: Category;
  isLastPlayer: boolean;
  nextPlayerName?: string;
  onNextPlayer: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  category,
  isLastPlayer,
  nextPlayerName,
  onNextPlayer,
}) => {
  // Card states: 'FACE_DOWN' | 'REVEALED' | 'HIDDEN_PASS'
  const [cardState, setCardState] = useState<'FACE_DOWN' | 'REVEALED' | 'HIDDEN_PASS'>('FACE_DOWN');

  // Reset card state whenever player index changes
  useEffect(() => {
    setCardState('FACE_DOWN');
  }, [player.index]);

  const handleOpenCard = () => {
    sound.playCardOpen();
    setCardState('REVEALED');
  };

  const handleHideCard = () => {
    sound.playCardClose();
    setCardState('HIDDEN_PASS');
  };

  const handleProceed = () => {
    sound.playNextPlayer();
    onNextPlayer();
  };

  const isRevealed = cardState === 'REVEALED';
  const isPassPhase = cardState === 'HIDDEN_PASS';

  const nextDisplayName =
    nextPlayerName || (isLastPlayer ? '' : `Player ${player.playerNumber + 1}`);

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center select-none">
      {/* Privacy Notice Banner */}
      <div className="mb-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-400">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Make sure nobody else is looking</span>
        </div>
      </div>

      {/* Main 3D Interactive Card Container */}
      <div className="w-full aspect-[3/4.2] max-h-[460px] perspective-1000">
        <div
          className={`w-full h-full relative preserve-3d transition-transform duration-500 ease-out ${
            isRevealed ? 'rotate-y-180' : ''
          }`}
        >
          {/* ================= CARD FRONT (Face Down: Secret locked) ================= */}
          <div
            id="card-face-front"
            onClick={!isRevealed ? handleOpenCard : undefined}
            className={`absolute inset-0 w-full h-full backface-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-950 border-2 border-neutral-800/80 shadow-2xl shadow-black/80 transition-opacity duration-300 ${
              isRevealed
                ? 'pointer-events-none opacity-0 z-0'
                : 'pointer-events-auto opacity-100 z-20 cursor-pointer'
            }`}
          >
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top header on card */}
            <div className="relative z-10 flex items-center gap-2 text-neutral-400 text-xs sm:text-sm font-bold uppercase tracking-widest">
              <User className="w-4 h-4 text-pink-400" />
              <span>{player.name}</span>
            </div>

            {/* Middle lock secret icon */}
            <div className="relative z-10 flex flex-col items-center gap-3 my-auto">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-neutral-800/70 border border-neutral-700/60 flex items-center justify-center shadow-inner relative group">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-pink-500/10 to-rose-500/10 opacity-75" />
                <Lock className="w-12 h-12 sm:w-14 sm:h-14 text-pink-400 stroke-[1.75]" />
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                {isPassPhase ? 'CARD HIDDEN' : 'SECRET'}
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-[220px]">
                {isPassPhase
                  ? 'Your word is safely hidden! Pass the phone or tap below to peek again.'
                  : 'Tap below to secretly reveal your assigned role'}
              </p>
            </div>

            {/* Bottom Open Card Button */}
            <div className="relative z-10 w-full pt-2">
              <Button
                id="open-card-btn"
                variant={isPassPhase ? 'outline' : 'primary'}
                size="lg"
                fullWidth
                icon={<Eye className="w-5 h-5" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenCard();
                }}
              >
                {isPassPhase ? 'PEEK AGAIN' : 'OPEN CARD'}
              </Button>
            </div>
          </div>

          {/* ================= CARD BACK (Face Up: Secret role revealed) ================= */}
          <div
            id="card-face-back"
            onClick={isRevealed ? handleHideCard : undefined}
            className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-2xl border-2 transition-opacity duration-300 ${
              player.isImposter
                ? 'bg-gradient-to-b from-red-950/60 via-neutral-900 to-neutral-950 border-red-500/60 shadow-red-950/50'
                : 'bg-gradient-to-b from-emerald-950/50 via-neutral-900 to-neutral-950 border-emerald-500/50 shadow-emerald-950/40'
            } ${
              isRevealed
                ? 'pointer-events-auto opacity-100 z-20 cursor-pointer'
                : 'pointer-events-none opacity-0 z-0'
            }`}
          >
            {/* Top header */}
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-widest">
              <span>{player.name}</span>
            </div>

            {/* Middle content depending on whether player is Imposter or Normal */}
            <div className="flex flex-col items-center justify-center my-auto w-full px-2">
              {player.isImposter ? (
                // ================= IMPOSTER VIEW =================
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="text-5xl sm:text-6xl animate-bounce">🤫</div>

                  <div className="inline-block px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-extrabold tracking-widest uppercase">
                    Classified Role
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-red-400 uppercase">
                    YOU ARE THE IMPOSTER
                  </h3>

                  <div className="mt-2 p-3.5 sm:p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 w-full max-w-[280px]">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Category
                    </div>
                    <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-extrabold text-amber-300">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 italic max-w-[260px] mt-1">
                    Blend in, listen carefully, and figure out the secret word!
                  </p>
                </motion.div>
              ) : (
                // ================= NORMAL PLAYER VIEW =================
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center gap-3 w-full"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-extrabold tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>YOUR SECRET WORD</span>
                  </div>

                  <div className="text-4xl sm:text-5xl mt-1">
                    {category.icon}
                  </div>

                  <div className="font-display text-2xl sm:text-4xl font-black tracking-wider text-white px-3 py-2 rounded-2xl bg-neutral-800/90 border border-neutral-700 w-full max-w-[280px] shadow-inner break-words">
                    {player.word.toUpperCase()}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
                    <span>Category:</span>
                    <span className="text-neutral-200">{category.name}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-rose-400/90 font-bold max-w-[240px] mt-1">
                    Don't say the word out loud!
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom Hide Word Button */}
            <div className="w-full pt-2">
              <Button
                id="hide-word-btn"
                variant="secondary"
                size="lg"
                fullWidth
                icon={<EyeOff className="w-5 h-5 text-rose-400" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleHideCard();
                }}
              >
                HIDE WORD
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PASS PHONE PHASE BANNER & NEXT PLAYER BUTTON ================= */}
      <div className="w-full mt-5">
        <AnimatePresence mode="wait">
          {isPassPhase ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3.5 w-full"
            >
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-center w-full shadow-lg">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Card Hidden Safely
                </div>
                <div className="font-display text-lg sm:text-xl font-bold text-white">
                  {isLastPlayer
                    ? 'All players have seen their role!'
                    : `Pass the phone to ${nextDisplayName}`}
                </div>
              </div>

              <Button
                id="next-player-btn"
                variant="primary"
                size="xl"
                fullWidth
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={handleProceed}
              >
                {isLastPlayer ? 'FINISH REVEAL' : 'NEXT PLAYER'}
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
