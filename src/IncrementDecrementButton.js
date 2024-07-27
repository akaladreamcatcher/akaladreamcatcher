// IncrementDecrementButton.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { incrementField, decrementField } from './lifestyleSlice';

const IncrementDecrementButton = ({ field }) => {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(incrementField({ field }));
  };

  const handleDecrement = () => {
    dispatch(decrementField({ field }));
  };

  return (
    <div className='button-container'>
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement} disabled={lifestyle[field] <= 0}>-</button>
    </div>
  );
};

export default IncrementDecrementButton;
