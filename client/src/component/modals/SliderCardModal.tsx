'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Button } from '@mui/material';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import InputField from '../UI/InputField/InputField';
import TextEditor from '../UI/TextEditor/TextEditor';
import {
  deleteSliderCardMediaAction,
  fetchLandingCardsAction,
} from '@/src/actions/landingPage';
import DropdownField from '../UI/DropDownInputField/DropDownInputField';

const SliderCardModal = ({
  open,
  onClose,
  onCreate,
  onEdit,
  data,
  isViewMode,
}) => {
  const methods = useForm({
    defaultValues: {
      cardTitle: '',
      cardSubTitle: '',
      cardDescription: '',
      highlightText: '',
      source: '',
      linkedLandingCardId: null,
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageData, setSelectedImageData] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [landingCards, setLandingCards] = useState([]);

  const fileInputRef = React.useRef(null);

  // Fetch Landing Cards
  useEffect(() => {
    const getLandingCards = async () => {
      try {
        const response = await fetchLandingCardsAction(); // Fetch landing cards from backend
        console.log('landingCard dropdown for slider', response);
        if (response.length > 0) {
          setLandingCards(response); // Set landing cards data
        }
      } catch (error) {
        console.error('Error fetching landing cards:', error);
      }
    };

    if (open) {
      getLandingCards(); // Fetch cards when modal opens
    }
  }, [open]);

  // Handle Remove Image
  const handleRemoveImage = async () => {
    try {
      if (data?.imageId) {
        console.log('Removing image from sliderCard with ID: ', data.imageId);

        const response = await deleteSliderCardMediaAction(data.imageId); // Call backend delete action
        console.log('handleRemoveImage response', response);
        console.log('handleRemoveImage response status', response.status);

        if (response.status === 200) {
          console.log('Media deleted successfully');

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

  // Reset Form on Modal Open
  useEffect(() => {
    if (data) {
      //data got from parent props
      console.log('Data passed to SliderCardModal:', data);
      // setValue('linkedLandingCardId', data.landingCardId);
      reset(data); // Populate form with existing data for editing
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
        highlightText: '',
        source: '',
        linkedLandingCardId: null,
      }); // Clear form for new creation
      setSelectedImage(null); // Reset image
    }
  }, [data, reset]);

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        linkedLandingCardId: data.landingCardId || null, // Use the existing linkedLandingCardId or default to ''
      });
    }
  }, [data, reset]);

  // Form Submission Handler
  const handleFormSubmit = async (formData) => {
    console.log('form data of slider card', formData);

    if (removeImage) {
      formData.imageBase64 = null; // Clear imageBase64 if image is removed
      setRemoveImage(false);
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
          onEdit({ ...formData, id: data.id });
        } else {
          onCreate(formData);
        }
        resetFormState();
        onClose();
      };
      reader.readAsDataURL(selectedImageData);
      return;
    }
    if (data) {
      onEdit({ ...formData, id: data.id });
    } else {
      onCreate(formData);
    }
    resetFormState();
    onClose();
  };

  // Helper function to reset form and image states
  const resetFormState = () => {
    reset(); // Reset form fields
    setSelectedImage(null); // Clear selected image
    setSelectedImageData(null); // Clear file data
    onClose(); // Close modal after reset
  };

  const handleClose = () => {
    reset(); // Reset form
    setSelectedImage(null); // Clear image
    setSelectedImageData(null); // Clear file
    setRemoveImage(false);
    onClose(); // Trigger parent modal close
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
            ? 'View Slider Card'
            : data
            ? 'Edit Slider Card'
            : 'Create Slider Card'}
        </Typography>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Box mb={2}>
              <Controller
                name="cardTitle"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    type="string"
                    label="Card Title"
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
                    type="string"
                    label="Card Subtitle"
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
                    label="Card Description"
                    required={false}
                    readOnly={isViewMode}
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Controller
                name="highlightText"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    type="string"
                    label="Highlight Text"
                    readOnly={isViewMode}
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Controller
                name="source"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    type="string"
                    label="Source"
                    readOnly={isViewMode}
                  />
                )}
              />
            </Box>

            <Box mb={2}>
              <Controller
                name="linkedLandingCardId" // Dropdown field for linking landing card
                control={control}
                render={({ field }) => (
                  <DropdownField
                    {...field}
                    // value={field.value} // Bind the value dynamically
                    label="Link to Landing Card"
                    options={landingCards.map((card) => ({
                      value: card.landingCardId,
                      label: card.cardTitle,
                    }))}
                    onChange={(e) => {
                      const newValue = e.target.value; // Get the new value from the event
                      console.log('newValue', newValue);
                      field.onChange(newValue);
                    }}
                    readOnly={isViewMode}
                  />
                )}
              />
            </Box>

            {!isViewMode && (
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
            {isViewMode ? (
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

export default SliderCardModal;
