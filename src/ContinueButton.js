import React from 'react';

const ContinueButton = ({ onContinue, index }) => {
  const buttonStyle = {
    position: 'absolute',
    right: index === 0 ? '15%' : '-3%', // Different position for the first button
    bottom: '0vh',
    transform: index === 0 ? 'translateX(-60%)' : 'translateX(-50%)', // Different position for the first button
    padding: '10px 20px',
    fontSize: '2rem',
    cursor: 'none'
  };

  return (
    <button
      className="continue-button"
      onClick={onContinue}
      style={buttonStyle}
    >
      Continue
    </button>
  );
};

export default ContinueButton;
