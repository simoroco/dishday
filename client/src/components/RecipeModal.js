import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './RecipeModal.css';
import ImageUpload from './ImageUpload';
import ToggleButton from './ToggleButton';

const UNITS = ['kg', 'g', 'L', 'ml', 'units', 'pcs'];

function RecipeModal({ recipe, products, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    prepTime: '',
    cookTime: '',
    mealType: 'lunch',
    ingredients: [],
    notes: ''
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name || '',
        photo: recipe.photo || '',
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        mealType: recipe.mealType || 'lunch',
        ingredients: recipe.ingredients?.map(ing => ({
          productId: ing.productId,
          quantity: ing.quantity || '',
          unit: ing.unit || ''
        })) || [],
        notes: recipe.notes || ''
      });
    }
  }, [recipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    
    if (recipe) {
      saveRecipe(newFormData);
    }
  };

  const handleImageChange = (path) => {
    const newFormData = { ...formData, photo: path };
    setFormData(newFormData);
    if (recipe) {
      saveRecipe(newFormData);
    }
  };

  const handleMealTypeChange = (mealType) => {
    const newFormData = { ...formData, mealType };
    setFormData(newFormData);
    if (recipe) {
      saveRecipe(newFormData);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value
    };
    const newFormData = {
      ...formData,
      ingredients: newIngredients
    };
    setFormData(newFormData);
    
    if (recipe) {
      saveRecipe(newFormData);
    }
  };

  const addIngredient = () => {
    const newFormData = {
      ...formData,
      ingredients: [...formData.ingredients, { productId: '', quantity: '', unit: '' }]
    };
    setFormData(newFormData);
  };

  const removeIngredient = (index) => {
    const newFormData = {
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    };
    setFormData(newFormData);
    
    if (recipe) {
      saveRecipe(newFormData);
    }
  };

  const saveRecipe = async (data) => {
    try {
      const url = recipe ? `/api/recipes/${recipe.id}` : '/api/recipes';
      const method = recipe ? 'PUT' : 'POST';
      
      const payload = {
        ...data,
        ingredients: data.ingredients.filter(ing => ing.productId)
      };
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipe) {
      await saveRecipe(formData);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (recipe && window.confirm('Delete this recipe?')) {
      try {
        await fetch(`/api/recipes/${recipe.id}`, { method: 'DELETE' });
        onClose();
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="recipe-modal">
        <div className="modal-header">
          <h2>{recipe ? 'Edit Recipe' : 'New Recipe'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form className="modal-body" onSubmit={handleSubmit}>
          <ImageUpload 
            currentImage={formData.photo}
            onImageChange={handleImageChange}
          />

          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Recipe name *"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleChange}
              placeholder="Prep time (minutes) *"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleChange}
              placeholder="Cook time (minutes) *"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="field-label">Meal Type</label>
            <div className="toggle-button-group">
              <ToggleButton
                active={formData.mealType === 'breakfast'}
                onClick={() => handleMealTypeChange('breakfast')}
              >
                🌅 Breakfast
              </ToggleButton>
              <ToggleButton
                active={formData.mealType === 'lunch'}
                onClick={() => handleMealTypeChange('lunch')}
              >
                ☀️ Lunch
              </ToggleButton>
              <ToggleButton
                active={formData.mealType === 'dinner'}
                onClick={() => handleMealTypeChange('dinner')}
              >
                🌙 Dinner
              </ToggleButton>
            </div>
          </div>

          <div className="form-group">
            <label className="field-label">Ingredients</label>
            <div className="ingredients-editor">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-row">
                  <select
                    value={ingredient.productId}
                    onChange={(e) => handleIngredientChange(index, 'productId', e.target.value)}
                    className="ingredient-select"
                  >
                    <option value="">Select product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="ingredient-quantity-input"
                    step="0.01"
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="ingredient-unit-select"
                  >
                    <option value="">Unit</option>
                    {UNITS.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="remove-ingredient-button"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="button button-secondary button-small"
              >
                + Add Ingredient
              </button>
            </div>
          </div>

          <div className="form-group">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notes (optional)"
              rows="3"
            />
          </div>

          {!recipe && (
            <button type="submit" className="button">
              Create Recipe
            </button>
          )}

          {recipe && (
            <button
              type="button"
              className="button button-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
}

export default RecipeModal;
