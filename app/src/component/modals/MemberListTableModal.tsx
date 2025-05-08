
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Checkbox, Avatar } from 'react-native-paper';
import ButtonInput from '../UI/Button/Button';
import FilterListTable from '../UI/Tables/FilterListTable';
import ConfirmBoxModal from '../UI/Popup/ConfirmBoxModal';
import { addMemebersDesignation, updateDesignationCountAPI } from '../../actions/designation';
import ErrorAlertModal from '../UI/Popup/ErrorAlertModal';
import { useTheme } from '../../../theme/themeProvider';
interface MemberListTableModalProps {
  selectedDesignation: string;
  onClose: () => void;
  open: boolean;
  userDetails: any[];
  fetchData: () => void;
  modalButtonCancelText: string;
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (newPage: number) => void;
}

const MemberListTableModal = ({
  selectedDesignation,
  onClose,
  open,
  userDetails,
  fetchData,
  modalButtonCancelText,
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
}: MemberListTableModalProps) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);
  const [designationCount, setDesignationCount] = useState<Record<string, number>>({});
  const {theme} = useTheme();

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, currentPage]);

  useEffect(() => {
    if (!open) {
      setSelectedMembers([]);
      setCheckedCount(0);
      setDesignationCount({});
    }
  }, [open]);

  useEffect(() => {
    if (userDetails) {
      console.log('Received userDetails:', userDetails);
    }
  }, [userDetails]);

  // Define the column headers (used by your FilterListTable)
  const columnArray = [
    { field: 'actions', headerName: 'Actions' },
    { field: 'name', headerName: 'Name' },
    { field: 'mobileNumber', headerName: 'Mobile Number' },
    { field: 'designation', headerName: 'Designation' },
  ];

  const handleCheckboxChange = (memberId: string) => {
    setSelectedMembers((prevSelected) => {
      const updatedSelection = prevSelected.includes(memberId)
        ? prevSelected.filter((id) => id !== memberId)
        : [...prevSelected, memberId];

      setCheckedCount(updatedSelection.length);

      const selectedRecords = userDetails.filter((member) =>
        updatedSelection.includes(member.userId)
      );

      const newDesignationCount: Record<string, number> = {};
      selectedRecords.forEach((record) => {
        const desig = record.designationName;
        newDesignationCount[desig] = (newDesignationCount[desig] || 0) + 1;
      });

      setDesignationCount(newDesignationCount);
      return updatedSelection;
    });
  };

  const handleAddClick = async () => {
    try {
      const response = await updateDesignationCountAPI(checkedCount, selectedDesignation);
      if (response?.message === 'Designation count updated successfully') {
        setConfirmOpen(true);
      } else {
        setErrorModal(true);
      }
    } catch (error) {
      console.error('Error updating designation count:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await addMemebersDesignation(selectedDesignation, designationCount, selectedMembers);
      fetchData();
      onClose();
    } catch (error) {
      console.error('Error assigning designation:', error);
    }
  };

  // Build table data by filtering out records already having the selected designation
  const tableData = userDetails
    ?.filter((member) => member.designationName !== selectedDesignation)
    .map((member) => ({
      id: member.userId,
      actions: (
      <Checkbox
      status={selectedMembers.includes(member.userId) ? 'checked' : 'unchecked'}
      onPress={() => handleCheckboxChange(member.userId)}
      color={theme.colors.main} // This will use the theme's primary color for checked state
      uncheckedColor={theme.colors.mainText} // This will use theme's text color for unchecked state
      />
      ),
      name: (
      <View style={styles.memberInfo}>
      <Avatar.Image size={24} source={{ uri: member.profilePicture || undefined }} />
      <Text style={{color: theme.colors.mainText}}>{`${member.firstName} ${member.lastName}`}</Text>
      </View>
      ),
      mobileNumber: <Text style={{color: theme.colors.mainText}}>{member.phoneNumber}</Text>,
      designation: (
      <View style={styles.designationTag}>
      <Text style={{color: theme.colors.mainText}}>{member.designationName}</Text>
      </View>
      ),
    }));

  return (
    <Portal>
      <Modal visible={open} onDismiss={onClose} contentContainerStyle={[styles.modalContainer,{backgroundColor:theme.colors.background}]}>
        <ScrollView>
          <Text style={[styles.title,{color:theme.colors.mainText}]}>Add {selectedDesignation}</Text>
          {tableData && tableData.length > 0 ? (
            <FilterListTable columnNameArray={columnArray} tableData={tableData} toDisplayFooter={false} />
          ) : (
            <Text style={styles.noDataText}>
              No members available for this designation
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <ButtonInput text={modalButtonCancelText} onPress={onClose}   width={130}             buttonBackgroundColor={theme.colors.background}
            buttonFontColor={theme.colors.mainText}
            borderColor={theme.colors.mainText}/>
            {tableData && tableData.length > 0 && (
              <ButtonInput text="Add" onPress={handleAddClick}    width={130}/>
            )}
          </View>
        </ScrollView>
      </Modal>

      <ConfirmBoxModal
        open={confirmOpen}
        agreeText="Yes"
        disagreeText="No"
        title="Change Designation?"
        description="Previous designation will be changed."
        onAgree={() => {
          setConfirmOpen(false);
          handleSubmit();
        }}
        onDisagree={() => setConfirmOpen(false)}
        onClose={() => setConfirmOpen(false)}
      />

      <ErrorAlertModal
        open={errorModal}
        onClose={() => setErrorModal(false)}
        errorMessage="Cannot assign designation"
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  designationTag: {
    backgroundColor: '#7152F31A',
    padding: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  designationText: {
    color: '#7152F3',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap:10,
    marginTop: 16,
  },
});

export default MemberListTableModal;
