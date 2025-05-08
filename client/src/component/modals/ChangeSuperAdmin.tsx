
import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Checkbox, CircularProgress,Avatar,useTheme } from '@mui/material';
import { AddCircleOutline, Height } from '@mui/icons-material';
import FilterListTable from '../UI/Tables/FilterListTable';
import FilterListTableHeader from '../UI/TableHeader/FilterListTableHeader';
import { fetchDesignationData, fetchMembers,fetchActiveMembers } from '@/src/actions/designation';
import ButtonInput from '../UI/Button/Button';
import ConfirmBoxModel from '../UI/Popup/ConfirmBoxModel';
import { changeSocietySuperAdmin } from '@/src/actions/profile';
import { useRouter } from 'next/navigation';
import PaginationFooter from '../UI/TableFooter/TableFooter';

// Styles for the Modal
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {xs:'90%',sm:'90%',md:'55%',lg:'55%'},
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height:'80vh'
};

interface ChangeSuperAdminProps {
  open: boolean;
  onClose: () => void;
  LoggedInUserId: string
}

const ChangeSuperAdminModal: React.FC<ChangeSuperAdminProps> = ({ open, onClose,LoggedInUserId }) => {
  const [userDetails, setUserDetails] = useState<any[]>([]);
  const [originalUserData, setOriginalUserData] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // To track the selected user
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error handling
  const [filterOptions, setFilterOptions] = useState<any[]>([]); // Designation filter options

  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [sortOption, setSortOption] = useState<string | null>(null); // Sort option
  const [filterOption, setFilterOption] = useState<string | null>(null); // Filter option
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
const [totalRecords, setTotalRecords] = useState(0);
const pageSize = 10; // Number of records per page


  const router = useRouter();

  const theme = useTheme();
  const mode = theme.palette.mode;
  

  console.log("LoggedInUserId",LoggedInUserId);

  // Fetch members and designations when the component mounts

    const fetchDesgnData = async (page = 0, limit = pageSize) => {
      try {
        setLoading(true); // Show loader before data is fetched
        setError(null); // Clear any previous errors

        // Fetch members and designations from the API
        const offset = page * limit; // Calculate offset for pagination
        const membersData = await fetchActiveMembers(limit, offset);
        const designationsData = await fetchDesignationData();




        setUserDetails(membersData.userDetails); // Update state with fetched members
        setOriginalUserData(membersData.userDetails); // Store original members data
        setTotalRecords(membersData.totalRecords); // Store total records for pagination
        setFilterOptions(
          designationsData.map((designation) => ({
            id: designation.designationId,
            name: designation.designationName,
          }))
        ); // Set the designations for filtering

        // Handle case where no members are returned
        if (!membersData || membersData.userDetails.length === 0) {
          setError('No members found for the specified society.');
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);

        // Set a user-friendly error message based on the type of error
        if (err.response && err.response.status === 400) {
          setError('Invalid society ID. Please check and try again.');
        } else if (err.response && err.response.status === 500) {
          setError('Internal Server Error. Please try again later.');
        } else if (err.message.includes('Network Error')) {
          setError('Network Error: Failed to connect to the server. Please check your connection.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false); // Hide loader after data is fetched or error occurs
      }
    };

    

  useEffect(() => {
    fetchDesgnData(currentPage);
  }, [currentPage]);
  

  // Handle checkbox change to allow only one selection
  const handleCheckboxChange = (userId: string) => {
    if (selectedUserId === userId) {
      setSelectedUserId(null); // Uncheck the checkbox if the same user is clicked again
    } else {
      setSelectedUserId(userId); // Set the selected user
    }
  };

  // Sorting, search, and filtering logic
  useEffect(() => {
    let updatedData = [...originalUserData];

    // Sorting logic
    if (sortOption === 'A-Z') {
      updatedData.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortOption === 'Z-A') {
      updatedData.sort((a, b) => b.firstName.localeCompare(a.firstName));
    }
 
    // Search logic
    if (searchTerm) {
      updatedData = updatedData.filter((user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm)
      );
    }

    // Filter logic (e.g., filter by designation)
    if (filterOption) {
      updatedData = updatedData.filter((user) => user.designationName === filterOption);
    }

    setUserDetails(updatedData);
  }, [sortOption, searchTerm, filterOption, originalUserData]);

  const handleSortSelect = (option: string) => {
    setSortOption(option); // Update sort option
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term); // Update the search term state
  };

  const handleFilterSelect = (selectedOption: any) => {
    setFilterOption(selectedOption.name); // Update the filter option
  };

  const handleClearFilters = () => {
    setUserDetails(originalUserData); // Reset to the original data
    setSearchTerm('');
    setSortOption(null);
    setFilterOption(null); // Clear filter
  };

  // Columns for the table
  const columnNameArray = [
    { field: 'action', headerName: 'Action' },
    { field: 'name', headerName: 'Name' },
    { field: 'phone', headerName: 'Phone Number' },
    { field: 'designation', headerName: 'Designation' },
  ];

  // Merged data for the table
  const mergedMemberData = userDetails.map((user) => ({
    action: (
      <Checkbox
        checked={selectedUserId === user.userId}
        onChange={() => handleCheckboxChange(user.userId)}
      />
    ),
    name: (
      <Box display="flex" alignItems="center">
        <Avatar alt={user.firstName} src={user.avatar} style={{ marginRight: 8 }} />
        {`${user.firstName} ${user.lastName}`}
      </Box>
    ),
    phone: user.phoneNumber,
    designation: user.designationName,
  }));


  const handleConfirmChange = async () => {
    if (selectedUserId) {
      try {
        // Call the function to change societySuperAdmin
        await changeSocietySuperAdmin(LoggedInUserId, selectedUserId);
        console.log('Super Admin change successful');
        setShowConfirmModal(false); // Close the confirmation modal
        onClose(); // Close the main modal
        location.reload();
        
      } catch (error) {
        console.error('Error changing Super Admin:', error);
      }
    }
  };

  return (
    <>
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="change-superadmin-modal-title"
      aria-describedby="change-superadmin-modal-description"
    >
      <Box sx={style}>
        {/* Modal Header */}
        <Box display="flex" justifyContent="center" width="100%" mb={2}>
          <Typography id="change-superadmin-modal-title" variant="h6" fontWeight={600}>
            Members
          </Typography>
        </Box>

        {/* Loader */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        )}

        {/* Error Message */}
        {error && !loading && (
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        )}

        {/* Table Header for Search, Sort, and Filter */}

          <FilterListTableHeader
            filterOptions={filterOptions}
            onFilterSelect={handleFilterSelect}
            sortOptions={['A-Z', 'Z-A']}
            onSortSelect={handleSortSelect}
            onSearchChange={handleSearchChange}
            onClearFilters={handleClearFilters}

            showSearch={true}
            showFilter={true}
            showSort={true}
          />


        {/* Render the table with the merged data */}
        {!loading && !error && userDetails.length > 0 && (
       <Box sx={{ width: '100%', maxHeight: '55vh', overflowY: 'auto',padding:"1%" }}>
            <FilterListTable tableData={mergedMemberData} columnNameArray={columnNameArray} toDisplayFooter={false} />

            <PaginationFooter
  currentPage={currentPage}
  totalRecords={totalRecords}
  pageSize={pageSize}
  onPageChange={(newPage) => {
    setCurrentPage(newPage); // Update current page
    fetchDesgnData(newPage); // Fetch new page data
  }}
/>


          </Box>
        )}

        {!loading && !error && userDetails.length === 0 && <Typography>No data available</Typography>}
        <Box display="flex" justifyContent="center" gap={3} width="100%" mt={3}>
          <ButtonInput
          disabled={false}
          fontWeight={600}
          text="Cancel"
          type='button'
            onClick={onClose}
            styles={{
              width: 'fit-content',
              backgroundColor: `${mode === 'light' ? 'transparent' : 'transparent'
                }`,
              color: `${mode === 'light'
                ? 'var(--tw-text-light-mainText)'
                : 'var(--tw-text-dark-mainText)'
                }`,
              border: `${mode === 'light'
                ? '1px solid var(--tw-text-light-mainText)'
                : '1px solid var(--tw-text-dark-mainText)'
                }`,
            }}
          />

          <ButtonInput
      
            disabled={!selectedUserId} // Disable if no user is selected
            fontWeight={600}
            text='Change'
            type='submit'
            onClick={() => {
                  setShowConfirmModal(true)
            }}
            styles={{
              width: 'fit-content',
              backgroundColor: `${mode === 'light'
                ? 'var(--tw-bg-light-main)'
                : 'var(--tw-bg-light-main)'
                }`,
              color: `${mode === 'light'
                ? 'var(--tw-bg-light-sidebar)'
                : 'var(--tw-bg-light-sidebar)'
                }`,

            }}
          />
           

        </Box>


      </Box>
    </Modal>
        <ConfirmBoxModel
        open={showConfirmModal}
        title="Confirm Change"
        description="Are you sure you want to change the Super Admin to this user?"
        onAgree={handleConfirmChange} // Call handleConfirmChange on confirmation
        onDisagree={() => setShowConfirmModal(false)} // Close dialog on cancel
        onClose={() => setShowConfirmModal(false)} // Close dialog on background click
        agreeText="Yes, Change"
        disagreeText="No, Cancel"
        />
    </>
  );
};

export default ChangeSuperAdminModal;
