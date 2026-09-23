import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { classNames } from '../../utils/formatters';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'gold' | 'pine' | 'outline-gold' | 'outline-pine' | 'ghost' | 'dark-card';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'gold',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  iconPosition = 'right',
  className = '',
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-sans font-medium tracking-subtle transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-dull/50 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-sm md:text-base px-7 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    gold: 'bg-gold-gradient text-pine-deep font-semibold shadow-subtle hover:shadow-gold-glow hover:brightness-105 active:scale-[0.99] border border-gold-radiant/40',
    pine: 'bg-pine-deep text-ivory-sand hover:bg-pine-secondary hover:text-white border border-pine-muted shadow-subtle active:scale-[0.99]',
    'outline-gold':
      'bg-transparent text-gold-dull hover:text-gold-radiant border border-gold-dull/50 hover:border-gold-radiant hover:bg-gold-dull/10 active:scale-[0.99]',
    'outline-pine':
      'bg-transparent text-pine-deep hover:text-pine-deep border border-pine-deep/30 hover:border-pine-deep hover:bg-pine-deep/5 active:scale-[0.99]',
    ghost:
      'bg-transparent text-charcoal-slate hover:text-gold-dull hover:bg-ivory-warm/60 px-3 py-1.5',
    'dark-card':
      'bg-pine-secondary/80 text-ivory-sand border border-white/10 hover:border-gold-dull/40 hover:bg-pine-secondary active:scale-[0.99]',
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ y: 0, scale: 0.99 }}
      className={classNames(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
    </motion.button>
  );
};
