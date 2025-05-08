"use client"
import React, { useContext, useEffect } from 'react'
import Image from 'next/image';
import { Box , Typography, useTheme} from '@mui/material';
import ButtonInput from '@/src/component/UI/Button/Button';
import { useState } from 'react';
import { PaymentContext } from '@/src/component/context/PaymentContext';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/component/context/UserContext';
 
const MembershipCheckoutPage = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(false);
  const {
    paymentItemAmount,
    setPaymentItemAmount,
    paymentItemName,
    setPaymentItemName,
    paymentItemId,
    setPaymentItemId,
    paymentItemSection,
    setPaymentItemSection,
    setEventRegistrationCount
  } = useContext(PaymentContext);
  console.log("datta",paymentItemAmount)
  const router = useRouter();



  return (
    <Box className={`flex  w-full min-h-[100vh] `}
    sx={{
      background: `${theme.palette.mode === 'light'
        ? 'var(--tw-bg-light-purpleBackground)'
        : 'var(--tw-bg-dark-background)'
        }`,
    }}
  >
    <Box className="flex flex-col justify-center items-center md:m-[20px] sm:m-[0px] w-full h-[100vh-20px]  rounded-2xl"
      sx={{
        background: `${theme.palette.mode === 'light'
          ? 'var(--tw-bg-light-background)'
          : 'var(--tw-bg-dark-background)'
          }`,
      }}
    >
      <Box className="flex flex-col justify-between items-center mt-20 mb-24 w-full max-w-[970px] max-h-[450px] h-full ">
        <Box className="flex flex-col justify-between items-center text-center">
          <Image
            src="/images/welcomeIcon.png"
            width={180}
            height={180}
            alt="Society Created"
          />
          <Typography variant="text1" marginTop={4} fontSize={24}>
          You have successfully created your password to complete registration
          and avail all the feature, you need to pay the membership fees
            </Typography>
            <Typography variant="text10" marginTop={2}   fontSize={24} fontWeight={700}>
            Membership Fees cost ₹ {paymentItemAmount}
            </Typography>
        </Box>
<Box sx={{display:"flex",gap:"20px"}}>
        <ButtonInput
          type="button"
          text="Pay Later"
          buttonBackgroundColor='none'
          buttonFontColor='black'
          borderColor='black'
          styles={{ width: '195px' }}
          disabled={false}
          loading={loading}
          onClick={() => {
            setLoading(true);
            
            router.push("/signup?signin")
          }}
        />
        <ButtonInput
          type="button"
          text="Pay Now"
          styles={{ width: '195px' }}
          disabled={false}
          loading={loading}
          onClick={() => {
            setLoading(true);
            setPaymentItemSection("membership");
            setPaymentItemName("Membership")
            router.push('/cart-checkout');
          }}
        />
        </Box>
      </Box>
    </Box>
  </Box>
  )
}
 
export default MembershipCheckoutPage