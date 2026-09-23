import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { classNames } from '../../utils/formatters';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'light' | 'dark' | 'glass-dark' | 'glass-light' | 'gold-accent';
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'light',
  hoverEffect = true,
  padding = 'lg',
  children,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4 md:p-5',
    md: 'p-6 md:p-7',
    lg: 'p-7 md:p-9',
    xl: 'p-8 md:p-12',
  };

  const variantStyles = {
    light:
      'bg-white border border-border-hairline text-charcoal-slate shadow-subtle',
    dark:
      'bg-pine-secondary border border-white/10 text-ivory-sand shadow-dark-card',
    'glass-dark':
      'glass-card-dark text-ivory-sand',
    'glass-light':
      'glass-card-light text-charcoal-slate shadow-subtle',
    'gold-accent':
      'bg-white border-2 border-gold-dull/40 text-charcoal-slate shadow-subtle',
  };

  return (
    <motion.div
      whileHover={
        hoverEffect
          ? {
              y: -4,
              transition: { duration: 0.25, ease: 'easeOut' },
            }
          : undefined
      }
      className={classNames(
        'relative rounded-xl transition-all duration-300 overflow-hidden',
        paddingStyles[padding],
        variantStyles[variant],
        hoverEffect && variant === 'light' ? 'hover:border-gold-dull/50 hover:shadow-luxury' : '',
        hoverEffect && variant === 'dark' ? 'hover:border-gold-radiant/40 hover:shadow-gold-glow/20' : '',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
