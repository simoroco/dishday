import React, { useState, useEffect } from 'react';
import './ShoppingTab.css';
import ProductModal from './ProductModal';

function ShoppingTab() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchStores();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filterStore, filterStatus]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStore) params.append('storeId', filterStore);
      if (filterStatus) params.append('inStock', filterStatus);

      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores');
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  return (
    <div className="shopping-tab">
      <div className="shopping-header">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="filters">
          <select
            className="filter-select"
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
          >
            <option value="">Tous les magasins</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="true">En stock</option>
            <option value="false">À acheter</option>
          </select>
        </div>

        <button className="add-button" onClick={handleAddNew}>
          + Ajouter un produit
        </button>
      </div>

      <div className="products-list">
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <div className="empty-state-text">Aucun produit trouvé</div>
            <div className="empty-state-subtext">Ajoutez votre premier produit</div>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                {product.photo && (
                  <img src={product.photo} alt={product.name} className="product-image" />
                )}
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  {product.quantity && (
                    <div className="product-quantity">
                      {product.quantity} {product.unit}
                    </div>
                  )}
                  {product.store && (
                    <div className="product-store">📍 {product.store.name}</div>
                  )}
                  <div className={`product-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? '✓ En stock' : '✗ À acheter'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={selectedProduct}
          stores={stores}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ShoppingTab;
