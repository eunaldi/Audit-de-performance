import React, { useState, useEffect } from 'react';

const steps = [
  "Initialisation de la connexion...",
  "Analyse du temps de réponse serveur...",
  "Évaluation des Core Web Vitals...",
  "Calcul du score de performance...",
  "Identification de l'hébergeur...",
  "Génération des recommandations...",
  "Finalisation du rapport...",
];

export const Loader: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Change text every 1.5 seconds
    const textInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev; // Stay on the last step if API is slow
      });
    }, 1500);

    // Smoothly update the progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Slow down near the end for a more realistic feel
        if (prev >= 95) {
          return 95;
        }
        return prev + 1;
      });
    }, 80);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col justify-center items-center py-16" aria-live="polite" aria-busy="true">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background track */}
          <circle
            className="text-ds-light-blue/10"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          {/* Progress arc */}
          <circle
            className="text-ds-yellow"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
            style={{ transition: 'stroke-dashoffset 0.3s linear' }}
          />
        </svg>
      </div>
      <p className="text-center mt-6 text-lg text-ds-light-blue w-full max-w-xs animate-pulse">
        {steps[currentStepIndex]}
      </p>
    </div>
  );
};
