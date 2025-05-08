import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Box, Button, Typography, useTheme } from '@mui/material';
import InputField from '../UI/InputField/InputField';
import { useForm, Controller } from 'react-hook-form';
import React, { useState, useEffect, useContext } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { createSubscriptionSchema } from '@/src/lib/zod/superAdmin';
import { CreateSubscriptionTypes as FormValues } from '@/src/lib/types/superAdminTypes';
import ButtonInput from '../UI/Button/Button';

import { CancelOutlined } from '@mui/icons-material';
import { createSubscriptionAction, deleteSubscriptionAction, updateSubscriptionAction } from '@/src/actions/superAdmin';
import { SubscriptionsContext } from '../context/SubscriptionContext';
import TextArea from '../UI/TextArea/TextArea';

const SubscriptionModal = ({
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
  const [addButtonText, setAddButtonText] = useState("props.modalButtonAdd");
  const [cancelButtonText, setCancelButtonText] = useState("props.modalButtonCancel"); // State for cancel button text
  const [openDialog, setOpenDialog] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errormessage, setErrorMessage] = useState('')
  const { createSubscription, setCreateSubscription, setSubscriptionActionType, SubscriptionActionType, setSubscriptionId, subscriptionActionType, editSubscriptionData, setEditSubscriptionData, setFetchData } = useContext(SubscriptionsContext);
  const [isPublished, setIsPublished] = useState(editSubscriptionData ? editSubscriptionData.shouldPublish : false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      planName: editSubscriptionData?.planName,
      planDescription: editSubscriptionData?.planDescription,
      duration: editSubscriptionData?.duration,
      maxUsers: editSubscriptionData?.maxUsers,
      amount: editSubscriptionData?.price,
      shouldPublish: editSubscriptionData?.shouldPublish
    }
  });

  const handleErrorModalClose = () => {
    setOpenErrorModal(false); // Close error modal
    setErrorMessage(''); // Clear error message
  };
  const onSubmit = async (data: FormValues) => {
    console.log("On Submit", data);
    try {
      let response;
      if (editSubscriptionData) {
        const payload = {
          subscriptionId: editSubscriptionData?.subscriptionId,
          ...data

        }
        console.log("payload", payload)
        response = await updateSubscriptionAction(payload)
      }
      else {
        const payload = {
          ...data
        }
        response = await createSubscriptionAction(payload)
      }
      if (response?.status === 200) {
        setFetchData(true);
        if (editSubscriptionData) {
          reset({
            planName: '',
            planDescription: '',
            duration: '',
            maxUsers: '',
            amount: ''
          });
          setEditSubscriptionData(null)
        }
        onClose();
      }
    } catch (error) {
      console.log("error", error)
    }
  };

  const handleDelete = async () => {
    console.log('Delete clicked');
  };

  const handleCancel = () => {
    reset({
      planName: '',
      planDescription: '',
      duration: '',
      maxUsers: '',
      amount: ''
    });
    setEditSubscriptionData(null)
    onClose();
  };
  console.log("errors", errors)
  return (
    <Popup
      className='subscription-modal'
      closeOnDocumentClick={false}
      position="right center"
      modal
      onClose={handleCancel}
      open={open}
      contentStyle={{
        backgroundColor: mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-dark-background)',
        border: 'none'
      }}
    // {...{ contentStyle }}
    >
      <Box sx={{
        padding: '10px 20px',
        backgroundColor: mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-dark-background)'
      }}
        className="all-content"
      >
        <Box className="header">
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
            {editSubscriptionData ? 'Edit Subscription' : 'Create Subscription'}
          </Typography>
          <Box
            onClick={handleCancel}
          >
            <CancelOutlined />
          </Box>
        </Box>
        {/* )} */}
        <Box sx={{ marginTop: '1.4rem' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="planName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <InputField
                  type='text'
                  label={'Plan Name'}
                  {...field}
                  required={true}
                  placeholder="Plan Name"
                  disabled={editSubscriptionData?.isDeleted === "SOFT_DELETED"} // Disable if in delete action
                  errorMessage={errors.planName?.message}
                />
              )}
            />
            <Controller
              name="planDescription"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextArea
                  type='text'
                  label={'Plan Description'}
                  {...field}
                  required={true}
                  placeholder="Plan Description"
                  disabled={editSubscriptionData?.isDeleted === "SOFT_DELETED"} // Disable if in delete action
                  error={errors.planDescription?.message}
                />
              )}
            />

            <Controller
              name="duration"
              control={control}
              render={({ field, fieldState }) => (
                <InputField
                  type='number'
                  label={'Duration'}
                  {...field}
                  required={true}
                  placeholder="Duration"
                  disabled={editSubscriptionData?.isDeleted === "SOFT_DELETED"} // Disable if in delete action
                  errorMessage={errors.duration?.message}
                />
              )}
            />




            <Controller
              name="maxUsers"
              control={control}
              render={({ field, fieldState }) => (
                <InputField
                  type='number'
                  label={'Max Users'}
                  {...field}
                  required={true}
                  placeholder="Max Users"
                  disabled={editSubscriptionData?.isDeleted === "SOFT_DELETED"} // Disable if in delete action
                  errorMessage={errors.maxUsers?.message}
                />
              )}
            />
            <Controller
              name="amount"
              control={control}
              render={({ field, fieldState }) => (
                <InputField
                  type='number'
                  label={`Amount (\u20B9)`}
                  {...field}
                  required={true}
                  placeholder="Amount"
                  disabled={editSubscriptionData?.isDeleted === "SOFT_DELETED"} // Disable if in delete action
                  errorMessage={errors.amount?.message}
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
                  flexDirection: 'column'
                }
              }}
            >
              {editSubscriptionData?.shouldPublish !== true && editSubscriptionData?.isDeleted !== "SOFT_DELETED" &&
                (
                  <>
                    {buttonOneText &&
                      <ButtonInput
                        type='button'
                        text={buttonOneText}
                        onClick={handleSubmit((data) => {
                          onSubmit({
                            ...data,
                            shouldPublish: false
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
                      }
                  </>
                )}
              {editSubscriptionData && (<>

                {buttonTwoText && <ButtonInput
                  type='button'
                  text={buttonTwoText}
                  onClick={async () => {
                    let isDeleted
                    if (editSubscriptionData?.isDeleted === "SOFT_DELETED") {
                      isDeleted = "HARD_DELETED"
                    }
                    else {
                      isDeleted = "SOFT_DELETED"
                    }
                    console.log("isDeleted", isDeleted)
                    await deleteSubscriptionAction(editSubscriptionData.subscriptionId, { isDeleted })
                    setFetchData(true);
                    reset({
                      planName: '',
                      planDescription: '',
                      duration: '',
                      maxUsers: '',
                      amount: ''
                    });
                    setEditSubscriptionData(null)
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
                />}
              </>)}


              {buttonThreeText && editSubscriptionData?.isDeleted !== "SOFT_DELETED" &&
                <ButtonInput
                  styles={{
                    maxWidth: '210px'
                  }}
                  text={editSubscriptionData?.shouldPublish === true ? 'Update' : buttonThreeText}
                  type='button'
                  onClick={handleSubmit((data) => {
                    onSubmit({
                      ...data,
                      shouldPublish: true
                    });
                  })}
                />
              }

            </Box>
          </form>
        </Box>
      </Box>
    </Popup>
  )
}
export default SubscriptionModal