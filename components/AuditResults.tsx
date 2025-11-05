import React, { useMemo, useRef } from 'react';
import type { AuditData, Metric, Recommendation } from '../types';
import { ScoreGauge } from './ScoreGauge';

// Global objects for PDF/Excel export from CDN
declare const jspdf: any;
declare const html2canvas: any;
declare const XLSX: any;

interface AuditResultsProps {
  data: AuditData;
  url: string;
}

const MetricCard: React.FC<{ title: string; metric: Metric }> = ({ title, metric }) => {
  const getRatingColor = (rating?: string) => {
    switch (rating) {
      case 'Good': return 'text-green-400';
      case 'Needs Improvement': return 'text-orange-400';
      case 'Poor': return 'text-red-400';
      default: return 'text-ds-light-blue';
    }
  };

  return (
    <div className="bg-ds-dark-teal/50 p-4 rounded-lg text-center">
      <p className="text-sm text-ds-light-blue/80">{title}</p>
      <p className={`text-2xl font-bold ${getRatingColor(metric.rating)}`}>
        {metric.value}{metric.unit}
      </p>
    </div>
  );
};

const translateRating = (rating?: 'Good' | 'Needs Improvement' | 'Poor'): string => {
    switch (rating) {
        case 'Good': return 'Bon';
        case 'Needs Improvement': return 'À améliorer';
        case 'Poor': return 'Faible';
        default: return '';
    }
};

