'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-linkedin text-white hover:bg-blue-700'
      } ${className}`}
    >
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  );
}
