import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar, Dialog, Portal } from 'react-native-paper';
import FilterListTable from './UI/Tables/FilterListTable';
import { useUser } from './context/UserContext';
import { MemberContext } from './context/MemberContext';
import PaginationFooter from './UI/TableFooter/TableFooter';
import { deleteUserAction, fetchDesignationFilterAction, fetchFilterDesignation, fetchMembersAction } from '../actions/user';
import { useTheme } from '../../theme/themeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VisibilityOutlinedIcon from 'react-native-vector-icons/MaterialIcons';
import DeleteOutlineOutlinedIcon from 'react-native-vector-icons/MaterialIcons';
import CiEdit from 'react-native-vector-icons/MaterialCommunityIcons';
import AddCircleOutline from 'react-native-vector-icons/MaterialIcons';
import AddMembers from './modals/AddMembers';
import ViewMemberDetails from './ViewMemberDetails';
import FilterListTableHeader from './UI/TableHeader/FilterListTableHeader';
import { Image } from 'react-native';
import ConfirmBoxModal from './UI/Popup/ConfirmBoxModal';

const MemberListDisplay = () => {
  const {
    setViewMembersForm,
    viewMembersForm,
    setContextUserId,
    contextUserId,
    step,
    setStep,
  } = useContext(MemberContext);
  console.log('Current step value from context:', step);
  
  const {theme,mode} = useTheme();
  const { user } = useUser();

  const [jsonMemberData, setJsonMemberData] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [designationId, setDesignationId] = useState<string | null>(null);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [roleId, setRoleId] = useState<string | null>(null); // State to hold roleId
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [showBlank, setShowBlank] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState<any>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;
  const [loading,setLoading] = useState(false);

    const [showViewMemberDetails, setShowViewMemberDetails] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);


    useEffect(() => {
      const checkRole = async () => {
        // Check the `flow` value from localStorage and set state
        const role = await AsyncStorage.getItem('flow');
        setIsAdmin(role === 'admin');
      };
      checkRole();
    }, []);

    

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

      setLoading(true);
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
    finally {
      setLoading(false);
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
        const designationData = response.map((designation:any) => ({
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
    fetchMembers(roleId, sortOption, searchTerm, currentPage); // Fetch updated data
    // onShowAddMembers(); // If you want to show the Add Member modal/form
  };


  const sortOptions = ['A-Z', 'Z-A'];
  const AddMemberButton = 'Add New Member';

  const handleSortName = (sortOption:any) => {
    console.log('Selected Sort Option:', sortOption);
    setSortOption(sortOption); // Update sortOption state
  };

  const handleFilterSelect = async (selectedOption:any) => {
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
      // console.error('Error during fetching designation or members:', error);
    }
  };

  const handleSearchChange = (term:any) => {
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
        setJsonMemberData((prevData) => prevData.filter((member) => member.id !== selectedUserId)
        );
      }
    } catch (error) {
      console.error('Error during user deletion:', error);
    } finally {
      setOpenConfirmDialog(false);
    }
  };


  const openDeleteDialog = (userId: string) => {
    setSelectedUserId(userId);
    setOpenConfirmDialog(true); // Open confirmation modal
  };
  

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



  // Ensure that 'field' values match what FilterListTable expects
  const mergedMemberData = jsonMemberData.map((member) => ({
    ...member,
    Name: (
      <View style={styles.nameContainer}>
        <Avatar.Image
          size={24}
          source={member.profilePicture ? { uri: member.profilePicture } : require('../images/avatar-placeholder.png')}
          style={styles.avatar}
        />
        <Text style={[styles.nameText,{color:theme.colors.mainText}]}>{`${member.firstName} ${member.lastName}`}</Text>
      </View>
    ),
  
    designationName: (
      <View style={styles.designationContainer}>
        <Text style={styles.designationText}>
          {member.designationName === 'societySuperAdmin' ? 'Admin' : member.designationName}
        </Text>
      </View>
    ),
    actions: (
      <View style={styles.actionContainer}>
        {/* View Icon */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            console.log('visibility icon clicked', member?.id);
            setViewMembersForm(true);
            setStep(1);
            setContextUserId(member.id);
          }}
        >
          <VisibilityOutlinedIcon name="visibility" size={24} color={mode === 'light' ? '#16151C' : '#F5F6FA'} />
        </TouchableOpacity>
    
        {/* Edit Icon */}
        {member.membershipStatusId === '1' && user?.id !== member.id && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              handleEditClick();
              setContextUserId(member.id);
              console.log('edit clicked', contextUserId);
              // setViewMembersForm(true);
            }}
          >
            <CiEdit name="pencil" size={24} color={theme.colors.mainText} />
          </TouchableOpacity>
        )}
    
        {/* Delete Icon */}
        {user?.id !== member.id && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              openDeleteDialog(member.id)
              console.log("deleted clicked");
            } }
          >
            <DeleteOutlineOutlinedIcon name="delete-outline" size={24} color={mode === 'light' ? '#16151C' : '#F5F6FA'} />
          </TouchableOpacity>
        )}
      </View>
    ),
    
  }));

  console.log("Table Data Sent to FilterListTable:", mergedMemberData);

  return (
<ScrollView style={styles.container}>
      {showAddMembers ? (
        <AddMembers
          open={showAddMembers}
          onClose={handleCloseAddMemberModal}
          modalButtonAdd={'Add'}
          modalButtonCancel={'Cancel'}
          onRefresh={() => fetchMembers(roleId, sortOption, searchTerm, currentPage)}
        />
      ) : showViewMemberDetails ? (
        <ViewMemberDetails />
      ) : (
        <>
          <View style={styles.headerContainer}>
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
              buttonIcon={<AddCircleOutline name="add-circle-outline" size={24} color="#fff" />}
            />
          </View>

          {/* Show loading indicator while fetching */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : jsonMemberData.length === 0 ? (
            <View style={styles.blankContainer}>
              <Image
                source={require('../images/Frame.png')}
                style={styles.blankImage}
                resizeMode="contain"
              />
              <Text>No Member data</Text>
            </View>
          ) : (
            <View style={styles.tableContainer}>
              <FilterListTable
                tableData={mergedMemberData}
                columnNameArray={columnNameArray}
                toDisplayFooter={false}
              />
              <PaginationFooter
                currentPage={currentPage}
                totalRecords={totalRecords}
                pageSize={pageSize}
                onPageChange={(newPage: number) => {
                  setCurrentPage(newPage);
                  fetchMembers(roleId, sortOption, searchTerm, newPage);
                }}
              />
            </View>
          )}
        </>
      )}
      <ConfirmBoxModal
        open={openConfirmDialog}
        title="Confirm Deletion"
        description="Are you sure you want to delete this member? This action cannot be undone."
        onAgree={handleDelete}
        onDisagree={() => setOpenConfirmDialog(false)}
        onClose={() => setOpenConfirmDialog(false)}
        agreeText="Delete"
        disagreeText="Cancel"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 20,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    // padding: '2%',
  },
  blankImage: {
    width: '100%',
    height: 200,
    marginTop: 20,
  },
  tableContainer: {
    // padding: 10,
  },
  blankContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginRight: 8,
  },
  nameText: {
    fontSize: 14,
  },
  designationContainer: {
    backgroundColor: '#7152F31A',
    color: '#7152F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    height: 35,
    width: '100%',
    maxWidth: 200,
    overflow: 'hidden',
    textAlign: 'center',
    justifyContent: 'center',
  },
  designationText: {
    color: '#7152F3',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap:5,
    minWidth: 120, // Adjust width as needed
  },
  iconButton: {
    padding: 8, // Ensures touchability
  },
  container: {
    padding: 16,
    marginBottom: 50,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default MemberListDisplay;
