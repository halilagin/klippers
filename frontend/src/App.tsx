import React from 'react';
import SignPdfView from '@/pages/SignPdfView'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import DocumentUpload from '@/pages/DocumentUpload';

import PublicLayout from '@/layouts/PublicLayout';
import EditDocument from '@/pages/EditDocument';
import AddSigners from '@/pages/AddSigners';
import Schedule from '@/pages/Schedule';
import Preview from '@/pages/Preview';
import BerfinTest from '@/pages/BerfinTest';
import SignerSigningMain from './pages/signer_signing/SignerSigningMain';
import PrepareSignerTemplateMain from './pages/prepare_signer_template/PrepareSignerTemplateMain';
import Subscription from './pages/subscription';
import SignedPdfView from './pages/signed_pdf_view/SignedPdfView';
import LandPage from './components/LandPage';
import ManageSubscription from './pages/profile/ManageSubscription';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Templates from './pages/Templates';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicLayout>
            <LandPage />
          </PublicLayout>
        } />
     
        <Route path="/login" element={<Login />} />
        <Route path="/signer-signing" element={<SignerSigningMain />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/subscriptions" element={<ManageSubscription />} />
        <Route path="/signed-pdf-view" element={<SignedPdfView />} />
        {/* Dashboard Layout Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="document-upload" element={<DocumentUpload />} />
          <Route path="edit-document" element={<EditDocument />} />
          <Route path="add-signers" element={<AddSigners />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="preview" element={<Preview />} />
          <Route path="sign-pdf" element={<SignPdfView onDone={() => {}} />} />
          <Route path="berfin-test" element={<BerfinTest />} />
          <Route path="prepare-sign-document" element={<PrepareSignerTemplateMain />} />
          <Route path="templates" element={<Templates />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/landpage" element={<LandPage />} />
      </Routes>
    </Router>
  );
}

export default App;
