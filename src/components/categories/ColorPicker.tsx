/**
 * Color Picker Component
 * Color selection with predefined color samples
 */

'use client';

import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

const PRESET_COLORS = [
  '#FF5733', // Red
  '#FF8C00', // Dark Orange
  '#FFD700', // Gold
  '#32CD32', // Lime Green
  '#00CED1', // Dark Turquoise
  '#1E90FF', // Dodger Blue
  '#9370DB', // Medium Purple
  '#FF1493', // Deep Pink
  '#FF69B4', // Hot Pink
  '#20B2AA', // Light Sea Green
  '#FF6347', // Tomato
  '#FFA500', // Orange
  '#9ACD32', // Yellow Green
  '#00FA9A', // Medium Spring Green
  '#00BFFF', // Deep Sky Blue
  '#8A2BE2', // Blue Violet
  '#DC143C', // Crimson
  '#FF4500', // Orange Red
  '#ADFF2F', // Green Yellow
  '#4169E1', // Royal Blue
  '#DA70D6', // Orchid
  '#CD5C5C', // Indian Red
  '#F0E68C', // Khaki
  '#98FB98', // Pale Green
  '#87CEEB', // Sky Blue
  '#DDA0DD', // Plum
  '#F08080', // Light Coral
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string | undefined) => void;
  className?: string;
}

export default function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const handleColorSelect = (color: string) => {
    if (value === color) {
      // Deselect if clicking the same color
      onChange(undefined);
    } else {
      onChange(color);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
        {PRESET_COLORS.map((color, index) => (
          <button
            key={`${color}-${index}`}
            type="button"
            onClick={() => handleColorSelect(color)}
            className={cn(
              'relative h-10 w-10 rounded-md border-2 transition-all hover:scale-110',
              value === color
                ? 'border-foreground ring-2 ring-ring ring-offset-2'
                : 'border-border hover:border-foreground/50'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          >
            {value === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="h-5 w-5 text-white drop-shadow-lg" />
              </div>
            )}
          </button>
        ))}
      </div>
      {value && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Selected:</span>
          <div
            className="h-5 w-5 rounded border"
            style={{ backgroundColor: value }}
          />
          <code className="text-xs">{value}</code>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="ml-auto text-xs underline hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

