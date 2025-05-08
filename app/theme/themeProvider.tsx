import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider as PaperThemeProvider } from 'react-native-paper';
import theme from './theme'; // Import your custom theme function

interface ThemeContextType {
  colors: any;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  theme: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Retrieve theme mode from AsyncStorage
  useEffect(() => {
    const fetchThemeMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem('themeMode');
        if (storedMode) {
          setMode(storedMode as 'light' | 'dark');
        }
      } catch (error) {
        console.error('Error retrieving theme mode:', error);
      }
    };

    fetchThemeMode();
  }, []);

  // Toggles between light and dark mode
  const toggleTheme = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);

    try {
      await AsyncStorage.setItem('themeMode', newMode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  // Generate the theme dynamically based on the mode
  const currentTheme = theme(mode);

  return (
   
    <ThemeContext.Provider value={{ mode, toggleTheme, theme: currentTheme, colors: currentTheme.colors }}>
      <PaperThemeProvider theme={currentTheme}>{children}</PaperThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};