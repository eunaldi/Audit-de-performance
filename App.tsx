import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UrlInputForm } from './components/UrlInputForm';
import { AuditResults } from './components/AuditResults';
import { Loader } from './components/Loader';
import { History } from './components/History';
import { generateAuditReport } from './services/geminiService';
import type { AuditData } from './types';

const App: React.FC = () => {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  const handleAudit = useCallback(async (url: string) => {
    if (!url) {
      setError('Please enter a valid URL.');
      return;
    }
    setIsLoading(true);
    setAuditData(null);
    setError(null);
    setCurrentUrl(url);

    try {
      const data = await generateAuditReport(url);
      setAuditData(data);
      setHistory(prevHistory => {
        const newHistory = [url, ...prevHistory];
        // Keep unique URLs and limit to the 5 most recent
        return [...new Set(newHistory)].slice(0, 5);
      });
    } catch (err) {
      console.error(err);
      setError('Failed to generate audit report. Please check the URL or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="bg-ds-dark-blue min-h-screen text-ds-white font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Audit de Performance de Site Web</h1>
          <p className="text-lg md:text-xl text-ds-light-blue mb-8">
            Entrez une URL pour analyser ses performances et découvrir comment Devsource peut l'améliorer.
          </p>
          <UrlInputForm onAudit={handleAudit} isLoading={isLoading} />
        </div>

        {isLoading && <Loader />}
        
        {error && (
          <div className="mt-8 max-w-2xl mx-auto bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">
            <p className="font-bold">Erreur</p>
            <p>{error}</p>
          </div>
        )}

        {auditData && (
          <div className="mt-12">
            <AuditResults data={auditData} url={currentUrl} />
          </div>
        )}

        <History history={history} onAudit={handleAudit} isLoading={isLoading} />

      </main>
      <Footer />
    </div>
  );
};

export default App;