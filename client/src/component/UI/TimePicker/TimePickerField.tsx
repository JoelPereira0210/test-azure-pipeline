
import React, { forwardRef } from 'react';
import { lightColors } from '@/src/theme/colors';
import { styled } from '@mui/material/styles';  // Import styled to access the theme
import { Info } from '@mui/icons-material';
import { Box, Typography, Tooltip, TextField } from '@mui/material';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';  // For locale support

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
type Props = {
    label: string;
    required?: boolean;
    error?: string;
    value: any;
    minTime?: any;
    onChange: (newValue: any) => void;
    disabled?: boolean;
    style?: React.CSSProperties;
} & React.ComponentPropsWithoutRef<'input'>;

const CustomTimePickerWrapper = styled('div')(({ theme }) => ({
    borderRadius: '8px',
    border: '1px solid rgba(70,95,241,0.40)',
    boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)',
    marginTop: '8px',
    width: '100%',
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px', // Outer border radius
        '& fieldset': {
            borderColor: 'transparent', // Remove the default black border
        },
        '&:hover fieldset': {
            borderColor: 'transparent', // Hover border color
        },
        '&.Mui-focused fieldset': {
            borderColor: 'transparent', // Focus border color
        },
        '& .MuiInputBase-input': {
            color: theme.palette.mode === 'light' ? 'var(--tw-text-light-mainText)' : 'var(--tw-text-light-smallText)', // Conditionally apply text color
            padding: '15px 15px',  // Reduce the padding to reduce height
        },

    },

}));

const TimePickerField = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, required, error, value, onChange, minTime, disabled, style, ...inputProps } = props;

    const handleTimeChange = (newValue: any) => {
        if (newValue) {
            onChange(newValue.format('HH:mm')); // Format the time to 'HH:mm'
        } else {
            onChange(''); // Clear the time if empty
        }
    };

    return (
        <Box
            sx={{
                marginBottom: '27px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <label>
                <Typography variant="text8" fontWeight={600}>
                    {label} {required && <span style={{ color: 'red' }}>*</span>}
                </Typography>
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CustomTimePickerWrapper>
                    <MobileTimePicker
                        sx={{
                            '& .MuiPickersAmPmSelection-root': {
                                '& .Mui-selected': {
                                    backgroundColor: 'lightblue', // Your highlight color when selected
                                    color: 'white', // Text color for selected state
                                },
                                '& .MuiButtonBase-root': {
                                    color: 'gray', // Default color for non-selected
                                },
                            },
                        }}
                        value={value ? dayjs(value, 'HH:mm') : null} // Pass the current value, format as 'HH:mm'
                        onChange={handleTimeChange} // Handle time change
                        disabled={disabled}
                        minTime={minTime ? dayjs(minTime, 'HH:mm') : undefined}
                    // inputFormat="HH:mm" // Format time as 'HH:mm' (like HTML time input)
                    // renderInput={(params) => (
                    //     <TextField
                    //         {...params}
                    //         ref={ref}
                    //         error={!!error}
                    //         helperText={error}
                    //         InputLabelProps={{
                    //             shrink: true, // Ensure label stays visible for time input
                    //         }}
                    //         sx={{
                    //             ...style, // Spread custom styles
                    //             '& input': {
                    //                 color: style?.color, // Apply dynamic text color
                    //                 backgroundColor: style?.backgroundColor, // Apply background color
                    //             },
                    //         }}
                    //         {...inputProps} // Spread additional props like min/max time, etc.
                    //     />
                    // )}
                    />
                </CustomTimePickerWrapper>
            </LocalizationProvider>
            {error && (
                <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
});

TimePickerField.displayName = 'TimePickerField';

export default TimePickerField;










