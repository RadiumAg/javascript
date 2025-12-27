import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
  suggestions?: string[];
}

export function TagInput({
  value,
  onChange,
  placeholder = '输入标签后按回车添加...',
  maxTags = 10,
  className,
  suggestions = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(suggestion)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // 删除最后一个标签
      onChange(value.slice(0, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setInputValue('');
    }
  };

  const addTag = (tagValue?: string) => {
    const tagToAdd = tagValue || inputValue.trim();
    
    if (
      tagToAdd &&
      !value.includes(tagToAdd) &&
      value.length < maxTags &&
      tagToAdd.length <= 20
    ) {
      onChange([...value, tagToAdd]);
    }
    
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        
        {value.length < maxTags && (
          <div className="flex-1 min-w-[120px]">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
              placeholder={value.length === 0 ? placeholder : ''}
              className="w-full outline-none bg-transparent text-sm"
            />
          </div>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              <Plus size={14} className="inline mr-2" />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-1">
        {value.length}/{maxTags} 个标签
      </div>
    </div>
  );
}