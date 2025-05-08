import { Box, Typography } from '@mui/material'
import React from 'react'

interface Props {
    societyName?: string
}

const WelcomeContainer = (props: Props) => {
    console.log("WELCOME", props)
    return (
        <Box sx={{
            backgroundImage: `linear-gradient(rgba(70, 95, 241, 0.37),rgba(70, 95, 241, 1)),url('/images/welcomeBg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white',
            textAlign: 'center',
            padding: '6.75rem',
            borderRadius: '1.25rem'
        }}>
            <Box className=" flex flex-col">
                <Typography variant='text9'>Welcome to  {props?.societyName ? `${props.societyName}` : 'Society'}</Typography>
                <Typography variant='text10'>Your Gateway to Effortless Management.</Typography>
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
                <Typography variant='text11' className=' m-5'>Seamless Collaboration </Typography>
                <Typography variant='text12'>Effortlessly work together with your member in real-time.</Typography>

            </Box>
        </Box>
    )
}

export default WelcomeContainer
