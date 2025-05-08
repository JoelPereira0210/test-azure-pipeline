import { Box, TextareaAutosize, Typography } from '@mui/material';
import React, { forwardRef } from 'react';
import { styled } from '@mui/material/styles';

type Props = {
  label: string;
  type: string;
  required?: boolean;
  error?: string;
} & React.ComponentPropsWithoutRef<'textarea'>;

const CustomTextarea = styled(TextareaAutosize)(({ theme }) => ({
  borderRadius: '8px',
  borderBottom: 'none',
  border: '1px solid rgba(70,95,241,0.40)',
  background: theme.palette.mode === 'light' ? 'inherit' : 'inherit',
  boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)',
  marginTop: '8px',
  padding: '10px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  '&:hover::before': {
    borderBottom: 'none',
  },
  '&::before': {
    borderBottom: 'none',
  },
  '&::after': {
    borderBottom: 'none',
  },
  '&:hover:not(.Mui-disabled):not(.Mui-error)::before': {
    borderBottom: 'none',
  },
}));

const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { label, required, error, placeholder, ...inputProps } = props;

  return (
    <>
      <Box
        className={`flex flex-col`}
        sx={{
          marginBottom: '27px',
          '@media (max-width: 640px)': {
            marginBottom: '10px',
          }
        }}
      >
        <label>
          <Typography variant="text8" fontWeight={600}>
            {label} {required && <span style={{ color: 'red' }}>*</span>}
          </Typography>
        </label>
        <CustomTextarea
          maxRows={6}
          minRows={6}
          aria-label="maximum height"
          placeholder={`Enter ${label}`}
          ref={ref}
          {...inputProps}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
            {label} {error}
          </Typography>
        )}
      </Box>
    </>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
