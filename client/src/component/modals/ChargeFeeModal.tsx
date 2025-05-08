'use client';
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Modal,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonInput from '../UI/Button/Button';
import InputField from '@/src/component/UI/InputField/InputField';
import DatePickerField from '@/src/component/UI/DatePickerField/DatePickerField';
import { chargeFeeSchema } from '@/src/lib/zod/charges';
import { ChargeFeeFormType } from '@/src/lib/types/chargesFee.types';
import CloseIcon from '@mui/icons-material/Close'; // Import Close Icon
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';
import { createChargeAction, editChargeAction } from '@/src/actions/charges';
import { ChargesContext } from '../context/ChargesContext';
import { fetchChargeAction } from '@/src/actions/charges';
import { softDeleteChargeAction } from '@/src/actions/charges';
import { hardDeleteChargeAction } from '@/src/actions/charges';
import { fetchFeeTypeAction } from '@/src/actions/charges';
import Select from 'react-dropdown-select';
import ChargeDropDownField from '../UI/DropDownInputField/ChargeDropDownField';

import { watch } from 'fs';
// Props for the Modal component
interface ChargeFeeModalProps {
  open: boolean;
  onClose: () => void;
  step?: number;
}

// Zod schema example for form validation (replace with your actual schema)

const ChargeFeeModal: React.FC<ChargeFeeModalProps> = ({
  open,
  onClose,
  step,
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const {
    setCreateCharge,
    setChargeActionType,
    chargeId,
    chargeActionType,
    setChargeMemberStatus,
    chargeSection,
  } = useContext(ChargesContext);

  const methods = useForm<ChargeFeeFormType>({
    resolver: zodResolver(chargeFeeSchema),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = methods;

  const [isPublishing, setIsPublishing] = useState<boolean | null>(null); // Draft or Publish state
  const [checkPublished, setCheckPublished] = useState(false);
  const [deleteAction, setDeleteAction] = useState(''); // Tracks delete action
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedFeeType, setSelectedFeeType] = useState([]);
  const [options, setOptions] = useState([]); // Fee type options

  useEffect(() => {
    const fetchData = async () => {
      if (
        chargeId &&
        (chargeActionType === 'edit charge' ||
          chargeActionType === 'copy charge' ||
          chargeActionType === 'view charge')
      ) {
        try {
          const fetchedCharge = await fetchChargeAction(chargeId); // Fetch charge data based on chargeId
          console.log('Fetched Charge Data:', fetchedCharge);

          if (fetchedCharge.shouldPublish) {
            setCheckPublished(true); // The charge is published
          } else {
            setCheckPublished(false); // The charge is not published (draft)
          }

          // Pre-fill the form with fetched data for edit/copy
          setValue('name', fetchedCharge.eventName);
          setValue('description', fetchedCharge.eventDescription);
          setValue('amount', fetchedCharge.amount);

          // Handle the feeType selection
          const selectedFeeTypeValue = fetchedCharge.feeType.feeType;
          setSelectedFeeType([{ feeType: selectedFeeTypeValue }]); // Update the selectedFeeType state
          setValue('feeType', selectedFeeTypeValue); // Set the form value for feeType

          console.log(
            'fetchedCharge.feeType.feeType',
            fetchedCharge.feeType.feeType
          );

          // For "edit", prefill the due date
          if (chargeActionType === 'edit charge') {
            console.log('CC', chargeActionType);
            // alert("edit charge")
            setValue(
              'dueDate',
              dayjs(fetchedCharge.eventRegistrationDate).format('YYYY-MM-DD')
            );
          }

          if (chargeActionType === 'view charge') {
            console.log('CC', chargeActionType);
            // alert("view charge");
            setValue(
              'dueDate',
              dayjs(fetchedCharge.eventRegistrationDate).format('YYYY-MM-DD')
            );
          }

          // For "copy", we skip setting the due date
          if (chargeActionType === 'copy charge') {
            console.log('CC', chargeActionType);
            // alert("copy charge")
            setValue('dueDate', null); // Leave the date empty
          }
        } catch (error) {
          console.error('Error fetching charge data:', error);
        }
      }
    };

    fetchData(); // Fetch data on mount if chargeId exists
  }, [chargeId, chargeActionType, setValue]);

  useEffect(() => {
    const fetchChargeFeeType = async () => {
      try {
        const FeeTypeData = await fetchFeeTypeAction(); // Make sure to await the promise
        console.log('FeeTypeData', FeeTypeData);
        setOptions(FeeTypeData);
      } catch (error) {
        console.error('Error fetching fee types:', error);
      }
    };

    fetchChargeFeeType();
  }, []);

  const handleCreateFeeType = (newFeeType: any) => {
    console.log('newFeeType', newFeeType.feeType);

    const sft = newFeeType.feeType;
    const newOption = { feeType: sft, id: options.length + 1 };

    setOptions((prevOptions) => [...prevOptions, newOption]); // Add new option to the list

    setSelectedFeeType([newOption]); // Select the new option immediately
    setValue('feeType', sft); // Set the form field value to the new option
  };

  console.log('Updated options:', options);
  console.log('feeType', watch('feeType'));
  console.log('watch', watch('feeType'));

  // Form submission handler
  const onSubmit = async (data: ChargeFeeFormType, isPublishing: boolean) => {
    const encryptedSocietyId = localStorage.getItem('societyId');
    if (!encryptedSocietyId) {
      console.error(
        'Error: Encrypted society ID is not available in localStorage'
      );
      return; // Stop form submission if the societyId is missing
    }

    console.log('Form data before submission:', data); // Log form data
    try {
      let result;

      if (chargeActionType === 'edit charge') {
        // If it's an edit action, perform the PUT request using the editChargeAction function
        result = await editChargeAction(chargeId, {
          ...data,
          dueDate: dayjs(data.dueDate).format('YYYY-MM-DD'),
          encryptedSocietyId: encryptedSocietyId, // Use the encryptedSocietyId
          shouldPublish: isPublishing, // Pass publishing status
        });
      } else {
        // If it's a create or copy action, perform the POST request using the createChargeAction function
        result = await createChargeAction({
          ...data,
          dueDate: dayjs(data.dueDate).format('YYYY-MM-DD'),
          encryptedSocietyId: encryptedSocietyId,
          shouldPublish: isPublishing,
        });
      }

      if (result.status === 200) {
        console.log('Operation successful:', result.data);
      } else {
        console.error('Operation failed:', result);
      }
    } catch (error) {
      console.error('Error occurred while submitting the form:', error);
    }

    onClose(); // Close modal after submission
    reset(); // Reset form after submission
  };

  // Publishing or Draft handler functions
  const handlePublish = (e: any) => {
    e.preventDefault(); // Prevent form default action
    setIsPublishing(true); // This will trigger the form submission
    // handleSubmit(handleSubmitForm)();
    handleSubmit((data) => onSubmit(data, true))();
  };

  const handleSaveDraft = (e: any) => {
    e.preventDefault(); // Prevent form default action
    setIsPublishing(false); // This will trigger the form submission
    // handleSubmit(handleSubmitForm)();
    handleSubmit((data) => onSubmit(data, false))();
  };

  const handleEditCharge = (e: any) => {
    // Simulate loading for 1 second
    setLoading(true);
    setTimeout(() => {
      setChargeActionType('edit charge');
      setChargeMemberStatus(false);
      setCreateCharge(true);
      // <ChargeFeeModal open={true} onClose={() => setCreateCharge(false)} />
      setLoading(false);
    }, 1000);
  };

  const handleSoftDelete = async () => {
    try {
      const response = await softDeleteChargeAction(chargeId);
      if (response.status === 200) {
        console.log('Charge soft-deleted successfully');
        // router.refresh(); // Refresh page to reflect the soft delete
      } else {
        console.error('Error during soft delete:', response.statusText);
      }
    } catch (error) {
      console.error('Error during soft delete:', error.message);
    }
    onClose();
  };

  const handleHardDelete = async () => {
    try {
      const response = await hardDeleteChargeAction(chargeId);
      if (response.status === 200) {
        console.log('Charge hard-deleted successfully');
        // router.refresh(); // Refresh page to reflect the hard delete
      } else {
        console.error('Error during hard delete:', response.statusText);
      }
    } catch (error) {
      console.error('Error during hard delete:', error.message);
    }
    onClose();
  };

  const handleDelete = () => {
    if (step === 4) {
      handleHardDelete(); // Perform hard delete if in deleted tab
    } else {
      handleSoftDelete(); // Perform soft delete for other tabs
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose} // Close modal when clicking outside or using the close button
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '90%', // 90% width for extra-small screens
            sm: '80%', // 80% width for small screens
            md: '60%', // 60% width for medium screens
            lg: '50%', // 50% width for large screens
          },
          maxWidth: '668px', // Limit the maximum width to 600px
          maxHeight: '90vh', // Limit modal height to 80% of viewport height
          bgcolor: 'background.paper',
          borderRadius: '20px',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto', // Add scrolling when content exceeds height

          '::-webkit-scrollbar': {
            width: '5px',
            height: '5px',
          },

          '::-webkit-scrollbar-thumb': {
            // backgroundColor: '#888',
            borderRadius: '10px',
            border: '2px solid transparent',
            height: '5px' /* Thumb height adjustment */,
          },
          '::-webkit-scrollbar-track': {
            borderRadius: '30px',
          },
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="modal-title" variant="h6" component="h2">
          Charges/Fees
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <CircularProgress size="3rem" />
          </Box>
        ) : (
          <FormProvider {...methods}>
            <form>
              {/* Name Field */}
              <Box className="input-group">
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Name"
                      type="text"
                      required={
                        chargeActionType === 'view charge' ? false : true
                      }
                      errorMessage={
                        errors.name ? String(errors.name.message) : undefined
                      }
                      placeholder="Enter fee name"
                      readOnly={
                        chargeActionType === 'view charge' ? true : false
                      }
                    />
                  )}
                />
              </Box>

              {/* Fee Description Field */}
              <Box className="input-group">
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Fee Description"
                      type="text"
                      required={
                        chargeActionType === 'view charge' ? false : true
                      }
                      errorMessage={
                        errors.description
                          ? String(errors.description.message)
                          : undefined
                      }
                      placeholder="Enter fee description"
                      multiline={true}
                      rows={3}
                      readOnly={
                        chargeActionType === 'view charge' ? true : false
                      }
                    />
                  )}
                />
              </Box>

              {/* Due Date Field */}
              <Box className="input-group">
                <Controller
                  name="dueDate"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <DatePickerField
                      {...field}
                      label="Due Date"
                      required={
                        chargeActionType === 'view charge' ? false : true
                      }
                      error={
                        errors.dueDate
                          ? String(errors.dueDate.message)
                          : undefined
                      }
                      value={
                        field.value
                          ? dayjs(field.value).format('YYYY-MM-DD')
                          : null
                      }
                      onChange={(newValue) =>
                        field.onChange(dayjs(newValue).format('YYYY-MM-DD'))
                      } // Format on change
                      readOnly={
                        chargeActionType === 'view charge' ? true : false
                      }
                      minDate={
                        chargeActionType === 'view charge' ? null : dayjs()
                      }
                    />
                  )}
                />
              </Box>

              {/* Amount Field */}
              <Box className="input-group">
                <Controller
                  name="amount"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Amount"
                      required={
                        chargeActionType === 'view charge' ? false : true
                      }
                      type="number"
                      errorMessage={
                        errors.amount
                          ? String(errors.amount.message)
                          : undefined
                      }
                      placeholder="Enter amount"
                      readOnly={
                        chargeActionType === 'view charge' ? true : false
                      }
                      disabled={
                        (checkPublished &&
                          chargeActionType === 'view charge' &&
                          chargeActionType !== 'copy charge') ||
                        chargeActionType === 'edit charge'
                          ? true
                          : false
                      }
                      style={{
                        backgroundColor:
                          checkPublished &&
                          chargeActionType !== 'view charge' &&
                          chargeActionType !== 'copy charge'
                            ? mode === 'light'
                              ? '#C5C5C5'
                              : '#535353' // Light mode vs dark mode background
                            : 'initial', // Fallback background if the conditions are false
                      }}
                    />
                  )}
                />
              </Box>

              {/* Fee Type Field */}

              <Box className="input-group">
                <Controller
                  name="feeType"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <ChargeDropDownField
                      {...field}
                      label="Fee Type"
                      required={
                        chargeActionType === 'view charge' ? false : true
                      }
                      errorMessage={
                        errors.feeType
                          ? String(errors.feeType.message)
                          : undefined
                      }
                      options={options}
                      values={selectedFeeType}
                      setSelectedFeeType={setSelectedFeeType}
                      setValue={setValue}
                      onCreateNew={(newOption) =>
                        handleCreateFeeType(newOption)
                      }
                      placeholder="Add or Select Fee Type"
                      readOnly={
                        chargeActionType === 'view charge' ? true : false
                      }
                      disabled={
                        chargeActionType === 'view charge' ? true : false
                      }
                      mode={mode}
                    />
                  )}
                />
              </Box>

              {/* Save Draft and Publish Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  mt: 3,
                }}
              >
                
                {((!chargeSection ) && chargeActionType !== 'view charge') && (
    <>
      <ButtonInput
        disabled={false}
        fontWeight={600}
        text="Save Draft"
        type="button"
        onClick={handleSaveDraft}
        styles={{
          width: 'fit-content',
          backgroundColor:
            mode === 'light' ? 'transparent' : 'transparent',
          color:
            mode === 'light'
              ? 'var(--tw-text-light-mainText)'
              : 'var(--tw-text-dark-mainText)',
          border: `1px solid ${
            mode === 'light'
              ? 'var(--tw-text-light-mainText)'
              : 'var(--tw-text-dark-mainText)'
          }`,
        }}
      />
      <ButtonInput
        disabled={false}
        fontWeight={600}
        text="Publish"
        type="button"
        onClick={handlePublish}
        styles={{
          width: 'fit-content',
          backgroundColor:
            mode === 'light'
              ? 'var(--tw-bg-light-main)'
              : 'var(--tw-bg-dark-main)',
          color:
            mode === 'light'
              ? 'var(--tw-bg-light-sidebar)'
              : 'var(--tw-text-dark-mainText)',
        }}
      />{' '}
    </>
  )}
                {((chargeActionType === 'create charge' ||
                  chargeActionType === 'copy charge' ||
                  chargeSection === 'draft' ) && ( chargeActionType !== 'view charge') )&& (
                  <>
                    <ButtonInput
                      disabled={false}
                      fontWeight={600}
                      text="Save Draft"
                      type="button"
                      onClick={handleSaveDraft}
                      styles={{
                        width: 'fit-content',
                        backgroundColor:
                          mode === 'light' ? 'transparent' : 'transparent',
                        color:
                          mode === 'light'
                            ? 'var(--tw-text-light-mainText)'
                            : 'var(--tw-text-dark-mainText)',
                        border: `1px solid ${
                          mode === 'light'
                            ? 'var(--tw-text-light-mainText)'
                            : 'var(--tw-text-dark-mainText)'
                        }`,
                      }}
                    />
                    <ButtonInput
                      disabled={false}
                      fontWeight={600}
                      text="Publish"
                      type="button"
                      onClick={handlePublish}
                      styles={{
                        width: 'fit-content',
                        backgroundColor:
                          mode === 'light'
                            ? 'var(--tw-bg-light-main)'
                            : 'var(--tw-bg-dark-main)',
                        color:
                          mode === 'light'
                            ? 'var(--tw-bg-light-sidebar)'
                            : 'var(--tw-text-dark-mainText)',
                      }}
                    />{' '}
                  </>
                )}

                {chargeSection === 'upcoming' &&
                  chargeActionType === 'view charge' && (
                    <>
                      <ButtonInput
                        disabled={false}
                        fontWeight={600}
                        text={'Edit'}
                        type="button"
                        onClick={handleEditCharge}
                        styles={{
                          width: 'fit-content',
                          backgroundColor: `${
                            mode === 'light' ? 'transparent' : 'transparent'
                          }`,
                          color: `${
                            mode === 'light'
                              ? 'var(--tw-text-light-mainText)'
                              : 'var(--tw-text-dark-mainText)'
                          }`,
                          border: `${
                            mode === 'light'
                              ? '1px solid var(--tw-text-light-mainText)'
                              : '1px solid var(--tw-text-dark-mainText)'
                          }`,
                        }}
                      />

                      <ButtonInput
                        disabled={false}
                        fontWeight={600}
                        text={'Delete'}
                        type="button"
                        onClick={handleDelete}
                        styles={{
                          width: 'fit-content',
                          backgroundColor: `${
                            // mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)'
                            '#FFEAEA'
                          }`,
                          color: `${
                            // mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)'
                            'red'
                          }`,
                        }}
                      />
                    </>
                  )}

                {(chargeSection === 'deleted') &&
                  chargeActionType === 'view charge' && (
                    <>
                      <ButtonInput
                        disabled={false}
                        fontWeight={600}
                        text={'Delete'}
                        type="button"
                        onClick={
                          chargeSection === 'past'
                            ? handleSoftDelete
                            : handleHardDelete
                        }
                        styles={{
                          width: 'fit-content',
                          backgroundColor: `${
                            // mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)'
                            '#FFEAEA'
                          }`,
                          color: `${
                            // mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)'
                            'red'
                          }`,
                        }}
                      />
                    </>
                  )}

                {chargeSection === 'upcoming' &&
                  chargeActionType === 'edit charge' && (
                    <>
                      <ButtonInput
                        disabled={false}
                        fontWeight={600}
                        text={'save Changes'}
                        type="button"
                        onClick={handlePublish}
                        styles={{
                          width: 'fit-content',
                          backgroundColor: `${
                            mode === 'light' ? 'transparent' : 'transparent'
                          }`,
                          color: `${
                            mode === 'light'
                              ? 'var(--tw-text-light-mainText)'
                              : 'var(--tw-text-dark-mainText)'
                          }`,
                          border: `${
                            mode === 'light'
                              ? '1px solid var(--tw-text-light-mainText)'
                              : '1px solid var(--tw-text-dark-mainText)'
                          }`,
                        }}
                      />
                    </>
                  )}

                {chargeSection === 'draft' &&
                  chargeActionType === 'view charge' && (
                    <>
                      <ButtonInput
                        disabled={false}
                        fontWeight={600}
                        text={'Edit'}
                        type="button"
                        onClick={handleEditCharge}
                        styles={{
                          width: 'fit-content',
                          backgroundColor: `${
                            mode === 'light' ? 'transparent' : 'transparent'
                          }`,
                          color: `${
                            mode === 'light'
                              ? 'var(--tw-text-light-mainText)'
                              : 'var(--tw-text-dark-mainText)'
                          }`,
                          border: `${
                            mode === 'light'
                              ? '1px solid var(--tw-text-light-mainText)'
                              : '1px solid var(--tw-text-dark-mainText)'
                          }`,
                        }}
                      />

                      <ButtonInput
                        disabled={false}
                        fontWeight={600}
                        text={'Delete'}
                        type="button"
                        onClick={handleSoftDelete}
                        styles={{
                          width: 'fit-content',
                          backgroundColor: `${
                            // mode === 'light' ? 'var(--tw-bg-light-main)' : 'var(--tw-bg-light-main)'
                            '#FFEAEA'
                          }`,
                          color: `${
                            // mode === 'light' ? 'var(--tw-bg-light-sidebar)' : 'var(--tw-bg-light-sidebar)'
                            'red'
                          }`,
                        }}
                      />
                      <ButtonInput
                        disabled={false}
                        fontWeight={600}
                        text="Publish"
                        type="button"
                        onClick={handlePublish}
                        styles={{
                          width: 'fit-content',
                          backgroundColor:
                            mode === 'light'
                              ? 'var(--tw-bg-light-main)'
                              : 'var(--tw-bg-dark-main)',
                          color:
                            mode === 'light'
                              ? 'var(--tw-bg-light-sidebar)'
                              : 'var(--tw-text-dark-mainText)',
                        }}
                      />
                    </>
                  )}
              </Box>
            </form>
          </FormProvider>
        )}
      </Box>
    </Modal>
  );
};

export default ChargeFeeModal;
