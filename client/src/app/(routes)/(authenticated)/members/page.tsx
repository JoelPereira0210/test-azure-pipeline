'use client';
import AddMembers from '@/src/component/modals/AddMembers';
import BaseContainer from '@/src/component/UI/Basecontainer';
import ButtonInput from '@/src/component/UI/Button/Button';
import FilterTable from '@/src/component/UI/TableHeader/FilterListTableHeader';
import { Box } from '@mui/material';
import { useContext, useEffect } from 'react';
import MemberListDisplay from '@/src/component/MemberListDispay';
import { MemberContext } from '@/src/component/context/MemberContext';
import './style.scss';
import PersonalInformation from '@/src/component/PersonalInformation';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import React, { useState } from 'react';
import ViewMemberDetails from '@/src/component/ViewMemberDetails';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthCookie } from '@/src/actions/api';
import { fetchLoggedInUserdata, setRoleAction } from '@/src/actions/auth';
import { encryptValue } from '@/src/utils/encryptiondecryption';
import { setSocietyIdInLocalStorage } from '@/src/utils/auth';

type Props = {};
const containerText = 'No Members Added'; // This is the prop
const buttonText = 'Add New Members';
const modalButtonAddText = 'Add';
const modalButtonCancelText = 'Cancel';
const Members = (props: Props) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    setToken();
  }, [])
  const setToken = async () => {
    const token = searchParams.get('token');
    const subDomain = searchParams.get('subDomain');
    const societyId = searchParams.get('societyId');
    console.log("societyId Params", societyId)
    const role = await localStorage.getItem('flow')

    if (token && subDomain && societyId) {
      await setSocietyIdInLocalStorage({ societyName: subDomain, societyId: societyId })

      await setAuthCookie(token, subDomain, societyId)
      await fetchLoggedInUserdata();
      if (!role) {
        await setRoleAction();
      }
    }
  }
  const {
    viewMembersForm,
    setViewmembersForm,
    MemberActionType,
    setMemberActionType
    , contextUserId, setContextUserId
  } = useContext(MemberContext);
  const [showAddMembers, setShowAddMembers] = useState(false);

  const handleDesigClick = () => {
    setShowAddMembers(!showAddMembers);
  };


  return (
    <>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',

        }}
      >
        <Box
          sx={{
            width: 'calc(100% - 240px)',
            '@media (max-width:767px)': {
              width: '100%'
            },
          }}
        >
          {viewMembersForm ? <ViewMemberDetails /> : <MemberListDisplay />}
        </Box>
      </Box>
    </>
  );
};

export default Members;
