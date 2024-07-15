import React, { useRef, useEffect, useState } from 'react'; // Make sure to import useState here
import { useSelector, useDispatch } from 'react-redux';
import { setField, calculateSalary } from './lifestyleSlice'; // Only import existing actions
import './App.css';
import ThreeScene from './ThreeScene'; // Import the ThreeScene component
import ScrollIndicator from './ScrollIndicator'; // Adjust the path as necessary
import LoadingScreen from './LoadingScreen.js';
import InteractiveSVG from './InteractiveSVG'; // Adjust the path as needed
import SpeechBubble from './SpeechBubble.js';
import ContinueButton from './ContinueButton';  // Import the ContinueButton component
import VehicleSelection from './VehicleSelection'; // Adjust the path as necessary

import CustomCursor from './CustomCursor'; // Import the custom cursor component
import defaultCursorSVG from './mouse.svg'; // Path to your default cursor SVG
import hoverCursorSVG from './mouse_hover.svg'; // Path to your hover cursor SVG
import clickCursorSVG from './mouse_click.svg'; // Path to your click cursor SVG
import GameDialog from './GameDialog';  // Import the GameDialog component



import fullpage from 'fullpage.js';
import 'fullpage.js/dist/fullpage.css';


import MapboxCitySelector from './MapboxCitySelector'; // Import the MapboxCitySelector component

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);



