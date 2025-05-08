'use client';

import React, { useState, useEffect, useContext } from 'react';

import './style.scss';

import { Box, CircularProgress } from '@mui/material';
import BaseContainer from '@/src/component/UI/Basecontainer';
import ButtonInput from '@/src/component/UI/Button/Button';
import { ChargesContext } from '@/src/component/context/ChargesContext';
import ViewChargeForm from '@/src/forms/ViewChargeForm';
import ChargeFeeModal from '@/src/component/modals/ChargeFeeModal';
import { fetchChargeData, fetchUserChargeData } from '@/src/actions/charges';
import ViewPaymentStatus from '@/src/forms/ViewPaymentStatus';
import ViewUserCharge from '@/src/forms/ViewUserCharge';
import { fetchBankDetails } from '@/src/actions/profile';
import AlertModal from '@/src/component/UI/Popup/AlertPopUp';
import { Footer } from '@/src/component/UI/Footer/Foter';
import { MoreDetailsProvider } from '@/src/component/context/MoreDetails';

const CreateMaintenancePage: React.FC = () => {

  const { createCharge, setCreateCharge, setChargeActionType, chargeId, setChargeId, chargeActionType, chargeMemberStatus } = useContext(ChargesContext);
  const [chargesPresent, setChargesPresent] = useState(true); // Indicates if charges are present
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false); // State to differentiate between admin and non-admin
  const [showAlertModal, setShowAlertModal] = useState(false); // State to control alert modal

  // Determine if the user is an admin
  useEffect(() => {
    const role = localStorage.getItem('flow');
    setIsAdmin(role === 'admin');
  }, []);


  // Fetch charges when the page loads
  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const response1 = await fetchChargeData('upcoming'); // Fetch charges from your API
        const response2 = await fetchChargeData('past'); // Fetch charges from your API
        const response3 = await fetchChargeData('draft'); // Fetch charges from your API
        const response4 = await fetchChargeData('deleted'); // Fetch charges from your API

        if (response1.length > 0 || response2.length > 0 || response3.length > 0 || response4.length > 0) {
          setChargesPresent(true); // Set to true if charges are present
          console.log("charge response 1", response1);
          console.log("charge response 2", response2);
          console.log("charge response 3", response3);
          console.log("charge response 4", response4);
        } else {
          setChargesPresent(false); // Set to false if no charges are present
        }

      } catch (error) {
        console.error('Error fetching charges:', error);
        setChargesPresent(false); // Set to false if error occurs and no charges found
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (isAdmin) {
      fetchCharges();
    }
  }, [createCharge, isAdmin]);


  // Fetch charges for non-admin users (Pending and Paid only)
  useEffect(() => {
    const fetchUserCharges = async () => {
      try {
        const response1 = await fetchUserChargeData('pending');
        const response2 = await fetchUserChargeData('paid');

        if (response1.length > 0 || response2.length > 0) {

          setChargesPresent(true);
          // console.log("charge user response 1", response1);
          // console.log("charge user response 2", response2);
        } else {
          setChargesPresent(false);
        }
      } catch (error) {
        console.error('Error fetching user charges:', error);
        setChargesPresent(false);
      } finally {
        setLoading(false);
      }
    };

    if (!isAdmin) {
      fetchUserCharges();
    }
  }, [isAdmin]);

  // Show loading indicator while fetching data
  if (loading) {
    return (<Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh', // Adjust based on page height
      }}
    >
      <CircularProgress size="3rem" />
    </Box>);
  }

  const handleCreateAction = async () => {
    // alert("hi");
    try {
      // Check if bank details exist
      const bankDetails = await fetchBankDetails();
      // const bankDetails = null;
      console.log("bankDetails are", bankDetails);

      // setChargeActionType('create charge');
      setCreateCharge(true);


      if (!bankDetails) {
        setShowAlertModal(true); // Show alert modal if no bank details
        return;
      }


    } catch (error) {
      console.error('Error fetching bank details:', error);
      setShowAlertModal(true); // Show modal in case of API failure
    }
  };

  return (
    <>
    <MoreDetailsProvider>
      {isAdmin ? (
        chargeMemberStatus ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                width: 'calc(100% - 240px)',
                borderRadius: '20px',
                border: '1px solid #9C9AA533',
                '@media (max-width:767px)': {
                  width: '100%',
                },marginBottom:"3%"
              }}
            >
              <ViewPaymentStatus />
            </Box>
          </Box>
        ) : createCharge ? (
          <>
            <ChargeFeeModal open={true} onClose={() => { setCreateCharge(false); setChargeActionType(null); setChargeId(null); }} />
          </>
        ) : chargesPresent ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                width: 'calc(100% - 240px)',
                borderRadius: '20px',
                border: '1px solid #9C9AA533',
                '@media (max-width:767px)': {
                  width: '100%',
                }
              }}
            >
              <ViewChargeForm />
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                width: 'calc(100% - 240px)',
                borderRadius: '20px',
                border: '1px solid #9C9AA533',
                '@media (max-width:767px)': {
                  width: '100%',
                }
              }}
            >
              <BaseContainer text="No Charges/Fees">
                <ButtonInput
                  type='button'
                  text='Add Charges/Fees'
                  // onClick={() => { setCreateCharge(true); }}
                  onClick={() => { handleCreateAction() }}
                  disabled={false}
                  loading={false}
                  styles={{ maxWidth: '230px' }}
                />
              </BaseContainer>
            </Box>
          </Box>
        )
      ) : (
        chargesPresent ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                width: 'calc(100% - 240px)',
                borderRadius: '20px',
                border: '1px solid #9C9AA533',
                '@media (max-width:767px)': {
                  width: '100%',
                }
              }}


            >
              <ViewUserCharge />
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                width: 'calc(100% - 240px)',
                borderRadius: '20px',
                border: '1px solid #9C9AA533',
                '@media (max-width:767px)': {
                  width: '100%',
                }
              }}


            >
              <BaseContainer text="No Charges/Fees" />

            </Box>

          </Box>
        )
      )}

      {/* Alert Modal always rendered */}
      <AlertModal
        open={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Bank Details Missing"
        note="Please update your bank details before proceeding to create."
        buttonText="Close"
      />
<Footer/></MoreDetailsProvider>
    </>
  );
};

export default CreateMaintenancePage;


