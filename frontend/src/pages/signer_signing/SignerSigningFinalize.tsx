import React, { useEffect, useState } from 'react';
import { Box, Button, Alert, AlertTitle } from '@mui/material';
import Grid from '@mui/material/Grid';
import SignerSigningPdfView from './SignerSigningPdfView';
import useCreateSignTemplateState from '../prepare_signer_template/state/CreateSignTemplateState';
import { SignatureInPDF } from '@/api';
import { DocumentApiClient } from '@/api/client/DocumentApiClient';
import appConfig from '@/AppConfig';

const SignerSigningFinalize: React.FC = () => {
    const createSignTemplateState  = useCreateSignTemplateState()
    const [allSigned, setAllSigned] = useState(false)
    const [isSaved, setIsSaved] = useState(false);
    useEffect(()=> {


        let key = Object.keys(createSignTemplateState.signaturePerPdfId || {})[0]
        const pdfSignatureFields = createSignTemplateState.signaturePerPdfId[key] as SignatureInPDF[];

        if (!pdfSignatureFields) return;

        const someNotSignedCount = pdfSignatureFields

            .filter((item): item is SignatureInPDF => item !== undefined)
            .filter((item) => item.signerId == createSignTemplateState.activeSignerId)
            .filter((item) =>item.signed !== true).length
        const someNotSigned = someNotSignedCount > 0

        if(someNotSigned){
            console.log("some not signed", someNotSignedCount)
        } else {
            console.log("all signed", someNotSignedCount)
            setAllSigned(true)
        }
        
    },[createSignTemplateState.signaturePerPdfId])

    const handleFinalize = async () => {
        if (!createSignTemplateState.document){
            alert("No document found")
            return
        }
        if (!createSignTemplateState.signaturePerPdfId){
            alert("No PDF file found")
            return
        }

        
        const documentApiClient = new DocumentApiClient(appConfig.baseApiUrl, localStorage.getItem('access_token') || '');
        
        let key = Object.keys(createSignTemplateState.signaturePerPdfId || {})[0]
        const pdfSignatureFields = createSignTemplateState.signaturePerPdfId[key] as SignatureInPDF[];

        if (!pdfSignatureFields) return;

        const signedSignatureFields = pdfSignatureFields
            .filter((item): item is SignatureInPDF => item !== undefined)
            .filter((item) => item.signerId == createSignTemplateState.activeSignerId)
            .filter((item) => item.signed === true)
        

        const transformedFields = {
            ids: signedSignatureFields.map(f => f.id),
            signature_image_base64s: signedSignatureFields.map(f => f.signatureImage),
        };

        const response = await documentApiClient.updateAllSignaturesInPdfWithSigned(
            createSignTemplateState.document.id,
            createSignTemplateState.activeSignerId,
            transformedFields.ids,
            transformedFields.signature_image_base64s,
            
        );

        if (response.status === 200) {
            setIsSaved(true);
        } else {
            alert("Failed to update signatures")
        }
    }

  return (
        <div>
          {isSaved && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Success</AlertTitle>
              Document saved successfully. You can go back to the dashboard to see the progress. <br/>
              {/* <Button variant="contained" onClick={() => window.location.href = '/dashboard'}>
                Go back to dashboard
              </Button> */}
            </Alert>
          )}
          <Button variant="contained" disabled = { !allSigned || isSaved }  fullWidth onClick={handleFinalize}>
            Finalize
          </Button> 
        
        </div>
  );
};

export default SignerSigningFinalize;
