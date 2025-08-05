import React, { useEffect, useState, useCallback } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOverButton, setIsOverButton] = useState(false);

  const updateCursorPosition = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      setIsOverButton(true);
    };

    const handleMouseLeave = () => {
      setIsOverButton(false);
    };

    // Add event listeners for all interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea, select');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('mousemove', updateCursorPosition);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [updateCursorPosition]);

  return (
    <div
      className="custom-cursor"
      style={{
        transform: `translate3d(${position.x - 12}px, ${position.y - 12}px, 0)`,
        opacity: isOverButton ? 0 : 1,
        transition: 'opacity 0.2s ease'
      }}
    />
  );
};

export default CustomCursor; 