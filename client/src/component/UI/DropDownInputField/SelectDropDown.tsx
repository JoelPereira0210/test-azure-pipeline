// // import React from 'react'

// // type Props = {}

// // const SelectDropDown = (props: Props) => {
// //   return (
// //     <div>SelectDropDown</div>
// //   )
// // }

// // export default SelectDropDown
// import { lightColors } from '@/src/theme/colors';
// import { Info } from '@mui/icons-material';
// import { Box, FormControl, Tooltip, Typography } from '@mui/material';
// import React, { useState } from 'react';
// import Select from 'react-select';

// // const options = [
// //     { value: 'chocolate', label: 'Chocolate' },
// //     { value: 'strawberry', label: 'Strawberry' },
// //     { value: 'vanilla', label: 'Vanilla' },
// // ];
// // type Props = {
// //     options: object[]
// // }
// type Props = {
//     placeholder: string;
//     defaults: string;
//     label: string;
//     required?: boolean;
//     // error?: FieldError;
//     errorMessage?: string | undefined;
//     classes?: string;
//     infoText?: string | string[]; // Accepts string array for multiple points
//     disabled?: boolean;
//     options: { value: string | number; label: string }[]; // Options for the dropdown
// }
// const SelectDropDown = ({
//     options,
//     defaults,
//     label,
//     required,
//     errorMessage,
//     classes,
//     infoText,
//     disabled,
// }: Props) => {
//     const [selectedOption, setSelectedOption] = useState(null);
//     const renderInfoText = () => {
//         if (Array.isArray(infoText)) {
//             return infoText.map((text, index) => (
//                 <Typography key={index} variant="body2">
//                     {text}
//                 </Typography>
//             ));
//         }
//         return <Typography variant="body2">{infoText}</Typography>;
//     };
//     return (
//         <Box
//             className={`flex flex-col ${classes}`}
//             sx={{
//                 marginBottom: '27px',
//             }}
//         > <Typography variant="text8" fontWeight={600}>
//                 {label} {required && <span style={{ color: 'red' }}>*</span>}
//                 {infoText && (
//                     <Tooltip title={renderInfoText()} arrow>
//                         <Info
//                             sx={{
//                                 cursor: 'pointer',
//                                 marginLeft: '8px',
//                                 verticalAlign: 'middle',
//                                 color: lightColors.main,
//                             }}
//                         />
//                     </Tooltip>
//                 )}
//             </Typography>
//             <FormControl
//                 variant="outlined"
//                 error={!!errorMessage}
//                 fullWidth
//                 disabled={disabled}
//                 // sx={{ marginTop: '8px' }} // Added margin for spacing between label and select box
//                 sx={{
//                     maxHeight: '56px',
//                 }}
//             >
//                 <Select
//                     defaultValue={selectedOption}
//                     onChange={setSelectedOption}
//                     options={options}
//                 />
//                 {errorMessage && (
//                     <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
//                         {label} is {errorMessage}.
//                     </Typography>
//                 )}
//             </FormControl>
//         </Box>
//     );
// }
// export default SelectDropDown
import { lightColors } from '@/src/theme/colors';
import { useTheme } from '@emotion/react';
import { Info } from '@mui/icons-material';
import { Box, FormControl, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import Select from 'react-select';

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
};

const SelectDropDown = ({
    options,
    label,
    placeholder,
    required,
    errorMessage,
    infoText,
    readOnly,
    onChange, // Accept onChange prop
    value,    // Current value of the dropdown
}: Props) => {
    console.log("value", value)
    const theme: any = useTheme();
    const mode: any = theme?.palette?.mode;
    console.log("mode", mode)
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
            className={`flex flex-col `}
            sx={{ marginBottom: '27px' }}
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
                // disabled={disabled}
                // sx={{ maxHeight: '56px' }}
            >
                <Select
                    value={value} // Controlled component
                    onChange={onChange} // Handle changes here
                    options={options}
                    isDisabled={readOnly}
                    placeholder={placeholder ? placeholder : 'Select...'}
                    styles={{
                        control: (baseStyles) => ({
                            ...baseStyles,
                            // border: '1px Solid black',
                            // height: '54px'
                            borderRadius: '8px',
                            borderBottom: 'none',
                            border: '1px solid rgba(70,95,241,0.40)',
                            background: `${mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-dark-background)'}`,
                            color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
                            boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)',
                            marginTop: '8px',
                            // width: '358px',
                            padding: '8px',
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
                        }),
                        container: (baseStyles) => ({
                            ...baseStyles,
                            // background: `${mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-dark-background)'}`,
                            color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
                        }),
                        option: (baseStyles) => ({
                            ...baseStyles,
                            cursor: 'pointer',
                            background: `${mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-dark-background)'}`,
                            color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
                        }),

                        menu: (baseStyles) => ({
                            ...baseStyles,
                            background: `${mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-dark-background)'}`,
                            color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
                        }),
                        singleValue: (baseStyles) => ({
                            ...baseStyles,
                            background: `${mode === 'light' ? 'var(--tw-bg-light-background)' : 'var(--tw-bg-dark-background)'}`,
                            color: `${mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-dark-mainText)'}`,
                        }),
                        indicatorSeparator: (baseStyles) => ({
                            ...baseStyles,
                            display: 'none'
                        }),
                    }}
                />
                {errorMessage && (
                    <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
                        {label} is {errorMessage}.
                    </Typography>
                )}
            </FormControl>
        </Box>
    );
};

export default SelectDropDown;
