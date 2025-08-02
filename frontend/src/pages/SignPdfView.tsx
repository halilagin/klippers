import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './SignPdfView.css';
import SignerPane from '../components/SignerPane';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function SignPdfView({ onDone }: { onDone: () => void }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [showSignerModal, setShowSignerModal] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handlePageClick = (event:any) => {
    const pdfContainer = event.currentTarget;
    const rect = pdfContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setClickPosition({ x, y });
    setShowSignerModal(true);
  };

  const closeSignerPane = () => {
    setShowSignerModal(false);
  };

  return (
    <div className="sign-pdf-view">
      <h1>Sign PDF</h1>
      <div className={`pdf-container ${showSignerModal ? 'disabled' : ''}`}>
        <Document
          file="/sample-contract.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          className="pdf-document"
        >
          <Page
            pageNumber={pageNumber}
            onClick={handlePageClick}
          />
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
      {showSignerModal && (
        <SignerPane 
          onClose={closeSignerPane}
          pageNumber={pageNumber}
          position={clickPosition}
          onSave={() => {}}
        />
      )}
      <div className="button-container">
        
        <button className="btn btn-done" onClick={onDone}>Preview</button>
      </div>
    </div>
  );
}

export default SignPdfView; 