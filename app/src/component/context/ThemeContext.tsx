// import React, { createContext, useContext, useMemo, useState } from 'react';
// import { createTheme, ThemeProvider, PaletteMode } from '@mui/material/styles';

// const ThemeContext = createContext<{
//   mode: PaletteMode;
//   toggleTheme: () => void;
// } | null>(null);

// export const ThemeProviderWrapper: React.FC = ({ children }) => {
//   const getDefaultMode = (): PaletteMode => {
//     const savedMode = localStorage.getItem('themeMode') as PaletteMode;
//     return (savedMode === 'light' || savedMode === 'dark')
//       ? savedMode
//       : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
//   };

//   const [mode, setMode] = useState<PaletteMode>(getDefaultMode());

//   const toggleTheme = () => {
//     const newMode: PaletteMode = mode === 'dark' ? 'light' : 'dark';
//     setMode(newMode);
//     localStorage.setItem('themeMode', newMode);
//   };

//   const theme = useMemo(() => createTheme({
//     palette: {
//       mode,
//     },
//   }), [mode]);

//   return (
//     <ThemeContext.Provider value={{ mode, toggleTheme }}>
//       <ThemeProvider theme={theme}>
//         {children}
//       </ThemeProvider>
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProviderWrapper');
//   }
//   return context;
// };
