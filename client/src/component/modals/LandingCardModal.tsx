'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Button } from '@mui/material';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import InputField from '../UI/InputField/InputField';
import DropdownField from '../UI/DropDownInputField/DropDownInputField';
import { deleteLandingCardMediaAction } from '@/src/actions/landingPage';
import TextEditor from '../UI/TextEditor/TextEditor';
import { zodResolver } from '@hookform/resolvers/zod';
import { landingCardSchema } from '@/src/lib/zod/superAdmin';
import MobileInput from '../UI/MobileInput/MobileInput';
const LandingCardModal = ({
  open,
  onClose,
  onCreate,
  onEdit,
  data,
  isViewMode,
}) => {
  const methods = useForm({
    resolver: zodResolver(landingCardSchema),
    defaultValues: {
      cardTitle: '',
      cardSubTitle: '',
      cardDescription: '',
      buttonText: '',
      email: null,
      type: 'GENERIC',
      phoneNumber: null,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageData, setSelectedImageData] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const fileInputRef = React.useRef(null);

  const handleRemoveImage = async () => {
    try {
      if (data?.imageId) {
        console.log('Removing image with ID:', data.imageId);

        // Call the delete action
        const response = await deleteLandingCardMediaAction(data.imageId);
        console.log('handleRemoveImage response', response);
        console.log('handleRemoveImage response status', response.status);
        if (response.status === 200) {
          console.log('Media deleted successfully');

          // Remove image from `data` and reset form
          const updatedData = { ...data, imageBase64: null, imageId: null };
          reset(updatedData); // Reset the form with updated data

          // Update state
          setSelectedImage(null);
          setSelectedImageData(null);
          setRemoveImage(true);

          // Notify parent or trigger re-render if needed
          if (onEdit) {
            onEdit(updatedData);
          }
        }
      } else if (fileInputRef.current) {
        fileInputRef.current.value = '';
        setSelectedImage(null);
        setSelectedImageData(null);
        setRemoveImage(true);
      } else {
        console.error('Failed to delete media:');
      }
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  // Handle Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Reset error
    const file = event.target.files?.[0];

    if (file) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSizeInBytes) {
        setError('Max image upload size is 5 MB');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedImageData(file);
    }
  };

  // Populate form and image on modal open
  useEffect(() => {
    if (data) {
      reset(data); // Populate the form with existing data
      if (data.imageBase64) {
        setSelectedImage(`data:image/png;base64,${data.imageBase64}`); // Set the image for editing
      } else {
        setSelectedImage(null); // Clear image if removed
      }
    } else {
      reset({
        cardTitle: '',
        cardSubTitle: '',
        cardDescription: '',
        buttonText: '',
        email: null,
        type: 'GENERIC',
        phoneNumber: null,
      });
      setSelectedImage(null); // Reset image
    }
  }, [data, reset]);

  const handleFormSubmit = async (formData) => {
    if (removeImage) {
      formData.imageBase64 = null; // Clear imageBase64 if image is removed
      setRemoveImage(false); // Reset the removeImage flag
    } else if (selectedImageData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64Data = reader.result.split(',')[1]; // Remove prefix and get Base64 content
          formData.imageBase64 = base64Data;
        } else {
          console.error('FileReader result is not a string');
          return;
        }

        if (data) {
          console.log('edit landing card with ID:', data.id);
          onEdit({ ...formData, id: data.id }); // Include ID for editing
        } else {
          onCreate(formData); // Create new card
        }
        // reset();
        resetFormState();
        onClose(); // Close modal after submit
      };
      reader.readAsDataURL(selectedImageData);
      return; // Exit early to allow FileReader to process
    } // If no image changes, proceed as usual
    if (data) {
      onEdit({ ...formData, id: data.id }); // Include ID for editing
    } else {
      onCreate(formData); // Create new card
    }
    // reset();
    resetFormState();
    onClose(); // Close modal after submit
  };

  const handleClose = () => {
    reset(); // Reset form
    setSelectedImage(null); // Clear image
    setSelectedImageData(null); // Clear file
    setRemoveImage(false);
    onClose(); // Trigger parent modal close
  };

  const resetFormState = () => {
    reset(); // Reset form fields
    setSelectedImage(null); // Clear selected image
    setSelectedImageData(null); // Clear file data
    onClose(); // Close modal after reset
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          padding: 3,
          borderRadius: 2,
          boxShadow: 24,
          width: { xs: '80%', sm: '80%', md: '90%', lg: '90%', xl: '90%' },
          maxWidth: 500,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" mb={2}>
          {isViewMode
            ? 'View Landing Card'
            : data
            ? 'Edit Landing Card'
            : 'Create Landing Card'}
        </Typography>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Box mb={5}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <DropdownField
                    {...field}
                    label="Type"
                    required={!isViewMode}
                    readOnly={isViewMode}
                    options={[
                      { value: 'HEADER', label: 'Header' },
                      { value: 'DISCOVER', label: 'Discover' },
                      { value: 'ABOUT_US', label: 'About Us' },
                      { value: 'PLANS', label: 'Plans' },
                      { value: 'GENERIC', label: 'Generic' },
                      { value: 'CONTACT', label: 'Contact us' },
                    ]}
                  />
                )}
              />
            </Box>

            <Box mb={2}>
              <Controller
                name="cardTitle"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Card Title"
                    type="string"
                    readOnly={isViewMode}
                  />
                )}
              />
            </Box>

            <Box mb={2}>
              <Controller
                name="cardSubTitle"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Card Subtitle"
                    type="string"
                    readOnly={isViewMode}
                  />
                )}
              />
            </Box>

            <Box mb={2}>
              <Controller
                name="cardDescription"
                control={control}
                render={({ field }) => (
                  <TextEditor
                    {...field}
                    label={
                      watch('type') === 'CONTACT'
                        ? 'Address'
                        : 'Card Description'
                    }
                    required={false}
                    readOnly={isViewMode}
                  />
                )}
              />
            </Box>

            <Box mb={2}>
              <Controller
                name="buttonText"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Button Text"
                    type="string"
                    readOnly={isViewMode}
                  />
                )}
              />
            </Box>

            {watch('type') === 'CONTACT' && (
              <>
                <Box mb={2}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        label="Email"
                        type="string"
                        readOnly={isViewMode}
                        errorMessage={
                          errors.email
                            ? String(errors.email.message)
                            : undefined
                        }
                      />
                    )}
                  />
                </Box>

                <Box mb={2}>
                <Controller
                      name="phoneNumber"
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
                          error={errors.phoneNumber ? String(errors.phoneNumber.message) : undefined} // Cast to string or use undefined
                          readOnly={isViewMode}
                          country="IN"
                        />
                      )}
                    />
                </Box>
              </>
            )}

            {!isViewMode && watch('type') !== 'CONTACT' && (
              <Box mb={2} mt={2}>
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                  style={{
                    width: '100%',
                    marginBottom: '8px',
                    marginTop: '5%',
                  }}
                />
                {error && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ marginTop: '8px' }}
                  >
                    {error}
                  </Typography>
                )}
              </Box>
            )}

            {/* Display image for view or edit */}
            {isViewMode && watch('type') !== 'CONTACT' ? (
              data?.imageBase64 && (
                <Box mb={2} mt={2}>
                  <img
                    src={`data:image/png;base64,${data.imageBase64}`}
                    alt="Card"
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'contain',
                      display: 'inline-block',
                      marginBottom: '8px',
                      marginTop: '8px',
                    }}
                  />
                </Box>
              )
            ) : (
              <Box mb={2} mt={2}>
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    style={{
                      width: '100%',
                      height: '150px',
                      display: 'inline-block',
                      objectFit: 'contain',
                      marginBottom: '8px',
                      marginTop: '8px',
                    }}
                  />
                ) : (
                  data?.imageBase64 && (
                    <img
                      src={`data:image/png;base64,${data.imageBase64}`}
                      alt="Card"
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'contain',
                        display: 'inline-block',
                        marginBottom: '8px',
                        marginTop: '8px',
                      }}
                    />
                  )
                )}
              </Box>
            )}

            {selectedImage || data?.imageBase64 ? (
              <Box mt={2} sx={{ margin: 'auto' }}>
                {!isViewMode && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </Button>
                )}
              </Box>
            ) : null}

            {!isViewMode && (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ marginTop: '3%' }}
              >
                {data ? 'Update' : 'Create'}
              </Button>
            )}
          </form>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default LandingCardModal;
