import React, { useEffect, useState, useMemo } from 'react';
import { DocumentApiClient } from '@/api/client/DocumentApiClient';
import { Document, DocumentFromJSONTyped } from '@/api/models/Document';
import appConfig from '@/AppConfig';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Select, MenuItem, Modal, Box, Typography, Button, Tabs, Tab, Paper, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';

interface ListUserDocumentsProps {
  //apiClient: DocumentApiClient;
}

type DocumentStatus = 'ALL' | 'PENDING' | 'COMPLETED' | 'DRAFT';
type DateRange = 'ALL' | '7D' | '14D' | '30D';

const ListUserDocuments: React.FC<ListUserDocumentsProps> = ({ }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const docClient = new DocumentApiClient(appConfig.baseApiUrl, localStorage.getItem('access_token') || '');
  const [openModal, setOpenModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedSignerId, setSelectedSignerId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>('ALL');
  const [userActionDropDownValue, setUserActionDropDownValue] = useState<string>("none");
  const [openCancelConfirmModal, setOpenCancelConfirmModal] = useState(false);
  const [documentToCancel, setDocumentToCancel] = useState<Document | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const userDocuments = await docClient.getUserDocuments();
      setDocuments(userDocuments.map(o => DocumentFromJSONTyped(o, true)));
    } catch (err) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedDocument(null);
  };

  const handleUserActionDropDown = (action: string | null, document: Document) => {
    setUserActionDropDownValue(action || "none");
    if (action === 'sign') {
        setSelectedDocument(document);
        setOpenModal(true);
    } else if (action === 'view') {
        navigate(`/signed-pdf-view?documentId=${document.id}`);
    } else if (action === 'cancel') {
        setDocumentToCancel(document);
        setOpenCancelConfirmModal(true);
    }
  };

  const handleConfirmCancel = () => {
    if (!documentToCancel) return;

    const token = localStorage.getItem('access_token');
    fetch(`${appConfig.baseApiUrl}/api/v1/documents/cancel/${documentToCancel.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Document cancelled:', data);
        fetchDocuments(); // Refresh the document list
    })
    .catch(error => {
        console.error('Error cancelling document:', error);
    })
    .finally(() => {
        setOpenCancelConfirmModal(false);
        setDocumentToCancel(null);
        setUserActionDropDownValue("none"); // Reset dropdown after action
    });
  };

  const handleCancelConfirmModalClose = () => {
    console.log('handleCancelConfirmModalClose');
    setOpenCancelConfirmModal(false);
    setDocumentToCancel(null);
    setUserActionDropDownValue("none"); // Reset dropdown if cancelled
  };

  const handleSignerSelect = (signerId: string) => {
    if (selectedDocument && signerId) {
      navigate(`/signer-signing?documentId=${selectedDocument.id}&signerId=${signerId}`);
      handleModalClose();
    }
  };

  const handleStatusChange = (event: React.SyntheticEvent, newValue: DocumentStatus) => {
    setSelectedStatus(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDateRangeChange = (event: any) => {
    setDateRange(event.target.value as DateRange);
  };

  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(doc => doc.status?.toUpperCase() === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateRange !== 'ALL') {
      const now = new Date();
      let pastDate = new Date();

      switch (dateRange) {
        case '7D':
          pastDate.setDate(now.getDate() - 7);
          break;
        case '14D':
          pastDate.setDate(now.getDate() - 14);
          break;
        case '30D':
          pastDate.setDate(now.getDate() - 30);
          break;
      }

      filtered = filtered.filter(doc => {
        const docDate = doc.createdAt ? new Date(doc.createdAt) : null;
        return docDate && docDate >= pastDate;
      });
    }

    return filtered;
  }, [documents, selectedStatus, searchQuery, dateRange]);

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Created At',
      type: 'date',
      flex: 1,
      editable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      valueGetter: (value: any) => value ? new Date(value) : null,
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      editable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'sender',
      headerName: 'Sender',
      flex: 1,
      editable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      valueGetter: (params: any) => {
        return 'You';
      },
    },
    // {
    //   field: 'signers',
    //   headerName: 'signers',
    //   type: 'string',
    //   width: 110,
    //   editable: false,
    //   valueGetter: (value: any, row: any) => {
    //     if (!row.signers || !Array.isArray(row.signers)) return '';
    //     return row.signers.map((signer: any) => signer.name || signer.email).join(', ');
    //   },
    // },
    {
        field: 'signers',
        headerName: 'Recipient',
        type: 'string',
        flex: 1,
        editable: false,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          if (!params.row.signers || !Array.isArray(params.row.signers)) return null;
          return (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '100%' }}>
              {params.row.signers.map((signer: any, index: number) => (
                <img 
                  key={index}
                  src={signer.profileImage || `${appConfig.baseUrl}/default-avatar.png`} 
                  alt={signer.name || signer.email}
                  style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ))}
            </div>
          );
        },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      editable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Select
          key={params.row.id}
          size="small"
          defaultValue={userActionDropDownValue}
          
          displayEmpty
          onChange={(e) => {
             
              handleUserActionDropDown(e.target.value as string | null, params.row)
            
          }}
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="none">--</MenuItem>
          {/* <MenuItem value="sign">Sign as</MenuItem> */}
          <MenuItem value="cancel">Cancel</MenuItem>
          <MenuItem value="view">View</MenuItem>
        </Select>
      ),
    },
  ];

  useEffect(() => {
    

    fetchDocuments();
  }, []);//when compponent loaded, this function is called

  if (loading) {
    return <div>Loading documents...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      {/* Documents Title */}
      <Typography variant="h5" gutterBottom sx={{ mb: 5 , mt: 5, fontWeight: 'bold' }}>
        Documents
      </Typography>

      {/* Combined Header Row */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', // Pushes Button left, RightGroup right
        alignItems: 'center', 
        width: '100%', 
        marginBottom: 2,
        flexWrap: 'wrap', // Allow wrapping on smaller screens if needed
        gap: 2 // Add gap for wrapping scenario
      }}>
        {/* Left: New Document Button */}
        <Button
            variant="contained"
            onClick={() => navigate('/dashboard/prepare-sign-document')}
            sx={{
                backgroundColor: '#455cff',
                color: 'white',
                borderRadius: '24px',
                border: 'none',
                cursor: 'pointer',
                padding: { xs: '6px 12px', md: '8px 16px' },
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                textTransform: 'none',
                boxShadow: 'none',
                whiteSpace: 'nowrap', // Prevent button text wrapping
                flexShrink: 0, // Prevent button from shrinking
                '&:hover': {
                    backgroundColor: '#3a4cd8',
                    boxShadow: 'none'
                }
            }}
        >
            +New Document
        </Button>

        {/* Center: Filter Tabs Container */}
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'center', // Center the tabs within this box
            flexGrow: 1, // Allows this to take up space
            minWidth: '200px', // Ensure tabs have some minimum space
            order: { xs: 3, md: 0 }, // Move below button and search on small screens if wrapped
            width: { xs: '100%', md: 'auto' } // Full width on xs if wrapped
          }}
        > 
          <Box 
            sx={{
              display: 'inline-flex',
              backgroundColor: '#fafafa',
              borderRadius: '23px', 
              padding: '4px',
              maxWidth: '100%', 
              overflowX: 'auto'
            }}
          >
              <Tabs 
                value={selectedStatus} 
                onChange={handleStatusChange} 
                aria-label="document status filter tabs"
                variant="scrollable" // Keep scrollable
                allowScrollButtonsMobile // Keep scroll buttons
                sx={{ 
                  '& .MuiTabs-indicator': {
                    display: 'none',
                  },
                  minHeight: 'auto' // Reduce default Tabs height
                }}
              >
                {[ 
                  { label: 'Inbox', value: 'ALL', icon: <InboxIcon /> },
                  { label: 'Pending', value: 'PENDING', icon: <AccessTimeIcon /> },
                  { label: 'Completed', value: 'COMPLETED', icon: <CheckCircleOutlineIcon /> },
                  { label: 'Draft', value: 'DRAFT', icon: <EditOutlinedIcon /> }
                ].map(tab => (
                  <Tab 
                    key={tab.value}
                    label={tab.label} 
                    value={tab.value} 
                    icon={tab.icon}
                    iconPosition="start"
                    sx={{
                      textTransform: 'capitalize',
                      fontSize: '14px',
                      minHeight: 'auto',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      color: '#555',
                      transition: 'color 0.2s ease',
                      '&.Mui-selected': {
                         fontWeight: 'bold',
                         color: '#455cff',
                      },
                      '&:hover': {
                        color: '#455cff',
                        backgroundColor: 'transparent'
                      }
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          </Box>

        {/* Right: Search and Date Range Filters */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          gap: 2, 
          flexShrink: 0 // Prevent this group from shrinking excessively
          // width: { xs: '100%', md: 'auto' }, // Removed, let content size dictate width
        }}>
          <Select
            size="small"
            value={dateRange}
            onChange={handleDateRangeChange}
            displayEmpty
            sx={{
              // flexGrow: 1, // Removed to prevent unwanted expansion
              minWidth: 100, 
              borderRadius: '8px',
              color: '#757575',
              fontSize: '12px',
              // Removed padding override, let MUI handle it based on size="small"
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.15)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.3)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.4)' },
            }}
          >
            <MenuItem value="ALL">All Time</MenuItem>
            <MenuItem value="7D">Last 7 days</MenuItem>
            <MenuItem value="14D">Last 14 days</MenuItem>
            <MenuItem value="30D">Last 30 days</MenuItem>
          </Select>

          <TextField
            size="small"
            placeholder="Search Documents..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#757575' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              // flexGrow: 1, // Removed to prevent unwanted expansion
              minWidth: 150, 
              '& .MuiInputBase-root': {
                borderRadius: '8px',
                color: '#757575',
                fontSize: '12px',
                // Removed padding override
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.15)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.3)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 0, 0, 0.4)' },
              '& .MuiInputBase-input::placeholder': { color: '#a0a0a0', opacity: 1 },
            }}
          />
        </Box>
      </Box>
      
      <Paper 
        variant="outlined"
        sx={{ 
          overflow: 'hidden', 
          borderRadius: '12px'
        }}
      >
        {loading ? (
           <Box sx={{ padding: 2, textAlign: 'center' }}>Loading documents...</Box>
        ) : (
          <DataGrid
            rows={filteredDocuments.map(doc => ({ 
              id: doc.id,
              title: doc.title,
              sender: 'You',
              status: doc.status,
              signers: doc.signers,
              createdAt: doc.createdAt
            }))}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection={false}
            hideFooterSelectedRowCount={true}
            disableMultipleRowSelection={true}
            disableRowSelectionOnClick={true}
            disableColumnResize={true}
            disableColumnFilter={true}
            disableColumnMenu={true}
            disableColumnSelector={true}
            disableDensitySelector={true}
            autoHeight
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaderCheckbox': {
                display: 'none',
              },
              '& .MuiDataGrid-cellCheckbox': {
                display: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: 'none',
                borderRight: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                justifyContent: 'flex-start',
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '1px solid #eeeeee',
                backgroundColor: '#f9f9f9',
              },
              '& .MuiDataGrid-columnHeader': {
                padding: '8px 16px',
                borderRight: 'none',
                display: 'flex',
                pointerEvents: 'none'
              },
              '& .MuiDataGrid-columnHeader:hover': {
                backgroundColor: '#f9f9f9'
              },
              '& .MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '& .MuiDataGrid-iconSeparator': {
                display: 'none',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                width: '100%',
                textAlign: 'left',
              },
              '& .MuiDataGrid-row': {
                borderBottom: 'none',
                '&:hover': {
                   backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              },
              '& .MuiDataGrid-virtualScroller': {
                  overflowX: 'hidden'
              },
              '& .MuiDataGrid-footerContainer': {
                 borderTop: '1px solid #e0e0e0',
              }
            }}
          />
        )}
      </Paper>
      
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="sign-document-modal"
      >
         <Box sx={{
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           width: 400,
           bgcolor: 'background.paper',
           boxShadow: 24,
           p: 4,
           borderRadius: 2,
         }}>
           <Typography variant="h6" component="h2">
             Sign Document As
           </Typography>
           {selectedDocument && (
             <>
                <Typography sx={{ mt: 2 }}>
                  Document: {selectedDocument.title}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Signer:
                  </Typography>
                  <Select
                    fullWidth
                    value={selectedSignerId}
                    onChange={(e) => setSelectedSignerId(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                        Select a signer...
                    </MenuItem>
                    {selectedDocument.signers?.map((signer) => (
                      <MenuItem key={signer.id} value={signer.id}>
                        {signer.email}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button variant="outlined" onClick={handleModalClose}>Cancel</Button>
                  <Button 
                    variant="contained" 
                    onClick={() => handleSignerSelect(selectedSignerId)}
                    disabled={!selectedSignerId}
                  >
                    Sign
                  </Button>
                </Box>
             </>
            )}
         </Box>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        open={openCancelConfirmModal}
        onClose={handleCancelConfirmModalClose}
        aria-labelledby="cancel-confirm-modal-title"
        aria-describedby="cancel-confirm-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography id="cancel-confirm-modal-title" variant="h6" component="h2">
            Confirm Cancellation
          </Typography>
          <Typography id="cancel-confirm-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to cancel the document "{documentToCancel?.title}"?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={handleCancelConfirmModalClose}>
              No
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmCancel}>
              Yes, Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ListUserDocuments;
