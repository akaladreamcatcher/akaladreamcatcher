import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    if (currentIndex >= filteredCars.length) {
      setCurrentIndex(0);
    }
  }, [filteredCars, currentIndex]);

  return (
    <div className="vehicle-selection">
      <div className="carousel-container">
      <button onClick={handlePrev} className="carousel-button">{"<"}</button>

        <div className="carousel-item">
          {filteredCars.length > 0 ? (
            <>
              <button
                className={`vehicle-button ${selectedMake === filteredCars[currentIndex]?.make ? 'selected' : ''}`}
                onClick={() => onSelect(filteredCars[currentIndex]?.make)}
              style={{backgroundImage: 'linear-gradient(to bottom, #ffffff00, #ffffff00)', height: '20vh', backgroundColor:'transparent'}}>
                <h3 style={{lineHeight:'1rem'}}>{filteredCars[currentIndex].make}</h3><img
                  src={`cars/carmodels/${filteredCars[currentIndex].make}.png`}
                  alt={`${filteredCars[currentIndex].make} logo`}
                  style={{ width: 'auto', height: '100px', marginTop:'0vh', backgroundSize: 'contain', }} // Adjust size as necessary
                />
              </button>
            </>
          ) : (
            <p>No results found</p>
          )}
        </div>
        <button onClick={handleNext} className="carousel-button">{">"}</button>


      </div>
      <div style={{height: '10vh'}}>
      <h3 style={{color: '#ffffff77', paddingBottom: '2vh', fontWeight: 'normal', fontStyle: 'italic'}}>Tap to select</h3>
</div>
<input
        type="text"
        placeholder="Search for a vehicle make..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
        style={{padding:'1vw 5vw', margin: '2vh', color: '#fff'}}
      />
    </div>
  );
};

export default VehicleSelection;
