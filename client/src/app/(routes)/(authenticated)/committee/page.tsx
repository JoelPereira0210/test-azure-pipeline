'use client';
import React, { useState, useEffect } from 'react';
import BaseContainer from '@/src/component/UI/Basecontainer';
import Designation from '@/src/component/modals/DesignationModal';
import DisplayDesignation from '@/src/component/modals/DisplayDesignation';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import ButtonInput from '@/src/component/UI/Button/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  fetchDesignationData,
  fetchMembers,
  fetchSelectedDesignationMembers,
} from '@/src/actions/designation';
import AlertPopUp from '@/src/component/UI/Popup/AlertPopUp';
import MemberListTableModal from '@/src/component/modals/MemberListTableModal';
import FilterListTable from '@/src/component/UI/Tables/FilterListTable';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditmemberDesignation from '@/src/component/modals/EditMemberDesignation';
import CommitteParent from '@/src/component/CommitteParent';
import { array } from 'zod';
import { Footer } from '@/src/component/UI/Footer/Foter';
import { MoreDetailsProvider } from '@/src/component/context/MoreDetails';

const Committee = () => {
  const [showDesignation, setShowDesignation] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showMemberListModal, setShowMemberListModal] = useState(false);
  const [designations, setDesignations] = useState<string[]>([]);
  const [showAlertPopUp, setShowAlertPopUp] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [userSelectedDesignationDetails, setSelectedDesignationUserDetails] =
    useState<{ users: any[] }>({ users: [] });
  const [editMemberModalOpen, setEditMemberModalOpen] = useState(false);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState(null);
  const sortOptions = ['A-Z', 'Z-A'];
  const designationText = 'Add New Designation';
  const containerText = designations.length > 0 ? '' : 'No Designation Created';
  const modalButtonAddText = 'Add';
  const modalButtonCancelText = 'Cancel';
  const [sortOption, setSortOption] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0); // Current page index
  const [totalRecords, setTotalRecords] = useState(0); // Total number of records
  const pageSize = 10; // Number of records per page

 


  const [isAdmin, setIsAdmin] = useState(false);
   useEffect(() => {
     const role = localStorage.getItem('flow');
     setIsAdmin(role === 'admin');
   }, []);


  

  const handleSortName = (sortOption) => {
    console.log('Selected Sort Option:', sortOption);
    setSortOption(sortOption); // Update sortOption state
    // Call fetchData with the selected sort option
    fetchData(sortOption);
  };

  const handleSearchChange = (term) => {0
    console.log('Search Term:', term); // Log the search term
    setSearchTerm(term); // Update the state
    fetchData(searchTerm);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortOption(null);
  };
  const handleClearSortNameFilter = () => {
    setSortOption(null);
  };

  const handleClearSearchFilter = () => {
    setSearchTerm(null);
  };

  const handleDesignationClick = () => {
    setShowDesignation(true);
  };

  const handleCloseModal = () => {
    setShowDesignation(false);
  };

  const handleDesignationAdded = async () => {
    await fetchDesignations();
    setShowDesignation(false);
  };

  const handleErrorModalClose = () => {
    setShowAlertPopUp(false);
  };

  const handleDesignationSelect = (designation: string | null) => {
    setSelectedDesignation(designation);
  };
  console.log('selcted designation in comitte', selectedDesignation);

  const fetchData = async (
    sortOption: string | null = null,
    searchTerm: string = '',
    page = 0,
  ) => {
    if (selectedDesignation) {
      try {

        const limit = pageSize; // Define limit
        const offset = page * limit; // Calculate offset dynamically

        const members = await fetchSelectedDesignationMembers(
          selectedDesignation,
          sortOption,
          searchTerm,
          limit,  
          offset  
        );
        setSelectedDesignationUserDetails(members);
        fetchSelectedDesignationMembers(selectedDesignation);
      } catch (error) {
        console.error('Error fetching selected designation members:', error);
      }
    }
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    
    try {
      const limit = pageSize; // Number of records per page
      const offset = newPage * limit; // Calculate offset dynamically
  
      const response = await fetchMembers(limit, offset);
  
      if (response && response.userDetails) {
        setUserDetails(response.userDetails);
        setTotalRecords(response.totalRecords || 0); // Update total records
      }
    } catch (error) {
      console.error("Error fetching members on page change:", error);
    }
  };
  

  // Update useEffect to call fetchData when selectedDesignation changes
  useEffect(() => {
    fetchData(sortOption, searchTerm); // Pass sortOption to fetchData
  }, [selectedDesignation, sortOption, searchTerm]);

  const fetchDesignations = async () => {
    try {
      const response = await fetchDesignationData();
      if (response) {
        const fetchedDesignations = response.map(
          (item: { designationName: string }) => item.designationName
        );
        setDesignations(fetchedDesignations);

        if (fetchedDesignations.length === 0) {
          setSelectedDesignation(null);
          setShowDesignation(false);
        } else {
          setSelectedDesignation(fetchedDesignations[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
    }
  };

  const handleAddSelectedDesignationClick = async () => {
    try {
      const response = await fetchMembers();
      if (response && response.userDetails && response.userDetails.length > 0) {
        setUserDetails(response.userDetails);
        setShowAlertPopUp(false);
        setShowMemberListModal(true);
      } else {
        setShowAlertPopUp(true);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleDesignationMembersFetched = (designationMembers) => {
    setSelectedDesignationUserDetails(designationMembers);
  };
  console.log('selcted designation', userSelectedDesignationDetails);
  const isMobile = window.innerWidth <= 600;

  const transformedUserDetails =
    selectedDesignation === 'member' // Check if the designation is 'Member'
      ? [] // If true, set transformedUserDetails to an empty array
      : userSelectedDesignationDetails?.users?.map((user) => {
        const isAdmin = user.isAdmin ? 'Yes' : 'No';
        const adminStyle = user.isAdmin
          ? {
            color: '#3FC28A',
            backgroundColor: '#3FC28A1A',
          }
          : {
            color: '#EFBE12',
            backgroundColor: '#EFBE121A',
          };

        return {
          name: `${user.firstName} ${user.lastName}`,
          designation: (
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
              {selectedDesignation}
            </Box>
          ),
          mobileNumber: user.phoneNumber,
          admin: (
            <Box
              sx={{
                ...adminStyle,
                padding: '4px 8px',
                borderRadius: '4px',
                height: '35px',
                width: '100%',
                maxWidth: '100px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isAdmin}
            </Box>
          ),
          action: (
            <MoreHorizIcon onClick={() => handleEditMemberClick(user)} />
          ),
        };
      }) || []; // Default to an empty array if no users are found

  const columnNameArray = [
    { field: 'name', headerName: 'Name' },
    { field: 'designation', headerName: 'Designation' }, // Only one designation column
    { field: 'mobileNumber', headerName: 'Mobile Number' },
    { field: 'admin', headerName: 'Admin' },
    { field: 'action', headerName: 'Action' },
  ];
  console.log('data', transformedUserDetails, columnNameArray);


  const columnsToDisplay = isAdmin 
    ? columnNameArray
    : columnNameArray.filter((column) =>
      ['name', 'designation', 'mobileNumber'].includes(column.field)
    );

  console.log('Filtered Columns:', columnsToDisplay);

  const handleEditMemberClick = (user) => {
    // Assuming the user object has an email field
    const memberDetailsWithEmail = {
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      phoneNumber: user.phoneNumber,
      userId: user.userId, // Add the new field here
    };
    setSelectedMemberDetails(memberDetailsWithEmail); // Set the modified member details
    setEditMemberModalOpen(true); // Open the edit modal
  };

  console.log('memberDeatl', selectedMemberDetails);

  return (
    <>
    <MoreDetailsProvider>
    <Box sx={{
      zIndex:"100"
    }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Box
          sx={{
            gap: '1%',
            border: '1px solid #A2A1A833',
            borderRadius: '10px',
            width: 'calc(100% - 240px)',
            '@media (max-width:767px)': {
              width: '100%',
            },
             marginBottom:"3%"
          }}
          
        >
          {/* <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}> */}
          {designations.length > 0 ? (
            <Box>
              <Box
                sx={{
                  marginLeft: '1%',
                }}
              >
                {selectedDesignation && transformedUserDetails.length === 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: {
                        xs: '1%',
                        sm: '1%',
                        lg: '1%',
                        md: '1%',
                        xl: '1%',
                      },
                      marginRight: {
                        xs: '1%',
                        sm: '1%',
                        lg: '1%',
                        md: '1%',
                        xl: '1%',
                      },
                    }}
                  >
                    {(isAdmin &&
                      <ButtonInput
                        text={`Add ${selectedDesignation}`}
                        disabled={false}
                        type="button"
                        loading={false}
                        icon={<AddCircleOutlineIcon />}
                        fontWeight={600}
                        fontSize={16}
                        styles={{
                          maxWidth: '300px',
                          

                          wordBreak: 'break-all',

                          marginTop: '4%',
                          marginBottom: '-6%',
                          width: isMobile ? 'fit-content' : 'auto',
                          height: isMobile ? '12%' : 'auto',
                          
                          // marginRight: isMobile ? '5.5rem' : '0',
                        }}
                        onClick={handleAddSelectedDesignationClick}
                      />)}

                      
                  </Box>
                )}
                <CommitteParent
                  transformedUserDetails={transformedUserDetails}
                  columnNameArray={columnsToDisplay}
                  selectedDesignation={selectedDesignation}
                  onDesignationSelect={handleDesignationSelect}
                  onDesignationMembersFetched={handleDesignationMembersFetched}
                  onSortSelect={handleSortName}
                  onSearchChange={handleSearchChange}
                  onClearFilters={handleClearFilters}
                  onSearchClear={handleClearSearchFilter}
                  onClearFilterSortOption={handleClearSortNameFilter}
                />

                {selectedDesignation && transformedUserDetails.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginBottom: {
                        xs: '1%',
                        sm: '1%',
                        lg: '1%',
                        md: '1%',
                        xl: '1%',
                      },
                      marginRight: {
                        xs: '1%',
                        sm: '1%',
                        lg: '1%',
                        md: '1%',
                        xl: '1%',
                      },
                    }}
                  >
                    {(isAdmin &&
                      <ButtonInput
                        text={`Add ${selectedDesignation}`}
                        disabled={false}
                        type="button"
                        loading={false}
                        icon={<AddCircleOutlineIcon />}
                        fontWeight={600}
                        fontSize={16}
                        styles={{
                          maxWidth: '300px',

                          wordBreak: 'break-all',

                          // marginTop: isMobile ? '5%' : '',
                          width: isMobile ? 'fit-content' : 'auto',
                          height: isMobile ? '12%' : 'auto',
                          // marginRight: isMobile ? '5.5rem' : '0',
                        }}
                        onClick={handleAddSelectedDesignationClick}
                      />)}
                  </Box>
                )}
              </Box>
            </Box>
          ) : (
            <>
              <BaseContainer text="No Designations" >
              {isAdmin && (
                <ButtonInput
                  text={designationText}
                  disabled={false}
                  type="button"
                  loading={false}
                  fontWeight={600}
                  fontSize={16}
                  styles={{
                    width: '100%',
                    maxWidth: '300px',
                    marginTop: '1rem',
                    alignSelf: 'center',
                  }}
                  onClick={handleDesignationClick}
                />)}
              </BaseContainer>
            </>
          )}

          {/* </Box> */}

          <Designation
            open={showDesignation}
            onClose={handleCloseModal}
            modalButtonAdd={modalButtonAddText}
            modalButtonCancel={modalButtonCancelText}
            onClick={handleDesignationAdded}
          />

          {userDetails.length > 0 ? (
            <MemberListTableModal
              open={showMemberListModal}
              modalButtonCancelText={modalButtonCancelText}
              onClose={() => {
                setShowMemberListModal(false);
                setShowAlertPopUp(false);
              }}
              userDetails={userDetails}
              fetchData={fetchData}
              selectedDesignation={selectedDesignation}
              currentPage={currentPage}  
              totalRecords={totalRecords}
              pageSize={pageSize}        
              onPageChange={handlePageChange} 
       
            />
          ) : (
            <AlertPopUp
              open={showAlertPopUp}
              onClose={handleErrorModalClose}
              title="There are no members added yet"
              note="Please add members before assigning a role"
              buttonText="Okay"
            />
          )}

          <EditmemberDesignation
            open={editMemberModalOpen}
            fetchData={fetchData}
            onClose={() => setEditMemberModalOpen(false)}
            memberDetails={selectedMemberDetails}
            selectedDesignation={{ designationName: selectedDesignation }}
          />
        </Box>
      </Box>
      </Box>
      <Footer/>
      </MoreDetailsProvider>
    </>
  );
};

export default Committee;