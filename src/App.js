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
import { faHouse, faBaby, faBed, faUtensils, faCar, faSuitcase, faSchool, faWheelchair } from '@fortawesome/free-solid-svg-icons';






import fullpage from 'fullpage.js';
import 'fullpage.js/dist/fullpage.css';
import CountUp from 'react-countup';


import MapboxCitySelector from './MapboxCitySelector'; // Import the MapboxCitySelector component

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const withDelay = (Component, delayTime) => {
  return (props) => {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsShown(true);
      }, delayTime);

      return () => clearTimeout(timer);
    }, [delayTime]);

    return isShown ? <Component {...props} /> : null;
  };
};

const DelayedThreeScene = withDelay(ThreeScene, 5000);


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
      navigationPosition: 'left',

      scrollHorizontally: true,
      loopBottom: false,
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

  const moveFirst = () => {
    // Assuming the first section is indexed as 1
    fullpageInstanceRef.current.moveTo(1);
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
       display: false, // Place legend on the right side of the chart


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
        backgroundColor: 'transparent', // Light orange background
        color: '#00000055', // Dark text color for contrast
        border: '1px solid #ffffff33',
        borderRadius: '5px',
        padding: '4px 10px',
        cursor: 'none',
        margin: '0 5px',
        fontSize: '24px',
        height: '3vh',
      }}
    >
      {label}
    </button>
  );

  const TableRowWithAdjustment = ({ itemLabel, itemValue, onIncrease, onDecrease }) => (
    <tr style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
      <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <AdjustmentButton label="-" onClick={onDecrease} />
          <span style={{ width: '10px', fontSize: '1.2rem', textAlign: 'center', margin: '0 10px', display: 'flex', justifyContent: 'center' }}>{itemValue}</span>
          <AdjustmentButton label="+" onClick={onIncrease} />
        </div>
      </td>
      <td style={{ fontWeight: 'normal', color: '#ffffffab', verticalAlign: 'middle', textAlign: 'right', paddingTop: '1vh', width: '150px' }}>{itemLabel}</td>

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
        ></div><DelayedThreeScene currentSection={currentSection} numberOfKids={lifestyle.kids} numberOfCars={lifestyle.vehicles} numberOfhouses={lifestyle.bedrooms} />
        </div>

        <div ref={fullpageRef}>

          <div className="section">
            <div className="container" style={{
              height: 'auto', padding: '3vh',   width: '75vw'}}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center', // This centers children horizontally in a flex column layout
                height: '100%',
              

              }}>
                <h1 className="header fade-in" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0', }}>
                  The Dreamcatcher <span style={{fontSize: '1.4rem', opacity: '0.5'}}>Created by AKALA</span>
                </h1>
                <p className="paragraph fade-in" style={{ textAlign: 'center', color: '#ffffff', padding: '4vh', marginBottom: '0' }}>
                  This lifestyle simulation is designed to help young people understand how much adulthood really costs. The calculation is not exact, but based on national averages.
                </p>
                <p className="paragraph fade-in" style={{ fontWeight: 'normal', textAlign: 'center', padding: '4vh' , color: '#ffd000', filter: 'drop-shadow(0px 0px 10px #fff)' }}>
                  Scroll down to proceed through the experience.
                </p>
                <ContinueButton onContinue={moveNext} />
              </div>
            </div>
          </div>


          <div className="section" style={{    overflow: 'hidden'}}>
            <div className="container" style={{ height: '100vh', width: '90vw', backgroundImage: 'none', backdropFilter: 'none', border: 'none' }}>

              <h2 className="header fade-in" style={{ width: '90vw', position: 'absolute', top: '3vh', left: '50%', transform: 'translateX(-50%)', lineHeight: '3vh', marginTop: '3vh', filter: 'drop-shadow(0px 0px 15px #000000)', zIndex: 10000 }}>
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
                <div className="container-dining fade-in">     


                <div className='button-container' style= {{alignItems: 'center', height: 'auto'}}>
                <h3 className="header">Weekly Meals</h3>

                  <button onClick={() => handleChangeDebounced('diningOutFrequency', Math.max(0, lifestyle.diningOutFrequency + 1))}
                    aria-label="Increase dining out frequency">+</button>
                  <input 
                    type="number"
                    value={lifestyle.diningOutFrequency}
                    onChange={() => { }} // Disable typing
                    style={{ textAlign: 'center', fontSize: '6rem' }}
                    readOnly />
                  <button onClick={() => handleChangeDebounced('diningOutFrequency', lifestyle.diningOutFrequency - 1)}
                    aria-label="Decrease dining out frequency">-</button>
                </div>
              <div className='button-container'>
              <h3 className="header">Meal Price Level</h3>

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

              <h2 className=" header fade-in" >Do you plan to purchase new or used vehicles?</h2>       </div>
              <div className='input-container'>
              <div className='button-container fade-in'>
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
            <div className="container" style={{height: '70vh', width: '90vw', marginTop: '20vh'}}>
              <div className="breakdown-container" style={{ display: 'flex',overflowY:'visible',  flexDirection: 'column', justifyContent: 'center', flex: '1'}}>
                {/* Left Column for Salary Calculation */}
                <div className='breakdownTitleOuter'>
                <div className='breakdownTitle'>

                  <p className="paragraph fade-in" style={{ textAlign: 'center', color: '#ffffff' }}>Required Salary: </p>
                  <h2 className="breakdownHeader fade-in" style={{ textAlign: 'center' }}>
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
                  </div>

                  {showButton && (
                    <button onClick={handleCalculateClick} style={{ whiteSpace: 'normal', lineHeight: '1rem', height: '8vh', fontSize: '1rem', width: '80%', padding: '10px 20px' }}>
                      Show Breakdown
                    </button>
                  )}
                </div>


                {/* Right Column for Cost Breakdown */}
                {isVisible && (
                  <div className="cost-breakdown">
                    <Pie data={data} options={options} />
                    <p className='costBreakdown'>Cost Breakdown:</p>


                    <table style={{ display: 'flex', borderCollapse: 'separate', borderSpacing: '0 0px' }}> {/* Added borderSpacing for space between rows */}
                      <tbody>
                        <tr className='breakdownItem'>
                        <td className='breakdownDescribe'><td className='tdLabel'>Base living cost for one adult:</td>
                          <td className='tdNumber'>{lifestyle.costBreakdown.baseLivingCost}</td></td>
                        </tr>
                        <tr className='breakdownItem'>
                        <td className='breakdownDescribe'><td className='tdLabel'>Additional cost for a second parent:</td>
                          <td className='tdNumber'>{lifestyle.costBreakdown.secondParentCost}</td></td>
                        </tr>
                        <tr className='breakdownItem'>
                        <td className='breakdownDescribe'><td className='tdLabel'>Vehicle cost:</td>
                          <td className='tdNumber'>{lifestyle.costBreakdown.vehicleCost}</td></td>
                          <td className='tdAdjust'>
                            <TableRowWithAdjustment
                              itemLabel="Number of vehicles"
                              itemValue={lifestyle.vehicles}
                              onIncrease={() => handleChange('vehicles', lifestyle.vehicles + 1)}
                              onDecrease={() => handleChange('vehicles', Math.max(0, lifestyle.vehicles - 1))}
                            />

                          </td>
                        </tr>
                        <tr className='breakdownItem'>
                        <td className='breakdownDescribe'><td className='tdLabel'>Dining out costs per year:</td>
                          <td className='tdNumber'>{lifestyle.costBreakdown.diningOutCost}</td></td>
                          <td className='tdAdjust'>
                            <TableRowWithAdjustment
                              itemLabel="Meals out per week"
                              itemValue={lifestyle.diningOutFrequency}
                              onIncrease={() => handleChange('diningOutFrequency', lifestyle.diningOutFrequency + 1)}
                              onDecrease={() => handleChange('diningOutFrequency', Math.max(0, lifestyle.diningOutFrequency - 1))}
                            />
                          </td>

                        </tr>
                        <tr className='breakdownItem'>
                        <td className='breakdownDescribe'><td className='tdLabel'>Housing cost:</td>
                          <td className='tdNumber'>{lifestyle.costBreakdown.housingCost}</td></td>
                          <td className='tdAdjust'>
                          <TableRowWithAdjustment
                            itemLabel="Number of bedrooms"
                            itemValue={lifestyle.bedrooms}
                            onIncrease={() => handleChange('bedrooms', lifestyle.bedrooms + 1)}
                            onDecrease={() => handleChange('bedrooms', Math.max(0, lifestyle.bedrooms - 1))}
                          /></td>
                        </tr>
                        <tr className='breakdownItem'>
                        <td className='breakdownDescribe'><td className='tdLabel'>Cost for kids:</td>
                          <td className='tdNumber'>{lifestyle.costBreakdown.kidsCost}</td></td>
                          <td className='tdAdjust'>
                          <TableRowWithAdjustment
                            itemLabel="Number of kids"
                            itemValue={lifestyle.kids}
                            onIncrease={() => handleChange('kids', lifestyle.kids + 1)}
                            onDecrease={() => handleChange('kids', Math.max(0, lifestyle.kids - 1))}
                          /></td>
                        </tr>
                        <tr className='breakdownItem'>
                        <td className='breakdownDescribe'><td className='tdLabel'>Vacation costs per year:</td>
                          <td className='tdNumber'>{lifestyle.costBreakdown.vacationCost}</td></td>
                          <td className='tdAdjust'>
                          <TableRowWithAdjustment
                            itemLabel="Vacations per year"
                            itemValue={lifestyle.vacationsPerYear}
                            onIncrease={() => handleChange('vacationsPerYear', lifestyle.vacationsPerYear + 1)}
                            onDecrease={() => handleChange('vacationsPerYear', Math.max(0, lifestyle.vacationsPerYear - 1))}
                          /></td>

                        </tr>
                        <tr className='breakdownItem'>
                        <td className='breakdownDescribe'><td className='tdLabel'>Annual retirement savings:</td>
                          <td className='tdNumber'>{lifestyle.costBreakdown.annualRetirementSavings}</td></td>
                          <td className='tdAdjust'>
                          <TableRowWithAdjustment
                            itemLabel="Retirement Age"
                            itemValue={lifestyle.retirementAge}
                            onIncrease={() => handleChangeDebounced('retirementAge', lifestyle.retirementAge + 1)}
                            onDecrease={() => handleChangeDebounced('retirementAge', Math.max(0, lifestyle.retirementAge - 1))}
                          /></td>
                        </tr>
                        
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className='continueDiv'>
          <ContinueButton
        onContinue={moveFirst}
        buttonText="Restart your journey"
        buttonStyle={{ width: '100vw', marginTop: '5vh' }}
      />
    </div>
          
          </div>

        </div>
      </div>

    </>
  );
}

export default App;
