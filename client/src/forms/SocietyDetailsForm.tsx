// import React, { useEffect, useState } from 'react';
// import { useForm, Controller, FormProvider } from 'react-hook-form';
// import InputField from '@/src/component/UI/InputField/InputField';
// import {
//   societyDetailsSchema,
//   societyRegistrationSchema,
// } from '../lib/zod/auth';
// import { zodResolver } from '@hookform/resolvers/zod';
// import PopupModal from '../component/UI/Popup/PopupModal';
// import {
//   TextField,
//   Box,
//   Typography,
//   Grid,
//   Button,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import TextArea from '../component/UI/TextArea/TextArea';
// import {
//   CountryDropdown,
//   StateDropdown,
//   CityDropdown,
//   PhoneInput,
// } from 'react-country-state-dropdown';
// import { styled } from '@mui/material/styles';
// import CheckboxInput from '../component/UI/Checkbox/checkbox';
// import DropZoneInput from '../component/UI/DropZone/DropZone';
// import ButtonInput from '../component/UI/Button/Button';
// import { validateformIfsc } from '../actions/auth';

// const SocietyDetailsForm = ({ onNext, defaultValues }) => {
//   const methods = useForm<FormData>();
//   const [loading, setLoading] = useState(false);
//   const [previewSrc, setPreviewSrc] = useState('');
//   const theme = useTheme();
//   const mode = theme.palette.mode;
//   const isMobile = useMediaQuery('(max-width:768px)');

//   const {
//     handleSubmit,
//     trigger,
//     watch,clearErrors,
//     control,setValue,
//     formState: { errors },
//   } = useForm({
//     defaultValues,
//     resolver: zodResolver(societyDetailsSchema),

//     mode: 'onBlur',
//   });
//   // const theme = localStorage.getItem('themeMode')
//   const LOGO = watch('logo');
//   console.log('LOGOG', LOGO);
//   useEffect(() => {
//     if (LOGO.length > 0) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewSrc(reader.result as string);
//       };
//       reader.readAsDataURL(LOGO[0]);
//     }
//   }, [LOGO]);



//   const ifscCode = watch('ifscCode');
//   useEffect(() => {
//     const fetchIfscBankDetails = async () => {
//       if (ifscCode) {
//         console.log('IFSC Code before validation:', ifscCode); // Log IFSC code
//         try {
//           const details = await validateformIfsc(ifscCode); // Fetch bank and branch details
//           console.log('IFSC Validation Details:', details);

//           if (details.bankName && details.branchName) {
//             setValue('bank', details.bankName);
//             setValue('branchName', details.branchName);
//             clearErrors(['bank', 'branchName']);
//           } else {
//             setValue('bank', '');
//             setValue('branchName', '');
//           }
//         } catch (error) {
//           console.error('Error in validateIfsc:', error);
//           setValue('bank', '');
//           setValue('branchName', '');
//         }
//       } else {
//         setValue('bank', '');
//         setValue('branchName', '');
//       }
//     };

//     fetchIfscBankDetails();
//   }, [ifscCode, setValue, clearErrors]);

//   console.log("values",setValue)

//   const onSubmit = (data) => {
//     setLoading(true);
//     console.log('data', data);
//     onNext(data);
//     setLoading(false);
//   };

//   const selectedCountry = watch('societyCountry');
//   const membershipFees = watch('isMembershipFees');
//   console.log('membershipFees', membershipFees);


//   console.log('error', errors);
//   return (
//     <>
//       <Box
//         className="w-full flex flex-col items-center"
//         sx={{
//           marginBottom: '50px',
//         }}
//       >
//         <Typography
//           variant="text12"
//           className=" !mb-[1.5rem]"

//           sx={{
//             color:
//               mode === 'light'
//               ? 'var(--tw-text-dark-mainText)'
//               : 'var(--tw-text-light-smallText)',

//           }}
//           fontWeight={500}

