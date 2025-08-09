import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landingpage/LandginPage';
import Dashboard from '@/pages/dashboard/Dashboard';
import OuterLayout from './pages/_layout/OuterLayout';
import InnerLayout from './pages/_layout/InnerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import OuterLoginLayout from './pages/_layout/OuterLoginLayout';
import KlippersShorts from './pages/KlippersShorts';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with OuterLayout */}
        <Route path="/" element={<OuterLayout />}>
          <Route index element={<LandingPage />} />
          {/* Add more public routes here as needed */}
        </Route>
        <Route path="/login" element={<OuterLoginLayout />} >
          <Route index element={<LoginPage />} />   
        </Route>
        
        

        {/* Protected routes with InnerLayout */}
        <Route
          path="/in"
          element={
            <ProtectedRoute>
              <InnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-shorts" element={<KlippersShorts />} />
          {/* Add more protected routes here as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
