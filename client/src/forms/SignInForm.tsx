import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../lib/zod/auth';
import { LoginDataType as FormData } from '@/src/lib/types/registerNumber.types';
import {
  loginAction,
  fetchLoggedInUserdata,
  checkMembership,
} from '../actions/auth';
import { useRouter } from 'next/navigation';
import Button from '../component/UI/Button/Button';
import { Box, useMediaQuery } from '@mui/material';
import MobileInput from '../component/UI/MobileInput/MobileInput';
import InputField from '@/src/component/UI/InputField/InputField';
import toast from 'react-hot-toast';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setRoleAction } from '../actions/auth';
import { setSocietyIdInLocalStorage } from '../utils/auth';
import SocietySelectionModal from '../component/modals/SocietySelectionModal';
import { setAuthCookie } from '../actions/api';
type Props = {};

type Society = {
  societyId: string;
  societyName: string;
};
const SignInForm = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = React.useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);


  const [societies, setSocieties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);




  const isLargeScreen = useMediaQuery('(min-width:768px)');
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });


  const handleSocietySelection = async (society: Society, token?: any) => {
    const success = await setSocietyIdInLocalStorage(society);
    console.log("successs", success)
    if (success) {
      if (pendingToken || token) {
        // localStorage.setItem('authToken', pendingToken);
        console.log("SOCIETY", pendingToken)
        const data = { token: pendingToken ? pendingToken : token, subDomain: society?.societyName, societyId: society?.societyId };
        const queryString = new URLSearchParams(data).toString();
        // setAuthCookie(pendingToken, society?.societyName, society?.societyId)
        const formattedSocietyName = society?.societyName.replace(/[\s.]+/g, "-").toLowerCase();
        window.location.href = `https://${formattedSocietyName}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}/members?${queryString}`;

        // window.location.href = `http://${society?.societyName.toLowerCase()}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}/members?${queryString}`;
        // try {
        //   const roleSet = await setRoleAction();
        //   if (roleSet) {
        //     toast.success('Logged in successfully');
        //     window.location.href = '/members';
        //   } else {
        //     console.error('Failed to set the user role. Please try again.');
        //   }
        // } catch (error) {
        //   console.error('Error setting role:', error);
        // }
      }
    } else {
      toast.error('Failed to set the selected society. Please try again.');
    }
  };
  const handleModalSelect = async (society: Society) => {
    setShowModal(false); // Close the modal
    console.log("handleModalSelect societyId", society);
    await handleSocietySelection(society);


    // window.location.href = '/members'; // Redirect to members page
  };




  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: FormData) => {
    console.log('DATA', data);
    try {
      setLoading(true);
      const response: any = await loginAction(data);

      console.log('response SING', response);
      if (response.status === 200) {
        if (response.data.isSuperAdmin) {
          setAuthCookie(response?.data?.token);
          window.location.href = '/create-subscriptions';
        } else {
          // const loggedInUserData = await fetchLoggedInUserdata();
          // const roleSet = await setRoleAction();
          // const data = { token: response?.data?.token, subDomain: response?.data?.subdomain }; // Your data object
          // const queryString = new URLSearchParams(data).toString();
          // // console.log("AAAFSF", `http://${subDomain.toLowerCase()}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}/members?${queryString}`)
          // // Navigate using window.location.href
          // window.location.href = `http://${response?.data?.subdomain.toLowerCase()}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}/members?${queryString}`;
          // window.location.href = `/members?${queryString}`;


          const societies = response?.data?.societies;
          const token = response?.data?.token;
          console.log("Socie", societies)
          // console.log('societies:', JSON.stringify(societies, (key, value) =>
          //   typeof value === 'bigint' ? value.toString() : value
          // ));

          if (token) {
            await setPendingToken(token);
            // localStorage.setItem('authToken', token); // Store token in localStorage (or use cookies if necessary)

          }

          if (societies.length > 1) {
            // Multiple societies, show modal
            setSocieties(societies);
            setShowModal(true);
          } else if (societies.length === 1) {
            // Single society, set directly
            await handleSocietySelection(societies[0], token);

            // if (token) {
            //   localStorage.setItem('authToken', token); // Set authToken
            //   try {
            //     const roleSet = await setRoleAction();
            //     window.location.href = '/members'; // Navigate to the members page
            //   }
            //   catch (error) {
            //     console.error('Error setting role:', error);
            //   }
            // }

          } else {
            toast.error('No societies associated with this user.');
          }





          // const loggedInUserData = await fetchLoggedInUserdata();
          // const roleSet = await setRoleAction();
          // window.location.href = '/members';
        }
      }
    } catch (error) {
      console.error('Error', error);
    } finally {
      setLoading(false);
    }
  };
  // if(paid === 'yes'){
  //   alert("he is  admin")
  // }else if(paid === 'not'){
  //   alert("he is not admin")
  // }
  console.log('dddd', userData, userId);


  console.log("societies set by setState", societies);
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          ...(!isLargeScreen && {
            padding: '0 20px',
          }),
        }}
      >
        <Box
          sx={{
            marginBottom: '110px',
          }}
        >
          <Controller
            name="phone_number"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <MobileInput
                name={field.name}
                control={control}
                label="Mobile Number"
                required={true}
                placeholder="Mobile Number"
                // error={errors.phone_number?.message}
                error={errors.phone_number ? String(errors.phone_number.message) : undefined} // Cast to string or use undefined

                country="IN"
              />
            )}
          />
          {/* <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...field}
              required={true}
              placeholder="Password"
              icon={showPassword ? <VisibilityOff onClick={togglePasswordVisibility} sx={{ cursor: 'pointer' }}/> : <Visibility onClick={togglePasswordVisibility} sx={{ cursor: 'pointer' }}/>} 
              // error={errors.password?.message}
              errorMessage={errors.password ? String(errors.password.message) : undefined}

            />
          )}
        /> */}
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...field}
                required={true}
                placeholder="Password"
                onPaste={(e) => e.preventDefault()}
                errorMessage={errors.password ? String(errors.password.message) : undefined}
                icon={
                  showPassword ? (
                    <VisibilityOff
                      onMouseDown={(e) => e.preventDefault()} // Prevents losing focus
                      onClick={togglePasswordVisibility}
                      sx={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <Visibility
                      onMouseDown={(e) => e.preventDefault()} // Prevents losing focus
                      onClick={togglePasswordVisibility}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                }
              />
            )}
          />

        </Box>
        <Button loading={loading} text="Login" type="submit" disabled={false} />



      </form>

      {showModal && (
        <SocietySelectionModal
          societies={societies}
          onSelect={handleModalSelect}
        />
      )}
    </>
  );
};

export default SignInForm;
