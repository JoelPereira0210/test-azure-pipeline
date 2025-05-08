import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTheme } from '../../../../theme/themeProvider';


type Props = {
  text: string;
  buttonBackgroundColor?: string;
  buttonFontColor?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset'; // React Native doesn't directly use these types
  styles?: object;
  onPress?: (e?: any) => void;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  loading?: boolean;
  borderColor?: string;
  icon?: React.ReactNode; 
  width?: number | string; 
  height?: number | string; 
};

const ButtonInput = (props: Props) => {
  const {theme} = useTheme();
  return (
    <View style={[styles.buttonContainer,{ width: props.width || '100%' }, props.styles]}>
      <Button
        mode="contained"
        onPress={props.onPress}
        disabled={props.disabled || props.loading}
        style={[
          {
        borderRadius: 8,
          },
        ]}
        contentStyle={[
          styles.buttonContent,
          {
        backgroundColor: (props.disabled) 
          ? theme.colors.smallText 
          : props.buttonBackgroundColor || 'rgba(31, 100, 255, 1)',
        height: 50,
        borderColor: props.borderColor || 'transparent',
        justifyContent: 'center', 
        alignItems: 'center', 
          },
        ]}
        labelStyle={[
          styles.label,
          {
        color: props.buttonFontColor || '#fff',
        fontSize: props.fontSize || 16,
        fontWeight: props.fontWeight || '700',
        textAlign: 'center', 
        alignSelf: 'center', 
          },
        ]}
      >
        {props.loading ? (
          <ActivityIndicator size="small" color={props.buttonFontColor || '#fff'} />
        ) : (
          <View style={styles.iconAndText}>
        {props.icon && <View style={styles.icon}>{props.icon}</View>}
      
        <Text style={[styles.buttonText, { color: props.buttonFontColor || '#fff' }]}>
          {props.text}
        </Text>
          </View>
        )}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 8,
  },
  buttonContent: {
    paddingVertical: 0,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  label: {
    textTransform: 'none',
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8, // Add some spacing between the icon and text
  },
});

export default ButtonInput;