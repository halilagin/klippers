import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '@/pages/Login';
import DocumentUpload from '@/pages/DocumentUpload';

import PublicLayout from '@/layouts/PublicLayout';


import PrepareSignerTemplateMain from './pages/prepare_signer_template/PrepareSignerTemplateMain';
import Subscription from './pages/subscription';

import LandPage from './components/LandPage';
import ManageSubscription from './pages/profile/ManageSubscription';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

import Klippers from './pages/Klippers';
import KlippersLogin from './pages/KlippersLogin';
import KlippersPricing from './pages/KlippersPricing';
import KlippersDashboard from './pages/KlippersDashboard';
import KlippersShorts from './pages/KlippersShorts';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Klippers/>} />
     
      
        <Route path="/login" element={<Login />} />
      

        <Route path="/subscription" element={<Subscription />} />
        <Route path="/subscriptions" element={<ManageSubscription />} />

        {/* Individual Routes */}
        <Route path="/document-upload" element={<DocumentUpload />} />
        <Route path="/prepare-sign-document" element={<PrepareSignerTemplateMain />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/landpage" element={
          <PublicLayout>
            <LandPage />
          </PublicLayout>
        } />
        <Route path="/klippers" element={<Klippers />} />
        <Route path="/klippers-login" element={<KlippersLogin />} />
        <Route path="/klippers-pricing" element={<KlippersPricing />} />
        <Route path="/klippers-dashboard" element={<KlippersDashboard />} />
        <Route path="/klippers-shorts" element={<KlippersShorts />} />
      </Routes>
    </Router>
  );
}

export default App;
