import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useCreateSignTemplateState } from './state/CreateSignTemplateState';
import {
    Box,
    Typography,
    Button,
    IconButton,
    styled, // For styling the file input
    Modal,      // Import Modal
    List,       // Import List
    ListItem,   // Import ListItem
    ListItemButton, // Import ListItemButton
    ListItemIcon, // Import ListItemIcon
    ListItemText  // Import ListItemText
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Icon for PDF
import DeleteIcon from '@mui/icons-material/Delete'; // Icon for delete
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Icon for upload button
import DescriptionIcon from '@mui/icons-material/Description'; // Icon for document
import CloseIcon from '@mui/icons-material/Close'; // Icon for close button

// Define the type for a template explicitly (can be shared in a types file later)
type Template = { id: number; name: string };
const TEMPLATES_STORAGE_KEY = 'app_templates'; // Same key as in Templates.tsx

// Keep CSS for specific styling if needed, otherwise remove/comment out
import './DocumentUpload.css';

// Styled component for visually hidden file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DocumentUpload: React.FC = () => {
    const createSignTemplateState = useCreateSignTemplateState()


    const navigate = useNavigate(); // Initialize useNavigate
    const [isDragging, setIsDragging] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false); // State for modal
    const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]); // State for templates from storage

    // --- REMOVED SIMULATED TEMPLATE DATA ---
    // const availableTemplates = [
    //     { id: 'tpl1', name: 'Sample Lease Agreement.pdf' },
    //     { id: 'tpl2', name: 'NDA Template - Standard.pdf' },
    //     { id: 'tpl3', name: 'Employment Contract V3.pdf' },
    // ];
    // ----------------------------------------

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const pdfFile = files.find(file => file.type === 'application/pdf');

        if (pdfFile) {
            handleFileUpload(pdfFile);
        } else {
            alert('Please drop a PDF file');
        }
    };







    const fileTobyteArray = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            // Check if the reading was successful and the result is an ArrayBuffer
            if (e.target?.result instanceof ArrayBuffer) {
                const arrayBuffer = e.target.result;
                // Convert ArrayBuffer to Uint8Array (byte array)
                const bytes = new Uint8Array(arrayBuffer);

                // Step 1: Convert Uint8Array to a binary string
                // We use String.fromCharCode applied to each byte value.
                // Using reduce for potentially better performance with large arrays than spread syntax.
                const binaryString = Array.from(bytes).map(byte => String.fromCharCode(byte)).join('');

                // Step 2: Encode the binary string to Base64
                const base64String = btoa(binaryString);

                // Step 3: Save the Base64 string to localStorage
                localStorage.setItem('pdfContentBase64', base64String);

                // Update the state with the byte array and the file object
                // createSignTemplateState.setPdfContent(bytes);
                // createSignTemplateState.setPdfFile(file);
                createSignTemplateState.setPdfFileName(file.name);

                // Log details *after* reading is complete
                console.log('FileReader: PDF loaded as byte array, length:', bytes.length);
                console.log('FileReader: file name:', file.name, 'file size:', file.size);
            } else {
                console.error('FileReader: Failed to read file as ArrayBuffer or result is null.');
            }
        };

        reader.onerror = (e: ProgressEvent<FileReader>) => {
            console.error('FileReader: Error reading file:', reader.error);
            // Optionally, handle the error state in your component
        };

        // Start reading the file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
    };

    const handleFileUpload = (file: File) => {
        // Just call the function that uses FileReader
        fileTobyteArray(file);
        // Remove console logs from here as they would log before the async reading completes
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            handleFileUpload(file);
        } else if (file) {
            alert('Please select a PDF file');
        }
    };

    const handleDeleteFile = () => {
        createSignTemplateState.setPdfFileName(null);
        // Optionally clear localStorage if needed
        // localStorage.removeItem('pdfContentBase64');
    };

    const handleOpenTemplateModal = () => {
        // Read templates from localStorage when modal opens
        const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        try {
            const templatesFromStorage = storedTemplates ? JSON.parse(storedTemplates) : [];
            setAvailableTemplates(templatesFromStorage);
        } catch (error) {
            console.error("Error parsing templates from localStorage:", error);
            setAvailableTemplates([]); // Set to empty list on error
        }
        setIsTemplateModalOpen(true);
    };
    const handleCloseTemplateModal = () => setIsTemplateModalOpen(false);

    const handleSelectTemplate = (templateName: string) => {
        // Simulate selecting the template
        // In a real app, you might fetch the template content here
        createSignTemplateState.setPdfFileName(templateName);
        // TODO: Fetch/set actual PDF content based on selected template
        console.log(`Selected template: ${templateName}`);
        handleCloseTemplateModal();
    };

    const showDragAndDrop = () => {
        return <>
        
            <Box
                className={`dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                    border: `2px dashed ${isDragging ? 'primary.main' : 'grey.400'}`,
                    borderRadius: 1, // Use theme spacing unit for border radius
                    p: 3, // Use theme spacing unit for padding
                    textAlign: 'center',
                    backgroundColor: isDragging ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease',
                    minHeight: '150px', // Adjusted height
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    mb: 2 // Margin bottom
                }}
            >
                <Typography sx={{ color: 'text.secondary' }}>
                    {isDragging ? 'Drop PDF here' : 'Drag & Drop PDF here'}
                </Typography>
            </Box>
            <Typography align="center" sx={{ mb: 2, color: 'text.secondary' }}> or </Typography>
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ 
                    textTransform: 'none', 
                    bgcolor: 'grey.200', // Light grey background
                    color: 'grey.800', // Darker text color
                    boxShadow: 'none', // Remove shadow
                    borderRadius: '20px', // Consistent radius
                    '&:hover': { bgcolor: 'grey.300', boxShadow: 'none' } // Slightly darker grey on hover
                }}
            >
                Select File from Your Device
                <VisuallyHiddenInput type="file" accept=".pdf" onChange={handleFileChange} />
            </Button>

            {/* --- Add Select from Templates Button --- */} 
            <Button
                variant="outlined"
                fullWidth
                onClick={handleOpenTemplateModal} // Open the modal
                sx={{
                    mt: 1, // Margin top to space it from the button above
                    textTransform: 'none',
                    borderRadius: '20px', // Consistent radius
                    borderColor: 'grey.400',
                    color: 'grey.700',
                    '&:hover': { borderColor: 'grey.600', bgcolor: 'grey.50' }
                }}
            >
                Select from Templates
            </Button>
            {/* ----------------------------------------- */}

        </>

    }


    const showUploadedFile = () => {
        return <>
        
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                my: 1.5
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    overflow: 'hidden' // Handle potential overflow
                }}>
                    <PictureAsPdfIcon sx={{ color: '#e74c3c', flexShrink: 0 }} />
                    <Typography 
                        variant="body1" 
                        noWrap // Prevent wrapping
                        sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' // Ensure no wrapping
                        }}>
                        {createSignTemplateState.pdfFileName}
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleDeleteFile}
                    size="small"
                    aria-label="delete uploaded file"
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        </>
    }


    return (
        // Removed outer fragment and div.main-container, using Box directly
        <Box className="upload-container" sx={{ maxWidth: '600px', mx: 'auto', p: { xs: 2, md: 3 } }}>
            <Typography variant="h5" component="h1" className="upload-title" sx={{ mb: 1, textAlign: 'center' }}>
                Upload Your Document
            </Typography>
            <Typography variant="body1" className="upload-subtitle" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                Drag and drop your PDF here or click the button below to upload.
            </Typography>
            
            {createSignTemplateState.pdfFileName ? (
                showUploadedFile()
            ) : (
                showDragAndDrop()
            )}
            
            {/* --- Template Selection Modal --- */}
            <Modal
                open={isTemplateModalOpen}
                onClose={handleCloseTemplateModal}
                aria-labelledby="template-select-modal-title"
                aria-describedby="template-select-modal-description"
            >
                <Box sx={{ // Improved modal styling
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 500 }, // Responsive width
                    bgcolor: 'background.paper',
                    borderRadius: 2, // Softer corners
                    boxShadow: 24,
                    p: 3, // Consistent padding
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography id="template-select-modal-title" variant="h6" component="h2">
                            Select an Existing Template
                        </Typography>
                        <IconButton onClick={handleCloseTemplateModal} aria-label="close modal">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List sx={{ maxHeight: 300, overflow: 'auto' }}> {/* Scrollable list */}
                          {availableTemplates.length > 0 ? (
                              availableTemplates.map((template) => (
                                <ListItem key={template.id} disablePadding>
                                    <ListItemButton onClick={() => handleSelectTemplate(template.name)}>
                                        <ListItemIcon>
                                            <DescriptionIcon sx={{ color: 'primary.main' }} />
                                        </ListItemIcon>
                                        <ListItemText primary={template.name} />
                                    </ListItemButton>
                                </ListItem>
                            ))
                          ) : (
                            <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                                No templates found. Add templates on the Templates page.
                            </Typography>
                          )}
                      </List>
                  </Box>
            </Modal>
            {/* -------------------------------- */}

        </Box>
    );  
};

export default DocumentUpload;