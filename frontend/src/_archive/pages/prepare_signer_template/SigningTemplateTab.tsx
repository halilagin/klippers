import React, { useState } from 'react';
import { Box, Tab, Tabs, Button, Typography } from '@mui/material';
import SignerList from './SignerList';
import useCreateSignTemplateState from './state/CreateSignTemplateState';
import LocateSignsOnPdf from './LocateSignsOnPdf';
import PdfUpload from './PdfUpload';
import { SortSharp } from '@mui/icons-material';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function TabComponent() {
    const createSignTemplateState = useCreateSignTemplateState()
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleNext = (name: string) => {
        createSignTemplateState.setTabState(name)
        console.log("createSignTemplateState.tabState",name,createSignTemplateState.tabState)
        const currentTabIndex = createSignTemplateState.getTabStateIndex();
        console.log("currentTabIndex",currentTabIndex)
        setValue(Math.min(currentTabIndex + 1, createSignTemplateState.tabStateList.length -1 ));
    };

    const handlePrevious = (name: string) => {
        setValue((prev) => Math.max(prev - 1, 0));
    };

    const tabLabels = [
        "Upload Document",
        "Add Signers",
        "Set Signing Order",
        "Place Fields",
        // "Review & Save"
    ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
          sx={{ 
            "& .MuiTabs-indicator": { 
              backgroundColor: 'black'
            }
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab 
              label={label} 
              key={index} 
              id={`tab-${index}`} 
              aria-controls={`tabpanel-${index}`} 
              sx={{ 
                textTransform: 'none',
                color: 'grey.600',
                '&:hover': { 
                  backgroundColor: 'transparent'
                },
                '&.Mui-selected': { 
                  color: 'black'
                } 
              }}
            />
          ))}
        </Tabs>
      </Box>
      
      <TabPanel value={value} index={0}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <PdfUpload/>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={(e) => handleNext("pdfUpload")} 
              sx={{ bgcolor: '#455cff', boxShadow: 'none', borderRadius: '20px', textTransform: 'none', '&:hover': { bgcolor: '#3a4edc', boxShadow: 'none' } }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <SignerList/>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={(e) => handlePrevious("signerList")} 
              sx={{ 
                color: '#455cff',
                borderColor: '#455cff',
                borderRadius: '20px', 
                textTransform: 'none', 
                '&:hover': { 
                  borderColor: '#3a4edc',
                  bgcolor: 'rgba(69, 92, 255, 0.04)'
                }
              }}
            >
              Previous
            </Button>
            <Button 
              variant="contained" 
              onClick={(e) => handleNext("signerList")} 
              sx={{ bgcolor: '#455cff', boxShadow: 'none', borderRadius: '20px', textTransform: 'none', '&:hover': { bgcolor: '#3a4edc', boxShadow: 'none' } }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </TabPanel>
      
      <TabPanel value={value} index={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Sort Signers</Typography>
            <Typography variant="body2" color="text.secondary">
              Sort signers functionality will be implemented here.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={(e) => handlePrevious("sortSigners")} 
              sx={{ 
                color: '#455cff',
                borderColor: '#455cff',
                borderRadius: '20px', 
                textTransform: 'none', 
                '&:hover': { 
                  borderColor: '#3a4edc',
                  bgcolor: 'rgba(69, 92, 255, 0.04)'
                }
              }}
            >
              Previous
            </Button>
            <Button 
              variant="contained" 
              onClick={(e) => handleNext("sortSigners")} 
              sx={{ bgcolor: '#455cff', boxShadow: 'none', borderRadius: '20px', textTransform: 'none', '&:hover': { bgcolor: '#3a4edc', boxShadow: 'none' } }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <LocateSignsOnPdf />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={(e) => handlePrevious("positioningSignatures")} 
              sx={{ 
                color: '#455cff',
                borderColor: '#455cff',
                borderRadius: '20px', 
                textTransform: 'none', 
                '&:hover': { 
                  borderColor: '#3a4edc',
                  bgcolor: 'rgba(69, 92, 255, 0.04)'
                }
              }}
            >
              Previous
            </Button>
            {/* <Button 
              variant="contained" 
              onClick={(e) => handleNext("positioningSignatures")} 
              sx={{ bgcolor: '#455cff', boxShadow: 'none', borderRadius: '20px', textTransform: 'none', '&:hover': { bgcolor: '#3a4edc', boxShadow: 'none' } }}
            >
              Next
            </Button> */}
          </Box>
        </Box>
      </TabPanel>
      
      {/* <TabPanel value={value} index={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Review/>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={(e) => handlePrevious("review")} 
              sx={{ 
                color: '#455cff',
                borderColor: '#455cff',
                borderRadius: '20px', 
                textTransform: 'none', 
                '&:hover': { 
                  borderColor: '#3a4edc',
                  bgcolor: 'rgba(69, 92, 255, 0.04)'
                }
              }}
            >
              Previous
            </Button>
          </Box>
        </Box>
      </TabPanel> */}
      
    </Box>
  );
}
