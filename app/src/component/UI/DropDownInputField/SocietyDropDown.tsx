import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../theme/themeProvider'; // Use themeProvider hook

type Props = {
  label: string;
  required?: boolean;
  errorMessage?: string | undefined;
  classes?: string;
  infoText?: string | string[];
  disabled?: boolean;
  options: Array<{ label: string; value: any }>;
  values: Array<any>;
  setSelectedSociety: (values: any) => void;
  setValue: (name: string, value: any) => void;
  placeholder?: string;
  readOnly: boolean;
  mode: string;
};

const SocietyDropDownField = ({
  label,
  required,
  errorMessage,
  options,
  values,
  setSelectedSociety,
  setValue,
  infoText,
  placeholder,
  disabled,
  readOnly,
  mode,
}: Props) => {
  const { theme } = useTheme(); // Access theme and mode from useTheme hook
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(values[0] || null);

  const handleSocietyChange = (value: any) => {
    const selectedSociety = options.find((option) => option.value === value)?.label || '';
    setSelectedSociety([selectedSociety]);
    setValue('feeType', selectedSociety);
    setSelectedValue(value);
  };

  const renderInfoText = () => {
    if (Array.isArray(infoText)) {
      return infoText.map((text, index) => (
        <Text key={index} style={theme.typography.text3}>
          {text}
        </Text>
      ));
    }
    return <Text style={theme.typography.text3}>{infoText}</Text>;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border },
      ]}
    >
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={[theme.typography.text2, { color: theme.colors.text }]}>
          {label} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
        </Text>
        {infoText && (
          <IconButton
            icon={() => <MaterialIcons name="info-outline" size={16} color={theme.colors.primary} />}
            onPress={() => console.log('Info clicked')}
            style={styles.infoIcon}
          />
        )}
      </View>

      {/* Dropdown Picker */}
      <DropDownPicker
        open={open}
        value={selectedValue}
        items={options.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        setOpen={setOpen}
        setValue={(value: any) => handleSocietyChange(value)}
        disabled={disabled || readOnly}
        placeholder={placeholder || `Select or add ${label}`}
        style={[
          styles.dropdown,
          {
            backgroundColor: theme.colors.background,
            borderColor: errorMessage ? theme.colors.error : theme.colors.primaryBorder,
          },
        ]}
        dropDownContainerStyle={[
          styles.dropdownContainer,
          { backgroundColor: theme.colors.cardBackground },
        ]}
        textStyle={[theme.typography.text4, { color: theme.colors.text }]}
      />

      {/* Error Message */}
      {errorMessage && (
        <Text style={[theme.typography.text4, { color: theme.colors.error }]}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginLeft: 8,
  },
  dropdown: {
    borderRadius: 8,
    height: 54,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    borderRadius: 8,
  },
});

export default SocietyDropDownField;