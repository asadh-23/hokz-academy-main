import React, { useEffect, useRef, useState } from "react";

const AnimatedChart = ({ revenueData, expenseData }) => {
  const svgRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // ---------- SAFE DATA ----------
  const normalize = (arr) => arr.map((v) => Number(v) || 0);

  const data1 =
    revenueData && revenueData.length > 0
      ? normalize(revenueData)
      : [0, 0, 0, 0, 0];

  const data2 =
    expenseData && expenseData.length > 0
      ? normalize(expenseData)
      : [0, 0, 0, 0, 0];

  // ---------- DIMENSIONS ----------
  const width = 1000;
  const height = 350;
  const padding = 40;

  // ---------- MAX VALUE (SAFE) ----------
  const rawMax = Math.max(...data1, ...data2);
  const maxValue = rawMax > 0 ? Math.ceil(rawMax * 1.1) : 1;

  // ---------- ANIMATION ----------
  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(animate);
    };

    const timer = setTimeout(animate, 300);
    return () => clearTimeout(timer);
  }, [revenueData, expenseData]);

  // ---------- HELPERS ----------
  const getX = (index, length) => {
    if (length <= 1) return padding;
    return padding + (index * (width - 2 * padding)) / (length - 1);
  };

  const getY = (value, progress) =>
    height -
    padding -
    ((value / maxValue) * (height - 2 * padding)) * progress;

  const createPath = (data, progress) => {
    if (data.length === 0) return "";
    const points = data.map((value, index) => {
      const x = getX(index, data.length);
      const y = getY(value, progress);
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  const createDots = (data, progress, color) =>
    data.map((value, index) => {
      const x = getX(index, data.length);
      const y = getY(value, progress);
      return (
        <circle
          key={index}
          cx={x}
          cy={y}
          r="4"
          fill={color}
          opacity={progress}
        />
      );
    });

  // ---------- GRID ----------
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

  const dataLength = Math.max(data1.length, data2.length);

  for (let i = 0; i < dataLength; i++) {
    const x = getX(i, dataLength);
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

  // ---------- LABELS ----------
  const yLabels = Array.from({ length: 7 }, (_, i) =>
    Math.round((maxValue / 6) * i)
  );

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const xLabels = months.slice(0, dataLength);

  // ---------- RENDER ----------
  return (
    <div className="w-full h-[350px] bg-gradient-to-br from-gray-50 to-white rounded-lg p-4">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        {gridLines}

        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <path
          d={`${createPath(data1, animationProgress)} L ${
            width - padding
          },${height - padding} L ${padding},${height - padding} Z`}
          fill="url(#rev)"
        />

        <path
          d={`${createPath(data2, animationProgress)} L ${
            width - padding
          },${height - padding} L ${padding},${height - padding} Z`}
          fill="url(#exp)"
        />

        <path
          d={createPath(data1, animationProgress)}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
        />

        <path
          d={createPath(data2, animationProgress)}
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
        />

        {createDots(data1, animationProgress, "#10b981")}
        {createDots(data2, animationProgress, "#ef4444")}

        {yLabels.map((val, i) => {
          const y = height - padding - (i * (height - 2 * padding)) / 6;
          return (
            <text
              key={i}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#6b7280"
            >
              {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
            </text>
          );
        })}

        {xLabels.map((m, i) => {
          const x = getX(i, dataLength);
          return (
            <text
              key={m}
              x={x}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {m}
            </text>
          );
        })}
      </svg>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span className="text-xs font-semibold">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-xs font-semibold">Expenses</span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedChart;
