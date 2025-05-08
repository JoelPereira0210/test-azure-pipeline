'use client'
import { Footer } from '@/src/component/UI/Footer/Foter'
import ProfileForm from '@/src/forms/ProfileForm'
import { Box } from '@mui/material'
import { MoreDetailsProvider } from '@/src/component/context/MoreDetails';
import React, { useEffect } from 'react'

const Page = () => {
  
  return (
    <MoreDetailsProvider> {/* Provider should wrap your components that use the context */}
      <Box>
        <ProfileForm />
        <Footer />
      </Box>
    </MoreDetailsProvider>
  )
}

export default Page;