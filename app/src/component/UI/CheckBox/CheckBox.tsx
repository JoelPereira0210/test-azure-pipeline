import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useTheme } from '../../../../theme/themeProvider';

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  color?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void; // ✅ Direct boolean handling
};

const CheckboxInput: React.FC<Props> = ({ label, error, color, disabled = false, checked, onChange }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => onChange(!checked)} 
        color={color || theme.colors.mainText} 
        uncheckedColor={theme.colors.mainText}
        disabled={disabled}
      />
      <Text style={[styles.label, { marginLeft: 8, color: theme.colors.text }]}>{label}</Text>
      {error && (
        <Text style={[theme.typography.text7, { color: theme.colors.error, marginTop: 8 }]}>
          {label} {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default CheckboxInput;
