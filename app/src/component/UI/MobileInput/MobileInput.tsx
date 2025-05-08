import React, { useState } from 'react';
import {TextInput, Text, View, StyleSheet} from 'react-native';
import {useController} from 'react-hook-form';
import PhoneInput from 'react-native-phone-number-input';
import {useTheme} from '../../../../theme/themeProvider'; // Use themeProvider hook
import {HelperText} from 'react-native-paper';

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  classes?: string;
  infoText?: string | string[]; // Accept string array for multiple points
  disabled?: boolean;
  country: string; // Country code as string (e.g., "US")
  style?: React.CSSProperties;
  placeholder: string;
  name: string;
  mode?: 'light' | 'dark';
  control?: any; // Add control to Props
};

const MobileInput: React.FC<Props> = ({
  label,
  required,
  error,
  classes,
  style,
  placeholder,
  country,
  disabled,
  name,
  control,
  mode = 'light',
  ...inputProps
}) => {
  const {theme} = useTheme(); // Access theme from useTheme hook
  const {
    field: {onChange, value},
  } = useController({
    name,
    control,
  });

  // console.log('Current Theme Text Color:', theme.colors.text);
    const [focused, setFocused] = useState(false); // Track focus state

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.colors.background}, // Use theme background color
      ]}>
      <Text style={[styles.label,{color:theme.colors.mainText}]}>
        {label} {required && <Text style={{color: theme.colors.error}}>*</Text>}
      </Text>

      <PhoneInput
        defaultValue={value || ''}
        value={value || ''}
        //@ts-ignore
        defaultCode={country}
        onChangeFormattedText={text => {
          console.log('Phone Input Changed:', text); // Debugging
          onChange(text); // Ensure react-hook-form updates the value
        }}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        containerStyle={[
          styles.phoneInputContainer,

          {
            borderColor: focused ? '#A7C7FF':'#1F64FF66',
            borderWidth: 1,
            height: 52,
            // width:'80%',
            backgroundColor: theme.colors.background,
          },
        ]}
    
        textInputStyle={{
          ...styles.phoneInput,
          color: theme.colors.mainText,
          height: 52,
          textAlign: 'left',
          flexWrap:'nowrap',
        }}
        textContainerStyle={{backgroundColor: 'transparent',  paddingLeft: 10, 
          alignItems: 'center',
        }}
        codeTextStyle={{
          color:theme.colors.mainText,
          fontSize: 16, // Ensure readability
       
        }}
        textInputProps={{
          placeholderTextColor: 'gray', 
        }}
      />

      {error && (
        <Text style={{color: theme.colors.error, fontSize: 16, marginTop: 5}}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
    borderRadius: 8,
    // padding: 16, // Added padding for card-like appearance
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  phoneInputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    // paddingHorizontal: 10,
    height: 52,
    justifyContent: 'center',
    marginTop: 8,
    color: 'black',
  },
  phoneInput: {
    height: '100%',
    fontSize: 16,
    color: 'black',
  },
});

export default MobileInput;
