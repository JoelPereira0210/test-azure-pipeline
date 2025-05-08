// import { lightColors } from '@/src/theme/colors';
// import { Info } from '@mui/icons-material';
// import { Box, FormControl, Select, MenuItem, Typography, Tooltip, FormHelperText } from '@mui/material';
// import React, { forwardRef } from 'react';
// import { FieldError } from 'react-hook-form';
// type Props = {
//   label: string;
//   required?: boolean;
//   error?: FieldError;
//   classes?: string;
//   infoText?: string | string[]; // Modified to accept string array for multiple points
//   disabled?: boolean;
//   options: { value: string | number; label: string }[]; // Options for the dropdown
// } & React.ComponentPropsWithoutRef<'select'>;

// const DropdownField = forwardRef<HTMLSelectElement, Props>((props, ref) => {
//   const { label, required, classes, error, disabled, infoText, options, ...selectProps } = props;

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
//         marginBottom: '27px'
//       }}
//     >
//       <Typography variant="text8" fontWeight={600}>
//         {label} {required && <span style={{ color: 'red' }}>*</span>}
//         {infoText && (
//           <Tooltip title={renderInfoText()} arrow>
//             <Info
//               sx={{
//                 cursor: 'pointer',
//                 marginLeft: '8px',
//                 verticalAlign: 'middle',
//                 color: lightColors.main,
//               }}
//             />
//           </Tooltip>
//         )}
//       </Typography>
//       <FormControl
//         variant="outlined"
//         error={!!error}
//         fullWidth
//         disabled={disabled}
//         sx={{ marginTop: '8px' }} // Added margin for spacing between label and select box
//       >
//         <Select
//           {...selectProps}
//           inputRef={ref}
//           sx={{
//             borderRadius: '8px',
//             borderBottom: 'none',
//             border: '1px solid rgba(70,95,241,0.40)',
//             boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)',
//             marginTop: '8px',
//             padding: '10px',
//             width: '100%',  // Ensure consistent width
//             maxWidth: '358px', // Limit the maximum width to match InputField
//             ':hover': {
//               '::before': {
//                 borderBottom: 'none',
//               },
//             },
//             '@media(max-width:414px)': {
//               width: '100%', // Adjust for mobile view
//             },
//           }}
//         >
//           {options.map((option) => (
//             <MenuItem key={option.value} value={option.value}>
//               {option.label}
//             </MenuItem>
//           ))}
//         </Select>
//         {error && (
//           <FormHelperText error sx={{ marginTop: '8px' }}>
//             {error.message} {/* Extract the error message */}
//           </FormHelperText>
//         )}
//       </FormControl>
//     </Box>
//   );
// });

// DropdownField.displayName = 'DropdownField';

// export default DropdownField;

import { lightColors } from '@/src/theme/colors';
import { Info } from '@mui/icons-material';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Tooltip,
  FormHelperText, SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import React, { forwardRef, useEffect } from 'react';
import { FieldError } from 'react-hook-form';

type Props = {
  defaults?: string;
  label?: string;
  required?: boolean;
  error?: FieldError;
  errorMessage?: string | undefined;
  classes?: string;
  infoText?: string | string[]; // Accepts string array for multiple points
  disabled?: boolean;

  options?: { value: string | number; label: string }[]; // Options for the dropdown
  onChange?: any;
} & SelectProps &
  React.ComponentPropsWithoutRef<'select'>; // Extend SelectProps for better compatibility

const DropdownField = forwardRef<HTMLSelectElement, Props>((props, ref) => {
  const {
    label,
    required,
    classes,
    error,
    errorMessage,
    disabled,
    infoText,
    options,
    // defaultValue,
    defaults,

    ...selectProps
  } = props;
  console.log('err', errorMessage);
  useEffect(() => {
    console.log("defaults", defaults)
    defaultSetter(defaults)

    if (defaults) {
      defaultSetter(defaults)
    }
  }, [defaults])
  const defaultSetter = (e) => {
    console.log("defaultSetter", e)
  }
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
      }}
    >
      <Typography variant="text8" fontWeight={600}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
        {infoText && (
          <Tooltip title={renderInfoText()} arrow>
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
      <FormControl
        variant="outlined"
        error={!!errorMessage}
        fullWidth
        disabled={disabled}
        // sx={{ marginTop: '8px' }} // Added margin for spacing between label and select box
        sx={{
          maxHeight: '56px',
        }}
      >
        <Select
          {...selectProps}
          inputRef={ref}
          // value={defaults ? defaults : 1}
          sx={{
            borderRadius: '8px',
            borderBottom: 'none',
            border: '1px solid rgba(70,95,241,0.40)',
            boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)',
            marginTop: '8px',
            padding: '10px',
            width: '100%', // Ensure consistent width
            // maxWidth: '358px',
            '.css-17ah52a-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root.Mui-error .MuiOutlinedInput-notchedOutline':
            {
              borderColor: 'transparent',
            },
            ':hover': {
              '::before': {
                borderBottom: 'none',
              },
            },
            '@media(max-width:414px)': {
              width: '100%', // Adjust for mobile view
            },
          }}
        // defaultValue={ }
        // onChange={(e) => {
        //   // console.log("VALUE", e.target)
        //   defaultSetter(e)
        // }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {/* {errorMessage && (
          <FormHelperText error sx={{ marginTop: '8px' }}>
            {errorMessage} 
          </FormHelperText>
        )} */}
      </FormControl>
      {errorMessage && (
        <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
          {label} is {errorMessage}.
        </Typography>
      )}
    </Box>
  );
});

DropdownField.displayName = 'DropdownField';

export default DropdownField;
