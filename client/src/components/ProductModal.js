import React, { useState, useEffect } from 'react';

function ProductModal({ product, stores, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    quantity: '',
    unit: '',
    storeId: '',
    inStock: false
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        photo: product.photo || '',
        quantity: product.quantity || '',
        unit: product.unit || '',
        storeId: product.storeId || '',
        inStock: product.inStock || false
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    setFormData(newFormData);
    
    if (product) {
      saveProduct(newFormData);
    }
  };

  const saveProduct = async (data) => {
    try {
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) {
      await saveProduct(formData);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (product && window.confirm('Supprimer ce produit ?')) {
      try {
        await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
        onClose();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Modifier le produit' : 'Nouveau produit'}</h2>
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
            <label>Quantité</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Unité</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="kg, L, unités..."
            />
          </div>

          <div className="form-group">
            <label>Magasin</label>
            <select
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
            >
              <option value="">Aucun</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                style={{ width: 'auto' }}
              />
              En stock
            </label>
          </div>

          {!product && (
            <button type="submit" className="button">
              Créer le produit
            </button>
          )}

          {product && (
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

export default ProductModal;
