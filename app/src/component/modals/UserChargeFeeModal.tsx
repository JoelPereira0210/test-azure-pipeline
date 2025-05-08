import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ButtonInput from '../UI/Button/Button';
import InputField from '../UI/InputField/InputField';
import DatePickerField from '../UI/DatePickerField/DatePickerField';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import { fetchChargeAction, fetchChargeReceiptAction } from '../../actions/charges';
import { ChargeFeeFormType } from '../../lib/types/chargeFee.types';
import { useTheme } from '../../../theme/themeProvider';
import { PaymentContext } from '../context/PaymentContext';
import { useNavigation } from '@react-navigation/native';

const UserChargeFeeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  chargeId: string;
  isPaid: boolean;
  chargeName: string;
}> = ({ open, onClose, chargeId, isPaid, chargeName }) => {
  const { theme, mode } = useTheme();
  const router = { push: (path: string) => console.warn(`Navigate to: ${path}`) }; // Replace with your navigation hook
  const methods = useForm<ChargeFeeFormType>();
  const { control, setValue } = methods;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  const {
    setPaymentItemAmount,
    setPaymentItemName,
    setPaymentItemId,
    setPaymentItemSection,
    setEventRegistrationCount,
  } = useContext(PaymentContext);

  // Fetch the charge data based on chargeId
  useEffect(() => {
    const fetchData = async () => {
      if (chargeId) {
        setLoading(true);
        try {
          const fetchedCharge = await fetchChargeAction(chargeId);
          console.log('Fetched Charge Data:', fetchedCharge);
          // Pre-fill form fields with fetched data
          setValue('name', fetchedCharge.eventName);
          setValue('description', fetchedCharge.eventDescription);
          setValue(
            'dueDate',
            dayjs(fetchedCharge.eventRegistrationDate).format('YYYY-MM-DD')
          );
          setValue('amount', fetchedCharge.amount);
          setEventId(fetchedCharge.eventId);
          setValue('feeType', fetchedCharge.feeType.feeType);
          setAmount(fetchedCharge.amount);
        } catch (error) {
          console.error('Error fetching charge data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [chargeId, setValue]);

  const handlePayNowClick = () => {
    if (!isPaid) {
      console.log('Processing Payment...');
      console.log('Charge ID:', eventId);
      console.log('Amount:', amount);

      setPaymentItemAmount(amount);
      setPaymentItemName(chargeName);
      setPaymentItemId(eventId);
      setPaymentItemSection('Charges Payment');
      //@ts-ignore
      navigation.navigate('UnauthNavigator',{screen:'CartCheckoutPage'});
      onClose();
        
    } else {
      console.warn('Download Receipt clicked');
      exportToPDF();
    }
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      // Fetch receipt data
      const fetchChargeReceipt = await fetchChargeReceiptAction(chargeId);
      if (!fetchChargeReceipt || Object.keys(fetchChargeReceipt).length === 0) {
        console.error('Receipt data is missing or empty');
        Alert.alert('Error', 'Receipt data is missing');
        setLoading(false);
        return;
      }

      // Use society logo from receipt data (base64) if available
      const base64Logo = fetchChargeReceipt.societyLogoBase64 || '';


      const htmlContent = `
<html>
  <head>
    <meta charset="utf-8"/>
    <style>
      /* Global resets & fonts */
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        color: #333;
      }
      h1, h2, h3, h4, h5, h6, p, div, span {
        margin: 0;
        padding: 0;
      }

      /* Header styling */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .header-left {
        font-size: 24px;
        font-weight: bold;
        color: #0E1B4D; /* Adjust brand color if needed */
      }
      .header-right {
        font-size: 18px;
        font-weight: bold;
        color: #0E1B4D; /* "Payment Receipt" color */
      }

      /* Horizontal line */
      .line {
        border: none;
        border-top: 2px solid #0E1B4D;
        margin: 10px 0 20px 0;
      }

      /* Customer info */
      .customer-info {
        margin-bottom: 20px;
      }
      .customer-info div {
        font-size: 14px;
        margin-bottom: 4px;
      }
      .customer-name {
        font-weight: bold;
        font-size: 16px;
      }

      /* Section Title */
      .section-title {
        font-size: 14px;
        font-weight: bold;
        color: #0E1B4D;
        margin-bottom: 8px;
      }

      /* Fee info container */
      .fee-info {
        margin-bottom: 20px;
      }
      .fee-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
      }
      .fee-label {
        font-weight: bold;
        font-size: 14px;
      }

      /* Table for SUBTOTAL, TAX, TOTAL */
      table.summary-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .summary-table tr {
        border-bottom: 1px solid #ccc;
      }
      .summary-table td {
        padding: 8px;
        font-size: 14px;
      }
      .summary-label {
        text-align: left;
      }
      .summary-amount {
        text-align: right;
      }
      .summary-total {
        font-weight: bold;
      }

      /* Payment details */
      .payment-details {
        margin-bottom: 20px;
        font-size: 14px;
      }
      .payment-details div {
        margin-bottom: 4px;
      }

      /* Footer line */
      .footer-line {
        border: none;
        border-top: 1px solid #ccc;
        margin: 20px 0;
      }

      /* Footer branding */
      .footer-brand {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
      }
      .footer-brand-left {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <!-- Header with brand & "Payment Receipt" -->
    <div class="header">
    ${
              base64Logo
                ? `<div style="text-align:center;">
                    <img src="data:image/png;base64,${base64Logo}" width="50" height="50" style="margin-bottom:5px;" />
                    <p>${fetchChargeReceipt.subscriptionPayment.society.societyName}</p>
                  </div>`
                : `<p style="text-align:center;">${fetchChargeReceipt.subscriptionPayment.society.societyName}</p>`
            }
    </div>
    <hr class="line"/>

    <!-- Customer Info -->
    <div class="customer-info">
      <div class="customer-name">${fetchChargeReceipt.subscriptionPayment.createdBy}</div>
      <div>${fetchChargeReceipt.subscriptionPayment.PhoneNumber}</div>
      <div>${fetchChargeReceipt.subscriptionPayment.buildingDoorNumber} ${fetchChargeReceipt.subscriptionPayment.flatNumber}</div>
    </div>

    <!-- Fee Info -->
    <div class="fee-info">
      <div class="fee-item">
        <span class="fee-label">Charge/Fee Name</span>
        <span>${fetchChargeReceipt.eventName}</span>
      </div>
      <div class="fee-item">
        <span class="fee-label">Fee Type</span>
        <span>${fetchChargeReceipt.feeType.feeType}</span>
      </div>
      <div class="fee-item">
        <span class="fee-label">Amount</span>
        <span>Rs. ${fetchChargeReceipt.amount}</span>
      </div>
    </div>

    <!-- Summary Table -->
    <table class="summary-table">
      <tr>
        <td class="summary-label">SUB TOTAL</td>
        <td class="summary-amount">Rs. ${fetchChargeReceipt.amount}</td>
      </tr>
     
      <tr>
        <td class="summary-label summary-total">TOTAL AMOUNT</td>
        <td class="summary-amount summary-total">Rs. ${fetchChargeReceipt.amount}</td>
      </tr>
    </table>

    <!-- Payment Details -->
    <div class="payment-details">
      <div>Payment Date & Time: ${dayjs(fetchChargeReceipt.subscriptionPayment.subscriptionPaymentDate).format('DD-MM-YYYY, HH:mm:ss')}</div>
      <div>Payment Method: Bank</div>
      <div>Payment Ref. No: ${fetchChargeReceipt.subscriptionPayment.paymentId}</div>
    </div>

    <hr class="footer-line"/>

    <!-- Footer branding -->
    <div class="footer-brand">
      <div class="footer-brand-left"${fetchChargeReceipt.subscriptionPayment.society.societyName}</div>
      <div> ${fetchChargeReceipt.subscriptionPayment.society.state["name"]}, ${fetchChargeReceipt.subscriptionPayment.society.streetName}, ${fetchChargeReceipt.subscriptionPayment.society.pincode}</div>
    </div>
  </body>
</html>
`;


      // Generate the PDF and get the base64 string
      const { base64 } = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'Payment_Receipt',
        base64: true,
      });

      // Define global Downloads path using RNFetchBlob
      const downloadPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fetchChargeReceipt.eventName}_Payment_Receipt.pdf`;

      if (base64) {
        await RNFetchBlob.fs.writeFile(downloadPath, base64, 'base64');
      } else {
        throw new Error('PDF generation failed: base64 data is undefined');
      }

      Alert.alert('PDF Generated', `PDF saved to: ${downloadPath}`);

  

      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error exporting PDF', error);
      Alert.alert('Error', 'Failed to generate PDF');
      setLoading(false);
    }
  };


  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={[styles.modalTitle, { color: theme.colors.mainText }]}>
          Charges/Fees
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FormProvider {...methods}>
            <ScrollView style={styles.formContainer}>
              {/* Name Field */}
              <View style={styles.inputGroup}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField {...field} label="Name" type="text" readOnly />
                  )}
                />
              </View>
              {/* Fee Description Field */}
              <View style={styles.inputGroup}>
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Fee Description"
                      type="text"
                      readOnly={true}
                    />
                  )}
                />
              </View>
              {/* Due Date Field */}
              <View style={styles.inputGroup}>
                <Controller
                  name="dueDate"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <DatePickerField
                      {...field}
                      label="Due Date"
                      value={field.value ? dayjs(field.value).format('YYYY-MM-DD') : null}
                      readOnly
                    />
                  )}
                />
              </View>
              {/* Fee Type Field */}
              <View style={styles.inputGroup}>
                <Controller
                  name="feeType"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <InputField {...field} label="Fee Type" type="text" readOnly />
                  )}
                />
              </View>
              {/* Amount Field */}
              <View style={styles.inputGroup}>
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
                    //   customStyles={{ backgroundColor: 'initial' }}
                    />
                  )}
                />
              </View>

              <View style={styles.buttonGroup}>
                <ButtonInput
                  text="Cancel"
                  type="button"
                  onPress={onClose}
                  styles={{
                    width: 'fit-content',
                    backgroundColor: 'transparent',
                    color: mode === 'light' ? '#000' : '#fff',
                    padding: '10px 20px',
                    borderRadius: 8,
                  }}
                />
                <ButtonInput
                  text={isPaid ? 'Download Receipt' : 'Pay Now'}
                  type="button"
                  onPress={handlePayNowClick}
                  styles={{
                    width: 'fit-content',
                    // backgroundColor: isPaid ? '#F5F5F5' : '#3b82f6',
                    // color: isPaid ? '#000' : '#fff',
                    // padding: '10px 20px',
                    // borderRadius: 8,
                    whiteSpace: 'nowrap',
                  }}
                />
              </View>
            </ScrollView>
          </FormProvider>
        )}
      </Modal>
    </Portal>
  );
};

export default UserChargeFeeModal;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    borderRadius: 20,
    width: '90%',
    maxWidth: 668,
    // maxHeight: '90vh',
    alignSelf: 'center',
    // overflowY: 'auto',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 99,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 50,
    alignSelf: 'center',
  },
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  formContainer: {
    maxHeight: '70%',
  },
  inputGroup: {
    marginVertical: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
    flexWrap: 'wrap',
  },
});
