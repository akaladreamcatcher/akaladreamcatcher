import React, { useState } from 'react';
import './ContinueButton.css';


const ContinueButton = ({ onContinue, index }) => {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <button
      className="continue-button"
      onClick={onContinue}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Continue
    </button>
  );
};

export default ContinueButton;

