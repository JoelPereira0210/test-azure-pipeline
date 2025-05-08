import { DefaultTheme, configureFonts } from 'react-native-paper';
import { Platform } from 'react-native';
import { lightColors, darkColors } from './color';

const fontConfig = {
  android: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Montserrat-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Montserrat-Thin',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: 'bold',
    },
  },
  ios: {
    regular: {
      fontFamily: 'Montserrat',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Montserrat',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Montserrat',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Montserrat',
      fontWeight: '200',
    },
    bold: {
      fontFamily: 'Montserrat',
      fontWeight: '700',
    },
  },
  default: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Montserrat-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Montserrat-Thin',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: 'bold',
    },
  },
};

export const theme = (mode: string) => {
  const isLightMode = mode === 'light';

  return {
    ...DefaultTheme,
    dark: !isLightMode,
    colors: {
      ...DefaultTheme.colors,
      ...(isLightMode ? lightColors : darkColors), // Dynamically apply colors
    },
    //@ts-ignore
    fonts: configureFonts(fontConfig),
    typography: {
      text1: { fontSize: 36, fontWeight: 'semibold', color: isLightMode ? '#000000' : '#ffffff' },
      text2: { fontSize: 16, fontWeight: 'semibold', color: isLightMode ? '#000000' : '#ffffff' },
      text3: { fontSize: 20, fontWeight: 'bold', color: isLightMode ? '#000000' : '#ffffff' },
      text4: { fontSize: 13.2, fontWeight: 'bold', color: isLightMode ? '#000000' : '#ffffff' },
      text5: { fontSize: 13.2, fontWeight: 'medium', color: isLightMode ? '#000000' : '#ffffff' },
      text6: { fontSize: 16, fontWeight: 'regular', color: isLightMode ? '#000000' : '#ffffff' },
      text7: { fontSize: 13.2, fontWeight: 'medium', color: isLightMode ? '#000000' : '#ffffff' },
      text8: { fontSize: 16, fontWeight: 'light', color: isLightMode ? '#000000' : '#ffffff' },
      text9: { fontSize: 40, fontWeight: 'regular', color: isLightMode ? '#000000' : '#ffffff' },
      text10: { fontSize: 22, fontWeight: 'light', color: isLightMode ? '#000000' : '#ffffff' },
      text11: { fontSize: 40, fontWeight: 'thin', color: isLightMode ? '#000000' : '#ffffff' },
      text12: { fontSize: 24, fontWeight: 'light', color: isLightMode ? '#000000' : '#ffffff' },
      text13: { fontSize: 32, fontWeight: 'thin', color: isLightMode ? '#000000' : '#ffffff' },
    },
  };
};

export default theme;