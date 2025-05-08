import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, RadioButton, HelperText, IconButton } from 'react-native-paper';
import { useTheme } from '../../../../theme/themeProvider'; // Corrected useTheme import

interface RadioButtonFieldProps {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
  infoText?: string | string[];
  onChange: (value: string) => void;
  value: string;
}

const RadioButtonField: React.FC<RadioButtonFieldProps> = ({
  label,
  options,
  error,
  infoText,
  onChange,
  value,
}) => {
  const { theme } = useTheme(); // Access theme from useTheme hook

  const renderInfoText = () => {
    if (Array.isArray(infoText)) {
      return infoText.map((text, index) => (
        <Text key={index} style={[styles.infoText, { color: theme.colors.text1 }]}>
          {text}
        </Text>
      ));
    }
    return <Text style={[styles.infoText, { color: theme.colors.text1 }]}>{infoText}</Text>;
  };

  function showAlert(infoText: string | string[]): void {
    console.log(infoText); // Replace with custom tooltip logic if needed
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: theme.colors.mainText }]}>{label}</Text>
        {infoText && (
          <IconButton
            icon="information"
            size={16}
            style={styles.infoIcon}
            onPress={() => showAlert(infoText)} // Replace with custom tooltip logic if needed
            iconColor={theme.colors.text2}  // Use iconColor instead of color for IconButton
          />
        )}
      </View>
      <RadioButton.Group onValueChange={onChange} value={value}>
        {options.map((option) => (
          <View key={option.value} style={styles.radioContainer}>
        <RadioButton value={option.value} color={theme.colors.main} />
        <Text style={[styles.radioLabel, { color: theme.colors.mainText }]}>{option.label}</Text>
          </View>
        ))}
      </RadioButton.Group>
      {error && (
        <HelperText type="error" visible={!!error}>
          <Text style={{ color: theme.colors.error }}>{error}</Text>
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 8,
    // padding: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoIcon: {
    marginLeft: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  infoText: {
    fontSize: 12,
  },
});

export default RadioButtonField;