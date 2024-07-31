import { createSlice } from '@reduxjs/toolkit';
import { carPrices, medianRentPrices, medianPurchasePrices } from './data';

const initialState = {
  kids: 0,
  city: 'Chicago',
  vehicles: 0,
  vehicleMake: 'Ford',
  vehicleCondition: 'new', // new or used
  vacationsPerYear: 0,
  diningOutFrequency: 0,
  diningOutCostLevel: 'low', // can be 'low', 'medium', or 'high'

  schoolType: 'public',
  retirementAge: 65,
  bedrooms: 1,
  housingPreference: 'rent', // rent or purchase
  requiredSalary: 0,
  costBreakdown: {}  // This will store the breakdown details

};

function calculateMortgage(principal, years, rate) {
  const monthlyRate = rate / 100 / 12;
  const payments = years * 12;
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -payments));
}

function estimateAnnualRetirementSavings(livingCost, currentAge, retirementAge, retirementYears, rateOfReturn) {
  const n = retirementAge - currentAge; // years until retirement
  const futureLivingCost = livingCost * Math.pow(1 + rateOfReturn, n);
  const retirementFundNeeded = futureLivingCost * retirementYears / (1 - Math.pow(1 + rateOfReturn, -retirementYears));
  const annualRetirementSavings = retirementFundNeeded / ((Math.pow(1 + rateOfReturn, n) - 1) / rateOfReturn);
  return annualRetirementSavings;
}

export const lifestyleSlice = createSlice({
  name: 'lifestyle',
  initialState,
  reducers: {
    setField: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    calculateSalary: (state) => {
      const currentAge = 20; // Assume current age is 30 for calculation
      const retirementYears = 85 - state.retirementAge; // years of retirement
      const rateOfReturn = 0.05; // 5% annual rate of return
      const workingYears = state.retirementAge - currentAge; // Total working years left

      let baseCost = 50000; // Base cost of living for one adult
      baseCost += 25000; // Additional base cost for a second parent

      let vehicleCost = 0;
      const carPrice = carPrices.find(car => car.make === state.vehicleMake);
      if (carPrice) {
        vehicleCost = (state.vehicleCondition === 'new' ? carPrice.new : carPrice.used) * state.vehicles;
        const annualVehicleCost = vehicleCost / workingYears;
        baseCost += annualVehicleCost;
        state.costBreakdown.vehicleCost = `$${Math.round(annualVehicleCost).toLocaleString()}`;
      } else {
        state.costBreakdown.vehicleCost = '$0';
      }

      let housingCost = 0;
      const cityPrices = state.housingPreference === 'rent' ? medianRentPrices[state.city] : medianPurchasePrices[state.city];
      if (cityPrices && cityPrices[`${state.bedrooms}br`]) {
        housingCost = state.housingPreference === 'rent'
          ? cityPrices[`${state.bedrooms}br`] * 12
          : calculateMortgage(cityPrices[`${state.bedrooms}br`], 30, 3.5) * 12;
        baseCost += housingCost;
      }

      const kidsCost = state.kids * (10000 + (state.schoolType === 'private' ? 15000 : 2000));
      baseCost += kidsCost;

      const vacationCost = state.vacationsPerYear * 3000;
      baseCost += vacationCost;

      const costPerMeal = {
        low: 10,
        medium: 20,
        high: 30
      };
    
      const diningOutCost = state.diningOutFrequency * costPerMeal[state.diningOutCostLevel] * 52; // 52 weeks in a year
    
      baseCost += diningOutCost;
    
      // update state.requiredSalary and state.costBreakdown as before, adding diningOutCost to the breakdown:
      state.costBreakdown.diningOutCost = `$${Math.round(diningOutCost).toLocaleString()}`;
    

      const requiredAnnualSalary = baseCost;
      const annualRetirementSavings = estimateAnnualRetirementSavings(requiredAnnualSalary, currentAge, state.retirementAge, retirementYears, rateOfReturn) / workingYears;
      state.requiredSalary = requiredAnnualSalary + annualRetirementSavings;

      state.costBreakdown = {
        baseLivingCost: `$50,000`,  // Example value remains the same
        secondParentCost: `$25,000`,
        vehicleCost: state.costBreakdown.vehicleCost,  // Use annual vehicle cost in the breakdown
        housingCost: `$${Math.round(housingCost).toLocaleString()}`,
        kidsCost: state.kids > 0 ? `$${Math.round(kidsCost).toLocaleString()}` : '$0',
        vacationCost: `$${Math.round(vacationCost).toLocaleString()}`,
        diningOutCost: `$${Math.round(diningOutCost).toLocaleString()}`,  // Adding dining out cost to the breakdown

        annualRetirementSavings: `$${Math.round(annualRetirementSavings).toLocaleString()}`,
        totalRequiredSalary: `$${Math.round(state.requiredSalary).toLocaleString()}`
      };



      console.log(`Detailed Calculation:
        - Base cost of living for one adult: $50,000
        - Additional cost for a second parent: $25,000
        - Vehicle (${state.vehicles} x ${state.vehicleMake}, ${state.vehicleCondition}): $${Math.round(vehicleCost / workingYears).toLocaleString()} per year
        - Housing (${state.bedrooms} bedrooms in ${state.city}, ${state.housingPreference}): $${housingCost}
        - Cost for ${state.kids} kids (School type: ${state.schoolType}): $${kidsCost}
        - Vacation costs per year: $${vacationCost}
        - Dining out costs per year: $${diningOutCost}  // Display dining out costs

        - Annual retirement savings needed (spread over ${workingYears} years): $${annualRetirementSavings.toFixed(2)}
        - Total required annual salary including retirement savings: $${state.requiredSalary.toLocaleString()}`);
    }
  }
});

export const { setField, calculateSalary } = lifestyleSlice.actions;

export default lifestyleSlice.reducer;
