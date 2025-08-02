import React, { useState, useEffect } from 'react';
import {Signer,  SignerFromJSONTyped }  from '@/api/models/Signer';
import { useCreateSignTemplateState } from '@/pages/prepare_signer_template/state/CreateSignTemplateState';
import { Document as AppDocument } from '@/api/models/Document';
import {
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Stack // For form layout
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
// interface SignerItem {
//   id: string;
//   name: string;
//   email: string;
//   order: number;
//   documentId?: string;  // Making it optional since it's not set when creating new signers
// }

const SignerList = () => {
    const createSignTemplateState = useCreateSignTemplateState()

    useEffect(() => {
        createSignTemplateState.setDocument(
            {
                id: '',
                title: 'test signing template',
                userId: '',
                createdAt: new Date(),
                createdBy: '',
                status: '',
                metaData: {},
                signers: []
            } as AppDocument
        );
    }, []);
    
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // State for signers list
//   const [signers, setSigners] = useState<Signer[]>([]);




  // Handle input changes
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      // Add new signer with unique id
      createSignTemplateState.setSigners([
        ...createSignTemplateState.signers,
        { 
          ...formData,
          id: formData.email, 
          order: createSignTemplateState.signers.length,
          documentId: '',
          signatureFields: [],
          signedAt: null,
        }
      ]);
      // Reset form
      setFormData({ name: '', email: '' });      
    }
  };

  // Handle signer deletion
  const deleteSigner = (id:string) => {
    createSignTemplateState.setSigners(createSignTemplateState.signers.filter(signer => signer.id !== id));
  };

  return (
    <Box sx={{ maxWidth: '700px', mx: 'auto', p: { xs: 1, md: 2 } }}> {/* Centered Box with padding */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Add Signers
      </Typography>
      
      {/* Signer Form */}
      <Box component="form" noValidate autoComplete="off" sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}> {/* Parent Stack for horizontal alignment */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexGrow: 1 }}> {/* Existing Stack for TextFields, allow it to grow */}
            <TextField
              label="Name"
              variant="outlined"
              size="small"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
          </Stack>
          <Button 
              variant="contained" 
              onClick={handleSubmit} 
              startIcon={<PersonAddIcon />}
              sx={{ 
                  ml: 2,
                  width: { xs: '100%', sm: 'auto' }, 
                  textTransform: 'none',
                  bgcolor: '#455cff',
                  boxShadow: 'none',
                  borderRadius: '20px',
                  '&:hover': { bgcolor: '#3a4edc', boxShadow: 'none' }
              }} 
          >
              Add Signer
          </Button>
        </Stack> {/* Close Parent Stack */}
      </Box>

      {/* Signers List */}
      <Box>
        <Typography variant="h6" component="h3" gutterBottom>Signers List</Typography>
        {createSignTemplateState.signers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No signers added yet</Typography>
        ) : (
          <List dense> {/* Dense list for more compact look */}
            {createSignTemplateState.signers.map((signer: Signer) => (
              <ListItem
                key={signer.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteSigner(signer.id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }} // Add slight background and rounding
              >
                <ListItemText
                  primary={signer.name}
                  secondary={signer.email}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default SignerList;
