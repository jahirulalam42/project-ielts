"use client";
import React, { useState, useRef, useEffect } from 'react';

interface Highlight {
  id: string;
  text: string;
  color: string;
  startOffset: number;
  endOffset: number;
  elementIndex: number;
}

interface TextHighlighterProps {
  content: any[];
  onHighlightChange?: (highlights: Highlight[]) => void;
}

const TextHighlighter: React.FC<TextHighlighterProps> = ({ content, onHighlightChange }) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('bg-yellow-200');
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const highlightColors = [
    { name: 'Yellow', value: 'bg-yellow-200', hex: '#fef08a' },
    { name: 'Green', value: 'bg-green-200', hex: '#bbf7d0' },
    { name: 'Blue', value: 'bg-blue-200', hex: '#bfdbfe' },
    { name: 'Pink', value: 'bg-pink-200', hex: '#fecdd3' },
    { name: 'Orange', value: 'bg-orange-200', hex: '#fed7aa' },
    { name: 'Purple', value: 'bg-purple-200', hex: '#ddd6fe' },
  ];

  useEffect(() => {
    if (onHighlightChange) {
      onHighlightChange(highlights);
    }
  }, [highlights, onHighlightChange]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showToolbar) {
        if (e.key === 'Enter') {
          e.preventDefault();
          addHighlight();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setShowToolbar(false);
          window.getSelection()?.removeAllRanges();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showToolbar]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();

    if (selectedText.length === 0) {
      setShowToolbar(false);
      return;
    }

    setSelectedText(selectedText);

    // Calculate toolbar position
    const rect = range.getBoundingClientRect();
    const toolbarWidth = 300; // Approximate toolbar width
    const toolbarHeight = 50; // Approximate toolbar height
    
    let x = rect.left + rect.width / 2;
    let y = rect.top - toolbarHeight - 10;
    
    // Ensure toolbar stays within viewport
    if (x < toolbarWidth / 2) {
      x = toolbarWidth / 2;
    } else if (x > window.innerWidth - toolbarWidth / 2) {
      x = window.innerWidth - toolbarWidth / 2;
    }
    
    if (y < 10) {
      y = rect.bottom + 10;
    }
    
    setToolbarPosition({ x, y });

    setShowToolbar(true);
  };

  const addHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const text = selection.toString().trim();

    if (text.length === 0) return;

    // Find which paragraph element contains this selection
    let elementIndex = -1;
    let startOffset = 0;
    let endOffset = 0;

    if (contentRef.current) {
      const paragraphs = contentRef.current.querySelectorAll('p');
      paragraphs.forEach((p, index) => {
        if (p.contains(range.startContainer) || p === range.startContainer) {
          elementIndex = index;
          // Calculate offset within this paragraph
          const walker = document.createTreeWalker(
            p,
            NodeFilter.SHOW_TEXT,
            null
          );
          let currentOffset = 0;
          let node;
          while (node = walker.nextNode()) {
            if (node === range.startContainer) {
              startOffset = currentOffset + range.startOffset;
            }
            if (node === range.endContainer) {
              endOffset = currentOffset + range.endOffset;
              break;
            }
            currentOffset += node.textContent?.length || 0;
          }
        }
      });
    }

    const newHighlight: Highlight = {
      id: Date.now().toString(),
      text,
      color: selectedColor,
      startOffset,
      endOffset,
      elementIndex,
    };

    setHighlights(prev => [...prev, newHighlight]);
    setShowToolbar(false);
    selection.removeAllRanges();
  };

  const removeHighlight = (highlightId: string) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
  };

  const clearAllHighlights = () => {
    setHighlights([]);
  };

  const renderHighlightedContent = () => {
    return content.map((p, paragraphIndex) => {
      if (typeof p === "object") {
        return Object.entries(p).map(([key, value]) => {
          const paragraphText = value as string;
          const paragraphHighlights = highlights.filter(h => h.elementIndex === paragraphIndex);
          
          return (
            <p key={`${paragraphIndex}-${key}`} className="relative">
              <span className="font-bold">{key}.</span>{" "}
              {renderHighlightedText(paragraphText, paragraphHighlights)}
            </p>
          );
        });
      } else {
        const paragraphText = p as string;
        const paragraphHighlights = highlights.filter(h => h.elementIndex === paragraphIndex);
        
        return (
          <p key={paragraphIndex} className="relative">
            {renderHighlightedText(paragraphText, paragraphHighlights)}
          </p>
        );
      }
    });
  };

  const renderHighlightedText = (text: string, paragraphHighlights: Highlight[]) => {
    if (paragraphHighlights.length === 0) {
      return text;
    }

    // Sort highlights by start position
    const sortedHighlights = [...paragraphHighlights].sort((a, b) => a.startOffset - b.startOffset);
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.startOffset > lastIndex) {
        parts.push(text.slice(lastIndex, highlight.startOffset));
      }

      // Add highlighted text
      const highlightedText = text.slice(highlight.startOffset, highlight.endOffset);
      const colorClass = highlightColors.find(c => c.value === highlight.color)?.value || 'bg-yellow-200';
      
      parts.push(
        <span
          key={highlight.id}
          className={`${colorClass} cursor-pointer relative group highlight-animation highlight-hover`}
          onClick={() => removeHighlight(highlight.id)}
          title="Click to remove highlight"
        >
          {highlightedText}
          <span className="absolute -top-6 -right-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            ×
          </span>
        </span>
      );

      lastIndex = highlight.endOffset;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="relative">
      {/* Highlight Toolbar */}
      {showToolbar && (
        <div
          className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-3 flex items-center gap-3 animate-in fade-in duration-200"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="flex gap-2">
            {highlightColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                  selectedColor === color.value 
                    ? 'border-gray-800 scale-110 shadow-md' 
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
          <div className="h-6 w-px bg-gray-300"></div>
          <button
            type="button"
            onClick={addHighlight}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Highlight
          </button>
          <button
            type="button"
            onClick={() => setShowToolbar(false)}
            className="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors duration-200"
            title="Cancel (Esc)"
          >
            ×
          </button>
        </div>
      )}

      {/* Highlight Controls */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Highlight Colors:
            </span>
            {highlightColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  selectedColor === color.value 
                    ? 'border-gray-800 scale-110 shadow-lg' 
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
              <span className="font-semibold">{highlights.length}</span> highlight{highlights.length !== 1 ? 's' : ''}
            </div>
            {highlights.length > 0 && (
              <button
                type="button"
                onClick={clearAllHighlights}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Clear All
              </button>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-white px-3 py-2 rounded border">
          <span className="font-medium">💡 Tips:</span> Select text to highlight • Press Enter to confirm • Press Escape to cancel • Click highlighted text to remove
        </div>
      </div>

      {/* Content with highlighting */}
      <div
        ref={contentRef}
        className="prose max-w-none space-y-4 select-text"
        onMouseUp={handleTextSelection}
        onKeyUp={handleTextSelection}
      >
        {renderHighlightedContent()}
      </div>
    </div>
  );
};

export default TextHighlighter; 