import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Card, Divider, useTheme } from '@mui/material';
import ButtonInput from '../component/UI/Button/Button';
import { societySubscriptionAction } from '../actions/society';
import toast from 'react-hot-toast';
import { getSubscriptionsAction } from '../actions/superAdmin';
import moment from 'moment';

type Props = {
    subscriptionData: any[],
    // planData: any;
}

const SocietySubscription = ({ subscriptionData,
    // planData
}: Props) => {

    // console.log("subscriptionData", subscriptionData)
    // console.log("planData", planData)
    const [renewalDate, setRenewalDate] = useState(false);
    useEffect(() => {
        if (subscriptionData) {
            const endDate = moment(subscriptionData?.[0]?.subscriptionEndDate);
            const currentDate = moment();

            // Check if subscriptionEndDate is within 1 month or past the current date
            if (endDate.isSameOrBefore(currentDate.add(1, 'month'), 'day')) {
                setRenewalDate(true);
            } else {
                setRenewalDate(false);
            }
        }
    }, [subscriptionData]);
    return (
        <>
            <Divider
                sx={{
                    mt: 2,
                    borderWidth: '1.5px',
                    borderColor: '#000022',
                }}
            />

            <Box mt={2}>
                <Box
                    display="flex"
                    justifyContent="flex-start"
                    flexDirection="column"
                    alignItems="flex-start"
                >
                    {/* <Typography variant="body1" fontWeight="bold">
                    Current Plan
                </Typography> */}
                    <Typography variant="body1" fontWeight="bold">
                        {subscriptionData?.[0].subscriptionMaster?.planName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        &#8377;{subscriptionData?.[0].subscriptionMaster?.price}
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={2}
                >
                    <ButtonInput
                        text="Upgrade plan"
                        type='submit'
                        fontSize={14}
                        fontWeight={1}
                        styles={{
                            flex: 1,
                            backgroundColor: '#465FF1',
                            maxWidth: '160px',
                        }}
                    />
                    {renewalDate ? <ButtonInput
                        type='submit'
                        text="Renew plan"
                        fontSize={14}
                        fontWeight={1}
                        styles={{
                            flex: 1,
                            backgroundColor: '#465FF1',
                            maxWidth: '160px',
                            marginLeft: '1rem',
                        }}
                        onClick={() => {
                            // alert("KKKK")
                        }}
                    /> : null}
                </Box>
            </Box>

            <Divider
                sx={{
                    mt: 2,
                    borderWidth: '1.5px',
                    borderColor: '#000022',
                }}
            />

            {/* <Box mt={2}>
                <Typography variant="body1" fontWeight="bold">
                    Payment Method
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    ••••1234 (Expires 04/2022)
                </Typography>
                <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                >
                    + Add payment method
                </Typography>
            </Box> */}

            {/* <Divider
                sx={{
                    mt: 2,
                    borderWidth: '1.5px',
                    borderColor: '#000022',
                }}
            /> */}

            <Box
                display="flex"
                justifyContent="flex-start"
                flexDirection="column"
                alignItems="flex-start"
                mt={2}>
                <Typography variant="body1" fontWeight="bold">
                    Billing History
                </Typography>
                {/* <Typography variant="body2" color="textSecondary">
                    Dec 1, 2020 - Rs. 499 - 1 Year Plan
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Jan 1, 2021 - Rs. 499 - 1 Year Plan
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Feb 1, 2021 - Rs. 499 - 1 Year Plan
                </Typography> */}
                {subscriptionData?.map((subscription) => (
                    <>
                        <Typography variant="body2" color="textSecondary">
                            {/* Dec 1, 2020 - Rs. 499 - 1 Year Plan */}
                            {moment(subscription?.subscriptionStartDate).format("MMM D, YYYY")} - &#8377;{subscription?.subscriptionMaster?.price} - {subscription?.subscriptionMaster?.planName}
                        </Typography>
                    </>
                ))}
            </Box>
        </>
    )
}

export default SocietySubscription