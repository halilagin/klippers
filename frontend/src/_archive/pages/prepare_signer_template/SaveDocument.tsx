import React, { Component, useState } from 'react';
import useCreateSignTemplateState from './state/CreateSignTemplateState';
import { DocumentApiClient } from '@/api/client/DocumentApiClient';
import appConfig from '@/AppConfig';
import { blobToBase64, calculateMD5Hash, createSignatureImageBase64 } from '@/api/client/document-cli';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';

const SaveDocumentComponent = ({}) => {

    const [isSaved, setIsSaved] = useState(false);
    const createSignTemplateState = useCreateSignTemplateState();
    
    const handleSave = async () => {
        // Add loading state if needed
        // setIsLoading(true);
        try { // Add try block
            const document = createSignTemplateState.document;
            if (!document) {
                console.error('Document is null');
                return;
            }
            const documentApiClient = new DocumentApiClient(appConfig.baseApiUrl, localStorage.getItem('access_token') || '');
            const createdDocument = await documentApiClient.createDocument(
                document.title,
                "user",
                "init"
            );
            // createSignTemplateState.setDocument(createdDocument);
            const documentId = createdDocument.message;

            // const binaryData = new Uint8Array([72, 101, 108, 108, 111]);
            const base64String = localStorage.getItem('pdfContentBase64');
            if (!base64String) {
                console.error('pdfContentBase64 is null or empty');
                return;
            }
            // const binaryData = atob(base64String);
            // const blob = new Blob([binaryData], { type: 'application/pdf' });
            // const base64Data = await blobToBase64(blob);
            const fileSize = 1//blob.size;
            const md5Hash = ""// await calculateMD5Hash(blob);
            const addedPdfFile = await documentApiClient.addPdfFile(
                documentId,
                base64String,
                fileSize,
                md5Hash
            );

            const pdfFileId: string = addedPdfFile["message"]
            // let singerIds: string[] = [] // Store promises instead
            // let signatureFieldIds: string[] = [] // Store promises instead
            
            const signerPromises = createSignTemplateState.signers.map(async (signer) => { // Use map to create promises
                const addedSigner = await documentApiClient.createSigner(
                    documentId,
                    signer.email,
                    signer.name,
                    signer.order ?? 0
                );
                // singerIds.push(addedSigner.id); // Can collect IDs later if needed
                const signatureFieldPromises = (signer.signatureFields || []).map(async (signatureField) => { // Use map for inner promises
                    const addedSignatureField = await documentApiClient.createSignatureInPdf(
                        pdfFileId,
                        addedSigner.id,
                        {
                            page: signatureField.page, // pdfjs is 0-indexed
                            x: signatureField.x,
                            y: signatureField.y,
                            width: 200,
                            height: 50,
                            signature_image_base64: await createSignatureImageBase64(),
                            sign_type: signatureField.signType
                        }
                    );
                    // signatureFieldIds.push(addedSignatureField.message); // Can collect IDs later if needed
                    return addedSignatureField.message; // Return value from promise
                });
                await Promise.all(signatureFieldPromises); // Wait for all signature fields for this signer
                return addedSigner.id; // Return value from promise
            });

            // Wait for all signer and signature field operations to complete
            const resolvedSignerIds = await Promise.all(signerPromises);
    
    
            setIsSaved(true); // Set state only after all promises resolve
        } catch (error) {
            console.error("Failed to save document:", error);
            // Optionally: Provide feedback to the user about the error
            // setIsSaved(false); // Ensure state is not true if save fails
        } finally {
            // Reset loading state if used
            // setIsLoading(false);
        }
    }   

    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color={isSaved ? "success" : "primary"}
          onClick={handleSave} 
          disabled={isSaved}
          startIcon={isSaved ? <CheckIcon /> : <CloudUploadIcon />}
          sx={{ 
            bgcolor: isSaved ? undefined : '#455cff',
            boxShadow: 'none', 
            borderRadius: '20px', 
            textTransform: 'none', 
            '&:hover': { 
              bgcolor: isSaved ? undefined : '#3a4edc',
              boxShadow: 'none' 
            } 
          }}
        >
            {isSaved ? 'Saved' : 'Save Document'}
            
        </Button>
        {isSaved && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Success</AlertTitle>
              Document saved successfully. You can go back to the dashboard to see the progress.
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={() => window.location.href = '/dashboard'}>
                  Go back to dashboard
                </Button>
              </Box>
            </Alert>
          )}
      </Box>
    );

}

export default SaveDocumentComponent;



