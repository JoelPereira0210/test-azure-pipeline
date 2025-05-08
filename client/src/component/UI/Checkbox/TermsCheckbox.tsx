// // import React, { forwardRef } from 'react';
// // import {
// //   Box,
// //   FormControlLabel,
// //   Checkbox,
// //   Typography,
// //   useTheme,
// // } from '@mui/material';
// // // import CircleCheckedFilled from '@mui/icons-material/RadioButton';
// // import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';
// // import { CheckCircle } from '@mui/icons-material';
// // import ButtonInput from '../Button/Button';
// // type Props = {
// //   label: string;
// //   required?: boolean;
// //   error?: string;
// //   classes?: string;
// //   spanText?: string;
// // } & React.ComponentPropsWithoutRef<'input'>;

// // const TermsCheckbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
// //   const { label, required, classes, error, spanText, ...inputProps } = props;
// //   const theme = useTheme();
// //   const mode = theme.palette.mode;
// //   console.log('TTT', mode);
// //   return (
// //     <Box
// //       className={`flex flex-col ${classes}`}
// //       sx={{
// //         marginBottom: '27px',
// //       }}
// //     >
// //       <Box
// //         sx={{
// //           display: 'flex',
// //           alignItems: 'flex-start',
// //         }}
// //         className="termsBox"
// //       >
// //         <FormControlLabel
// //           style={
// //             {
// //               // display: 'inline',
// //             }
// //           }
// //           control={
// //             <Checkbox
// //               icon={<CircleUnchecked />}
// //               checkedIcon={<CheckCircle />}
// //               {...inputProps}
// //               inputRef={ref}
// //               onClick={(e) => {
// //                 console.log('check', e.target.checked);
// //                 inputProps.onChange?.(e);
// //               }}
// //             />
// //           }
// //           label={''}
// //         />
// //         <Typography
// //           color={`  
// //             ${mode === 'light' ? '#9C9AA5' : '#9C9AA5'} `}
// //           component="span"
// //         >
// //           {label}{' '}
// //           <span
// //             onClick={(e) => {
// //               e.stopPropagation();
// //               alert('Policy');
// //             }}
// //             style={{
// //               color: `  
// //             ${mode === 'light' ? '#26203b' : 'var(--tw-text-dark-mainText)'} `,
// //               fontWeight: 400,
// //               cursor: 'pointer',
// //             }}
// //           >
// //             {spanText}
// //           </span>
// //         </Typography>
// //       </Box>
// //       {error && (
// //         <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
// //           {error}
// //         </Typography>
// //       )}
// //     </Box>
// //   );
// // });
// // TermsCheckbox.displayName = 'TermsCheckbox';
// // export default TermsCheckbox;
// import React, { forwardRef } from 'react';
// import {
//   Box,
//   FormControlLabel,
//   Checkbox,
//   Typography,
//   useTheme,
// } from '@mui/material';
// // import CircleCheckedFilled from '@mui/icons-material/RadioButton';
// import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';
// import { CheckCircle } from '@mui/icons-material';
// import ButtonInput from '../Button/Button';
// type Props = {
//   label: string;
//   required?: boolean;
//   error?: string;
//   classes?: string;
//   spanText?: string;
// } & React.ComponentPropsWithoutRef<'input'>;

// const TermsCheckbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
//   const { label, required, classes, error, spanText, ...inputProps } = props;
//   const theme = useTheme();
//   const mode = theme.palette.mode;
//   console.log('TTT', mode);
//   return (
//     <Box
//       className={`flex flex-col ${classes}`}
//       sx={{
//         marginBottom: '27px',
//       }}
//     >
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'flex-start',
//         }}
//         className="termsBox"
//       >
//         <FormControlLabel
//           style={
//             {
//               // display: 'inline',
//             }
//           }
//           control={
//             <Checkbox
//               icon={<CircleUnchecked />}
//               checkedIcon={<CheckCircle />}
//               // {...inputProps}
//               inputRef={ref}
//               onClick={(e) => {
//                 console.log('check', e.target.checked);
//                 inputProps.onChange?.(e);
//               }}
//             />
//           }
//           label={''}
//         />
//         <Typography
//           color={`  
//             ${mode === 'light' ? '#9C9AA5' : '#9C9AA5'} `}
//           component="span"
//         >
//           {label}{' '}
//           <span
//             onClick={(e) => {
//               e.stopPropagation();
//               alert('Policy');
//             }}
//             style={{
//               color: `  
//             ${mode === 'light' ? '#26203b' : 'var(--tw-text-dark-mainText)'} `,
//               fontWeight: 400,
//               cursor: 'pointer',
//             }}
//           >
//             {spanText}
//           </span>
//         </Typography>
//       </Box>
//       {error && (
//         <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
//           {error}
//         </Typography>
//       )}
//     </Box>
//   );
// });
// TermsCheckbox.displayName = 'TermsCheckbox';
// export default TermsCheckbox;
import React, { forwardRef } from 'react';
import {
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  useTheme,
} from '@mui/material';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import { CheckCircle } from '@mui/icons-material';

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  onClick: () => void;
  spanText?: string;
  checked: boolean;
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'color'>;

const TermsCheckbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, required, error, onClick, checked, spanText, ...inputProps } = props;
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box
      className={`flex flex-col `}
      sx={{
        marginBottom: '27px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
        }}
        className="termsBox"
      >
        <FormControlLabel
          control={
            <Checkbox
              icon={<CircleUnchecked />}
              checkedIcon={<CheckCircle />}
              checked={checked}
              inputRef={ref}
              onChange={(e) => {
                console.log("checked", e.target.checked);
                inputProps.onChange?.(e); // Call parent's onChange if provided
              }}
            // You can spread only safe props like onChange, name, checked, etc.
            // {...inputProps} 
            />
          }
          label=""
        />
        <Typography
          color={mode === 'light' ? '#9C9AA5' : '#9C9AA5'}
          component="span"
        >
          {label}{' '}
          <span
            onClick={(e) => {
              e.stopPropagation();
              // alert('Policy');
              onClick();
            }}
            style={{
              color: mode === 'light' ? '#26203b' : 'var(--tw-text-dark-mainText)',
              fontWeight: 400,
              cursor: 'pointer',
            }}
          >
            {spanText}
          </span>
        </Typography>
      </Box>
      {error && (
        <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
});

TermsCheckbox.displayName = 'TermsCheckbox';
export default TermsCheckbox;
