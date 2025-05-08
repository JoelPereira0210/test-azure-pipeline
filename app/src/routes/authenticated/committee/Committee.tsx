import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Image } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonInput from '../../../component/UI/Button/Button';
import Designation from '../../../component/modals/DesignationModal';
import DisplayDesignation from '../../../component/modals/DisplayDesignation';
import MemberListTableModal from '../../../component/modals/MemberListTableModal';
import AlertPopUp from '../../../component/UI/Popup/AlertPopUp';
import { fetchDesignationData, fetchSelectedDesignationMembers, fetchMembers } from '../../../actions/designation';
import CommitteParent from '../../../component/CommitteParent';
import AddCircleOutlineIcon from 'react-native-vector-icons/MaterialIcons';
import MoreHorizIcon from 'react-native-vector-icons/MaterialIcons';
import EditMemberDesignation from '../../../component/modals/EditMemberDesignation';
import { useTheme } from '../../../../theme/themeProvider';
import Footer from '../../../component/UI/Footer/foter';
import { MoreDetailsProvider } from '../../../component/context/MoreDetails';

const Committee = () => {
  const [showDesignation, setShowDesignation] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMemberListModal, setShowMemberListModal] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [showAlertPopUp, setShowAlertPopUp] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  interface DesignationDetails {
    users?: Array<any>;
  }
  const [userSelectedDesignationDetails, setSelectedDesignationUserDetails] = useState<DesignationDetails>({});
  const [sortOption, setSortOption] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  interface MemberDetails {
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    phoneNumber: string;
    userId: string;
  }
  // For editing a member's designation
  const [selectedMemberDetails, setSelectedMemberDetails] = useState<MemberDetails | null>(null);
  const [editMemberModalOpen, setEditMemberModalOpen] = useState(false);

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const {theme} = useTheme();

  // Check if user is admin from AsyncStorage (similar to localStorage in web)
  useEffect(() => {
    const checkAdminRole = async () => {
      const role = await AsyncStorage.getItem('flow');
      setIsAdmin(role === 'admin');
    };
    checkAdminRole();
  }, []);

  useEffect(() => {
    fetchDesignations();
  }, []);

  // Re-fetch data when designation, sort option or search term changes
  useEffect(() => {
    fetchData(sortOption, searchTerm);
  }, [selectedDesignation, sortOption, searchTerm]);

  interface Designation {
    designationName: string;
  }

  const fetchDesignations = async () => {
    try {
      const response = await fetchDesignationData();
      if (response) {
        const fetchedDesignations = response.map((item: Designation) => item.designationName);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (sortOpt = null, search = '', page = 0) => {
    if (selectedDesignation) {
      try {
        const limit = pageSize;
        const offset = page * limit;
        const members = await fetchSelectedDesignationMembers(
          selectedDesignation,
          sortOpt,
          search,
          limit,
          offset
        );
        setSelectedDesignationUserDetails(members);
        // This call mimics your original code’s additional call
        fetchSelectedDesignationMembers(selectedDesignation);
      } catch (error) {
        // console.error('Error fetching selected designation members:', error);
      }
    }
  };

  const handleSortName = (sortOpt:any) => {
    setSortOption(sortOpt);
    fetchData(sortOpt, searchTerm);
  };

  const handleSearchChange = (term:any) => {
    setSearchTerm(term);
    fetchData(sortOption, term);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortOption(null);
    fetchData(null, '');
  };

  const handlePageChange = async (newPage:any) => {
    setCurrentPage(newPage);
    try {
      const limit = pageSize;
      const offset = newPage * limit;
      const response = await fetchMembers(limit, offset);
      if (response && response.userDetails) {
        setUserDetails(response.userDetails);
        setTotalRecords(response.totalRecords || 0);
      }
    } catch (error) {
      console.error('Error fetching members on page change:', error);
    }
  };

  const handleDesignationSelect = (designation:any) => {
    setSelectedDesignation(designation);
  };

  const handleDesignationAdded = async () => {
    await fetchDesignations();
    setShowDesignation(false);
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

  const handleEditMemberClick = (user:any) => {
    const memberDetailsWithEmail = {
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      phoneNumber: user.phoneNumber,
      userId: user.userId,
    };
    setSelectedMemberDetails(memberDetailsWithEmail);
    setEditMemberModalOpen(true);
  };

  const handleDesignationMembersFetched = (designationMembers:any) => {
    setSelectedDesignationUserDetails(designationMembers);
  };

  // Transform user details similar to the web component
  const transformedUserDetails =
    selectedDesignation === 'member'
      ? []
      : userSelectedDesignationDetails?.users?.map((user:any) => {
          const isAdminText = user.isAdmin ? 'Yes' : 'No';
          return {
            name: `${user.firstName} ${user.lastName}`,
            designation: (
              <View style={styles.designationContainer}>
                <Text style={styles.designationText}>{selectedDesignation}</Text>
              </View>
            ),
            mobileNumber: user.phoneNumber,
            admin: (
              <View style={[styles.adminContainer, user.isAdmin ? styles.adminYes : styles.adminNo]}>
                <Text style={[styles.adminText,{color:theme.colors.mainText}]}>{isAdminText}</Text>
              </View>
            ),
            action: (
              <MoreHorizIcon
                name="more-horiz"
                size={24}
                color={theme.colors.mainText}
                onPress={() => handleEditMemberClick(user)}
              />
            ),
          };
        }) || [];

  const columnNameArray = [
    { field: 'name', headerName: 'Name' },
    { field: 'designation', headerName: 'Designation' },
    { field: 'mobileNumber', headerName: 'Mobile Number' },
    { field: 'admin', headerName: 'Admin' },
    { field: 'action', headerName: 'Action' },
  ];

  const columnsToDisplay = isAdmin 
  ? columnNameArray
  : columnNameArray.filter((column) =>
    ['name', 'designation', 'mobileNumber'].includes(column.field)
  );

console.log('Filtered Columns:', columnsToDisplay);


  return (
    <>
  <SafeAreaView style={styles.safeArea}>
      {/* Main container with relative positioning to place the footer absolutely */}
      <View style={styles.mainContainer}>
        {/* Scrollable area */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            {
              backgroundColor: theme.colors.background,
              // Enough bottom padding so content doesn't hide behind footer
              paddingBottom: 20,
            },
          ]}
        >
      {loading ? (
        <ActivityIndicator animating={true} size="large" color={theme.colors.main} />
      ) : (
        <>
          {designations.length > 0 ? (
            <>
      
              <CommitteParent
                transformedUserDetails={transformedUserDetails}
                columnNameArray={columnsToDisplay}
                selectedDesignation={selectedDesignation || ''}
                onDesignationSelect={handleDesignationSelect}
                onDesignationMembersFetched={handleDesignationMembersFetched}
                onSortSelect={handleSortName}
                onSearchChange={handleSearchChange}
                onClearFilters={handleClearFilters}
                onSearchClear={() => setSearchTerm('')}
                onClearFilterSortOption={() => setSortOption(null)}
              />

              {/* {selectedDesignation && transformedUserDetails.length === 0 && isAdmin && ( */}
              {selectedDesignation  && isAdmin && (
                <ButtonInput
                  text={`Add ${selectedDesignation}`}
                  disabled={false}
                  loading={false}
                  icon={<AddCircleOutlineIcon name="add-circle-outline" size={24} color={'white'} />}
                  fontWeight="600"
                  fontSize={16}
                  onPress={handleAddSelectedDesignationClick}
                  styles={[styles.addButton,{paddingBottom:120}]}
                />
              )}
            </>
          ) : (
            <>
             <View style={styles.emptyContainer}>
                            <Image source={require('../../../images/Frame.png')} style={styles.emptyImage} resizeMode="contain" />
                          <Text style={[{color:theme.colors.mainText}]}>No Designations Created</Text>
                
                        </View>

              {isAdmin && (
                <ButtonInput
                  text="Add New Designation"
                  disabled={false}
                  loading={false}
                  fontWeight="600"
                  fontSize={16}
                  onPress={() => setShowDesignation(true)}
                  styles={styles.addButton}
                />
              )}
            </>
          )}

          {/* Modals */}
          <Designation
            open={showDesignation}
            onClose={() => setShowDesignation(false)}
            modalButtonAdd="Add"
            modalButtonCancel="Cancel"
            onClick={handleDesignationAdded}
          />

          <MemberListTableModal
            open={showMemberListModal}
            onClose={() => {
              setShowMemberListModal(false);
              setShowAlertPopUp(false);
            }}
            userDetails={userDetails}
            fetchData={fetchData}
            selectedDesignation={selectedDesignation || ''}
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            modalButtonCancelText="Cancel"
          />

          <AlertPopUp
            open={showAlertPopUp}
            onClose={() => setShowAlertPopUp(false)}
            title="No members added yet"
            note="Please add members before assigning roles"
            buttonText="Okay"
          />

          <EditMemberDesignation
            open={editMemberModalOpen}
            fetchData={fetchData}
            onClose={() => setEditMemberModalOpen(false)}
            memberDetails={selectedMemberDetails}
            selectedDesignation={{ designationName: selectedDesignation || '' }}
          />
        </>
      )}
      </ScrollView>

{/* Pinned footer - absolutely positioned */}
<Footer />
</View>
</SafeAreaView>
</>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    position: 'relative', // so Footer can be absolutely positioned
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    // flexGrow is optional, but helps if your content is short
    flexGrow: 1,
  },
  noDataText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 18,
    marginVertical: 20,
  },
  addButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  designationContainer: {
    backgroundColor: '#7152F31A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    height: 35,
    maxWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  designationText: {
    color: '#7152F3',
  },
  adminContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    height: 35,
    maxWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminYes: {
    backgroundColor: '#3FC28A1A',
  },
  adminNo: {
    backgroundColor: '#EFBE121A',
  },
  adminText: {
    // color: 'black',
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
});

export default Committee;
