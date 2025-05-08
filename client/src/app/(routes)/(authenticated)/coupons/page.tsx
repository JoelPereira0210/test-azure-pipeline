'use client';

import React, { useState, useEffect, useContext } from 'react';
import CreateEventForm from '@/src/forms/CreateEventForm';
import { fetchEventData } from '@/src/actions/createevent';
import { EventContext } from '@/src/component/context/EventContext';
import { EventProvider } from '@/src/component/context/EventContext';
import '@/src/app/(routes)/(authenticated)/events/style.scss';

import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import BaseContainer from '@/src/component/UI/Basecontainer';
import ButtonInput from '@/src/component/UI/Button/Button';
import CouponModal from '@/src/component/modals/CouponModal';
import { SubscriptionsContext } from '@/src/component/context/SubscriptionContext';
import { getCouponsAction } from '@/src/actions/superAdmin';
import Subscription from '@/src/component/UI/Subscription';
import Tabs from '@/src/component/Tabs/ViewTab';
import { CouponsContext } from '@/src/component/context/CouponsContext';
import Coupon from '@/src/component/UI/Coupon';
interface CouponData {
  couponId: string;
  couponName: string;
  couponCode: string;
  couponDescription: string;
  maxUses: number;
  societyId: string;
  percentage: number;
  isDeleted: string;
  createdAt: string;
  modifiedAt: string;
  createdById: string;
  modifiedById: string;
  shouldPublish: boolean;
  expiryDate: String;
}
const Coupons: React.FC = () => {
  const theme = useTheme();
  const mode = theme?.palette?.mode;
  const [couponPresent, setCouponPresent] = useState(true); // Indicates if events are present
  const [showPopup, setShowPopup] = useState(false);
  const [step, setStep] = useState(1);
  const [coupons, setCoupons] = useState([]);

  const {
    createCoupon,
    setCreateCoupon,
    setCouponActionType,
    CouponActionType,
    setCouponId,
    couponActionType,
    editCouponData,
    setEditCouponData,
    fetchData,
    setFetchData,
  } = useContext(CouponsContext);
  // const [eventActionType, setEventActionType] = useState('edit event');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (fetchData) {
      fetchCoupons();
    }
  }, [fetchData]);

  useEffect(() => {
    fetchCoupons();
  }, []);
  const fetchCoupons = async () => {
    try {
      // switch (step) {
      //     case 1: {
      const activeCoupons = await getCouponsAction('active');
      //     break;
      // }
      // case 2: {
      const draftCoupon = await getCouponsAction('draft');
      const expiredCoupon = await getCouponsAction('expired');
      //     break;
      // }
      // case 3: {
      const deletedCoupon = await getCouponsAction('deleted');
      //     break;
      // }
      // default: {
      // activeCoupons = await getSubscriptionsAction('');
      //         break;
      //     }
      // }
      // console.log("active", activeCoupons)
      // console.log("draftCoupon", draftCoupon)
      // console.log("deletedCoupon", deletedCoupon)
      if (
        activeCoupons.length > 0 ||
        draftCoupon.length > 0 ||
        deletedCoupon.length > 0 ||
        expiredCoupon.length > 0
      ) {
        setCouponPresent(true);
      } else {
        setCouponPresent(false);
      }
    } catch (error) {
      console.log('error while fetching', error);
    } finally {
      setFetchData(false);
    }
  };
  const fetchCurrentCoupons = async () => {
    try {
      let activeCoupons;
      console.log('step', step);
      switch (step) {
        case 1: {
          activeCoupons = await getCouponsAction('active');
          break;
        }
        case 2: {
          activeCoupons = await getCouponsAction('expired');
          break;
        }
        case 3: {
          activeCoupons = await getCouponsAction('draft');
          break;
        }
        case 4: {
          activeCoupons = await getCouponsAction('deleted');
          break;
        }
        default: {
          activeCoupons = await getCouponsAction('');
          break;
        }
      }
      console.log('XXX', activeCoupons);
      setCoupons(activeCoupons);
    } catch (error) {
      console.log('error while fetching', error);
    } finally {
      setFetchData(false);
    }
  };
  useEffect(() => {
    fetchCurrentCoupons();
  }, [step, fetchData]);
  // // Fetch events when the page loads
  // useEffect(() => {
  //     const fetchEvents = async () => {
  //         try {
  //             const response1 = await fetchEventData('upcoming'); // Fetch events from your API
  //             const response2 = await fetchEventData('past'); // Fetch events from your API
  //             const response3 = await fetchEventData('draft'); // Fetch events from your API
  //             const response4 = await fetchEventData('deleted'); // Fetch events from your API

  //             if (response1.length > 0 || response2.length > 0 || response3.length > 0 || response4.length > 0) {
  //                 setEventsPresent(true); // Set to true if events are present
  //             } else {
  //                 setEventsPresent(false); // Set to false if no events are present
  //             }

  //         } catch (error) {
  //             console.error('Error fetching events:', error);
  //             setEventsPresent(false); // Set to false if error occurs and no events found
  //         } finally {
  //             setLoading(false); // Stop loading
  //         }
  //     };

  //     fetchEvents();
  // }, [createEvent]);

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh', // Adjust based on page height
        }}
      >
        <CircularProgress size="3rem" />
      </Box>
    );
  }
  console.log('coupons', coupons);
  console.log('length ocupon', coupons.length);
  return (
    <Box

      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-dark-background)'
      }}
    >
      {createCoupon ? (
        <>
          <CouponModal
            open={createCoupon}
            onClose={() => setCreateCoupon(false)}
            buttonOneText={'Save Draft'}
            buttonOneAction={() => { }}
            buttonTwoText={'Delete'}
            buttonTwoAction={() => { }}
            buttonThreeText={'Publish'}
            buttonThreeAction={() => { }}
          />
        </>
      ) : couponPresent ? (
        <Box
          className="events-first-parent-container"
          sx={{
            width: 'calc(100% - 240px)',
            '@media (max-width:767px)': {
              width: '100%',
            },
            border: '1px solid #A2A1A833',
            // height: 'calc(100vh - 50px)',
            borderRadius: '20px',

            padding: '5px 20px 20px',
            '@media(max-width:768px)': {
              border: 'none',
              width: '100%',
              padding: 0,
            },
          }}
        >
          <Tabs
            step={step}
            setStep={setStep}
            tabBtnTxt="Create Coupon"
            actionType="coupon"
          />
          {coupons?.length > 0 ? (
            <Box className="flex flex-wrap gap-4 mt-[20px]" mt={3} mb={9}>
              {coupons?.map((coupon) => (
                // <Subscription
                //     planName={coupon.planName}
                //     maxUsers={coupon.maxUsers}
                //     amount={coupon.price}
                //     duration={coupon.duration}
                //     buttonText={'Edit'}
                //     buttonAction={() => {
                //         setEditCouponData(coupon)
                //         setCreateCoupon(true)
                //     }}
                // />
                <Coupon
                  key={coupon.couponCode}
                  couponName={coupon.couponName}
                  couponCode={coupon.couponCode}
                  maxUses={coupon.maxUses}
                  discountPercentage={coupon.discountPercentage}
                  couponDescription={coupon.couponDescription}
                  societyId={coupon.societyId}
                  expiryDate={coupon.expiryDate}
                  uses={coupon.uses}
                  buttonText={'Edit'}
                  buttonAction={() => {
                    setEditCouponData(coupon);
                    setCreateCoupon(true);
                  }}
                />
              ))}
            </Box>
          ) : (
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
                alt="No coupons available"
              />
              <Typography variant="text12" sx={{ color: 'gray' }}>
                No coupons available
              </Typography>
            </Box>
          )}
        </Box>
      ) :
        (
          <Box
            sx={{
              width: 'calc(100% - 240px)',
              '@media (max-width:767px)': {
                width: '100%',
              }
              ,
              border: '1px solid #A2A1A833',
              // height: 'calc(100vh - 50px)',
              borderRadius: '20px',

              padding: '5px 20px 20px',
              '@media(max-width:768px)': {
                border: 'none',
                width: '100%',
                padding: 0
              },
            }}
          >
            <BaseContainer text="No Coupons">
              <ButtonInput
                type="button"
                text="Create Coupons"
                onClick={() => {
                  setCreateCoupon(true); // Show CreateEventForm when "Create Event" is clicked
                }}
                disabled={false}
                loading={false}
                styles={{ maxWidth: '230px' }}
              />
            </BaseContainer>
          </Box>
        )}
    </Box>
  );
};

export default Coupons;



