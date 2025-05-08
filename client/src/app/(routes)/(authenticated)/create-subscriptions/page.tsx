'use client';

import React, { useState, useEffect, useContext } from 'react';
import CreateEventForm from '@/src/forms/CreateEventForm';
import { fetchEventData } from '@/src/actions/createevent';
import { EventContext } from '@/src/component/context/EventContext';
import { EventProvider } from '@/src/component/context/EventContext';
import '@/src/app/(routes)/(authenticated)/events/style.scss';

import { Box, CircularProgress, Typography } from '@mui/material';
import BaseContainer from '@/src/component/UI/Basecontainer';
import ButtonInput from '@/src/component/UI/Button/Button';
import SubscriptionModal from '@/src/component/modals/SubscriptionModal';
import { SubscriptionsContext } from '@/src/component/context/SubscriptionContext';
import { getSubscriptionsAction } from '@/src/actions/superAdmin';
import Subscription from '@/src/component/UI/Subscription';
import Tabs from '@/src/component/Tabs/ViewTab';

const CreateSubscriptions: React.FC = () => {
    // const [createSubscription, setCreateSubscription] = useState(false);
    const [subscriptionPresent, setSubscriptionPresent] = useState(true); // Indicates if events are present
    const [showPopup, setShowPopup] = useState(false);
    const [step, setStep] = useState(1)
    const [subscriptions, setSubscription] = useState([]);
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const { createSubscription, setCreateSubscription, setSubscriptionActionType, SubscriptionActionType, setSubscriptionId, subscriptionActionType, editSubscriptionData, setEditSubscriptionData, fetchData, setFetchData } = useContext(SubscriptionsContext);
    // const [eventActionType, setEventActionType] = useState('edit event');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (fetchData) {
            fetchSubscriptions();
        }
    }, [fetchData])

    useEffect(() => {
        fetchSubscriptions();
    }, [])
    const fetchSubscriptions = async () => {
        try {
            // switch (step) {
            //     case 1: {
            const activeSubscription = await getSubscriptionsAction('active');
            //     break;
            // }
            // case 2: {
            const draftSubscription = await getSubscriptionsAction('draft');
            //     break;
            // }
            // case 3: {
            const deletedSubscription = await getSubscriptionsAction('deleted');
            //     break;
            // }
            // default: {
            // activeSubscription = await getSubscriptionsAction('');
            //         break;
            //     }
            // }
            // console.log("active", activeSubscription)
            // console.log("draftSubscription", draftSubscription)
            // console.log("deletedSubscription", deletedSubscription)
            if (activeSubscription.length > 0 || draftSubscription.length > 0 || deletedSubscription.length > 0) {
                setSubscriptionPresent(true)
            } else {
                setSubscriptionPresent(false)
            }
        } catch (error) {
            console.log("error while fetching", error)
        } finally {
            setFetchData(false)
        }

    }
    const fetchCurrentSubscriptions = async () => {
        try {
            let activeSubscription;
            console.log("step", step)
            switch (step) {
                case 1: {
                    activeSubscription = await getSubscriptionsAction('active');
                    break;
                }
                case 3: {
                    activeSubscription = await getSubscriptionsAction('draft');
                    break;
                }
                case 4: {
                    activeSubscription = await getSubscriptionsAction('deleted');
                    break;
                }
                default: {
                    activeSubscription = await getSubscriptionsAction('');
                    break;
                }
            }
            console.log("XXX", activeSubscription)
            setSubscription(activeSubscription)
        } catch (error) {
            console.log("error while fetching", error)
        } finally {
            setFetchData(false)
        }

    }
    useEffect(() => {
        fetchCurrentSubscriptions()

    }, [step, fetchData])
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
    const handleSubscriptionClick = (subscription) => {
        console.log("subscription", subscription)
        // Toggle selection if already selected, else set new selection
        setSelectedSubscription(prev => (prev === subscription ? null : subscription));
    };
    console.log("object", selectedSubscription)
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            // position: "relative",
        }}>

            {createSubscription ? (
                <>
                    <SubscriptionModal
                        open={createSubscription}
                        onClose={() => setCreateSubscription(false)}
                        buttonOneText={'Save Draft'}
                        buttonOneAction={() => { }}
                        buttonTwoText={'Delete'}
                        buttonTwoAction={() => { }}
                        buttonThreeText={"Publish"}
                        buttonThreeAction={() => { }}
                    />

                    {/* // </Box> */}
                </>
            ) :
                subscriptionPresent ? (
                    <Box className="events-first-parent-container"
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

                        <Tabs step={step} setStep={setStep} tabBtnTxt="Create Subscription" actionType="subscription" />
                        {/* <ViewEventTab step={step} setStep={setStep} tabBtnTxt="Create Subscription" actionType="charge" /> */}
                        {subscriptions.length > 0 ? (<Box className="flex flex-wrap gap-4" mb={9}>
                            {subscriptions?.map((subscription) => (
                                <Subscription
                                    planName={subscription.planName}
                                    maxUsers={subscription.maxUsers}
                                    amount={subscription.price}
                                    planDescription={subscription.planDescription}
                                    duration={subscription.duration}
                                    buttonText={'Edit'}
                                    
                                    buttonAction={() => {
                                        setEditSubscriptionData(subscription)
                                        setCreateSubscription(true)
                                    }}
                                    setSelectedSubscription={() => handleSubscriptionClick(subscription)}

                                />
                            ))}
                        </Box>) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '50vh',
                                }}
                            >
                                <Box component="img" src={'/images/Frame.png'} alt="No subscriptions available" />
                                <Typography variant="text12" sx={{ color: 'gray' }}>No subscriptions available</Typography>
                            </Box>
                        )}
                    </Box>
                ) : (
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
                        <BaseContainer
                            text="No Subscriptions"

                        >
                            <ButtonInput
                                type='button'
                                text='Create Subscriptions'
                                onClick={() => {
                                    setCreateSubscription(true); // Show CreateEventForm when "Create Event" is clicked
                                }}
                                disabled={false}
                                loading={false}
                                styles={{ maxWidth: '230px' }}
                            />
                        </BaseContainer>
                    </Box>)
            }
        </Box >

    );
};

export default CreateSubscriptions;