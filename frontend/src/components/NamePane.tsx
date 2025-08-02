import React, { useRef, useState, useEffect } from 'react';

interface SignerPaneProps {
  position: { x: number; y: number };
  onClose: () => void;
  onSave: (signatureData: string) => void;
  pageNumber: number;
}

const InitialPane: React.FC<SignerPaneProps> = ({ position, onClose, onSave, pageNumber }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const [name, setName] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSave = () => {
    onSave(name);
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
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Enter name"
        style={{
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          width: '200px'
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