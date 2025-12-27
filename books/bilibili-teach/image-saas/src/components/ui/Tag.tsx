import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export function Tag({
  name,
  color = '#3b82f6',
  size = 'md',
  removable = false,
  onRemove,
  className,
}: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full text-white font-medium transition-colors',
        sizeClasses[size],
        removable && 'pr-1',
        className
      )}
      style={{ backgroundColor: color }}
    >
      {name}
      {removable && (
        <button
          onClick={onRemove}
          className="rounded-full p-0.5 hover:bg-white/20 transition-colors"
          type="button"
        >
          <X size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
        </button>
      )}
    </span>
  );
}

interface TagListProps {
  tags: Array<{ id: string; name: string; color?: string }>;
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemoveTag?: (tagId: string) => void;
  className?: string;
}

export function TagList({
  tags,
  size = 'md',
  removable = false,
  onRemoveTag,
  className,
}: TagListProps) {
  if (tags.length === 0) {
    return (
      <div className={cn('text-gray-500 text-sm', className)}>
        暂无标签
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          name={tag.name}
          color={tag.color}
          size={size}
          removable={removable}
          onRemove={() => onRemoveTag?.(tag.id)}
        />
      ))}
    </div>
  );
}