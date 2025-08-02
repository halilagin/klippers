import { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import signerInfo from '../test/test_signers01_amas';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './DebugSignedPdfView.css';
import { SignatureInPDF } from '@/api';

interface Signature {
  pageNumber: number;
  signature: string;
  x: number;
  y: number;
}

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function DebugSignedPdfView() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
//   const [signatures, setSignatures] = useState([]);
  const [lastSignature, setLastSignature] = useState<SignatureInPDF | null>(null);
  const [userId, setUserId] = useState("halilagin");
  const [mySign, setMySign] = useState<SignatureInPDF | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSignatures = JSON.parse(localStorage.getItem('signatures') || '[]');
    if (storedSignatures && Array.isArray(storedSignatures) && storedSignatures.length > 0) {
        console.log("signers",signerInfo);
    const signer = signerInfo.find(signer => signer.id === userId);
    console.log("signer",signer);
    if (signer && signer.signatureFields && signer.signatureFields.length > 0) {
        const lastSig = signer.signatureFields[signer.signatureFields.length - 1];
        console.log("lastSig",lastSig);
        setLastSignature(lastSig);
        setMySign(lastSig);
    }

    // if (lastSignature.pageNumber) {
    //     setPageNumber(lastSignature.pageNumber);
    //   }
    }
  }, []);

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
        <div style={{ 
          position: 'relative',
          backgroundColor: '#fff',
          width: '600px',
          minHeight: '800px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Page 
            pageNumber={pageNumber} 
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
          {!isLoading && lastSignature && lastSignature.page === pageNumber && (
            <img
              src={lastSignature.signatureImage}
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
          disabled={!numPages || pageNumber >= numPages}
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          <ArrowForwardIcon />
        </button>
      </div>
    </div>
  );
}

export default DebugSignedPdfView;
