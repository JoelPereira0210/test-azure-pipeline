import React, { forwardRef } from 'react';
import { Box, FormControlLabel, Checkbox, Typography } from '@mui/material';
import CircleUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import { CheckCircle } from '@mui/icons-material';

type Props = {
    label: string;
    required?: boolean;
    error?: string | undefined;
    classes?: string;
    size?: 'small' | 'medium' | 'large'; // Ensure size matches MUI options
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'; // Only allow valid colors
    checked?: boolean;
    disabled?: boolean; // Add disabled prop
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'color'>;

const CheckboxInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, required, classes, error, color = 'default', size = 'medium',disabled = false, checked, ...inputProps } = props;

    return (
        <Box className={`flex flex-col normalCheckbox ${classes}`}>
            <FormControlLabel
                control={
                    <Checkbox
                        icon={<CircleUnchecked />}
                        checkedIcon={<CheckCircle />}
                        // {...inputProps}
                        inputRef={ref}
                        color={color} // Ensure it's one of the valid MUI color props
                        size={size}   // Ensure it's one of the valid MUI size props
                        checked={checked}
                        disabled={disabled} // Pass the disabled prop
                        onChange={(e) => {
                            console.log("checked", e.target.checked);
                            inputProps.onChange?.(e); // Call parent's onChange if provided
                        }}
                    />
                }
                label={<Typography variant="text8" fontWeight={600}>
                    {label}
                </Typography>}
            />
            {error && (
                <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
                    {label} {error}
                </Typography>
            )}
        </Box>
    );
});

CheckboxInput.displayName = 'CheckboxInput';
export default CheckboxInput;
