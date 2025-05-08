'use client';

import React, { useState, useEffect } from 'react';
import './style.scss';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from '@mui/material';
import parse from 'html-react-parser';
import { Edit, Delete, Visibility } from '@mui/icons-material'; // Import icons
import LandingCardModal from '@/src/component/modals/LandingCardModal';
import SliderCardModal from '@/src/component/modals/SliderCardModal';
import {
  createLandingCardAction,
  createSliderCardAction,
  deleteLandingCardAction,
  deleteSliderCardAction,
  editLandingCardAction,
  editSliderCardAction,
  fetchLandingCardsAction,
  fetchSliderCardsAction,
} from '@/src/actions/landingPage';
import FilterListTable from '@/src/component/UI/Tables/FilterListTable';
import ViewTab from '@/src/component/Tabs/ViewTab';
import ConfirmBoxModel from '@/src/component/UI/Popup/ConfirmBoxModel';
import ButtonInput from '@/src/component/UI/Button/Button';
import { useTheme } from '@mui/material';
import PaginationFooter from '@/src/component/UI/TableFooter/TableFooter';
const LandingCards = () => {
  const [isLandingCardModalOpen, setIsLandingCardModalOpen] = useState(false);
  const [isSliderCardModalOpen, setIsSliderCardModalOpen] = useState(false);
  const [landingCards, setLandingCards] = useState([]);
  const [sliderCards, setSliderCards] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loader
  const [step, setStep] = useState(1); // Step to track tab selection
  const [selectedCard, setSelectedCard] = useState(null); // State to track selected card data
  const [isViewMode, setIsViewMode] = useState(false); // To track view mode
  const [openDialog, setOpenDialog] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null); // Track card ID and type for deletion
  const [deletingCardType, setDeletingCardType] = useState(null); // 'landing' or 'slider'

  const [currentPage, setCurrentPage] = useState(0);
