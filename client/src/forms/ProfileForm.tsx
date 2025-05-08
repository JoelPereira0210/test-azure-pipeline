'use client';
import { useState, useEffect, useContext } from 'react';
import { Box, Grid, Typography, Card, Divider, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person'; // for Profile icon
import BusinessIcon from '@mui/icons-material/Business'; // for Society icon
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // for ">" icon
import ButtonInput from '../component/UI/Button/Button';
import { useRouter } from 'next/navigation';
import { societySuperAdminAccess } from '../actions/user';
import ChangePasswordModal from '../component/modals/ChangePasswordModal';
import { fetchLoggedInUserdata } from '../actions/auth';
import { useUser } from '../component/context/UserContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ChangeSuperAdminModal from '../component/modals/ChangeSuperAdmin';
import { fetchMembers } from '../actions/designation';
import UpdateBankDetails from '../component/modals/UpdateBankDetails';
import SocietySubscription from '../component/SocietySubscription';
import { getSocietyAction, societySubscriptionAction } from '../actions/society';
import toast from 'react-hot-toast';
import moment from 'moment';
import { TbEdit } from "react-icons/tb";

import UpdateMembership from '../component/modals/UpdateMembership';
import { checkSocietySuperAdmin, fetchBankDetails, fetchMembershipAmount } from '../actions/profile';
import { decryptValue } from '../utils/encryptiondecryption';
import AlertModal from '../component/UI/Popup/AlertPopUp';
import ChangeMobileNumberModal from '../component/modals/changeMobileNumber';
import { MoreDetailsProvider, MoreDetailsContext } from '../component/context/MoreDetails';
import { PaymentContext } from '../component/context/PaymentContext';
export default function ProfileForm() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>('profile'); // Default is 'profile'
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showMobileNumberModal, setShowMobileNumberModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<string | null>(null);
  const [societyDetailsAccess, setSocietyDetailsAccess] = useState<
    boolean | null
  >(true);
  const[profileT,setProfileT]=useState(false)
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    // Check the `flow` value from localStorage and set state
    const role = localStorage.getItem('flow');
    setIsAdmin(role === 'admin');
  }, []);
  useEffect(() => {
    const profile = sessionStorage.getItem('profile');
    if (profile) {
      setProfileT(true)
    } }, []);

  const [isSubscriptionExpanded, setIsSubscriptionExpanded] = useState(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([])
  const [societyId, setSocietyId] = useState('')
  const[showAlertModal,setShowAlertModal]=useState(false)


    const {
      setPaymentItemAmount,
    } = useContext(PaymentContext);
    
  useEffect(() => {
    const societyId = localStorage.getItem('societyId')
    setSocietyId(decryptValue(societyId))
    if (societyId) {
      societySubscription();
    }
  }, [societyId])
  const societySubscription = async () => {
    try {
      if(societyId){

      
      const subscriptionData = await societySubscriptionAction(societyId);
      console.log("subscriptionData:", subscriptionData)
      setSubscriptionData(subscriptionData?.societySubscription)
      }
     
    } catch (error) {
      toast.error('Something went wrong please reload the page')
    }
  }
  const { showMoreDetails } = useContext(MoreDetailsContext); // Access the context value

  // Log the value of showMoreDetails when the component mounts or updates
  useEffect(() => {
    console.log('showMoreDetailsin:', showMoreDetails);

    // If showMoreDetails is true, handle the logic based on societyDetailsAccess and isAdmin
    if (showMoreDetails) {
      if (societyDetailsAccess && isAdmin) {
        setSelected('society'); // If both are true, set selected to 'society'
      } else if (!societyDetailsAccess && !isAdmin) {
        setSelected('society-non-admin'); // If societyDetailsAccess is true but isAdmin is false, set selected to 'society-non-admin'
      }
    }
    
  }, [showMoreDetails, societyDetailsAccess, isAdmin,profileT]);



  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [membershipAmount, setMembershipAmount] = useState();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const toggleSubscription = () => {
    setIsSubscriptionExpanded((prev) => !prev);
  };

  const membershipStatus= localStorage.getItem('membershipStatus'); 

console.log("membershipStatus",membershipStatus)
  const handleSuperAdminAccessClick = () => {
    setShowSuperAdminModal(true);
  };

  const handleBankDetailsClick = () => {
    setShowBankDetailsModal(true);
  };


  const { user } = useUser();

  const handleClick = (section: string) => {
    setSelected(section);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLoggedInUserdata();
      setUserData(data); // Set the fetched data to state

      if (data) {
        setUserId(data.userId); // Store userId in state
      }

      const isSuperAdmin = await checkSocietySuperAdmin(data?.userId);
      console.log('Is user a societySuperAdmin:', isSuperAdmin);
      setSocietyDetailsAccess(isSuperAdmin);
    };

    fetchData();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMembershipAmount({ amount: 0 }); // Pass default data as needed

        console.log('Full response:', response); // Log the entire response for debugging

        if (response?.success) {
          console.log('Fetched membership data:', response.data); // Log entire data object
          setMembershipAmount(response.data.data.membershipFeeAmount)
        } else {
          console.log('Response was not successful:', response); // Log the entire response for debugging
        }
      } catch (error) {
        console.error('Error fetching membership data:', error); // Log any fetch error
      }
    };

    fetchData();
  }, []);
  const updateMembershipAmount = (newAmount) => {
    setMembershipAmount(newAmount); // Update the local state with the new amount
  };



  // const handleMembershipClick = () => {
  //   setShowMembershipModal(true)

  // };
  const handleMembershipClick = async () => {
    try {
      const bankDetails = await fetchBankDetails(); // Fetch bank details
  
     console.log("baaan",bankDetails)
  
      // If bank details exist, open the membership modal
      setShowMembershipModal(true);
  
    } catch (error) {
      setShowAlertModal(true)

      
    }
  };
  console.log("sss",showAlertModal)

  
 const [societyData, setSocietyData] = useState(null);
 const [editSocietyData,setEditSocietyData]=useState(false)
 
