import React, { useState, useEffect } from 'react';
import './SpeechBubble.css';  // Continue using this for basic styling without animation classes

const messages = [
    "The average monthly rent for a one-bedroom apartment in the U.S. is approximately  $1,713, but this can significantly vary by city.",
    "Healthcare costs in the U.S. are among the highest in the world, with Americans spending over $13,493 per person annually.",
    "Childcare costs can vary widely in the U.S., averaging around $18,886 per year.",
    "Utility bills, including electricity, heating, cooling, water, and garbage, can cost an average of $328.03 per month.",
    "Transportation expenses, such as owning and operating a vehicle, can cost around $12,182 per year for the average American.",
    "The cost of food takes up 11.3 of the average American's income.",
    "Educational expenses in the U.S. are substantial, with the average cost of college tuition and fees exceeding $39,400 per year at private colleges.",
    "Dining out in the U.S. can cost, on average, $23 per person per meal in a mid-range restaurant.",
    "The average cost of utilities and cell phone bills combined can exceed $442.03 per month, depending on usage and location.",
    "The median monthly mortgage payment for homeowners in the U.S. is about $2,051, but this varies greatly depending on location and home size."
];

const SpeechBubble = () => {
    const [index, setIndex] = useState(0);
    const [opacity, setOpacity] = useState(0); // use opacity directly in the component state

    useEffect(() => {
        let timeoutId = null;

        const cycleMessage = () => {
            setOpacity(0); // start by hiding the bubble
            timeoutId = setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setOpacity(1); // fade in
            }, 1000); // allow 1 second for fading out
        };

        const intervalId = setInterval(cycleMessage, 15000); // change message every 9 seconds

        // Initial fade-in when component mounts
        setOpacity(1);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div
            className="speech-bubble"
            style={{ opacity: opacity, transition: 'opacity 1s ease-in-out' }}
        >
            {messages[index]}
        </div>
    );
};

export default SpeechBubble;
