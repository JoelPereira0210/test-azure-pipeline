//@ts-nocheck
import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal-v2';
import { Country } from 'react-native-country-picker-modal-v2';
import { useTheme } from '../../../../theme/themeProvider';

interface CountrySelectorProps {
    label?: string;
    onSelectCountry: (country: { cca2: string; name: string; callingCode: String; subregion: string }) => void;
    defaultCountryCode?: string;
    // value?: { iso2: string; name: string };
    value?: { iso2: string; name: string; phone_code?: String; subregion?: string };
    required?: boolean;
    errorMessage?: string;
    readOnly?: boolean;   // New prop to mark as read-only
  disabled?: boolean;   // New prop to disable interaction
  }
  
  const CountrySelector: React.FC<CountrySelectorProps> = ({
    label = 'Select Country',
    onSelectCountry,
    defaultCountryCode = 'IN',
    value,
    required = true,
    errorMessage,
    readOnly = false,
    disabled = false,
  }) => {
    const { theme } = useTheme();
    const [countryCode, setCountryCode] = useState(defaultCountryCode);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [focused, setFocused] = useState(false);
  

    useEffect(() => {
      if (value) {
        setCountryCode(value.iso2);
        setSelectedCountry({ cca2: value.iso2, 
          name: value.name,
          callingCode: [String(value.phone_code || '')],
          subregion: value.subregion || '',
         } as Country);

    
      }
      
    }, [value]);

    const handleSelect = (country: Country) => {
      if (disabled || readOnly) return;
      setCountryCode(country.cca2);
      setSelectedCountry(country);
  
      // Extract only required fields
      const selectedCountryData = {
        iso2: country.cca2,
        name: country.name,
        phone_code: String(country.callingCode?.[0] || ''),
        subregion: country.subregion || '',
      };
      
      //@ts-ignore
      onSelectCountry(selectedCountryData);
    };
  

    console.log("country code props value",value)
    return (
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.colors.mainText }]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
  
        <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.background,
              borderColor: focused ? '#A7C7FF' : '#1F64FF66',
            },
          ]}
          onPress={() => {
            if (!disabled && !readOnly) {
              setFocused(true);
            }
          }}
          disabled={disabled || readOnly}
        >
          <CountryPicker
            countryCode={countryCode}
            withFlag
            withFilter
            withAlphaFilter
            withCallingCode
            onSelect={handleSelect}
            visible={false}
            pointerEvents={disabled || readOnly ? 'none' : 'auto'}
          />
          <Text style={[styles.selectedText, { color: theme.colors.mainText }]}>
            {selectedCountry ? selectedCountry.name : 'Select a country'}
          </Text>
        </TouchableOpacity>
  
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    );
  };
  
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
      borderRadius: 3,
      borderWidth: 1,
      paddingHorizontal: 10,
      fontSize: 16,
      height: 50,
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedText: {
      fontSize: 16,
      marginLeft: 10,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
    },
  });
  
  export default CountrySelector;