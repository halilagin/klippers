import React from 'react';
import SignerList from './SignerList';
import { useCreateSignTemplateState } from './state/CreateSignTemplateState';
import SigningTemplateTab from "@/pages/prepare_signer_template/SigningTemplateTab"
import { Box, Typography, Container } from '@mui/material';

const PrepareSignerTemplateMain = () => {
    const createSignTemplateState = useCreateSignTemplateState()
    // createSignTemplateState.setDocument(document)
    // createSignTemplateState.setSigners(signers)
    // createSignTemplateState.setSignatureFields(signatureFields)
    
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
        Prepare Signer Template
      </Typography>
      <SigningTemplateTab />
    </Container>
  );
};

export default PrepareSignerTemplateMain; 