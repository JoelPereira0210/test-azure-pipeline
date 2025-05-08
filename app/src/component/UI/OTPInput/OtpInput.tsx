
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../../../theme/themeProvider';

interface OTPInputProps {
  value: string;
  onChange: (text: string) => void;
  numInputs?: number;
  shouldAutoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, numInputs = 4, shouldAutoFocus }) => {
  const { theme } = useTheme();
  const [otp, setOtp] = useState<string>(value || '');

  const handleChangeText = (text: string, index: number) => {
    let newOtp = otp.split('');
    newOtp[index] = text;
    const updatedOtp = newOtp.join('');
    setOtp(updatedOtp);
    onChange(updatedOtp);
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: numInputs }).map((_, index) => (
        <TextInput
          key={index}
          keyboardType="numeric"
          maxLength={1}
          value={otp[index] || ''}
          onChangeText={(text) => handleChangeText(text, index)}
          style={[
            styles.input,
            {
              borderBottomColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholderTextColor={theme.colors.placeholder}
          autoFocus={shouldAutoFocus && index === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
    borderBottomWidth: 2,
    width: 48,
    marginHorizontal: 5,
  },
});

export default OTPInput;
