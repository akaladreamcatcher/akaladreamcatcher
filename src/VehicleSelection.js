import React, { useState } from 'react';
import { carPrices } from './data'; // Adjust the path as necessary
import './VehicleSelection.css'; // Import the new stylesheet

const VehicleSelection = ({ selectedMake, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredCars = carPrices.filter(car =>
    car.make.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? filteredCars.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === filteredCars.length - 1 ? 0 : prevIndex + 1));
  };

  // Reset currentIndex if filteredCars length changes to prevent out-of-bounds errors
  React.useEffect(() => {
    if (currentIndex >= filteredCars.length) {
      setCurrentIndex(0);
    }
  }, [filteredCars, currentIndex]);

  return (
    <div className="vehicle-selection">
      <input
        type="text"
        placeholder="Search for a vehicle make..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="carousel-container">
        <button onClick={handlePrev} className="carousel-button">{"<"}</button>
        <div className="carousel-item">
          {filteredCars.length > 0 ? (
            <button
              className={`vehicle-button ${selectedMake === filteredCars[currentIndex]?.make ? 'selected' : ''}`}
              onClick={() => onSelect(filteredCars[currentIndex]?.make)}
            >
              {filteredCars[currentIndex]?.make}
            </button>
          ) : (
            <p>No results found</p>
          )}
        </div>
        <button onClick={handleNext} className="carousel-button">{">"}</button>
      </div>
    </div>
  );
};

export default VehicleSelection;
