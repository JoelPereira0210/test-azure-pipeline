import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MemberContext } from './context/MemberContext';
import { fetchMaintenanceDetails } from '../actions/addMembers';
import FilterListTable from './UI/Tables/FilterListTable';
import PaginationFooter from './UI/TableFooter/TableFooter';

const pageSize = 10; // Records per page

const MaintenanceFees = () => {
  const { contextUserId } = useContext(MemberContext);

  const [maintenanceData, setMaintenanceData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch data from the API
  const fetchData = async (page = 0) => {
    setLoading(true);
    try {
      const limit = pageSize;
      const offset = page * limit;
      const response = await fetchMaintenanceDetails(contextUserId, limit, offset);

      console.log('MaintenanceFees response:', response);

      if (response && response.status === 200 && Array.isArray(response.data)) {
        setMaintenanceData(response.data);
        // Assume each item has a "totalRecords" property
        setTotalRecords(response.data.length > 0 ? response.data[0].totalRecords : 0);
      } else if (response && response.status === 203) {
        console.log('No maintenance details found');
        setMaintenanceData([]);
        setTotalRecords(0);
      } else {
        // In case the response isn't what we expect
        setMaintenanceData([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error('Error fetching maintenance details:', error);
      setMaintenanceData([]);
      setTotalRecords(0);
    }
    setLoading(false);
  };

  // Trigger data fetch when user ID or page changes
  useEffect(() => {
    if (contextUserId) {
      fetchData(currentPage);
    }
  }, [contextUserId, currentPage]);

  // Prepare data for the table
  const tableData = maintenanceData.map((item) => ({
    memberName: item.eventName,
    amount: item.amount,
    // Convert the date to a readable format if needed
    dueDate: new Date(item.eventRegistrationDate).toLocaleDateString(),
    status: item.status,
  }));

  // Define table columns
  const columnNameArray = [
    { field: 'memberName', headerName: 'Event Name' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'dueDate', headerName: 'Due Date' },
    { field: 'status', headerName: 'Status' },
  ];

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : tableData.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FilterListTable
            tableData={tableData}
            columnNameArray={columnNameArray}
            toDisplayFooter={false}
          />

            <PaginationFooter
              currentPage={currentPage}
              totalRecords={totalRecords}
              pageSize={pageSize}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
       
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../images/Frame.png')}
            style={styles.noDataImage}
          />
          <Text style={styles.noDataText}>No Maintenance Fees found</Text>
        </View>
      )}
    </View>
  );
};

export default MaintenanceFees;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: '80%',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
});
