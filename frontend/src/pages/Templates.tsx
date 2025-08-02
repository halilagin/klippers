import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    CssBaseline,
    ThemeProvider,
    createTheme,
    useTheme,
    Drawer,
    Modal,
    TextField,
    InputAdornment,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';

// Create a theme instance for this page
// Ensure it includes breakpoints needed by TopMenu
const templatesTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    palette: {
        primary: { main: '#455cff' },
        // Add other theme settings if needed
    },
});

const TEMPLATES_STORAGE_KEY = 'app_templates'; // Key for localStorage

// Define the type for a template explicitly
type Template = { id: number; name: string };

const Templates = () => {
    const navigate = useNavigate();
    // Initialize state by reading from localStorage
    const [templates, setTemplates] = useState<Template[]>(() => {
        const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        try {
            return storedTemplates ? JSON.parse(storedTemplates) : [];
        } catch (error) {
            console.error("Error parsing templates from localStorage:", error);
            return [];
        }
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Effect to save templates to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    }, [templates]);

    const handleNewTemplate = () => {
        // Trigger the hidden file input click
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("File selected:", file.name);
            // Simulate template creation: Add file name to the list
            const newTemplate: Template = { id: Date.now(), name: file.name };
            setTemplates(prevTemplates => [...prevTemplates, newTemplate]);

            // Reset file input value to allow uploading the same file again
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // TODO: Add actual upload logic here (e.g., API call)
            alert(`Template "${file.name}" added to the list (simulation).`);
        }
    };

    return (
        <ThemeProvider theme={templatesTheme}>
            <CssBaseline />
            <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                        Templates
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleNewTemplate}
                        sx={{
                            backgroundColor: '#455cff',
                            color: 'white',
                            borderRadius: '24px',
                            textTransform: 'none',
                            boxShadow: 'none',
                            padding: { xs: '6px 12px', md: '8px 16px' },
                            fontSize: { xs: '0.8rem', md: '0.9rem' },
                            '&:hover': {
                                backgroundColor: '#3a4cd8',
                                boxShadow: 'none'
                            }
                        }}
                    >
                        + New Template
                    </Button>
                </Box>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.txt" // Example: Accept specific file types
                />

                {/* Placeholder or templates list */}
                <Box sx={{ mt: 2, p: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                    {templates.length === 0 ? (
                        <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                            Templates list will appear here. Upload a file to create a new template.
                        </Typography>
                    ) : (
                        <List dense>
                            {templates.map((template) => (
                                <ListItem key={template.id} sx={{ borderBottom: '1px solid #f0f0f0', '&:last-child': { borderBottom: 'none' } }}>
                                    <ListItemIcon>
                                        <DescriptionIcon sx={{ color: '#455cff' }} />
                                    </ListItemIcon>
                                    <ListItemText primary={template.name} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Templates; 