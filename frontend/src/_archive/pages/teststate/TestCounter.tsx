import React, { useState } from 'react';
import useBerfinState from './state/BerfinState';

const TestCounter = () => {
    const berfinState = useBerfinState();
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1)
    berfinState.setCount(count + 1)
  };

  const decrement = () => {
     setCount(count - 1)
     berfinState.setCount(count - 1)

  };
  const reset = () => {
    setCount(0);
    berfinState.setCount(0)
    
}

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Counter</h2>
      <p>Current Count: {count}</p>
      <div style={{ gap: '10px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
};

export default TestCounter;
