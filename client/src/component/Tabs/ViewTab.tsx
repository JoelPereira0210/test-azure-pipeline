// 'use client';
// import { Box, Typography, Button } from '@mui/material';
// import ControlPointIcon from '@mui/icons-material/ControlPoint';
// import { EventContext } from '../context/EventContext';
// import { ChargesContext } from '../context/ChargesContext';
// import React, { useContext } from 'react';
// import { SubscriptionsContext } from '../context/SubscriptionContext';
// import { CouponsContext } from '../context/CouponsContext';

// const Tabs = ({ step, setStep, tabBtnTxt, actionType }) => {
//   console.log("action", actionType)
//   const { setCreateEvent, setEventActionType, eventId, setEventId, eventActionType } = useContext(EventContext);
//   const { createCharge, setCreateCharge, setChargeActionType, chargeId, setChargeId, chargeActionType } = useContext(ChargesContext);
//   const { createSubscription, setCreateSubscription, setSubscriptionActionType, SubscriptionActionType, setSubscriptionId, subscriptionActionType, editSubscriptionData, setEditSubscriptionData } = useContext(SubscriptionsContext);
//   const { createCoupon, setCreateCoupon, setCouponActionType, CouponActionType, setCouponId, couponActionType, editCouponData, setEditCouponData } = useContext(CouponsContext);
//   return (
//     <Box sx={{ position: 'relative' }}>
//       <Button
//         variant="contained"
//         sx={{
//           display: { xs: 'flex', md: 'none' },
//           borderRadius: '8px',
//           fontSize: '12px',
//           fontWeight: '300',
//           padding: '4px 20px',
//           textTransform: 'none',
//           marginLeft: '54%',
//         }}
//         onClick={() => {
//           console.log("coupon", actionType)
//           if (actionType === 'event') {
//             setEventActionType("Create A New Event"); setCreateEvent(true);
//           }
//           else if (actionType === 'subscription') {
//             setCreateSubscription(true)
//           }
//           else if (actionType === 'coupon') {
//             setCreateCoupon(true)
//           }
//           else if (actionType === 'charge') {
//             setCreateCharge(true);
//           }

//         }}
//       >
//         {tabBtnTxt}
//       </Button>
//       <Box
//         className="tabs"
//         sx={{
//           display: 'flex',
//           justifyContent: { xs: 'center', sm: 'center', md: 'space-between', lg: 'space-between' },
//           alignItems: 'flex-end',
//         }}
//       >
//         <Box>
//           <button
//             className={`tab ${step === 1 ? 'active' : ''}`}
//             onClick={() => setStep(1)}
//           >
//             <Typography variant="text12" className="tabs-typography">
//               {actionType === 'subscription' ? 'Active Subscriptions' : actionType === 'coupon' ? 'Active Coupons' : 'Upcoming'}
//             </Typography>
//           </button>
//           {actionType !== 'subscription' && actionType !== 'coupon' && (
//             <button
//               className={`tab ${step === 2 ? 'active' : ''}`}
//               onClick={() => setStep(2)}
//             >
//               <Typography variant="text12" className="tabs-typography">
//                 Past
//               </Typography>
//             </button>
//           )}

//           {actionType === 'coupon' && (
//             <button
//               className={`tab ${step === 2 ? 'active' : ''}`}
//               onClick={() => setStep(2)}
//             >
//               <Typography variant="text12" className="tabs-typography">
//                 Expired
//               </Typography>
//             </button>
//           )}

//           <button
//             className={`tab ${step === 3 ? 'active' : ''}`}
//             onClick={() => setStep(3)}
//           >
//             <Typography variant="text12" className="tabs-typography">
//               Draft
//             </Typography>
//           </button>
//           <button
//             className={`tab ${step === 4 ? 'active' : ''}`}
//             onClick={() => setStep(4)}
//           >
//             <Typography variant="text12" className="tabs-typography">
//               Deleted
//             </Typography>
//           </button>
//         </Box>
//         <Button
//           variant="contained"
//           sx={{
//             display: { xs: 'none', md: 'inline-flex' },
//             marginTop: '1%',
//             marginBottom: '0.5%',
//             borderRadius: '8px',
//             marginRight: '2%',
//             fontSize: { xs: '12px', sm: '12px', md: '16px', lg: '16px' },
//             textTransform: 'none',
//           }}
//           startIcon={<ControlPointIcon />}
//           onClick={() => {
//             console.log("coupon", actionType)
//             if (actionType === 'event') {
//               setEventActionType("Create A New Event"); setCreateEvent(true);
//             }
//             else if (actionType === 'subscription') {
//               setCreateSubscription(true)
//             }
//             else if (actionType === 'coupon') {
//               setCreateCoupon(true)
//             }
//             else if (actionType === 'charge') {
//               setCreateCharge(true);
//             }

//           }}
//         >
//           {tabBtnTxt}
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Tabs;
'use client';
import { Box, Typography, Button } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { EventContext } from '../context/EventContext';
import { ChargesContext } from '../context/ChargesContext';
import React, { useContext,useEffect,useState } from 'react';
import { SubscriptionsContext } from '../context/SubscriptionContext';
import { CouponsContext } from '../context/CouponsContext';
import { fetchBankDetails } from '@/src/actions/profile';
import AlertModal from '../UI/Popup/AlertPopUp';