const handleEditSocietyNameClick =()=>{
  setEditSocietyData(true)
  router.push('/update-society-details');
}
  useEffect(() => {
    const encryptedId = localStorage.getItem('societyId');
    const societyID = decryptValue(encryptedId);
    const getSociety = async () => {
      try {
        // Fetch society details using decryptedValues.societyId
        const values = await getSocietyAction(societyID);
        setSocietyData(values.data.society);
        // setSocietyLogo(values.data.societyLogo);
        console.log('VALUES EFFECT', values);
      } catch (error) {
        console.error('Error fetching society details:', error);
      }
    };

    if (societyID) {
      getSociety(); // Fetch society data
    }
  }, []);
  console.log('societyData in profile', societyData);
  console.log("membership amount in state", membershipAmount)
  const handleProfileUpdateClick = () => {
    router.push('/user-detail');
  };
const handleMemberhsipPayment=()=>{
  setPaymentItemAmount(membershipAmount);
  router.push('/membership-checkout') 
}
  const handlePasswordUpdateClick = () => {
    setShowChangePasswordModal(true);
  };
  const handleMobileNumber=()=>{
    setShowMobileNumberModal(true)
  }

  

  const updateButton = 'Update';
  const changeButton = 'Change';

  const truncateName = (name, maxLength) => {
    if (name?.length > maxLength) {
      return `${name?.slice(0, maxLength - 1)}.`; // Truncate and add a pointer
    }
    return name;
  };

  return (
    <>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      {/* <Box sx={{ width: 'calc(100% - 240px)' }}> */}
      <Box
        sx={{
          width: {
            xs: 'none',
            sm: 'none',
            md: 'calc(100% - 240px)',
            lg: 'calc(100% - 240px)',
          },
        }}
      >
        <Box
          sx={{
            border: '1px solid #9C9AA533',
            // height: '38rem',
            height: 'auto',
            // width: '80%',
            // width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
            textAlign: 'center',
            padding: '2rem',
            borderRadius: '0.8rem',
            // marginLeft: '18%',
            marginLeft: '0',
            marginTop: '0rem',
            position: 'relative',
            // '@media (min-width:768px)': {
            //   marginLeft: '18%',
            //   padding: '4rem',
            //   height: '38rem',
            // }
          }}
        >
          {user && (
            <Grid container spacing={2} sx={{ width: '100%' }}>
              {/* Sidebar Menu */}
              <Grid item xs={12} md={6}>
                <Box
                  component="nav"
                  sx={{
                    width: '100%',
                    marginBottom: '2rem',
                    marginLeft: '0',

                  }}
                >
                  {/* User Profile Section */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      // border: '1px solid #ddd',
                      borderRadius: '8px',
                      // marginTop: '-10rem',
                      p: 2,
                      mb: 2,
                      cursor: 'pointer',
                      backgroundColor:
                        selected === 'profile'
                          ? (mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-dark-sidebar)') : 'transparent',


                    }}
                    onClick={() => handleClick('profile')}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '4%',
                        fontSize: '20px',
                        color: selected === 'profile'
                          ? (mode === 'light' ? 'white' : 'var(--tw-bg-dark-main)')
                          : (mode === 'light' ? 'var(--tw-text-light-smallText)' : 'white'),

                      }}
                    >
                      <PersonIcon
                        sx={{
                          color: selected === 'profile'
                            ? (mode === 'light' ? 'white' : 'var(--tw-bg-dark-main)')
                            : (mode === 'light' ? 'var(--tw-text-light-smallText)' : 'white'),
                        }}
                      />
                    {/*   <Typography variant="body1" fontWeight={600} sx={{ ml: 1 }}>
                      {`${user.firstName} ${user.lastName}`}
                      </Typography> */}
                      <Typography variant="body1" fontWeight={600} sx={{ ml: 1 }}>
                       {`${truncateName(user?.firstName, 12)} ${truncateName(user?.lastName, 12)}`}
                        </Typography>
                    </Box>
                    <ChevronRightIcon
                      sx={{
                        color: selected === 'profile'
                          ? (mode === 'light' ? 'white' : 'var(--tw-bg-dark-main)')
                          : (mode === 'light' ? 'var(--tw-text-light-smallText)' : 'white'),
                      }}
                    />
                  </Box>
                  {societyDetailsAccess && isAdmin &&(
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        // border: '1px solid #ddd',
                        borderRadius: '8px',
                        p: 2,
                        cursor: 'pointer',
                        backgroundColor: selected === 'society' ? (mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-dark-sidebar)') : 'transparent',

                      }}
                      onClick={() => handleClick('society')}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          marginLeft: '4%',
                          color: selected === 'society'
                            ? (mode === 'light' ? 'white' : 'var(--tw-bg-dark-main)')
                            : (mode === 'light' ? 'var(--tw-text-light-smallText)' : 'white'),
                        }}
                      >
                        <BusinessIcon
                          sx={{
                            color: selected === 'society'
                              ? (mode === 'light' ? 'white' : 'var(--tw-bg-dark-main)')
                              : (mode === 'light' ? 'var(--tw-text-light-smallText)' : 'white'),
                          }}
                        />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                     {/*    {societyData?.societyName} */}
                     {`${truncateName(societyData?.societyName, 27)}`}
                        </Typography>
                      </Box>
                      <ChevronRightIcon
                        sx={{
                          color: selected === 'society'
                            ? (mode === 'light' ? 'white' : 'var(--tw-bg-dark-main)')
                            : (mode === 'light' ? 'var(--tw-text-light-smallText)' : 'white'),
                        }}
                      />
                    </Box>
                  )}
                  {/* Society Details Section */}
                  {!societyDetailsAccess && !isAdmin &&(
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        // border: '1px solid #ddd',
                        borderRadius: '8px',
                        p: 2,
                        cursor: 'pointer',
                        backgroundColor: selected === 'society-non-admin' ? (mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-dark-sidebar)') : 'transparent',

                      }}
                      onClick={() => handleClick('society-non-admin')}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          marginLeft: '4%',
                          color: selected === 'society'
                            ? (mode === 'light' ? 'white' : 'var(--tw-bg-dark-main)')
                            : (mode === 'light' ? 'var(--tw-text-light-smallText)' : 'white'),
                        }}
                      >
                        <BusinessIcon
                          sx={{
                            color: selected === 'society-non-admin'
                              ? (mode === 'light' ? 'white' : 'var(--tw-bg-dark-main)')
                              : (mode === 'light' ? 'var(--tw-text-light-smallText)' : 'white'),
                          }}
                        />
                        <Typography variant="body1" sx={{ ml: 1 }}>
                     {/*    {societyData?.societyName} */}
                     {`${truncateName(societyData?.societyName, 35)}`}
                        </Typography>
                      </Box>
                      <ChevronRightIcon
                        sx={{
                          color: selected === 'society-non-admin'
                            ? (mode === 'light' ? 'white' : 'var(--tw-bg-dark-main)')
                            : (mode === 'light' ? 'var(--tw-text-light-smallText)' : 'white'),
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Form Content Section */}
              <Grid item xs={12} md={6}>
                {selected === 'profile' && (
                  <Card
                    sx={{
                      p: 4,
                      width: '100%',
                      backgroundColor: `${mode === 'light' ? '#1F64FF40' : '#1D1C23'
                        }`,
                      border: 'none',
                      borderRadius: '8px',
                      '@media (min-width:768px)': {
                        width: '405px',textAlign:"left",
                      },
                    }}
                  >
                    {/* User Profile Content */}
                    <Typography variant="text3" fontWeight={600} gutterBottom>
                     {/*   {`${user.firstName} ${user.lastName}`} */}
                     {`${truncateName(user?.firstName, 12)} ${truncateName(user?.lastName, 12)}`}
                    </Typography>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={2}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          style={{ fontSize: '16px' }}
                        >
                          Profile
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ fontSize: '16px' }}
                        >
                         {/*  {user.firstName} {user.lastName} */}
                         {`${truncateName(user?.firstName, 12)} ${truncateName(user?.lastName, 12)}`}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ fontSize: '16px' }}
                        >
                          {user.phoneNumber}
                        </Typography>
                      </Box>
                      <ButtonInput
                        type='submit'
                        text={updateButton}
                        fontSize={14}
                        onClick={handleProfileUpdateClick}
                        fontWeight={1}
                        styles={{
                          flex: 1,
                          backgroundColor: '#465FF1',
                          maxWidth: '90px',
                          marginTop: '0',
                          // '@media (min-width:768px)': { marginTop: '-2rem' },
                        }}
                      />
                    </Box>

                    <Divider
                      sx={{
                        mt: 2,
                        borderWidth: '1.5px',
                        borderColor: `${mode === 'light' ? 'black' : 'white'}`,
                        marginTop: '2rem',
                        color: `${mode === 'light' ? 'black' : 'white'}`

                      }}
                    />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      style={{ fontSize: '16px', marginTop: '2rem' }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        style={{ marginTop: '0' }}
                      >
                        Change Password
                      </Typography>
                      <ButtonInput
                        text={changeButton}
                        type='submit'
                        onClick={handlePasswordUpdateClick}
                        fontSize={14}
                        fontWeight={1}
                        styles={{
                          flex: 1,
                          backgroundColor: '#465FF1',
                          maxWidth: '90px',
                          // marginTop: '0',
                          // '@media (min-width:768px)': { marginTop: '-2rem' },
                        }}
                      />
                    </Box>

                    <Divider
                      sx={{
                        mt: 2,
                        borderWidth: '1.5px',
                        borderColor: `${mode === 'light' ? 'black' : 'white'}`,
                        marginTop: '2rem',
                      }}
                    />


                    
<Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      style={{ fontSize: '16px', marginTop: '2rem' }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        style={{ marginTop: '0' }}
                      >
                        Change Mobile Number
                      </Typography>
                      <ButtonInput
                        text={changeButton}
                        type='submit'
                        onClick={handleMobileNumber}
                        fontSize={14}
                        fontWeight={1}
                        styles={{
                          flex: 1,
                          backgroundColor: '#465FF1',
                          maxWidth: '90px',
                          // marginTop: '0',
                          // '@media (min-width:768px)': { marginTop: '-2rem' },
                        }}
                      />
                    </Box>

                    <Divider
                      sx={{
                        mt: 2,
                        borderWidth: '1.5px',
                        borderColor: `${mode === 'light' ? 'black' : 'white'}`,
                        marginTop: '2rem',
                      }}
                    />
{membershipStatus === 'unpaid' && (
<Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      style={{ fontSize: '16px', marginTop: '2rem' }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        style={{ marginTop: '0' }}
                      >
                        Membership Fee
                      </Typography>
                      <ButtonInput
                        text="Pay"
                        type='submit'
                        onClick={handleMemberhsipPayment}
                        fontSize={14}
                        fontWeight={1}
                        styles={{
                          flex: 1,
                          backgroundColor: '#465FF1',
                          maxWidth: '90px',
                          // marginTop: '0',
                          // '@media (min-width:768px)': { marginTop: '-2rem' },
                        }}
                      />
                    </Box>)}
                  </Card>
                )}

                {selected === 'society' && societyDetailsAccess && (
                  <Card
                    sx={{
                      p: 4,
                      width: '100%',
                      backgroundColor: `${mode === 'light' ? '#1F64FF40' : '#1D1C23'
                        }`,
                      border: 'none',
                      borderRadius: '8px',
                      '@media (min-width:768px)': {
                        width: '405px',textAlign:"left",
                      },
                    }}
                  >
                    {/* <Typography variant="text3" fontWeight={600} gutterBottom>
                    {societyData.societyName}
                    </Typography> */}
                     <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
  >
    <Typography variant="text3" fontWeight={600} gutterBottom>
      {/* {societyData?.societyName} */}
      {`${truncateName(societyData?.societyName, 27)}`}
    </Typography>
    <IconButton
      onClick={handleEditSocietyNameClick} // Add your edit click handler here
      sx={{
        color: `${mode === 'light' ? '#000' : '#fff'}`,marginTop:"-2%"
      }}
    >
      <TbEdit/> {/* Import and use an edit icon from Material UI */}
    </IconButton>
  </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={2}
                    >
                      <Typography variant="text8" fontWeight={700} sx={{ marginRight: '2%' }} >
                        Super Admin Access
                      </Typography>

                      <ButtonInput
                        type='submit'
                        onClick={handleSuperAdminAccessClick}
                        disabled={false}
                        text={changeButton}
                        fontSize={14}
                        fontWeight={1}
                        styles={{
                          flex: 1,
                          backgroundColor: '#465FF1',
                          maxWidth: '90px',
                        }}
                      />
                    </Box>

                    <Divider
                      sx={{
                        mt: 2,
                        borderWidth: '1.5px',
                        borderColor: `${mode === 'light' ? 'black' : 'white'}`,
                      }}
                    />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={2}
                    >
                      <Box display="flex"
                        flexDirection="column"
                        alignItems="flex-start"
                      >
                        <Typography variant="body1" fontWeight="bold">
                          Subscription
                        </Typography>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="text5" fontWeight={400}>
                            Expires on {moment(subscriptionData?.[0]?.subscriptionEndDate).format("MMM D YYYY")}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton onClick={toggleSubscription}>
                        <ExpandMoreIcon
                          sx={{
                            transform: isSubscriptionExpanded
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                          }}
                        />
                      </IconButton>
                    </Box>

                    {isSubscriptionExpanded && (
                      <SocietySubscription
                        subscriptionData={subscriptionData}
                      // planData={planData} 
                      />
                    )}

                    {!isSubscriptionExpanded && (
                      <>
                        <Divider
                          sx={{
                            mt: 2,
                            borderWidth: '1.5px',
                            borderColor: `${mode === 'light' ? 'black' : 'white'}`,
                          }}
                        />

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mt={2}
                        >
                          <Box>
                            <Typography variant="text8" fontWeight={700}>
                              Membership
                            </Typography>{' '}
                            <br />
                            <Typography variant="text5" fontWeight={400}>
                              Amount  ₹ {membershipAmount}
                            </Typography>
                          </Box>

                          <ButtonInput
                            text={updateButton}
                            fontSize={14}
                            type='submit'
                            fontWeight={1}
                            disabled={false}
                            onClick={handleMembershipClick}
                            styles={{
                              flex: 1,
                              backgroundColor: '#465FF1',
                              maxWidth: '90px',
                            }}
                          />
                        </Box>

                        <Divider
                          sx={{
                            mt: 2,
                            borderWidth: '1.5px',
                            borderColor: `${mode === 'light' ? 'black' : 'white'}`,
                          }}
                        />

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mt={2}
                        >
                          <Typography variant="body1" fontWeight="bold">
                            Bank Details
                          </Typography>
                          <ButtonInput
                            type="submit"
                            text={updateButton}
                            onClick={handleBankDetailsClick}
                            fontSize={14}
                            fontWeight={1}
                            styles={{
                              flex: 1,
                              backgroundColor: '#465FF1',
                              maxWidth: '90px',
                            }}
                          />
                        </Box>
                      </>
                    )}
                  </Card>
                )}


{selected === 'society-non-admin'  && (
                  // <Card
                  //   sx={{
                  //     p: 4,
                  //     width: '100%',
                  //     backgroundColor: `${mode === 'light' ? '#1F64FF40' : '#1D1C23'
                  //       }`,
                  //     border: 'none',
                  //     borderRadius: '8px',
                  //     '@media (min-width:768px)': {
                  //       width: '405px',
                  //     },
                  //   }}
                  // >
                  //   <Typography variant="text3" fontWeight={600} gutterBottom>
                  //     {societyData.societyName}
                  //   </Typography>

                   
                  

                    
                     

                    
                  //     <>
                        

                  //       <Box
                  //         display="flex"
                  //         justifyContent="space-between"
                  //         alignItems="center"
                  //         mt={2}
                  //       >
                  //        <Box sx={{ width: '100%', whiteSpace: 'nowrap' }}> 
                  //           <Typography variant="text8" fontWeight={700} >
                  //             Society Description
                  //           </Typography>{' '}
                  //           <br />
                  //           <Typography variant="text5" fontWeight={400}>
                  //           {societyData.description}
                  //           </Typography>
                  //         </Box>

                         
                  //       </Box>

                  //       <Divider
                  //         sx={{
                  //           mt: 2,
                  //           borderWidth: '1.5px',
                  //           borderColor: `${mode === 'light' ? 'black' : 'white'}`,
                  //         }}
                  //       />

                  //       <Box
                  //         display="flex"
                  //         justifyContent="space-between"
                  //         alignItems="center"
                  //         mt={2}
                  //       >
                  //        <Box sx={{ width: '100%', whiteSpace: 'nowrap' }}> 
                  //           <Typography variant="text8" fontWeight={700}>
                  //             Address
                  //           </Typography>{' '}
                  //           <br />
                  //           <Typography variant="text5" fontWeight={400} sx={{ wordWrap: 'break-word' }}>
                  //            {societyData.address}
                  //           </Typography>
                  //         </Box>
                         
                  //       </Box>
                  //     </>
                    
                  // </Card>
                  <Card
  sx={{
    p: 4,
    width: '100%',textAlign:"left",
    backgroundColor: `${mode === 'light' ? '#1F64FF40' : '#1D1C23'}`,
    border: 'none',
    borderRadius: '8px',
    '@media (min-width:768px)': {
      width: '405px',
    },
  }}
>
  <Typography variant="text3" fontWeight={600} gutterBottom >
 {/*    {societyData?.societyName} */}
 {`${truncateName(societyData.societyName, 30)}`}
  </Typography>
 

  <Box
    display="flex"
    flexDirection="column" // Stack content vertically
    justifyContent="flex-start"
    alignItems="flex-start"
    mt={2}
    sx={{
      width: '100%',
      whiteSpace: 'normal', // Ensures content breaks into the next line if needed
      textAlign: 'left', // Ensures text is aligned to the left even when wrapped to the next line
    }}
  >
<Typography variant="text8" fontWeight={700}>
  Society Description
</Typography>
    <Typography variant="text5" fontWeight={400} sx={{wordBreak:"break-all"}}>
      {societyData?.description}
    </Typography>
  </Box>

  <Divider
    sx={{
      mt: 2,
      borderWidth: '1.5px',
      borderColor: `${mode === 'light' ? 'black' : 'white'}`,
    }}
  />

  <Box
    display="flex"
    flexDirection="column" // Stack address vertically
    justifyContent="flex-start"
    alignItems="flex-start"
    mt={2}
    sx={{
      width: '100%',
      whiteSpace: 'normal', // Ensures content breaks into the next line if needed
      textAlign: 'left', // Ensures text is aligned to the left even when wrapped to the next line
    }}
  >
    <Typography variant="text8" fontWeight={700}>
      Address
    </Typography>
    <Typography variant="text5" fontWeight={400}  sx={{wordBreak:"break-all"}}>
      {societyData?.address}
    </Typography>
  </Box>
</Card>

                )}
              </Grid>
            </Grid>
          )}
          <ChangePasswordModal
            open={showChangePasswordModal}
            userId={userId}
            onClose={() => setShowChangePasswordModal(false)}
          />
           <ChangeMobileNumberModal
            open={showMobileNumberModal}
            userId={userId}
            onClose={() => setShowMobileNumberModal(false)}
          />
          {showSuperAdminModal && (
            <ChangeSuperAdminModal
              open={showSuperAdminModal}
              onClose={() => setShowSuperAdminModal(false)}
              LoggedInUserId={userId}
            />
          )}
          {showBankDetailsModal && (
            <UpdateBankDetails
              open={showBankDetailsModal}
              onClose={() => setShowBankDetailsModal(false)}
            />
          )}
          {showMembershipModal && (
            <UpdateMembership open={showMembershipModal} onClose={() => setShowMembershipModal(false)} membershipAmount={membershipAmount} onUpdate={updateMembershipAmount} />
          )}
        </Box>
      </Box>
    </Box>

    <AlertModal
        open={showAlertModal}
        onClose={onclick=()=>{setShowAlertModal(false)}}
        title="Please add bank details before updating membership amount."
        buttonText="Close"
      />
      </>
  );
}