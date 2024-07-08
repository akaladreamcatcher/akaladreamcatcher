import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './ScrollIndicator.css'; // Make sure to create this CSS file in your project.

const ScrollIndicator = () => {
    return (
        <div className="scroll-indicator">
            <FaChevronDown style={{
                padding: '1vh',
                width: '3vh',
                height: '3vh',
                border: 'none',
                color: '#ffffff',
                textShadow: '0px 0px 0px #ffffff'
            }} />
        </div>
    );
};

export default ScrollIndicator;
