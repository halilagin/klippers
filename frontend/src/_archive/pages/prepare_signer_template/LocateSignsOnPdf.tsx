import React, { useState } from 'react';
import PdfView from './PdfView copy';
import useCreateSignTemplateState from './state/CreateSignTemplateState';
import SelectSignerForLocatingSign from './SelectSignerForLocatingSign';
import LeftPane from './LeftPane';
import { Grid, Box } from '@mui/material';


const LocateSignsOnPdf = () => {
    const createSignTemplateState = useCreateSignTemplateState()

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={8}>
            <PdfView />
        </Grid>

        <Grid item xs={12} md={4}>
            <LeftPane />
        </Grid>
    </Grid>
  );
};

export default LocateSignsOnPdf;
