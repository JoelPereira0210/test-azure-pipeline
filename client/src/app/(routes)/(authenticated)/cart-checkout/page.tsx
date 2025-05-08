'use client';

import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Card, Divider, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import ButtonInput from '@/src/component/UI/Button/Button';
import { useUser } from '@/src/component/context/UserContext';
import EventPayment from '@/src/component/EventPayment';
import { PaymentContext } from '@/src/component/context/PaymentContext';
import ChargesPayment from '@/src/component/ChargesPayment';
import SubscriptionPayment from '@/src/component/SubscriptionPayment';
import { validateCoupon } from '@/src/actions/coupons';
import toast from 'react-hot-toast';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { setRoleAction } from '@/src/actions/auth';
import MembershipPayment from '@/src/component/MemberShipPayment';

const CartCheckoutPage = () => {

  const {
    paymentItemAmount,
    setPaymentItemAmount,
    paymentItemName,
    setPaymentItemName,
    paymentItemId,
    setPaymentItemId,
    paymentItemSection,
    setPaymentItemSection,
    eventRegistrationCount,
    subsciptionDuration,
    setSubscriptionDuration,
    subscriptionMaxUsers,
    setSubscriptionMaxUsers
  } = useContext(PaymentContext);

  const { user } = useUser();
  const theme = useTheme();
  const mode = theme.palette.mode;


  const router = useRouter();


  console.log("paymentItemAmount", paymentItemAmount);
  console.log("paymentItemName", paymentItemName);
  console.log("paymentItemId", paymentItemId);
  console.log("paymentItemSection", paymentItemSection);
  console.log("eventRegistrationCount", eventRegistrationCount);
  console.log("subsciptionDuration", subsciptionDuration);
  console.log("subscriptionMaxUsers", subscriptionMaxUsers);


  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountData, setDiscountData] = useState(null);
  const [loadingDiscount, setLoadingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [isCouponVisible, setIsCouponVisible] = useState(false); // New state for toggling visibility

  // Calculate dynamic values

  let subtotal = paymentItemAmount;
  let total = subtotal - discountAmount;



  const handleApplyDiscount = async () => {
    setLoadingDiscount(true);
    setDiscountError('');
    setDiscountApplied(false);
    try {
      const FetchedDiscountData = await validateCoupon(discountCode);
      if (FetchedDiscountData && FetchedDiscountData.discountPercentage) {
        setDiscountData(FetchedDiscountData); // Set only after validation
        console.log("FetchedDiscountData", FetchedDiscountData);
        const discountAmount = (subtotal * FetchedDiscountData.discountPercentage) / 100;
        setDiscountAmount(discountAmount);
        setDiscountApplied(true);
        // toast.success("Discount applied successfully!");
        console.log("Discount applied successfully!");
      } else {
        setDiscountError('Invalid discount code or no discount available.');
        setDiscountAmount(0);
        setDiscountApplied(false);
        console.log("Invalid discount code or no discount available.");
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      setDiscountError('Failed to validate discount code. Please try again.');
      console.log("Failed to validate discount code. Please try again.");
      setDiscountAmount(0);
      setDiscountApplied(false);
    } finally {
      setLoadingDiscount(false);
    }
  };

  const handleCancel = async () => {

    // window.location.href='/committee'; 
    window.history.back()

  };



  let membershipUserId = null;

  if (paymentItemSection === 'membership') {
    const userFromSession = JSON.parse(sessionStorage.getItem("userId"));
    console.log("mm", userFromSession)
    membershipUserId = userFromSession?.userId;
    console.log("Membership User ID:", membershipUserId);
  }

  return (

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        width: { xs: "90%", sm: '90%', md: '60%', lg: '60%', xl: '60%' },
        marginTop: "5%"
      }}
    >
      <Typography variant="text12" fontWeight={600} mb={1}>
        Payment
      </Typography>
      {paymentItemSection !== "Event Payment" && paymentItemSection !== "Donation Payment" && paymentItemSection !== "Charges Payment" && (
        <Typography variant='text3' fontWeight={500} color={'#9C9AA5'} mb={3}>Choose a plan followed to your needs</Typography>
      )}
      <Card
        sx={{
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%',
          margin: 'auto',
          backgroundColor: mode === 'light' ? '#C4DBF7' : '#252525'

        }}
      >
        {/* Title with toggle button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Your Order Summary
          </Typography>

        </Box>

        {/* Plan Details */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
            border: '0.5px solid',
            borderRadius: '12px',
            p: 3,
            borderColor: mode === 'light' ? 'white' : '#F5F6FA5F',
            backgroundColor: mode === 'light' ? '#1F64FF40' : 'transparent'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            <Typography variant="body1">{paymentItemName}</Typography>
          </Box>
          <Typography variant="body1" fontWeight="bold">
            Rs. {paymentItemAmount}
          </Typography>
        </Box>

        {paymentItemSection !== "Event Payment" && paymentItemSection !== "Donation Payment" && paymentItemSection !== "Charges Payment" && paymentItemSection !== "membership" && (
          <>
            <Divider sx={{ my: 2 }} />

            {/* Discount Code Input */}


            {/* Toggle for Apply Coupon */}
            <Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                  Apply Coupon
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ mb: 1, cursor: 'pointer' }}
                  onClick={() => setIsCouponVisible(!isCouponVisible)}
                >
                  {isCouponVisible ? <ArrowDropUpIcon fontSize='medium' /> : <ArrowDropDownIcon fontSize='medium' />}
                </Typography>

              </Box>

              {isCouponVisible && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '2px solid',
                    borderColor: '#4B7DF3',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    mt: 1,
                    backgroundColor: mode === 'light' ? 'white' : 'black',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#1976d2',
                      borderRadius: '4px',
                      marginRight: '8px',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      %
                    </Typography>
                  </Box>
                  <TextField
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    size="small"
                    placeholder="Enter Code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    sx={{
                      flex: 1,
                      '& input': {
                        padding: '0.5rem 0',
                      },
                    }}
                  />
                  <Button
                    variant="text"
                    sx={{
                      color: '#1976d2',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                      marginLeft: '8px',
                    }}
                    onClick={handleApplyDiscount}
                  >
                    Apply
                  </Button>
                </Box>
              )}
            </Box>



            <Divider sx={{ my: 2 }} />

            {/* Price Breakdown */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2">Rs. {subtotal}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">Platform Fee</Typography>
              <Typography variant="body2">Rs. x</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">Convience Fee</Typography>
              <Typography variant="body2">Rs. x</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">Discount ({discountData?.discountPercentage}%)</Typography>
              <Typography variant="body2" color="error">
                -Rs. {discountAmount}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Total */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            Total
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Rs. {total}
          </Typography>
        </Box>
      </Card>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px', // Adjust spacing between buttons
          flexWrap: 'nowrap', // Prevent wrapping
          mt: 4,
        }}
      >



        {(paymentItemSection === 'Event Payment' || paymentItemSection === 'Donation Payment') && (
          <EventPayment
            total={total}
            planName={paymentItemName}
            planId={paymentItemId}
            planSection={paymentItemSection}
            noOfRegistrations={eventRegistrationCount}
            user={user}
          />
        )}

        {paymentItemSection === 'Charges Payment' && (
          <ChargesPayment
            total={total}
            chargeName={paymentItemName}
            chargeId={paymentItemId}
            chargeSection={paymentItemSection}
            user={user}
          />
        )}

        {paymentItemSection === 'Subscription Payment' && (
          <SubscriptionPayment
            total={total}
            subscriptionName={paymentItemName}
            subscriptionId={paymentItemId}
            duration={subsciptionDuration} // Use duration
            maxUsers={subscriptionMaxUsers} // Use max users
            user={user}
            discountApplied={discountApplied}
            discountData={discountData}
          />
        )}


        {paymentItemSection === 'membership' && (
          <MembershipPayment
            total={total}
            membershipName={paymentItemName}
          // membershipId={paymentItemId}

          // user={user}

          />
        )}
        {/* {paymentItemSection === 'membership' && (
          <MembershipPayment
            total={total}
            membershipName={paymentItemName}
            membershipId={paymentItemId}
          // user={

          //      JSON.parse(sessionStorage.getItem("userId")).userId 

          // }
          />
        )} */}




        <ButtonInput
          type="button"
          disabled={false}
          text="Cancel"
          onClick={handleCancel}
          styles={{
            width: '150px', // Ensure consistent button size
            backgroundColor: mode === 'light' ? 'transparent' : 'transparent',
            color:
              mode === 'light'
                ? 'var(--tw-text-light-mainText)'
                : 'var(--tw-text-dark-mainText)',
            border:
              mode === 'light'
                ? '1px solid var(--tw-text-light-mainText)'
                : '1px solid var(--tw-text-dark-mainText)',
            textTransform: 'none',

          }}
        />
      </Box>


    </Box>
    //   </Box>
    // </Box>
  );
};

export default CartCheckoutPage;

