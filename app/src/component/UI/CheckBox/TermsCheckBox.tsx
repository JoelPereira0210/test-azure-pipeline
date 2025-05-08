import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useTheme } from '../../../../theme/themeProvider'; 

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  onClick: () => void;
  spanText?: string;
  checked: boolean;
  onChange: (value: boolean) => void; // Accepts boolean directly
};

const TermsCheckbox = forwardRef<typeof Checkbox, Props>((props, ref) => {
  const { label, required, error, onClick, checked, spanText, onChange } = props;
  const { theme, mode } = useTheme(); 

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => onChange(!checked)} 
          color={theme.colors.mainText}
          uncheckedColor={theme.colors.mainText}
          // @ts-ignore
          ref={ref}
        />
        <Text style={[theme.typography.text6, { color: theme.colors.text }]}>
          {label}{' '}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Text
              style={[
                theme.typography.text5,
                {
                  color: theme.colors.main,
                  textDecorationLine: 'underline',
                },
              ]}
            >
              {spanText}
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
      {error && (
        <Text style={[theme.typography.text6, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
});

TermsCheckbox.displayName = 'TermsCheckbox';

const styles = StyleSheet.create({
  container: {
    marginBottom: 27,
    // padding: 10,
    borderRadius: 8,
  },
  checkboxContainer: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default TermsCheckbox;
