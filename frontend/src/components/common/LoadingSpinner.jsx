import React from 'react';

/**
 * Custom Keyframes (To be added to your global CSS or Tailwind config if possible)
 * @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
 * @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
 */

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  showText = true,
  variant = 'default'
}) => {
  // Enhanced Size configurations
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  const textSizes = {
    small: 'text-[10px] uppercase tracking-wider',
    medium: 'text-sm font-medium',
    large: 'text-base font-semibold tracking-tight',
    xlarge: 'text-lg font-bold tracking-tight'
  };

  // Modernized Gradient spinner component
  const GradientSpinner = ({ size }) => (
    <div className={`${sizeClasses[size]} relative group`}>
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 blur-sm opacity-40 animate-pulse"></div>
      
      {/* Rotating Conic Ring */}
      <div className="absolute inset-0 rounded-full p-[3px] animate-spin bg-gradient-to-tr from-emerald-500 via-transparent to-cyan-500">
        <div className="w-full h-full bg-white rounded-full"></div>
      </div>
      
      {/* Center Logo Dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/4 h-1/4 bg-gradient-to-tr from-emerald-600 to-cyan-600 rounded-sm rotate-45 animate-pulse"></div>
      </div>
    </div>
  );

  // Modernized Dots spinner
  const DotsSpinner = () => (
    <div className="flex space-x-1.5 items-center">
      {[0, 0.1, 0.2].map((delay, i) => (
        <div 
          key={i}
          className="w-2 h-2 bg-emerald-500 rounded-full opacity-80"
          style={{ 
            animation: `bounce 1.4s infinite ease-in-out both`,
            animationDelay: `${delay}s` 
          }}
        ></div>
      ))}
    </div>
  );

  const SpinnerComponent = () => {
    if (variant === 'gradient') {
      return <GradientSpinner size={size} />;
    }
    
    return (
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-[3px] border-emerald-100 rounded-full"></div>
        <div className={`absolute inset-0 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin`}></div>
      </div>
    );
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Main Spinner with optional floating animation */}
      <div className={`${size === 'xlarge' ? 'animate-[float_3s_infinite_ease-in-out]' : ''} relative`}>
        <SpinnerComponent />
      </div>

      {/* Loading text and branding integration */}
      {showText && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center">
            {size === 'xlarge' && (
               <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.3em] mb-1">
                 Hokz Academy
               </span>
            )}
            <p className={`${textSizes[size]} text-slate-700`}>
              {text}
            </p>
          </div>
          
          {(size === 'large' || size === 'xlarge') && (
            <div className="mt-2">
               <DotsSpinner />
            </div>
          )}
        </div>
      )}

      {/* Decorative particles for xlarge */}
      {size === 'xlarge' && (
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-50 rounded-full blur-3xl opacity-60"></div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
        {/* Subtle mesh background effect */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0)`, backgroundSize: '24px 24px' }}></div>
        <div className="relative p-12 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-2xl shadow-emerald-100/50">
          {content}
          
          {/* Bottom Progress Bar (Visual Only) */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-50 overflow-hidden rounded-b-3xl">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-1/3 animate-[shimmer_2s_infinite_ease-in-out]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative">
        {content}
      </div>
    </div>
  );
};

// Preset loading components with improved UI
export const PageLoader = ({ text = "Setting up your workspace..." }) => (
  <LoadingSpinner 
    size="xlarge" 
    text={text} 
    fullScreen={true} 
    variant="gradient"
  />
);

export const ComponentLoader = ({ text = "Fetching content..." }) => (
  <div className="w-full py-12 px-4 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200">
    <LoadingSpinner 
      size="large" 
      text={text} 
      variant="default"
    />
  </div>
);

export const ButtonLoader = ({ text = "Processing..." }) => (
  <div className="flex items-center justify-center">
    <LoadingSpinner 
      size="small" 
      text={text} 
      showText={false}
      variant="default"
    />
  </div>
);

export const InlineLoader = ({ text = "Loading..." }) => (
  <div className="inline-flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
    <LoadingSpinner 
      size="small" 
      showText={false}
      variant="gradient"
    />
    <span className="text-xs font-semibold text-slate-600 tracking-tight">{text}</span>
  </div>
);

export default LoadingSpinner;