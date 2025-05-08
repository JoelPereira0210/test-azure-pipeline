import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import RNFS from 'react-native-fs'
dayjs.extend(utc);

import { EventContext } from '../component/context/EventContext';
import FilterListTableHeader from '../component/UI/TableHeader/FilterListTableHeader';
import FilterListTable from '../component/UI/Tables/FilterListTable';
import PaginationFooter from '../component/UI/TableFooter/TableFooter';
import { fetchEventRegisteredMembersAction } from '../actions/createevent';
import { useTheme } from '../../theme/themeProvider';
import { Avatar } from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';


// Import the PDF generation package
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { requestStoragePermission } from '../utils/auth';

const EventRegisteredMembers = () => {
  const { setCreateEvent, setRegisteredMembers, eventId, eventName } =
    useContext(EventContext);

  const [eventRegMembers, setEventRegMembers] = useState<any>(null);
  interface Member {
    name: string;
    profilePicture: string;
    [key: string]: any;
  }
  const [jsonMemberData, setJsonMemberData] = useState<Member[]>([]);
  const [originalMemberData, setOriginalMemberData] = useState<Member[]>([]);
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [acceptDonation, setAcceptDonation] = useState<any>(null);
  const [checkEventType, setCheckEventType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [societyDetails, setSocietyDetails] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  // State for controlling export options modal
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const { theme } = useTheme();

  // Data fetching logic remains the same
  const fetchData = async (page = 0) => {
    try {
      setLoading(true);
      const limit = pageSize;
      const offset = page * limit;
      const data = await fetchEventRegisteredMembersAction(
        eventId,
        limit,
        offset,
      );
      console.log('Fetched Registered Members:', data);
      setEventRegMembers(data);
      setJsonMemberData(data.members);
      setOriginalMemberData(data.members);
      setAcceptDonation(data.acceptDonation);
      setCheckEventType(data.eventType.eventType);
      setEventDate(data.eventDate);
      setEventTime(data.eventStartTime);
      setEventEndTime(data.eventEndTime);
      setEventEndDate(data.eventEndDate);
      setSocietyDetails(data.societyDetails);
      setTotalRecords(data.totalRecords);
    } catch (error) {
      console.error('Error fetching registered members:', error);
      Alert.alert('Error', 'Failed to fetch registered members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [eventId, currentPage]);

  // Sorting and search filtering
  useEffect(() => {
    let updatedData = [...originalMemberData];
    if (sortOption === 'A-Z') {
      updatedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'Z-A') {
      updatedData.sort((a, b) => b.name.localeCompare(a.name));
    }
    if (searchTerm) {
      updatedData = updatedData.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setJsonMemberData(updatedData);
  }, [sortOption, searchTerm, originalMemberData]);

  // Define the table columns
  let columnNameArray = [
    { field: 'serialNumber', headerName: 'Sr. No.' },
    { field: 'Name', headerName: 'Name' },
    { field: 'date', headerName: 'Date' },
    { field: 'members', headerName: 'Members' },
    { field: 'mobile', headerName: 'Mobile No.' },
  ];
  if (acceptDonation) {
    columnNameArray.splice(3, 0, { field: 'amount', headerName: 'Donation' });
  } else if (checkEventType === 'paid') {
    columnNameArray.splice(3, 0, { field: 'amount', headerName: 'Amount' });
  }

  // Merge data for table display using similar logic for name container
  const mergedMemberData = jsonMemberData.map((member, index) => ({
    ...member,
    serialNumber: index + 1,
    Name: (
      <View style={styles.nameContainer}>
        <Avatar.Image
          size={24}
          source={
            member.profilePicture
              ? { uri: member.profilePicture }
              : require('../images/avatar-placeholder.png')
          }
          style={styles.avatar}
        />
        <Text style={[styles.nameText, { color: theme.colors.mainText }]}>
          {member.name}
        </Text>
      </View>
    ),
  }));

  const handleSortSelect = (option: any) => {
    setSortOption(option);
  };

  const handleSearchChange = (term: any) => {
    setSearchTerm(term);
  };

  const handleClearFilters = () => {
    setJsonMemberData(originalMemberData);
    setSearchTerm('');
  };

    // Export CSV function
    const exportToCSV = async () => {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to save file.');
        return;
      }
      
      try {
        // Build CSV string manually
        // Define CSV header
        let csvString = 'Sr. No.,Name,Date,Members,Mobile No.\n';
        jsonMemberData.forEach((member, index) => {
          // Use double quotes for text fields, escape if needed
          csvString += `${index + 1},"${member.name}","${member.date || ''}","${member.members || ''}","${member.mobile || ''}"\n`;
        });
  
        const fileName = `${eventName}_registered_members.csv`;
        const downloadPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
  
        // Write the CSV string to a file (using UTF8 encoding)
        await RNFetchBlob.fs.writeFile(downloadPath, csvString, 'utf8');
  
        Alert.alert('CSV Saved', `CSV saved to: ${downloadPath}`);
        
         setExportModalVisible(false);
       
      } catch (error) {
        console.error('Error exporting CSV', error);
        Alert.alert('Error', 'Failed to export CSV');
      }
    };

  // Export to PDF using react-native-html-to-pdf
  const exportToPDF = async () => {

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to save file.');
      return;
    }

    try {
      // Build table rows dynamically based on your data
      let tableRows = '';
      jsonMemberData.forEach((member, index) => {
        tableRows += `
          <tr>
            <td style="padding:8px; text-align:center;">${index + 1}</td>
            <td style="padding:8px; text-align:center;">${member.name}</td>
            <td style="padding:8px; text-align:center;">${member.date || ''}</td>
            <td style="padding:8px; text-align:center;">${member.members || ''}</td>
            <td style="padding:8px; text-align:center;">${member.mobile || ''}</td>
          </tr>
        `;
      });

      // Construct the HTML content for the PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { text-align: center; color: #133E58; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
              th { background-color: #000B4D; color: white; }
              .header-line { border-top: 8px solid #000B4D; margin: 20px 0; }
              .footer { text-align: center; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header-line"></div>
            <h1>${eventName} Registered Members</h1>
            ${eventRegMembers?.societyLogoBase64
              ? `<div style="text-align:center;">
                  <img src="data:image/png;base64,${eventRegMembers.societyLogoBase64}" width="60" height="60" style="margin-bottom: 5px;" />
                  <p>Society: ${societyDetails.societyName}</p>
                </div>`
              :
               `<p style="text-align:center;">Society: ${societyDetails?.societyName || 'N/A'}</p>`
            }
            <table>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Date</th>
                <th>Members</th>
                <th>Mobile No.</th>
              </tr>
              ${tableRows}
            </table>
            <div class="header-line"></div>
            <div class="footer">
              ${societyDetails ? `${societyDetails.societyName}, ${societyDetails.streetName}, ${societyDetails.state?.name}, ${societyDetails.pincode}` : ''}
            </div>
          </body>
        </html>
      `;
      
  
          
      // const {filePath} = await RNHTMLtoPDF.convert(options);
      const { base64 } = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `${eventName}_registered_members`,
        base64: true,
      });
      
      const downloadPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${eventName}_registered_members.pdf`;
      
      if (base64) {
        await RNFetchBlob.fs.writeFile(downloadPath, base64, 'base64');
      } else {
        throw new Error('PDF generation failed: base64 data is undefined');
      }
      
      Alert.alert('PDF Saved', `Saved to: ${downloadPath}`);
      

      setExportModalVisible(false);
    } catch (error) {
      console.error('Error generating PDF', error);
      Alert.alert('Error', 'Failed to generate PDF');
      setExportModalVisible(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color={theme.colors.main} />
      </View>
    );
  }

  // console.log("eventRegMembers", eventRegMembers.societyLogoBase64);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setCreateEvent(false);
          setRegisteredMembers(false);
        }}
        style={styles.backButton}>
        <Icon name="arrow-back" size={28} color={theme.colors.mainText} />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={[styles.eventNameText, { color: theme.colors.mainText }]}>{eventName}</Text>
        <FilterListTableHeader
          filterOptions={filterOptions}
          onFilterSelect={() => {}}
          sortOptions={['A-Z', 'Z-A']}
          onSortSelect={handleSortSelect}
          Buttontext="Export"
          buttonIcon={<Icon name="file-download" size={18} color={'white'} />}
          onButtonClick={() => setExportModalVisible(true)}
          onSearchChange={handleSearchChange}
          onClearFilters={handleClearFilters}
          onSearchClear={() => setSearchTerm('')}
          onClearFilterSortOption={() => setSortOption(null)}
          onClearFilterOption={() => console.log('Cleared filter options')}
          showSearch={true}
          showFilter={false}
          showSort={true}
          showButton={true}
        />
      </View>

      {jsonMemberData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../images/Frame.png')}
            style={styles.emptyImage}
          />
          <Text>No Registered Members</Text>
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
            onPageChange={newPage => {
              setCurrentPage(newPage);
              fetchData(newPage);
            }}
          />
        </View>
      )}

      {/* Export Modal */}
      {exportModalVisible && (
        <View style={styles.exportModalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setExportModalVisible(false)}
          />
          <View
            style={[
              styles.exportModalContainer,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.mainText,
                borderWidth: 0.1,
              },
            ]}>
            <TouchableOpacity onPress={exportToCSV} style={styles.exportModalButton}>
              <Text style={[styles.exportModalButtonText, { color: theme.colors.mainText }]}>
                Export as CSV
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={exportToPDF} style={styles.exportModalButton}>
              <Text style={[styles.exportModalButtonText, { color: theme.colors.mainText }]}>
                Export as PDF
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setExportModalVisible(false)}
              style={styles.exportModalButton}>
              <Text style={[styles.exportModalButtonText, { color: theme.colors.mainText }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  backButton: { marginBottom: 10 },
  headerContainer: { marginBottom: 10 },
  eventNameText: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center' },
  emptyImage: { width: 100, height: 100, marginBottom: 10 },
  tableContainer: {},
  loadingWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  nameContainer: { flexDirection: 'row', alignItems: 'center' },
  avatar: { marginRight: 8 },
  nameText: { fontSize: 14 },
  exportModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  exportModalContainer: {
    position: 'absolute',
    top: 175,
    right: 0,
    left: 50,
    width: 180,
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  exportModalButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  exportModalButtonText: {
    fontSize: 16,
  },
});

export default EventRegisteredMembers;
