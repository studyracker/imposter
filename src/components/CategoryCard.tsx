import React from 'react';
import { Category } from '../types';
import { Check } from 'lucide-react';
import { sound } from '../utils/sound';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: (category: Category) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onSelect,
}) => {
  const handleClick = () => {
    sound.playClick();
    onSelect(category);
  };

  return (
    <div
      id={`category-card-${category.id}`}
      onClick={handleClick}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 text-left border flex items-center gap-3.5 focus:outline-none focus:ring-2 focus:ring-pink-500/60 ${
        isSelected
          ? 'bg-gradient-to-br from-neutral-900 via-neutral-900 to-pink-950/40 border-pink-500/80 shadow-lg shadow-pink-500/20 scale-[1.01]'
          : 'bg-neutral-900/80 hover:bg-neutral-800/90 border-neutral-800 hover:border-neutral-700'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-105 ${
          isSelected
            ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/40 ring-1 ring-pink-500/20'
            : 'bg-neutral-800/90 border border-neutral-700/60'
        }`}
      >
        {category.icon}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h4
            className={`font-display font-bold text-sm sm:text-base truncate ${
              isSelected ? 'text-white' : 'text-neutral-200'
            }`}
          >
            {category.name}
          </h4>
          <span className="text-[11px] font-semibold text-neutral-400 shrink-0 bg-neutral-800/80 px-2 py-0.5 rounded-full">
            {category.words.length} words
          </span>
        </div>
        <p className="text-xs text-neutral-400 line-clamp-1 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
          isSelected
            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-500/50 scale-100'
            : 'border border-neutral-700 bg-neutral-800/50 text-transparent group-hover:border-neutral-500'
        }`}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </div>
    </div>
  );
};
