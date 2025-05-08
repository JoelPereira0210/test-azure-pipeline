import { Box, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { MemberContext } from '@/src/component/context/MemberContext';
import { fetchMemberData } from '../actions/addMembers';

const PersonalInformation = () => {
  const {
    viewMembersForm,
    setViewmembersForm,
    MemberActionType,
    setMemberActionType,
    contextUserId, setContextUserId
  } = useContext(MemberContext);

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    console.log("Current User ID in personal:", contextUserId);
    if (contextUserId) {
      const fetchData = async () => {
        try {
          const response = await fetchMemberData(contextUserId); // Call fetchMemberData with contextUserId
          setUserData(response);
          console.log("data in personal", response);
          if (response.status === 203) {
            console.log("User not found"); // Log "User not found" if status is 203
          }
        } catch (error) {
          console.error("Error fetching member data:", error);
        }
      };

      fetchData(); // Execute the fetch function
    }
  }, [contextUserId]);
  console.log("userData", userData);

  // Destructure values from userData or provide default values if userData is not available
  const {
    firstName = '',
    lastName = '',
    phoneNumber = '',
    isAdmin = false,designationName=""
  } = userData || {};

  return (
    <Box>
      {/* Flex container with column direction for vertical alignment */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: "17%", marginTop: '16px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* First Name */}
          <Typography color="textSecondary" variant="text10" fontWeight={600} sx={{ marginBottom: '8px' }}>
            First Name
          </Typography>
          <Typography variant="body1" gutterBottom>{firstName}</Typography>

          {/* Mobile Number */}
          <Typography variant="text10" fontWeight={600} color="textSecondary" sx={{ marginTop: '16px', marginBottom: '8px' }}>
            Mobile Number
          </Typography>
          <Typography variant="body1" gutterBottom>{phoneNumber}</Typography>

          <Typography variant="text10" fontWeight={600} color="textSecondary" sx={{ marginTop: '16px', marginBottom: '8px' }}>
            Designation
          </Typography>
          <Typography variant="body1" gutterBottom>{designationName}</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Last Name */}
          <Typography variant="text10" fontWeight={600} color="textSecondary" sx={{ marginBottom: '8px' }}>
            Last Name
          </Typography>
          <Typography variant="body1" gutterBottom>{lastName}</Typography>

          <Typography variant="text10" fontWeight={600} color="textSecondary" sx={{ marginTop: '16px', marginBottom: '8px' }}>
            Gender
          </Typography>
          <Typography variant="body1" gutterBottom>{userData?.gender || 'N/A'}</Typography>

          {/* Designation */}
          <Typography variant="text10" fontWeight={600} color="textSecondary"sx={{ marginTop: '16px', marginBottom: '8px' }}>
          Admin Access
        </Typography>
        <Typography variant="body1">{isAdmin ? 'Yes' : 'No'}</Typography>
        </Box>
      </Box>

    
    </Box>
  );
};

export default PersonalInformation;
