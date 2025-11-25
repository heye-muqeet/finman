/**
 * Icon Picker Component
 * Icon selection with common Lucide icons
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import {
  Wallet,
  ShoppingCart,
  UtensilsCrossed,
  Home,
  Car,
  Plane,
  Coffee,
  Gamepad2,
  Heart,
  Gift,
  GraduationCap,
  Briefcase,
  Stethoscope,
  Dumbbell,
  Music,
  Film,
  Book,
  Camera,
  Smartphone,
  Laptop,
  Shirt,
  Baby,
  Dog,
  TreePine,
  Zap,
  Lightbulb,
  Wrench,
  Paintbrush,
  Palette,
  Tag,
} from 'lucide-react';

const PRESET_ICONS = [
  { name: 'wallet', component: Wallet },
  { name: 'shopping-cart', component: ShoppingCart },
  { name: 'utensils-crossed', component: UtensilsCrossed },
  { name: 'home', component: Home },
  { name: 'car', component: Car },
  { name: 'plane', component: Plane },
  { name: 'coffee', component: Coffee },
  { name: 'gamepad-2', component: Gamepad2 },
  { name: 'heart', component: Heart },
  { name: 'gift', component: Gift },
  { name: 'graduation-cap', component: GraduationCap },
  { name: 'briefcase', component: Briefcase },
  { name: 'stethoscope', component: Stethoscope },
  { name: 'dumbbell', component: Dumbbell },
  { name: 'music', component: Music },
  { name: 'film', component: Film },
  { name: 'book', component: Book },
  { name: 'camera', component: Camera },
  { name: 'smartphone', component: Smartphone },
  { name: 'laptop', component: Laptop },
  { name: 'shirt', component: Shirt },
  { name: 'baby', component: Baby },
  { name: 'dog', component: Dog },
  { name: 'tree-pine', component: TreePine },
  { name: 'zap', component: Zap },
  { name: 'lightbulb', component: Lightbulb },
  { name: 'wrench', component: Wrench },
  { name: 'paintbrush', component: Paintbrush },
  { name: 'palette', component: Palette },
  { name: 'tag', component: Tag },
];

interface IconPickerProps {
  value?: string;
  onChange: (icon: string | undefined) => void;
  className?: string;
}

export default function IconPicker({ value, onChange, className }: IconPickerProps) {
  const handleIconSelect = (iconName: string) => {
    if (value === iconName) {
      // Deselect if clicking the same icon
      onChange(undefined);
    } else {
      onChange(iconName);
    }
  };

  const selectedIcon = PRESET_ICONS.find((icon) => icon.name === value);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
        {PRESET_ICONS.map(({ name, component: IconComponent }) => (
          <button
            key={name}
            type="button"
            onClick={() => handleIconSelect(name)}
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-md border-2 transition-all hover:scale-110',
              value === name
                ? 'border-foreground bg-accent ring-2 ring-ring ring-offset-2'
                : 'border-border hover:border-foreground/50 hover:bg-accent'
            )}
            aria-label={`Select icon ${name}`}
          >
            <IconComponent className="h-5 w-5" />
          </button>
        ))}
      </div>
      {value && selectedIcon && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Selected:</span>
          <div className="flex h-5 w-5 items-center justify-center">
            {React.createElement(selectedIcon.component, { className: 'h-4 w-4' })}
          </div>
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

