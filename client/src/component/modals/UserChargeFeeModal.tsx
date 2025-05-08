"use client";
import React, { useState, useEffect,useContext } from "react";
import {
  Box,
  Typography,
  Modal,
  useTheme,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import ButtonInput from "../UI/Button/Button";
import InputField from "../UI/InputField/InputField";
import DatePickerField from "../UI/DatePickerField/DatePickerField";
import CloseIcon from "@mui/icons-material/Close";
import { fetchChargeAction } from "@/src/actions/charges";
import { fetchChargeReceiptAction } from "@/src/actions/charges";
import { ChargeFeeFormType } from "@/src/lib/types/chargesFee.types";
import { useUser } from '@/src/component/context/UserContext';
import { PaymentContext } from '../context/PaymentContext';
import { useRouter } from 'next/navigation';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Props for the Modal component
interface UserChargeFeeModalProps {
  open: boolean;
  onClose: () => void;
  chargeId: string;
  isPaid: boolean; // Determines if the button should show "Pay Now" or "Download Receipt"
  chargeName: string;
}

const UserChargeFeeModal: React.FC<UserChargeFeeModalProps> = ({
  open,
  onClose,
  chargeId,
  isPaid,
  chargeName
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const router = useRouter();
  const methods = useForm<ChargeFeeFormType>();
  const { control, setValue } = methods;

  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null); // Store eventId
  const [amount, setAmount] = useState<number | null>(null); // Store amount


  const {
    paymentItemAmount,
    setPaymentItemAmount,
    paymentItemName,
    setPaymentItemName,
    paymentItemId, 
    setPaymentItemId,
    paymentItemSection, 
    setPaymentItemSection,
    setEventRegistrationCount
  } = useContext(PaymentContext);


  // Fetch the charge data based on chargeId
  useEffect(() => {
    const fetchData = async () => {
      if (chargeId) {
        setLoading(true);
        try {
          const fetchedCharge = await fetchChargeAction(chargeId);

          console.log("fetchChargeAction",fetchedCharge);
          // Pre-fill form fields with fetched data
          setValue("name", fetchedCharge.eventName);
          setValue("description", fetchedCharge.eventDescription);
          setValue(
            "dueDate",
            dayjs(fetchedCharge.eventRegistrationDate).format("YYYY-MM-DD")
          );
          setValue("amount", fetchedCharge.amount);
          // Set eventId and amount for logging purposes
          setEventId(fetchedCharge.eventId);
          setValue("feeType", fetchedCharge.feeType.feeType); // Set the feeType value
          setAmount(fetchedCharge.amount);
        } catch (error) {
          console.error("Error fetching charge data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [chargeId, setValue]);


  const handlePayNowClick = () => {
    if (!isPaid) {
      console.log("Processing Payment...");
      console.log("Charge ID:", eventId);
      console.log("Amount:", amount);

      setPaymentItemAmount(amount);
      setPaymentItemName(chargeName);
      setPaymentItemId(eventId);
      setPaymentItemSection('Charges Payment');
      router.push(`/cart-checkout`);
    } else {
      console.log("Downloading Receipt...");
      exportToPDF(); // Generate PDF Receipt
    }
  };


  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = url;
    });
  };

  const exportToPDF = async () => {
   
    try {
      // Fetch the charge receipt data
      const fetchChargeReceipt = await fetchChargeReceiptAction(chargeId);
      console.log("fetchChargeReceipt",fetchChargeReceipt);
  
      // Wait for the state to update and ensure receiptData is set
      if (!fetchChargeReceipt || Object.keys(fetchChargeReceipt).length === 0) {
        console.error('Receipt data is missing or empty');
        return;
      }

  // const imageUrl = 'logo.png';
  // const base64Image = await getBase64ImageFromURL(imageUrl);

  const base64Image = fetchChargeReceipt.societyLogoBase64 
  ? `${fetchChargeReceipt.societyLogoBase64}` :await getBase64ImageFromURL('logo.png');;
  
    const docDefinition = {
      content: [
        {
          table: {
            body: [
              [
                {
                  image: base64Image,
                  width: 50,
                  height: 50,
                  alignment: 'center',
                  margin: [0, 0, 0, 0], // Adjust margins as needed
                },
                {
                  text: fetchChargeReceipt.subscriptionPayment.society.societyName,
                  style: 'headerTitle',
                  alignment: 'center',
                  margin: [0, 10, 0, 0], // Adjust top margin to align vertically with the image
                },
              ],
            ],
          },
          layout: 'noBorders', // Removes table borders
          alignment: 'center', // Centers the table horizontally
          margin: [0, 0, 0, 0], // Adjust margins around the table as needed
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, color: '#133E58' },
          ],
          margin: [0, 10, 0, 20],
        },
        // User Details
        {
          columns: [
            [
              { text: fetchChargeReceipt.subscriptionPayment.createdBy, style: 'userDetailsBold' },
              { text: fetchChargeReceipt.subscriptionPayment.PhoneNumber, style: 'userDetails' },
              { text: `${fetchChargeReceipt.subscriptionPayment.buildingDoorNumber} ${fetchChargeReceipt.subscriptionPayment.flatNumber}`, style: 'userDetails' },
            ],
          ],
          margin: [0, 0, 0, 20],
        },
        // Section Title
        {
          columns: [
            { text: 'Charge/Fee Name', style: 'sectionTitle', alignment: 'left' },
            { text: 'Charge/Fee Type', style: 'sectionTitle', alignment: 'center' },
            { text: 'Amount', style: 'sectionTitle', alignment: 'center' },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', 'auto'],
            body: [
              [
                { text: fetchChargeReceipt.eventName, style: 'tableCell', alignment: 'left' },
                { text: fetchChargeReceipt.feeType.feeType, style: 'tableCell', alignment: 'left' },
                { text: fetchChargeReceipt.amount, style: 'tableCell', alignment: 'left' },
              ],
            ],
          },
          layout: {
            paddingLeft: () => 10,
            paddingRight: () => 80,
            paddingTop: () => 10,
            paddingBottom: () => 10,
            hLineWidth: () => 0.5,
            vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length) ? 0.5 : 0,
            hLineColor: () => '#B0B0B0',
            vLineColor: () => '#B0B0B0',
          },
          margin: [0, 0, 0, 20],
        },
        // Summary Section
        {
          columns: [
            {
              width: '*',
              text: '',
            },
            {
              width: 'auto',
              table: {
                body: [
                  ['SUB TOTAL', { text: fetchChargeReceipt.amount, alignment: 'right' }],
                  // ['TAX VAT 10%', { text: `Rs. 500`, alignment: 'right' }],
                  ['TOTAL AMOUNT', { text: fetchChargeReceipt.amount, bold: true, alignment: 'right' }],
                ],
              },
              layout: {
                paddingLeft: () => 10,
                paddingRight: () => 10,
                paddingTop: () => 10,
                paddingBottom: () => 10,
                hLineWidth: () => 0.5,
                vLineWidth: () => 0,
                hLineColor: () => '#DFE4EA',
              },
              fillColor: '#F9F9FA',
            },
          ],
          margin: [0, 10, 0, 20],
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, color: '#B0B0B0' },
          ],
          margin: [0, 10, 0, 10],
        },
        // Payment Method Details
        {
          columns: [
            [
              { text: 'Payment Date & Time: ', style: 'label' },
              {
                text: `${dayjs(fetchChargeReceipt.subscriptionPayment.subscriptionPaymentDate).format('DD-MM-YYYY, HH:mm:ss')}`,
                style: 'value',
              },
              { text: 'Payment Method: ', style: 'label' },
              { text: 'Bank', style: 'value' },
              { text: 'Payment Ref. No: ', style: 'label' },
              { text: fetchChargeReceipt.subscriptionPayment.paymentId, style: 'value' },
            ],
          ],
          margin: [0, 0, 0, 10],
        },
      ],
       
    footer: function (currentPage, pageCount) {
      return [
        {
          canvas: [
            {
              type: 'line',
              x1: 40, // Adjust the starting x-coordinate
              y1: 0,
              x2: 555, // Adjust the ending x-coordinate (page width - margin)
              y2: 0,
              lineWidth: 1, // Thickness of the line
              lineColor: '#000B4D', // Color of the line
            },
          ],
          margin: [0, 0, 0, 5], // Space between the line and the footer text
        },
        {
          columns: [
            {
              text: `${fetchChargeReceipt.subscriptionPayment.society.societyName}, ${fetchChargeReceipt.subscriptionPayment.society.state["name"]}, ${fetchChargeReceipt.subscriptionPayment.society.streetName}, ${fetchChargeReceipt.subscriptionPayment.society.pincode}`,
              style: 'footerText',
            },
          ],
          margin: [0, 5, 20, 10], // Adjust the margins as needed
        },
      ];
    },
      styles: {
        headerTitle: {
          fontSize: 20,
          bold: true,
          color: '#133E58',
        },
        headerSubtitle: {
          fontSize: 14,
          bold: true,
          color: '#133E58',
        },
        userDetails: {
          fontSize: 12,
          color: '#757575',
          margin: [0, 2, 0, 2],
        },
        userDetailsBold: {
          fontSize: 12,
          bold: true,
          color: '#133E58',
          margin: [0, 2, 0, 2],
        },
        sectionTitle: {
          fontSize: 12,
          bold: true,
          color: '#133E58',
        },
        tableCell: {
          fontSize: 12,
          color: '#133E58',
        },
        label: {
          fontSize: 10,
          bold: true,
          color: '#757575',
        },
        value: {
          fontSize: 12,
          color: '#000',
        },
        footerText: {
          fontSize: 12,
          alignment: 'right',
          margin: [0, 0, 20, 0], // Adjust the right margin as needed
        },
      },
    };
  
    // Create and download the PDF
    pdfMake.createPdf(docDefinition).download('Payment_Receipt.pdf');
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  }
};
  
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
          maxWidth: "668px",
          maxHeight: "90vh",
          bgcolor: "background.paper",
          borderRadius: "20px",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
          "::webkit-scrollbar": { width: "5px" },
          "::webkit-scrollbar-thumb": { borderRadius: "10px" },
        }}
      >
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>

        <Typography id="modal-title" variant="h6" component="h2" mb={1}>
          Charges/Fees
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
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
                    <InputField {...field} label="Name" type="text" readOnly />
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
                      multiline
                      rows={3}
                      readOnly
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
                      value={field.value ? dayjs(field.value).format("YYYY-MM-DD") : null}
                      readOnly
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
                  <InputField {...field} label="Fee Type" type="text" readOnly />
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
                      type="text"
                      readOnly
                      style={{ backgroundColor: "initial" }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 3 }}>
                {/* Cancel Button */}
                <ButtonInput
                  text="Cancel"
                  type="button"
                  fontWeight={400}
                  onClick={onClose}
                  styles={{
                    width: "fit-content",
                    backgroundColor: "transparent",
                    color: mode === "light" ? "#000" : "#fff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: `1px solid ${mode === "light" ? "#000" : "#fff"}`,
                    
                  }}
                />

                

                <ButtonInput
                  text={isPaid ? "Download Receipt" : "Pay Now"}
                  type="button"
                  fontWeight={400}
                  onClick={handlePayNowClick}
                  styles={{
                    width: "fit-content",
                    backgroundColor: isPaid
                      ? "#F5F5F5" // Grey for "Download Receipt"
                      : "#3b82f6", // Blue for "Pay Now"
                    color: isPaid ? "#000" : "#fff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    whiteSpace: "nowrap",
                  }}
                />
                </Box>
            </form>
          </FormProvider>
        )}
      </Box>
    </Modal>
  );
};

export default UserChargeFeeModal;
