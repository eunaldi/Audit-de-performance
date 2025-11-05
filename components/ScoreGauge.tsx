import React from 'react';

interface ScoreGaugeProps {
  score: number;
  color?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, color = '#f1fd0d' }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 90) return color;
    if (s >= 50) return '#f59e0b'; // Amber-500
    return '#ef4444'; // Red-500
  };
  
  const displayColor = score > 89 ? color : getScoreColor(score);

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-ds-dark-blue"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          stroke={displayColor}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <span 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold" 
        style={{ color: displayColor }}
      >
        {score}
      </span>
    </div>
  );
};