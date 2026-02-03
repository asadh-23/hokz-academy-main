import React from 'react';

const TutorStatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Tutors */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11S11 10.1 11 9V7.5L5 7V9C5 10.1 4.1 11 3 11S1 10.1 1 9V7C1 6.4 1.4 6 2 6H22C22.6 6 23 6.4 23 7V9C23 10.1 22.1 11 21 11S19 10.1 19 9ZM16 12C16.6 12 17 12.4 17 13V22H15V13C15 12.4 15.4 12 16 12ZM8 12C8.6 12 9 12.4 9 13V22H7V13C7 12.4 7.4 12 8 12Z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
            <p className="text-gray-600 text-sm">Total Tutors</p>
          </div>
        </div>
      </div>

      {/* Active Tutors */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.active}</h3>
            <p className="text-gray-600 text-sm">Active Tutors</p>
          </div>
        </div>
      </div>

      {/* Blocked Tutors */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13l-1.41 1.41L12 13.41l-3.59 3.59L7 15l3.59-3.59L7 7.83 8.41 6.41 12 10l3.59-3.59L17 7.83l-3.59 3.58L17 15z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.blocked}</h3>
            <p className="text-gray-600 text-sm">Blocked Tutors</p>
          </div>
        </div>
      </div>

      {/* Inactive Tutors */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1010 10A10.01 10.01 0 0012 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{stats.inactive}</h3>
            <p className="text-gray-600 text-sm">Inactive Tutors</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorStatsCards;