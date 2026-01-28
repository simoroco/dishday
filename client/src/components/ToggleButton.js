import React from 'react';
import './ToggleButton.css';

function ToggleButton({ active, onClick, children, small }) {
  return (
    <button
      type="button"
      className={`toggle-button ${active ? 'active' : ''} ${small ? 'small' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default ToggleButton;
