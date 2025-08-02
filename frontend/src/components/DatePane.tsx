import React, { useRef, useState, useEffect } from 'react';

interface SignerPaneProps {
  position: { x: number; y: number };
  onClose: () => void;
  onSave: (signatureData: string) => void;
  pageNumber: number;
}

const InitialPane: React.FC<SignerPaneProps> = ({ position, onClose, onSave, pageNumber }) => {

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSave = () => {
    onSave(selectedDate);
    onClose();
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}
    >
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        style={{
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '6px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: 'white'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '6px 12px',
            border: '1px solid #007bff',
            borderRadius: '4px',
            background: '#007bff',
            color: 'white'
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default InitialPane; 