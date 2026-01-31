import React, { useState, useEffect } from 'react';
import './RecipesTab.css';
import RecipeModal from './RecipeModal';
import ToggleButton from './ToggleButton';

function RecipesTab() {
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMealType, setFilterMealType] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRecipes();
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterMealType]);

  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterMealType) params.append('mealType', filterMealType);

      const response = await fetch(`/api/recipes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedRecipe(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
    fetchRecipes();
  };

  const getMealTypeLabel = (type) => {
    const labels = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner'
    };
    return labels[type] || type;
  };

  const getMealTypeEmoji = (type) => {
    const emojis = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙'
    };
    return emojis[type] || '🍽️';
  };

  return (
    <div className="recipes-tab">
      <div className="recipes-header">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="filter-buttons">
          <ToggleButton
            active={filterMealType === ''}
            onClick={() => setFilterMealType('')}
            small
          >
            All
          </ToggleButton>
          <ToggleButton
            active={filterMealType === 'breakfast'}
            onClick={() => setFilterMealType('breakfast')}
            small
          >
            🌅 Breakfast
          </ToggleButton>
          <ToggleButton
            active={filterMealType === 'lunch'}
            onClick={() => setFilterMealType('lunch')}
            small
          >
            ☀️ Lunch
          </ToggleButton>
          <ToggleButton
            active={filterMealType === 'dinner'}
            onClick={() => setFilterMealType('dinner')}
            small
          >
            🌙 Dinner
          </ToggleButton>
        </div>

        <button className="add-button" onClick={handleAddNew}>
          + Add Recipe
        </button>
      </div>

      <div className="recipes-list">
        {recipes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📖</div>
            <div className="empty-state-text">No recipes found</div>
            <div className="empty-state-subtext">Add your first recipe</div>
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <div
                key={recipe.id}
                className="recipe-card"
                onClick={() => handleRecipeClick(recipe)}
              >
                {recipe.photo && (
                  <img src={recipe.photo} alt={recipe.name} className="recipe-image" />
                )}
                <div className="recipe-content">
                  <div className="recipe-meal-type">
                    {getMealTypeEmoji(recipe.mealType)} {getMealTypeLabel(recipe.mealType)}
                  </div>
                  <h3 className="recipe-name">{recipe.name}</h3>
                  <div className="recipe-times">
                    <div className="time-item">
                      <span className="time-icon">⏱️</span>
                      <span>{recipe.prepTime} min</span>
                    </div>
                    <div className="time-item">
                      <span className="time-icon">🔥</span>
                      <span>{recipe.cookTime} min</span>
                    </div>
                  </div>
                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div className="recipe-ingredients-count">
                      {recipe.ingredients.length} ingredient{recipe.ingredients.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <RecipeModal
          recipe={selectedRecipe}
          products={products}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default RecipesTab;