function App() {
  const dispatch = useDispatch();
  const lifestyle = useSelector(state => state.lifestyle);
  const [isVisible, setIsVisible] = useState(false); // State to control the visibility of the cost breakdown

  const fullpageRef = useRef(null);
  const fullpageInstanceRef = useRef(null);  // Store the instance in a ref

  const [currentSection, setCurrentSection] = useState(0); // Now useState is correctly imported

  const [showDialog, setShowDialog] = useState(true);

  const handleDialogComplete = () => {
    setShowDialog(false);
  };





  useEffect(() => {
    fullpageInstanceRef.current = new fullpage(fullpageRef.current, {
      autoScrolling: true,
      navigation: true,  // Enable the navigation dots

      scrollHorizontally: true,
      loopBottom: true,
      sectionsColor: [],
      afterLoad: (origin, destination, direction) => {
        setCurrentSection(destination.index);
        const section = destination.item;
        const elements = section.querySelectorAll('.fade-in');
        elements.forEach((element, index) => {
          setTimeout(() => {
            element.classList.add('active');
          }, index * 300);
        });
      },
      onLeave: (origin, destination, direction) => {
        const section = origin.item;
        const elements = section.querySelectorAll('.fade-in');
        elements.forEach(element => {
          element.classList.remove('active');
        });
      }
    });

    return () => {
      if (fullpageInstanceRef.current && fullpageInstanceRef.current.destroy) {
        fullpageInstanceRef.current.destroy();
      }
    };
  }, []);

  const moveNext = () => {
    fullpageInstanceRef.current.moveSectionDown();
  };


  // Revised handleChange to use setField
  const handleChange = (field, value) => {
    dispatch(setField({ field, value }));
  };

  const handleCalculateClick = () => {
    dispatch(calculateSalary());
    setIsVisible(true); // Set visibility to true when the button is clicked
  };

  const priceLevels = {
    '$': 'low',
    '$$': 'medium',
    '$$$': 'high'
  };

  // Ensure all values are defined and fallback to 0 if not
  const {
    baseLivingCost = "$0",
    secondParentCost = "$0",
    vehicleCost = "$0",
    diningOutCost = "$0",
    housingCost = "$0",
    kidsCost = "$0",
    vacationCost = "$0",
    annualRetirementSavings = "$0"
  } = lifestyle.costBreakdown;

  const data = {
    labels: [
      'Base living cost for one adult',
      'Additional cost for a second parent',
      'Vehicle cost',
      'Dining out costs per year',
      'Housing cost',
      'Cost for kids',
      'Vacation costs per year',
      'Annual retirement savings'
    ],
    datasets: [
      {
        data: [
          parseFloat(baseLivingCost.replace(/\$|,/g, '')),
          parseFloat(secondParentCost.replace(/\$|,/g, '')),
          parseFloat(vehicleCost.replace(/\$|,/g, '')),
          parseFloat(diningOutCost.replace(/\$|,/g, '')),
          parseFloat(housingCost.replace(/\$|,/g, '')),
          parseFloat(kidsCost.replace(/\$|,/g, '')),
          parseFloat(vacationCost.replace(/\$|,/g, '')),
          parseFloat(annualRetirementSavings.replace(/\$|,/g, ''))
        ],
        backgroundColor: [
          '#ff9166', '#ffd24d', '#ffe199', '#fff0e6', '#ffcd85', '#ffdaaa', '#ffe8d0', '#fff5e6'
        ],
        hoverBackgroundColor: [
          '#ff9166', '#ffd24d', '#ffe199', '#fff0e6', '#ffcd85', '#ffdaaa', '#ffe8d0', '#fff5e6'
        ]
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'white' // Make legend labels white
        }
      },
      tooltip: {
        bodyColor: 'white' // Make tooltip labels white
      }
    },
    layout: {
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
      }
    }
  };


  return (

    <>
          {showDialog && <GameDialog onComplete={handleDialogComplete} />}

      <CustomCursor defaultCursor={defaultCursorSVG}
        hoverCursor={hoverCursorSVG}
        clickCursor={clickCursorSVG} />

      <LoadingScreen />
      <SpeechBubble />
      <InteractiveSVG sectionIndex={currentSection} />


      <div className="body-gradient">

        <ThreeScene currentSection={currentSection} numberOfKids={lifestyle.kids} numberOfCars={lifestyle.vehicles} numberOfhouses={lifestyle.bedrooms} />

        <div ref={fullpageRef}>

          <div className="section">
            <div className="container" style={{ left: '5%', height: '70vh', width: '50vh' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <h2 className="header fade-in" style={{ textAlign: 'center' }}> AKALA Dream Lifestyle Calculator </h2>
                <p className="paragraph fade-in" style={{ textAlign: 'center', color: '#ffffff' }}>This lifestyle simulation is designed to help kids and young adults understand how much adulthood really costs. </p>
                <p className="paragraph fade-in" style={{ fontWeight: 'bold', textAlign: 'center', color: '#ffc400' }}> Scroll down to proceed through the experience.</p>
              </div>
              <ContinueButton onContinue={moveNext} />
            </div>

          </div>

          <div className="section">
            <div className="container" style={{ height: '70vh', width: '90vh' }}>
              <h2 className="header fade-in" style={{ width: '100vh', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
                What city do you want to live in?
              </h2>    <MapboxCitySelector onSelectCity={(city) => handleChange('city', city)} />
            </div>
            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />
          </div>
          <div className="section">
            <div className="container">
              <h2 className="header fade-in">How many kids do you want?</h2>
              <div className='input-container'>
                <div className='button-container fade-in'>           <button
                  onClick={() => handleChange('kids', lifestyle.kids + 1)}
                  aria-label="Increase kids count"
                >+</button>
                  <button
                    onClick={() => handleChange('kids', Math.max(0, lifestyle.kids - 1))}
                    aria-label="Decrease kids count"
                  >-</button></div>
                <input className="fade-in"
                  type="number"
                  value={lifestyle.kids}
                  onChange={() => { }} // Disable typing
                  style={{ textAlign: 'center', fontSize: '6rem' }}
                  readOnly
                />

              </div>
            </div>
            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />

          </div>

          <div className="section">
            <div className="container">
              <h2 className="header fade-in" >How many bedrooms will your house have?</h2>
              <div className='input-container'>
                <div className='button-container fade-in'>           <button
                  onClick={() => handleChange('bedrooms', lifestyle.bedrooms + 1)}
                  aria-label="Increase bedrooms count"
                >+</button>
                  <button
                    onClick={() => handleChange('bedrooms', Math.max(1, lifestyle.bedrooms - 1))}
                    aria-label="Decrease bedrooms count"
                  >-</button></div>
                <input className="fade-in"
                  type="number"
                  value={lifestyle.bedrooms}
                  onChange={() => { }} // Disable typing
                  style={{ textAlign: 'center', fontSize: '6rem' }}
                  readOnly
                />

              </div>     </div>
            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />

          </div>
          <div className="section">
            <div className="container">
              <div className='input-container'>

                <h2 className="header fade-in" >Rent or Purchase?</h2>
                <div className='button-container fade-in'>

                  <button
                    className={`button ${lifestyle.housingPreference === 'rent' ? 'selected' : 'unselected'}`}
                    onClick={() => handleChange('housingPreference', 'rent')}
                  >
                    Rent
                  </button>
                  <button
                    className={`button ${lifestyle.housingPreference === 'purchase' ? 'selected' : 'unselected'}`}
                    onClick={() => handleChange('housingPreference', 'purchase')}
                  >
                    Purchase
                  </button>
                </div>
              </div>

            </div>
            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />


          </div>

          <div className="section">
            <div className="container">
              <h2 className="header fade-in">How often do you eat out per week?</h2>
              <div className='input-container'>
                <div className='button-container fade-in'>
                  <button onClick={() => handleChange('diningOutFrequency', Math.max(0, lifestyle.diningOutFrequency + 1))}
                    aria-label="Increase dining out frequency">+</button>
                  <input className="fade-in"
                    type="number"
                    value={lifestyle.diningOutFrequency}
                    onChange={() => { }} // Disable typing
                    style={{ textAlign: 'center', fontSize: '6rem' }}
                    readOnly />
                  <button onClick={() => handleChange('diningOutFrequency', lifestyle.diningOutFrequency - 1)}
                    aria-label="Decrease dining out frequency">-</button>
                </div>
              </div>
              <h2 className="header fade-in">Meal Price Level</h2>
              <div className='button-container fade-in'>
                {Object.entries(priceLevels).map(([symbol, level]) => (
                  <button key={symbol} onClick={() => handleChange('diningOutCostLevel', level)}
                    className={lifestyle.diningOutCostLevel === level ? 'selected' : ''}>
                    {symbol.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />
          </div>

          <div className="section">
            <div className="container">
              <h2 className="header fade-in" >How many vehicles do you want?</h2>
              <div className='input-container'>
                <div className='button-container fade-in'>           <button
                  onClick={() => handleChange('vehicles', lifestyle.vehicles + 1)}
                  aria-label="Increase vehicles count"
                >+</button>
                  <button
                    onClick={() => handleChange('vehicles', Math.max(0, lifestyle.vehicles - 1))}
                    aria-label="Decrease vehicles count"
                  >-</button></div>
                <input className="fade-in"
                  type="number"
                  value={lifestyle.vehicles}
                  onChange={() => { }} // Disable typing
                  style={{ textAlign: 'center', fontSize: '6rem' }}
                  readOnly
                />

              </div>
            </div>
            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />

          </div>

          <div className="section">
            <div className="container">
              <h2 className="header fade-in">What make of vehicle?</h2>
              <VehicleSelection selectedMake={lifestyle.vehicleMake} onSelect={(make) => handleChange('vehicleMake', make)} />
            </div>
            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />

          </div>
          <div className="section">
            <div className="container">
              <h2 className=" header fade-in" >New or Used Car?</h2>
              <div className='input-container'>
                <button
                  className={`button ${lifestyle.vehicleCondition === 'new' ? 'selected' : 'unselected'}`}
                  onClick={() => handleChange('vehicleCondition', 'new')}
                >
                  New
                </button>
                <button
                  className={`button ${lifestyle.vehicleCondition === 'used' ? 'selected' : 'unselected'}`}
                  onClick={() => handleChange('vehicleCondition', 'used')}
                >
                  Used
                </button>
              </div>
            </div>
            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />

          </div>
          <div className="section">
            <div className="container">
              <h2 className=" header fade-in" >How often do you want to go on vacation each year?</h2>
              <div className='input-container'>
                <div className='button-container fade-in'>           <button
                  onClick={() => handleChange('vacationsPerYear', lifestyle.vacationsPerYear + 1)}
                  aria-label="Increase vacationsPerYear count"
                >+</button>
                  <button
                    onClick={() => handleChange('vacationsPerYear', Math.max(0, lifestyle.vacationsPerYear - 1))}
                    aria-label="Decrease vacationsPerYear count"
                  >-</button></div>
                <input className="fade-in"
                  type="number"
                  value={lifestyle.vacationsPerYear}
                  onChange={() => { }} // Disable typing
                  style={{ textAlign: 'center', fontSize: '6rem' }}
                  readOnly
                />

              </div>   </div>
            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />

          </div>
          <div className="section">
            <div className="container">

              <h2 className=" header fade-in" >Do you want your kids in public or private school?</h2>
              <div className='input-container'>
                <div className='button-container fade-in'>

                  <button
                    className={`button ${lifestyle.schoolType === 'public' ? 'selected' : 'unselected'}`}
                    onClick={() => handleChange('schoolType', 'public')}
                  >
                    Public
                  </button>
                  <button
                    className={`button ${lifestyle.schoolType === 'private' ? 'selected' : 'unselected'}`}
                    onClick={() => handleChange('schoolType', 'private')}
                  >
                    Private
                  </button>
                </div>

              </div>
            </div>

            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />

          </div>
          <div className="section">
            <div className="container">
              <h2 className=" header fade-in" >What age do you want to retire?</h2>
              <div className='input-container'>
                <div className='button-container fade-in'>           <button
                  onClick={() => handleChange('retirementAge', lifestyle.retirementAge + 1)}
                  aria-label="Increase retirementAge count"
                >+</button>
                  <button
                    onClick={() => handleChange('retirementAge', Math.max(0, lifestyle.retirementAge - 1))}
                    aria-label="Decrease retirementAge count"
                  >-</button></div>
                <input className="fade-in"
                  type="number"
                  value={lifestyle.retirementAge}
                  onChange={() => { }} // Disable typing
                  style={{ textAlign: 'center', fontSize: '6rem' }}
                  readOnly
                />

              </div>      </div>
            <ContinueButton onContinue={moveNext} />
            <ScrollIndicator />

          </div>
          <div className="section">
            <div className="container" style={{ left: '5%', height: '65vh', width: '100vh' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '100%' }}>
                {/* Left Column for Salary Calculation */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 2, marginRight: '20px' }}>
                  <button onClick={handleCalculateClick} style={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
                    Calculate Required Salary
                  </button>
                  <p className="paragraph fade-in" style={{ textAlign: 'center' }}>Required Salary: </p>
                  <h2 className="header fade-in" style={{ textAlign: 'center' }}> ${lifestyle.requiredSalary.toLocaleString()}</h2>
                </div>

                {/* Right Column for Cost Breakdown */}
                {isVisible && (
                  <div className="cost-breakdown" style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderLeft: '3px solid #ffffff54', // Add a gray border line to the left
                    paddingLeft: '20px' // Add some padding to separate text from the border
                  }}>
                    <h3>Cost Breakdown:</h3>
                    <Pie data={data} options={options} />

                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}> {/* Added borderSpacing for space between rows */}
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'bottom' }}>Base living cost for one adult:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>{lifestyle.costBreakdown.baseLivingCost}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'bottom' }}>Additional cost for a second parent:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>{lifestyle.costBreakdown.secondParentCost}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'bottom' }}>Vehicle cost:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>{lifestyle.costBreakdown.vehicleCost}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'bottom' }}>Dining out costs per year:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>{lifestyle.costBreakdown.diningOutCost}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'bottom' }}>Housing cost:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>{lifestyle.costBreakdown.housingCost}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'bottom' }}>Cost for kids:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>{lifestyle.costBreakdown.kidsCost}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'bottom' }}>Vacation costs per year:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>{lifestyle.costBreakdown.vacationCost}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'bottom' }}>Annual retirement savings:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>{lifestyle.costBreakdown.annualRetirementSavings}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'bottom' }}>Total required annual salary including retirement:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'bottom' }}>{lifestyle.costBreakdown.totalRequiredSalary}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            {/*  <ContinueButton onContinue={moveNext} />
              <ScrollIndicator /> */}
          </div>

        </div>
      </div>

    </>
  );
}

export default App;
