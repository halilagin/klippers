import { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import signerInfo from '../../test/test_signers01_amas';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../prepare_signer_template//PdfView.css';
import useCreateSignTemplateState from '../prepare_signer_template/state/CreateSignTemplateState';
import { SignatureInPDF, SignatureInPDFFromJSONTyped } from '@/api/models/SignatureInPDF';
import { DocumentApiClient } from '@/api/client/DocumentApiClient';
import appConfig from '@/AppConfig';
import { PDFFile, PDFFileBase64FromJSON } from '@/api';




// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function SignedPdfView() {

    const createSignTemplateState = useCreateSignTemplateState()
    const [numPages, setNumPages] = useState<number | null>(null);
  
    const [isLoading, setIsLoading] = useState(true);
//   const [signatures, setSignatures] = useState([]);
    const [documentId, setDocumentId] = useState("");

    const [pdfFileBase64, setPdfFileBase64] = useState<string | null>(null);  
    


    const fetchDocument = async () => {
        // Get URL search params
        const searchParams = new URLSearchParams(window.location.search);
        const documentIdParam = searchParams.get('documentId') || searchParams.get('document_id');
        
        setDocumentId(documentIdParam || "");
        
        const documentApiClient = new DocumentApiClient(appConfig.baseApiUrl, localStorage.getItem('access_token') || '');
        const response = await documentApiClient.getSignedDocumentPdfFile(documentIdParam || "");
        console.log("response", response["message"]);
        setPdfFileBase64(response["message"]);
    };

    useEffect(() => {
        fetchDocument();
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

  
  const pdfData = useMemo(() => {
    const base64String = pdfFileBase64
    if (base64String) {
      const binaryString = atob(base64String);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);    
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    return null;
  }, [pdfFileBase64]); // Empty dependency array means this runs once

  // NEW: Memoize the file prop object
  const pdfFile = useMemo(() => {
    return pdfData ? { data: pdfData } : null;
  }, [pdfData]); 

  const handleDownload = () => {
    if (pdfFileBase64) {
        const binaryString = atob(pdfFileBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);    
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'downloaded-file.pdf'; // Specify the file name

        // Append to the body
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

    
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
        file={pdfFile} // "/sample-contract.pdf"
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
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
}

export default SignedPdfView;
