import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  Portal,
  Modal,
  ActivityIndicator,
  Avatar,
} from 'react-native-paper';
import FilterListTableHeader from '../UI/TableHeader/FilterListTableHeader';
import FilterListTable from '../UI/Tables/FilterListTable';
import PaginationFooter from '../UI/TableFooter/TableFooter';
import ButtonInput from '../UI/Button/Button';
import ConfirmBoxModal from '../UI/Popup/ConfirmBoxModal';
import { fetchDesignationData, fetchActiveMembers } from '../../actions/designation';
import { changeSocietySuperAdmin } from '../../actions/profile';
import { useNavigation } from '@react-navigation/native';
import CheckboxInput from '../UI/CheckBox/CheckBox';
import { useTheme } from '../../../theme/themeProvider';
import RNRestart from 'react-native-restart';
const pageSize = 10;

interface ChangeSuperAdminProps {
  open: boolean;
  onClose: () => void;
  LoggedInUserId: string;
}

const ChangeSuperAdminModal: React.FC<ChangeSuperAdminProps> = ({
  open,
  onClose,
  LoggedInUserId,
}) => {
  const [userDetails, setUserDetails] = useState<any[]>([]);
  const [originalUserData, setOriginalUserData] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const navigation = useNavigation();
  const {theme} = useTheme();


  // Fetch members and designations
  const fetchDesgnData = async (page = 0, limit = pageSize) => {
    try {
      setLoading(true);
      setError(null);
      const offset = page * limit;
      const membersData = await fetchActiveMembers(limit, offset);
      const designationsData = await fetchDesignationData();

      setUserDetails(membersData.userDetails);
      setOriginalUserData(membersData.userDetails);
      setTotalRecords(membersData.totalRecords);
      setFilterOptions(
        designationsData.map((designation: any) => ({
          id: designation.designationId,
          name: designation.designationName,
        }))
      );

      if (!membersData || membersData.userDetails.length === 0) {
        setError('No members found for the specified society.');
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      // Whenever the modal opens, fetch data
      fetchDesgnData(currentPage);
    }
  }, [open, currentPage]);

  const handleCheckboxChange = (userId: string) => {
    if (selectedUserId === userId) {
      setSelectedUserId(null);
    } else {
      setSelectedUserId(userId);
    }
  };

  // Sorting, searching, filtering
  useEffect(() => {
    let updatedData = [...originalUserData];
    if (sortOption === 'A-Z') {
      updatedData.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortOption === 'Z-A') {
      updatedData.sort((a, b) => b.firstName.localeCompare(a.firstName));
    }
    if (searchTerm) {
      updatedData = updatedData.filter((user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm)
      );
    }
    if (filterOption) {
      updatedData = updatedData.filter((user) => user.designationName === filterOption);
    }
    setUserDetails(updatedData);
  }, [sortOption, searchTerm, filterOption, originalUserData]);

  const handleSortSelect = (option: string) => {
    setSortOption(option);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterSelect = (selectedOption: any) => {
    setFilterOption(selectedOption.name);
  };

  const handleClearFilters = () => {
    setUserDetails(originalUserData);
    setSearchTerm('');
    setSortOption(null);
    setFilterOption(null);
  };

  const columnNameArray = [
    { field: 'action', headerName: 'Action' },
    { field: 'name', headerName: 'Name' },
    { field: 'phone', headerName: 'Phone Number' },
    { field: 'designation', headerName: 'Designation' },
  ];

  const mergedMemberData = userDetails.map((user) => ({
    action: (
      <CheckboxInput
        label=""
        checked={selectedUserId === user.userId}
        onChange={() => handleCheckboxChange(user.userId)}
      />
    ),
    name: (
      <View style={styles.nameContainer}>
        <Avatar.Image 
          size={40} 
          source={user.profilePicture ? { uri: user.profilePicture } : require('../../images/avatar-placeholder.png')} 
          style={styles.avatar} 
        />
        <Text style={[ { color: theme.colors.mainText }]}>{`${user.firstName} ${user.lastName}`}</Text>
      </View>
    ),
    phone: user.phoneNumber,
    designation: user.designationName,
  }));

  const handleConfirmChange = async () => {
    if (selectedUserId) {
      try {
        await changeSocietySuperAdmin(LoggedInUserId, selectedUserId);
        console.log('Super Admin change successful');
        setShowConfirmModal(false);
        onClose();
        RNRestart.Restart();
        // Optionally refresh the app or reload data
      } catch (error) {
        console.error('Error changing Super Admin:', error);
      }
    }
  };

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={[styles.modalContainerStyle, {backgroundColor: theme.colors.background}]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.modalTitle}>Members</Text>
              </View>

              {/* Loader */}
              {loading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={theme.colors.main} />
                </View>
              )}

              {/* Error */}
              {error && !loading && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
              )}

              {/* Filter Header */}
              {!loading && !error && (
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
              )}

              {/* Table */}
              {!loading && !error && userDetails.length > 0 && (
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
                    onPageChange={(newPage) => {
                      setCurrentPage(newPage);
                      fetchDesgnData(newPage);
                    }}
                  />
                </View>
              )}

              {!loading && !error && userDetails.length === 0 && (
                <Text>No data available</Text>
              )}

              {/* Footer Buttons */}
              <View style={styles.footerButtons}>
                <ButtonInput
                  text="Cancel"
                  onPress={onClose}
                  width={130}
                />
                <ButtonInput
                  disabled={!selectedUserId}
                  text="Change"
                  onPress={() => setShowConfirmModal(true)}
                  width={130}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <ConfirmBoxModal
        open={showConfirmModal}
        title="Confirm Change"
        description="Are you sure you want to change the Super Admin to this user?"
        onAgree={handleConfirmChange}
        onDisagree={() => setShowConfirmModal(false)}
        onClose={() => setShowConfirmModal(false)}
        agreeText="Yes, Change"
        disagreeText="No, Cancel"
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainerStyle: {
    // The background & margin for the Modal
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 10,
    maxHeight: '90%',
    // backgroundColor: '#fff',
    // No fixed height here; let the ScrollView handle overflow
  },
  keyboardContainer: {
    // flex: 1,
  },
  scrollView: {
    // flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modalContent: {
    padding: 16,
    // You can add minHeight or maxHeight if desired
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  tableContainer: {
    width: '100%',
    marginTop: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    gap: 10,
  },

});

export default ChangeSuperAdminModal;
