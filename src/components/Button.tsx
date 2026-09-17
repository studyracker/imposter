import React from 'react';
import { sound } from '../utils/sound';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      sound.playClick();
      if (onClick) onClick(e);
    }
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-2xl cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 gap-1.5 min-h-[38px]',
    md: 'text-sm sm:text-base px-6 py-3 gap-2 min-h-[46px]',
    lg: 'text-base sm:text-lg px-8 py-3.5 gap-2.5 min-h-[52px]',
    xl: 'text-lg sm:text-xl px-9 py-4 gap-3 min-h-[60px] shadow-lg',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 hover:brightness-110 border border-pink-400/30',
    accent:
      'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-neutral-950 font-extrabold shadow-lg shadow-amber-500/25 hover:brightness-110 border border-amber-300/40',
    secondary:
      'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 hover:border-neutral-600 shadow-md',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 border border-red-500/40',
    outline:
      'bg-transparent hover:bg-neutral-800/60 text-neutral-200 border-2 border-neutral-700 hover:border-neutral-500',
    ghost:
      'bg-transparent hover:bg-neutral-800/50 text-neutral-300 hover:text-white',
  };

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
