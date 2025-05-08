// 'use client';
// import { Montserrat } from 'next/font/google';
// import { createTheme, responsiveFontSizes } from '@mui/material/styles';
// import '@fontsource/montserrat/300.css';
// import '@fontsource/montserrat/400.css';
// import '@fontsource/montserrat/500.css';
// import '@fontsource/montserrat/700.css';
// import '@fontsource/montserrat/600.css';
// import '@fontsource/montserrat/900.css';
// import { lightColors, darkColors } from '@/src/theme/colors';

// const montserrat = Montserrat({
//   weight: ['300', '400', '500', '600', '700', '900'],
//   subsets: ['latin'],
//   display: 'swap',
// });

// export const theme = (mode: any) => {
//   let baseTheme = createTheme({
//     palette: {
//       mode,
//       primary: {
//         main: mode === 'light' ? lightColors.main : darkColors.main,
//       },
//       secondary: {
//         main: mode === 'light' ? lightColors.main : darkColors.main,
//       },
//       background: {
//         default:
//           mode === 'light' ? lightColors.background : darkColors.background,
//         paper:
//           mode === 'light' ? lightColors.background : darkColors.background,
//       },
//       text: {
//         primary: mode === 'light' ? lightColors.mainText : darkColors.mainText,
//         secondary:
//           mode === 'light' ? lightColors.mainText : darkColors.mainText,
//       },
//     },
//     typography: {
//       fontFamily: montserrat.style.fontFamily,
//       text1: {
//         fontSize: '2.25rem',
//         fontWeight: '600',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '1.5rem',
//         },
//       },
//       text2: {
//         fontSize: '1rem',
//         fontWeight: '600',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '1rem',
//         },
//       },
//       text3: {
//         fontSize: '1.25rem',
//         fontWeight: '700',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '0.825rem',
//         },
//       },
//       text4: {
//         fontSize: '0.825rem',
//         fontWeight: '700',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '0.825rem',
//         },
//       },
//       text5: {
//         fontSize: '0.825rem',
//         fontWeight: '500',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '0.825rem',
//         },
//       },
//       text6: {
//         fontSize: '1rem',
//         fontWeight: '300',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '0.75rem',
//         },
//       },
//       text7: {
//         fontSize: '0.825rem',
//         fontWeight: '400',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '0.825rem',
//         },
//       },
//       text8: {
//         fontSize: '1rem',
//         fontWeight: '500',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '1rem',
//         },
//       },
//       text9: {
//         fontSize: '2.5rem',
//         fontWeight: '900',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '1.5rem',
//           fontWeight: '500',
//         },
//       },
//       text10: {
//         fontSize: '1.375rem',
//         fontWeight: '500',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '1rem',
//           fontWeight: '500',
//         },
//       },
//       text11: {
//         fontSize: '2.5rem',
//         fontWeight: '700',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '1rem',
//           fontWeight: '500',
//         },
//       },
//       text12: {
//         fontSize: '1.5rem',
//         fontWeight: '500',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '0.75rem',
//           fontWeight: '500',
//         },
//       },
//       text13: {
//         fontSize: '2rem',
//         fontWeight: '500',
//         lineHeight: 'normal',
//         '@media (max-width:768px)': {
//           fontSize: '1.75rem',
//           fontWeight: '500',
//         },
//       },
//     },
//     breakpoints: {
//       values: {
//         xs: 0,
//         sm: 600,
//         md: 900,
//         lg: 1200,
//         xl: 1536,
//       },
//     },
//   });

//   return responsiveFontSizes(baseTheme);
// };

// export default theme;
// // 'use client'
// // import { Montserrat } from 'next/font/google';
// // import { createTheme, responsiveFontSizes } from '@mui/material/styles';
// // import '@fontsource/montserrat/300.css';
// // import '@fontsource/montserrat/400.css';
// // import '@fontsource/montserrat/500.css';
// // import '@fontsource/montserrat/700.css';
// // import '@fontsource/montserrat/600.css';
// // import { lightColors, darkColors } from './colors';

// // const montserrat = Montserrat({
// //   weight: ['300', '400', '500', '600', '700'],
// //   subsets: ['latin'],
// //   display: 'swap',
// // });

