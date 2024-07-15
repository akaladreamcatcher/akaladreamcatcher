import React, { useState, useEffect } from 'react';
import './GameDialog.css';  // We'll create this CSS file next

const dialogs = [
    {
      text: "Welcome to our dreamcatcher, adventurer!",
      svgPath: "character1.svg"
    },
    {
      text: "Your quest is to understand the mysteries of adulthood costs.",
      svgPath: "character3.svg"
    },
    {
      text: "Remember, every decision affects your future.",
      svgPath: "character2.svg"
    },
    {
      text: "Good luck on your journey!",
      svgPath: "character3.svg"
    }
  ];
  

  const GameDialog = ({ onComplete }) => {
    const [currentDialog, setCurrentDialog] = useState(0);
    const [text, setText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
  
    useEffect(() => {
      setIsTyping(true);
      const typeText = dialogs[currentDialog].text.split('').reduce((acc, char, i) => {
        return acc.then(() => {
          return new Promise(resolve => {
            setTimeout(() => {
              setText((prev) => prev + char);
              resolve();
            }, 30);  // Typing speed in ms
          });
        });
      }, Promise.resolve());
  
      typeText.then(() => setIsTyping(false));
  
      return () => setText('');
    }, [currentDialog]);
  
    const handleNext = () => {
      if (isTyping) return;
      if (currentDialog < dialogs.length - 1) {
        setText('');
        setCurrentDialog(currentDialog + 1);
      } else {
        onComplete();  // Call the onComplete function when dialogs are done
      }
    };
  
    return (
      <div className='dialog-overlay' onClick={handleNext}>
        <div className='dialog-box'>
          <div className='character-svg'>
            {/* Display the SVG for the current dialog */}
            <img src={dialogs[currentDialog].svgPath} alt='Character' />
          </div>
          <p className='dialog-text'>{text}</p>
          <div className='continue-prompt'>Click to continue...</div>
        </div>
      </div>
    );
  };
  
  export default GameDialog;