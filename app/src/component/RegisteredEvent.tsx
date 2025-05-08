import React, { useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator, Image, StyleSheet, Text, ScrollView } from 'react-native';
import { MemberContext } from './context/MemberContext';
import { fetchEventDetails } from '../actions/addMembers';
import FilterListTable from './UI/Tables/FilterListTable';
import PaginationFooter from './UI/TableFooter/TableFooter';

const pageSize = 10; // Number of records per page

const RegisteredEvent = () => {
  const { contextUserId } = useContext(MemberContext);
  const [eventData, setEventData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch data from API
  const fetchData = async (page = 0) => {
    setLoading(true);
    try {
      const limit = pageSize;
      const offset = page * limit;
      const response = await fetchEventDetails(contextUserId, limit, offset);

      console.log('response from RegisteredEvent', response);

      if (response && response.status === 200 && Array.isArray(response.data)) {
        // Save events in state
        setEventData(response.data);
        // Grab totalRecords from the first item (each item has totalRecords=5 in your sample)
        setTotalRecords(response.data.length > 0 ? response.data[0].totalRecords : 0);
      } else if (response && response.status === 203) {
        console.log('No events found');
        setEventData([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      setEventData([]);
      setTotalRecords(0);
    }
    setLoading(false);
  };

  // Re-fetch when user ID or page changes
  useEffect(() => {
    if (contextUserId) {
      fetchData(currentPage);
    }
  }, [contextUserId, currentPage]);

  // Prepare table data
  const tableData = eventData.map((event) => ({
    eventName: event.eventName,
    eventStartDate: new Date(event.eventStartDate).toLocaleDateString(),
    eventType: event.eventType,
  }));

  // Define table columns
  const columnNameArray = [
    { field: 'eventName', headerName: 'Event' },
    { field: 'eventStartDate', headerName: 'Event Date' },
    { field: 'eventType', headerName: 'Event Type' },
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
          <Text style={styles.noDataText}>No registered events found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Enough height to show the table and pagination
    // If you want the entire screen, you can use: flex: 1
    padding: 16,
    height: '80%',
    // flex: 1,
  },
  scrollContent: {
    // Ensures content is scrollable if it exceeds the container height
    paddingBottom: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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

export default RegisteredEvent;
