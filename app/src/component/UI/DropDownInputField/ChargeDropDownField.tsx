import React, { forwardRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Tooltip from 'react-native-walkthrough-tooltip';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../../theme/themeProvider';

type Props = {
  label: string;
  required?: boolean;
  errorMessage?: string;
  infoText?: string | string[];
  disabled?: boolean;
  /**
   * Must be shaped for react-native-dropdown-picker:
   * { label: string; value: string | number; [key: string]: any }[]
   **/
  options: Array<any>;
  /** For single-select, pass a single string or number as default value. */
  values: string | number | null;
  onCreateNew: (newOption: any) => void;
  setSelectedFeeType: (item: any) => void;
  setValue: (name: string, value: any) => void;
  placeholder?: string;
  readOnly: boolean;
  mode: string;
};

const ChargeDropDownField = forwardRef<any, Props>((props, ref) => {
  const {
    label,
    required,
    errorMessage,
    disabled,
    options,
    values,
    onCreateNew,
    setSelectedFeeType,
    setValue,
    infoText,
    placeholder,
    readOnly,
    mode,
  } = props;

  const { theme } = useTheme();

  const [open, setOpen] = useState(false);
  const [value, setValueLocal] = useState<string | number | null>(values || null);
  const [items, setItems] = useState<any[]>([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Map the options to label/value
  useEffect(() => {
    const mappedItems = options.map((item) => ({
      label: item.feeType || item.label || 'No Label',
      value: item.feeType || item.value,
      ...item,
    }));
    setItems(mappedItems);
  }, [options]);

  // Sync the parent "values" with local "value"
  useEffect(() => {
    if (typeof values === 'string' || typeof values === 'number') {
      setValueLocal(values);
    }
  }, [values]);

  // When the user selects an item, update form and local states
  const handleChangeValue = (val: string | number, currentItems?: any[]) => {
    const list = currentItems || items;
    const selectedItem = list.find((item) => item.value === val);
    if (selectedItem) {
      setValue('feeType', selectedItem.feeType);
      setSelectedFeeType(selectedItem);
    } else {
      setValue('feeType', '');
      setSelectedFeeType(null);
    }
  };

  // Different input styles for light/dark mode
  const inputStyles = mode === 'dark'
    ? {
        backgroundColor: 'transparent',
        color: '#1F64FF',
        borderWidth: 1,
        borderColor: 'rgba(70,95,241,0.40)',
      }
    : {
        backgroundColor: 'transparent',
        color: 'blue',
        borderWidth: 1,
        borderColor: 'rgba(70,95,241,0.40)',
      };

  // Info text for tooltip
  const renderInfoText = () => {
    if (Array.isArray(infoText)) {
      return (
        <View>
          {infoText.map((text, index) => (
            <Text key={index} style={styles.infoText}>
              {text}
            </Text>
          ))}
        </View>
      );
    }
    return <Text style={styles.infoText}>{infoText}</Text>;
  };

  console.log("options in chargeFeeDropwdown", options);
  return (
    <View style={styles.container}>
      {/* Label row */}
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: theme.colors.mainText, fontWeight: '600' }]}>
          {label} {required && <Text style={[{ color: theme.colors.error }]}>*</Text>}
        </Text>
        {infoText && (
          <Tooltip
            isVisible={tooltipVisible}
            content={renderInfoText()}
            placement="top"
            onClose={() => setTooltipVisible(false)}
          >
            <Icon
              name="info"
              size={20}
              color={theme.colors.primary}
              style={{ marginLeft: 8 }}
              onPress={() => setTooltipVisible(true)}
            />
          </Tooltip>
        )}
      </View>

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValueLocal}
        setItems={setItems}
        multiple={false}
        searchable
        addCustomItem
        placeholder={placeholder || `Select or add ${label}`}
        disabled={disabled || readOnly}
        searchPlaceholderTextColor="grey"
        style={[
          {
            padding: 10,
            borderRadius: 8,
            height: 54,
          },
          inputStyles,
        ]}
        textStyle={{ fontSize: 16, color: theme.colors.mainText }}
        dropDownContainerStyle={{
          backgroundColor: theme.colors.background,
        }}
        placeholderStyle={{
          color: 'grey',
        }}
        listItemLabelStyle={{
          color: theme.colors.mainText,
        }}
        selectedItemLabelStyle={{
          color: theme.colors.mainText,
        }}
        listMode="MODAL"
        modalProps={{
          presentationStyle: 'fullScreen',
        }}
        modalContentContainerStyle={{
          backgroundColor: theme.colors.background,
        }}
        searchContainerStyle={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.mainText,
          borderWidth: 1,
          borderRadius: 8,
          padding: 5,
        }}
        searchTextInputStyle={{
          backgroundColor: theme.colors.background,
          color: theme.colors.mainText,
        }}
        // onChangeValue={(val) => handleChangeValue(val as string | number)}
        // onChangeSearchText={(newItemLabel: string) => {
        //   // create a new item object
        //   const newOption = {
        //     label: newItemLabel,
        //     value: newItemLabel,
        //     feeType: newItemLabel,
        //   };
        //   // add to parent
        //   onCreateNew(newOption);
        // }}

        onChangeValue={(val) => handleChangeValue(val as string | number)}
  // Remove onChangeSearchText to avoid adding new options as you type
  onSelectItem={(item) => {
    if (item) {
      const newOption = {
        label: item.label,
        value: item.value,
        feeType:item.label
        // id: new Date().getTime(), // ensure a unique id
      };
      onCreateNew(newOption);
      // Immediately update the field's value:
      // setValueLocal(newOption.value);
      // setValue('feeType', newOption.feeType);
      // setSelectedFeeType(newOption);
    }
  }}
        
        
      />

      {errorMessage && (
        <Text style={[styles.errorText, { marginTop: 8, color: theme.colors.error }]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 27,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
  },
});

export default ChargeDropDownField;
