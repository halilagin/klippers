import React, { useState } from 'react';
import TestCounter from './TestCounter';
import TestTabPage from './TestTabPage';

const TestStatePage = () => {
  

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
     <TestCounter />
     <TestTabPage />
    </div>
  );
};

export default TestStatePage;
