import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  children: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ 
  children, 
  className = '' 
}) => {
  // Convert various LaTeX formats to markdown math syntax
  const normalizeLatexForMarkdown = (latex: string): string => {
    let normalized = latex.trim();
    
    // If it already has proper markdown math delimiters, return as is
    if (normalized.includes('$')) {
      return normalized;
    }
    
    // Check for complex expressions that should be display math
    const isComplexExpression = [
      /\\frac\{[^}]*\}\{[^}]*\}/, // Fractions
      /\\int/, // Integrals
      /\\sum/, // Summations
      /\\prod/, // Products
      /\\lim/, // Limits
      /\\begin\{/, // Matrix/array environments
      /\\sqrt\{[^}]{8,}\}/, // Complex square roots
      /_{[^}]{4,}}/, // Complex subscripts
      /\^{[^}]{4,}}/, // Complex superscripts
    ].some(pattern => pattern.test(normalized));
    
    // Add appropriate math delimiters
    if (isComplexExpression) {
      return `$$${normalized}$$`; // Block math
    } else {
      return `$${normalized}$`; // Inline math
    }
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
      <span className={`math-error ${className}`} style={{ 
        color: '#e74c3c', 
        fontFamily: 'monospace',
        fontSize: '0.9em',
        border: '1px solid #e74c3c',
        padding: '2px 4px',
        borderRadius: '3px',
        backgroundColor: 'rgba(231, 76, 60, 0.1)'
      }}>
        Math Error: {children}
      </span>
    );
  }
};

export default MathRenderer; 