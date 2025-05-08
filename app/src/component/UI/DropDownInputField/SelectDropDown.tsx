import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, Button, Text, HelperText, IconButton } from 'react-native-paper';
import { useTheme } from '../../../../theme/themeProvider'; // Use themeProvider hook

type Props = {
  placeholder: string;
  label: string;
  required?: boolean;
  errorMessage?: string | undefined;
  infoText?: string | string[]; // Accepts string array for multiple points
  options: { value: string | number; label: string }[]; // Options for the dropdown
  onChange: (selectedOption: { value: string | number; label: string }) => void; // Handle value change
  value?: { value: string | number; label: string } | null;
  readOnly?: boolean;
  mode: string;
};

const SelectDropDown = ({
  options,
  label,
  placeholder,
  required,
  errorMessage,
  infoText,
  readOnly,
  onChange,
  value,
  mode,
}: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || null);
  const [focused, setFocused] = useState(false);
  const { theme } = useTheme(); 

    // Update local state when value prop changes.
    useEffect(() => {
      setSelectedOption(value ?? null);
    }, [value]);
    
  const handleSelect = (option: { value: string | number; label: string }) => {
    setSelectedOption(option);
    onChange(option);
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
    <View style={[styles.container, { backgroundColor: theme.colors.transparent }]}>
      {/* Label */}
      <Text style={[styles.label,{ color: theme.colors.mainText }]}>
        {label} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
      </Text>
      {infoText && (
        <IconButton
          icon={"info-outline"}
          onPress={() => console.log('Info clicked')} // Adjust as needed
          style={styles.infoIcon}
        />
      )}

      {/* Dropdown Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        contentStyle={{
          backgroundColor: theme.colors.background, // Ensure the background is correct
          paddingVertical: 0, // Remove extra vertical padding
          marginVertical: 0, // Remove margin
        }}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            disabled={readOnly}
            style={[
              styles.menuButton,
              {
                backgroundColor: theme.colors.background,
                borderColor: errorMessage
                ? theme.colors.error
                : focused
                ? '#A7C7FF'
                : '#1F64FF66',
              borderWidth: 1,
              borderRadius: 9,
                 alignItems: 'flex-start'
              },
            ]}
            labelStyle={[
              theme.typography.text5,
              {
                color: selectedOption ? theme.colors.text : theme.colors.placeholder,
                textAlign:'left'
            
              },
            ]}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Button>
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => handleSelect(option)}
            title={option.label}
            style={[
              styles.menuItem,
              { backgroundColor: theme.colors.background },
            ]}
            titleStyle={[theme.typography.text4, { color: theme.colors.mainText }]}
          />
        ))}
      </Menu>

      {/* Error Message */}
      {errorMessage && (
        <HelperText type="error" style={theme.typography.text4} visible={!!errorMessage}>
          {errorMessage}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  container: {
    marginBottom: 20,
    // padding: 10,
    borderRadius: 3,
    textAlign:'left',
    width:'100%'
  },
  infoIcon: {
    marginLeft: 8,
    alignSelf: 'center',
  },
  menuButton: {
    justifyContent: 'center',
    height: 50,
    borderRadius: 3,
    borderWidth: 1,
  },
  menuItem: {
    paddingVertical: 0,
    borderRadius: 3,
  },
});

export default SelectDropDown;