import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './ScrollIndicator.css'; // Make sure to create this CSS file in your project.

const ScrollIndicator = () => {
    return (
        <div className="scroll-indicator">
            <FaChevronDown style={{
                filter: 'drop-shadow(0px 0px 10px #00000055)',
                marginTop: '3vh',
                paddingLeft: '3vh',
                width: '3vh',
                height: '3vh',
                border: 'none',
                color: '#ffffff',
                textShadow: '0px 0px 0px #ababab'
            }} />
        </div>
    );
};

export default ScrollIndicator;
