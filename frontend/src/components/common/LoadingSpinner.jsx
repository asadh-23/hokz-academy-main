import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  showText = true,
  variant = 'default'
}) => {
  // Size configurations
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  // Gradient spinner component
  const GradientSpinner = ({ size }) => (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Outer rotating ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-500 to-cyan-400 animate-spin">
        <div className="absolute inset-1 rounded-full bg-white"></div>
      </div>
      
      {/* Inner pulsing dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  // Multiple dots spinner
  const DotsSpinner = () => (
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  const SpinnerComponent = () => {
    if (variant === 'gradient') {
      return <GradientSpinner size={size} />;
    }
    
    return (
      <div className={`${sizeClasses[size]} border-4 border-emerald-500 border-t-transparent rounded-full animate-spin`}></div>
    );
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Main Spinner */}
      <div className="relative">
        <SpinnerComponent />
      </div>

      {/* Additional animated elements for large sizes */}
      {(size === 'large' || size === 'xlarge') && (
        <div className="flex items-center gap-3">
          <DotsSpinner />
        </div>
      )}

      {/* Loading text */}
      {showText && (
        <div className="text-center">
          <p className={`${textSizes[size]} text-gray-700 font-medium animate-pulse`}>
            {text}
          </p>
          {(size === 'large' || size === 'xlarge') && (
            <p className="text-sm text-gray-500 mt-1">
              Please wait a moment...
            </p>
          )}
        </div>
      )}

      {/* Decorative elements for xlarge */}
      {size === 'xlarge' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-200 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-emerald-200 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center z-50">
        <div className="relative p-8">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative">
        {content}
      </div>
    </div>
  );
};

// Preset loading components for common use cases
export const PageLoader = ({ text = "Loading Hokz Academy..." }) => (
  <LoadingSpinner 
    size="xlarge" 
    text={text} 
    fullScreen={true} 
    variant="gradient"
  />
);

export const ComponentLoader = ({ text = "Loading..." }) => (
  <LoadingSpinner 
    size="large" 
    text={text} 
    variant="default"
  />
);

export const ButtonLoader = ({ text = "Processing..." }) => (
  <LoadingSpinner 
    size="small" 
    text={text} 
    showText={false}
    variant="default"
  />
);

export const InlineLoader = ({ text = "Loading..." }) => (
  <div className="inline-flex items-center gap-2">
    <LoadingSpinner 
      size="small" 
      showText={false}
      variant="default"
    />
    <span className="text-sm text-gray-600">{text}</span>
  </div>
);

export default LoadingSpinner;