import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';

import ButtonInput from '../UI/Button/Button';
import InputField from '../UI/InputField/InputField';
import DatePickerField from '../UI/DatePickerField/DatePickerField';
import ChargeDropDownField from '../UI/DropDownInputField/ChargeDropDownField';

import { chargeFeeSchema } from '../../lib/zod/charges';
import { ChargeFeeFormType } from '../../lib/types/chargeFee.types';
import {
  createChargeAction,
  editChargeAction,
  fetchChargeAction,
  softDeleteChargeAction,
  hardDeleteChargeAction,
  fetchFeeTypeAction,
} from '../../actions/charges';
import { ChargesContext } from '../context/ChargesContext';
import { useTheme } from '../../../theme/themeProvider';
import TextArea from '../UI/TextArea/TextArea';

interface ChargeFeeModalProps {
  open: boolean;
  onClose: () => void;
  step?: number;
}

const ChargeFeeModal: React.FC<ChargeFeeModalProps> = ({ open, onClose, step }) => {
  const { theme, mode } = useTheme();
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
  const { handleSubmit, control, setValue, formState: { errors }, reset } = methods;

  const [loading, setLoading] = useState(false);
  const [checkPublished, setCheckPublished] = useState(false);
  const [selectedFeeType, setSelectedFeeType] = useState<string | null>(null);
  const [options, setOptions] = useState<any[]>([]);

  // Fetch existing charge data if editing/copying/viewing
  useEffect(() => {
    const fetchData = async () => {
      if (
        chargeId &&
        (chargeActionType === 'edit charge' ||
          chargeActionType === 'copy charge' ||
          chargeActionType === 'view charge')
      ) {
        try {
          const fetchedCharge = await fetchChargeAction(chargeId);
          console.log('Fetched Charge Data:', fetchedCharge);
          setCheckPublished(!!fetchedCharge.shouldPublish);

          setValue('name', fetchedCharge.eventName);
          setValue('description', fetchedCharge.eventDescription);
          setValue('amount', fetchedCharge.amount);

          // Handle feeType
          const feeTypeVal = fetchedCharge.feeType?.feeType || '';
          setSelectedFeeType(feeTypeVal);
          setValue('feeType', feeTypeVal);

          // If edit or view, fill in due date
          if (
            chargeActionType === 'edit charge' ||
            chargeActionType === 'view charge'
          ) {
            setValue(
              'dueDate',
              dayjs(fetchedCharge.eventRegistrationDate).format('YYYY-MM-DD')
            );
          }

          // If copy, clear the due date
          if (chargeActionType === 'copy charge') {
            setValue('dueDate', '');
          }
        } catch (error) {
          console.error('Error fetching charge data:', error);
        }
      }
    };
    fetchData();
  }, [chargeId, chargeActionType, setValue]);

  // Fetch fee type options
  useEffect(() => {
    const fetchChargeFeeType = async () => {
      try {
        const FeeTypeData = await fetchFeeTypeAction();
        console.log('FeeTypeData', FeeTypeData);
        setOptions(FeeTypeData);
      } catch (error) {
        console.error('Error fetching fee types:', error);
      }
    };
    fetchChargeFeeType();
  }, []);

  // Create new fee type
  const handleCreateFeeType = (newFeeType: any) => {
    console.log('newFeeType', newFeeType.feeType);
    const sft = newFeeType.feeType;
    const newOption = { feeType: sft, id: options.length + 1 };
    setOptions((prev) => [...prev, newOption]);
    setSelectedFeeType(newOption.feeType);
    setValue('feeType', sft);
  };

  // Submit the form
  const onSubmit = async (data: ChargeFeeFormType, isPublishing: boolean) => {

    console.log('Form data before submission:', data);

    try {
      let result;
      if (chargeActionType === 'edit charge') {
        result = await editChargeAction(chargeId, {
          ...data,
          dueDate: dayjs(data.dueDate).format('YYYY-MM-DD'),
          shouldPublish: isPublishing,
        });
      } else {
        result = await createChargeAction({
          ...data,
          dueDate: dayjs(data.dueDate).format('YYYY-MM-DD'),
          shouldPublish: isPublishing,
        });
      }
      if (result?.status === 200) {
        console.log('Operation successful:', result.data);
      } else {
        console.error('Operation failed:', result);
      }
    } catch (error) {
      console.error('Error occurred while submitting the form:', error);
    }
    onClose();
    reset();
  };

  const handlePublish = () => {
    handleSubmit((data) => onSubmit(data, true))();
  };
  const handleSaveDraft = () => {
    handleSubmit((data) => onSubmit(data, false))();
  };

  const handleEditCharge = () => {
    setLoading(true);
    setTimeout(() => {
      setChargeActionType('edit charge');
      setChargeMemberStatus(false);
      setCreateCharge(true);
      setLoading(false);
    }, 1000);
  };

  // Deletion
  const handleSoftDelete = async () => {
    try {
      const response = await softDeleteChargeAction(chargeId);
      if (response?.status === 200) {
        console.log('Charge soft-deleted successfully');
      } else {
        console.error('Error during soft delete:', response?.statusText);
      }
    } catch (error: any) {
      console.error('Error during soft delete:', error.message);
    }
    onClose();
  };
  const handleHardDelete = async () => {
    try {
      const response = await hardDeleteChargeAction(chargeId);
      if (response?.status === 200) {
        console.log('Charge hard-deleted successfully');
      } else {
        console.error('Error during hard delete:', response?.statusText);
      }
    } catch (error: any) {
      console.error('Error during hard delete:', error.message);
    }
    onClose();
  };
  const handleDelete = () => {
    if (step === 4) {
      handleHardDelete();
    } else {
      handleSoftDelete();
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
        {/* Close Button */}
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
          <ScrollView style={{ maxHeight: '70%' }}>
            <FormProvider {...methods}>
              <View>
                {/* Name Field */}
                <View style={styles.inputGroup}>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <InputField
                        {...field}
                        label="Charge Name"
                        type="text"
                        required={chargeActionType !== 'view charge'}
                        errorMessage={errors.name ? String(errors.name.message) : undefined}
                        readOnly={chargeActionType === 'view charge'}
                      />
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
                      <TextArea
                        {...field}
                        label="Fee Description"
                        type="text"
                        required={chargeActionType !== 'view charge'}
                        error={errors.description ? String(errors.description.message) : undefined}
                        readOnly={chargeActionType === 'view charge'}
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
                        required={chargeActionType !== 'view charge'}
                        error={errors.dueDate ? String(errors.dueDate.message) : undefined}
                        value={field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''}
                        onChange={(newValue) => field.onChange(dayjs(newValue).format('YYYY-MM-DD'))}
                        readOnly={chargeActionType === 'view charge'}
                        // disabled={chargeActionType === 'view charge'}
                        minDate={chargeActionType === 'view charge' ? undefined : dayjs().toDate()}
                      />
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
                        label="Enter Amount"
                        required={chargeActionType !== 'view charge'}
                        type="number"
                        errorMessage={errors.amount ? String(errors.amount.message) : undefined}
                        readOnly={chargeActionType === 'view charge'}
                        disabled={
                          (checkPublished &&
                            chargeActionType === 'view charge' &&
                            chargeActionType !== 'copy charge') ||
                          chargeActionType === 'edit charge'
                        }
                       
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
                    render={() => (
                      <ChargeDropDownField
                        label="Fee Type"
                        required={chargeActionType !== 'view charge'}
                        errorMessage={errors.feeType ? String(errors.feeType.message) : undefined}
                        options={options}
                        values={selectedFeeType || null}
                        setSelectedFeeType={(item) => {
                          setSelectedFeeType(item?.feeType || null);
                        }}
                        setValue={(name: string, val: any) => {
                          // name is "feeType"
                          setValue(name as keyof ChargeFeeFormType, val);
                        }}
                        onCreateNew={(newOption) => handleCreateFeeType(newOption)}
                        placeholder="Add or Select Fee Type"
                        readOnly={chargeActionType === 'view charge'}
                        disabled={chargeActionType === 'view charge'}
                        mode={mode}
                      />
                    )}
                  />
                </View>

                {/* Buttons */}
                <View style={styles.buttonGroup}>
                  {(!chargeSection && chargeActionType !== 'view charge') && (
                    <>
                      <ButtonInput
                        disabled={false}
                        fontWeight="600"
                        text="Save Draft"
                        type="button"
                        width={130}
                        buttonBackgroundColor={theme.colors.background}
                  borderColor={theme.colors.mainText}
                  buttonFontColor={theme.colors.mainText}
                        onPress={handleSaveDraft}
  
                      />
                      <ButtonInput
                        disabled={false}
                        fontWeight="600"
                        text="Publish"
                        type="button"
                        width={130}
                        onPress={handlePublish}
                      />
                    </>
                  )}
                  {(chargeActionType === 'create charge' ||
                    chargeActionType === 'copy charge' ||
                    chargeSection === 'draft') &&
                    (chargeActionType !== 'view charge') && (
                      <>
                        <ButtonInput
                          disabled={false}
                          fontWeight="600"
                          text="Save Draft"
                          type="button"
                          width={130}
                          buttonBackgroundColor={theme.colors.background}
                  borderColor={theme.colors.mainText}
                  buttonFontColor={theme.colors.mainText}
                          onPress={handleSaveDraft}
                        />
                        <ButtonInput
                          disabled={false}
                          fontWeight="600"
                          text="Publish"
                          type="button"
                          width={130}
                          onPress={handlePublish}
        
                        />
                      </>
                    )}
                  {chargeSection === 'upcoming' && chargeActionType === 'view charge' && (
                    <>
                      <ButtonInput
                        disabled={false}
                        fontWeight="600"
                        text="Edit"
                        type="button"
                        width={130}
                        onPress={handleEditCharge}
                        // styles={styles.buttonStyleOutline}
                      />
                      <ButtonInput
                        disabled={false}
                        fontWeight="600"
                        text="Delete"
                        width={130}
                        type="button"
                        onPress={handleDelete}
                        buttonBackgroundColor={theme.colors.background}
                  borderColor={theme.colors.mainText}
                  buttonFontColor={theme.colors.mainText}
                        // styles={styles.buttonStyleDanger}
                      />
                    </>
                  )}
                  {chargeSection === 'deleted' && chargeActionType === 'view charge' && (
                    <>
                      <ButtonInput
                        disabled={false}
                        fontWeight="600"
                        text="Delete"
                        width={130}
                        type="button"
                        buttonBackgroundColor={theme.colors.background}
                  borderColor={theme.colors.mainText}
                  buttonFontColor={theme.colors.mainText}
                        onPress={chargeSection === 'past' ? handleSoftDelete : handleHardDelete}
                        // styles={styles.buttonStyleDanger}
                      />
                    </>
                  )}
                  {chargeSection === 'upcoming' && chargeActionType === 'edit charge' && (
                    <>
                      <ButtonInput
                        disabled={false}
                        text="save Changes"
                        type="button"
                        width={180}
                        onPress={handlePublish}
                        // styles={styles.buttonStyleOutline}
                      />
                    </>
                  )}
                  {chargeSection === 'draft' && chargeActionType === 'view charge' && (
                    <>
                      <ButtonInput
                        disabled={false}
                        fontWeight="600"
                        text="Edit"
                        type="button"
                              width={130}
                        onPress={handleEditCharge}
                        // styles={styles.buttonStyleOutline}
                      />
                      <ButtonInput
                        disabled={false}
                        fontWeight="600"
                        text="Delete"
                        width={130}
                        type="button"
                        onPress={handleSoftDelete}
                        buttonBackgroundColor={theme.colors.background}
                  borderColor={theme.colors.mainText}
                  buttonFontColor={theme.colors.mainText}
                        // styles={styles.buttonStyleDanger}
                      />
                      <ButtonInput
                        disabled={false}
                        fontWeight="600"
                        text="Publish"
                        width={130}
                        type="button"
                        onPress={handlePublish}
                        // styles={styles.buttonStyleFilled}
                      />
                    </>
                  )}
                </View>
              </View>
            </FormProvider>
          </ScrollView>
        )}
      </Modal>
    </Portal>
  );
};

export default ChargeFeeModal;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
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
  inputGroup: {
    marginVertical: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap:10,
    flexWrap: 'wrap',
  },

  
});
