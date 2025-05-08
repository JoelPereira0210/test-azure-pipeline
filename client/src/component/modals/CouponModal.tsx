import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import InputField from '../UI/InputField/InputField';
import { useForm, Controller } from 'react-hook-form';
import React, { useState, useEffect, useContext } from 'react';
import DatePickerField from '../UI/DatePickerField/DatePickerField';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCouponSchema } from '@/src/lib/zod/superAdmin';
import { CreateCouponTypes as FormValues } from '@/src/lib/types/superAdminTypes';
import ButtonInput from '../UI/Button/Button';
import CloseIcon from '@mui/icons-material/Close';
import { CancelOutlined } from '@mui/icons-material';
import {
  createCouponAction,
  deleteCouponAction,
  fetchSocietiesAction,
  updateCouponAction,
} from '@/src/actions/superAdmin';
import { CouponsContext } from '../context/CouponsContext';
import TextArea from '../UI/TextArea/TextArea';

import dayjs from 'dayjs';
import SocietyDropDownField from '../UI/DropDownInputField/SocietyDropdown';

const CouponModal = ({
  open,
  onClose,
  buttonOneText,
  buttonOneAction,
  buttonTwoText,
  buttonTwoAction,
  buttonThreeText,
  buttonThreeAction,
}) => {
  const theme = useTheme();
  const mode = theme?.palette?.mode;
  const [addButtonText, setAddButtonText] = useState('props.modalButtonAdd');
  const [cancelButtonText, setCancelButtonText] = useState(
    'props.modalButtonCancel'
  ); // State for cancel button text
  const [openDialog, setOpenDialog] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errormessage, setErrorMessage] = useState('');
  const [societyOption, setsocietyOption] = useState<any[]>([]);
  const {
    createCoupon,
    setCreateCoupon,
    setCouponActionType,
    CouponActionType,
    setCouponId,
    couponActionType,
    editCouponData,
    setEditCouponData,
    setFetchData,
  } = useContext(CouponsContext);
  const [isPublished, setIsPublished] = useState(
    editCouponData ? editCouponData.shouldPublish : false
  );
  const [couponCodeS, setCouponCodeS] = useState('');
  // Assuming you have a state or a list to store previously generated codes
const [existingCodes, setExistingCodes] = useState<string[]>([]); // For example, this is where you store generated codes

