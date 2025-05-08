import React from 'react';
import { Input, useTheme, InputProps as MUIInputProps } from '@mui/material';

// type OTPInputProps = React.ComponentPropsWithoutRef<'input'>;

const OTPInput = React.forwardRef<HTMLInputElement, MUIInputProps>(
  (props, ref) => {
    console.log("PROSP", props)
    const theme = useTheme();
    const mode = theme.palette.mode;
    return (
      <Input
        {...props}
        type='number'
        inputRef={ref} // Pass the ref to inputRef for proper focus handling
        sx={{
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'normal',
          textAlign: 'center!important',
          borderBottom: '1px solid #f5f5f5',
          maxWidth: '48px!important',
          width: '100%!important',
          paddingLeft: '15px',
        }}
        style={{
          // color: '#000',
          color: `${mode === 'light'
            ? 'var(--tw-text-light-mainText)'
            : 'var(--tw-text-dark-mainText)'
            }`,
        }}
        // inputMode={props.inputMode}
        // onPaste={props.onPaste}
        // onBlur={props.onBlur}
        // onChange={props.onChange}
        // onKeyDown={props.onKeyDown}
        // onFocus={props.onFocus}
        // onInput={props.onInput}
        className="text-center"
      />
    );
  }
);

OTPInput.displayName = 'OTPInput';

export default OTPInput;
