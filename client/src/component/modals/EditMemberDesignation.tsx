'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { fetchDesignationData, updateAdminStatus, updateDesignation } from '@/src/actions/designation';
import { zodResolver } from '@hookform/resolvers/zod';
import { designationSchema } from '@/src/lib/zod/designationZod';
// import { updateDesignationDataOfMember } from '@/src/actions/designation';
import ButtonInput from '../UI/Button/Button';
import { useTheme } from '@mui/material/styles';
import InputField from '../UI/InputField/InputField';
import RadioButtonField from '../UI/RadioInputField/RadioInputField';
import DropdownField from '../UI/DropDownInputField/DropDownInputField';
import ErrorAlertModal from '../UI/Popup/ErrorAlertModal';
import toast from 'react-hot-toast';
import { isAborted } from 'zod';

interface FormValues {
  designationName: string;
  adminPrivileges: boolean;
}

interface Props {
  modalButtonAdd?: string;
  modalButtonCancel?: string;
  open?: boolean;
  fetchData?: () => void;
  onClose?: () => void;
  onClick?: (data: FormValues) => void; // Make sure this receives the form data
  memberDetails: {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isAdmin: boolean;
  } | null;
  selectedDesignation?: { designationName: string };
  CancelIcon?: React.ReactNode;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  '@media (max-width: 600px)': {
    width: '95%',
    p: 2,
    marginTop: '-11%',
  },
};

export default function EditMemberDesignation(props: Props) {
  const [designationNameOptions, setDesignationNameOptions] = useState<
    string[]
  >([]);
  const [showAlertPopUp, setShowAlertPopUp] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      designationName: props.selectedDesignation?.designationName || '',
      adminPrivileges: props.memberDetails?.isAdmin || false,
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
    }
  }, [errors]);
  console.log('details in edit', props.memberDetails);

  // Fetching designations asynchronously
  const handleDesignation = async () => {
    try {
      const response = await fetchDesignationData();
      if (response && response.length > 0) {
        setDesignationNameOptions(response.map((item) => item.designationName));
      }
    } catch (error) {
      console.error('Error fetching designation data:', error);
    }
  };

  // const handleSave = async (data: FormValues) => {
  //   console.log('Form handleSave function called');
  //   console.log('Form data submitted:', data);

  //   // Ensure userId is defined
  //   const userId = props.memberDetails?.userId;
  //   if (!userId) {
  //     console.error('User ID is undefined. Please check the member details.');
  //     return; // Exit early if userId is not defined
  //   }

  //   try {
  //     // Call with both arguments
  //     const status = await updateDesignationDataOfMember(
  //       {
  //         designationName: data.designationName,
  //         isAdmin: data.adminPrivileges,
  //       },
  //       userId
  //     ); // Ensure userId is passed here

  //     if (status === 203) {
  //       setShowAlertPopUp(true);
  //     } else if (status === 200) {
  //       console.log('Designation updated successfully.');
  //       props.onClose?.();
  //       toast.success('Data updated successfully');
  //       props.fetchData?.();
  //       window.location.reload();
  //     }

  //     props.onClick?.(data);
  //   } catch (error) {
  //     console.error('Error while saving designation data:', error);
  //   }
  // };


  const handleSave = async (data) => {
    const { designationName, adminPrivileges } = data;
    const userId = props.memberDetails?.userId;
  
    try {
      // Update designation separately
      const designationStatus = await updateDesignation(designationName, userId);
  
      // Update admin status separately
      const adminStatus = await updateAdminStatus(adminPrivileges, userId);
      if (designationStatus === 200 ) {
        // toast.success('Designation data updated successfully');
        props.fetchData?.();
        props.onClose?.();
        window.location.reload();

      }
      if ( adminStatus === 200) {
        // toast.success('Admin data updated successfully');
        props.fetchData?.();
        props.onClose?.();
        window.location.reload();

      }
      if (designationStatus === 200 && adminStatus === 200) {
        // toast.success('Data updated successfully');
        props.fetchData?.();
        props.onClose?.();
        window.location.reload();

      }
    } catch (error) {
      console.error('Error updating data:', error);
      toast.error('Failed to update data. Please try again.');
    }
  };
  
  useEffect(() => {
    handleDesignation();
  }, []);

  // Reset form when props change
  useEffect(() => {
    reset({
      designationName: props.selectedDesignation?.designationName || '',
      adminPrivileges: props.memberDetails?.isAdmin || false,
    });
  }, [props.selectedDesignation, props.memberDetails, reset]);

  const handleCancel = () => {
    reset(); // Reset form on cancel
    props.onClose?.(); // Call onClose prop
  };

  const handleErrorModalClose = () => {
    setShowAlertPopUp(false);
    props.fetchData?.();
  };

  const fullName = props.memberDetails
    ? `${props.memberDetails.firstName} ${props.memberDetails.lastName}`
    : 'Member Details Not Available';

  return (
    <>
      <Modal
        open={props.open}
        // onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            {fullName}
          </Typography>

          {props.CancelIcon && (
            <Box
              onClick={handleCancel}
              sx={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                cursor: 'pointer',
              }}
            >
              {props.CancelIcon}
            </Box>
          )}

          <Box sx={{ marginTop: '1.4rem' }}>
            <form onSubmit={handleSubmit(handleSave)}>
              <Controller
                name="designationName"
                control={control}
                render={({ field }) => (
                  <DropdownField
                  label="Designation Name"
                  options={[
                    { label: 'Member', value: 'member' }, // Additional 'Member' option
                    ...designationNameOptions.map((name) => ({
                      label: name,
                      value: name,
                    })),
                  ]}
                  {...field}
                  style={{ height: '3.5rem' }}
                  onChange={(e) => {
                    field.onChange(e);
                    console.log('Designation Name changed:', e.target.value); // Log field changes
                  }}
                />
                
                )}
              />

              <Controller
                name="adminPrivileges"
                control={control}
                render={({ field }) => (
                  <RadioButtonField
                    label="Admin"
                    options={[
                      { label: 'Yes', value: 'true' },
                      { label: 'No', value: 'false' },
                    ]}
                    value={field.value ? 'true' : 'false'}
                    onChange={(event) => {
                      field.onChange(event.target.value === 'true');
                      console.log(
                        'Admin Privileges changed:',
                        event.target.value
                      ); // Log field changes
                    }}
                  />
                )}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                  marginTop: '16px',
                }}
              >
                <ButtonInput
                  text="Cancel"
                  type="button"
                  onClick={handleCancel}
                  styles={{ flex: 1 }}
                />
                <ButtonInput text="Save" type="submit" styles={{ flex: 1 }} />
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
      <ErrorAlertModal
        open={showAlertPopUp}
        errorMessage="No positions available"
        onClose={handleErrorModalClose}
      />
    </>
  );
}
