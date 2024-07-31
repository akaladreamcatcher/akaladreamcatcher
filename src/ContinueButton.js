import React, { useState } from 'react';
import './ContinueButton.css';

const ContinueButton = ({ onContinue, index, buttonText = 'Continue', buttonStyle = {} }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="continue-button"
      style={buttonStyle}
      onClick={onContinue}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {buttonText}
    </button>
  );
};

export default ContinueButton;

