

"use client"
import React, { useState, useEffect, useContext } from 'react'
import ViewTab from '../component/Tabs/ViewTab';
import PaginationFooter from '../component/UI/TableFooter/TableFooter';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  CircularProgress,
  Button,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { fetchChargeData } from '../actions/charges';
import { useRouter, usePathname } from 'next/navigation';
import { ChargesContext } from '../component/context/ChargesContext';
import ConfirmBoxModel from '../component/UI/Popup/ConfirmBoxModel';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import FilterListTable from '../component/UI/Tables/FilterListTable';
import FilterListTableHeader from '../component/UI/TableHeader/FilterListTableHeader';
import ChargeFeeModal from '../component/modals/ChargeFeeModal';
import { softDeleteChargeAction } from '../actions/charges';
import { hardDeleteChargeAction } from '../actions/charges';

dayjs.extend(utc);

function ViewChargeForm() {
  const [step, setStep] = useState(1);
  const { createCharge, setCreateCharge, setChargeActionType, chargeId, setChargeId, chargeActionType, chargeName, setChargeName, setChargeMemberStatus, setChargeSection } = useContext(ChargesContext);

  const [anchorEl, setAnchorEl] = useState(null); // For action menu
  const [activeCharge, setActiveCharge] = useState(null); // Store the active event for action menu
  const [activeChargeName, setActiveChargeName] = useState(null)
  const [loading, setLoading] = useState(true); // Loading state
  const [charges, setCharges] = useState([]); // Store fetched events
  const [openDialog, setOpenDialog] = useState(false); // State for handling the open state of AlertDialog
  const [deleteAction, setDeleteAction] = useState(''); // Tracks if it's 'Delete' or 'Permanently Delete'
  const theme = useTheme();
  const mode = theme.palette.mode;
  const router = useRouter();

  const [originalCharges, setOriginalCharges] = useState([]);
  const [sortOption, setSortOption] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  const [currentPage, setCurrentPage] = useState(0); // Current page index
  const [totalRecords, setTotalRecords] = useState(0); // Total record count
  const pageSize = 10; // Number of records per page

  
  useEffect(() => {
    // Update event section in context based on the step
    if (step === 1) {
      setChargeSection('upcoming');
    } else if (step === 2) {
      setChargeSection('past');
    }
    else if (step === 3) {
      setChargeSection('draft');
    }
    else if (step === 4) {
      setChargeSection('deleted');
    }

  }, [step, setChargeSection]);

  const handleClickMenu = (charge, chargeId, chargeName) => {
    setAnchorEl(charge.currentTarget);
    setActiveCharge(chargeId); // Set the active event ID for the menu
    setActiveChargeName(chargeName);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Handle both soft and hard delete based on the tab (step)
  const handleDelete = async () => {
    try {
      if (deleteAction === 'Remove') {
        if (step === 4) {
          // If in the Deleted tab, perform a hard delete
          const deleteResp = await hardDeleteChargeAction(activeCharge);
          if (deleteResp.status === 200) {
            console.log('Charge permanently deleted successfully');
            fetchCharges(step); // Refresh the list of charges after deletion
          } else if (deleteResp.status === 404) {
            console.error('Charge not found');
          } else {
            console.error('Error permanently deleting charge:', deleteResp.statusText);
          }
        } else {
          // If in any other tab, perform a soft delete
          const deleteResp = await softDeleteChargeAction(activeCharge);
          if (deleteResp.status === 200) {
            console.log('Charge removed successfully');
            fetchCharges(step); // Refresh the list of charges after deletion
          } else if (deleteResp.status === 404) {
            console.error('Charge not found');
          } else {
            console.error('Error removing charge:', deleteResp.statusText);
          }
        }
      }

      setOpenDialog(false); // Close the confirmation dialog
    } catch (error) {
      console.error('Error removing charge:', error?.response?.data?.message || error.message);
    }
  };

  const handleMenuAction = async (action) => {
    // console.log(`${action} event with ID: ${activeEvent}`);
    if (action === 'View Details') {
      console.log("view charge clicked");
      setChargeId(activeCharge);
      setChargeActionType('view charge');
      setChargeMemberStatus(false);
      setCreateCharge(true);
      <ChargeFeeModal open={true} onClose={() => { setCreateCharge(false); setChargeActionType(null); }} step={step} />

    }
    if (action === 'Edit') {
      console.log("edit charge clicked");

      setChargeId(activeCharge);
      setChargeActionType('edit charge');
      setChargeMemberStatus(false);
      setCreateCharge(true);
      <ChargeFeeModal open={true} onClose={() => { setCreateCharge(false); setChargeActionType(null); }} />

    }

    if (action === 'Copy') {
      console.log("Copy charge clicked");

      setChargeId(activeCharge);
      setChargeActionType('copy charge');
      setChargeMemberStatus(false);
      setCreateCharge(true);
      <ChargeFeeModal open={true} onClose={() => { setCreateCharge(false); setChargeActionType(null); }} />

    }

    if (action === 'Remove' || action === 'Permanently Delete') {
      console.log("Remove charge clicked");
      setDeleteAction(action);
      setOpenDialog(true); // Open confirmation dialog
    }


    if (action === "Payment Status") {
      console.log("payment status charge clicked");


      setChargeId(activeCharge);
      setChargeName(activeChargeName);

      setCreateCharge(false);
      setChargeMemberStatus(true);

    }

    handleCloseMenu();
  };



  const fetchCharges = async (activeTab, page = 0, pageSize = 10) => {
    setLoading(true); // Start loading
  

    try {
      let response;

      const limit = pageSize; // Number of items per page
      const offset = page * limit; // Starting index for the current page

      if (activeTab === 1) {
        // Fetch Upcoming events
        response = await fetchChargeData('upcoming',limit, offset);
      } else if (activeTab === 2) {
        // Fetch Past events
        response = await fetchChargeData('past',limit, offset);
        // console.log("final frontend: ",response);
      } else if (activeTab === 3) {
        // Fetch Draft events
        response = await fetchChargeData('draft',limit, offset);
      } else if (activeTab === 4) {
        // Fetch Deleted events
        response = await fetchChargeData('deleted',limit, offset);
      }

      console.log('final frontend charge 2: ', response);
      setOriginalCharges(response); // Store the original data
      setCharges(response); // Update events state
      setTotalRecords(originalCharges[0].totalRecords);
      

      // setOriginalCharges((prev) => [...prev, ...response]); // Append to the original charges
      // setCharges((prev) => [...prev, ...response]); // Append to the current charges

    } catch (error) {
      console.error('Error fetching charges:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };



  useEffect(() => {
    fetchCharges(step);
  }, [step]); // Refetch events when the active tab changes


  // Unified Sorting and Search Logic
  useEffect(() => {
    let updatedData = [...originalCharges];

    if (sortOption === "A-Z") {
      updatedData.sort((a, b) => a.eventName.localeCompare(b.eventName));
    } else if (sortOption === "Z-A") {
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
    membersPaid: charge.membersPaid,  // Assuming this data comes from the response
    feeType: charge.feeType.feeType,
    actions: (
      <Box display="flex" justifyContent={"center"}>
        <IconButton
          onClick={(event) => { handleClickMenu(event, charge.eventId, charge.eventName) }}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleMenuAction('View Details')}>View Details</MenuItem>
          {(step === 1 || step === 3) ? (<MenuItem onClick={() => handleMenuAction('Edit')}>Edit</MenuItem>) : (<MenuItem onClick={() => handleMenuAction('Copy')}>Copy</MenuItem>)}
          {(step !== 2) && (<MenuItem onClick={() => handleMenuAction('Remove')}>Delete</MenuItem>)}
          <MenuItem onClick={() => handleMenuAction('Payment Status')}>Payment Status</MenuItem>
        </Menu>
      </Box>
    ),
  }));

  // Define columns for the charges and fees table
  const columnNameArray = [
    { field: 'chargeName', headerName: 'Charges/Fees' },
    { field: 'dueDate', headerName: 'Due Date' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'membersPaid', headerName: 'Members Paid' },
    { field: 'feeType', headerName: 'Fee Type' },
    { field: 'actions', headerName: 'Action' },
  ];


    console.log("charges in state",charges);
  return (
    <>
      <Box className="custom-container">
        <ViewTab step={step} setStep={setStep} tabBtnTxt="Create Charge" actionType="charge" />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress size="3rem" />
          </Box>
        ) : charges.length === 0 ? (
          // Show image when there are no events
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <Box component="img" src={'/images/Frame.png'} alt="No events available" />
            <Typography variant="text12" sx={{ color: 'gray' }}>No Charges</Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', padding: "2%" }}>





            <FilterListTable
              tableData={mergedChargesData}
              columnNameArray={columnNameArray}
              toDisplayFooter={false}
              totalRecords={originalCharges[0].totalRecords}
              currentPage={currentPage}
          
            />


            <PaginationFooter
              currentPage={currentPage}
              totalRecords={originalCharges[0].totalRecords}
              pageSize={pageSize}
              onPageChange={(newPage) => {
                setCurrentPage(newPage);
                fetchCharges(step, newPage);
              }}
            />

            
          
          </Box>

        )}
      </Box>

      <ConfirmBoxModel
        open={openDialog}
        title={deleteAction === 'Delete' ? 'Confirm Deletion' : 'Delete Charge/Fee'}
        description={
          deleteAction === 'Delete'
            ? 'Are you sure you want to delete this Charge/Fee?'
            : 'Are you sure you want to delete this Charge/Fee?'
        }
        onAgree={handleDelete}
        onDisagree={() => setOpenDialog(false)}
        onClose={() => setOpenDialog(false)}
        agreeText={deleteAction === 'Delete' ? 'Yes, Delete' : 'Yes, Delete'}
        disagreeText="No, Cancel"
      />
    </>

  )
}

export default ViewChargeForm

