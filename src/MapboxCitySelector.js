// MapboxCitySelector.js
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { medianRentPrices } from './data'; // Adjust the path to your data.js
import './App.css'; // Import the CSS file

mapboxgl.accessToken = 'pk.eyJ1IjoiZGpndXRicm9kIiwiYSI6ImNseG05dXN0OTA1OXMyam9taGF3bmY5OXYifQ.A7e4R-tTlvLZPTqN7_H9ig';

const MapboxCitySelector = ({ onSelectCity }) => {
  const [map, setMap] = useState(null);
  const [activeCity, setActiveCity] = useState(null);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/djgutbrod/clxmau9g3029501qj3urv4gt8',
      center: [-98.5795, 39.8283], // Centered on the USA
      zoom: 2,
      minZoom: 2,
      maxZoom: 10,
      maxBounds: [
        [-130, 24], // Southwest coordinates
        [-65, 50] // Northeast coordinates
      ]
    });

        // Add navigation controls (zoom buttons)
        mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');


    Object.keys(medianRentPrices).forEach((city) => {
      const coordinates = getCityCoordinates(city);
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(mapInstance);

      const formattedCityName = formatCityName(city);

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        anchor: 'left',
        className: 'mapboxgl-popup-content'
      }).setText(formattedCityName);

      marker.getElement().addEventListener('mouseenter', () => {
        popup.addTo(mapInstance).setLngLat(coordinates);
      });

      marker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
      });

      marker.getElement().addEventListener('click', () => {
        setActiveCity(city);
        onSelectCity(city);
      });
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, [onSelectCity]);

  useEffect(() => {
    if (map && activeCity) {
      // Optionally, you can zoom in or highlight the selected city here
      map.flyTo({ center: getCityCoordinates(activeCity), zoom: 10 });
    }
  }, [map, activeCity]);

  const getCityCoordinates = (city) => {
    // Define a function that returns the coordinates for each city
    const coordinates = {
      NewYork: [-74.006, 40.7128],
      LosAngeles: [-118.2437, 34.0522],
      Chicago: [-87.6298, 41.8781],
      Houston: [-95.3698, 29.7604],
      Phoenix: [-112.074, 33.4484],
      Philadelphia: [-75.1652, 39.9526],
      SanAntonio: [-98.4936, 29.4241],
      SanDiego: [-117.1611, 32.7157],
      Dallas: [-96.7969, 32.7767],
      SanJose: [-121.8863, 37.3382],
      Austin: [-97.7431, 30.2672],
      Jacksonville: [-81.6557, 30.3322],
      FortWorth: [-97.3308, 32.7555],
      Columbus: [-82.9988, 39.9612],
      Indianapolis: [-86.1581, 39.7684],
      Charlotte: [-80.8431, 35.2271],
      SanFrancisco: [-122.4194, 37.7749],
      Seattle: [-122.3321, 47.6062],
      Denver: [-104.9903, 39.7392],
      Washington: [-77.0369, 38.9072],
    };
    return coordinates[city];
  };

  const formatCityName = (city) => {
    return city.replace(/([A-Z])/g, ' $1').trim();
  };

  const resetMap = () => {
    setActiveCity(null);
    if (map) {
      map.flyTo({ center: [-98.5795, 39.8283], zoom: 3 });
    }
  };

  return (
    <div style={{ textAlign: 'center', height: '100%' }}>
    <div id="map" style={{ left: '-30vh', height: '70%', width: '350%', borderRadius: '25px', overflow: 'hidden', margin: '5vh auto' }}></div>
      {activeCity && (
        <div style={{ marginTop: '10px', fontSize: '24px', fontWeight: 'bold' }}>
        <span style={{ display: 'inline-block', marginRight: '10px' }}>
          <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" alt="Map Pin" />
        </span>
        <span>{formatCityName(activeCity)}</span>
      </div>
      )}
      <button onClick={resetMap} style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#ffc400', cursor: 'none' }}>
        Change City
      </button>
    </div>
  );
};

export default MapboxCitySelector;
