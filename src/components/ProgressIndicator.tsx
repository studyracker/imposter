import React from 'react';

interface ProgressIndicatorProps {
  current: number; // 0-based
  total: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ current, total }) => {
  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-400">
        Player <span className="text-pink-400 font-bold">{current + 1}</span> of {total}
      </div>
      <div className="flex items-center gap-2" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
        {Array.from({ length: total }, (_, i) => {
          const isDone = i < current;
          const isCurrent = i === current;
          return (
            <div
              key={i}
              className={`transition-all duration-300 rounded-full ${
                isCurrent
                  ? 'w-6 h-2.5 bg-gradient-to-r from-rose-500 to-pink-500 shadow-md shadow-pink-500/50 scale-110 ring-2 ring-pink-400/30'
                  : isDone
                  ? 'w-2.5 h-2.5 bg-neutral-600'
                  : 'w-2.5 h-2.5 bg-neutral-800'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
