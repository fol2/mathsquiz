import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  children: string;
  inline?: boolean;
  className?: string;
}

// React implementation using react-katex. By letting React manage the DOM,
// we avoid direct DOM manipulation that caused unmount errors with the
// previous approach.
const MathRenderer: React.FC<MathRendererProps> = ({ children, inline = true, className = '' }) => {
  const Wrapper = inline ? 'span' : 'div';

  try {
    return (
      <Wrapper className={className}>
        {inline ? <InlineMath>{children}</InlineMath> : <BlockMath>{children}</BlockMath>}
      </Wrapper>
    );
  } catch (error) {
    console.warn('Failed to render LaTeX, falling back to plain text:', error);
    return <Wrapper className={className}>{children}</Wrapper>;
  }
};

export default MathRenderer;
