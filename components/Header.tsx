import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-ds-dark-teal shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <img 
            src="https://devsource.fr/wp-content/uploads/2025/07/DS_logo_petit_cercle_noeffect.png"
            alt="Devsource Logo" 
            className="h-12 w-12 mr-4"
        />
        <span className="text-xl md:text-2xl font-bold tracking-wider text-ds-white">
          Devsource Appel d'offre
        </span>
      </div>
    </header>
  );
};
