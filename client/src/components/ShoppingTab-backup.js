import React, { useState, useEffect } from 'react';
import './ShoppingTab.css';
import ProductModal from './ProductModal';
import StoresModal from './StoresModal';
import ToggleButton from './ToggleButton';

function ShoppingTab() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState([]);
  const [filterStatus, setFilterStatus] = useState('false');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStoresModal, setShowStoresModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchStores();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterStore, filterStatus]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStore.length > 0) {
        filterStore.forEach(storeId => params.append('storeId', storeId));
      }
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

  const toggleStore = (storeId) => {
    setFilterStore(prev => {
      if (prev.includes(storeId)) {
        return prev.filter(id => id !== storeId);
      } else {
        return [...prev, storeId];
      }
    });
  };

  return (
    <div className="shopping-tab">
      {!showSearch && (
        <div className="floating-buttons">
          <button className="floating-btn search-btn" onClick={() => setShowSearch(true)}>
            🔍
          </button>
          <button className="floating-btn add-btn" onClick={handleAddNew}>
            +
          </button>
        </div>
      )}

      {showSearch && (
        <div className="shopping-header">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="filter-buttons">
          <ToggleButton
            active={filterStore === ''}
            onClick={() => setFilterStore('')}
            small
          >
            All Stores
          </ToggleButton>
          {stores.map(store => (
            <ToggleButton
              key={store.id}
              active={filterStore === store.id.toString()}
              onClick={() => setFilterStore(store.id.toString())}
              small
            >
              {store.name}
            </ToggleButton>
          ))}
        </div>

        <div className="filter-buttons">
          <ToggleButton
            active={filterStatus === ''}
            onClick={() => setFilterStatus('')}
            small
          >
            All Status
          </ToggleButton>
          <ToggleButton
            active={filterStatus === 'true'}
            onClick={() => setFilterStatus('true')}
            small
          >
            ✓ In Stock
          </ToggleButton>
          <ToggleButton
            active={filterStatus === 'false'}
            onClick={() => setFilterStatus('false')}
            small
          >
            ✗ To Buy
          </ToggleButton>
        </div>

        <button className="add-button" onClick={handleAddNew}>
          + Add Product
        </button>
      </div>

      <div className="products-list">
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <div className="empty-state-text">No products found</div>
            <div className="empty-state-subtext">Add your first product</div>
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
                    {product.inStock ? '✓ In stock' : '✗ To buy'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="settings-button" onClick={() => setShowStoresModal(true)}>
        ⚙️ Manage Stores
      </button>

      {showModal && (
        <ProductModal
          product={selectedProduct}
          stores={stores}
          onClose={handleCloseModal}
        />
      )}

      {showStoresModal && (
        <StoresModal onClose={() => setShowStoresModal(false)} />
      )}
    </div>
  );
}

export default ShoppingTab;
