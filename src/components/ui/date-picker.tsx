/**
 * Date Picker Component
 * Calendar-based date picker with optional time selection and presets
 */

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import 'react-day-picker/dist/style.css';

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  showTime?: boolean;
  showPresets?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

/**
 * Date presets for quick selection
 */
const datePresets = [
  { label: 'Today', getDate: () => new Date() },
  { label: 'Yesterday', getDate: () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }},
  { label: 'This Week', getDate: () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  }},
  { label: 'Last Week', getDate: () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day - 7;
    return new Date(date.setDate(diff));
  }},
  { label: 'This Month', getDate: () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }},
  { label: 'Last Month', getDate: () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  }},
];

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  showTime = false,
  showPresets = true,
  className,
  label,
  required = false,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [timeValue, setTimeValue] = React.useState<string>(
    value && showTime
      ? format(value, 'HH:mm')
      : format(new Date(), 'HH:mm')
  );

  // Sync with external value changes
  React.useEffect(() => {
    setSelectedDate(value);
    if (value && showTime) {
      setTimeValue(format(value, 'HH:mm'));
    }
  }, [value, showTime]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      onChange(undefined);
      return;
    }

    let finalDate = date;

    // If time is enabled and we have a time value, combine date and time
    if (showTime && timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      finalDate = new Date(date);
      finalDate.setHours(hours, minutes, 0, 0);
    }

    setSelectedDate(finalDate);
    onChange(finalDate);
    
    // Close popover automatically if time selection is not enabled
    // If time is enabled, keep it open so user can adjust time
    if (!showTime) {
      setOpen(false);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    if (selectedDate) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(hours, minutes, 0, 0);
      setSelectedDate(updatedDate);
      onChange(updatedDate);
    }
  };

  const handlePresetSelect = (preset: typeof datePresets[0]) => {
    const date = preset.getDate();
    handleDateSelect(date);
    setOpen(false);
  };

  const displayValue = selectedDate
    ? showTime
      ? format(selectedDate, 'PPP p')
      : format(selectedDate, 'PPP')
    : '';

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor="date-picker">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground',
              error && 'border-destructive'
            )}
            disabled={disabled}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? displayValue : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {showPresets && (
              <div className="border-r p-3 space-y-1">
                <p className="text-sm font-medium mb-2">Presets</p>
                {datePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => handlePresetSelect(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </div>
          {showTime && (
            <div className="border-t p-3 space-y-2">
              <Label htmlFor="time-input" className="text-sm font-medium">
                Time
              </Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="time-input"
                  type="time"
                  value={timeValue}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

