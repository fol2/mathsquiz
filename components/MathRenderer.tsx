import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';

// Import KaTeX directly since react-katex might not be available
declare const katex: {
  render: (tex: string, element: Element, options?: any) => void;
  renderToString: (tex: string, options?: any) => string;
};

interface MathRendererProps {
  children: string;
  inline?: boolean;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ children, inline = true, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Load KaTeX dynamically
  useEffect(() => {
    const loadKatex = async () => {
      if (typeof window !== 'undefined' && !window.katex) {
        try {
          // Load KaTeX from CDN
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
          script.onload = () => {
            renderMath();
          };
          document.head.appendChild(script);
        } catch (error) {
          console.warn('Failed to load KaTeX:', error);
        }
      } else {
        renderMath();
      }
    };

    loadKatex();
  }, [children]);

  const renderMath = () => {
    if (!containerRef.current || typeof window === 'undefined' || !window.katex) {
      return;
    }

    try {
      const text = children;
      const container = containerRef.current;
      
      // Clear previous content
      container.innerHTML = '';

      // Simple math detection and rendering
      const mathPattern = /\$\$(.*?)\$\$|\\\[(.*?)\\\]|\$(.*?)\$|\\\((.*?)\\\)/g;
      let lastIndex = 0;
      let match;

      while ((match = mathPattern.exec(text)) !== null) {
        // Add text before math
        if (match.index > lastIndex) {
          const textSpan = document.createElement('span');
          textSpan.textContent = text.slice(lastIndex, match.index);
          container.appendChild(textSpan);
        }

        // Render math
        const mathContent = match[1] || match[2] || match[3] || match[4];
        const isBlock = match[1] || match[2]; // $$ or \[
        
        const mathElement = document.createElement(isBlock ? 'div' : 'span');
        if (isBlock) {
          mathElement.style.textAlign = 'center';
          mathElement.style.margin = '10px 0';
        }

        try {
          window.katex.render(mathContent, mathElement, {
            displayMode: isBlock,
            throwOnError: false,
            errorColor: '#cc0000',
          });
        } catch (err) {
          // Fallback to plain text if KaTeX fails
          mathElement.textContent = `$${mathContent}$`;
        }

        container.appendChild(mathElement);
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        const textSpan = document.createElement('span');
        textSpan.textContent = text.slice(lastIndex);
        container.appendChild(textSpan);
      }

    } catch (error) {
      console.warn('Error rendering math:', error);
      // Fallback to plain text
      if (containerRef.current) {
        containerRef.current.textContent = children;
      }
    }
  };

  // Simple fallback for when KaTeX is not available
  const SimpleMathRenderer = ({ text }: { text: string }) => {
    // Convert simple LaTeX to Unicode equivalents
    const convertedText = text
      .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2')
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\pm/g, '±')
      .replace(/\$\$(.*?)\$\$/g, '$1')
      .replace(/\$(.*?)\$/g, '$1');
    
    return <span>{convertedText}</span>;
  };

  return (
    <div className={className}>
      <div ref={containerRef}>
        <SimpleMathRenderer text={children} />
      </div>
    </div>
  );
};

declare global {
  interface Window {
    katex: typeof katex;
  }
}

export default MathRenderer; 