const pageSize = 10;
const [totalRecords, setTotalRecords] = useState(0);


  const theme = useTheme();
  const mode = theme.palette.mode;

  // Fetch data based on the active tab (step)

    const fetchData = async (page=0) => {
      setLoading(true);
      try {
        const limit = pageSize;
    const offset = page * limit;

        if (step === 1) {
          const response = await fetchLandingCardsAction(limit, offset);
          console.log('landing card response', response);
          setLandingCards(response || []);
          setTotalRecords(response[0].totalRecords||5);
        } else if (step === 2) {
          const response = await fetchSliderCardsAction(limit, offset);
          console.log('slider card response', response);
          setSliderCards(response || []);
          setTotalRecords(response[0].totalRecords||5);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData(currentPage);
    }, [step, currentPage]);
    

  const handleCreateLandingCard = async (formData) => {
    try {
      await createLandingCardAction(formData); // Replace with your API call
      setIsLandingCardModalOpen(false);
      const updatedData = await fetchLandingCardsAction(); // Refresh data
      setLandingCards(updatedData || []); // Update state with new data
    } catch (error) {
      console.error('Error creating Landing Card:', error);
    }
  };

  const handleCreateSliderCard = async (formData) => {
    try {
      const response = await createSliderCardAction(formData);
      setIsSliderCardModalOpen(false);
      const updatedData = await fetchSliderCardsAction(); // Refresh data
      setSliderCards(updatedData || []); // Update state with new data
    } catch (error) {
      console.error('Error creating Slider Card:', error);
    }
  };

  const handleEditLandingCard = async (card) => {
    setSelectedCard(card); // Set the selected card for editing
    setIsViewMode(false); // Disable view-only mode
    setIsLandingCardModalOpen(true); // Open the modal
  };

  const handleEditSliderCard = async (card) => {
    setSelectedCard(card); // Set the selected card for editing
    setIsViewMode(false); // Disable view-only mode
    setIsSliderCardModalOpen(true); // Open the modal
  };

  const handleLandingCardSubmit = async (formData) => {
    try {
      console.log('Sending Landing Card to Edit API:', formData);
      await editLandingCardAction(formData); // API call to update Landing Card
      setIsLandingCardModalOpen(false); // Close modal after success
      const updatedData = await fetchLandingCardsAction(); // Refresh data
      setLandingCards(updatedData || []); // Update state with new data
    } catch (error) {
      console.error('Error editing Landing Card:', error);
    }
  };

  const handleSliderCardSubmit = async (formData) => {
    try {
      console.log('Sending Slider Card to Edit API:', formData);
      await editSliderCardAction(formData); // API call to update Slider Card
      setIsSliderCardModalOpen(false); // Close modal after success
      const updatedData = await fetchSliderCardsAction(); // Refresh data
      setSliderCards(updatedData || []); // Update state with new data
    } catch (error) {
      console.error('Error editing Slider Card:', error);
    }
  };

  const truncateText = (text) => {
    if (!text) return 'N/A';
    const words = text.split(' ');
    return words.length > 6 ? words.slice(0, 5).join(' ') + '...' : text;
  };

  // **Handle View Action**

  // Handle View for LandingCards
  const handleViewLandingCard = (card) => {
    setSelectedCard(card); // Set the selected LandingCard
    setIsViewMode(true); // Enable view mode
    setIsLandingCardModalOpen(true); // Open Landing Card Modal
    console.log('Viewing Landing Card:', card); // Log the card data
  };

  // Handle View for SliderCards
  const handleViewSliderCard = (card) => {
    setSelectedCard(card); // Set the selected SliderCard
    setIsViewMode(true); // Enable view mode
    setIsSliderCardModalOpen(true); // Open Slider Card Modal
    console.log('Viewing Slider Card:', card); // Log the card data
  };

  // Delete Logic
  const handleDelete = async () => {
    try {
      if (cardToDelete?.type === 'landing') {
        await deleteLandingCardAction(cardToDelete.id);
        const updatedData = await fetchLandingCardsAction();
        setLandingCards(updatedData || []);
      } else if (cardToDelete?.type === 'slider') {
        await deleteSliderCardAction(cardToDelete.id);
        const updatedData = await fetchSliderCardsAction();
        setSliderCards(updatedData || []);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    } finally {
      setOpenDialog(false);
      setCardToDelete(null);
    }
  };

  const showDeleteConfirm = (id, type) => {
    setCardToDelete({ id, type });
    setOpenDialog(true);
  };

  const formatHtmlToPlainText = (html) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;

    // Preserve spaces and line breaks
    const formattedText = div.textContent || div.innerText || '';
    return formattedText.replace(/\s+/g, ' ').trim(); // Clean up extra spaces
  };

  // Transform data for the table
  const tableData =
    step === 1 && Array.isArray(landingCards)
      ? landingCards.map((card) => ({
          cardTitle: truncateText(card.cardTitle),
          type: card.type || 'N/A',
          cardSubTitle: truncateText(card.cardSubTitle),
          cardDescription: truncateText(
            formatHtmlToPlainText(card.cardDescription || '')
          ),
          buttonText: truncateText(card.buttonText),
          email: truncateText(card.email),
          phoneNumber: truncateText(card.phoneNumber),
          actions: (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => handleViewLandingCard(card)}>
                <Visibility fontSize="small" />
              </IconButton>
              <IconButton onClick={() => handleEditLandingCard(card)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => showDeleteConfirm(card.landingCardId, 'landing')}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ),
        }))
      : sliderCards.map((card) => ({
          cardTitle: truncateText(card.cardTitle),
          cardSubTitle: truncateText(card.cardSubTitle),
          cardDescription: truncateText(
            formatHtmlToPlainText(card.cardDescription)
          ),
          highlightText: truncateText(card.highlightText),
          source: truncateText(card.source),
          actions: (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => handleViewSliderCard(card)}>
                <Visibility fontSize="small" />
              </IconButton>
              <IconButton onClick={() => handleEditSliderCard(card)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => showDeleteConfirm(card.sliderCardId, 'slider')}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ),
        }));

  const columnNameArray =
    step === 1
      ? [
          { field: 'cardTitle', headerName: 'Card Title' },
          { field: 'type', headerName: 'Type' },
          { field: 'cardSubTitle', headerName: 'Card Subtitle' },
          { field: 'cardDescription', headerName: 'Card Description' },
          { field: 'buttonText', headerName: 'Button Text' },
          { field: 'email', headerName: 'Email' },
          { field: 'phoneNumber', headerName: 'Phone Number' },
          { field: 'actions', headerName: 'Actions' },
        ]
      : [
          { field: 'cardTitle', headerName: 'Card Title' },
          { field: 'cardSubTitle', headerName: 'Card Subtitle' },
          { field: 'cardDescription', headerName: 'Card Description' },
          { field: 'highlightText', headerName: 'Highlight Text' },
          { field: 'source', headerName: 'Source' },
          { field: 'actions', headerName: 'Actions' },
        ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Box
        sx={{
          width: 'calc(100% - 240px)',
          borderRadius: '20px',
          border: '1px solid #9C9AA533',
          '@media (max-width:767px)': {
            width: '100%',
          },
        }}
      >
        <ViewTab
          step={step}
          setStep={setStep}
          tabBtnTxt="Create"
          actionType="landingPage"
          displayBtn={false}
        />

        <Box sx={{ marginTop: 2, marginLeft: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ marginTop: 2, marginLeft: 2, display: 'flex', gap: 2 }}>
            {/* Conditional rendering for Create buttons based on the current step */}
            {step === 1 && (
              <ButtonInput
                text="Create Landing Card"
                type="button"
                disabled={false}
                onClick={() => {
                  setSelectedCard(null); // Reset selected card data
                  setIsViewMode(false); // Ensure it's not in view mode
                  setIsLandingCardModalOpen(true); // Open Landing Card Modal
                }}
                styles={{
                  width: 'fit-content',
                  backgroundColor:
                    mode === 'light'
                      ? 'var(--tw-bg-light-main)'
                      : 'var(--tw-bg-light-main)',
                  color:
                    mode === 'light'
                      ? 'var(--tw-bg-light-sidebar)'
                      : 'var(--tw-bg-light-sidebar)',
                  textTransform: 'none',
                  border: 'none',
                }}
              />
            )}

            {step === 2 && (
              <ButtonInput
                type="button"
                disabled={false}
                text="Create Slider Card"
                onClick={() => {
                  setSelectedCard(null); // Reset selected card data
                  setIsViewMode(false); // Ensure it's not in view mode
                  setIsSliderCardModalOpen(true); // Open Slider Card Modal
                }}
                styles={{
                  width: 'fit-content',
                  backgroundColor:
                    mode === 'light'
                      ? 'var(--tw-bg-light-main)'
                      : 'var(--tw-bg-light-main)',
                  color:
                    mode === 'light'
                      ? 'var(--tw-bg-light-sidebar)'
                      : 'var(--tw-bg-light-sidebar)',
                  textTransform: 'none',
                  border: 'none',
                }}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ marginTop: 4, width: '100%' }}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
              }}
            >
              <CircularProgress />
            </Box>
          ) : tableData.length > 0 ? (
            <Box>
            <FilterListTable
              tableData={tableData}
              columnNameArray={columnNameArray}
              toDisplayFooter={false}
              />
            <PaginationFooter
              currentPage={currentPage}
              totalRecords={totalRecords}
              pageSize={pageSize}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />

          </Box>
         
          ) : (
            <Typography>No data available</Typography>
          )}
        </Box>
      </Box>

      <LandingCardModal
        key={
          isLandingCardModalOpen && selectedCard
            ? 'edit-landing-modal'
            : 'create-landing-modal'
        }
        open={isLandingCardModalOpen}
        onClose={() => {
          setSelectedCard(null);
          setIsLandingCardModalOpen(false);
        }}
        data={selectedCard}
        onEdit={handleLandingCardSubmit} // Pass edit handler
        onCreate={handleCreateLandingCard} // Pass create handler
        isViewMode={isViewMode}
      />

      <SliderCardModal
        key={
          isSliderCardModalOpen && selectedCard
            ? 'edit-slider-modal'
            : 'create-slider-modal'
        }
        open={isSliderCardModalOpen}
        onClose={() => {
          setSelectedCard(null);
          setIsSliderCardModalOpen(false);
        }}
        data={selectedCard}
        onEdit={handleSliderCardSubmit} // Pass edit handler
        onCreate={handleCreateSliderCard} // Pass create handler
        isViewMode={isViewMode}
      />

      <ConfirmBoxModel
        open={openDialog}
        title="Confirm Deletion"
        description={`Are you sure you want to delete this ${
          cardToDelete?.type === 'landing' ? 'Landing Card' : 'Slider Card'
        }?`}
        onAgree={handleDelete}
        onDisagree={() => {
          setOpenDialog(false);
          setCardToDelete(null);
        }}
        onClose={() => {
          setOpenDialog(false);
          setCardToDelete(null);
        }} // Add this property
        agreeText="Yes, Delete"
        disagreeText="No, Cancel"
      />
    </Box>
  );
};

export default LandingCards;
