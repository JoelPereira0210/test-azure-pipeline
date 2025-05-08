import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import React, { useState } from 'react'
import DoneIcon from '@mui/icons-material/Done';
import ButtonInput from './Button/Button';
import { usePathname } from 'next/navigation';
type Props = {
    buttonText: string;
    buttonAction?: () => void;
    planName: string;
    maxUsers: string;
    amount: string;
    planDescription: string;
    duration: string;
    // planOnClick?: () => void;
    subscription?: any;
    selectedSubscription?: any | null;
    setSelectedSubscription?: (obj: object) => void;
}

const Subscription = ({
    buttonText,
    buttonAction,
    planName,
    maxUsers,
    amount,
    planDescription,
    duration,
    // planOnClick,
    subscription,
    selectedSubscription,
    setSelectedSubscription
}: Props) => {
    console.log("isSelected", subscription)
    const pathname = usePathname();
    console.log("pathane,", pathname)
    const isSelected = selectedSubscription?.subscriptionId === subscription?.subscriptionId
    return (
        <Box sx={{
            padding: '35px',
            width: '290px',
            height: '564px',
            borderRadius: "10px",
            background: `${isSelected ? 'var(--tw-bg-light-main)' : "var(--Secondary-2, #FFF)"}`,
            // boxShadow: "-30px 6px 70px 0px rgba(0, 0, 0, 0.20)",
            boxShadow: "-30px 6px 70px 0px rgba(0, 0, 0, 0.20)",
            '@media(max-width:768px)': {
                width: '100%',
            },
            cursor: `pointer`
        }}
            className="flex flex-col justify-between"
            onClick={() => setSelectedSubscription(subscription)}
        >
            <Box className="flex flex-col" >
                <Typography color={`${isSelected ? 'var(--tw-text-dark-mainText)' : 'var(--tw-text-light-mainText)'}`} variant='text7' mb={3} fontWeight={600}>{planName}</Typography>
                <Typography variant='text1' color={`${isSelected ? 'var(--tw-text-dark-mainText)' : 'var(--tw-text-light-mainText)'}`}>&#8377; {amount}</Typography>
                <Typography variant='text7' color={`${isSelected ? 'var(--tw-text-dark-mainText)' : 'var(--tw-text-light-mainText)'}`} fontWeight={300} mb={2}>/ month</Typography>
                <Typography variant='text8' sx={{
                    maxWidth: '214px'
                }} color={`${isSelected ? 'var(--tw-text-dark-mainText)' : 'var(--tw-text-light-mainText)'}`}>{planDescription}</Typography>
                <List>
                    <ListItem sx={{
                        padding: '0',
                        marginBottom: '8px'
                    }}>

                        <DoneIcon style={{
                            color: `${!isSelected ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-sidebar)'}`
                        }} />
                        <ListItemText sx={{
                            marginLeft: '1rem',
                            color: `${isSelected ? 'var(--tw-text-dark-mainText)' : 'var(--tw-text-light-mainText)'}`

                        }}>{duration} Months</ListItemText>
                    </ListItem>
                    <ListItem sx={{
                        padding: '0'
                    }}>
                        <DoneIcon style={{
                            color: `${!isSelected ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-sidebar)'}`

                        }} />
                        <ListItemText sx={{
                            marginLeft: '1rem',
                            color: `${isSelected ? 'var(--tw-text-dark-mainText)' : 'var(--tw-text-light-mainText)'}`
                        }}>{maxUsers} Users</ListItemText>
                    </ListItem>
                </List>
            </Box>
            {pathname === '/subscriptions' ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '50px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: `${isSelected ? 'var(--tw-text-dark-mainText)' : 'var(--tw-bg-dark-main)'}`,

                }}>
                    <Typography variant="text8" color={`${!isSelected ? 'var(--tw-text-dark-mainText)' : 'var(--tw-bg-light-main)'}`} fontWeight={700} fontSize={16}>
                        Subscribe
                    </Typography>
                </Box>

            ) : <ButtonInput type='button' text={buttonText} styles={{
                height: '50px',
                background: `${isSelected ? 'var(--tw-text-dark-mainText)' : ''}`,
                color: `${!isSelected ? 'var(--tw-text-dark-mainText)' : 'var(--tw-bg-light-main)'}`
            }}
                disabled={false}
                onClick={buttonAction}
            />}
        </Box>
    )
}

export default Subscription