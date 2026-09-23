import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (val: number) => string;
  presets?: { label: string; value: number }[];
  helperText?: string;
  icon?: React.ReactNode;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  presets,
  helperText,
  icon,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3">
      {/* Header Row: Label & Formatted Value */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-gold-dull">{icon}</span>}
          <label className="text-xs md:text-sm font-sans font-semibold uppercase tracking-wider text-charcoal-slate">
            {label}
          </label>
        </div>
        <div className="px-3.5 py-1 rounded-md bg-ivory-warm border border-gold-dull/30 text-pine-deep font-sans font-bold text-sm md:text-base">
          {formatValue(value)}
        </div>
      </div>

      {/* Slider Track Container */}
      <div className="relative py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, #0B2B26 0%, #0B2B26 ${percentage}%, #E7E2DA ${percentage}%, #E7E2DA 100%)`,
          }}
        />
        <div className="flex justify-between text-[11px] text-charcoal-muted mt-1 font-medium">
          <span>{formatValue(min)}</span>
          {helperText && <span className="text-gold-dull font-semibold">{helperText}</span>}
          <span>{formatValue(max)}</span>
        </div>
      </div>

      {/* Quick Presets Pills */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] uppercase font-bold text-charcoal-muted/70 mr-1 tracking-wider">
            Quick:
          </span>
          {presets.map((p) => {
            const isSelected = value === p.value;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onChange(p.value)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-all duration-200 font-medium ${
                  isSelected
                    ? 'bg-pine-deep text-gold-dull border border-gold-dull shadow-sm'
                    : 'bg-white text-charcoal-slate border border-border-hairline hover:border-gold-dull/60 hover:bg-ivory-warm'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
