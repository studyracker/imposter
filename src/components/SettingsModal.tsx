import React from 'react';
import { Modal } from './Modal';
import { AppSettings } from '../types';
import { Volume2, VolumeX, Moon, Sun, HelpCircle, BarChart3, RotateCcw, Users } from 'lucide-react';
import { Button } from './Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  onResetGameRequest: () => void;
  hasActiveGame: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenHowToPlay,
  onOpenStats,
  onResetGameRequest,
  hasActiveGame,
}) => {
  const toggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: nextTheme });
  };

  const toggleCustomNames = () => {
    onUpdateSettings({ ...settings, customNamesEnabled: !settings.customNamesEnabled });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Game Settings" subtitle="Preferences & Options">
      <div className="space-y-4">
        {/* Sound Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-pink-400">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-neutral-500" />}
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">Sound Effects</div>
              <div className="text-xs text-neutral-400">Card flips, clicks, and reveal cues</div>
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              settings.soundEnabled ? 'bg-pink-600' : 'bg-neutral-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-amber-400">
              {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">Theme</div>
              <div className="text-xs text-neutral-400">
                {settings.theme === 'dark' ? 'Party Dark (Recommended)' : 'Clean Light'}
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Button>
        </div>

        {/* Custom Player Names Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">Custom Names</div>
              <div className="text-xs text-neutral-400">Enter friends&rsquo; names before round</div>
            </div>
          </div>
          <button
            onClick={toggleCustomNames}
            className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              settings.customNamesEnabled ? 'bg-purple-600' : 'bg-neutral-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                settings.customNamesEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            icon={<HelpCircle className="w-4 h-4 text-pink-400" />}
            onClick={() => {
              onClose();
              onOpenHowToPlay();
            }}
          >
            How to Play
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={<BarChart3 className="w-4 h-4 text-emerald-400" />}
            onClick={() => {
              onClose();
              onOpenStats();
            }}
          >
            Statistics
          </Button>
        </div>

        {/* Reset active game if one exists */}
        {hasActiveGame && (
          <div className="pt-2 border-t border-neutral-800">
            <Button
              variant="danger"
              size="md"
              fullWidth
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onResetGameRequest();
              }}
            >
              Abandon Current Game
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
