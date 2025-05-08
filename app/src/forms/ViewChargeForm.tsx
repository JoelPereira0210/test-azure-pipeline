// import React, { useState } from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

// const ViewChargeForm = () => {
    

//     return (
//         <View>
//         <Text>ViewChargeForm called</Text>
//         </View>
       
//     )
// }

// export default ViewChargeForm;

import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  Image 
} from 'react-native';
import { IconButton, Menu, ActivityIndicator as PaperActivityIndicator } from 'react-native-paper';
import { useTheme } from '../../theme/themeProvider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import ViewTab from '../component/Tabs/ViewTab';
import PaginationFooter from '../component/UI/TableFooter/TableFooter';
import FilterListTable from '../component/UI/Tables/FilterListTable';
import FilterListTableHeader from '../component/UI/TableHeader/FilterListTableHeader';
import ChargeFeeModal from '../component/modals/ChargeFeeModal';
import { fetchChargeData, softDeleteChargeAction, hardDeleteChargeAction } from '../actions/charges';
import { ChargesContext } from '../component/context/ChargesContext';
import ConfirmBoxModal from '../component/UI/Popup/ConfirmBoxModal';

// You may need to import your navigation hook if required (e.g. useNavigation from react-navigation)

function ViewChargeForm() {
  const {
    createCharge,
    setCreateCharge,
    setChargeActionType,
    setChargeId,
    setChargeMemberStatus,
    setChargeSection,
    setChargeName,
    // Also use other context functions as needed
  } = useContext(ChargesContext);

  const [step, setStep] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeCharge, setActiveCharge] = useState<string | null>(null);
  const [activeChargeName, setActiveChargeName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [charges, setCharges] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteAction, setDeleteAction] = useState('');
  const { theme, mode } = useTheme();

  const [originalCharges, setOriginalCharges] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  // Update charge section based on active tab (step)
  useEffect(() => {
    if (step === 1) {
      setChargeSection('upcoming');
    } else if (step === 2) {
      setChargeSection('past');
    } else if (step === 3) {
      setChargeSection('draft');
    } else if (step === 4) {
      setChargeSection('deleted');
    }
  }, [step, setChargeSection]);

  // Handle menu actions
  const handleMenuAction = async (action: string) => {
    if (action === 'View Details') {
      setChargeActionType('view charge');
      setChargeMemberStatus(false);
      setCreateCharge(true);
      setChargeId(activeCharge!);
      console.warn("chargeFeeModal to be called here");
      
      // ChargeFeeModal should be rendered conditionally based on context
    } else if (action === 'Edit') {
      setChargeActionType('edit charge');
      setChargeMemberStatus(false);
      setCreateCharge(true);
      setChargeId(activeCharge!);
    } else if (action === 'Copy') {
      setChargeActionType('copy charge');
      setChargeMemberStatus(false);
      setCreateCharge(true);
      setChargeId(activeCharge!);
    } else if (action === 'Remove' || action === 'Permanently Delete') {
      setDeleteAction(action);
      setOpenDialog(true);
    } else if (action === 'Payment Status') {
      
      setChargeMemberStatus(true);
      setCreateCharge(false);
      setChargeId(activeCharge!);
      // Optionally set charge name in context
      setChargeName(activeChargeName);

    }
    setMenuVisible(false);
  };

  // Handle deletion (soft or hard)
  const handleDelete = async () => {
    try {
      if (deleteAction === 'Remove') {
        if (step === 4) {
          const deleteResp = await hardDeleteChargeAction(activeCharge!);
          if (deleteResp?.status === 200) {
            console.log('Charge permanently deleted');
            fetchCharges(step);
          } else if (deleteResp?.status === 404) {
            console.error('Charge not found');
          } else {
            console.error('Error permanently deleting charge:', deleteResp?.statusText);
          }
        } else {
          const deleteResp = await softDeleteChargeAction(activeCharge!);
          if (deleteResp?.status === 200) {
            console.log('Charge removed successfully');
            fetchCharges(step);
          } else if (deleteResp?.status === 404) {
            console.error('Charge not found');
          } else {
            console.error('Error removing charge:', deleteResp?.statusText);
          }
        }
      }
      setOpenDialog(false);
    } catch (error: any) {
      console.error('Error removing charge:', error?.response?.data?.message || error.message);
    }
  };

  // Fetch charges from API based on active tab and pagination
  const fetchCharges = async (activeTab: number, page = 0, pageSize = 10) => {
    setLoading(true);
    try {
      let response;
      const limit = pageSize;
      const offset = page * limit;
      if (activeTab === 1) {
        response = await fetchChargeData('upcoming', limit, offset);
      } else if (activeTab === 2) {
        response = await fetchChargeData('past', limit, offset);
      } else if (activeTab === 3) {
        response = await fetchChargeData('draft', limit, offset);
      } else if (activeTab === 4) {
        response = await fetchChargeData('deleted', limit, offset);
      }
      console.log("final frontend charge 2: ",response);
      setOriginalCharges(response);
      setCharges(response);
      if (response && response.length > 0) {
        setTotalRecords(response[0].totalRecords);
      }
    } catch (error) {
      console.error('Error fetching charges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharges(step);
  }, [step]);

  // Sorting and search filtering
  useEffect(() => {
    let updatedData = [...originalCharges];
    if (sortOption === 'A-Z') {
      updatedData.sort((a, b) => a.eventName.localeCompare(b.eventName));
    } else if (sortOption === 'Z-A') {
      updatedData.sort((a, b) => b.eventName.localeCompare(a.eventName));
    }
    if (searchTerm) {
      updatedData = updatedData.filter((charge) =>
        charge.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setCharges(updatedData);
  }, [sortOption, searchTerm, originalCharges]);

  // Prepare table data by mapping charges
  const mergedChargesData = charges.map((charge) => ({
    chargeName: charge.eventName,
    dueDate: dayjs(charge.eventRegistrationDate).format('DD/MM/YYYY'),
    amount: `₹ ${charge.amount}`,
    membersPaid: charge.membersPaid, // Assuming this data is available
    feeType: charge.feeType.feeType,
    actions: (
      <View style={styles.actionsContainer}>
        <Menu
          visible={activeCharge === charge.eventId && menuVisible}
          elevation={5}
          onDismiss={() => setMenuVisible(false)}
          contentStyle={{ backgroundColor: theme.colors.background }}
          anchor={
            <IconButton
              icon="dots-horizontal"
              size={20}
              iconColor={theme.colors.mainText}
              onPress={() => {
                setActiveCharge(charge.eventId);
                setActiveChargeName(charge.eventName);
                setMenuVisible(true);
              }}
              
            />
          }
        >
          <Menu.Item onPress={() => handleMenuAction('View Details')} title="View Details"  titleStyle={{ color: theme.colors.mainText }}/>
          {(step === 1 || step === 3) ? (
            <Menu.Item onPress={() => handleMenuAction('Edit')} title="Edit" titleStyle={{ color: theme.colors.mainText }} />
          ) : (
            <Menu.Item onPress={() => handleMenuAction('Copy')} title="Copy" titleStyle={{ color: theme.colors.mainText }} />
          )}
          {step !== 2 && (
            <Menu.Item onPress={() => handleMenuAction('Remove')} title="Delete" titleStyle={{ color: theme.colors.mainText }} />
          )}
          <Menu.Item onPress={() => handleMenuAction('Payment Status')} title="Payment Status" titleStyle={{ color: theme.colors.mainText }} />
        </Menu>
      </View>
    ),
  }));

  const columnNameArray = [
    { field: 'chargeName', headerName: 'Charges/Fees' },
    { field: 'dueDate', headerName: 'Due Date' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'membersPaid', headerName: 'Members Paid' },
    { field: 'feeType', headerName: 'Fee Type' },
    { field: 'actions', headerName: 'Action' },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Tabs */}
      <ViewTab step={step} setStep={setStep} tabBtnTxt="Create Charge" actionType="charge" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.main} />
        </View>
      ) : charges.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image source={require('../images/Frame.png')} style={styles.noDataImage} resizeMode="contain" />
          <Text style={[styles.noDataText, { color: 'gray' }]}>No Charges</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          <FilterListTable
            tableData={mergedChargesData}
            columnNameArray={columnNameArray}
            toDisplayFooter={false}
            totalRecords={originalCharges && originalCharges.length > 0 ? originalCharges[0].totalRecords : 0}
            currentPage={currentPage}
          />
          <PaginationFooter
            currentPage={currentPage}
            totalRecords={originalCharges && originalCharges.length > 0 ? originalCharges[0].totalRecords : 0}
            pageSize={pageSize}
            onPageChange={(newPage: number) => {
              setCurrentPage(newPage);
              fetchCharges(step, newPage);
            }}
          />
        </View>
      )}

      {/* Confirm Deletion Modal */}
      <ConfirmBoxModal
        open={openDialog}
        title={deleteAction === 'Delete' ? 'Confirm Deletion' : 'Delete Charge/Fee'}
        description="Are you sure you want to delete this Charge/Fee?"
        onAgree={handleDelete}
        onDisagree={() => setOpenDialog(false)}
        onClose={() => setOpenDialog(false)}
        agreeText="Yes, Delete"
        disagreeText="No, Cancel"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 16,
    // backgroundColor: '#fff',
    // flex: 1,
    marginBottom:30
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  noDataContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  noDataImage: {
    width: '100%',
    height: 200,
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
  },
  tableContainer: {
    width: '100%',
    height: '80%',
    padding: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ViewChargeForm;
