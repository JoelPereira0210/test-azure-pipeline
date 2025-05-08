import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { adddesignationAction, updatedesignationAction, deletedesignationAction } from '@/src/actions/designation';
import { designationSchema } from '@/src/lib/zod/designationZod';
import { Add_designationTypes as FormValues } from '@/src/lib/types/addDesignationTypes';
import ButtonInput from '../UI/Button/Button';
import { useTheme } from '@mui/material/styles';
import InputField from '../UI/InputField/InputField';
import DropdownField from '../UI/DropDownInputField/DropDownInputField';
import RadioButtonField from '../UI/RadioInputField/RadioInputField';
import ConfirmBoxModel from '../UI/Popup/ConfirmBoxModel';
import ErrorAlertModal from '../UI/Popup/ErrorAlertModal';
import AlertModal from '../UI/Popup/AlertPopUp';

 
interface SelectedDesignation {
  // designationId?: string;
  designationId: string;
  designationName: string;
  numberOfPositions: number;
  adminPrivileges: boolean;
}
 
interface Props {
  modalButtonAdd?: string;
  modalButtonCancel?: string;
  open?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  onDesignationDeleted?: (designationId: string) => void;
  onDesignationAdded?: (designation: SelectedDesignation) => void;
  selectedDesignation?: SelectedDesignation;
  setSelectedData?: (details: SelectedDesignation | null) => void;
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
 
 
 
const numberOfPositionsOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];
 
