
import React from 'react';

const otherTools = [
  { name: "Générateur Devis SEO", url: "https://generateur-idee-seo-ldtf.bolt.host/" },
  { name: "Vérificateur Hébergement Web", url: "https://verificateur-heberge-pimr.bolt.host/" },
  { name: "Plateforme de Netlinking", url: "https://plateforme-de-netlin-nb5b.bolt.host/" },
  { name: "Matrice Édito SEO", url: "https://matrice-dito-seo-7x9w.bolt.host/" },
  { name: "Monitoring Ranking Mots-Clés", url: "https://monitoring-mot-cle-s-njjo.bolt.host/" },
  { name: "Cocon Générateur", url: "https://cocon-generateur-i33o.bolt.host/" },
  { name: "Guide Mot-Clé SEO", url: "https://guide-mot-cle-seo-hcyv.bolt.host/" },
  { name: "Convertisseur de Texte", url: "https://maxime-guinard.fr/tool/convertisseur-texte/" },
  { name: "Générateur d'Article SEO", url: "https://auto-blog-v1-easygrowth.netlify.app/" },
  { name: "Couleurs / Géotag / Mots-clés / Hn", url: "https://couleurs-g-otag-mots-zbor.bolt.host/" },
  { name: "Bulk Mot-Clé Générateur", url: "https://bulk-mot-cle-generat-mtk5.bolt.host/" },
  { name: "Brief / Hn / Détecteur / Article", url: "https://outil-brief-hn-detec-2siq.bolt.host/" },
  { name: "Générateur de contenu SEO", url: "https://contenu-creation-xl2v.bolt.host/" }
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ds-dark-teal py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-ds-light-blue">
        <p className="mb-6">Devsource by Maxime GUINARD</p>
        
        <h3 className="text-lg font-semibold text-ds-white mb-4">Nos autres outils</h3>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 max-w-4xl mx-auto">
          {otherTools.map(tool => (
            <a 
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ds-light-blue hover:text-ds-yellow transition-colors text-sm"
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
