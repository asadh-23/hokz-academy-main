import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      {/* Shared Header */}
      <Header />

      {/* Main Content Area */}
      {/* pt-20 matches the h-20 height of the fixed header */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;