export default function Designation(props: Props) {
  const router = useRouter();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [addButtonText, setAddButtonText] = React.useState(props.modalButtonAdd);
  const [cancelButtonText, setCancelButtonText] = React.useState(props.modalButtonCancel); // State for cancel button text
  const [openDialog, setOpenDialog] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errormessage, setErrorMessage] = useState('')
  const [alertDeleteMessage, setAlertDeleteMessage] = useState(false)
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(designationSchema),
    defaultValues: props.selectedDesignation
      ? {
        designationName: props.selectedDesignation.designationName,
        numberOfPositions: props.selectedDesignation.numberOfPositions,
        adminPrivileges: props.selectedDesignation.adminPrivileges,
      }
      : {
        designationName: '',
        numberOfPositions: 1,
        adminPrivileges: true,
      },
  });
 
  const handleErrorModalClose = () => {
    setOpenErrorModal(false); // Close error modal
    setErrorMessage(''); // Clear error message
  };
 

 
 
 
  const onSubmit = async (data: FormValues) => {
    console.log(data);
    try {
      const payload = {
        ...data,
        designationId: props.selectedDesignation?.designationId || undefined,
      };
 
      let response: any;
 
      if (payload.designationId) {
        // Update the designation if it already exists using PATCH
        response = await updatedesignationAction(payload);
        console.log("Updating existing designation");

        if (response?.status === 704) {
          console.log("User not authorized to update this designation.");
          return; // Exit the function if 704 status is received
        }
        props.onClose();
        // Immediately update the state in the parent component
        props.onDesignationAdded({
          designationId: payload.designationId,
          designationName: data.designationName,
          numberOfPositions: data.numberOfPositions,
          adminPrivileges: data.adminPrivileges,
        });
      } else {
        // Create a new designation if it doesn't exist using POST
        response = await adddesignationAction(payload);
 
        console.log("Creating new designation");
      }
 
      console.log('response:s', response.status);
     
      if (response?.status === 409) { // Assuming 409 means the designation already exists
        setErrorMessage("This designation already exists."); // Set error message
        setOpenErrorModal(true); // Open error modal
        return; // Exit early
      }
 
      if (response?.status === 201) {
        console.log('Designation added/updated, response:', response);
        reset({
          designationName: '',
          numberOfPositions: 1,
          adminPrivileges: true,
        }); // Reset form fields to default values
        props.onClick();
        props.onClose();
      } else {
        console.log('Adding/updating designation failed, response:', response);
        props.setSelectedData?.(null)
      }
      console.log("res",response.status)
    } catch (error) {
      console.error('Error during designation addition:', error);
    }
  };
 
  const handleDelete = async () => {
    console.log('Delete clicked');
 
    try {
      if (props.selectedDesignation?.designationId) {
        const response = await deletedesignationAction(props.selectedDesignation.designationId);
        console.log("response for delte",response.status)
        if (response?.status === 200) {
          console.log('Designation deleted successfully');
          props.onDesignationDeleted(props.selectedDesignation.designationId);
          reset({
            designationName: '',
            numberOfPositions: 1,
            adminPrivileges: true,
          });
          props.setSelectedData?.(null);
          props.onClose();
          setOpenDialog(false);
        } else if (response?.status === 207) {
          console.error('Deletion blocked:', response.data);
          setAlertDeleteMessage(true)
          // alert(`Cannot delete this designation as it is referenced by users with IDs: ${response.data}`);
        } else {
          console.error('Failed to delete designation:', response);
        }
      }
    } catch (error) {
      console.error('Error during designation deletion:', error);
    }
  };
  const handleAlertModalClose = () => {
    setAlertDeleteMessage(false);
  };
  const handleCancel = () => {
    reset({
      designationName: '',
      numberOfPositions: 1,
      adminPrivileges: true,
    });
 
    props.setSelectedData?.(null);
    props.onClose();
    setCancelButtonText(props.modalButtonCancel); // Reset cancel button text
  };
 
  React.useEffect(() => {
    if (props.selectedDesignation) {
      setAddButtonText('Update'); // If editing, set button to "Update"
    } else {
      setAddButtonText('Add'); // Otherwise, keep it as "Add"
    }
 
    if (props.open) {
      setCancelButtonText(props.modalButtonCancel); // Reset to default when opening
    }
  }, [props.selectedDesignation, props.open, props.modalButtonCancel]);
 
 
  return (
    <>
      <Modal
        open={props.open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
            Add Designation
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="designationName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <InputField
                    type='text'
                    label={'Designation Name'}
                    {...field}
                    required={true}
                    placeholder="Designation Name"
                    errorMessage={errors.designationName?.message}
                  />
                )}
              />
 
 
              <Controller
                name="numberOfPositions"
                control={control}
                render={({ field, fieldState }) => (
                  <DropdownField
                    label="Number of Positions"
                    options={numberOfPositionsOptions}
                    {...field}
                    // error={fieldState.error} // Updated to convert error to boolean
                    style={{ height: '3.5rem' }}
                  />
                )}
              />
 
 
 
 
              <Controller
                name="adminPrivileges"
                control={control}
                render={({ field: { onChange, value, name } }) => (
                  <RadioButtonField
                    label="Admin"
                    options={[
                      { label: 'Yes', value: 'true' }, // Use string 'true'
                      { label: 'No', value: 'false' }, // Use string 'false'
                    ]}
                    error={errors.adminPrivileges?.message}
                    value={value ? 'true' : 'false'} // Convert value to string for RadioButtonField
                    onChange={(event) => {
                      const newValue = event.target.value === 'true'; // Convert string back to boolean
                      onChange({ target: { name, value: newValue } }); // Pass the converted boolean value
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
                  text={cancelButtonText} // Use state variable for button text
                  type="button"
                  onClick={() => {
                    if (cancelButtonText === "Cancel") {
                      handleCancel(); // Call handleCancel if the button text is "Cancel"
                    } else {
                      setOpenDialog(true); // Otherwise, call handleDelete
                    }
                  }}
                  styles={{
                    flex: 1,
                    backgroundColor: '#A2A1A833',
                    color:
                      mode === 'light'
                        ? 'var(--tw-text-light-mainText)'
                        : 'var(--tw-text-dark-mainText)',
                    '&:hover': {
                      backgroundColor: '#A2A1A833',
                    },
                  }}
                />
 
                <ButtonInput
                  text={addButtonText}
                  type="submit"
                  styles={{ flex: 1 }}
                />
              </Box>
            </form>
          </Box>
        </Box>
 
      </Modal>
      <ConfirmBoxModel
        open={openDialog}
        title="Confirm Deletion"
        description="Are you sure you want to delete this member?"
        onAgree={handleDelete} // This will call the handleDelete function
        onDisagree={() => setOpenDialog(false)} // Close dialog on disagree
        onClose={() => setOpenDialog(false)} // Also close dialog on close
        agreeText="Yes, Delete"
        disagreeText="No, Cancel"
      />
 
      <ErrorAlertModal
        open={openErrorModal}
        errorMessage={errormessage}
        onClose={handleErrorModalClose}
      />

<AlertModal
        open={alertDeleteMessage}
        onClose={()=>{handleAlertModalClose();setOpenDialog(false)}}
        title="To delete the designation, remove assignments of people from the designation and try again."
        buttonText="Close"
      />
    </>
  );
}


