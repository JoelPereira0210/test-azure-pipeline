import { lightColors } from '@/src/theme/colors';
import { Info } from '@mui/icons-material';
import { Box, Input, Typography, Tooltip, InputProps as MUIInputProps, InputAdornment } from '@mui/material';
import React, { forwardRef } from 'react';

// type Props = {
//   label: string;
//   type: string;
//   required?: boolean;
//   error?: string;
//   classes?: string;
//   infoText?: string | string[]; // Modified to accept string array for multiple points
//   disabled?: boolean;
// } & React.ComponentPropsWithoutRef<'input'>;
type Props = {
  label: string;
  type: string;
  required?: boolean;
  errorMessage?: string | undefined;
  classes?: string;
  infoText?: string | string[];
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
} & MUIInputProps; // Extend MUI InputProps


const InputField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, type, required, classes, errorMessage, disabled, infoText,icon,...inputProps } =
    props;

  const renderInfoText = () => {
    if (Array.isArray(infoText)) {
      return infoText.map((text, index) => (
        <Typography key={index} variant="body2">
          {text}
        </Typography>
      ));
    }

    return <Typography variant="body2">{infoText}</Typography>;
  };

  return (
    <Box
      className={`flex flex-col ${classes}`}
      sx={{
        marginBottom: '27px',
        width: '100%',
        '@media (max-width: 640px)': {
          marginBottom: '10px',
        }
      }}
    >
      <label>
        <Typography variant="text8" fontWeight={600}>
          {label} {required && <span style={{ color: 'red' }}>*</span>}{' '}
          {infoText && (
            <Tooltip title={renderInfoText()} arrow placement='top'>
              <Info
                sx={{
                  cursor: 'pointer',
                  marginLeft: '8px',
                  verticalAlign: 'middle',
                  color: lightColors.main,
                }}
              />
            </Tooltip>
          )}
        </Typography>
      </label>
      <Input
        type={type ? type : 'text'}
        placeholder={`Enter ${label}`}
        sx={{
          borderRadius: '8px',
          borderBottom: 'none',
          border: '1px solid rgba(70,95,241,0.40)',
          // background: '#fff',
          boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)',
          marginTop: '8px',
          // width: '358px',
          padding: '10px',
          ':hover': {
            '::before': {
              borderBottom: 'none',
            },
          },
          '::before': {
            borderBottom: 'none',
          },
          '::after': {
            borderBottom: 'none',
          },
          ':hover:not(.Mui-disabled):not(.Mui-error)::before': {
            borderBottom: 'none',
          },

          '@media(max-width:414px)': {
            width: '100%',
          },
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                          display: "none",
                        },
          "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
        }}
        inputRef={ref}
        error={Boolean(errorMessage)}
        {...inputProps}
        disabled={disabled ? disabled : false}
        endAdornment={
          icon && <InputAdornment position="end">{icon}</InputAdornment> // Conditionally render the icon
        }
        {...inputProps}
      />
      {errorMessage && (
        <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
});

InputField.displayName = 'InputField';

export default InputField;


// import { lightColors } from '@/src/theme/colors';
// import { Info } from '@mui/icons-material';
// import { Box, Input, Typography, Tooltip } from '@mui/material';
// import React, { forwardRef } from 'react';

// type Props = {
//   label: string;
//   type: string;
//   required?: boolean;
//   error?: string;
//   classes?: string;
//   infoText?: string | string[]; // Modified to accept string array for multiple points
//   disabled?: boolean;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
// } & React.ComponentPropsWithoutRef<'input'>;

// const InputField = forwardRef<HTMLInputElement, Props>((props, ref) => {
//   const { label, required, classes, onChange, error, disabled, infoText, ...inputProps } =
//     props;

//   const renderInfoText = () => {
//     if (Array.isArray(infoText)) {
//       return infoText.map((text, index) => (
//         <Typography key={index} variant="body2">
//           {text}
//         </Typography>
//       ));
//     }

//     return <Typography variant="body2">{infoText}</Typography>;
//   };

//   return (
//     <Box
//       className={`flex flex-col ${classes}`}
//       sx={{
//         marginBottom: '27px',
//         width: '100%',
//         '@media (max-width: 640px)': {
//           marginBottom: '10px',
//         }
//       }}
//     >
//       <label>
//         <Typography variant="text8" fontWeight={600}>
//           {label} {required && <span style={{ color: 'red' }}>*</span>}{' '}
//           {infoText && (
//             <Tooltip title={renderInfoText()} arrow placement='top'>
//               <Info
//                 sx={{
//                   cursor: 'pointer',
//                   marginLeft: '8px',
//                   verticalAlign: 'middle',
//                   color: lightColors.main,
//                 }}
//               />
//             </Tooltip>
//           )}
//         </Typography>
//       </label>
//       <Input
//         placeholder={`Enter ${label}`}
//         sx={{
//           borderRadius: '8px',
//           borderBottom: 'none',
//           border: '1px solid rgba(70,95,241,0.40)',
//           // background: '#fff',
//           boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)',
//           marginTop: '8px',
//           // width: '358px',
//           padding: '10px',
//           ':hover': {
//             '::before': {
//               borderBottom: 'none',
//             },
//           },
//           '::before': {
//             borderBottom: 'none',
//           },
//           '::after': {
//             borderBottom: 'none',
//           },
//           ':hover:not(.Mui-disabled):not(.Mui-error)::before': {
//             borderBottom: 'none',
//           },

//           '@media(max-width:414px)': {
//             width: '100%',
//           },
//         }}
//         inputRef={ref}
//         required={required}
//         onChange={onChange}
//         {...inputProps}
//         disabled={disabled ? disabled : false}
//       />
//       {error && (
//         <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
//           {error}
//         </Typography>
//       )}
//     </Box>
//   );
// });

// InputField.displayName = 'InputField';

// export default InputField;
