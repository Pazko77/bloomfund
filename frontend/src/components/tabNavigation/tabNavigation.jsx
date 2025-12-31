import { useState } from 'react';


export function TabNavigation({projet , contributions , commentaires }) {
  const [activeTab, setActiveTab] = useState('collecte');

  const tabs = [
		{ id: 'collecte', label: 'Collecte' },
		{ id: 'contreparties', label: 'Contreparties' },
		{ id: 'contributions', label: `Contributions ${contributions.length}` },
		{ id: 'commentaires', label: `Commentaires ${commentaires.length ?? 0}` },
	];

  const renderContent = () => {
    switch (activeTab) {
      case 'collecte':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl">Collecte</h2>
            <p>{projet.description}</p>
           
          </div>
        );
      case 'contreparties':
        return (
            <h2 className="text-2xl">Contreparties</h2>
          
        );
      case 'contributions':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl">Contributions </h2>
           
          </div>
        );
      case 'commentaires':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl">Commentaires</h2>
            
          </div>
        );
    }
  };

  return ( 
    <div className="w-full flex flex-col  items-center ">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 w-full ">
        <nav className="flex gap-8 w-full justify-start  px-90">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-4 transition-colors ${
                activeTab === tab.id
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="py-8  w-full flex justify-center items-center">
        {renderContent()}
      </div>
    </div>
  );
}
