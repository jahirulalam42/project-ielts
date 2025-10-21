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
  const [selectedColor] = useState<string>('bg-yellow-200');
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [idCounter, setIdCounter] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fix hydration issue by ensuring client-side only execution
  useEffect(() => {
    setIsClient(true);
  }, []);


  // Generate unique ID without Date.now()
  const generateId = () => {
    const newId = idCounter + 1;
    setIdCounter(newId);
    return `highlight-${newId}`;
  };

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

    let startOffset = 0;
    let endOffset = 0;
    let elementIndex = 0;

    // Find the element and calculate offsets
    contentRef.current?.childNodes.forEach((node, index) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.contains(range.startContainer)) {
          elementIndex = index;
          // Calculate offset within this element
          const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null
          );

          let currentOffset = 0;
          let node: Node | null;
          while ((node = walker.nextNode())) {
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
      }
    });

    const newHighlight: Highlight = {
      id: generateId(),
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
      const colorClass = 'bg-yellow-200';
      
      parts.push(
        <span
          key={highlight.id}
          className={`${colorClass} cursor-pointer relative group`}
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
      {/* Only render on client side to prevent hydration issues */}
      {!isClient && (
        <div className="prose max-w-none space-y-4">
          {content.map((p, paragraphIndex) => {
            if (typeof p === "object") {
              return Object.entries(p).map(([key, value]) => (
                <p key={`${paragraphIndex}-${key}`} className="relative">
                  <span className="font-bold">{key}.</span>{" "}
                  {value as string}
                </p>
              ));
            } else {
              return (
                <p key={paragraphIndex} className="relative">
                  {p as string}
                </p>
              );
            }
          })}
        </div>
      )}

      {isClient && (
        <>
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


          {/* Content with highlighting */}
          <div
            ref={contentRef}
            className="prose max-w-none space-y-4 select-text"
            onMouseUp={handleTextSelection}
          >
            {renderHighlightedContent()}
          </div>
        </>
      )}
    </div>
  );
};

export default TextHighlighter; 