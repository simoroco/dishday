import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './App.css';
import MealsTab from './components/MealsTab';
import ShoppingTab from './components/ShoppingTab';
import RecipesTab from './components/RecipesTab';

function App() {
  const [activeTab, setActiveTab] = useState(1);

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveTab(prev => Math.min(2, prev + 1)),
    onSwipedRight: () => setActiveTab(prev => Math.max(0, prev - 1)),
    preventScrollOnSwipe: true,
    trackMouse: false,
    delta: 50
  });

  const tabs = [
    { id: 0, name: 'Shopping', icon: '🛒' },
    { id: 1, name: 'Meals', icon: '🍽️' },
    { id: 2, name: 'Recipes', icon: '📖' }
  ];

  return (
    <div className="app" {...handlers}>
      <header hidden className="app-header">
        <h1>DishDay</h1>
      </header>

      <nav className="tab-nav" hidden id="header-tab-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </nav>

      <main className="app-content">
        <div 
          className="tabs-container" 
          style={{ 
            transform: `translateX(-${activeTab * 100}%)`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className={`tab-panel ${activeTab === 0 ? 'active' : ''}`}>
            {activeTab === 0 && <ShoppingTab />}
          </div>
          <div className={`tab-panel ${activeTab === 1 ? 'active' : ''}`}>
            {activeTab === 1 && <MealsTab />}
          </div>
          <div className={`tab-panel ${activeTab === 2 ? 'active' : ''}`}>
            {activeTab === 2 && <RecipesTab />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
