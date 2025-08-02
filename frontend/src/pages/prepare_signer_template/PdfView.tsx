import { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './PdfView.css';
import useCreateSignTemplateState from './state/CreateSignTemplateState';
import { SignatureInPDF } from '@/api/models/SignatureInPDF';
import { Signer } from '@/api/models/Signer';
import { Stack, IconButton, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';




// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfView() {
    const createSignTemplateState = useCreateSignTemplateState()
  const [numPages, setNumPages] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
//   const [signatures, setSignatures] = useState([]);
  const [userId, setUserId] = useState("halilagin");
//   const [dragItems, setDragItems] = useState<DragItem[]>([]);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const navigate = useNavigate();


  // Memoize the options object
  const pdfOptions = useMemo(() => ({
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    // disableAnnotationLayer: true
  }), []); // Empty dependency array since these options don't change

  // Add loading handler
  function onLoadProgress() {
    setIsLoading(true);
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if this is a repositioning of an existing item
    const {itemId, signType, signerId, page} = JSON.parse( e.dataTransfer.getData('text/plain'));

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


    const newSignatureField = {
        id: itemId,
        x: boundedX,
        y: boundedY,
        page: page,
        signerId: signerId,
        signType: signType,
        signature: '',
        pdfFileId: '',
        width: itemWidth,
        height: itemHeight,
        signatureImage: '',
        createdAt: new Date(),
        uploadedAt: new Date(),
        signed: false
    }


    let signersInState:Signer[] = JSON.parse( JSON.stringify(createSignTemplateState.signers)) as Signer[]
    
    for (let i=0;i<signersInState.length;i++) {
        let signer = signersInState[i]
        if (signer.id != signerId)
            continue;

        if (!signer.signatureFields) {
            signer.signatureFields = [newSignatureField]
            continue;
        }
        
        const signatureIndex = signer.signatureFields.findIndex(field => field.id === itemId);
        if (signatureIndex != -1) {//it exists in the list
            signer.signatureFields[signatureIndex] = newSignatureField
        } else { //newly appended to the list
            signer.signatureFields.push(newSignatureField)
        }
        
        
    }
    
    createSignTemplateState.setSigners(signersInState); 
    

    console.log(createSignTemplateState.signers);
  };

  const handleItemDragStart = (e: React.DragEvent, jsonData: string) => {
    const {itemId, signType} = JSON.parse(jsonData);
    setDraggedItemId(itemId);
    e.dataTransfer.setData('text/plain', jsonData);
  };

  

  const handleItemDragEnd = () => {
    setDraggedItemId(null);
  };

  // If the checks pass, attempt to render the Document
  console.log('PdfView: Attempting to render Document with pdfData.');

  // First, memoize the PDF data retrieval from localStorage (you already have this)
  const pdfData = useMemo(() => {
    const base64String = localStorage.getItem('pdfContentBase64');
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
  }, []); // Empty dependency array means this runs once

  // NEW: Memoize the file prop object
  const pdfFile = useMemo(() => {
    return pdfData ? { data: pdfData } : null;
  }, [pdfData]); // Only recalculate if pdfData changes

  return (
    <Box sx={{ 
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      width: '100%',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
        <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadProgress={onLoadProgress}
            loading={
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography>Loading PDF...</Typography>
              </Box>
            }
            options={pdfOptions}
            error={
              <Alert severity="error" sx={{ m: 2 }}>
                Failed to load PDF file. Ensure it's a valid PDF.
              </Alert>
            }
        >
          <Paper 
            elevation={2}
            sx={{ 
              position: 'relative',
              bgcolor: '#fff',
              width: { xs: '100%', sm: '600px' },
              minHeight: { xs: '70vh', sm: '800px' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'hidden',
              mt: 2,
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Page 
              pageNumber={createSignTemplateState.pdfViewPageNumber} 
              loading={
                <Box sx={{ 
                  width: { xs: '100%', sm: '600px' },
                  height: '800px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: '#f5f5f5'
                }}>
                  <CircularProgress />
                </Box>
              }
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
            
            {createSignTemplateState
              .signers.flatMap(signer => signer.signatureFields)
              .filter((field): field is SignatureInPDF => field !== undefined)
              .filter((item) => item.page == createSignTemplateState.pdfViewPageNumber)
              .map((item) => (
              <Paper
                key={item.id}
                draggable
                onDragStart={(e) => handleItemDragStart(e, JSON.stringify({signType: item.signType, itemId: item.id, signerId: item.signerId, page: item.page}))}
                onDragEnd={handleItemDragEnd}
                elevation={draggedItemId === item.id ? 4 : 1}
                sx={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  p: '4px 8px',
                  bgcolor: draggedItemId === item.id ? 'warning.light' : '#fff3e0',
                  border: `1px solid ${draggedItemId === item.id ? 'warning.main' : '#ffcc80'}`,
                  borderRadius: 1,
                  cursor: 'move',
                  pointerEvents: 'auto',
                  zIndex: draggedItemId === item.id ? 1000 : 1,
                  transition: draggedItemId === item.id ? 'none' : 'all 0.2s ease',
                  minWidth: '50px',
                  textAlign: 'center'
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                  {item.signType}
                </Typography>
              </Paper>
            ))}
          </Paper>
        </Document>
        {/* Pagination Controls */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
          <IconButton 
            disabled={createSignTemplateState.pdfViewPageNumber <= 1} 
            onClick={() => createSignTemplateState.setPdfViewPageNumber(createSignTemplateState.pdfViewPageNumber - 1)}
            size="small"
            aria-label="previous page"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Page {createSignTemplateState.pdfViewPageNumber} of {numPages}
          </Typography>
          <IconButton
            disabled={!numPages || createSignTemplateState.pdfViewPageNumber >= numPages}
            onClick={() => createSignTemplateState.setPdfViewPageNumber(createSignTemplateState.pdfViewPageNumber + 1)}
            size="small"
            aria-label="next page"
          >
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
    </Box>
  );
}

export default PdfView;
