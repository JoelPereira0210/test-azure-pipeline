
import { lightColors } from '@/src/theme/colors';
import { Box, Typography, TextField } from '@mui/material';
import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import React, { forwardRef } from 'react';
import { styled } from '@mui/material/styles';  // Import styled to access the theme

type Props = {
    label: string;
    required?: boolean;
    error?: string;
    value: any;
    onChange: (newValue: any) => void;
    disabled?: boolean;
    style?: React.CSSProperties;
    minDate?: Dayjs; // Explicitly declare minDate type if needed
    maxDate?: Dayjs;
    readOnly?: boolean;
} & React.ComponentPropsWithoutRef<'input'>;

const CustomDatePickerWrapper = styled('div')(({ theme }) => ({
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

const DatePickerField = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, required, error, value, onChange, disabled, style, readOnly, minDate,maxDate, ...inputProps } = props;

    const handleDateChange = (newValue: Dayjs | null) => {
        if (newValue) {
            onChange(newValue.format('YYYY-MM-DD')); // Format as date string (ISO format)
        } else {
            onChange(''); // Clear the date if empty
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
                <CustomDatePickerWrapper>
                    <MobileDatePicker
                        value={value ? dayjs(value) : null} // Pass the current value
                        onChange={handleDateChange} // Handle date change
                        disabled={disabled}
                        minDate={minDate || undefined} // Use minDate prop directly
                        readOnly={readOnly}
                        maxDate={maxDate || undefined}
                    />
                </CustomDatePickerWrapper>
            </LocalizationProvider>
            {error && (
                <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
});

DatePickerField.displayName = 'DatePickerField';

export default DatePickerField;


