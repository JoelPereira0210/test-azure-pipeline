import React, { forwardRef } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput, { Country } from 'react-phone-number-input';
import { useController } from 'react-hook-form';
import { Box, Typography } from '@mui/material';

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  classes?: string;
  infoText?: string | string[]; // Accept string array for multiple points
  disabled?: boolean;
  country: Country;style?: React.CSSProperties;
  placeholder: string;
} & React.ComponentPropsWithoutRef<'input'> & {
  name: string; // Add name to Props
  control?: any; // Add control to Props
};

const MobileInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    label,
    required,
    classes,
    error,style,
    placeholder,
    country,
    disabled,
    infoText,
    name,
    control,
    ...inputProps
  } = props;

  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });

  return (
    <Box
      className={`flex flex-col ${classes}`}
      sx={{
        marginBottom: '27px',
        width: '100%',
        '@media (max-width: 640px)': {
          marginBottom: '10px',
        },
       
      }}
    >
      <label>
        <Typography variant="text8" fontWeight={600}>
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      </label>
      <PhoneInput
        defaultCountry={country}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        {...inputProps}
        style={{
          borderRadius: '8px',
          borderBottom: 'none',
          border: '1px solid rgba(70,95,241,0.40)',
          height: '54px',
          // background: 'black',
          boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)',
          marginTop: '8px',
          // width: '358px',
          padding: '10px',
          '@media(max-width:414px)': {
            width: '100%',
          },
          ...style,
        }}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
});
MobileInput.displayName = 'MobileInput';
export default MobileInput;
