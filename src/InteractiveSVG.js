import React, { useRef, useState, useEffect } from 'react';
import './InteractiveSVG.css';  // Ensure to create this CSS file and import it here

const InteractiveSVG = ({ sectionIndex }) => {
  const svgRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [backgroundVisible, setBackgroundVisible] = useState(true); // State to control visibility of the background SVG

  const handleSvgLoad = () => {
    if (!svgRef.current) return;
    const svgDocument = svgRef.current.contentDocument;
    const svgAnimation = svgDocument?.getElementById('');  // Replace with actual ID if needed

    if (svgAnimation) {
      // Initialize or reset SVG animation state here
      svgAnimation.setCurrentTime(0);
    }
    
    // Make the background SVG invisible for 3 seconds
    setBackgroundVisible(false);
    setTimeout(() => setBackgroundVisible(true), 3000);
  };

  useEffect(() => {
    // Force reload of SVG on section change
    if (!svgRef.current) return;
    const currentSrc = svgRef.current.data;
    svgRef.current.data = ''; // Reset the src to force reload
    setTimeout(() => svgRef.current.data = currentSrc, 10); // Set it back to reload the SVG
  }, [sectionIndex]);

  useEffect(() => {
    const svgDocument = svgRef.current?.contentDocument;
    const svgAnimation = svgDocument?.getElementById(''); // Add specific IDs to target hover animations

    if (isHovered && svgAnimation) {
      svgAnimation.setCurrentTime(2); // Example time in seconds
    }
  }, [isHovered]);

  return (
    <div className="svg-container">
      <object
        type="image/svg+xml"
        data="dog.svg" // Path to your SVG file
        ref={svgRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onLoad={handleSvgLoad}
        className="interactive-svg"
      >
        Your browser does not support SVG
      </object>
      <object
        type="image/svg+xml"
        data="dog.svg" // Path to your SVG file
        aria-hidden="true" // Hide from screen readers to prevent duplication
        className={`background-svg ${!backgroundVisible ? 'hidden' : ''}`} // Use conditional class for hiding
      >
        Your browser does not support SVG
      </object>
    </div>
  );
};

export default InteractiveSVG;
