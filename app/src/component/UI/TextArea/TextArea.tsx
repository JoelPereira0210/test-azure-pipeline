import React, { forwardRef,useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../theme/themeProvider';
import { TextInput } from 'react-native-paper';
import { TextInput as RNTextInput } from 'react-native';
type Props = {
  label: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (text: string) => void;
  type?: 'text' | 'number';
  readOnly?: boolean;
  disabled?: boolean;
};

const TextArea = forwardRef<RNTextInput, Props>((props, ref) => {
  const { label, required, error, placeholder, value, onChange,readOnly, disabled, type, ...inputProps } = props;
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false); // Track focus state

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={[styles.label, { color: theme.colors.mainText }]}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      {/* Multiline Text Input */}
      <TextInput
        ref={ref}
        placeholder={placeholder || `Enter ${label}`}
        placeholderTextColor={'gray'} // Set placeholder color to white
        multiline
        textColor={disabled ? theme.colors.smallText:theme.colors.mainText}
        readOnly={readOnly}
        disabled={disabled}
        numberOfLines={6}
        value={value}
        onChangeText={onChange}
        keyboardType={type === 'number' ? 'numeric' : 'default'}
        style={[
          styles.textInput,
          {
            backgroundColor: theme.colors.background, // Set background to black
            color: theme.colors.mainText, // Set text color to white
            borderColor: focused ? '#A7C7FF':'#1F64FF66', // Keep clear borders
          },
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...inputProps}
      />

      {/* Error Message */}
      {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
});

TextArea.displayName = 'TextArea';

const styles = StyleSheet.create({
  container: {
    marginBottom: 27,
    paddingHorizontal: 2,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  required: {
    color: 'red',
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 3, // Rounded corners
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: 'top', // Ensures text starts from the top
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
  },
});

export default TextArea;
