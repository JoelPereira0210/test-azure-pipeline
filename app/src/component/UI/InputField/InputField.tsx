

import React, { forwardRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { TextInput as RNTextInput } from 'react-native';
import { useTheme } from '../../../../theme/themeProvider';

type Props = {
  label: string;
  type?: string;
  required?: boolean;
  errorMessage?: string | undefined;
  disabled?: boolean;
  onChange?: (text: string) => void;
  value?: string;
  icon?: string;
  customStyles?:object;
  readOnly?: boolean;
};

const InputField = forwardRef<RNTextInput, Props>((props, ref) => {
  const { label, type, required, errorMessage, disabled, icon, value, onChange, customStyles, readOnly } = props;
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(type !== 'password');
  const [focused, setFocused] = useState(false); // Track focus state
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container,customStyles]}>
      {/* Label with required indicator */}
      <Text style={[styles.label, { color: theme.colors.mainText }]}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

        <TextInput
          mode="outlined"
          placeholder={label}
          placeholderTextColor={'gray'} // Set placeholder color to white
          value={value}
          readOnly={readOnly}
          onChangeText={onChange}
          textColor={disabled ? theme.colors.smallText:theme.colors.mainText}
          ref={ref}
          keyboardType={type === 'number' ? 'numeric' : 'default'}
          secureTextEntry={type === 'password' && !showPassword}
          error={Boolean(errorMessage)}
          disabled={disabled}
          outlineStyle={{
            borderColor: focused ? '#A7C7FF':'#1F64FF66',
            borderWidth: 1,
            borderRadius: 9  // Add this line to change border radius
          }}
          style={[
            styles.input,
            {
          backgroundColor: theme.colors.background,
          color: theme.colors.mainText, // Set text color to white
          borderWidth: 0
            },
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          right={
            icon ? (
          <TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={togglePasswordVisibility} />
            ) : null
          }
        />

        {/* Error Message */}
        {errorMessage && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMessage}</Text>}
    </View>
  );
});

InputField.displayName = 'InputField';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  required: {
    color: '#EC1C24',
  },
  input: {
    borderRadius: 9,
    borderWidth: 1,
    fontSize: 16,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default InputField;
