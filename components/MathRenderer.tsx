import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  children: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ children, className = '' }) => {
  // Convert AI generated LaTeX (which often lacks `$` delimiters) to markdown
  // with proper inline math segments while keeping surrounding text intact.
  const normalizeLatexForMarkdown = (text: string): string => {
    const normalized = text.trim();

    // If markdown math delimiters already exist, just return the text
    if (normalized.includes('$')) {
      return normalized;
    }

    // Wrap LaTeX commands with `$...$` so that remark-math/katex can render
    // them correctly without converting the entire sentence into LaTeX.
    const latexCommandRegex = /(\\[a-zA-Z]+(?:\{[^{}]*\})*(?:\{[^{}]*\})*)/g;

    return normalized.replace(latexCommandRegex, (match) => `$${match}$`);
  };

  const markdownWithMath = normalizeLatexForMarkdown(children);

  try {
    return (
      <div className={`math-renderer ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            // Override paragraph to avoid extra wrapping when not needed
            p: ({ children }) => <span>{children}</span>,
            // Handle any other elements that might appear
            div: ({ children }) => <div>{children}</div>,
          }}
        >
          {markdownWithMath}
        </ReactMarkdown>
      </div>
    );
  } catch (error) {
    console.warn('Math rendering error:', error);
    return (
      <span
        className={`math-error ${className}`}
        style={{
          color: '#e74c3c',
          fontFamily: 'monospace',
          fontSize: '0.9em',
          border: '1px solid #e74c3c',
          padding: '2px 4px',
          borderRadius: '3px',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
        }}
      >
        Math Error: {children}
      </span>
    );
  }
};

export default MathRenderer;