const generateCouponCode = () => {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  const allCharacters = lowerCase + upperCase + digits;

  // Randomly decide the length of the coupon code between 3 and 8
  const codeLength = Math.floor(Math.random() * (8 - 3 + 1)) + 3; // Length between 3 and 8

  let couponCode = '';

  // Ensure at least one lowercase letter, one uppercase letter, and one digit
  couponCode += lowerCase.charAt(Math.floor(Math.random() * lowerCase.length));
  couponCode += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
  couponCode += digits.charAt(Math.floor(Math.random() * digits.length));

  // Generate the remaining characters randomly from all categories
  for (let i = couponCode.length; i < codeLength; i++) {
    couponCode += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
  }

  // Shuffle the generated code to randomize the position of the mandatory characters
  couponCode = couponCode.split('').sort(() => Math.random() - 0.5).join('');

  // Check if the generated code already exists, and regenerate if it does
  if (existingCodes.includes(couponCode)) {
    return generateCouponCode(); // Recursively call to regenerate
  }

  // Add the new code to the existingCodes list
  setExistingCodes((prevCodes) => [...prevCodes, couponCode]);

  return couponCode;
};

  

  useEffect(() => {
    if(!editCouponData){
    const newCode = generateCouponCode();
    setCouponCodeS(newCode);
    setValue('couponCode', newCode);}
  }, []);
 
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      couponName: editCouponData?.couponName ?? '',
      couponCode: editCouponData?.couponCode ?? '',
      
      expiryDate: editCouponData?.expiryDate ?? '',
      couponDescription: editCouponData?.couponDescription ?? '',
      maxUses: editCouponData?.maxUses ?? '',
      societyId: editCouponData?.societyId ?? '', // Default to an empty string if null or undefined
      percentage: editCouponData?.discountPercentage ?? '',
      shouldPublish: editCouponData?.shouldPublish ?? false,
    },
  });
  const [societyDropdownVisible, setSocietyDropdownVisible] = useState(false);

  const handleErrorModalClose = () => {
    setOpenErrorModal(false); // Close error modal
    setErrorMessage(''); // Clear error message
  };

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const societiesData = await fetchSocietiesAction(); // Await the fetched societies data
        console.log('Received Societies Data:', societiesData);
        setsocietyOption(societiesData); // Set the societies data to state
      } catch (error) {
        console.error('Error fetching societies:', error);
      }
    };

    fetchSocieties();
  }, []);
  console.log('society', societyOption);

  const onSubmit = async (data: FormValues) => {
    console.log('On Submits', data);
    console.log('Expiry Date:', data.expiryDate);
    console.log('Selected Society ID:', data.societyId);
    try {
      let response;
      if (editCouponData) {
        const payload = {
          couponId: editCouponData?.couponId,
          ...data,
        };
        console.log('payload', payload);
        response = await updateCouponAction(payload);
      } else {
        const payload = {
          ...data,
        };
        response = await createCouponAction(payload);
      }
      if (response?.status === 200) {
        setFetchData(true);
        if (editCouponData) {
          reset({
            couponName: '',
            couponCode: '',
            expiryDate: null,
            couponDescription: '',
            societyId: '',
            maxUses: '',
            percentage: '',
          });
          setEditCouponData(null);
        }
        onClose();
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleDelete = async () => {
    console.log('Delete clicked');
  };
  console.log("erors", errors)
  const handleCancel = () => {
    // alert("cancel")
    reset({
      couponName: '',
      couponCode: '',
      expiryDate: null,
      couponDescription: '',
      societyId: '',
      maxUses: '',
      percentage: '',
    });
    setEditCouponData(null);
    onClose();
  };
  console.log('errors', errors);
  return (
    <Popup
      className="coupon-modal"
      closeOnDocumentClick={false}
      position="right center"
      modal
      onClose={() => handleCancel()}
      open={open}
      contentStyle={{
        backgroundColor: mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-dark-background)',
        border: 'none'
      }}
    // {...{ contentStyle }}
    >
      <Box sx={{ backgroundColor: mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-dark-background)', }}>
        <Box
          sx={{
            padding: '10px 20px',

          }}
          className="all-content"
        >
          <Box
            className="header"
            sx={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
              sx={{
                color:
                  mode === 'light'
                    ? 'var(--tw-text-light-mainText)'
                    : 'var(--tw-text-dark-mainText)',
              }}
            >
              {editCouponData ? 'Edit Coupon' : 'Create Coupon'}
            </Typography>
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8 }}
              // sx={{ cursor: 'pointer' }}
              onClick={() => handleCancel()}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {/* )} */}
          <Box sx={{ marginTop: '1.4rem' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              

              <Controller
                name="couponCode"
                control={control}
                render={({ field, fieldState }) => (
                  <InputField
                    type="text"
                    readOnly
                    label={'Coupon Code'}
                    {...field}
                    required={true}
                    placeholder="Coupon Code"
                    errorMessage={errors.couponCode?.message}
                  />
                )}
              />

              <Controller
                name="couponName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    type="text"
                    label={'Coupon Name'}
                    {...field}
                    required={true}
                    placeholder="Coupon Name"
                    errorMessage={errors.couponName?.message}
                  />
                )}
              />

              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    {...field}
                    label="Expiry Date"
                    required={true}
                    error={
                      errors.expiryDate
                        ? String(errors.expiryDate.message)
                        : undefined
                    }

                    value={
                      field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''
                    }
                    minDate={dayjs()} // Today's date
                    maxDate={dayjs().add(1, 'month')}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      trigger('expiryDate');
                    }}
                    style={{
                      color:
                        mode === 'light'
                          ? 'var(--tw-text-light-mainText)'
                          : 'var(--tw-text-light-smallText)',
                      backgroundColor:
                        mode === 'light'
                          ? 'var(--tw-bg-light-background)'
                          : 'var(--tw-bg-dark-background)',
                    }}
                  />
                )}
              />

              <Controller
                name="couponDescription"
                control={control}
                render={({ field, fieldState }) => (
                 
                  <TextArea
                    label="Coupon Description"
                    type="text"
                    required={true}
                    // error={errors.couponDescription?.message}
                    error={
                      errors.couponDescription
                        ? String(errors.couponDescription.message)
                        : undefined
                    }
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('couponDescription');
                    }}
                  />
                )}
              />

              <Controller
                name="maxUses"
                control={control}
                render={({ field, fieldState }) => (
                  <InputField
                    type="number"

                    label={'Number of Uses'}
                    {...field}
                    required={true}
                    placeholder="Max Users"

                    errorMessage={errors.maxUses?.message}
                  />
                )}
              />

              <Controller
                name="societyId"
                control={control}
                render={({ field }) => (
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    <InputField
                      type="text"
                      label="Society Name"
                      {...field}
                      placeholder="Enter Society Name"
                      errorMessage={errors.societyId?.message}
                      value={
                        // Show societyName if societyId is already set or typed
                        societyOption.find(
                          (society) => society.societyId === field.value
                        )
                          ? societyOption.find(
                            (society) => society.societyId === field.value
                          )?.societyName
                          : field.value
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value); // Temporarily store user input (societyName)
                        setSocietyDropdownVisible(value.length > 0); // Show dropdown only if user types something
                      }}
                      onBlur={() => {
                        setTimeout(() => setSocietyDropdownVisible(false), 200); // Hide dropdown on blur
                      }}
                    />

                    {societyDropdownVisible && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          width: '100%',
                          maxHeight: '150px',
                          overflowY: 'auto',
                          backgroundColor: mode === 'light' ? '#fff' : '#333',
                          border: '1px solid #ccc',
                          zIndex: 10,
                          boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
                        }}
                      >
                        {societyOption
                          .filter((society) =>
                            society.societyName
                              .toLowerCase()
                              .includes(field.value.toLowerCase())
                          )
                          .map((society) => (
                            <Box
                              key={society.societyId}
                              sx={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor:
                                    mode === 'light' ? '#f0f0f0' : '#444',
                                },
                              }}
                              onClick={() => {
                                field.onChange(society.societyName); // Set societyName temporarily
                                setValue('societyId', society.societyId); // Set societyId in form state
                                setSocietyDropdownVisible(false); // Hide dropdown
                              }}
                            >
                              {society.societyName}
                              {society.address && `, ${society.address}`}
                            </Box>
                          ))}
                      </Box>
                    )}
                  </Box>
                )}
              />

              <Controller
                name="percentage"
                control={control}
                render={({ field, fieldState }) => (
                  <InputField
                    type="number"
                    label={'Percentage'}
                    {...field}
                    required={true}
                    placeholder="Percentage"
                    errorMessage={errors.percentage?.message}
                  />
                )}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  marginTop: '16px',
                  '@media(max-width:768px)': {
                    flexDirection: 'column',
                    alignItems: 'center',
                  },
                }}
              >
                {editCouponData ? (
                  editCouponData?.shouldPublish !== true &&
                  editCouponData?.isDeleted !== 'SOFT_DELETED' &&
                  editCouponData?.maxUses > editCouponData?.uses && (
                    <>
                      {buttonOneText && (
                        <ButtonInput
                          type="button"
                          text={buttonOneText}
                          onClick={handleSubmit((data) => {
                            onSubmit({
                              ...data,
                              shouldPublish: false,
                            });
                          })}
                          styles={{
                            // flex: 1,
                            maxWidth: '210px',
                            backgroundColor: 'transparent',
                            border: '1px solid #A2A1A833',
                            color:
                              mode === 'light'
                                ? 'var(--tw-text-light-mainText)'
                                : 'var(--tw-text-dark-mainText)',
                            '&:hover': {
                              backgroundColor: '#A2A1A833',
                            },
                          }}
                        />
                      )}
                    </>
                  )
                ) : (
                  <>
                    {buttonOneText && (
                      <ButtonInput
                        type="button"
                        text={buttonOneText}
                        onClick={handleSubmit((data) => {
                          onSubmit({
                            ...data,
                            shouldPublish: false,
                          });
                        })}
                        styles={{
                          // flex: 1,
                          maxWidth: '210px',
                          backgroundColor: 'transparent',
                          border: '1px solid #A2A1A833',
                          color:
                            mode === 'light'
                              ? 'var(--tw-text-light-mainText)'
                              : 'var(--tw-text-dark-mainText)',
                          '&:hover': {
                            backgroundColor: '#A2A1A833',
                          },
                        }}
                      />
                    )}
                  </>
                )}
                {editCouponData && (
                  <>
                    {buttonTwoText && (
                      <ButtonInput
                        type="button"
                        text={buttonTwoText}
                        onClick={async () => {
                          let isDeleted;
                          if (editCouponData?.isDeleted === 'SOFT_DELETED') {
                            isDeleted = 'HARD_DELETED';
                          } else {
                            isDeleted = 'SOFT_DELETED';
                          }
                          console.log('isDeleted', isDeleted);
                          await deleteCouponAction(editCouponData.couponId, {
                            isDeleted,
                          });
                          setFetchData(true);
                          reset({
                            couponName: '',
                            couponCode: '',
                            // expiryDate:'',
                            couponDescription: '',
                            societyId: '',
                            maxUses: '',
                            percentage: '',
                          });
                          setEditCouponData(null);
                          onClose();
                        }}
                        styles={{
                          maxWidth: '210px',
                          // flex: 1,
                          backgroundColor: 'transparent',
                          border: '1px solid #A2A1A833',
                          color:
                            mode === 'light'
                              ? 'var(--tw-text-light-mainText)'
                              : 'var(--tw-text-dark-mainText)',
                          '&:hover': {
                            backgroundColor: '#A2A1A833',
                          },
                        }}
                      />
                    )}
                  </>
                )}

                {buttonThreeText && editCouponData ? (
                  editCouponData?.isDeleted !== 'SOFT_DELETED' &&
                  editCouponData?.maxUses > editCouponData?.uses && (
                    <ButtonInput
                      styles={{
                        maxWidth: '210px',
                      }}
                      text={
                        editCouponData?.shouldPublish === true
                          ? 'Update'
                          : buttonThreeText
                      }
                      type="button"
                      onClick={handleSubmit((data) => {
                        onSubmit({
                          ...data,
                          shouldPublish: true,
                        });
                      })}
                    />
                  )
                ) : (
                  <ButtonInput
                    styles={{
                      maxWidth: '210px',
                    }}
                    text={
                      editCouponData?.shouldPublish === true
                        ? 'Update'
                        : buttonThreeText
                    }
                    type="button"
                    onClick={handleSubmit((data) => {
                      onSubmit({
                        ...data,
                        shouldPublish: true,
                      });
                    })}
                  />
                )}
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Popup>
  );
};
export default CouponModal;
