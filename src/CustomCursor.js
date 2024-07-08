import React, { useEffect, useState } from 'react';
import './CustomCursor.css'; // Import the stylesheet

const CustomCursor = ({ defaultCursor, hoverCursor, clickCursor }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState('default');

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = () => setCursorState('hover');
    const handleMouseOut = () => setCursorState('default');
    const handleMouseDown = () => setCursorState('click');
    const handleMouseUp = () => setCursorState('default');

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseover', handleMouseOver);
      el.addEventListener('mouseout', handleMouseOut);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.querySelectorAll('a, button').forEach(el => {
        el.removeEventListener('mouseover', handleMouseOver);
        el.removeEventListener('mouseout', handleMouseOut);
      });
    };
  }, []);

  const getCursorImage = () => {
    switch (cursorState) {
      case 'hover':
        return hoverCursor;
      case 'click':
        return clickCursor;
      default:
        return defaultCursor;
    }
  };

  return (
    <div 
      className="custom-cursor" 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        backgroundImage: `url(${getCursorImage()})`
      }} 
    />
  );
};

export default CustomCursor;
