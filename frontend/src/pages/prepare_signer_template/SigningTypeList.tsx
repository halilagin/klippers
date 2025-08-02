import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useCreateSignTemplateState from './state/CreateSignTemplateState';
import {
    Box,
    Typography,
    Paper,
    Stack,
    SvgIconTypeMap
} from '@mui/material';
import { grey } from '@mui/material/colors';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ShortTextIcon from '@mui/icons-material/ShortText';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { OverridableComponent } from '@mui/material/OverridableComponent';

const SigningTypeList = () => {
    const createSignTemplateState = useCreateSignTemplateState();
    const signingTypes = ['Signature', 'Initial', 'Date', 'Name', 'Title'];
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Icon mapping
    const iconMap: { [key: string]: OverridableComponent<SvgIconTypeMap<{}, "svg">> } = {
        Signature: BorderColorIcon,
        Initial: ShortTextIcon,
        Date: CalendarMonthIcon,
        Name: BadgeIcon,
        Title: WorkOutlineIcon
    };

    // Warm colors array (consider defining in theme or moving if used elsewhere)
    // const warmColors = [
    //     '#fff3e0', // Light Orange
    //     '#fbe9e7', // Light Coral
    //     '#fff8e1', // Light Yellow
    //     '#fce4ec', // Light Pink
    //     '#f3e5f5', // Light Purple
    // ]; // Removed warmColors

    const handleDragStart = (e: React.DragEvent, type: string) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({signType: type, itemId: uuidv4(), signerId: createSignTemplateState.activeSignerId, page: createSignTemplateState.pdfViewPageNumber}));
        setSelectedType(type);
    };

    const handleDragEnd = () => {
        setSelectedType(null); // Reset selected type on drag end
    };

    return (
        <Box>
            <Typography variant="h6" component="h3" gutterBottom>
                Select Signing Type
            </Typography>
            <Stack spacing={1.5}> {/* Use Stack for vertical layout */}
                {signingTypes.map((type) => { // Removed index
                    const IconComponent = iconMap[type];
                    return (
                        <Paper
                            key={type}
                            draggable
                            onDragStart={(e) => handleDragStart(e, type)}
                            onDragEnd={handleDragEnd} // Add drag end handler
                            elevation={selectedType === type ? 4 : 0} // Set elevation to 0 when not selected
                            sx={{
                                p: '12px 20px',
                                // backgroundColor: warmColors[index], // Removed warmColors
                                backgroundColor: 'background.paper', // Changed to white
                                border: selectedType === type 
                                    ? '2px solid orange' // Use theme color if available
                                    : `1px solid ${grey[300]}`, // Keep grey border for contrast
                                borderRadius: 2, // Theme border radius
                                cursor: 'move',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                // justifyContent: 'center', // Changed alignment
                                justifyContent: 'flex-start', // Align items to start
                                gap: 1.5, // Add gap between icon and text
                                '&:hover': {
                                    borderColor: 'grey.500' // Darker border on hover
                                }
                            }}
                        >
                            {IconComponent && <IconComponent fontSize="small" />} {/* Render icon */}
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {type}
                            </Typography>
                        </Paper>
                    );
                })}
            </Stack>
            {selectedType && (
                <Typography variant="caption" display="block" sx={{ mt: 1.5, textAlign: 'center', color: 'text.secondary' }}>
                    Selected: {selectedType}
                </Typography>
            )}
        </Box>
    );
};

export default SigningTypeList; 

