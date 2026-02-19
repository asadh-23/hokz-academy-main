import React from 'react';

export const StatsSection = () => {
  const stats = [
    {
      id: 1,
      label: 'Total Active Users',
      value: '120k+',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: '#14C4E7', // Cyan
    },
    {
      id: 2,
      label: 'Expert Mentors',
      value: '2.4k+',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: '#1E2EDE', // Blue
    },
    {
      id: 3,
      label: 'Premium Courses',
      value: '850+',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: '#E6D929', // Yellow
    },
    {
      id: 4,
      label: 'Success Stories',
      value: '95%',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#1E2EDE', // Blue
    },
  ];

  return (
    <section className="py-20 bg-[#FDFDFD] relative overflow-hidden">
      {/* Subtle Background Accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="group relative bg-[#FDFDFD] p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Card Corner Accent */}
              <div 
                className="absolute top-0 right-0 w-16 h-16 opacity-10 rounded-tr-[2rem] transition-opacity group-hover:opacity-20"
                style={{ backgroundColor: stat.color }}
              ></div>

              <div className="flex flex-col items-center text-center">
                {/* Icon Container */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 shadow-lg shadow-black/5"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  {stat.icon}
                </div>

                {/* Value */}
                <h3 className="text-4xl lg:text-5xl font-black text-[#1E2EDE] tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-500">
                  {stat.value}
                </h3>

                {/* Label */}
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
                
                {/* Bottom Bar Decor */}
                <div 
                  className="w-0 h-1 mt-6 rounded-full transition-all duration-500 group-hover:w-12"
                  style={{ backgroundColor: stat.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action Subtext */}
        <div className="mt-16 text-center animate-pulse">
          <p className="text-slate-400 text-sm font-medium">
            Join thousands of others starting their journey today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;