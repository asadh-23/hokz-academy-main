import React from 'react';

const StudentStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Students */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2v-.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V18h2v-7.5c0-1.93-1.57-3.5-3.5-3.5S12 8.57 12 10.5V11h-2v-.5c0-1.93-1.57-3.5-3.5-3.5S3 8.57 3 10.5V18h1z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
            <p className="text-gray-600 text-sm">Total Students</p>
          </div>
        </div>
      </div>

      {/* Active Students */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.active}</h3>
            <p className="text-gray-600 text-sm">Active Students</p>
          </div>
        </div>
      </div>

      {/* Blocked Students */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13l-1.41 1.41L12 13.41l-3.59 3.59L7 15l3.59-3.59L7 7.83 8.41 6.41 12 10l3.59-3.59L17 7.83l-3.59 3.58L17 15z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.blocked}</h3>
            <p className="text-gray-600 text-sm">Blocked Students</p>
          </div>
        </div>
      </div>

      {/* Inactive Students */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1010 10A10.01 10.01 0 0012 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.inactive}</h3>
            <p className="text-gray-600 text-sm">Inactive Students</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStatsCards;
