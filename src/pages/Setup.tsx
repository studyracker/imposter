import React, { useState, useEffect } from 'react';
import { Category, AppSettings } from '../types';
import { CATEGORIES } from '../data/categories';
import { getMaxImposters, validateGameConfig } from '../utils/gameLogic';
import { CategoryCard } from '../components/CategoryCard';
import { Button } from '../components/Button';
import {
  Users,
  UserX,
  Play,
  ArrowLeft,
  Minus,
  Plus,
  AlertCircle,
  HelpCircle,
  Settings,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface SetupProps {
  onBack: () => void;
  onStartRound: (
    playerCount: number,
    imposterCount: number,
    categories: Category[],
    playerNames: string[]
  ) => void;
  settings: AppSettings;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  initialPlayerCount?: number;
  initialImposterCount?: number;
  initialCategoryIds?: string[];
  initialCategoryId?: string;
}

export const Setup: React.FC<SetupProps> = ({
  onBack,
  onStartRound,
  settings,
  onOpenHowToPlay,
  onOpenSettings,
  initialPlayerCount = 5,
  initialImposterCount = 1,
  initialCategoryIds,
  initialCategoryId,
}) => {
  const [playerCount, setPlayerCount] = useState<number>(initialPlayerCount);
  const [imposterCount, setImposterCount] = useState<number>(initialImposterCount);
  
  // Support multiple selected category IDs
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(() => {
    if (initialCategoryIds && initialCategoryIds.length > 0) {
      return initialCategoryIds;
    }
    if (initialCategoryId) {
      return [initialCategoryId];
    }
    return [CATEGORIES[0].id]; // Animals default
  });

  const [playerNames, setPlayerNames] = useState<string[]>(() =>
    Array.from({ length: 12 }, (_, i) => `Player ${i + 1}`)
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Validate imposter count bounds whenever player count changes
  useEffect(() => {
    const maxAllowed = getMaxImposters(playerCount);
    if (imposterCount > maxAllowed) {
      setImposterCount(maxAllowed);
    }
  }, [playerCount, imposterCount]);

  const maxImposters = getMaxImposters(playerCount);
  const playerOptions = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const selectedCategories = CATEGORIES.filter((c) => selectedCategoryIds.includes(c.id));
  const totalSelectedWords = selectedCategories.reduce((acc, cat) => acc + cat.words.length, 0);

  const handlePlayerCountChange = (count: number) => {
    sound.playClick();
    setPlayerCount(count);
    setErrorMsg(null);
  };

  const handleImposterCountChange = (count: number) => {
    sound.playClick();
    setImposterCount(count);
    setErrorMsg(null);
  };

  const handleToggleCategory = (cat: Category) => {
    sound.playClick();
    setErrorMsg(null);
    setSelectedCategoryIds((prev) => {
      if (prev.includes(cat.id)) {
        return prev.filter((id) => id !== cat.id);
      } else {
        return [...prev, cat.id];
      }
    });
  };

  const handleSelectAllCategories = () => {
    sound.playClick();
    setErrorMsg(null);
    setSelectedCategoryIds(CATEGORIES.map((c) => c.id));
  };

  const handlePickRandomCategory = () => {
    sound.playClick();
    setErrorMsg(null);
    const randomCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setSelectedCategoryIds([randomCat.id]);
  };

  const handleStart = () => {
    const validation = validateGameConfig(playerCount, imposterCount, selectedCategories);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Please check game settings.');
      return;
    }

    const currentNames = playerNames.slice(0, playerCount).map((name, i) => {
      return name.trim() ? name.trim() : `Player ${i + 1}`;
    });

    onStartRound(playerCount, imposterCount, selectedCategories, currentNames);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-xl mx-auto px-4 py-4 select-none pb-28">
      {/* Top Bar */}
      <header className="flex items-center justify-between gap-3 mb-4">
        <button
          id="setup-back-btn"
          onClick={onBack}
          aria-label="Back to home"
          className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="font-display font-black text-xl sm:text-2xl text-white">
            Create Your Game
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="setup-help-btn"
            onClick={onOpenHowToPlay}
            aria-label="Help"
            className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-neutral-400" />
          </button>
          <button
            id="setup-settings-btn"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-200 text-sm flex items-center gap-2.5 shadow-lg animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SECTION 1: Number of Players */}
        <section className="p-4 sm:p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Players
                </h3>
                <p className="text-xs text-neutral-400">How many people are playing?</p>
              </div>
            </div>
            {/* Stepper count display */}
            <div className="font-display font-black text-2xl text-pink-400 px-3 py-1 bg-neutral-800/90 rounded-2xl border border-neutral-700">
              {playerCount}
            </div>
          </div>

          {/* Stepper + Selectable Buttons */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => handlePlayerCountChange(Math.max(3, playerCount - 1))}
              disabled={playerCount <= 3}
              aria-label="Decrease players"
              className="w-11 h-11 rounded-2xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <Minus className="w-5 h-5" />
            </button>

            {/* Quick selectable pill chips */}
            <div className="flex-1 overflow-x-auto py-1 flex items-center gap-1.5 scrollbar-none">
              {playerOptions.map((n) => (
                <button
                  key={n}
                  onClick={() => handlePlayerCountChange(n)}
                  className={`h-11 min-w-[40px] px-3 rounded-2xl font-display font-bold text-sm transition-all cursor-pointer ${
                    playerCount === n
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30 ring-2 ring-pink-400/40'
                      : 'bg-neutral-800/80 hover:bg-neutral-700/90 text-neutral-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePlayerCountChange(Math.min(12, playerCount + 1))}
              disabled={playerCount >= 12}
              aria-label="Increase players"
              className="w-11 h-11 rounded-2xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* SECTION 2: Number of Imposters */}
        <section className="p-4 sm:p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Imposters
                </h3>
                <p className="text-xs text-neutral-400">How many imposters should there be?</p>
              </div>
            </div>
            <div className="text-xs font-semibold text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded-full border border-neutral-700">
              Max {maxImposters} for {playerCount} players
            </div>
          </div>

          {/* Imposter selectable buttons */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {[1, 2, 3].map((count) => {
              const isAllowed = count <= maxImposters;
              const isSelected = imposterCount === count;

              return (
                <button
                  key={count}
                  disabled={!isAllowed}
                  onClick={() => handleImposterCountChange(count)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-400/40'
                      : isAllowed
                      ? 'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 border border-neutral-700/60'
                      : 'bg-neutral-900/40 text-neutral-600 border border-neutral-800/40 cursor-not-allowed opacity-40'
                  }`}
                >
                  <span className="font-display font-black text-xl sm:text-2xl">{count}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {count === 1 ? 'Imposter' : 'Imposters'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: Categories (Multi-select) */}
        <section className="p-4 sm:p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white">
                    Categories
                  </h3>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border transition-colors ${
                      selectedCategoryIds.length > 0
                        ? 'text-pink-400 bg-pink-500/10 border-pink-500/30'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                    }`}
                  >
                    {selectedCategoryIds.length} of {CATEGORIES.length} selected
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Select one or multiple categories for this round
                </p>
              </div>
            </div>

            {/* Quick action buttons: Select All / Pick 1 Random */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                id="select-all-categories-btn"
                type="button"
                onClick={handleSelectAllCategories}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-all cursor-pointer border border-neutral-700/60"
              >
                Select All
              </button>
              <button
                id="pick-random-category-btn"
                type="button"
                onClick={handlePickRandomCategory}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer border border-neutral-700/60"
              >
                Pick 1 Random
              </button>
            </div>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isSelected={selectedCategoryIds.includes(cat.id)}
                onSelect={handleToggleCategory}
              />
            ))}
          </div>

          {/* Multiple categories info note */}
          {selectedCategoryIds.length > 1 ? (
            <div className="mt-3 p-3 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 text-xs text-neutral-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
              <span>
                <strong>{selectedCategoryIds.length} categories active:</strong> A category will be chosen each round from your selection with <strong>{totalSelectedWords} total words</strong> in pool.
              </span>
            </div>
          ) : selectedCategoryIds.length === 0 ? (
            <div className="mt-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Please tap at least one category above to begin playing.</span>
            </div>
          ) : null}
        </section>

        {/* SECTION 4: Custom Player Names (If enabled in settings) */}
        {settings.customNamesEnabled && (
          <section className="p-4 sm:p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-lg">
            <div className="mb-3">
              <h3 className="font-display font-bold text-base text-white">
                Player Names
              </h3>
              <p className="text-xs text-neutral-400">Optional: Label your friends</p>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {Array.from({ length: playerCount }, (_, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-neutral-500 w-5 text-right shrink-0">
                    {i + 1}.
                  </span>
                  <input
                    type="text"
                    value={playerNames[i] || ''}
                    placeholder={`Player ${i + 1}`}
                    maxLength={15}
                    onChange={(e) => {
                      const updated = [...playerNames];
                      updated[i] = e.target.value;
                      setPlayerNames(updated);
                    }}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Bottom Bar with Start Round Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent z-40 border-t border-neutral-800/40">
        <div className="max-w-xl mx-auto">
          <Button
            id="start-round-btn"
            variant="primary"
            size="xl"
            fullWidth
            icon={<Play className="w-5 h-5 fill-current" />}
            onClick={handleStart}
          >
            START ROUND
          </Button>
        </div>
      </div>
    </div>
  );
};
