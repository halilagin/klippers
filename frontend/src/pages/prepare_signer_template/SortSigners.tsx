import React, { useState } from 'react';
import useCreateSignTemplateState from './state/CreateSignTemplateState';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Typography,
  Box,
  Switch,
  FormControlLabel
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const SortSigners: React.FC = () => {
  const createSignTemplateState = useCreateSignTemplateState();
  const [isSigningOrderEnabled, setIsSigningOrderEnabled] = useState(true);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    if (!isSigningOrderEnabled) return;
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    if (!isSigningOrderEnabled) return;
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '#e8eaf6';
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    if (!isSigningOrderEnabled) return;
    e.currentTarget.style.backgroundColor = '#f5f5f5';
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    if (!isSigningOrderEnabled) return;
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '#f5f5f5';
    
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex === dropIndex) return;

    const items = Array.from(createSignTemplateState.signers);
    const [draggedItem] = items.splice(dragIndex, 1);
    items.splice(dropIndex, 0, draggedItem);

    const updatedItems = items.map((signer, index) => ({
      ...signer,
      order: index
    }));

    createSignTemplateState.setSigners(updatedItems);
    console.log("updatedItems", updatedItems)
  };

  const handleToggleSigningOrder = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSigningOrderEnabled(event.target.checked);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Set Signing Order
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Drag and drop to reorder the signing sequence
      </Typography>

      <FormControlLabel
        control={
          <Switch 
            checked={isSigningOrderEnabled} 
            onChange={handleToggleSigningOrder} 
            sx={{ 
              '& .MuiSwitch-track': {
                backgroundColor: 'grey.300',
                opacity: 1,
              },
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#fff',
                '& + .MuiSwitch-track': {
                  backgroundColor: '#34C759',
                  opacity: 1,
                },
              },
              '& .MuiSwitch-thumb': {
                color: '#fff',
              }
            }}
          />
        }
        label="Enable Signing Order"
        sx={{ mt: 1, mb: 2 }}
      />

      {/* Conditionally render based on signers list */} 
      {createSignTemplateState.signers.length === 0 ? (
          // If no signers, just show the text
          <Typography sx={{ textAlign: 'center', p: 3, color: 'text.secondary', mt: 2 }}>
               No signers added yet. Add signers to arrange their order.
          </Typography>
      ) : (
          // If signers exist, show the Paper container and the list
          <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
            <List>
              {/* Map over signers inside the List */} 
              {createSignTemplateState.signers.map((signer, index) => (
                <ListItem
                  key={signer.id}
                  draggable={isSigningOrderEnabled}
                  onDragStart={isSigningOrderEnabled ? (e) => handleDragStart(e, index) : undefined}
                  onDragOver={isSigningOrderEnabled ? handleDragOver : undefined}
                  onDragLeave={isSigningOrderEnabled ? handleDragLeave : undefined}
                  onDrop={isSigningOrderEnabled ? (e) => handleDrop(e, index) : undefined}
                  sx={{
                    mb: 1,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    cursor: isSigningOrderEnabled ? 'grab' : 'default',
                    opacity: isSigningOrderEnabled ? 1 : 0.7,
                    '&:hover': { bgcolor: isSigningOrderEnabled ? '#e0e0e0' : '#f5f5f5' }
                  }}
                >
                  <DragIndicatorIcon sx={{ mr: 2, cursor: isSigningOrderEnabled ? 'grab' : 'default', color: isSigningOrderEnabled ? 'action.active' : 'action.disabled' }} />
                  <Typography sx={{ minWidth: 30, mr: 2, color: 'text.secondary' }}>
                    {isSigningOrderEnabled ? `${index + 1}.` : '-'}
                  </Typography>
                  <ListItemText
                    primary={signer.name}
                    secondary={signer.email}
                  />
                </ListItem>
              ))}
            </List> {/* Close List */} 
          </Paper>
      )}
    </Box>
  );
};

export default SortSigners;
