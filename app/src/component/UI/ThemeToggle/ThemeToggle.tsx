import React from 'react';
import { IconButton } from 'react-native-paper';
import { useTheme } from '../../../../theme/themeProvider';
import { View } from 'react-native';

const ThemeToggle = () => {
  const { mode, toggleTheme, theme } = useTheme();

  return (
    <View style={{backgroundColor: theme.colors.background }}>


    <IconButton
      icon={mode === 'light' ? 'moon-waxing-crescent' : 'white-balance-sunny'}
      onPress={toggleTheme}
      iconColor={theme.colors.mainText}
      style={{ alignSelf: 'flex-end', margin: 16 }}
    />
        </View>
  );
};

export default ThemeToggle;
