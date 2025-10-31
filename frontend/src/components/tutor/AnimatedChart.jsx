import React, { useEffect, useRef, useState } from 'react';

const AnimatedChart = () => {
  const svgRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const data1 = [30, 25, 35, 45, 40, 50, 35, 30, 45, 40, 35];
  const data2 = [20, 30, 25, 35, 30, 25, 40, 35, 30, 35, 40];
  
  // only width & height changed
  const width = 1000;
  const height = 350;
  const padding = 40;

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

      setAnimationProgress(easeInOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      animate();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const createPath = (data, progress) => {
    const points = data.map((value, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((value / 60) * (height - 2 * padding)) * progress;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const createDots = (data, progress, color) => {
    return data.map((value, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((value / 60) * (height - 2 * padding)) * progress;
      
      return (
        <circle
          key={index}
          cx={x}
          cy={y}
          r="4"
          fill={color}
          className="animate-pulse"
          style={{
            animationDelay: `${index * 100}ms`,
            opacity: progress
          }}
        />
      );
    });
  };

  const gridLines = [];
  for (let i = 0; i <= 6; i++) {
    const y = padding + (i * (height - 2 * padding)) / 6;
    gridLines.push(
      <line
        key={`h-${i}`}
        x1={padding}
        y1={y}
        x2={width - padding}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth="1"
        opacity="0.5"
      />
    );
  }

  for (let i = 0; i <= 10; i++) {
    const x = padding + (i * (width - 2 * padding)) / 10;
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={x}
        y1={padding}
        x2={x}
        y2={height - padding}
        stroke="#e5e7eb"
        strokeWidth="1"
        opacity="0.3"
      />
    );
  }

  return (
    <div className="w-full h-[350px] bg-gradient-to-br from-gray-50 to-white rounded-lg p-4">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        {gridLines}
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Area fills */}
        <path
          d={`${createPath(data1, animationProgress)} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
          fill="url(#gradient1)"
        />
        <path
          d={`${createPath(data2, animationProgress)} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
          fill="url(#gradient2)"
        />
        
        {/* Lines */}
        <path
          d={createPath(data1, animationProgress)}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />
        <path
          d={createPath(data2, animationProgress)}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />
        
        {/* Animated dots */}
        {createDots(data1, animationProgress, '#10b981')}
        {createDots(data2, animationProgress, '#ef4444')}
        
        {/* Y-axis labels */}
        {[0, 10, 20, 30, 40, 50, 60].map((value, index) => {
          const y = height - padding - (index * (height - 2 * padding)) / 6;
          return (
            <text
              key={value}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {value}
            </text>
          );
        })}
        
        {/* X-axis labels */}
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month, index) => {
          const x = padding + (index * (width - 2 * padding)) / 10;
          return (
            <text
              key={month}
              x={x}
              y={height - padding + 20}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {month}
            </text>
          );
        })}
      </svg>
      
      {/* Legend — same position as your old code */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Expenses</span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedChart;
