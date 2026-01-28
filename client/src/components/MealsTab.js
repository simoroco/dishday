import React, { useState, useEffect } from 'react';
import './MealsTab.css';
import StoresModal from './StoresModal';

function MealsTab() {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [showStoresModal, setShowStoresModal] = useState(false);

  useEffect(() => {
    fetchSuggestion();
    fetchShoppingList();
    fetchRecentItems();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      searchProducts();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const fetchSuggestion = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/meal-suggestion');
      if (response.ok) {
        const data = await response.json();
        setSuggestion(data);
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const fetchShoppingList = async () => {
    try {
      const response = await fetch('/api/shopping-list');
      if (response.ok) {
        const data = await response.json();
        setShoppingList(data);
      }
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    }
  };

  const fetchRecentItems = async () => {
    try {
      const response = await fetch('/api/recent-items');
      if (response.ok) {
        const data = await response.json();
        setRecentItems(data);
      }
    } catch (error) {
      console.error('Error fetching recent items:', error);
    }
  };

  const addToShoppingList = async (productId) => {
    try {
      const response = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (response.ok) {
        fetchShoppingList();
        fetchRecentItems();
        setSearchTerm('');
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
    }
  };

  const removeFromShoppingList = async (productId) => {
    try {
      const response = await fetch(`/api/shopping-list/${productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchShoppingList();
      }
    } catch (error) {
      console.error('Error removing from shopping list:', error);
    }
  };

  const getMealTypeLabel = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'Petit déjeuner';
    if (hour >= 11 && hour < 17) return 'Déjeuner';
    return 'Dîner';
  };

  const isInShoppingList = (productId) => {
    return shoppingList.some(item => item.productId === productId);
  };

  return (
    <div className="meals-tab">
      <div className="suggestion-section">
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : suggestion ? (
          <div className="suggestion-card">
            <div className="suggestion-label">{getMealTypeLabel()}</div>
            <h2 className="suggestion-title">{suggestion.name}</h2>
            {suggestion.photo && (
              <img src={suggestion.photo} alt={suggestion.name} className="suggestion-image" />
            )}
            <div className="suggestion-info">
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <span>{suggestion.prepTime} min préparation</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🔥</span>
                <span>{suggestion.cookTime} min cuisson</span>
              </div>
            </div>
            {suggestion.ingredients && suggestion.ingredients.length > 0 && (
              <div className="ingredients-list">
                <h3>Ingrédients</h3>
                {suggestion.ingredients.map(ing => (
                  <div key={ing.id} className="ingredient-item">
                    <span className="ingredient-name">{ing.product.name}</span>
                    <span className="ingredient-quantity">
                      {ing.quantity} {ing.unit}
                    </span>
                    <span className={`ingredient-status ${ing.product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {ing.product.inStock ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button className="refresh-button" onClick={fetchSuggestion}>
              🔄 Nouvelle proposition
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <div className="empty-state-text">Aucune recette disponible</div>
            <div className="empty-state-subtext">Ajoutez des recettes pour commencer</div>
          </div>
        )}
      </div>

      <div className="bottom-section">
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(product => (
                <div
                  key={product.id}
                  className="search-result-item"
                  onClick={() => addToShoppingList(product.id)}
                >
                  {product.photo && (
                    <img src={product.photo} alt={product.name} className="result-image" />
                  )}
                  <div className="result-info">
                    <div className="result-name">{product.name}</div>
                    {product.store && (
                      <div className="result-store">{product.store.name}</div>
                    )}
                  </div>
                  <span className="add-icon">+</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lists-section">
          {shoppingList.length > 0 && (
            <div className="list-group">
              <h3 className="list-title">Liste de courses</h3>
              <div className="list-items">
                {shoppingList.map(item => (
                  <div
                    key={item.id}
                    className="list-item selected"
                    onClick={() => removeFromShoppingList(item.productId)}
                  >
                    {item.product.photo && (
                      <img src={item.product.photo} alt={item.product.name} className="item-image" />
                    )}
                    <div className="item-info">
                      <div className="item-name">{item.product.name}</div>
                      {item.product.store && (
                        <div className="item-store">{item.product.store.name}</div>
                      )}
                    </div>
                    <span className="remove-icon">✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentItems.length > 0 && (
            <div className="list-group">
              <h3 className="list-title">Produits récents</h3>
              <div className="list-items">
                {recentItems
                  .filter(item => !isInShoppingList(item.productId))
                  .map(item => (
                    <div
                      key={item.id}
                      className="list-item"
                      onClick={() => addToShoppingList(item.productId)}
                    >
                      {item.product.photo && (
                        <img src={item.product.photo} alt={item.product.name} className="item-image" />
                      )}
                      <div className="item-info">
                        <div className="item-name">{item.product.name}</div>
                        {item.product.store && (
                          <div className="item-store">{item.product.store.name}</div>
                        )}
                      </div>
                      <span className="add-icon">+</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <button className="settings-button" onClick={() => setShowStoresModal(true)}>
          ⚙️ Gérer les magasins
        </button>
      </div>

      {showStoresModal && (
        <StoresModal onClose={() => setShowStoresModal(false)} />
      )}
    </div>
  );
}

export default MealsTab;