//         >
//           1/2
//         </Typography>
//         <Typography
//           variant="text13"
//           fontWeight={600}
//           sx={{
//             '@media(max-width:768px)': {
//               marginBottom: '16px',
//             },
//             color:
//               mode === 'light'
//               ? 'var(--tw-text-dark-mainText)'
//               : 'var(--tw-text-light-smallText)',
//           }}
//         >
//           Society Details
//         </Typography>
//         <Typography
//           variant="text8"
//           fontWeight={500}
//           color={'#3A3A3A'}
//           className=" !mb-[2rem]"
//           sx={{
//             '@media(max-width:768px)': {
//               fontSize: '0.75rem',
//             },
//             color:
//               mode === 'light'   ? 'var(--tw-text-dark-mainText)'
//               : 'var(--tw-text-light-smallText)',
//           }}
//         >
//           Setup your Society for members that may join later.
//         </Typography>
//       </Box>
//       <FormProvider {...methods}>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Grid container columnSpacing={{ lg: 4, xs: 1, sm: 2, md: 4 }}>
//             <Grid width={'100%'} item xs={12} sm={6}>
//               <Controller
//                 name={'societyName'}
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field }) => (
//                   <InputField
//                     label="Society Name"
//                     type="text"
//                     required={true}
//                     // errorMessage={errors.societyName?.message}
//                     errorMessage={
//                       errors.societyName
//                         ? String(errors.societyName.message)
//                         : undefined
//                     }
//                    style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       trigger('societyName');
//                     }}

//                     classes=""

//                   />
//                 )}
//               />

//               <Controller
//                 name="buildingName"
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field }) => (
//                   <InputField
//                     label="Building Name"
//                     type="text"
//                     required={true}
//                     // errorMessage={errors.buildingName?.message}
//                     errorMessage={
//                       errors.buildingName
//                         ? String(errors.buildingName.message)
//                         : undefined
//                     }
//                     style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       trigger('buildingName');
//                     }}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Controller
//                 name="societyDescription"
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field }) => (
//                   <TextArea
//                     label="Society Description"
//                     type="text"
//                     required={true}
//                     // error={errors.societyDescription?.message}
//                     error={
//                       errors.societyDescription
//                         ? String(errors.societyDescription.message)
//                         : undefined
//                     }
//                     style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       trigger('societyDescription');
//                     }}
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Controller
//                 name="societyBuildingDoorNumber"
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field }) => (
//                   <InputField
//                     label="Building Door Number"
//                     type="text"
//                     required={true}
//                     // errorMessage={errors.societyBuildingDoorNumber?.message}
//                     errorMessage={
//                       errors.societyBuildingDoorNumber
//                         ? String(errors.societyBuildingDoorNumber.message)
//                         : undefined
//                     }
//                     style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       trigger('societyBuildingDoorNumber');
//                     }}
//                     classes=""
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Controller
//                 name="societyAddress"
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field }) => (
//                   <InputField
//                     label="Address"
//                     type="text"
//                     required={true}
//                     // errorMessage={errors.societyAddress?.message}
//                     errorMessage={
//                       errors.societyAddress
//                         ? String(errors.societyAddress.message)
//                         : undefined
//                     }
//                     style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       trigger('societyAddress');
//                     }}
//                     classes=""
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Controller
//                 name="societyStreetName"
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field }) => (
//                   <InputField
//                     label="Street Name"
//                     type="text"
//                     required={true}
//                     // errorMessage={errors.societyStreetName?.message}
//                     errorMessage={
//                       errors.societyStreetName
//                         ? String(errors.societyStreetName.message)
//                         : undefined
//                     }
//                     style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       trigger('societyStreetName');
//                     }}
//                     classes=""
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Controller
//                 name="societyCountry"
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field }) => (
//                   <Box
//                     className={`flex flex-col`}
//                     sx={{
//                       marginBottom: '27px',
//                     }}
//                   >
//                     <label>
//                       <Typography variant="text8" fontWeight={600}>
//                         Country <span style={{ color: 'red' }}>*</span>
//                       </Typography>
//                     </label>
//                     <CountryDropdown
//                       // searchable
//                       value={field.value?.name}
//                       onChange={(e, val) => {
//                         field.onChange(val);
//                         trigger('societyCountry');
//                       }}

//                       // inputRef={ref}
//                       // className="custom-dropdown "
//                       className={` custom-dropdown ${
//                         mode === 'light' ? 'light-dropdown' : 'dark-dropdown'
//                       }`}

//                     />
//                     {errors?.societyCountry && (
//                       <Typography
//                         color="error"
//                         variant="body2"
//                         sx={{ marginTop: '8px' }}
//                       >
//                         {/* {errors?.societyCountry?.message} */}
//                         {typeof errors.societyCountry.message === 'string'
//                           ? errors.societyCountry.message
//                           : ''}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Controller
//                 name="societyState"
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field }) => (
//                   <Box
//                     className={`flex flex-col customBox ${
//                       mode === 'light' ? 'light-dropBox' : 'dark-dropBox'
//                     }`}
//                     sx={{
//                       marginBottom: '27px',
//                     }}
//                   >
//                     <label>
//                       <Typography variant="text8" fontWeight={600}>
//                         State <span style={{ color: 'red' }}>*</span>
//                       </Typography>
//                     </label>
//                     <StateDropdown
//                       // searchable
//                       country={selectedCountry}
//                       placeHolder={'Choose a State'}
//                       value={field.value}
//                       onChange={(e, val) => {
//                         field.onChange(val);
//                         console.log('val', val);
//                         trigger('societyState');
//                       }}

//                       className={`custom-dropdown ${
//                         mode === 'light' ? 'light-dropdown' : 'dark-dropdown'
//                       }`}

//                     />
//                     {errors?.societyState && (
//                       <Typography
//                         color="error"
//                         variant="body2"
//                         sx={{ marginTop: '8px' }}
//                       >
//                         {/* {errors?.societyState?.message} */}
//                         {typeof errors.societyState.message === 'string'
//                           ? errors.societyState.message
//                           : ''}
//                       </Typography>
//                     )}
//                   </Box>
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Controller
//                 name="societyPincode"
//                 control={control}
//                 rules={{ required: true }}
//                 render={({ field }) => (
//                   <InputField
//                     label="Pincode"
//                     type="text"
//                     required={true}
//                     // errorMessage={errors.societyPincode?.message}
//                     errorMessage={
//                       errors.societyPincode
//                         ? String(errors.societyPincode.message)
//                         : undefined
//                     }
//                     style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                     // infoText={['6 digit number', '10 digit']}
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       trigger('societyPincode');
//                     }}
//                     classes=""
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Controller
//                 name="logo"
//                 control={control}
//                 defaultValue=""
//                 render={({ field }) => (
//                   <PopupModal
//                     trigger={
//                       <Button
//                         variant="contained"
//                         sx={{
//                           width: '100%',
//                           // maxWidth: '358px',
//                           cursor: 'pointer',
//                         }}
//                         className=" bg-light-main text-white"
//                       >
//                         {LOGO && LOGO?.length !== 0
//                           ? 'Change logo'
//                           : 'Add Logo'}
//                       </Button>
//                     }
//                   >
//                     <DropZoneInput
//                       media={LOGO}
//                       FileSize={1}
//                       MaxFiles={1}
//                       filesAccepted={{ 'image/png': [] }}
//                       onChange={(value) => {
//                         console.log('Hi');
//                         field.onChange(value);
//                       }}
//                       // close={close}
//                       close={(close: () => void) => close()}
//                     />
//                   </PopupModal>
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               {LOGO?.length > 0 && (
//                 <Box>
//                   <img
//                     src={previewSrc}
//                     alt="File Preview"
//                     style={{
//                       marginTop: `${isMobile ? '20px' : '0'}`,
//                       width: '104px',
//                       height: 'auto',
//                       maxHeight: '104px',
//                     }}
//                   />
//                   <Typography variant="text7">{LOGO[0]?.name}</Typography>
//                 </Box>
//               )}
//             </Grid>
//             <Grid
//               sx={{
//                 // backgroundColor:
//                 //   mode === 'light'
//                 //     ? 'var(--tw-bg-light-bodyBackground)'
//                 //     : 'var(--tw-bg-dark-bodyBackground)',
//                 backgroundColor:"#B1C9FF",
//                 borderRadius: '11px',
//                 border: '1px solid rgba(31, 100, 255, 0.30)',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 flexWrap: 'wrap',
//                 // alignItems: 'center',
//                 justifyItems: 'center',
//               }}
//               marginTop={9}
//               // marginLeft={4}
//               marginLeft={{ xs: 1, sm: 4 }}
//               item
//               xs={12}
//               sm={12}
//               paddingTop={2}
//               paddingBottom={2}
//               paddingRight={{ sm: 4, xs: 2 }}
//             >
//               <Controller
//                 control={control}
//                 name="isMembershipFees"
//                 defaultValue={false}
//                 render={({ field }) => (
//                   <CheckboxInput
//                     label="Membership Fee"
//                     // error={errors?.isMembershipFees?.message}
//                     error={
//                       errors.isMembershipFees
//                         ? String(errors.isMembershipFees.message)
//                         : undefined
//                     }
//                     // classes=""
//                     {...field}
//                   />
//                 )}
//               />

//               {membershipFees === true && (
//                 <>
//                   {/* <Box
//                     sx={
//                       {

//                         // display: 'flex',
//                         // flexDirection: 'row',
//                         // gap: '3rem',

//                       }
//                     }
//                     className="flex flex-col  md:flex-row"
//                     marginTop={2} 

//                     gap={{ lg: 10, xs: 0, sm: 0, md: 10 }}
//                   > */}
//                   <Box
//                     className="flex  flex-col  md:flex-row"
//                     gap={{ lg: 10, xs: 0, sm: 0, md: 10 }}
//                   >
//                     <Grid item xs={12} sm={6}>
//                       <Controller
//                         name="amount"
//                         control={control}
//                         rules={{ required: true }}
//                         render={({ field }) => (
//                           <InputField
//                             label="Amount"
//                             type="number"
//                             required={true}
//                             // errorMessage={errors.amount?.message}
//                             errorMessage={
//                               errors.amount
//                                 ? String(errors.amount.message)
//                                 : undefined
//                             }
//                              style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                             {...field}
//                             onChange={(e) => {
//                               field.onChange(e);
//                               trigger('amount');
//                             }}
//                             classes=""
//                           />
//                         )}
//                       />
//                     </Grid>

//                     {/* Bank Account Number Field */}
//                     <Grid item xs={12}  sm={6}>
//                       <Controller
//                         name="bankAccountNumber"
//                         control={control}
//                         // rules={{ required: 'Bank account number is required' }}
//                         render={({ field }) => (
//                           <InputField
//                             type="text"
//                             label="Bank Account Number"
//                             {...field}
//                             required
//                             placeholder="Bank Account Number"
//                             errorMessage={
//                               errors.bankAccountNumber
//                                 ? String(errors.bankAccountNumber.message)
//                                 : undefined
//                             }
//                              style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                           />
//                         )}
//                       />
//                     </Grid>
//                   </Box>
//                   <Box
//                     className="flex  flex-col  md:flex-row"
//                     gap={{ lg: 10, xs: 0, sm: 0, md: 10 }}
//                   >
//                     <Grid item xs={12}>
//                       <Controller
//                         // name="ifscCode"
//                         name="ifscCode"
//                         control={control}
//                         // rules={{ required: 'IFSC code is required' }}
//                         render={({ field }) => (
//                           <InputField
//                             type="text"
//                             label="IFSC Code"
//                             {...field}
//                             required
//                             placeholder="IFSC Code"
//                             errorMessage={
//                               errors.ifscCode
//                                 ? String(errors.ifscCode.message)
//                                 : undefined
//                             }
//                              style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                           />
//                         )}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Controller
//                         name="branchName"
//                         control={control}
//                         rules={{ required: 'Address is required' }}
//                         render={({ field }) => (
//                           <InputField
//                             type="text"
//                             label="Branch Name"
//                             {...field}
//                             required
//                             placeholder="Branch Name"
//                             errorMessage={
//                               errors.address
//                                 ? String(errors.branchName.message)
//                                 : undefined
//                             }
//                              style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                             readOnly
//                           />
//                         )}
//                       />
//                     </Grid>
//                   </Box>
//                   <Box
//                     className="flex  flex-col  md:flex-row"
//                     gap={{ lg: 10, xs: 0, sm: 0, md: 10 }}
//                   >
//                     <Grid item xs={12}>
//                       <Controller
//                         name="accountName"
//                         control={control}
//                         // rules={{ required: "Account holder's name is required" }}
//                         render={({ field }) => (
//                           <InputField
//                             type="text"
//                             label="Account Name"
//                             {...field}
//                             required
//                             placeholder="Account Name"
//                             errorMessage={
//                               errors.accountName
//                                 ? String(errors.accountName.message)
//                                 : undefined
//                             }
//                              style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                           />
//                         )}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Controller
//                         name="bank"
//                         control={control}
//                         // rules={{ required: "Bank's name is required" }}
//                         render={({ field }) => (
//                           <InputField
//                             type="text"
//                             label="Bank's Name"
//                             {...field}
//                             required
//                             placeholder="Banks Name"
//                             errorMessage={
//                               errors.bank
//                                 ? String(errors.bank.message)
//                                 : undefined
//                             }
//                              style={{

//                             backgroundColor: `${
//                               mode === 'light'
//                                 ? 'var(--tw-bg-light-background)'
//                                 : 'var(--tw-bg-dark-background)'
//                             }`,
//                           }}
//                             readOnly
//                           />
//                         )}
//                       />
//                     </Grid>
//                   </Box>
//                 </>
//               )}
//             </Grid>
//           </Grid>
//           <Box className="flex justify-center" marginTop={8}>
//             <ButtonInput
//               disabled={false}
//               text="Next"
//               type="submit"
//               loading={loading}
//               styles={{ width: '210px' }}
//             />
//           </Box>
//         </form>
//       </FormProvider>
//     </>
//   );
// };

// export default SocietyDetailsForm;





import React, { useEffect, useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import InputField from '@/src/component/UI/InputField/InputField';
import {
  societyDetailsSchema,
  societyRegistrationSchema,
} from '../lib/zod/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import PopupModal from '../component/UI/Popup/PopupModal';
import {
  TextField,
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import TextArea from '../component/UI/TextArea/TextArea';
import {
  CountryDropdown,
  StateDropdown,
  CityDropdown,
  PhoneInput,
} from 'react-country-state-dropdown';
import { styled } from '@mui/material/styles';
import CheckboxInput from '../component/UI/Checkbox/checkbox';
import DropZoneInput from '../component/UI/DropZone/DropZone';
import ButtonInput from '../component/UI/Button/Button';
import { validateformIfsc } from '../actions/auth';

const SocietyDetailsForm = ({ onNext, defaultValues }) => {
  const methods = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const theme = useTheme();
  const mode = theme.palette.mode;
  const isMobile = useMediaQuery('(max-width:768px)');

  const {
    handleSubmit,
    trigger,
    watch, clearErrors,
    control, setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(societyDetailsSchema),

    mode: 'onBlur',
  });
  // const theme = localStorage.getItem('themeMode')
  const LOGO = watch('logo');
  console.log('LOGOG', LOGO);
  useEffect(() => {
    if (LOGO.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
      };
      reader.readAsDataURL(LOGO[0]);
    }
  }, [LOGO]);



  const ifscCode = watch('ifscCode');
  const bankAccountNumber = watch('accountNumber');
  console.log("accnmb",bankAccountNumber)
  useEffect(() => {
    const fetchIfscBankDetails = async () => {
      if (ifscCode) {
        console.log('IFSC Code before validation:', ifscCode); // Log IFSC code
        try {
          const details = await validateformIfsc(ifscCode); // Fetch bank and branch details
          console.log('IFSC Validation Details:', details);

          if (details.bankName && details.branchName) {
            setValue('bank', details.bankName);
            setValue('branchName', details.branchName);
            clearErrors(['bank', 'branchName']);
          } else {
            setValue('bank', '');
            setValue('branchName', '');
          }
        } catch (error) {
          console.error('Error in validateIfsc:', error);
          setValue('bank', '');
          setValue('branchName', '');
        }
      } else {
        setValue('bank', '');
        setValue('branchName', '');
      }
    };

    fetchIfscBankDetails();
  }, [ifscCode, setValue, clearErrors]);

  console.log("values", setValue)

  const onSubmit = (data) => {
    setLoading(true);
    console.log('datasss', data);
    onNext(data);
    setLoading(false);
  };

  const selectedCountry = watch('societyCountry');
  const membershipFees = watch('isMembershipFees');
  console.log('membershipFees', membershipFees);


  console.log('error', errors);
  return (
    <>
      <Box
        className="w-full flex flex-col items-center"
        sx={{
          marginBottom: '50px',
        }}
      >
        <Typography
          variant="text12"
          className=" !mb-[1.5rem]"

          sx={{
            color:
              mode === 'light'
                ? 'var(--tw-text-dark-mainText)'
                : 'var(--tw-text-light-mainText)',

          }}
          fontWeight={500}

        >
          1/2
        </Typography>
        <Typography
          variant="text13"
          fontWeight={600}
          sx={{
            '@media(max-width:768px)': {
              marginBottom: '16px',
            },
            color:
              mode === 'light'
                ? 'var(--tw-text-dark-mainText)'
                : 'var(--tw-text-light-mainText)',
          }}
        >
          Society Details
        </Typography>
        <Typography
          variant="text8"
          fontWeight={500}
          color={'#3A3A3A'}
          className=" !mb-[2rem]"
          sx={{
            '@media(max-width:768px)': {
              fontSize: '0.75rem',
            },
            color:
              mode === 'light' ? 'var(--tw-text-dark-mainText)'
                : 'var(--tw-text-light-mainText)',
          }}
        >
          Setup your Society for members that may join later.
        </Typography>
      </Box>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container columnSpacing={{ lg: 4, xs: 1, sm: 2, md: 4 }}>
            <Grid width={'100%'} item xs={12} sm={6}>
              <Controller
                name={'societyName'}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Society Name"
                    type="text"
                    required={true}
                    // errorMessage={errors.societyName?.message}
                    errorMessage={
                      errors.societyName
                        ? String(errors.societyName.message)
                        : undefined
                    }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                    }}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('societyName');
                    }}

                    classes=""

                  />
                )}
              />

              <Controller
                name="buildingName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Building Name"
                    type="text"
                    required={true}
                    // errorMessage={errors.buildingName?.message}
                    errorMessage={
                      errors.buildingName
                        ? String(errors.buildingName.message)
                        : undefined
                    }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                    }}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('buildingName');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyDescription"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextArea
                    label="Society Description"
                    type="text"
                    required={true}
                    // error={errors.societyDescription?.message}
                    error={
                      errors.societyDescription
                        ? String(errors.societyDescription.message)
                        : undefined
                    }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                    }}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('societyDescription');
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyBuildingDoorNumber"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Building Door Number"
                    type="text"
                    required={true}
                    // errorMessage={errors.societyBuildingDoorNumber?.message}
                    errorMessage={
                      errors.societyBuildingDoorNumber
                        ? String(errors.societyBuildingDoorNumber.message)
                        : undefined
                    }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                    }}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('societyBuildingDoorNumber');
                    }}
                    classes=""
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyAddress"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Address"
                    type="text"
                    required={true}
                    // errorMessage={errors.societyAddress?.message}
                    errorMessage={
                      errors.societyAddress
                        ? String(errors.societyAddress.message)
                        : undefined
                    }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                    }}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('societyAddress');
                    }}
                    classes=""
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyStreetName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Street Name"
                    type="text"
                    required={true}
                    // errorMessage={errors.societyStreetName?.message}
                    errorMessage={
                      errors.societyStreetName
                        ? String(errors.societyStreetName.message)
                        : undefined
                    }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                    }}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('societyStreetName');
                    }}
                    classes=""
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyCountry"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Box
                    className={`flex flex-col`}
                    sx={{
                      marginBottom: '27px',
                    }}
                  >
                    <label>
                      <Typography variant="text8" fontWeight={600}>
                        Country <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </label>
                    <CountryDropdown
                      // searchable
                      value={field.value?.name}
                      onChange={(e, val) => {
                        field.onChange(val);
                        trigger('societyCountry');
                      }}

                      // inputRef={ref}
                      // className="custom-dropdown "
                      className={` custom-dropdown ${mode === 'light' ? 'light-dropdown' : 'dark-dropdown'
                        }`}

                    />
                    {errors?.societyCountry && (
                      <Typography
                        color="error"
                        variant="body2"
                        sx={{ marginTop: '8px' }}
                      >
                        {/* {errors?.societyCountry?.message} */}
                        {typeof errors.societyCountry.message === 'string'
                          ? errors.societyCountry.message
                          : ''}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyState"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Box
                    className={`flex flex-col customBox ${mode === 'light' ? 'light-dropBox' : 'dark-dropBox'
                      }`}
                    sx={{
                      marginBottom: '27px',
                    }}
                  >
                    <label>
                      <Typography variant="text8" fontWeight={600}>
                        State <span style={{ color: 'red' }}>*</span>
                      </Typography>
                    </label>
                    <StateDropdown
                      // searchable
                      country={selectedCountry}
                      placeHolder={'Choose a State'}
                      value={field.value}
                      onChange={(e, val) => {
                        field.onChange(val);
                        console.log('val', val);
                        trigger('societyState');
                      }}

                      className={`custom-dropdown ${mode === 'light' ? 'light-dropdown' : 'dark-dropdown'
                        }`}

                    />
                    {errors?.societyState && (
                      <Typography
                        color="error"
                        variant="body2"
                        sx={{ marginTop: '8px' }}
                      >
                        {/* {errors?.societyState?.message} */}
                        {typeof errors.societyState.message === 'string'
                          ? errors.societyState.message
                          : ''}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="societyPincode"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    label="Pincode"
                    type="text"
                    required={true}
                    // errorMessage={errors.societyPincode?.message}
                    errorMessage={
                      errors.societyPincode
                        ? String(errors.societyPincode.message)
                        : undefined
                    }
                    style={{

                      backgroundColor: `${mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)'
                        }`,
                    }}
                    // infoText={['6 digit number', '10 digit']}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('societyPincode');
                    }}
                    classes=""
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="logo"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <PopupModal
                    trigger={
                      <Button
                        variant="contained"
                        sx={{
                          width: '100%',
                          // maxWidth: '358px',
                          cursor: 'pointer',
                        }}
                        className=" bg-light-main text-white"
                      >
                        {LOGO && LOGO?.length !== 0
                          ? 'Change logo'
                          : 'Add Logo'}
                      </Button>
                    }
                  >
                    <DropZoneInput
                      media={LOGO}
                      FileSize={1}
                      MaxFiles={1}
                      filesAccepted={{ 'image/png': [] }}
                      onChange={(value) => {
                        console.log('Hi');
                        field.onChange(value);
                      }}
                      // close={close}
                      close={(close: () => void) => close()}
                    />
                  </PopupModal>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {LOGO?.length > 0 && (
                <Box>
                  <img
                    src={previewSrc}
                    alt="File Preview"
                    style={{
                      marginTop: `${isMobile ? '20px' : '0'}`,
                      width: '104px',
                      height: 'auto',
                      maxHeight: '104px',
                    }}
                  />
                  <Typography variant="text7">{LOGO[0]?.name}</Typography>
                </Box>
              )}
            </Grid>
            <Grid
              sx={{
                // backgroundColor:
                //   mode === 'light'
                //     ? 'var(--tw-bg-light-bodyBackground)'
                //     : 'var(--tw-bg-dark-bodyBackground)',
                backgroundColor: "#B1C9FF",
                borderRadius: '11px',
                border: '1px solid rgba(31, 100, 255, 0.30)',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                // alignItems: 'center',
                justifyItems: 'center',
              }}
              marginTop={9}
              // marginLeft={4}
              marginLeft={{ xs: 1, sm: 4 }}
              item
              xs={12}
              sm={12}
              paddingTop={2}
              paddingBottom={2}
              paddingRight={{ sm: 4, xs: 2 }}
            >
              <Controller
                control={control}
                name="isMembershipFees"
                defaultValue={false}
                render={({ field }) => (
                  <CheckboxInput
                    label="Membership Fee"
                    // error={errors?.isMembershipFees?.message}
                    error={
                      errors.isMembershipFees
                        ? String(errors.isMembershipFees.message)
                        : undefined
                    }
                    // classes=""
                    {...field}
                  />
                )}
              />

              {membershipFees === true && (
                <>
                  {/* <Box
                    sx={
                      {
                       
                        // display: 'flex',
                        // flexDirection: 'row',
                        // gap: '3rem',
                       
                      }
                    }
                    className="flex flex-col  md:flex-row"
                    marginTop={2}
                   
                    gap={{ lg: 10, xs: 0, sm: 0, md: 10 }}
                  > */}
                  <Box
                    className="flex  flex-col  md:flex-row"
                    gap={{ lg: 10, xs: 0, sm: 0, md: 10 }}
                  >
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="amount"
                        control={control}
                        // rules={{ required: true }}
                        render={({ field }) => (
                          <InputField
                            label="Amount"
                            type="number"
                            // required={true}
                            // errorMessage={errors.amount?.message}
                            errorMessage={
                              errors.amount
                                ? String(errors.amount.message)
                                : undefined
                            }
                            style={{

                              backgroundColor: `${mode === 'light'
                                  ? 'var(--tw-bg-light-background)'
                                  : 'var(--tw-bg-dark-background)'
                                }`,
                            }}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              trigger('amount');
                            }}
                            classes=""
                          />
                        )}
                      />
                    </Grid>

                    {/* Bank Account Number Field */}
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="accountNumber"
                        control={control}
                        // rules={{ required: 'Bank account number is required' }}
                        render={({ field }) => (
                          <InputField
                            type="text"
                            label="Bank Account Number"
                            {...field}
                            // required
                            placeholder="Bank Account Number"
                            errorMessage={
                              errors.accountNumber
                                ? String(errors.accountNumber.message)
                                : undefined
                            }
                            style={{

                              backgroundColor: `${mode === 'light'
                                  ? 'var(--tw-bg-light-background)'
                                  : 'var(--tw-bg-dark-background)'
                                }`,
                            }}
                            onChange={(e) => {
                              field.onChange(e);
                              trigger('bankAccountNumber');
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Box>
                  <Box
                    className="flex  flex-col  md:flex-row"
                    gap={{ lg: 10, xs: 0, sm: 0, md: 10 }}
                  >
                    <Grid item xs={12}>
                      <Controller
                        // name="ifscCode"
                        name="ifscCode"
                        control={control}
                        // rules={{ required: 'IFSC code is required' }}
                        render={({ field }) => (
                          <InputField
                            type="text"
                            label="IFSC Code"
                            {...field}
                            required
                            placeholder="IFSC Code"
                            errorMessage={
                              errors.ifscCode
                                ? String(errors.ifscCode.message)
                                : undefined
                            }
                            style={{

                              backgroundColor: `${mode === 'light'
                                  ? 'var(--tw-bg-light-background)'
                                  : 'var(--tw-bg-dark-background)'
                                }`,
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="branchName"
                        control={control}
                        // rules={{ required: 'Address is required' }}
                        render={({ field }) => (
                          <InputField
                            type="text"
                            label="Branch Name"
                            {...field}
                            // required
                            placeholder="Branch Name"
                            errorMessage={
                              errors.address
                                ? String(errors.branchName.message)
                                : undefined
                            }
                            style={{

                              backgroundColor: `${mode === 'light'
                                  ? 'var(--tw-bg-light-background)'
                                  : 'var(--tw-bg-dark-background)'
                                }`,
                            }}
                            readOnly
                          />
                        )}
                      />
                    </Grid>
                  </Box>
                  <Box
                    className="flex  flex-col  md:flex-row"
                    gap={{ lg: 10, xs: 0, sm: 0, md: 10 }}
                  >
                    <Grid item xs={12}>
                      <Controller
                        name="accountName"
                        control={control}
                        // rules={{ required: "Account holder's name is required" }}
                        render={({ field }) => (
                          <InputField
                            type="text"
                            label="Account Name"
                            {...field}
                            // required
                            placeholder="Account Name"
                            errorMessage={
                              errors.accountName
                                ? String(errors.accountName.message)
                                : undefined
                            }
                            style={{

                              backgroundColor: `${mode === 'light'
                                  ? 'var(--tw-bg-light-background)'
                                  : 'var(--tw-bg-dark-background)'
                                }`,
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="bank"
                        control={control}
                        // rules={{ required: "Bank's name is required" }}
                        render={({ field }) => (
                          <InputField
                            type="text"
                            label="Bank's Name"
                            {...field}
                            // required
                            placeholder="Banks Name"
                            errorMessage={
                              errors.bank
                                ? String(errors.bank.message)
                                : undefined
                            }
                            style={{

                              backgroundColor: `${mode === 'light'
                                  ? 'var(--tw-bg-light-background)'
                                  : 'var(--tw-bg-dark-background)'
                                }`,
                            }}
                            readOnly
                          />
                        )}
                      />
                    </Grid>
                  </Box>
                </>
              )}
            </Grid>
          </Grid>
          <Box className="flex justify-center" marginTop={8}>
            <ButtonInput
              disabled={false}
              text="Next"
              type="submit"
              loading={loading}
              styles={{ width: '210px' }}
            />
          </Box>
        </form>
      </FormProvider>
    </>
  );
};

export default SocietyDetailsForm;