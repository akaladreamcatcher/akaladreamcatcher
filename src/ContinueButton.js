import React, { useState } from 'react';

const ContinueButton = ({ onContinue, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    position: 'relative',
    bottom: '0vh',
    padding: '10px 20px',
    fontSize: '2rem',
    cursor: 'none',
    color: '#ffffff',
    backgroundImage: isHovered ? 'linear-gradient(70deg, #7eb9fc, #4da0ff)' : 'linear-gradient(70deg, #4da0ff, #7eb9fc)',
    border: `4px solid ${isHovered ? '#7eb9fc' : '#4da0ff'}`,
    zIndex: '100',
    boxShadow: '0px 0px 20px 5px #4da0ffff'
  };

  return (
    <button
      className="continue-button"
      onClick={onContinue}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={buttonStyle}
    >
      Continue
    </button>
  );
};

export default ContinueButton;

