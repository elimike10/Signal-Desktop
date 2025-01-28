import React, { useState, useCallback, useRef, useEffect } from 'react';

export const CompositionInput: React.FC = () => {
  const [unicodeInputActive, setUnicodeInputActive] = useState(false);
  const [unicodeBuffer, setUnicodeBuffer] = useState('');
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'u') {
      event.preventDefault();
      setUnicodeInputActive(true);
      setUnicodeBuffer('u');
    } else if (unicodeInputActive) {
      event.preventDefault();
      if (event.key === 'Escape') {
        setUnicodeInputActive(false);
        setUnicodeBuffer('');
      } else if (event.key === 'Enter' || event.key === ' ') {
        const codePoint = parseInt(unicodeBuffer.slice(1), 16);
        if (codePoint >= 0 && codePoint <= 0x10FFFF) {
          const unicodeChar = String.fromCodePoint(codePoint);
          insertTextAtCursor(unicodeChar);
        }
        setUnicodeInputActive(false);
        setUnicodeBuffer('');
      } else if (/^[0-9A-Fa-f]$/.test(event.key)) {
        setUnicodeBuffer(prev => prev + event.key);
      }
    }
  }, [unicodeInputActive, unicodeBuffer]);

  const insertTextAtCursor = (text: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  useEffect(() => {
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  }, []);

  return (
    <div onKeyDown={handleKeyDown}>
      {unicodeInputActive && <div>Unicode: {unicodeBuffer}</div>}
      <div
        ref={contentEditableRef}
        contentEditable
        suppressContentEditableWarning
        style={{ border: '1px solid black', minHeight: '20px', padding: '5px' }}
      />
    </div>
  );
};
