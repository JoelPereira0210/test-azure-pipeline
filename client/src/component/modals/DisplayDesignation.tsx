import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CiEdit } from 'react-icons/ci';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ButtonInput from '../UI/Button/Button';
import Designation from './DesignationModal';
import { fetchDesignationData } from '@/src/actions/designation';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { fetchSelectedDesignationMembers } from '@/src/actions/designation';

export default function DisplayDesignation({
  selectedDesignation,
  onDesignationSelect,
  onDesignationMembersFetched,
}) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  // Modify state to hold more information about designations
  const [loading, setLoading] = useState<boolean>(true);
  const [designations, setDesignations] = useState<
    {
      designationId: string;
      designationName: string;
      numberOfPositions: number;
      adminPrivileges: boolean;
    }[]
  >([]);
  const [editingDesignationDetails, setEditingDesignationDetails] = useState<{
    designationId: string;
    designationName: string;
    numberOfPositions: number;
    adminPrivileges: boolean;
  } | null>(null);
  const [isDesignationOpen, setIsDesignationOpen] = useState<boolean>(false);
  const [cancelButtonText, setCancelButtonText] = useState<string>('Cancel');
  const [
    selectedDesignationFetchedMembers,
    setSelectedDesignationFetchedMembers,
  ] = useState([]);

  
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    // Check the `flow` value from localStorage and set state
    const role = localStorage.getItem('flow');
    setIsAdmin(role === 'admin');
  }, []);
   
    
  const displayDesignationButton = 'Add New Designation';

  // Fetch designations and store relevant information in state
  const handleDisplayDesignation = async () => {
    try {
      const response = await fetchDesignationData();
      if (response) {
        setDesignations(response); // Store the entire designation object
        if (response.length > 0) {
          onDesignationSelect(response[0].designationName);
        }
      }
    } catch (error) {
      console.error('Error fetching designation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNewDesignation = (updatedDesignation) => {
    setDesignations((prev) => {
      const index = prev.findIndex(
        (d) => d.designationId === updatedDesignation.designationId
      );
      if (index > -1) {
        // Update the existing designation
        const updatedDesignations = [...prev];
        updatedDesignations[index] = updatedDesignation; // Replace with the updated designation
        return updatedDesignations;
      } else {
        // Add new designation (create mode)
        return [...prev, updatedDesignation];
      }
    });
  };

  const handleDesignationDelete = (designationId: string) => {
    setDesignations((prev) =>
      prev.filter((designation) => designation.designationId !== designationId)
    );
    setIsDesignationOpen(false); // Close modal after deletion
  };

  const addMoreDesignation = () => {
    console.log('Adding new designation');
    setIsDesignationOpen(true);
    setCancelButtonText('Cancel');
  };

  const handleClick = async (designation: string) => {
    if (designation !== selectedDesignation) {
      onDesignationSelect(designation); // Select the new designation only if it's different from the current one
      onDesignationMembersFetched(selectedDesignationFetchedMembers);
    }
  };
  

  console.log('data of selcted', selectedDesignationFetchedMembers);

  const handleEditClick = (
    designationId: string,
    designationName: string,
    numberOfPositions: number,
    adminPrivileges: boolean
  ) => {
    console.log('Edit clicked for designation:');
    console.log('Designation ID:', designationId);
    console.log('Designation Name:', designationName);
    console.log('Number of Positions:', numberOfPositions);
    console.log('Admin Privileges:', adminPrivileges);

    setEditingDesignationDetails({
      designationId,
      designationName,
      numberOfPositions,
      adminPrivileges,
    });

    setCancelButtonText('Delete');
    setIsDesignationOpen(true);
  };

  const handleDesignationUpdated = (updatedDesignation) => {
    // Call the passed function to set the selected designation in the parent component
    onDesignationSelect(updatedDesignation.designationName);
    console.log('desina', updatedDesignation.designationName);
  };

  useEffect(() => {
    handleDisplayDesignation();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {isDesignationOpen ? (
        <Designation
          open={isDesignationOpen}
          onClose={() => setIsDesignationOpen(false)}
          onClick={handleDisplayDesignation}
          modalButtonAdd="Update"
          modalButtonCancel={cancelButtonText}
          onDesignationAdded={addNewDesignation}
          onDesignationDeleted={handleDesignationDelete}
          selectedDesignation={editingDesignationDetails}
          setSelectedData={(details) => setEditingDesignationDetails(details)}
          CancelIcon={
            editingDesignationDetails ? <CancelOutlinedIcon /> : undefined
          }
        />
      ) : (
        <Box
          sx={{
            width: {
              xs: '310px',
              sm: '310px',
              md: '360px',
              lg: '360px',
              xl: '380px',
            },
            padding: '8px',
            borderRadius: '2px',

            background:
              mode === 'light'
                ? 'var(--tw-bg-light-background)'
                : 'var(--tw-bg-dark-background)',
            border: '1px solid #e0e0e0',
          }}
        >
          {loading ? (
            <Typography
              variant="body2"
              sx={{
                color:
                  mode === 'light'
                    ? 'var(--tw-text-light-mainText)'
                    : 'var(--tw-text-dark-mainText)',
              }}
            >
              Loading...
            </Typography>
          ) : (
            <List
              sx={{
                maxHeight: '274px',
                overflowY: 'auto',
                paddingRight: '8px',
              }}
            >
              {designations.length > 0 ? (
                designations.map((designation, index) => (
                  <ListItem
                    key={index}
                    onClick={() => handleClick(designation.designationName)}
                    sx={{
                      marginLeft: '-3%',
                      cursor: 'pointer',
                      color:
                        designation.designationName === selectedDesignation
                          ? '#FFF'
                          : mode === 'light'
                          ? '#000'
                          : 'var(--tw-text-dark-mainText)',
                      borderRadius: 1,
                      marginBottom: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 16px',
                      backgroundColor:
                        designation.designationName === selectedDesignation
                          ? '#007FFF'
                          : 'transparent',
                    }}
                  >
                    <ListItemText
                      primary={designation.designationName}
                      sx={{
                        wordBreak: 'break-all',
                      }}
                    />

                    {/* Edit Icon with condition to hide for 'member' designation */}
                    {isAdmin && (
                      <IconButton
                        onClick={() =>
                          handleEditClick(
                            designation.designationId,
                            designation.designationName,
                            designation.numberOfPositions,
                            designation.adminPrivileges
                          )
                        }
                        sx={{
                          color:
                            designation.designationName === selectedDesignation
                              ? '#FFF'
                              : '',
                        }}
                      >
                        <CiEdit />
                      </IconButton>
                    )}
                  </ListItem>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.primary }}
                >
                  No designations available
                </Typography>
              )}
            </List>
          )}
          {isAdmin && (
          <ButtonInput
            text={displayDesignationButton}
            type="submit"
            disabled={false}
            fontSize={16}
            fontWeight={600}
            styles={{
              marginTop: 2,
              backgroundColor: '#007FFF',
              '&:hover': { backgroundColor: '#0066CC' },
            }}
            icon={<AddCircleOutlineIcon />}
            loading={false}
            onClick={addMoreDesignation}
          />)}
        </Box>
      )}
    </ThemeProvider>
  );
}
