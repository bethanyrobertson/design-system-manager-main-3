import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';

export const CodeSnippet = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative bg-muted/50 rounded-lg border overflow-hidden">
      {/* Header with copy button */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-800">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {language}
        </span>
        <Button
          variant="ghost"
          size="1"
          onClick={handleCopy}
          className="relative h-6 w-6 p-0"
        >
          {copied ? (
            <CheckIcon className="w-3 h-3 text-green-600" />
          ) : (
            <CopyIcon className="w-3 h-3" />
          )}
        </Button>
      </div>
      
      {/* Code content */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          <code className="text-gray-800 dark:text-gray-200">
            {code}
          </code>
        </pre>
      </div>
      
      {/* Copy feedback tooltip */}
      {copied && (
        <div className="absolute top-2 right-12 bg-black dark:bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 animate-pulse">
          Copied!
        </div>
      )}
    </div>
  );
};
