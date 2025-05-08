"use client"
import React, { useEffect, useState, useContext } from 'react';
import {
  fetchMembersAction,
  deleteUserAction,
  fetchDesignationFilterAction,
  fetchFilterDesignation,
} from '@/src/actions/user';
import { AddCircleOutline } from '@mui/icons-material';
import { Avatar, Box, Button, useTheme, useMediaQuery } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { CiEdit } from 'react-icons/ci';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ConfirmBoxModel from './UI/Popup/ConfirmBoxModel';
import FilterListTable from './UI/Tables/FilterListTable';
import AddMembers from './modals/AddMembers';
import CheckboxInput from './UI/Checkbox/checkbox';
import FilterListTableHeader from './UI/TableHeader/FilterListTableHeader';
import { useUser } from './context/UserContext';
import ViewMemberDetails from './ViewMemberDetails';
import { MemberContext } from '@/src/component/context/MemberContext';
import { Footer } from './UI/Footer/Foter';
import { MoreDetailsProvider } from './context/MoreDetails';
import PaginationFooter from './UI/TableFooter/TableFooter';

const MemberListDisplay = () => {
  const {
    viewMembersForm,
    setViewmembersForm,
    MemberActionType,
    setMemberActionType,
    contextUserId,
    setContextUserId,
    step,
    setStep,
  } = useContext(MemberContext);
  console.log('Current step value from context:', step);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const mode = theme.palette.mode;
  const [jsonMemberData, setJsonMemberData] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [designationId, setDesignationId] = useState<string | null>(null);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [roleId, setRoleId] = useState<string | null>(null); // State to hold roleId
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [showBlank, setShowBlank] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(0); // Current page index
const [totalRecords, setTotalRecords] = useState(0); // Total record count
const pageSize = 10; // Number of records per page


  const [showViewMemberDetails, setShowViewMemberDetails] = useState(false);
  const modalButtonAddText = 'Add';
  const modalButtonCancelText = 'Cancel';
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    // Check the `flow` value from localStorage and set state
    const role = localStorage.getItem('flow');
    setIsAdmin(role === 'admin');
  }, []);
    

  const confirmBoxStyles: React.CSSProperties = {
    marginLeft: isMobile ? '-1rem' : 'auto',
    marginTop: isMobile ? '-160rem' : 'auto',
    background: 'none',
  };

  const handleEditClick = () => {
    console.log('edit clied');
    console.log("context",contextUserId)
    setStep(4);
    setShowViewMemberDetails(true); // Open the ViewMemberDetails form
  };


    const fetchMembers = async (
      roleId: string | null = null,
      sortOption: string | null = null,
      searchTerm: string = '',
      page=0
    ) => {
      try {


        const limit = pageSize; // Number of records per page
        const offset = page * limit; // Calculate offset
        // const offset = 10

        
        const response = await fetchMembersAction(
          roleId,
          sortOption,
          searchTerm,
           limit, 
           offset
        ); // Pass roleId here
        console.log('Full Response:', response);
        const { userDetails } = response;
        setTotalRecords(response.totalRecords); // Set total records for pagination

        if (Array.isArray(userDetails)) {
          const newMembersData = userDetails.map((user) => ({
            id: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.phoneNumber,
            designationName: user.designationName,
            membershipStatusId: user.membershipStatusId, 
            membershipStatus: user.membershipStatus,profilePicture:user.profilePicture
          }));
          setJsonMemberData(newMembersData);
          console.log('Updated Member Data:', newMembersData);
          newMembersData.forEach((member) => {
            console.log('MembershipStatusId for', member.firstName, member.membershipStatusId);
          });
        } else {
          console.error(
            'userDetails is not an array or is undefined:',
            userDetails
          );
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    useEffect(() => {
      fetchMembers(roleId, sortOption, searchTerm, currentPage);
    }, [roleId, sortOption, searchTerm, currentPage]);
    

  useEffect(() => {
    const fetchFilterDesignation = async () => {
      try {
        const response = await fetchDesignationFilterAction();
        console.log('Full Response in designationfilteraction:', response);

        // Store designation names along with their IDs
        const designationData = response.map((designation) => ({
          id: designation.designationId, // Assuming designationId is available
          name: designation.designationName,
        }));
        setFilterOptions(designationData); // Store as an array of objects
        console.log(
          'Designation Data in member list for designation:',
          designationData
        );
      } catch (error) {
        console.error('Error fetching designation filter:', error);
      }
    };

    fetchFilterDesignation();
  }, []);

  const handleAddMemberClick = () => {
    console.log(
      'Add New Member button is clicked from the header of the table'
    );
    setShowAddMembers(true);
    // onShowAddMembers(); // If you want to show the Add Member modal/form
  };

  const handleCloseAddMemberModal = () => {
    console.log(
      'Add New Member button is clicked from the header of the table'
    );
    setShowAddMembers(false);
    // onShowAddMembers(); // If you want to show the Add Member modal/form
  };

  const sortOptions = ['A-Z', 'Z-A'];
  const AddMemberButton = 'Add New Member';

  const handleSortName = (sortOption) => {
    console.log('Selected Sort Option:', sortOption);
    setSortOption(sortOption); // Update sortOption state
  };

  const handleFilterSelect = async (selectedOption) => {
    console.log('Selected Filter Option:', selectedOption.name);
    console.log('Corresponding Designation ID:', selectedOption.id);

    setDesignationId(selectedOption.id);
    try {
      const response = await fetchFilterDesignation(selectedOption.id);

      if (response.status === 200) {
        setShowBlank(false);
        const roleIdFetched = response.data.record;
        console.log('Role ID fetched successfully:', roleIdFetched);
        setRoleId(roleIdFetched);
      } else {
        console.log('No datafound in');
      }
    } catch (error) {
      setShowBlank(true);
      console.error('Error during fetching designation or members:', error);
    }
  };
  const handleSearchChange = (term) => {
    console.log('Search Term:', term); // Log the search term
    setSearchTerm(term); // Update the state
  };

  const handleClearFilters = () => {
    setShowBlank(false);
    setRoleId(null);
    setSortOption(null);
    setSearchTerm('');
    setDesignationId(null);
  };

  const handleClearDesignationFilter = () => {
    setRoleId(null);

    setShowBlank(false);
  };

  const handleClearSortNameFilter = () => {
    setSortOption(null);
    setShowBlank(false);
  };

  

  const handleClearSearchFilter = () => {
    setSearchTerm(null);
    setShowBlank(false);
  };

  const handleDelete = async () => {
    if (!selectedUserId) return; // Ensure userId is selected
    console.log('Delete user with ID:', selectedUserId);
    try {
      const response = await deleteUserAction(selectedUserId);
      if (response?.status === 200) {
        console.log('Member deleted successfully');
        setJsonMemberData((prevData) =>
          prevData.filter((member) => member.id !== selectedUserId)
        );
      }
    } catch (error) {
      console.error('Error during user deletion:', error);
    } finally {
      setOpenDialog(false); // Close the dialog after deletion
    }
  };

  const openDeleteDialog = (userId: string) => {
    setSelectedUserId(userId); // Store the userId of the member to be deleted
    setOpenDialog(true);
  };
  let fullName = '';
  const columnNameArray = isAdmin
  ?  [
    { field: 'Name', headerName: 'Name' },
    { field: 'mobileNumber', headerName: 'Mobile Number' },
    { field: 'designationName', headerName: 'Designation' },
    { field: 'membershipStatus', headerName: 'Status' },
    { field: 'actions', headerName: 'Actions' },
  ]
  :

    [
      { field: 'Name', headerName: 'Name' },
      { field: 'designationName', headerName: 'Designation' },
    ];


      // [
      //   { field: 'Name', headerName: 'Name' },
      //   { field: 'designationName', headerName: 'Designation' },
      // ];

  const mergedMemberData = jsonMemberData.map((member) => ({
    ...member,

    Name: (
      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <Avatar
          alt={member.name}
          // src={member.avatar}
          src={member.profilePicture || null}
          // style={{ marginRight: 8, width: 24, height: 24 }}
          style={{ marginRight: 8 }}
        />
        {`${member.firstName}  ${member.lastName}`}
      </Box>
    ),
    designationName: (
      <Box
        sx={{
          backgroundColor: '#7152F31A',
          color: '#7152F3',
          padding: '4px 8px',
          borderRadius: '4px',
          height: '35px',
          width: '100%',
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {member.designationName === 'societySuperAdmin'
          ? 'Admin'
          : member.designationName}
      </Box>
    ),
    actions: (
      <div style={{}}>
        <Button
          style={{ padding: '5px', minWidth: '40px', height: '40px' }}
          onClick={() => {
            console.log('userId afetr edit', member?.id); // Log the userId to the console
            setViewmembersForm(true);
            setStep(1);
            setContextUserId(member.id);
          }}
        >
          <VisibilityOutlinedIcon
            style={{
              fontSize: '20px',
              color: mode === 'light' ? '#16151C' : '#F5F6FA',
            }}
          />
        </Button>
        {/* <>
        {console.log("name status",user?.firstName, member)}
        </> */}
      
        {((member.membershipStatusId === '1') && ((user?.userId !== member.id))) && (
  <Button
    style={{ padding: '5px', minWidth: '40px', height: '40px' }}
    onClick={() => {
      handleEditClick();
      setContextUserId(member.id);
      console.log('userId after edit, edit clicked', contextUserId); // Log the userId to the console
      setViewmembersForm(true);
    }}
  >
    <CiEdit
      style={{
        fontSize: '20px',
        color: mode === 'light' ? '#16151C' : '#F5F6FA',
      }}
    />
  </Button>
)}


    
        {user?.userId !== member.id && (
          <Button
            style={{ padding: '5px', minWidth: '40px', height: '40px' }}
            onClick={() => openDeleteDialog(member.id)} // Open delete dialog and store userId
          >
            <DeleteOutlineOutlinedIcon
              style={{
                fontSize: '20px',
                color: mode === 'light' ? '#16151C' : '#F5F6FA',
              }}
            />
          </Button>
        )}
      </div>
    ),
  }));

  return (
    <>
    <MoreDetailsProvider>
      {showAddMembers ? (
        <AddMembers
          open={showAddMembers}
          onClose={handleCloseAddMemberModal}
          modalButtonAdd={modalButtonAddText}
          modalButtonCancel={modalButtonCancelText}
        />
      ) : showViewMemberDetails ? (
        // If viewing member details, render the ViewMemberDetails component
        <ViewMemberDetails/>
      ) : (
        <>
          <Box sx={{ width: '100%', textAlign: 'center' , 
   
     
    padding: '2%'}}>
            <FilterListTableHeader
              filterOptions={filterOptions}
              onFilterSelect={handleFilterSelect}
              sortOptions={sortOptions}
              onSortSelect={handleSortName}
              Buttontext={AddMemberButton}
              onButtonClick={handleAddMemberClick}
              onSearchChange={handleSearchChange}
              onClearFilters={handleClearFilters}
              onSearchClear={handleClearSearchFilter}
              onClearFilterSortOption={handleClearSortNameFilter}
              onClearFilterOption={handleClearDesignationFilter}
              showSearch={true}
              showButton={isAdmin}
              showFilter={true}
              showSort={true}
              buttonIcon={<AddCircleOutline />}
            />
          </Box>

          {/* Check for showBlank and conditionally render the table */}
          {showBlank ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100vh" // Adjust as needed for your layout
            >
              <Box
                sx={{
                  width: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start', // Align children to the top
                  color: 'black',
                  textAlign: 'center',
                  padding: '4rem',
                  borderRadius: '0.8rem',
                  marginLeft: '18%',
                  marginTop: '-15rem',
                  position: 'relative',
                  '@media (max-width: 600px)': {
                    marginLeft: '0',
                    width: '100%',
                    padding: '2rem',
                    border: 'none',
                  },
                }}
              >
                <img
                  src="/images/Frame.png"
                  alt="Description of image"
                  style={{ maxWidth: '100%', height: 'auto' }} // Ensure image is responsive
                />
              </Box>
            </Box>
          ) : (
            <Box>
            <FilterListTable
              tableData={mergedMemberData}
              columnNameArray={columnNameArray}
              toDisplayFooter={false}
              // onEditClick={handleEditClick} // Ensure this is passed to handle edit clicks
            />

                    <PaginationFooter
          currentPage={currentPage}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={(newPage) => {
            setCurrentPage(newPage);
            fetchMembers(roleId, sortOption, searchTerm, newPage); // Fetch new page data
          }}
      
        />
        </Box>
          )}

          <ConfirmBoxModel
            styles={confirmBoxStyles}
            open={openDialog}
            title="Confirm Deletion"
            description="Are you sure you want to delete this member?"
            onAgree={handleDelete}
            onDisagree={() => setOpenDialog(false)}
            onClose={() => setOpenDialog(false)}
            agreeText="Yes, Delete"
            disagreeText="No, Cancel"
          />
        </>
      )}
      <Footer/>
      </MoreDetailsProvider>
    </>
  );
};

export default MemberListDisplay;