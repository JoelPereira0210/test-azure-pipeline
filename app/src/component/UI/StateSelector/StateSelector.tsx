import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../../../theme/themeProvider';
import { fetchStatesAction } from '../../../actions/auth';

interface StateSelectorProps {
  label?: string;
  onSelectState: (state: { name: string; state_code: string }) => void;
  countryName: string;
  required?: boolean;
  errorMessage?: string;
  value?:{name:string; state_code:string} | null;
  readOnly?: boolean;
  disabled?: boolean;
}

const StateSelector: React.FC<StateSelectorProps> = ({
  label = 'Select State',
  onSelectState,
  countryName,
  required = true,
  errorMessage,
  value,
  readOnly = false,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [states, setStates] = useState<{ name: string; state_code: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    if (countryName) {
      fetchStates(countryName);
    }
  }, [countryName]);

  useEffect(() => {
    if (value) {
      setSelectedState(value.state_code);
    }
  }, [value]);

  const fetchStates = async (country: string) => {
    setLoading(true);
    try {
      const data = await fetchStatesAction(country); 
  
      if (data && !data.error && data.data.length > 0) {
        setStates(data.data); 
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setLoading(false); 
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.mainText }]}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      <View style={[{backgroundColor:theme.colors.background},styles.inputContainer]}>
        {loading ? (
          <ActivityIndicator size="small" color="#1F64FF" />
        ) : (
          <Picker
            selectedValue={selectedState}
            onValueChange={(itemValue) => {
              const selected = states.find((state) => state.state_code === itemValue);
              if (selected) {
                setSelectedState(itemValue);
                onSelectState({
                  name: selected.name,
                  state_code: selected.state_code,
            
                });
              }
            }}
            enabled={!(disabled || readOnly)}
            style={[styles.picker, { color: theme.colors.mainText }]}
          >
            <Picker.Item label="Select a state" value="" />
            {states.length > 0 ? (
              states.map((state) => (
                <Picker.Item key={state.state_code} label={state.name} value={state.state_code} />
              ))
            ) : (
              <Picker.Item label="No states available" value="" />
            )}
          </Picker>
        )}
      </View>

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
  inputContainer: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#A7C7FF',
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default StateSelector;