const Tabs = ({ step, setStep, tabBtnTxt, actionType, displayBtn = true }) => {
  const { setCreateEvent, setEventActionType, eventId, setEventId, eventActionType } = useContext(EventContext);
  const { createCharge, setCreateCharge, setChargeActionType, chargeId, setChargeId, chargeActionType } = useContext(ChargesContext);
  const { createSubscription, setCreateSubscription, setSubscriptionActionType, SubscriptionActionType, setSubscriptionId, subscriptionActionType, editSubscriptionData, setEditSubscriptionData } = useContext(SubscriptionsContext);
  const { createCoupon, setCreateCoupon, setCouponActionType, CouponActionType, setCouponId, couponActionType, editCouponData, setEditCouponData } = useContext(CouponsContext);
 
 
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false); // State to control alert modal


  const handleCreateAction = async () => {
    try {
      // Check if bank details exist
      const bankDetails = await fetchBankDetails();
      // const bankDetails = null;
      console.log("bankDetails are",bankDetails);
  
        setChargeActionType('create charge');
        setCreateCharge(true);
    

      if (!bankDetails && actionType === 'charge' ) {
        setShowAlertModal(true); // Show alert modal if no bank details
        return;
      }

    
    } catch (error) {
      console.error('Error fetching bank details:', error);
      setShowAlertModal(true); // Show modal in case of API failure
    }
  };

 


  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    // Check the `flow` value from localStorage and set state
    const role = localStorage.getItem('flow');
    setIsAdmin(role === 'admin');
  }, []);

  useEffect(() => {
    const role1 = localStorage.getItem('isSuperAdmin');
    setIsSuperAdmin(role1 === 'true'); // Assuming the stored value is 'true' for super admin
  }, []);
  

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Create New Event Button for Mobile */}
      {((isSuperAdmin === true || isAdmin) && displayBtn) && (
      <Button
        variant="contained"
       
        sx={{
          
          display: { xs: 'flex', md: 'none' }, // Only show on mobile
          // position: 'absolute', // Position it over the tabs
          // top: '-10px', // Adjust position above the tabs
          // right: '2%', // Adjust position to the right
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '300',
          padding: '4px 20px',
          textTransform: 'none',
          marginLeft: '54%',
        }}
        onClick={() => {
          if (actionType === 'event') { setEventActionType("Create A New Event"); setCreateEvent(true); }
          else {
            // setCreateCharge(true);
            handleCreateAction()
          }

        }}
      >
        {tabBtnTxt}
      </Button>
       )}

      <Box
        className="tabs"
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'center', md: 'space-between', lg: 'space-between' },
          alignItems: 'flex-end',
        }}
      >
        <Box>
          <button
            className={`tab ${step === 1 ? 'active' : ''}`}
            onClick={() => setStep(1)}
          >
            {actionType === 'subscription' ?(
            <Typography variant="text12" className="tabs-typography">
              Active
            </Typography>) :
            actionType === 'landingPage' ?(
              <Typography variant="text12" className="tabs-typography">
                Landing Cards
              </Typography>):
            <Typography variant="text12" className="tabs-typography">
            Upcoming
          </Typography> 
            }
          </button>

          {actionType !== "subscription" ? (<button
            className={`tab ${step === 2 ? 'active' : ''}`}
            onClick={() => setStep(2)}
          >
            
            {actionType === 'landingPage' ?(
            <Typography variant="text12" className="tabs-typography">
              Landing Sliders
            </Typography>) :

           ( <Typography variant="text12" className="tabs-typography">
              Past
            </Typography> ) }
          </button>) : null}

             {/* Draft and Deleted Tabs - Admin Only */}
             {( isSuperAdmin === true || isAdmin === true) && actionType !== 'landingPage' &&(
               <>
          <button
            className={`tab ${step === 3 ? 'active' : ''}`}
            onClick={() => setStep(3)}
          >
            <Typography variant="text12" className="tabs-typography">
              Draft
            </Typography>
          </button>
          <button
            className={`tab ${step === 4 ? 'active' : ''}`}
            onClick={() => setStep(4)}
          >
            <Typography variant="text12" className="tabs-typography">
              Deleted
            </Typography>
          </button>
          </>
          )}
        </Box>
        {/* Create New Event Button for Desktop */}

             {/* Conditionally Render Create Event Button for Desktop (Admin Only) */}
             {( (isSuperAdmin === true || isAdmin === true) && displayBtn) && (
        <Button
          variant="contained"
          sx={{
            display: { xs: 'none', md: 'inline-flex' }, // Hide in mobile, show in desktop
            marginTop: '1%',
            marginBottom: '0.5%',
            borderRadius: '8px',
            marginRight: '2%',
            fontSize: { xs: '12px', sm: '12px', md: '16px', lg: '16px' },
            textTransform: 'none',
          }}
          startIcon={<ControlPointIcon />}
          onClick={() => {
            if (actionType === 'event') { setEventActionType("Create A New Event"); setCreateEvent(true); }
            else if (actionType === 'subscription') {
              setCreateSubscription(true)
            }
            else if (actionType === 'coupon') {
              setCreateCoupon(true)
            }
            else {
              // setChargeActionType('create charge');
              // setCreateCharge(true);
              handleCreateAction()
            }

          }}
        >
          {tabBtnTxt}
        </Button>
         )}
      </Box>
      <AlertModal
        open={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Bank Details Missing"
        note="Please update your bank details before proceeding to create."
        buttonText="Close"
      />
    </Box>
  );
};

export default Tabs;