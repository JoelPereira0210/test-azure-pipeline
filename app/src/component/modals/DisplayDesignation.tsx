import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Modal, Portal, Text, ActivityIndicator, IconButton, List } from 'react-native-paper';
import ButtonInput from '../UI/Button/Button';
import Designation from './DesignationModal';
import { fetchDesignationData } from '../../actions/designation';
import { fetchSelectedDesignationMembers } from '../../actions/designation';
import CiEdit from 'react-native-vector-icons/MaterialCommunityIcons';
import AddCircleOutlineIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/themeProvider';
interface DisplayDesignationProps {
  selectedDesignation: string;
  onDesignationSelect: (designation: string) => void;
  onDesignationMembersFetched: (members: any) => void;
}

const DisplayDesignation = ({
  selectedDesignation,
  onDesignationSelect,
  onDesignationMembersFetched,
}: DisplayDesignationProps) => {
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
  const [selectedDesignationFetchedMembers, setSelectedDesignationFetchedMembers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const {theme} = useTheme();
  // Check role from AsyncStorage
  useEffect(() => {
    const fetchRole = async () => {
      const role = await AsyncStorage.getItem('flow');
      setIsAdmin(role === 'admin');
    };
    fetchRole();
  }, []);


  // Fetch designations from API
  const handleDisplayDesignation = async () => {
    try {
      const response = await fetchDesignationData();
      if (response) {
        setDesignations(response);
        if (response.length > 0) {
          // Select the first designation by default
          onDesignationSelect(response[0].designationName);
        }
      }
    } catch (error) {
      console.error('Error fetching designation data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update designations state when a new designation is added/updated
  const addNewDesignation = (updatedDesignation: any) => {
    setDesignations((prev) => {
      const index = prev.findIndex((d) => d.designationId === updatedDesignation.designationId);
      if (index > -1) {
        const updatedDesignations = [...prev];
        updatedDesignations[index] = updatedDesignation;
        return updatedDesignations;
      } else {
        return [...prev, updatedDesignation];
      }
    });
  };

  const handleDesignationDelete = (designationId: string) => {
    setDesignations((prev) =>
      prev.filter((designation) => designation.designationId !== designationId)
    );
    setIsDesignationOpen(false);
  };

  const addMoreDesignation = () => {
    setIsDesignationOpen(true);
    setCancelButtonText('Cancel');
  };

  // When a designation is tapped, update the selection and fetch members if needed
  const handleClick = async (designation: string) => {
    if (designation !== selectedDesignation) {
      onDesignationSelect(designation);
      // You can update selectedDesignationFetchedMembers state with a fetch call if required:
      // const members = await fetchSelectedDesignationMembers(designation, ...);
      onDesignationMembersFetched(selectedDesignationFetchedMembers);
    }
  };

  // When edit icon is pressed, open the modal in edit mode
  const handleEditClick = (
    designationId: string,
    designationName: string,
    numberOfPositions: number,
    adminPrivileges: boolean
  ) => {
    setEditingDesignationDetails({ designationId, designationName, numberOfPositions, adminPrivileges });
    setCancelButtonText('Delete');
    setIsDesignationOpen(true);
  };

  useEffect(() => {
    handleDisplayDesignation();
  }, []);

  return (
    // <Portal>
    <>
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
          setSelectedData={(details: any) => setEditingDesignationDetails(details)}
        />
      ) : (
        <View style={[styles.container,{backgroundColor:theme.colors.background}]}>
          {loading ? (
            <ActivityIndicator animating={true} size="small" />
          ) : (
            <ScrollView style={[styles.listContainer,{backgroundColor:theme.colors.background}]}>
              {designations.length > 0 ? (
              designations.map((designation) => (
                <List.Item
                key={designation.designationId}
                title={designation.designationName}
                titleStyle={{color: 'white'}}
                onPress={() => handleClick(designation.designationName)}
                style={[
                  styles.listItem,
                  designation.designationName === selectedDesignation && styles.selectedItem,
                ]}
                right={() =>
                  isAdmin && (
                  <IconButton
                    icon={() => <CiEdit name="pencil" size={20} color={'white'} />}
                    onPress={() =>
                    handleEditClick(
                      designation.designationId,
                      designation.designationName,
                      designation.numberOfPositions,
                      designation.adminPrivileges
                    )
                    }
                  />
                  )
                }
                />
              ))
              ) : (
              <Text style={[styles.noDataText, {color: theme.colors.mainText}]}>No designations available</Text>
              )}
            </ScrollView>
          )}
          {isAdmin && (
            <ButtonInput
              text={'Add New Designation'}
              onPress={addMoreDesignation}
              styles={styles.addButton}
              icon={<AddCircleOutlineIcon name="add-circle-outline" size={24} color={'white'} />}
            />
          )}
        </View>
      )}
    {/* </Portal> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  listContainer: {
    maxHeight: 300,
  },
  listItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: '#007FFF',
  },
  noDataText: {
    textAlign: 'center',
    color: 'gray',
    padding: 10,
  },
  addButton: {
    marginTop: 10,
    // backgroundColor: '#007FFF',
  },
});

export default DisplayDesignation;
