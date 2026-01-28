import React, { useState, useEffect } from 'react';
import './StoresModal.css';

function StoresModal({ onClose }) {
  const [stores, setStores] = useState([]);
  const [editingStore, setEditingStore] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    mapsUrl: ''
  });

  useEffect(() => {
    fetchStores();
  }, []);

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

  const handleStoreClick = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name || '',
      photo: store.photo || '',
      mapsUrl: store.mapsUrl || ''
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingStore(null);
    setFormData({ name: '', photo: '', mapsUrl: '' });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    
    if (editingStore) {
      saveStore(editingStore.id, newFormData);
    }
  };

  const saveStore = async (id, data) => {
    try {
      await fetch(`/api/stores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingStore) {
      try {
        await fetch('/api/stores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        fetchStores();
        setShowForm(false);
        setFormData({ name: '', photo: '', mapsUrl: '' });
      } catch (error) {
        console.error('Error creating store:', error);
      }
    } else {
      setShowForm(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce magasin ?')) {
      try {
        await fetch(`/api/stores/${id}`, { method: 'DELETE' });
        fetchStores();
        setShowForm(false);
      } catch (error) {
        console.error('Error deleting store:', error);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Gérer les magasins</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {!showForm ? (
            <>
              <div className="stores-list">
                {stores.map(store => (
                  <div
                    key={store.id}
                    className="store-item"
                    onClick={() => handleStoreClick(store)}
                  >
                    {store.photo && (
                      <img src={store.photo} alt={store.name} className="store-image" />
                    )}
                    <div className="store-info">
                      <div className="store-name">{store.name}</div>
                      {store.mapsUrl && (
                        <div className="store-maps">📍 Lien Google Maps</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="button" onClick={handleAddNew}>
                + Ajouter un magasin
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
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
                <label>Lien Google Maps</label>
                <input
                  type="url"
                  name="mapsUrl"
                  value={formData.mapsUrl}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {!editingStore && (
                  <button type="submit" className="button">
                    Créer
                  </button>
                )}
                {editingStore && (
                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => handleDelete(editingStore.id)}
                  >
                    Supprimer
                  </button>
                )}
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Retour
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoresModal;
