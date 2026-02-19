import React from 'react';

export const TutorLoginSection = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-[#FDFDFD]">
      {/* Decorative Cyan and Blue Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#14C4E7]/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#1E2EDE]/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#1E2EDE] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row items-stretch">
          
          {/* Content Side */}
          <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 w-fit px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#E6D929] animate-pulse"></span>
              <span className="text-[#FDFDFD] text-xs font-bold tracking-widest uppercase">Instructor Gateway</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FDFDFD] leading-tight tracking-tight">
              Share Your Vision with <br />
              <span className="text-[#E6D929]">Hokz Academy</span>
            </h2>
            
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg">
              Elevate your teaching career by joining a global network of specialized experts. We provide the sophisticated tools you need to inspire and lead.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div className="group">
                <div className="w-12 h-12 rounded-2xl bg-[#14C4E7] flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                  <svg className="w-6 h-6 text-[#1E2EDE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-[#FDFDFD] font-bold text-lg">Instant Deployment</h4>
                <p className="text-white/50 text-sm mt-1">Publish your modules globally in minutes.</p>
              </div>

              <div className="group">
                <div className="w-12 h-12 rounded-2xl bg-[#E6D929] flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                  <svg className="w-6 h-6 text-[#1E2EDE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-[#FDFDFD] font-bold text-lg">Direct Royalties</h4>
                <p className="text-white/50 text-sm mt-1">Transparent earnings with weekly payouts.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-10 py-4 bg-[#E6D929] hover:bg-[#d4c825] text-[#1E2EDE] font-black rounded-2xl transition-all shadow-lg shadow-[#E6D929]/20 flex items-center justify-center gap-2 group">
                Join our Faculty
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button className="px-10 py-4 bg-transparent hover:bg-white/5 text-[#FDFDFD] border-2 border-white/20 font-bold rounded-2xl transition-all flex items-center justify-center">
                Faculty Portal
              </button>
            </div>
          </div>

          {/* Image/Visual Side */}
          <div className="lg:w-[40%] bg-[#14C4E7] relative min-h-[400px] flex items-center justify-center">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#1E2EDE 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 p-12">
              <div className="relative group">
                {/* Decorative Frame */}
                <div className="absolute -inset-4 bg-[#E6D929] rounded-3xl rotate-3 transition-transform group-hover:rotate-6 duration-500"></div>
                <div className="relative bg-[#FDFDFD] p-1 rounded-2xl shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800" 
                    alt="Professional Educator"
                    className="rounded-xl object-cover w-full h-[350px]"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[#1E2EDE]/90 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#FDFDFD] font-bold text-sm">Prof. Adrian Hokz</p>
                        <p className="text-[#14C4E7] text-[10px] font-medium uppercase tracking-widest">Master of Sciences</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        <span className="text-white/60 text-[10px]">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Badge */}
              <div className="absolute -bottom-6 -right-2 bg-[#FDFDFD] p-5 rounded-2xl shadow-xl border border-[#14C4E7]/20 flex flex-col items-center">
                <span className="text-[#1E2EDE] text-2xl font-black">98%</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase whitespace-nowrap tracking-tighter">Retention Rate</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TutorLoginSection;