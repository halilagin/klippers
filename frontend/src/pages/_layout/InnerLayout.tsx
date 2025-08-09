import React from 'react';
import { Outlet } from 'react-router-dom';
import InnerNavbar from '@/components/InnerNavbar';

const InnerLayout: React.FC = () => {
  return (
    <div>
      {/* Inner layout - for authenticated pages */}
      <header>
        {/* Add navigation, user menu, etc. for authenticated pages */}
        <nav>
          {/* Authenticated navigation items */}
          <InnerNavbar />
          <div>
            {/* User profile, logout, etc. */}
          </div>
        </nav>
      </header>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default InnerLayout;
