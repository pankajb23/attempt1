import React from 'react';

interface SafeSpanProps {
  children?: React.ReactNode;
  className?: string;
}

const SafeSpan = ({ children, className }: SafeSpanProps) => {
  const getText = (content: React.ReactNode): string => {
    try {
      console.log('Reached here', content);
      if (typeof content === 'string') {
        return content.trim();
      }

      if (React.isValidElement(content)) {
        const props = content.props;
        console.log('checking here for content ' + content);
        if (typeof props.children === 'string') {
          return props.children.trim();
        }
      }

      return '';
    } catch (e) {
      console.log('Error in SafeSpan', e);
      return '';
    }
  };

  return <span className={className}>{getText(children)}</span>;
};

export default SafeSpan;
