import React, { useState, useEffect } from 'react';
import './MealsTab.css';
import RecipeModal from './RecipeModal';

function MealsTab() {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);

  useEffect(() => {
    fetchSuggestion(true);
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

  const fetchSuggestion = async (withAnimation = false) => {
    setLoading(true);
    if (withAnimation) {
      setIsAnimating(true);
    }
    
    try {
      const response = await fetch('/api/meal-suggestion');
      if (response.ok) {
        const data = await response.json();
        setSuggestion(data);
        
        if (withAnimation) {
          setTimeout(() => setIsAnimating(false), 600);
        }
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
    if (hour >= 4 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 18) return 'Lunch';
    return 'Dinner';
  };

  const isInShoppingList = (productId) => {
    return shoppingList.some(item => item.productId === productId);
  };

  const handleRecipePhotoClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    const timer = setTimeout(() => {
      if (clickCount + 1 === 2) {
        fetchSuggestion(true);
      } else {
        setSelectedRecipe(suggestion);
        setShowRecipeModal(true);
      }
      setClickCount(0);
    }, 300);

    setClickTimer(timer);
  };

  const filteredSearchResults = searchResults.filter(product => {
    const inList = isInShoppingList(product.id);
    const inRecent = recentItems.some(item => item.productId === product.id);
    return !inList && !inRecent;
  });

  const searchInShoppingList = shoppingList.filter(item =>
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchInRecent = recentItems.filter(item =>
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !isInShoppingList(item.productId)
  );

  return (
    <div className="meals-tab">
      <div className="suggestion-section">
        {loading && !suggestion ? (
          <div className="loading">Loading...</div>
        ) : suggestion ? (
          <div className={`suggestion-card ${isAnimating ? 'flip-animation' : ''}`}>
            <div className="suggestion-label">{getMealTypeLabel()}</div>
            <h2 className="suggestion-title">{suggestion.name}</h2>
            {suggestion.photo && (
              <img 
                src={suggestion.photo} 
                alt={suggestion.name} 
                className="suggestion-image"
                onClick={handleRecipePhotoClick}
              />
            )}
            <div className="suggestion-info">
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <span>{suggestion.prepTime} min prep</span>
              </div>
              <div className="info-item">
                <span className="info-icon">🔥</span>
                <span>{suggestion.cookTime} min cook</span>
              </div>
            </div>
            <button hidden className="refresh-button" onClick={() => fetchSuggestion(true)}>
              🔄 New Suggestion
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <div className="empty-state-text">No recipes available</div>
            <div className="empty-state-subtext">Add recipes to get started</div>
          </div>
        )}
      </div>

      <div className="bottom-section">
        <div className="search-section">
          <input
            type="text" id="meals-search-input"
            className="search-input"
            placeholder="Add shopping items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (filteredSearchResults.length > 0 || searchInShoppingList.length > 0 || searchInRecent.length > 0) && (
            <div className="search-results">
              {filteredSearchResults.map(product => (
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
              {searchInShoppingList.map(item => (
                <div
                  key={item.id}
                  className="search-result-item in-list"
                  onClick={() => removeFromShoppingList(item.productId)}
                >
                  {item.product.photo && (
                    <img src={item.product.photo} alt={item.product.name} className="result-image" />
                  )}
                  <div className="result-info">
                    <div className="result-name">{item.product.name}</div>
                    <div className="result-store">In shopping list</div>
                  </div>
                  <span className="remove-icon">✓</span>
                </div>
              ))}
              {searchInRecent.map(item => (
                <div
                  key={item.id}
                  className="search-result-item"
                  onClick={() => addToShoppingList(item.productId)}
                >
                  {item.product.photo && (
                    <img src={item.product.photo} alt={item.product.name} className="result-image" />
                  )}
                  <div className="result-info">
                    <div className="result-name">{item.product.name}</div>
                    <div className="result-store">Recent</div>
                  </div>
                  <span className="add-icon">+</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-grids">
          {shoppingList.length > 0 && (
            <div className="product-grid">
              {shoppingList.map(item => (
                <div
                  key={item.id}
                  className="product-grid-item"
                  onClick={() => removeFromShoppingList(item.productId)}
                >
                  {item.product.photo ? (
                    <img src={item.product.photo} alt={item.product.name} />
                  ) : (
                    <div className="no-image">📦</div>
                  )}
                  <div className="product-grid-badge">✓</div>
                </div>
              ))}
            </div>
          )}

          {recentItems.length > 0 && (
            <div className="product-grid">
              {recentItems
                .filter(item => !isInShoppingList(item.productId))
                .map(item => (
                  <div
                    key={item.id}
                    className="product-grid-item"
                    onClick={() => addToShoppingList(item.productId)}
                  >
                    {item.product.photo ? (
                      <img src={item.product.photo} alt={item.product.name} />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {showRecipeModal && selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          products={[]}
          onClose={() => {
            setShowRecipeModal(false);
            setSelectedRecipe(null);
            fetchSuggestion();
          }}
        />
      )}
    </div>
  );
}

export default MealsTab;
