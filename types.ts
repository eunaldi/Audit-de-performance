
export interface Metric {
  value: number;
  unit: string;
  rating?: 'Good' | 'Needs Improvement' | 'Poor';
}

export interface Recommendation {
  title: string;
  description: string;
}

export interface AuditData {
  hostingProvider: string;
  performanceScore: number;
  coreWebVitals: {
    lcp: Metric;
    fid: Metric;
    cls: Metric;
  };
  otherMetrics: {
    fcp: Metric;
    tbt: Metric;
  };
  recommendations: Recommendation[];
  summary: string;
}
