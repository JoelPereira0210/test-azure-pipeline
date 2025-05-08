import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  LayoutRectangle,
} from 'react-native';
import { Menu } from 'react-native-paper';
import { Avatar } from 'react-native-paper';
import ArrowBackIcon from 'react-native-vector-icons/MaterialIcons';
import FileUploadIcon from 'react-native-vector-icons/MaterialIcons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import { useTheme } from '../../theme/themeProvider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// Custom native components (make sure these are implemented)
import FilterListTable from '../component/UI/Tables/FilterListTable';
import FilterListTableHeader from '../component/UI/TableHeader/FilterListTableHeader';
import PaginationFooter from '../component/UI/TableFooter/TableFooter';
 
  
import { ChargesContext } from '../component/context/ChargesContext';
import { fetchPaymentDetails } from '../actions/charges';

const ViewPaymentStatus: React.FC = () => {
  const {
    setChargeMemberStatus,
    chargeId,
    chargeName,
  } = useContext(ChargesContext);
  const { theme } = useTheme();

  const [paymentStatus, setPaymentStatus] = useState<any[]>([]);
  const [originalPaymentData, setOriginalPaymentData] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [societyDetails, setSocietyDetails] = useState<any>(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  // pdfData is ignored in native (we log console.warn for PDF export)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [exportButtonLayout, setExportButtonLayout] = useState<LayoutRectangle | null>(null);
  const [base64Logo, setBase64Logo] = useState(null);
  const pageSize = 10;

  // Export menu state using react-native-paper's Menu
  const [menuVisible, setMenuVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });

  // For CSV export (ignored in native), we use a dummy ref
  const csvLinkRef = useRef<any>(null);

  // Handle export menu open/close
  const handleExportClick = (event: any) => {
    // In native, calculate anchor position if needed.
    setMenuVisible(true);
  };
  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  useEffect(() => {
    if (chargeId) {
      fetchCharges(currentPage);
    }
  }, [chargeId, currentPage]);

  const fetchCharges = async (page = 0) => {
    try {
      const response = await fetchPaymentDetails(chargeId, pageSize, page * pageSize);
      // console.log('FPD', response[0].societyLogoBase64);
      if (response && response.length > 0) {
        setPaymentStatus(response);
        setBase64Logo(response[0].societyLogoBase64);
        setOriginalPaymentData(response);
        setTotalRecords(response[0].totalRecords);
        setSocietyDetails(response[0].societyDetails);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
      setPaymentStatus([]);
      Alert.alert('Error', 'Failed to fetch payment details');
    }
  };

  // Sorting and search filtering
  useEffect(() => {
    let updatedData = [...originalPaymentData];
    if (sortOption === 'A-Z') {
      updatedData.sort((a, b) => a.userName.localeCompare(b.userName));
    } else if (sortOption === 'Z-A') {
      updatedData.sort((a, b) => b.userName.localeCompare(a.userName));
    }
    if (searchTerm) {
      updatedData = updatedData.filter((payment) =>
        payment.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setPaymentStatus(updatedData);
  }, [sortOption, searchTerm, originalPaymentData]);

  // Define table columns (assume FilterListTable accepts these props)
  const columnNameArray = [
    { field: 'serialNumber', headerName: 'Sr. No.' },
    { field: 'name', headerName: 'Name' },
    { field: 'dueDate', headerName: 'Due Date' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'status', headerName: 'Status' },
    { field: 'mobile', headerName: 'Mobile No.' },
  ];

  // Merge payment data into table rows
  const mergedPaymentData = (paymentStatus || []).map((payment, index) => ({
    serialNumber: index + 1,
    name: (
      <View style={styles.nameContainer}>
        <Avatar.Image
          size={24}
          source={
            payment.profilePicture
              ? { uri: payment.profilePicture }
              : require('../images/avatar-placeholder.png')
          }
          style={styles.avatar}
        />
        <Text style={[styles.nameText, { color: theme.colors.mainText }]}>
          {payment.userName}
        </Text>
      </View>
    ),
    dueDate: new Date(payment.dueDate).toLocaleDateString(),
    amount: payment.amount,
    status: (
      <Text
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              payment.status === 'Completed' ? '#34A8531A' : '#E41D1D1A',
            color: payment.status === 'Completed' ? '#34A853' : '#E41D1D',
          },
        ]}
      >
        {payment.status === 'Completed' ? 'Paid' : 'Not Paid'}
      </Text>
    ),
    mobile: payment.userMobile || 'N/A',
  }));

  // Callbacks for sort, search, and clear filters
  const handleSortSelect = (option: string) => {
    setSortOption(option);
  };
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  const handleClearFilters = () => {
    setPaymentStatus(originalPaymentData);
    setSearchTerm('');
    setSortOption(null);
  };


  const exportToCSV = async () => {
    try {
      setExportModalVisible(false);
      // Build CSV string
      let csvString = 'Name,Due Date,Amount,Status,Mobile No.\n';
      originalPaymentData.forEach((pmt) => {
        const userName = pmt.userName || '';
        const dueDate = dayjs(pmt.dueDate).format('DD-MM-YYYY');
        const amount = pmt.amount || '';
        const status = pmt.status === 'Completed' ? 'Paid' : 'Not Paid';
        const mobile = pmt.userMobile || 'N/A';
        csvString += `"${userName}","${dueDate}","${amount}","${status}","${mobile}"\n`;
      });
      const fileName = `${chargeName}_payment_status.csv`;
      const downloadPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`;
      await RNFetchBlob.fs.writeFile(downloadPath, csvString, 'utf8');
      Alert.alert('CSV Saved', `CSV saved to: ${downloadPath}`);
    } catch (error) {
      console.error('Error exporting CSV', error);
      Alert.alert('Error', 'Failed to export CSV');
    }
  };

  // --- PDF Export ---
  const exportToPDF = async () => {
    try {
      setExportModalVisible(false);
      // Build table rows from paymentStatus data
      let tableRows = '';
      originalPaymentData.forEach((pmt, index) => {
        const name = pmt.userName || 'N/A';
        const paymentDate = pmt.paidDate
          ? dayjs(pmt.paidDate).format('D MMM YYYY')
          : 'Not Paid';
        const status = pmt.status === 'Completed' ? 'Paid' : 'Not Paid';
        const mobile = pmt.userMobile || 'N/A';
        tableRows += `
          <tr>
            <td>${name}</td>
            <td>${paymentDate}</td>
            <td>${status}</td>
            <td>${mobile}</td>
          </tr>
        `;
      });

      // Prepare placeholders for footer
      const societyName = societyDetails?.societyName || 'Your Society';
      const address = `${societyDetails?.streetName || ''}, ${societyDetails?.state?.name || ''}, ${societyDetails?.pincode || ''}`;

      // HTML content with styling similar to your web version
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8"/>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
              .thick-line { height: 8px; background-color: #000B4D; margin: 10px 0; }
              .dashed-line { border-top: 8px dashed #000B4D; margin: 10px 0 20px 0; }
              .headerTitle { font-size: 25px; font-weight: bold; color: #133E58; }
              .subheader1 { color: #000B4D; font-size: 12px; margin: 5px 0 15px 0; font-weight: bold; text-decoration: underline; }
              .subheader2 { color: #000B4D; font-size: 12px; margin: 5px 0 15px 0; font-weight: bold; }
              .tableHeader { background-color: #B1B0B0; font-size: 13px; font-weight: bold; color: #000B4D; }
              .footerText { font-size: 12px; text-align: right; margin: 5px 20px 10px 0; color: #333; }
              .title { color: #000B4D; font-size: 28px; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 10px; }
              .infoRow { font-size: 12px; color: #000B4D; margin: 5px 0; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
              th, td { border: 1px solid #D3D3D3; padding: 10px; font-size: 12px; text-align: left; }
              th { background-color: #E0E0E0; color: #000B4D; }
              .footerLine { border-top: 1px solid #000B4D; margin: 20px 0; }
              .footerWrap { text-align: right; font-size: 12px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="thick-line"></div>
      
             ${base64Logo
              ? `<div style="text-align:center;">
                  <img src="data:image/png;base64,${base64Logo}" width="60" height="60" style="margin-bottom: 5px;" />
                  <h1 style="color:'#000B4D';">${societyName}</h1>
                </div>`
              :
               `<h1 style="text-align:center;">${societyName}</h1>`
            }

            <div class="dashed-line"></div>
                 <h3 class="title">${chargeName}</h3>
            <p class="subheader1">Name</p>
            <table>
              <tr>
                <th class="tableHeader">Name</th>
                <th class="tableHeader">Payment Date</th>
                <th class="tableHeader">Status</th>
                <th class="tableHeader">Mobile No.</th>
              </tr>
              ${tableRows}
            </table>
            <div class="dashed-line"></div>
            <div class="footerLine"></div>
            <div class="footerWrap">
              <p>${societyName}, ${address}</p>
            </div>
          </body>
        </html>
      `;

      // Generate PDF with base64 output
      const { base64 } = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `${chargeName}_payment_status`,
        base64: true,
      });

      const downloadPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${chargeName}_payment_status.pdf`;

      if (!base64) {
        throw new Error('Failed to generate base64 PDF');
      }

      // Write the PDF file to global Downloads
      await RNFetchBlob.fs.writeFile(downloadPath, base64, 'base64');
      Alert.alert('PDF Generated', `PDF saved to: ${downloadPath}`);
    } catch (error) {
      console.error('Error generating PDF', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => setChargeMemberStatus(false)}
        style={styles.backButton}
      >
        <ArrowBackIcon name="arrow-back" size={30} color={theme.colors.mainText} />
      </TouchableOpacity>

      {/* Header with Charge Name and Filter Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.chargeNameText, { color: theme.colors.mainText }]}>
          {chargeName}
        </Text>
        <FilterListTableHeader
          filterOptions={filterOptions}
          onFilterSelect={() => {}}
          sortOptions={['A-Z', 'Z-A']}
          onSortSelect={handleSortSelect}
          Buttontext="Export"
          buttonIcon={<FileUploadIcon name="file-download" size={18} color="#fff" />}
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

      {/* Table or Empty State */}
      {paymentStatus.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../images/Frame.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={[styles.noDataText, { color: 'gray' }]}>
            No Pending Payments
          </Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <FilterListTable
            tableData={mergedPaymentData}
            columnNameArray={columnNameArray}
            toDisplayFooter={false}
          />
          {totalRecords > 0 && (
            <PaginationFooter
              currentPage={currentPage}
              totalRecords={totalRecords}
              pageSize={pageSize}
              onPageChange={(newPage: number) => {
                setCurrentPage(newPage);
                fetchCharges(newPage);
              }}
            />
          )}
        </View>
      )}

     {/* "Small" Export Modal near the Export button */}
     {exportModalVisible && (
        <View style={styles.exportModalOverlay}>
          {/* This overlay is a catch-all to close the modal if user taps outside */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setExportModalVisible(false)}
          />
          <View style={[styles.exportModalContainer, { backgroundColor: theme.colors.background,borderColor: theme.colors.mainText,borderWidth: 0.1,}]}>
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
              style={styles.exportModalButton}
            >
              <Text style={[styles.exportModalButtonText, { color: theme.colors.mainText }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default ViewPaymentStatus;

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 10,
  },
  headerContainer: {
    marginBottom: 10,
  },
  chargeNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign:'center'
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
  },
  tableContainer: {
    width: '100%',
    height: '55%',
    padding: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  nameText: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
    fontWeight: '300',
    textAlign: 'center',
    fontSize: 12,
  },
  exportButton: {
    padding: 8,
    borderRadius: 8,
  },
// "Small" export modal
exportModalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  // semi-transparent background or none
  // backgroundColor: 'rgba(0,0,0,0.1)',
},
exportModalContainer: {
  position: 'absolute',
  top: 175, // approximate vertical offset
  right: 0, // approximate horizontal offset
  left: 50,
  width: 180,
  padding: 10,
  borderRadius: 5,
  elevation: 5, // or shadow for iOS
},
exportModalButton: {
  paddingVertical: 10,
  alignItems: 'center',
},
exportModalButtonText: {
  fontSize: 16,
},
});
