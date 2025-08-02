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
import { Signer } from '@/api/models/Signer';
import { DocumentApiClient } from '@/api/client/DocumentApiClient';
import appConfig from '@/AppConfig';
import { SignFieldComponent } from './SignFieldComponent';
import { PDFFile, PDFFileBase64FromJSON } from '@/api';



// interface DragItem {
//   type: string;
//   x: number;
//   y: number;
//   id: string;
//   pageNumber: number;
// }

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function SignerSigningPdfView() {

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
        const signerIdParam = searchParams.get('signerId') || searchParams.get('signer_id');
        
        setDocumentId(documentIdParam || "");
        
        createSignTemplateState.setActiveSignerId(signerIdParam || "");
        const documentApiClient = new DocumentApiClient(appConfig.baseApiUrl, localStorage.getItem('access_token') || '');
        console.log("documentId",documentIdParam);
        // pdfIdSignatureIdMap: <pdfid, signatureid>
        const {document, signaturePerPdfId} = await documentApiClient.getDocumentWithSignatures(documentIdParam || "", signerIdParam || "");

        
        console.log("document",document);
        console.log("signaturePerPdfId", Object.values(signaturePerPdfId)[0]);
        createSignTemplateState.setDocument(document);
        createSignTemplateState.setSignaturePerPdfId(signaturePerPdfId);
        // localStorage.setItem('remotePdfContentBase64', document.pdf_files[0].file_data_base64);
        // console.log("read from remote: pdfContentBase64", localStorage.getItem('remotePdfContentBase64'))

        const pdfFiles = await documentApiClient.getPublicDocumentPdfFiles(documentIdParam || "");
        if (!pdfFiles || pdfFiles.length == 0) {
            console.error("No PDF files found for document", documentIdParam);
            return;
        }
        console.log("pdfFiles", pdfFiles);

        const pdfFile = PDFFileBase64FromJSON(pdfFiles[0] );
        setPdfFileBase64(pdfFile.fileDataBase64);
        // localStorage.setItem('remotePdfContentBase64', pdfFile.fileDataBase64);
        // console.log("read from remote: pdfContentBase64", localStorage.getItem('remotePdfContentBase64'))

        // createSignTemplateState.setSignaturePerPdfId(signaturePerPdfId);

        // const signatureFields = await documentApiClient.getSignatureInPdfBySignerId(signerIdParam || "");
        
        // const signers = document.signers || [];
        // if (signers.length > 0) {
        //     signers[0].signatureFields = signatureFields.map(field => SignatureInPDFFromJSONTyped(field, true));
        // }
        
        // createSignTemplateState.setSigners(signers);
        
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
        <p>SignerSigningPdfView</p>
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
            alignItems: 'flex-start'
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
          
          {(Object.values(createSignTemplateState.signaturePerPdfId || {})[0] || [])
            .filter(signatureField => signatureField.signerId == createSignTemplateState.activeSignerId)
            .filter((item) => item.page == createSignTemplateState.pdfViewPageNumber)
            .map((item) => (
                <SignFieldComponent 
                key={item.id}
                item={item}
                clickHandler={(item) => {
                    //   console.log("item", item);
                }}
              />
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

export default SignerSigningPdfView;
