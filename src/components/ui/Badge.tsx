import React from 'react';
import { classNames } from '../../utils/formatters';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'pine' | 'dark' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 tracking-wider',
    md: 'text-xs px-3.5 py-1 tracking-widest-luxury font-medium',
  };

  const variantStyles = {
    gold: 'bg-gold-dull/10 text-gold-dull border border-gold-dull/30',
    pine: 'bg-pine-deep/5 text-pine-deep border border-pine-deep/20',
    dark: 'bg-gold-radiant/10 text-gold-radiant border border-gold-radiant/30',
    outline: 'bg-transparent text-charcoal-muted border border-border-hairline',
  };

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full uppercase font-sans font-semibold select-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
