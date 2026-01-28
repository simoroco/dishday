import React, { useState, useEffect } from 'react';
import './RecipeModal.css';

function RecipeModal({ recipe, products, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    prepTime: '',
    cookTime: '',
    mealType: 'lunch',
    ingredients: []
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
        })) || []
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
    if (recipe && window.confirm('Supprimer cette recette ?')) {
      try {
        await fetch(`/api/recipes/${recipe.id}`, { method: 'DELETE' });
        onClose();
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{recipe ? 'Modifier la recette' : 'Nouvelle recette'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Photo (URL)</label>
            <input
              type="url"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Temps de préparation (minutes) *</label>
            <input
              type="number"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Temps de cuisson (minutes) *</label>
            <input
              type="number"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Type de repas *</label>
            <select
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              required
            >
              <option value="breakfast">Petit déjeuner</option>
              <option value="lunch">Déjeuner</option>
              <option value="dinner">Dîner</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ingrédients</label>
            <div className="ingredients-editor">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-row">
                  <select
                    value={ingredient.productId}
                    onChange={(e) => handleIngredientChange(index, 'productId', e.target.value)}
                    className="ingredient-select"
                  >
                    <option value="">Sélectionner un produit</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    placeholder="Qté"
                    className="ingredient-quantity-input"
                    step="0.01"
                  />
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    placeholder="Unité"
                    className="ingredient-unit-input"
                  />
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
                + Ajouter un ingrédient
              </button>
            </div>
          </div>

          {!recipe && (
            <button type="submit" className="button">
              Créer la recette
            </button>
          )}

          {recipe && (
            <button
              type="button"
              className="button button-danger"
              onClick={handleDelete}
            >
              Supprimer
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default RecipeModal;
