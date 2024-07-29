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
import { debounce } from 'lodash'; // If you prefer lodash, uncomment this and remove the above custom debounce function


import CustomCursor from './CustomCursor'; // Import the custom cursor component
import defaultCursorSVG from './mouse.svg'; // Path to your default cursor SVG
import hoverCursorSVG from './mouse_hover.svg'; // Path to your hover cursor SVG
import clickCursorSVG from './mouse_click.svg'; // Path to your click cursor SVG
import GameDialog from './GameDialog';  // Import the GameDialog component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faHouse, faBaby, faBed, faFileContract, faUtensils, faCar, faSuitcase, faSchool, faWheelchair } from '@fortawesome/free-solid-svg-icons';






import fullpage from 'fullpage.js';
import 'fullpage.js/dist/fullpage.css';
import CountUp from 'react-countup';


import MapboxCitySelector from './MapboxCitySelector'; // Import the MapboxCitySelector component

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);



function App() {
  const dispatch = useDispatch();
  const lifestyle = useSelector(state => state.lifestyle);
  const [isVisible, setIsVisible] = useState(false); // State to control the visibility of the cost breakdown
  const [showButton, setShowButton] = useState(true); // Controls visibility of the 'Show Breakdown' button
  const [prevSalary, setPrevSalary] = useState(0);
  const [currentSalary, setCurrentSalary] = useState(lifestyle.costBreakdown.totalRequiredSalary || 0);

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
    setShowButton(false); // Hide the button after it is clicked

  };


  const handleChangeDebounced = debounce((method, value) => {
    handleChange(method, value);
  }, 200); // Adjust the debounce time to your needs


  useEffect(() => {
    dispatch(calculateSalary());
  }, [
    dispatch, // Now included as per ESLint's exhaustive-deps rule

    lifestyle.vehicles,
    lifestyle.diningOutFrequency,
    lifestyle.bedrooms,
    lifestyle.kids,
    lifestyle.vacationsPerYear,
    lifestyle.retirementAge
  ]);
  useEffect(() => {
    const salaryStr = lifestyle.costBreakdown.totalRequiredSalary;
    if (salaryStr) {
      // Remove non-numeric characters except for digits and decimal points
      const cleanedSalaryStr = salaryStr.replace(/[^0-9.]+/g, '');
      const salary = parseInt(cleanedSalaryStr, 10);
      if (!isNaN(salary)) {
        setPrevSalary(currentSalary); // Updates previous salary
        setCurrentSalary(salary); // Updates current salary
        console.log("Updated Salaries", { prevSalary: currentSalary, currentSalary: salary });
      }
    }
  }, [lifestyle.costBreakdown.totalRequiredSalary]);


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
    maintainAspectRatio: true, // This should be true to maintain the aspect ratio defined
    aspectRatio: 2,  // Lower this number to increase height relative to the width

    plugins: {
      legend: {
       display: 'none', // Place legend on the right side of the chart


      },
      tooltip: {
        bodyColor: 'white' // Make tooltip labels white
      }
    },
    layout: {
      padding: {
        top: 2,
        bottom: 2,
        left: 5,
        right: 5
      }
    }
  };




  // AdjustmentButton component for increment and decrement actions
  const AdjustmentButton = ({ onClick, label }) => (
    <button
      onClick={onClick}
      style={{
        backgroundColor: '#ffcd85', // Light orange background
        color: '#333', // Dark text color for contrast
        border: 'none',
        borderRadius: '5px',
        padding: '4px 8px',
        cursor: 'none',
        margin: '0 5px',
        fontSize: '16px',
        height: '3vh',
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)' // subtle shadow for depth
      }}
    >
      {label}
    </button>
  );

  const TableRowWithAdjustment = ({ itemLabel, itemValue, onIncrease, onDecrease }) => (
    <tr>
      <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <AdjustmentButton label="-" onClick={onDecrease} />
          <span style={{ width: '10px', fontSize: '1.2rem', textAlign: 'center', margin: '0 10px' }}>{itemValue}</span>
          <AdjustmentButton label="+" onClick={onIncrease} />
        </div>
      </td>
      <td style={{ fontWeight: 'normal', verticalAlign: 'middle', width: '150px' }}>{itemLabel}</td>

    </tr>
  );



  return (

    <>
      {showDialog && <GameDialog onComplete={handleDialogComplete} />}

      <CustomCursor defaultCursor={defaultCursorSVG}
        hoverCursor={hoverCursorSVG}
        clickCursor={clickCursorSVG} />

      <LoadingScreen />
      <SpeechBubble />
      <InteractiveSVG sectionIndex={currentSection} />


      <div className="body-gradient"
      >
        <div><div className="body-gradient-2"
        ></div><ThreeScene currentSection={currentSection} numberOfKids={lifestyle.kids} numberOfCars={lifestyle.vehicles} numberOfhouses={lifestyle.bedrooms} />
        </div>

        <div ref={fullpageRef}>

          <div className="section">
            <div className="container" style={{
              height: 'auto',
              width: '50vh',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center', // This centers children horizontally in a flex column layout
                height: '100%'
              }}>
                <h1 className="header fade-in" style={{ textAlign: 'center', padding: '4vh' }}>
                  AKALA Dream Lifestyle Calculator
                </h1>
                <p className="paragraph fade-in" style={{ textAlign: 'center', color: '#ffffff', padding: '4vh' }}>
                  This lifestyle simulation is designed to help young people understand how much adulthood really costs.
                </p>
                <p className="paragraph fade-in" style={{ fontWeight: 'bold', textAlign: 'center', padding: '4vh' , color: '#ffd000', filter: 'drop-shadow(0px 0px 15px #ffb400)' }}>
                  Scroll down to proceed through the experience.
                </p>
                <ContinueButton onContinue={moveNext} />
              </div>
            </div>
          </div>


          <div className="section">
            <div className="container" style={{ height: '70vh', width: '90vh', backgroundImage: 'none', backdropFilter: 'none', border: 'none' }}>

              <h2 className="header fade-in" style={{ width: '100vh', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', lineHeight: '3vh', marginBottom: '3vh', filter: 'drop-shadow(0px 0px 15px #000000)', zIndex: 10000 }}>
                What city do you want to live in?
              </h2>    <div className='mapBorder'><MapboxCitySelector onSelectCity={(city) => handleChange('city', city)} />
              </div>
            </div>
            <div className='continueDiv'>
              <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>
            
          </div>
          <div className="section">
            <div className="container">
              <div className="container-header"> <FontAwesomeIcon className="icon fade-in" icon={faBaby} />

                <h2 className="header fade-in">How many kids do you want?</h2></div>
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
             <div className='continueDiv'>
              <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>
          </div>

          <div className="section">
            <div className="container">
              <div className="container-header">
                <FontAwesomeIcon className="icon fade-in" icon={faBed} />

                <h2 className="header fade-in" >How many bedrooms will your house have?</h2>
              </div>
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
              <div className='continueDiv'>
              <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>

          </div>
          <div className="section">
            <div className="container">
                <div className="container-header">

                  <FontAwesomeIcon className="icon fade-in"  icon={faHouse} />

                  <h2 className="header fade-in" >Do you plan on renting or purchasing your home?</h2>
                </div>
              <div className='input-container'>

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
            <div className='continueDiv'>
              <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>


          </div>

          <div className="section">
            <div className="container">
              <div className="container-header">

                <FontAwesomeIcon className="icon fade-in" icon={faUtensils} />

                <h2 className="header fade-in">How often do you plan on eating out per week?</h2>  </div>
                <div className="container-dining">     

              <div className='input-container'>
                <div className='button-container fade-in'>
                  <button onClick={() => handleChangeDebounced('diningOutFrequency', Math.max(0, lifestyle.diningOutFrequency + 1))}
                    aria-label="Increase dining out frequency">+</button>
                  <input className="fade-in"
                    type="number"
                    value={lifestyle.diningOutFrequency}
                    onChange={() => { }} // Disable typing
                    style={{ textAlign: 'center', fontSize: '6rem' }}
                    readOnly />
                  <button onClick={() => handleChangeDebounced('diningOutFrequency', lifestyle.diningOutFrequency - 1)}
                    aria-label="Decrease dining out frequency">-</button>
                </div>
              </div>
              <h3 className="header fade-in">Meal Price Level</h3>
              <div className='button-container fade-in'>
                {Object.entries(priceLevels).map(([symbol, level]) => (
                  <button key={symbol} onClick={() => handleChange('diningOutCostLevel', level)}
                    className={lifestyle.diningOutCostLevel === level ? 'selected' : ''}>
                    {symbol.toUpperCase()}
                  </button>
                ))}
              </div>
              </div>
            </div>
            <div className='continueDiv'>
            <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>    </div>

          <div className="section">
            <div className="container">   <div className="container-header">

              <FontAwesomeIcon className="icon fade-in"  icon={faCar} />

              <h2 className="header fade-in" >How many vehicles do you want?</h2>   </div>
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
            <div className='continueDiv'>
            <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>
          </div>

          <div className="section">
            <div className="container"> <div className="container-header">

              <FontAwesomeIcon className="icon fade-in"  icon={faCar} />

              <h2 className="header fade-in">What make of vehicle do you want to drive?</h2>       </div>
              <VehicleSelection selectedMake={lifestyle.vehicleMake} onSelect={(make) => handleChange('vehicleMake', make)} />
            </div>
            <div className='continueDiv'>
            <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>
          </div>
          <div className="section">
            <div className="container">              
              <div className="container-header">

              <FontAwesomeIcon className="icon fade-in"  icon={faCar} />

              <h2 className=" header fade-in" >Do you want to buy a New or Used Car?</h2>       </div>
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
            <div className='continueDiv'>
              <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>
          </div>
          <div className="section">
            <div className="container">              <div className="container-header">

              <FontAwesomeIcon className="icon fade-in"  icon={faSuitcase} />

              <h2 className=" header fade-in" >How often do you want to go on vacation each year?</h2>        </div>
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
              <div className='continueDiv'>
              <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>
          </div>
          <div className="section">
            <div className="container">              <div className="container-header">

              <FontAwesomeIcon className="icon fade-in"  icon={faSchool} />

              <h2 className=" header fade-in" >Do you want your kids to enroll in public or private school?</h2>      </div>
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

            <div className='continueDiv'>
            <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>
          </div>
          <div className="section">
            <div className="container">              <div className="container-header">

              <FontAwesomeIcon className="icon fade-in"  icon={faWheelchair} />

              <h2 className=" header fade-in" >What age do you want to retire?</h2>    </div>
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
              <div className='continueDiv'>
              <ScrollIndicator /><ContinueButton onContinue={moveNext} /></div>
          </div>
          <div className="section">
            <div className="container" style={{ left: '5%', height: '80vh', width: '130vh', padding: '4vh' }}>
              <div className="breakdown-container">
                {/* Left Column for Salary Calculation */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, marginRight: '20px' }}>

                  <p className="paragraph fade-in" style={{ textAlign: 'center', color: '#60a9fc', filter: 'drop-shadow(0px 0px 10px #000000)' }}>Required Salary: </p>
                  <h2 className="header fade-in" style={{ textAlign: 'center' }}>
                    <CountUp
                      key={`${prevSalary}-${currentSalary}`} // Corrected the use of template string
                      start={prevSalary}
                      end={currentSalary}
                      duration={1.5}
                      separator=","
                      decimals={0}
                      decimal="."
                      prefix="$"
                    />
                  </h2>
                  {showButton && (
                    <button onClick={handleCalculateClick} style={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
                      Show Breakdown
                    </button>
                  )}
                </div>

                {/* Right Column for Cost Breakdown */}
                {isVisible && (
                  <div className="cost-breakdown" style={{
                    flex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderLeft: '3px solid #ffffff54', // Add a gray border line to the left
                    paddingLeft: '20px' // Add some padding to separate text from the border
                  }}>
                    <h3>Cost Breakdown:</h3>
                    <Pie data={data} options={options} />

                    <table style={{ width: '150%', borderCollapse: 'separate', borderSpacing: '0 0px' }}> {/* Added borderSpacing for space between rows */}
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>Base living cost for one adult:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'middle', fontSize: '1.2rem', paddingRight: '40px' }}>{lifestyle.costBreakdown.baseLivingCost}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>Additional cost for a second parent:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'middle', fontSize: '1.2rem', paddingRight: '40px' }}>{lifestyle.costBreakdown.secondParentCost}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>Vehicle cost:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'middle', fontSize: '1.2rem', paddingRight: '40px' }}>{lifestyle.costBreakdown.vehicleCost}</td>
                          <td>
                            <TableRowWithAdjustment
                              itemLabel="Number of vehicles"
                              itemValue={lifestyle.vehicles}
                              onIncrease={() => handleChange('vehicles', lifestyle.vehicles + 1)}
                              onDecrease={() => handleChange('vehicles', Math.max(0, lifestyle.vehicles - 1))}
                            />

                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>Dining out costs per year:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'middle', fontSize: '1.2rem', paddingRight: '40px' }}>{lifestyle.costBreakdown.diningOutCost}</td>
                          <td>
                            <TableRowWithAdjustment
                              itemLabel="Meals out per week"
                              itemValue={lifestyle.diningOutFrequency}
                              onIncrease={() => handleChange('diningOutFrequency', lifestyle.diningOutFrequency + 1)}
                              onDecrease={() => handleChange('diningOutFrequency', Math.max(0, lifestyle.diningOutFrequency - 1))}
                            />
                          </td>

                        </tr>
                        <tr>
                          <td style={{ width: '200px', fontWeight: 'normal', verticalAlign: 'middle' }}>Housing cost:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'middle', fontSize: '1.2rem', paddingRight: '40px' }}>{lifestyle.costBreakdown.housingCost}</td>
                          <td> <TableRowWithAdjustment
                            itemLabel="Number of bedrooms"
                            itemValue={lifestyle.bedrooms}
                            onIncrease={() => handleChange('bedrooms', lifestyle.bedrooms + 1)}
                            onDecrease={() => handleChange('bedrooms', Math.max(0, lifestyle.bedrooms - 1))}
                          /></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>Cost for kids:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'middle', fontSize: '1.2rem', paddingRight: '40px' }}>{lifestyle.costBreakdown.kidsCost}</td>
                          <td> <TableRowWithAdjustment
                            itemLabel="Number of kids"
                            itemValue={lifestyle.kids}
                            onIncrease={() => handleChange('kids', lifestyle.kids + 1)}
                            onDecrease={() => handleChange('kids', Math.max(0, lifestyle.kids - 1))}
                          /></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>Vacation costs per year:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'middle', fontSize: '1.2rem', paddingRight: '40px' }}>{lifestyle.costBreakdown.vacationCost}</td>
                          <td> <TableRowWithAdjustment
                            itemLabel="Vacations per year"
                            itemValue={lifestyle.vacationsPerYear}
                            onIncrease={() => handleChange('vacationsPerYear', lifestyle.vacationsPerYear + 1)}
                            onDecrease={() => handleChange('vacationsPerYear', Math.max(0, lifestyle.vacationsPerYear - 1))}
                          /></td>

                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'normal', verticalAlign: 'middle' }}>Annual retirement savings:</td>
                          <td style={{ textAlign: 'right', verticalAlign: 'middle', fontSize: '1.2rem', paddingRight: '40px' }}>{lifestyle.costBreakdown.annualRetirementSavings}</td>
                          <td><TableRowWithAdjustment
                            itemLabel="Retirement Age"
                            itemValue={lifestyle.retirementAge}
                            onIncrease={() => handleChangeDebounced('retirementAge', lifestyle.retirementAge + 1)}
                            onDecrease={() => handleChangeDebounced('retirementAge', Math.max(0, lifestyle.retirementAge - 1))}
                          /></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'bold', verticalAlign: 'middle', fontSize: '1rem' }}>Total required annual salary:</td>
                          <td style={{ fontWeight: 'bold', textAlign: 'right', verticalAlign: 'middle', fontSize: '1.6rem', paddingRight: '40px' }}>{lifestyle.costBreakdown.totalRequiredSalary}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            {/*  <ContinueButton onContinue={moveNext} />
              <ScrollIndicator// /> */}
          </div>

        </div>
      </div>

    </>
  );
}

export default App;