// // export const theme = (mode: 'light' | 'dark') => {
// //   let baseTheme = createTheme({
// //     palette: {
// //       mode,
// //       primary: {
// //         main: mode === 'light' ? lightColors.main : darkColors.main,
// //       },
// //       secondary: {
// //         main: mode === 'light' ? lightColors.main : darkColors.main,
// //       },
// //       background: {
// //         default:
// //           mode === 'light' ? lightColors.background : darkColors.background,
// //         paper:
// //           mode === 'light' ? lightColors.background : darkColors.background,
// //       },
// //       text: {
// //         primary: mode === 'light' ? lightColors.mainText : darkColors.mainText,
// //         secondary:
// //           mode === 'light' ? lightColors.mainText : darkColors.mainText,
// //       },
// //     },
// //     typography: {
// //       fontFamily: montserrat.style.fontFamily,
// //       text1: {
// //         fontSize: '2.25rem',
// //         fontWeight: '600',
// //         lineHeight: 'normal',
// //         '@media (max-width:768px)': {
// //           fontSize: '1.5rem',
// //         },
// //       },
// //       text2: {
// //         fontSize: '1rem',
// //         fontWeight: '600',
// //         lineHeight: 'normal',
// //         '@media (max-width:768px)': {
// //           fontSize: '1rem',
// //         },
// //       },
// //       text3: {
// //         fontSize: '1.25rem',
// //         fontWeight: '700',
// //         lineHeight: 'normal',
// //         '@media (max-width:768px)': {
// //           fontSize: '0.825rem',
// //         },
// //       },
// //       text4: {
// //         fontSize: '0.825rem',
// //         fontWeight: '700',
// //         lineHeight: 'normal',
// //         '@media (max-width:768px)': {
// //           fontSize: '0.825rem',
// //         },
// //       },
// //       text5: {
// //         fontSize: '0.825rem',
// //         fontWeight: '500',
// //         lineHeight: 'normal',
// //         '@media (max-width:768px)': {
// //           fontSize: '0.825rem',
// //         },
// //       },
// //       text6: {
// //         fontSize: '1rem',
// //         fontWeight: '300',
// //         lineHeight: 'normal',
// //         '@media (max-width:768px)': {
// //           fontSize: '0.75rem',
// //         },
// //       },
// //       text7: {
// //         fontSize: '0.825rem',
// //         fontWeight: '400',
// //         lineHeight: 'normal',
// //         '@media (max-width:768px)': {
// //           fontSize: '0.825rem',
// //         },
// //       },
// //       text8: {
// //         fontSize: '1rem',
// //         fontWeight: '500',
// //         lineHeight: 'normal',
// //         '@media (max-width:600px)': {
// //           fontSize: '1rem',
// //         },
// //       },
// //       text9: {
// //         fontSize: '2.5rem',
// //         fontWeight: '900',
// //         lineHeight: 'normal',
// //         '@media (max-width:600px)': {
// //           fontSize: '1.5rem',
// //         },
// //       }
// //       // Add other text variants similarly
// //     },
// //     breakpoints: {
// //       values: {
// //         xs: 0,
// //         sm: 600,
// //         md: 900,
// //         lg: 1200,
// //         xl: 1536,
// //       },
// //     },
// //   });

// //   return responsiveFontSizes(baseTheme);
// // };

// // export default theme;

'use client';
import { Montserrat } from 'next/font/google';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/900.css';
import { lightColors, darkColors } from '@/src/theme/colors';

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

const responsiveFontSize = (size) => ({
  fontSize: size,
  '@media (max-width:768px)': {
    fontSize: typeof size === 'string' ? `${parseFloat(size) * 0.67}rem` : size * 0.67,
  },
});

export const theme = (mode) => {
  let baseTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? lightColors.main : darkColors.main,
      },
      secondary: {
        main: mode === 'light' ? lightColors.main : darkColors.main,
      },
      background: {
        default:
          mode === 'light' ? lightColors.background : darkColors.background,
        paper:
          mode === 'light' ? lightColors.background : darkColors.background,
      },
      text: {
        primary: mode === 'light' ? lightColors.mainText : darkColors.mainText,
        secondary:
          mode === 'light' ? lightColors.mainText : darkColors.mainText,
      },
    },
    typography: {
      fontFamily: montserrat.style.fontFamily,
      text1: responsiveFontSize('2.25rem'),
      text2: responsiveFontSize('1rem'),
      text3: responsiveFontSize('1.25rem'),
      text4: responsiveFontSize('0.825rem'),
      text5: responsiveFontSize('0.825rem'),
      text6: responsiveFontSize('1rem'),
      text7: responsiveFontSize('0.825rem'),
      text8: responsiveFontSize('1rem'),
      text9: responsiveFontSize('2.5rem'),
      text10: responsiveFontSize('1.375rem'),
      text11: responsiveFontSize('2.5rem'),
      text12: responsiveFontSize('1.5rem'),
      text13: responsiveFontSize('2rem'),
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  return responsiveFontSizes(baseTheme);
};

export default theme;
