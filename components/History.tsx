import React from 'react';

interface HistoryProps {
  history: string[];
  onAudit: (url: string) => void;
  isLoading?: boolean;
}

export const History: React.FC<HistoryProps> = ({ history, onAudit, isLoading }) => {
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <h2 className="text-xl font-bold text-center text-ds-light-blue mb-4">
        Historique des analyses
      </h2>
      <div className="flex flex-wrap justify-center gap-3 min-h-[36px] items-center">
        {history.length > 0 ? (
          history.map((url, index) => (
            <button
              key={`${url}-${index}`}
              onClick={() => onAudit(url)}
              disabled={isLoading}
              className="bg-ds-dark-teal text-ds-light-blue px-4 py-2 rounded-full text-sm hover:bg-ds-light-blue/20 hover:text-ds-white transition-colors focus:outline-none focus:ring-2 focus:ring-ds-yellow disabled:opacity-50"
              title={`Relancer l'analyse pour ${url}`}
            >
              {new URL(url).hostname}
            </button>
          ))
        ) : (
          <p className="text-ds-light-blue/60 italic">Aucune analyse récente.</p>
        )}
      </div>
    </div>
  );
};