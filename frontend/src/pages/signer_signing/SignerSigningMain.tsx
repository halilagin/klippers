import React from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import SignerSigningPdfView from './SignerSigningPdfView';
import useCreateSignTemplateState from '../prepare_signer_template/state/CreateSignTemplateState';
import SignerSigningFinalize from './SignerSigningFinalize';

const SignerSigningMain: React.FC = () => {
    const createSignTemplateState  = useCreateSignTemplateState()
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={9.6}>  {/* 80% width */}
          <SignerSigningPdfView />
        </Grid>
        <Grid item xs={2.4}>  {/* 20% width */}
         <SignerSigningFinalize />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignerSigningMain;
