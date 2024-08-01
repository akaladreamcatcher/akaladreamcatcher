import React, { useState, useEffect } from 'react';
import './GameDialog.css';  // Ensure the CSS file contains the required styles

const dialogs = [
  {
    text: "Hello, adventurer!",
    svgPath: "character1.svg"
  },
    {
      text: "Welcome to the Dreamcatcher.",
      svgPath: "character1.svg"
    },
    {
      text: "Click here to go fullscreen and begin your quest to understand the mysteries of adulthood costs.",
      svgPath: "character3.svg",
      action: "fullscreen"
    },
    {
      text: "Remember, every decision affects your future.",
      svgPath: "character2.svg"
    },
    {
      text: "A comfortable adulthood requires you to plan your education and career very carefully.",
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
  const [particles, setParticles] = useState([]);
  const [opacity, setOpacity] = useState(1); // New state for controlling opacity

  const [transform, setTransform] = useState({ x: 0, y: 0 });

   // Handlers for mouse movement
   const handleMouseMove = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const x = e.clientX - 100;
    const y = e.clientY - 100;
    const rotateX = ((y / 4000)) * 50; // 30 is the rotation factor, adjust as needed
    const rotateY = ((x / 4000)) * 50;
    setTransform({ x: rotateX, y: rotateY });
  };

  const requestFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  };


  useEffect(() => {
    // Particle creation logic
    const interval = setInterval(() => {
      if (particles.length < 5) {  // Control max particles count
        setParticles(prev => [...prev, createParticle()]);
      }
    }, 1500);  // Frequency of new particle creation

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Text typing effect
    setIsTyping(true);
    const typeText = dialogs[currentDialog].text.split('').reduce((acc, char, i) => {
      return acc.then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            setText((prev) => prev + char);
            resolve();
          }, 25);  // Typing speed in ms
        });
      }, Promise.resolve());
    }, Promise.resolve());

    typeText.then(() => {
      setIsTyping(false);
      setOpacity(1); // Ensure full visibility after typing
    });

    return () => setText('');
  }, [currentDialog]);

  useEffect(() => {
    if (currentDialog > 0) {  // Avoid fade effect on initial render
      setOpacity(0);
      setTimeout(() => {
        setOpacity(1);
      }, 250); // Quarter second for fade in
    }
  }, [currentDialog]);

  const createParticle = () => ({
    id: Math.random(),
    x: Math.random() * 100, // Initial horizontal position
    y: 0,
    opacity: Math.random() * 0.5 + 0.5,
    size: Math.random() * 10 + 5,  // Particle size
    speed: Math.random() * 5 +  10,  // Speed factor, modify range for different speeds
    drift: (Math.random() - 5) * 5 // Horizontal drift direction and magnitude
  });
  

  const handleNext = () => {
    if (isTyping) return;
    if (dialogs[currentDialog].action === 'fullscreen') {
      requestFullScreen();
    }
    if (currentDialog < dialogs.length - 1) {
      setText('');
      setOpacity(0); // Start fading out
      setTimeout(() => {
      setCurrentDialog(currentDialog + 1);
      }, 250); // Change dialog after the fade-out
    } else {
      onComplete(); // Delay completion to allow for fade out
      }
  };

  return (
    <div className='dialog-overlay' onClick={handleNext} onMouseMove={handleMouseMove}>
          <div class="gradient-bg"></div>

      <div className='svgDiv'> <div className='character-svg'>
          <img src={dialogs[currentDialog].svgPath} alt='Character' />
        </div></div>
        <div className='dialog-box' style={{'--rotateX': `${transform.x}deg`, '--rotateY': `${transform.y}deg`, opacity: opacity, transition: 'opacity 0.25s' }}>
       
        <p className='dialog-text'>{text}</p>
        {!isTyping && <div className='continue-prompt pulse'>Click anywhere to continue...</div>}
         {particles.map(particle => (
  <div key={particle.id} className="particle" style={{
    left: `${particle.x}%`,
    top: `${particle.y}px`,
    opacity: particle.opacity,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    animation: `fall ${particle.speed}s linear infinite`,
    transform: `translateX(${particle.drift * 50}px)`  // Adjust translateX to control horizontal movement
  }} />
))}

      </div>
    </div>
  );
};

export default GameDialog;