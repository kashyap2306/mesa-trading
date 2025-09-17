import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useDarkMode } from '../contexts/DarkModeContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { getThemeClasses } = useDarkMode();
  const theme = getThemeClasses();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen ${theme.background}`}>
      {/* Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="pt-16"> {/* Account for fixed navbar */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;