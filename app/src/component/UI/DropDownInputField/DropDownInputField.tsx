import React, { forwardRef, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Menu, Divider, HelperText } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../../theme/themeProvider'; // Assuming you have a theme provider

type Props = {
  label?: string;
  required?: boolean;
  errorMessage?: string | undefined;
  disabled?: boolean;
  infoText?: string | string[]; // Accepts string array for multiple points
  options?: { value: string | number; label: string }[]; // Options for the dropdown
  defaults?: string | number; // Default selected value
  onChange?: any;
};

const DropdownField = forwardRef<any, Props>((props, ref) => {
  const {
    label,
    required,
    errorMessage,
    disabled,
    infoText,
    options = [],
    defaults,
    onChange,
  } = props;

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | number | undefined>(defaults);
  const [focused, setFocused] = useState(false);
  const { theme } = useTheme(); // Access theme from useTheme hook

  useEffect(() => {
    if (defaults) {
      setSelectedValue(defaults);
    }
  }, [defaults]);

  const handleSelection = (value: string | number) => {
    setSelectedValue(value);
    onChange?.(value);
    setMenuVisible(false);
  };

  const renderInfoText = () => {
    if (Array.isArray(infoText)) {
      return infoText.map((text, index) => (
        <Text key={index} style={theme.typography.text3}>
          {text}
        </Text>
      ));
    }
    return <Text style={theme.typography.text3}>{infoText}</Text>;
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.labelStyle, { color: theme.colors.mainText }]}>
            {label} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
          </Text>
          {infoText && (
            <TouchableOpacity style={styles.infoIcon}>
              <MaterialIcons name="info" size={18} color={theme.colors.primary} />
              {renderInfoText()}
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Dropdown */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity
            style={[
              styles.dropdown,
              {
                backgroundColor: disabled ? theme.colors.disabledBackground : theme.colors.background,
                borderColor: focused ? '#A7C7FF':'#1F64FF66'
              },
   
            ]}
            onPress={() => !disabled && setMenuVisible(true)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            <Text
              style={[
                // theme.typography.text5,
                {
                  fontSize: 16,
                  color: selectedValue
                    ? theme.colors.text // Selected value color
                    : theme.colors.placeholder, // Placeholder color
                },
              ]}
            >
              {options.find((option) => option.value === selectedValue)?.label || 'Select an option'}
            </Text>
          </TouchableOpacity>
        }
        contentStyle={{ backgroundColor: theme.colors.background }}
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            title={option.label}
            onPress={() => handleSelection(option.value)}
            titleStyle={{ color: theme.colors.mainText }}
            style={{ backgroundColor: theme.colors.background }}

          />
        ))}
        {/* <Divider /> */}
      </Menu>

      {/* Error Message */}
      {errorMessage && (
        <HelperText type="error" style={theme.typography.text4} visible={true}>
          {label} is {errorMessage}.
        </HelperText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelStyle:{
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoIcon: {
    marginLeft: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    justifyContent: 'center',
  },
});

export default DropdownField;