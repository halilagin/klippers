import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useCreateSignTemplateState from './state/CreateSignTemplateState';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DroppedItem {
  id: string;
  type: string;
  position: { x: number; y: number };
}

function PdfView() {
  const createSignTemplateState = useCreateSignTemplateState()

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [showSignerModal, setShowSignerModal] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<DroppedItem | null>(null);
  

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    createSignTemplateState.setPdfViewPageNumber(1)
  }

  const handlePageClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const pdfContainer = target.closest('.pdf-page-container');
    if (!pdfContainer) return;

    const rect = pdfContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setClickPosition({ x, y });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const pdfContainer = e.currentTarget;
    const rect = pdfContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const type = e.dataTransfer.getData('text/plain');
    const newItem: DroppedItem = {
      id: `item-${Date.now()}`,
      type,
      position: { x, y }
    };
    setDroppedItems(prev => [...prev, newItem]);
  };

  const handleItemDragStart = (e: React.DragEvent, item: DroppedItem) => {
    e.stopPropagation();
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleItemDragEnd = () => {
    setDraggedItem(null);
  };

  const handleItemDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem) return;

    const pdfContainer = e.currentTarget;
    const rect = pdfContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDroppedItems(prev => 
      prev.map(item => 
        item.id === draggedItem.id 
          ? { ...item, position: { x, y } }
          : item
      )
    );
  };

  useEffect(() => {
    console.log("createSignTemplateState.pdfViewClickPosition",createSignTemplateState.pdfViewClickPosition)
  }, [createSignTemplateState.pdfViewClickPosition])



  return (
    <div className="sign-pdf-view">
      <h1>Sign PDF</h1>
      <div className="pdf-container">
        <Document
          file="/sample-contract.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          className="pdf-document"
        >
          <div 
            className="pdf-page-container"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handlePageClick}
            style={{ position: 'relative' }}
          >
            <Page
              pageNumber={pageNumber}
            />
            {droppedItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleItemDragStart(e, item)}
                onDragEnd={handleItemDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleItemDrop}
                style={{
                  position: 'absolute',
                  left: item.position.x,
                  top: item.position.y,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  cursor: 'move',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transform: 'translate(-50%, -50%)',
                  zIndex: draggedItem?.id === item.id ? 1000 : 1,
                  userSelect: 'none',
                  touchAction: 'none',
                }}
              >
                {item.type}
              </div>
            ))}
          </div>
        </Document>
        <div className="pdf-controls">
          <button 
            disabled={pageNumber <= 1} 
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            <ArrowBackIcon />
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button 
            disabled={pageNumber >= numPages || numPages === null} 
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            <ArrowForwardIcon />
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default PdfView; 