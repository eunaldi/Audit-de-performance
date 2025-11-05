
import React, { useState } from 'react';

interface UrlInputFormProps {
  onAudit: (url: string) => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ onAudit, isLoading }) => {
  const [url, setUrl] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAudit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center bg-ds-dark-teal border-2 border-ds-light-blue/20 rounded-lg p-2 gap-2 shadow-lg">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full bg-transparent text-ds-white placeholder-ds-light-blue/50 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-yellow transition-all"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-ds-yellow text-ds-dark-blue font-bold px-8 py-3 rounded-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ds-dark-teal focus:ring-ds-yellow transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? 'Analyse en cours...' : 'Analyser'}
        </button>
      </div>
    </form>
  );
};
