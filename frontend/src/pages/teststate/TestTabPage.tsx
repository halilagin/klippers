import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import useBerfinState from './state/BerfinState';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

function TestTabPage() {
    const berfinState = useBerfinState();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (berfinState.count == 5){
        setValue(1)
    }

  }, [berfinState.count])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Tab 1" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
          <Tab label="Tab 2" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
          <Tab label="Tab 3" id="simple-tab-2" aria-controls="simple-tabpanel-2" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Content for Tab Panel 1
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Content for Tab Panel 2
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Content for Tab Panel 3
      </CustomTabPanel>
    </Box>
  );
}

export default TestTabPage;
