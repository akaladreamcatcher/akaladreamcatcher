import React, { useState, useEffect } from 'react';
import './index.css';
import './LoadingScreen.css';

const LoadingScreen = () => {
    const [messageIndex, setMessageIndex] = useState(0); // Initialize with 0
    const [screenVisible, setScreenVisible] = useState(true);
    const [fadeOutScreen, setFadeOutScreen] = useState(false); // Control fade-out for the screen

    // Sequence for messages and screen fade-out
    useEffect(() => {
        const timers = [
            setTimeout(() => setMessageIndex(1), 1000), // Start with the first message fading in
            setTimeout(() => setMessageIndex(2), 10000), // Change to the second message
            setTimeout(() => setFadeOutScreen(true), 15000), // Begin screen fade-out
            setTimeout(() => setScreenVisible(false), 16000) // Remove screen after fade-out
        ];

        return () => timers.forEach(timer => clearTimeout(timer)); // Cleanup
    }, []);

    const handleEnterFullScreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    };

    if (!screenVisible) return null; // Don't render anything if screen is not visible

    return (
        <div id="loadingScreen" className={`loading-screen ${fadeOutScreen ? 'fade-out' : ''}`}>
            {messageIndex === 1 && (
                <h2 className="loading-message fade-in">Hello, welcome!</h2>
                
            )}
            {messageIndex === 2 && (
                <h2 className="loading-message fade-in fade-in-second">
                    We're getting things ready,  just a sec.
                </h2>
            )}
            <div className="loader"></div>

        </div>
    );
};

export default LoadingScreen;
