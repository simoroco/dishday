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
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const tabs = [
    { id: 0, name: 'Courses', icon: '🛒' },
    { id: 1, name: 'Repas', icon: '🍽️' },
    { id: 2, name: 'Recettes', icon: '📖' }
  ];

  return (
    <div className="app" {...handlers}>
      <header className="app-header" hidden>
        <h1>DishDay</h1>
      </header>

      <nav className="tab-nav">
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
        <div className="tabs-container" style={{ transform: `translateX(-${activeTab * 100}%)` }}>
          <div className="tab-panel">
            <ShoppingTab />
          </div>
          <div className="tab-panel">
            <MealsTab />
          </div>
          <div className="tab-panel">
            <RecipesTab />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
