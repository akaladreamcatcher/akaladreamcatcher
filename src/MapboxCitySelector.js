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
      // New additional cities
      Boston: [-71.0589, 42.3601],
      Detroit: [-83.0458, 42.3314],
      Nashville: [-86.7816, 36.1627],
      Portland: [-122.6765, 45.5234],
      Baltimore: [-76.6122, 39.2904],
      Milwaukee: [-87.9065, 43.0389],
      Albuquerque: [-106.6504, 35.0844],
      KansasCity: [-94.5786, 39.0997],
      Omaha: [-95.9345, 41.2565],
      Raleigh: [-78.6382, 35.7796],
      Miami: [-80.1918, 25.7617],
      Cleveland: [-81.6944, 41.4993],
      NewOrleans: [-90.0715, 29.9511],
      Tampa: [-82.4572, 27.9506],
      Pittsburgh: [-79.9959, 40.4406],
      Cincinnati: [-84.512, 39.1031],
      Sacramento: [-121.4944, 38.5816],
      Orlando: [-81.3792, 28.5383],
      Atlanta: [-84.3880, 33.7490],
    Minneapolis: [-93.2650, 44.9778],
    Honolulu: [-157.8583, 21.3069],
    LasVegas: [-115.1398, 36.1699],
    Louisville: [-85.7585, 38.2527],
    Memphis: [-90.0490, 35.1495],
    Richmond: [-77.4360, 37.5407],
    OklahomaCity: [-97.5164, 35.4676],
    Hartford: [-72.6851, 41.7637],
    SaltLakeCity: [-111.8910, 40.7608],
    StLouis: [-90.1994, 38.6270],
    Providence: [-71.4128, 41.8240],
    DesMoines: [-93.6091, 41.5868],
    BatonRouge: [-91.1871, 30.4515],
    Boise: [-116.2023, 43.6150],
    Anchorage: [-149.9003, 61.2181],
    LittleRock: [-92.2896, 34.7465],
    Birmingham: [-86.8025, 33.5207],
    Buffalo: [-78.8784, 42.8864],
    Tucson: [-110.9747, 32.2226],
    SanJuan: [-66.1057, 18.4655],
    Madison: [-89.4012, 43.0731],
    Newark: [-74.1724, 40.7357],
    Chattanooga: [-85.3097, 35.0456],
    Reno: [-119.8138, 39.5296],
    Spokane: [-117.4260, 47.6588],
    Augusta: [-81.9794, 33.4735],
    Shreveport: [-93.7502, 32.5252],
    Mobile: [-88.0399, 30.6954],
    Knoxville: [-83.9207, 35.9606],
    Chesapeake: [-76.2875, 36.7682],
    FortWayne: [-85.1394, 41.0793],
    Huntsville: [-86.5861, 34.7304],
    Fresno: [-119.7871, 36.7378],
    Mesa: [-111.8315, 33.4152],
    ColoradoSprings: [-104.8214, 38.8339],
    Tacoma: [-122.4443, 47.2529],
    Arlington: [-97.1081, 32.7357],
    Lincoln: [-96.6852, 40.8136],
    SantaAna: [-117.8678, 33.7455]
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
      <button onClick={resetMap} style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '24px',   border: '4px solid #ffc400', backgroundColor: '#ffc400', cursor: 'none' }}>
        Change City
      </button>
    </div>
  );
};

export default MapboxCitySelector;
