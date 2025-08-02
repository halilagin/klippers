import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import signerInfo from '../test/test_signers01_amas';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './SignedPdfView.css';
import { Signer } from '@/api/models/Signer';
import { SignatureInPDF } from '@/api/models/SignatureInPDF';



// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function SignedPdfView() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [storedSignatures, setStoredSignatures] = useState<Signer[]>([]);
  const [userId, setUserId] = useState("berfinagin");
  
  const navigate = useNavigate();

  useEffect(() => {
    console.log("signerInfo",signerInfo);
    let signatures:Signer[] = JSON.parse(localStorage.getItem('signatures') || '[]');
    setStoredSignatures(signatures);

    if (signatures.length === 0) {
        setStoredSignatures(signerInfo);
    }
    
    // if (storedSignatures && Array.isArray(storedSignatures) && storedSignatures.length > 0) {
    //     console.log("signers",signerInfo);
    // const signer:Signer = signerInfo.find(signer => signer.id === userId) as Signer;
    // console.log("signer",signer);
    // if (signer !== undefined && signer.signatureFields !== undefined) {
    //     const lastSig = signer.signatureFields[signer.signatureFields.length - 1];
    //     console.log("lastSig",lastSig);
    //     setLastSignature(lastSig);
    //     setMySign(lastSig);
    // }

    // }
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-viewer">
      <Document
        file="/sample-contract.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <div style={{ position: 'relative' }}>
          <Page pageNumber={pageNumber} />
          
            {storedSignatures.filter((signer:Signer) => signer.id === userId)
            .filter((signer:Signer) => signer.signatureFields !== undefined && signer.signatureFields.length > 0)
            .flatMap(signer => signer.signatureFields || [])
            .filter((signatureField: SignatureInPDF) => signatureField.page === pageNumber)
            .map((signatureField: SignatureInPDF) => (
                <img
                    key={signatureField.id}
                    src={signatureField.signatureImage}
                    alt="Signature"
                    style={{
                        position: 'absolute',
                        left: signatureField.x,
                        top: signatureField.y,
                        maxWidth: '200px',
                        pointerEvents: 'none',
                    }}
                />
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
          disabled={!numPages || pageNumber >= numPages}
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          <ArrowForwardIcon />
        </button>
      </div>
    </div>
  );
}

export default SignedPdfView;
