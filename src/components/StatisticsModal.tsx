import React, { useState } from 'react';
import { Modal } from './Modal';
import { GameStats } from '../types';
import { Trophy, Users, UserX, Trash2, Award } from 'lucide-react';
import { Button } from './Button';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const topCategories = (Object.entries(stats.categoryCounts) as [string, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const handleReset = () => {
    onResetStats();
    setConfirmReset(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Game Statistics" subtitle="Local Match Records">
      <div className="space-y-4">
        {/* Top metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-neutral-800/70 border border-neutral-700/70 flex flex-col items-center text-center">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 mb-2">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {stats.gamesPlayed}
            </div>
            <div className="text-xs text-neutral-400 font-medium mt-0.5">Games Played</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-800/70 border border-neutral-700/70 flex flex-col items-center text-center">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mb-2">
              <Users className="w-5 h-5" />
            </div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-400">
              {stats.playerWins}
            </div>
            <div className="text-xs text-neutral-400 font-medium mt-0.5">Crew Wins</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-800/70 border border-neutral-700/70 flex flex-col items-center text-center">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 mb-2">
              <UserX className="w-5 h-5" />
            </div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-rose-400">
              {stats.imposterWins}
            </div>
            <div className="text-xs text-neutral-400 font-medium mt-0.5">Imposter Wins</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-800/70 border border-neutral-700/70 flex flex-col items-center text-center">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mb-2">
              <Award className="w-5 h-5" />
            </div>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-purple-400">
              {stats.totalImpostersCaught}
            </div>
            <div className="text-xs text-neutral-400 font-medium mt-0.5">Imposters Caught</div>
          </div>
        </div>

        {/* Favorite categories */}
        <div className="p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700/50">
          <h4 className="font-display font-bold text-sm text-neutral-200 mb-3">
            Most Played Categories
          </h4>
          {topCategories.length > 0 ? (
            <div className="space-y-2">
              {topCategories.map(([categoryName, count]) => (
                <div key={categoryName} className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-neutral-300 font-medium">{categoryName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-700/80 text-pink-300 font-bold">
                    {count} round{count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic">No games played yet. Start a round!</p>
          )}
        </div>

        {/* Reset stats section */}
        <div className="pt-2 border-t border-neutral-800">
          {confirmReset ? (
            <div className="p-3 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-center justify-between gap-3">
              <span className="text-xs text-red-200 font-medium">Clear all records?</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleReset}>
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 className="w-4 h-4 text-neutral-400" />}
              onClick={() => setConfirmReset(true)}
              className="text-neutral-400 hover:text-red-400"
            >
              Reset Statistics
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