export const AuditResults: React.FC<AuditResultsProps> = ({ data, url }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  
  const devsourceScore = useMemo(() => {
    const improvement = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
    return Math.min(data.performanceScore + improvement, 99);
  }, [data.performanceScore]);
  
  const handleExportPDF = () => {
    if (!reportRef.current) return;
    const { jsPDF } = jspdf;
    const input = reportRef.current;
    const hostname = new URL(url).hostname.toUpperCase();

    html2canvas(input, {
        backgroundColor: '#12272b',
        scale: 2,
        useCORS: true,
    }).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / pdfWidth;
      const imgHeight = canvasHeight / ratio;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
          position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
      }
      
      // Add a prominent footer only on the last page, if there is more than one page.
      const pageCount = pdf.internal.getNumberOfPages();
      if (pageCount > 1) {
        pdf.setPage(pageCount); // Go to the last page
        pdf.setFontSize(11); // Bigger font
        pdf.setFont(undefined, 'bold'); // Bolder text
        pdf.setTextColor('#9ab1b1'); // A slightly "darker"/less prominent shade of light-blue
        const footerText = "Créé par Devsource. Ce document est confidentiel.";
        const textWidth = pdf.getStringUnitWidth(footerText) * pdf.getFontSize() / pdf.internal.scaleFactor;
        const textX = (pdfWidth - textWidth) / 2;
        pdf.text(footerText, textX, pdfHeight - 15); // Position with more margin
      }

      pdf.save(`AUDIT PERFORMANCE ${hostname} X DEVSOURCE.pdf`);
    });
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const hostname = new URL(url).hostname.toUpperCase();

    // Summary Sheet
    const summaryData = [
      ["URL de l'audit", url],
      ["Hébergeur Détecté", data.hostingProvider],
      ["Score de Performance Actuel", data.performanceScore],
      ["Score Potentiel (Devsource)", devsourceScore],
      ["Résumé", data.summary]
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Résumé");

    // Metrics Sheet
    const metricsData = [
      ["Métrique", "Valeur", "Unité", "Note"],
      ["Rendu du plus grand élément (LCP)", data.coreWebVitals.lcp.value, "s", translateRating(data.coreWebVitals.lcp.rating)],
      ["Délai de première interaction (FID)", data.coreWebVitals.fid.value, "ms", translateRating(data.coreWebVitals.fid.rating)],
      ["Décalage cumulatif de la mise en page (CLS)", data.coreWebVitals.cls.value, "", translateRating(data.coreWebVitals.cls.rating)],
      ["Rendu du premier élément (FCP)", data.otherMetrics.fcp.value, "s", ""],
      ["Temps de blocage total (TBT)", data.otherMetrics.tbt.value, "ms", ""]
    ];
    const wsMetrics = XLSX.utils.aoa_to_sheet(metricsData);
    XLSX.utils.book_append_sheet(wb, wsMetrics, "Métriques");

    // Recommendations Sheet
    const recoData = data.recommendations.map(r => [r.title, r.description]);
    const wsReco = XLSX.utils.aoa_to_sheet([["Recommandation", "Description"], ...recoData]);
    XLSX.utils.book_append_sheet(wb, wsReco, "Recommandations");
    
    XLSX.writeFile(wb, `AUDIT PERFORMANCE ${hostname} X DEVSOURCE.xlsx`);
  };


  return (
    <div className="max-w-5xl mx-auto">
        <div className="flex justify-end gap-4 mb-4">
             <button onClick={handleExportPDF} className="bg-ds-dark-teal hover:bg-ds-light-blue/20 text-ds-white font-bold py-2 px-4 rounded-lg transition-colors">Exporter en PDF</button>
             <button onClick={handleExportExcel} className="bg-ds-dark-teal hover:bg-ds-light-blue/20 text-ds-white font-bold py-2 px-4 rounded-lg transition-colors">Exporter en Excel</button>
        </div>
        <div ref={reportRef} className="bg-ds-dark-teal/50 p-6 md:p-8 rounded-xl shadow-2xl border border-ds-light-blue/10">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Rapport d'Audit pour :</h2>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <p className="text-ds-yellow break-all text-lg">{url}</p>
                    <span className="text-xs bg-ds-dark-blue text-ds-light-blue px-2 py-1 rounded-full">Créé par Devsource</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-ds-dark-teal p-6 rounded-lg flex flex-col items-center border border-ds-light-blue/20">
                    <h3 className="text-xl font-semibold mb-4 text-ds-light-blue text-center">Performance Actuelle</h3>
                    <ScoreGauge score={data.performanceScore} />
                    <p className="mt-4 text-ds-light-blue/80 text-center">Hébergé par: <span className="font-bold text-ds-white">{data.hostingProvider}</span> <span className="text-xs italic opacity-70">(estimation)</span></p>
                </div>
                <div className="bg-gradient-to-br from-ds-yellow/20 to-transparent p-6 rounded-lg flex flex-col items-center border border-ds-yellow">
                    <h3 className="text-xl font-semibold mb-4 text-ds-yellow text-center">Potentiel avec Devsource</h3>
                    <ScoreGauge score={devsourceScore} color="#f1fd0d" />
                    <p className="mt-4 text-ds-white text-center">Une infrastructure optimisée pour une vitesse maximale.</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-center mb-4 text-ds-light-blue">Core Web Vitals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <MetricCard title="Largest Contentful Paint" metric={data.coreWebVitals.lcp} />
                    <MetricCard title="First Input Delay" metric={data.coreWebVitals.fid} />
                    <MetricCard title="Cumulative Layout Shift" metric={data.coreWebVitals.cls} />
                </div>
            </div>
             <div className="mb-8">
                <h3 className="text-xl font-semibold text-center mb-4 text-ds-light-blue">Autres Métriques</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                    <MetricCard title="First Contentful Paint" metric={data.otherMetrics.fcp} />
                    <MetricCard title="Total Blocking Time" metric={data.otherMetrics.tbt} />
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-center mb-4 text-ds-light-blue">Résumé et Recommandations par Devsource</h3>
                <div className="bg-ds-dark-teal p-6 rounded-lg mb-6 border border-ds-light-blue/20">
                    <p className="text-ds-light-blue italic">{data.summary}</p>
                </div>
                <div className="space-y-4">
                    {data.recommendations.map((rec, index) => (
                        <div key={index} className="bg-ds-dark-teal/50 p-4 rounded-lg">
                            <h4 className="font-bold text-ds-yellow">{rec.title}</h4>
                            <p className="text-ds-light-blue/90">{rec.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};