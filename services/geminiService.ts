
import { GoogleGenAI, Type } from "@google/genai";
import type { AuditData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const auditSchema = {
  type: Type.OBJECT,
  properties: {
    hostingProvider: {
      type: Type.STRING,
      description: "Best guess for the hosting provider (e.g., 'GoDaddy', 'Vercel', 'OVH').",
    },
    performanceScore: {
      type: Type.INTEGER,
      description: "A plausible overall performance score between 40 and 85.",
    },
    coreWebVitals: {
      type: Type.OBJECT,
      properties: {
        lcp: { 
          type: Type.OBJECT, 
          properties: { value: {type: Type.NUMBER}, unit: {type: Type.STRING}, rating: {type: Type.STRING, enum: ['Good', 'Needs Improvement', 'Poor']} },
          required: ['value', 'unit', 'rating']
        },
        fid: { 
          type: Type.OBJECT,
          properties: { value: {type: Type.NUMBER}, unit: {type: Type.STRING}, rating: {type: Type.STRING, enum: ['Good', 'Needs Improvement', 'Poor']} },
          required: ['value', 'unit', 'rating']
        },
        cls: { 
          type: Type.OBJECT, 
          properties: { value: {type: Type.NUMBER}, unit: {type: Type.STRING}, rating: {type: Type.STRING, enum: ['Good', 'Needs Improvement', 'Poor']} },
          required: ['value', 'unit', 'rating']
        },
      },
      required: ['lcp', 'fid', 'cls']
    },
    otherMetrics: {
        type: Type.OBJECT,
        properties: {
            fcp: { type: Type.OBJECT, properties: { value: {type: Type.NUMBER}, unit: {type: Type.STRING}}, required: ['value', 'unit'] },
            tbt: { type: Type.OBJECT, properties: { value: {type: Type.NUMBER}, unit: {type: Type.STRING}}, required: ['value', 'unit'] }
        },
        required: ['fcp', 'tbt']
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['title', 'description']
      },
    },
    summary: {
      type: Type.STRING,
      description: "A short, commercially-focused summary of the site's performance issues.",
    },
  },
  required: ['hostingProvider', 'performanceScore', 'coreWebVitals', 'otherMetrics', 'recommendations', 'summary'],
};


export const generateAuditReport = async (url: string): Promise<AuditData> => {
  const prompt = `
    Vous êtes un expert en analyse de performance web. Pour l'URL "${url}", générez un rapport d'audit de performance simulé mais complet au format JSON.
    Le rapport doit être orienté commercialement, conçu pour mettre en évidence les domaines d'amélioration qu'un nouvel hébergeur pourrait résoudre.
    Générez des données réalistes pour un site web d'entreprise typique. Rendez les recommandations spécifiques et réalisables.
    Le rapport JSON doit suivre strictement le schéma fourni.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: auditSchema
        }
    });

    const text = response.text.trim();
    const parsedData = JSON.parse(text);
    
    // Ensure cls unit is empty as it doesn't have one
    if (parsedData.coreWebVitals && parsedData.coreWebVitals.cls) {
        parsedData.coreWebVitals.cls.unit = '';
    }

    return parsedData as AuditData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
