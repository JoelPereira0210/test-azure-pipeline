'use client';

import React, { useState, useEffect } from 'react';
import ChargesTab from '../component/Tabs/ChargesTab';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { fetchUserChargeData } from '../actions/charges';
import dayjs from 'dayjs';
import FilterListTable from '../component/UI/Tables/FilterListTable';
import ButtonInput from '../component/UI/Button/Button';
import UserChargeFeeModal from '../component/modals/UserChargeFeeModal';
import PaginationFooter from '../component/UI/TableFooter/TableFooter';

function ViewUserCharge() {
  const [step, setStep] = useState(1); // 1 for Pending, 2 for Paid
  const [loading, setLoading] = useState(true); // Loading state
  const [charges, setCharges] = useState([]); // Store fetched charges
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [selectedCharge, setSelectedCharge] = useState(null); // Selected charge data for the modal


    const [currentPage, setCurrentPage] = useState(0); // Current page index
    const [totalRecords, setTotalRecords] = useState(0); // Total record count
    const pageSize = 10; // Number of records per page

  // Fetch user charges based on the active tab
  const fetchCharges = async (status, page = 0) => {
    setLoading(true);
    try {
      const response = await fetchUserChargeData(status, pageSize, page * pageSize);
      console.log("ViewUserCharge",response);
      setCharges(response);
      setTotalRecords(response[0].totalRecords)
    } catch (error) {
      console.error('Error fetching user charges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch charges based on active tab (step)
  useEffect(() => {
    const status = step === 1 ? 'pending' : 'paid';
    fetchCharges(status);
  }, [step]);

   // Open modal and set selected charge
   const handleOpenModal = (charge) => {
    setSelectedCharge(charge);
    setModalOpen(true);

  };

    // Callback for pagination changes
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
      fetchCharges(step === 1 ? 'pending' : 'paid', newPage);
    };
  

    // Close modal and reset selected charge
    const handleCloseModal = () => {
      setModalOpen(false);
      setSelectedCharge(null);
    };

    console.log("selectedCharge",selectedCharge);

  // Prepare table data by mapping charges
  const mergedChargesData = charges.map((charge) => ({
    feeName: charge.feeName,
    dueDate: dayjs(charge.dueDate).format('DD/MM/YYYY'),
    amount: `₹ ${charge.amount}`,
    button: (
      <ButtonInput
    text={charge.status === 'Paid' ? 'Receipt' : charge.buttonText}
    type="button"
    onClick={() => handleOpenModal(charge)} // Open modal on button click
    fontWeight={300}
    fontSize={12}
    styles={{
      maxWidth: 'fit-content',
      whiteSpace: 'nowrap', // Prevents text wrapping
      padding: '8px 16px', // Adjust padding for better spacing
      backgroundColor: charge.status === 'Paid' ? '#F6F6F6' : '#3B82F6', // Light gray for "Paid", blue otherwise
      color: charge.status === 'Paid' ? '#000000' : '#FFFFFF', // Black text for "Paid", white otherwise
      borderRadius: '8px', // Rounded corners to match the design
      boxShadow: charge.status === 'Paid' ? 'none' : '0px 4px 8px rgba(59, 130, 246, 0.4)', // No shadow for "Paid"
    }}
  />
        
      
    ),
  }));

  // Define columns for the charges and fees table
  const columnNameArray = [
    { field: 'feeName', headerName: 'Maintenance Fee' },
    { field: 'dueDate', headerName: 'Due Date' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'button', headerName: '' },
  ];

  return (
    <Box className="custom-container">
      <ChargesTab step={step} setStep={setStep} /> {/* Renders tabs for Pending and Paid */}

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress size="3rem" />
        </Box>
      ) : charges.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <Box
            component="img"
            src={'/images/Frame.png'}
            alt="No events available"
          />
          <Typography variant="text12" sx={{ color: 'gray' }}>
              No {step === 1 ? 'Pending' : 'Paid'} charges
          </Typography>
        </Box>

      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', padding: '2%' }}>
       
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

        </Box>
      )}

      {/* Modal for charge details */}
      {selectedCharge && (
        <UserChargeFeeModal
          open={modalOpen}
          onClose={handleCloseModal}
          chargeId={selectedCharge.chargeId}
          isPaid={selectedCharge.status === "Paid"}
          chargeName = {selectedCharge.feeName}
        />
      )}

    </Box>
  );
}

export default ViewUserCharge;
