// 'use client';
// import { getPublishedSubscriptions } from '@/src/actions/auth';
// import ButtonInput from '@/src/component/UI/Button/Button';
// import Subscription from '@/src/component/UI/Subscription';
// import { Box, Typography, useTheme } from '@mui/material';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import SubscriptionPayment from '@/src/component/SubscriptionPayment';
// type Props = {};

// const Subscriptions = (props: Props) => {
//   const [loading, setLoading] = useState(false);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [selectedSubscription, setSelectedSubscription] = useState(null);
//   const router = useRouter();
//   const theme = useTheme();
//   const sessionPhoneNumber = sessionStorage.getItem("phoneNumber");
//   const societyId = JSON.parse(sessionStorage.getItem("socioId"));
//   const user = JSON.parse(sessionStorage.getItem("user"));
//   console.log("sessionPhoneNumber", sessionPhoneNumber)
//   useEffect(() => {
//     // if (!sessionPhoneNumber) {
//     //   console.log("!sessionPhoneNumber")
//     //   router.push('/signup')
//     // }
//     // else {
//     getSubscription();
//     // }
//   }, [sessionPhoneNumber, societyId])
//   const getSubscription = async () => {
//     try {
//       const response = await getPublishedSubscriptions();
//       if (response.status === 200) {
//         setSubscriptions(response?.data)
//       }
//     } catch (error) {
//       console.log("error getSubscription", error)
//     }
//   }
//   const handleSubscriptionClick = (subscription) => {
//     console.log("subscription", subscription)
//     // Toggle selection if already selected, else set new selection
//     setSelectedSubscription(prev => (prev === subscription ? null : subscription));
//   };
//   console.log("object", selectedSubscription)
//   return (
//     <Box
//       marginLeft={{ md: 4, sm: 0 }}
//       marginRight={{ md: 4, sm: 0 }}
//       className="flex flex-col justify-center items-center md:m-[20px] sm:m-[0px] w-full h-full rounded-2xl"
//       sx={{
//         background: `${theme.palette.mode === 'light'
//           ? 'var(--tw-bg-light-background)'
//           : 'var(--tw-bg-dark-background)'
//           }`,
//       }}>
//       <Box className="flex flex-col flex-wrap justify-between items-center mt-20 mb-24  w-full ">
//         <Box className="flex flex-col text-center" mb={3}>
//           <Typography variant="text1">Subscription</Typography>
//           <Typography variant="text10" color={'#9C9AA5'}>
//             Choose a plan followed to your needs.
//           </Typography>
//         </Box>
//         <Box className="flex flex-wrap ml-9 mr-9  gap-4" mb={9}>
//           {subscriptions?.map((subscription) => (
//             <Subscription
//               key={subscription?.subscriptionId}
//               planName={subscription.planName}
//               maxUsers={subscription.maxUsers}
//               amount={subscription.price}
//               planDescription={subscription.planDescription}
//               duration={subscription.duration}
//               selectedSubscription={selectedSubscription}
//               // setSelectedSubscription={setSelectedSubscription}
//               setSelectedSubscription={() => handleSubscriptionClick(subscription)}
//               subscription={subscription}
//               buttonText={'Subscribe'}
//             // buttonAction={() => handleSubscriptionClick(subscription)}
//             // planOnClick={() => {

//             // }}
//             />
//           ))}
//           {/* <Subscription />
//           <Subscription />
//           <Subscription />
//           <Subscription /> */}
//         </Box>
//         {/* {selectedSubscription ? 
//         <ButtonInput
//           type="button"
//           text={`Start Your ${selectedSubscription?.planName}`}
//           fontSize={16}
//           styles={{ maxWidth: '250px', height: '48px' }}
//           disabled={false}
//           loading={loading}
//           onClick={() => {
//             setLoading(true);
//             console.log('clicked');
//             window.location.href = "/signup?signin"
//             sessionStorage.removeItem('phoneNumber')
//           }}
//         /> : null} */}
//         {selectedSubscription ? <SubscriptionPayment data={selectedSubscription} text={`Start Your ${selectedSubscription?.planName}`} societyId={societyId} user={user} /> : null}
//       </Box>
//     </Box>
//   );
// };

// export default Subscriptions;

'use client';
import { getPublishedSubscriptions } from '@/src/actions/auth';
import ButtonInput from '@/src/component/UI/Button/Button';
import Subscription from '@/src/component/UI/Subscription';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState,useContext } from 'react';
import SubscriptionPayment from '@/src/component/SubscriptionPayment';
import { useUser } from '@/src/component/context/UserContext';
type Props = {};
import { PaymentContext } from '@/src/component/context/PaymentContext';

