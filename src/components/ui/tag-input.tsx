/**
 * Tag Input Component
 * Tag input with suggestions and add/remove functionality
 */

'use client';

import * as React from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export function TagInput({
  value = [],
  onChange,
  suggestions = [],
  placeholder = 'Add a tag...',
  maxTags = 20,
  maxLength = 50,
  disabled = false,
  className,
  label,
  error,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter suggestions based on input and existing tags
  const filteredSuggestions = React.useMemo(() => {
    if (!inputValue.trim()) {
      return suggestions.filter((suggestion) => !value.includes(suggestion));
    }
    return suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(suggestion)
    );
  }, [inputValue, suggestions, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setInputValue(newValue);
      setShowSuggestions(true);
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (
      trimmedTag &&
      !value.includes(trimmedTag) &&
      value.length < maxTags &&
      trimmedTag.length <= maxLength
    ) {
      onChange([...value, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemoveTag(value[value.length - 1]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleAddTag(suggestion);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="relative">
        <div
          className={cn(
            'flex flex-wrap gap-2 min-h-[42px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            error && 'border-destructive',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {/* Existing Tags */}
          {value.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
            >
              <span>{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-sm hover:bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay to allow suggestion click
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled || value.length >= maxTags}
            className="flex-1 border-0 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            maxLength={maxLength}
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
            {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {value.length}/{maxTags} tags
        </span>
        {inputValue && (
          <span>
            {inputValue.length}/{maxLength} characters
          </span>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

