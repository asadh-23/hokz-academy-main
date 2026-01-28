import React from 'react';

const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Instructor Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your real-time performance summary.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;