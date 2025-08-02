import { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import signerInfo from '../../test/test_signers01_amas';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './PdfView.css';
import useCreateSignTemplateState from './state/CreateSignTemplateState';

interface Signature {
  pageNumber: number;
  signature: string;
  x: number;
  y: number;
}

interface DragItem {
  type: string;
  x: number;
  y: number;
  id: string;
  pageNumber: number;
}

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfView() {
    const createSignTemplateState = useCreateSignTemplateState()
  const [numPages, setNumPages] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
//   const [signatures, setSignatures] = useState([]);
  const [lastSignature, setLastSignature] = useState<Signature | null>(null);
  const [userId, setUserId] = useState("halilagin");
  const [mySign, setMySign] = useState<Signature | null>(null);
  const [dragItems, setDragItems] = useState<DragItem[]>([]);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const navigate = useNavigate();


  // Add loading handler
  function onLoadProgress() {
    setIsLoading(true);
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  // Memoize the options object
  const pdfOptions = useMemo(() => ({
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    // disableAnnotationLayer: true
  }), []); // Empty dependency array since these options don't change

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if this is a repositioning of an existing item
    const itemId = e.dataTransfer.getData('text/plain');
    const existingItem = dragItems.find(item => item.id === itemId);

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    // Calculate position relative to the container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Define item dimensions (you can adjust these values)
    const itemWidth = 80;  // Approximate width of the item
    const itemHeight = 40; // Approximate height of the item

    // Center the item on the mouse cursor
    const centeredX = x - (itemWidth / 2);
    const centeredY = y - (itemHeight / 2);

    // Ensure the position is within the container bounds
    const boundedX = Math.max(0, Math.min(centeredX, rect.width - itemWidth));
    const boundedY = Math.max(0, Math.min(centeredY, rect.height - itemHeight));

    if (existingItem) {
      // This is a repositioning of an existing item
      setDragItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, x: boundedX, y: boundedY }
          : item
      ));
      return;
    }

    // This is a new item from SigningTypeList
    const type = e.dataTransfer.getData('text/plain');

    const newDragItem: DragItem = {
      type,
      x: boundedX,
      y: boundedY,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pageNumber: createSignTemplateState.pdfViewPageNumber
    };

    setDragItems(prev => [...prev, newDragItem]);
  };

  const handleItemDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleItemDragEnd = () => {
    setDraggedItemId(null);
  };

  return (
    <div style={{ 
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      width: '100%',
      minHeight: '800px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Document
        file="/sample-contract.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadProgress={onLoadProgress}
        loading={<div>Loading PDF...</div>}
        options={pdfOptions}
      >
        <div 
          style={{ 
            position: 'relative',
            backgroundColor: '#fff',
            width: '600px',
            minHeight: '800px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Page 
            pageNumber={createSignTemplateState.pdfViewPageNumber} 
            width={600}
            loading={
              <div style={{ 
                width: '600px',
                height: '800px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f5f5'
              }}>
                Loading page...
              </div>
            }
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
          {!isLoading && lastSignature && lastSignature.pageNumber === createSignTemplateState.pdfViewPageNumber && (
            <img
              src={lastSignature.signature}
              alt="Signature"
              style={{
                position: 'absolute',
                left: lastSignature.x,
                top: lastSignature.y,
                maxWidth: '200px',
                pointerEvents: 'none',
              }}
            />
          )}
          {dragItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleItemDragStart(e, item.id)}
              onDragEnd={handleItemDragEnd}
              style={{
                position: 'absolute',
                left: item.x,
                top: item.y,
                padding: '8px 12px',
                backgroundColor: draggedItemId === item.id ? '#ffe0b2' : '#fff3e0',
                border: draggedItemId === item.id ? '2px solid #ff9800' : '1px solid #ff9800',
                borderRadius: '4px',
                cursor: 'move',
                pointerEvents: 'auto',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: draggedItemId === item.id ? 1000 : 1,
                transition: draggedItemId === item.id ? 'none' : 'all 0.2s ease',
                minWidth: '60px',
                textAlign: 'center'
              }}
            >
              {item.type}
            </div>
          ))}
        </div>
      </Document>
      <div className="pdf-controls">
        <button 
          disabled={createSignTemplateState.pdfViewPageNumber <= 1} 
          onClick={() => createSignTemplateState.setPdfViewPageNumber(createSignTemplateState.pdfViewPageNumber - 1)}
        >
          <ArrowBackIcon />
        </button>
        <span>
          Page {createSignTemplateState.pdfViewPageNumber} of {numPages}
        </span>
        <button
          disabled={!numPages || createSignTemplateState.pdfViewPageNumber >= numPages}
          onClick={() => createSignTemplateState.setPdfViewPageNumber(createSignTemplateState.pdfViewPageNumber + 1)}
        >
          <ArrowForwardIcon />
        </button>
      </div>
    </div>
  );
}

export default PdfView;
