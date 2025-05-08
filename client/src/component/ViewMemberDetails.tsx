
'use client'
import { Box, useTheme } from '@mui/material';
import React, { useState, useContext, useEffect } from 'react';
import { CiEdit } from 'react-icons/ci';
import ButtonInput from './UI/Button/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MemberTab from './Tabs/MemberTab';
import { useRouter } from 'next/navigation';
import { MemberContext } from '@/src/component/context/MemberContext';
import PersonalInformation from './PersonalInformation';
import RegisteredEvent from './RegisteredEvent';
import MaintenanceFees from './MaintenanceFees';
import { fetchMemberData } from '../actions/addMembers';
import PersonaleInformatioEditForm from '../forms/PersonaleInformatioEditForm';


const ViewMemberDetails = () => {
  const router = useRouter();
  const theme = useTheme();
  const {
    viewMembersForm,
    setViewmembersForm,
    contextUserId,
    setStep,
    step, // Get step from context
  } = useContext(MemberContext);
  const [userData, setUserData] = useState<any>(null);
  const[superAdmin,setSuperAdmin]=useState(false)

  useEffect(() => {
    if (contextUserId) {
      const fetchData = async () => {
        try {
          const response = await fetchMemberData(contextUserId);
          setUserData(response);
          if(response.designationName === 'societySuperAdmin'){
            console.log("society super")
            setSuperAdmin(true)
          }
          if (response.status === 203) {
            console.log('User not found');
          }
        } catch (error) {
          console.error('Error fetching member data:', error);
        }
      };

      fetchData();
    }
  }, [contextUserId]);
  console.log("isAdmin:", userData?.isAdmin);
  console.log("data user",userData)
  
  console.log("data userss",superAdmin)
  

  return (
    <Box>
      <ArrowBackIcon
        fontSize="large"
        onClick={() => {
          if (step === 4) {
            setStep(1); // If the current step is 4, go back to step 1
          } else {
            setViewmembersForm(false); // Otherwise, close the view
          }
        }}
      />
      <Box>
        {step !== 4 && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              padding: '1rem',
              border: '1px solid #9C9AA533',
              borderRadius: '8px',
              flexDirection: {
                xs: 'column',
                sm: 'column',
                md: 'row',
                lg: 'row',
                xl: 'row',
              },
            }}
          >
            <img
              src="/images/sidebarlogo.png"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '50%',
                marginRight: '1rem',
              }}
              alt="Profile"
            />
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: '#16151C',
                  fontSize: '24px',
                  fontWeight: '500',
                }}
              >
                {userData?.firstName} &nbsp;{userData?.lastName}
              </h3>
            </Box> 
            {userData?.membershipStatusId === "1" && !superAdmin && (
  <ButtonInput
    text="Manage Role"
    disabled={false}
    type="button"
    loading={false}
    icon={<CiEdit />}
    fontWeight={600}
    fontSize={13}
    styles={{
      maxWidth: '170px',
      wordBreak: 'break-word', 
    }}
    onClick={() => setStep(4)} // Update step to 4
  />
)}

          </Box>
        )}
        <Box>
          <MemberTab  />
          <Box>
            {step === 4 ? <PersonaleInformatioEditForm /> : step === 1 && <PersonalInformation />}
            {step === 2 && <RegisteredEvent />}
            {step === 3 && <MaintenanceFees />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewMemberDetails;
