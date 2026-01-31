import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import ToggleButton from './ToggleButton';

const UNITS = ['kg', 'g', 'L', 'ml', 'units', 'pcs'];

function ProductModal({ product, stores, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    quantity: '',
    unit: '',
    storeId: [],
    inStock: false,
    notes: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        photo: product.photo || '',
        quantity: product.quantity || '',
        unit: product.unit || '',
        storeId: product.storeId ? [product.storeId] : [],
        inStock: product.inStock || false,
        notes: product.notes || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    
    if (product) {
      saveProduct(newFormData);
    }
  };

  const handleImageChange = (path) => {
    const newFormData = { ...formData, photo: path };
    setFormData(newFormData);
    if (product) {
      saveProduct(newFormData);
    }
  };

  const handleToggle = (field, value) => {
    const newFormData = { ...formData, [field]: value };
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
    if (product && window.confirm('Delete this product?')) {
      try {
        await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
        onClose();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const toggleStoreSelection = (storeId) => {
    const newStoreIds = formData.storeId.includes(storeId)
      ? formData.storeId.filter(id => id !== storeId)
      : [...formData.storeId, storeId];
    
    const newFormData = { ...formData, storeId: newStoreIds };
    setFormData(newFormData);
    if (product) {
      saveProduct(newFormData);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="product-modal">
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'New Product'}</h2>
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
              placeholder="Product name *"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="field-label">Unit</label>
            <div className="toggle-button-group">
              {UNITS.map(unit => (
                <ToggleButton
                  key={unit}
                  active={formData.unit === unit}
                  onClick={() => handleToggle('unit', unit)}
                  small
                >
                  {unit}
                </ToggleButton>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="field-label">Stores</label>
            <div className="toggle-button-group">
              {stores.map(store => (
                <ToggleButton
                  key={store.id}
                  active={formData.storeId.includes(store.id)}
                  onClick={() => toggleStoreSelection(store.id)}
                  small
                >
                  {store.name}
                </ToggleButton>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="field-label">Status</label>
            <div className="toggle-button-group">
              <ToggleButton
                active={formData.inStock}
                onClick={() => handleToggle('inStock', true)}
              >
                ✓ In Stock
              </ToggleButton>
              <ToggleButton
                active={!formData.inStock}
                onClick={() => handleToggle('inStock', false)}
              >
                ✗ To Buy
              </ToggleButton>
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

          {!product && (
            <button type="submit" className="button">
              Create Product
            </button>
          )}

          {product && (
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

export default ProductModal;
