import React from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import useCreateSignTemplateState from '../prepare_signer_template/state/CreateSignTemplateState';
import SignedPdfView from './SignedPdfView';
const SignerSigningMain: React.FC = () => {
    const createSignTemplateState  = useCreateSignTemplateState()
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={9.6}>  {/* 80% width */}
          <SignedPdfView />
        </Grid>
        
      </Grid>
    </Box>
  );
};

export default SignerSigningMain;
