import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme/themeProvider';
import { fetchUserChargeData } from '../actions/charges';
import dayjs from 'dayjs';

// Custom components
import ChargesTab from '../component/Tabs/ChargesTab';
import FilterListTable from '../component/UI/Tables/FilterListTable';
import UserChargeFeeModal from '../component/modals/UserChargeFeeModal';
import PaginationFooter from '../component/UI/TableFooter/TableFooter';

function ViewUserCharge() {
  const { theme } = useTheme();

  const [step, setStep] = useState(1); // 1 = Pending, 2 = Paid
  const [loading, setLoading] = useState(true);
  const [charges, setCharges] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<any | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  // Fetch user charges based on the active tab (step)
  const fetchCharges = async (status: string, page = 0) => {
    setLoading(true);
    try {
      const offset = page * pageSize;
      const response = await fetchUserChargeData(status, pageSize, offset);
      console.log('ViewUserCharge response:', response);

      setCharges(response);
      if (response.length > 0) {
        setTotalRecords(response[0].totalRecords);
      } else {
        setTotalRecords(0);
      }
    } catch (error) {
      console.error('Error fetching user charges:', error);
    } finally {
      setLoading(false);
    }
  };

  // When `step` changes, fetch either "pending" or "paid" charges
  useEffect(() => {
    const status = step === 1 ? 'pending' : 'paid';
    fetchCharges(status, 0);
    setCurrentPage(0);
  }, [step]);

  // Handle opening the modal
  const handleOpenModal = (charge: any) => {
    setSelectedCharge(charge);
    setModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCharge(null);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const status = step === 1 ? 'pending' : 'paid';
    fetchCharges(status, newPage);
  };

  // Build table data
  const mergedChargesData = charges.map((charge) => ({
    feeName: charge.feeName,
    dueDate: dayjs(charge.dueDate).format('DD/MM/YYYY'),
    amount: `₹ ${charge.amount}`,
    button: (
    <TouchableOpacity
      onPress={() => handleOpenModal(charge)}
      style={[
        styles.buttonBase,
        charge.status === 'Paid' ? [styles.paidButton,{backgroundColor:'transparent',borderColor:theme.colors.mainText, borderWidth: 1}] : [styles.unpaidButton],
      ]}
    >
        <Text
          style={[
            styles.buttonText,
            charge.status === 'Paid' ? [styles.paidButtonText,{color:theme.colors.mainText}] : [styles.unpaidButtonText,{color:'white'}],
          ]}
        >
          {charge.status === 'Paid' ? 'Receipt' : 'Pay Now'}
        </Text>
      </TouchableOpacity>
    ),
  }));

  // Table columns
  const columnNameArray = [
    { field: 'feeName', headerName: 'Maintenance Fee' },
    { field: 'dueDate', headerName: 'Due Date' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'button', headerName: '' },
  ];

  return (
    <View style={styles.container}>
      {/* Tabs for Pending / Paid */}
      <ChargesTab step={step} setStep={setStep} />

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : charges.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../images/Frame.png')}
            style={styles.noDataImage}
            resizeMode="contain"
          />
          <Text style={[styles.noDataText, { color: 'gray' }]}>
            No {step === 1 ? 'Pending' : 'Paid'} charges
          </Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <FilterListTable
            tableData={mergedChargesData}
            columnNameArray={columnNameArray}
            toDisplayFooter={false}
          />
          <PaginationFooter
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </View>
      )}

      {/* Modal */}
      {selectedCharge && (
        <UserChargeFeeModal
          open={modalOpen}
          onClose={handleCloseModal}
          chargeId={selectedCharge.chargeId}
          isPaid={selectedCharge.status === 'Paid'}
          chargeName={selectedCharge.feeName}
        />
      )}
    </View>
  );
}

export default ViewUserCharge;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 16,
  },
  loadingWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  noDataImage: {
    width: '80%',
    height: 200,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
  },
  tableContainer: {
    // width: '100%',
    // padding: 10,
    height:'85%'
  },
  // Button base style
  buttonBase: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // For "Paid" items
  paidButton: {
    // backgroundColor: '#F6F6F6',
  },
  paidButtonText: {
    // color: '#000000',
  },
  // For "Unpaid" items
  unpaidButton: {
    backgroundColor: '#3B82F6',
  },
  unpaidButtonText: {
    color: '#FFFFFF',
  },
});
