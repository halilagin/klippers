import { useState } from "react";
import useCreateSignTemplateState from "./state/CreateSignTemplateState";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    SelectChangeEvent
} from '@mui/material';




const SelectSignerForLocatingSign = () => {
    const createSignTemplateState = useCreateSignTemplateState();

    const handleSignerChange = (event: SelectChangeEvent<string>) => {
        createSignTemplateState.setActiveSignerId(event.target.value as string);
    };

    return (
        <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth size="small">
                <InputLabel id="select-signer-label">Select Signer</InputLabel>
                <Select
                    labelId="select-signer-label"
                    id="select-signer"
                    value={createSignTemplateState.activeSignerId || ''}
                    label="Select Signer"
                    onChange={handleSignerChange}
                    sx={{ 
                        bgcolor: 'background.paper',
                        '&:hover': { 
                            bgcolor: 'background.paper'
                        }
                    }}
                >
                    <MenuItem value="">
                        <em>Select a signer</em>
                    </MenuItem>
                    {createSignTemplateState.signers.map((signer) => (
                        <MenuItem key={signer.id} value={signer.id}>
                            {signer.name} ({signer.email})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {createSignTemplateState.activeSignerId && (
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Selected: {createSignTemplateState.signers.find(s => s.id === createSignTemplateState.activeSignerId)?.name}
                </Typography>
            )}
        </Box>
    );
};

export default SelectSignerForLocatingSign;