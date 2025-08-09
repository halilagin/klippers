import React from 'react';
import SelectSignerForLocatingSign from './SelectSignerForLocatingSign';
import SigningTypeList from './SigningTypeList';
import useCreateSignTemplateState from './state/CreateSignTemplateState';
import SaveDocument from './SaveDocument';
import { Paper, Stack } from '@mui/material';

const LeftPane = () => {
    const createSignTemplateState = useCreateSignTemplateState();

    return (
        <Paper variant="outlined" sx={{
            p: { xs: 2, md: 3 },
            bgcolor: '#f5f5f5',
            borderRadius: 2,
            height: '100%'
        }}>
            <Stack spacing={3}>
                <SelectSignerForLocatingSign />
                {createSignTemplateState.signers.filter(signer => signer.id === createSignTemplateState.activeSignerId).length==1 &&
                            <SigningTypeList />
                }
                <SaveDocument />
            </Stack>
        </Paper>
    );
};

export default LeftPane;