const Subscriptions = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const router = useRouter();
  const theme = useTheme();

  const sessionPhoneNumber = sessionStorage.getItem("phoneNumber");
  const storedSocietyId  = JSON.parse(sessionStorage.getItem("socioId"));
  const storedUser  = JSON.parse(sessionStorage.getItem("user"));

  // Fallback to User Context if session storage is empty
  const { user: contextUser } = useUser();

  const societyId = storedSocietyId || contextUser?.societyId;
  const user = storedUser || contextUser;

  console.log("sessionPhoneNumber", sessionPhoneNumber);


  // PaymentContext
  const {
    setPaymentItemAmount,
    setPaymentItemName,
    setPaymentItemId,
    setPaymentItemSection,
    subsciptionDuration, 
    setSubscriptionDuration,
    subscriptionMaxUsers, 
    setSubscriptionMaxUsers
  } = useContext(PaymentContext);

  useEffect(() => {
    // if (!sessionPhoneNumber) {
    //   console.log("!sessionPhoneNumber")
    //   router.push('/signup')
    // }
    // else {
    getSubscription();
    // }
  }, [sessionPhoneNumber, societyId])


  const getSubscription = async () => {
    try {
      const response = await getPublishedSubscriptions();
      if (response.status === 200) {
        setSubscriptions(response?.data)
      }
    } catch (error) {
      console.log("error getSubscription", error)
    }
  }

  const handleSubscriptionClick = (subscription) => {
    console.log("subscription", subscription)
    // Toggle selection if already selected, else set new selection
    setSelectedSubscription(prev => (prev === subscription ? null : subscription));
  };
  console.log("object", selectedSubscription)

  const handlePaymentGateway = async () => {
    try {
      setLoading(true);
      // Send subscription details to the payment gateway page
         // Set payment data in context
      setPaymentItemAmount(selectedSubscription?.price);
      setPaymentItemName(selectedSubscription?.planName);
      setPaymentItemId(selectedSubscription?.subscriptionId);
      setPaymentItemSection("Subscription Payment");
      setSubscriptionDuration(selectedSubscription?.duration);
      setSubscriptionMaxUsers(selectedSubscription?.maxUsers);


      // Redirect to the Payment Gateway page
      router.push('/cart-checkout');
    } catch (error) {
      console.error('Error navigating to the payment gateway:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      marginLeft={{ md: 4, sm: 0 }}
      marginRight={{ md: 4, sm: 0 }}
      className="flex flex-col justify-center items-center md:m-[20px] sm:m-[0px] w-full h-full rounded-2xl"
      sx={{
        background: `${theme.palette.mode === 'light'
          ? 'var(--tw-bg-light-background)'
          : 'var(--tw-bg-dark-background)'
          }`,
      }}>
      <Box className="flex flex-col flex-wrap justify-between items-center mt-20 mb-24  w-full ">
        <Box className="flex flex-col text-center" mb={3}>
          <Typography variant="text1">Subscription</Typography>
          <Typography variant="text10" color={'#9C9AA5'}>
            Choose a plan followed to your needs.
          </Typography>
        </Box>
        <Box className="flex flex-wrap ml-9 mr-9  gap-4" mb={9}>
          {subscriptions?.map((subscription) => (
            <Subscription
              key={subscription?.subscriptionId}
              planName={subscription.planName}
              maxUsers={subscription.maxUsers}
              amount={subscription.price}
              planDescription={subscription.planDescription}
              duration={subscription.duration}
              selectedSubscription={selectedSubscription}
              // setSelectedSubscription={setSelectedSubscription}
              setSelectedSubscription={() => handleSubscriptionClick(subscription)}
              subscription={subscription}
              buttonText={'Subscribe'}
            // buttonAction={() => handleSubscriptionClick(subscription)}
            // planOnClick={() => {

            // }}
            />
          ))}
          {/* <Subscription />
          <Subscription />
          <Subscription />
          <Subscription /> */}
        </Box>
        {/* {selectedSubscription ? 
        <ButtonInput
          type="button"
          text={`Start Your ${selectedSubscription?.planName}`}
          fontSize={16}
          styles={{ maxWidth: '250px', height: '48px' }}
          disabled={false}
          loading={loading}
          onClick={() => {
            setLoading(true);
            console.log('clicked');
            window.location.href = "/signup?signin"
            sessionStorage.removeItem('phoneNumber')
          }}
        /> : null} */}
       {selectedSubscription && (
          <ButtonInput
            type="button"
            text={`Start Your ${selectedSubscription?.planName}`}
            fontSize={16}
            styles={{ maxWidth: '250px' }}
            disabled={loading}
            loading={loading}
            onClick={handlePaymentGateway}
          />
        )}
      </Box>
    </Box>
  );
};

export default Subscriptions;
