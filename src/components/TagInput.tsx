import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
      }
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-md">
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700"
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="ml-1 hover:text-indigo-900"
          >
            <X className="h-4 w-4" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ajouter un tag..."
        className="flex-1 min-w-[120px] outline-none"
      />
    </div>
  );
}