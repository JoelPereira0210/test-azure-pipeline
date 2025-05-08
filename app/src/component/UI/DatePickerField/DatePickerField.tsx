import React, { forwardRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useTheme } from '../../../../theme/themeProvider';

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  value: string | null; // The formatted date string ("YYYY-MM-DD") or null
  onChange: (newValue: string) => void;
  disabled?: boolean;
  style?: any;
  minDate?: Date;
  maxDate?: Date;
  readOnly?: boolean;
};

const DatePickerField = forwardRef<any, Props> (({
  label,
  required,
  error,
  value,
  onChange,
  disabled,
  style,
  minDate,
  maxDate,
  readOnly,
},ref) => {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);
const [focused, setFocused] = useState(false); // Track focus state
  const handleConfirm = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (event.type === 'set' && selectedDate) {
      // Format the selected date as an ISO string (YYYY-MM-DD)
      onChange(dayjs(selectedDate).format('YYYY-MM-DD'));
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {label} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
      </Text>

      {/* "Input" field that shows the date */}
      <TouchableOpacity
        onPress={() => !disabled && !readOnly && setShow(true)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.inputWrapper,
          {
            backgroundColor: disabled ? theme.colors.disabled : theme.colors.background,
            borderColor: focused ? '#A7C7FF':'#1F64FF66',
          },
        ]}
        disabled={disabled || readOnly}
      >
        <Text style={[styles.inputText, { color: value ? theme.colors.mainText : 'gray' }]}>
          {value || 'Select a date'}
        </Text>
      </TouchableOpacity>

      {/* Error Message */}
      {error ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text> : null}

      {/* DateTimePicker */}
      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={handleConfirm}
        />
      )}
    </View>
  );
});


const styles = StyleSheet.create({
  container: {
    marginBottom: 27,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 9,
    height:50,
    padding: 14,
    width: '100%',

  },
  inputText: {
    fontSize: 16,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default DatePickerField;
