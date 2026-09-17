import React from 'react';
import { Modal } from './Modal';
import { CheckCircle2, AlertTriangle, Users, Eye, HelpCircle } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      num: '1',
      title: 'Setup & Pass',
      desc: 'Pick player count, imposter count, and category. Pass the phone so each player can secretly view their card in private.',
      icon: <Users className="w-5 h-5 text-pink-400" />,
    },
    {
      num: '2',
      title: 'Secret Word vs Imposter',
      desc: 'Normal players receive the EXACT same secret word. Imposters only see the selected category and must blend in.',
      icon: <Eye className="w-5 h-5 text-rose-400" />,
    },
    {
      num: '3',
      title: 'Give Clues in Turn',
      desc: 'Go around the circle. Each player gives a one-word or short clue related to the secret word without saying the word itself.',
      icon: <HelpCircle className="w-5 h-5 text-purple-400" />,
    },
    {
      num: '4',
      title: 'Discuss & Vote',
      desc: 'Debate suspicious answers! Vote on who you believe is faking knowledge of the word.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: '5',
      title: 'Reveal the Truth',
      desc: 'Tap reveal to see if the players caught the imposters or if the imposters successfully deceived the group!',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play"
      subtitle="The ultimate pass-the-phone deduction game"
      maxWidth="md"
    >
      <div className="space-y-4 text-sm text-neutral-300">
        <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center gap-3">
          <span className="text-2xl">🤫</span>
          <p className="text-xs sm:text-sm font-medium text-pink-300">
            One phone. Secret roles. Keep your card hidden when passing the device!
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 flex items-start gap-3.5"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-display font-extrabold text-white text-sm shrink-0">
                {step.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-display font-bold text-white text-sm mb-0.5">
                  {step.title}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Golden Rule:</strong> Never show your screen directly to other players during reveal. Always press &ldquo;Hide Word&rdquo; first.
          </span>
        </div>
      </div>
    </Modal>
  );
};
