import { Button, Typography } from '@mui/material';
import React from 'react';
import { ClipLoader } from 'react-spinners';

type Props = {
  text: string;
  buttonBackgroundColor?: string;
  buttonFontColor?: string;
  disabled?: boolean;
  type: 'button' | 'submit' | 'reset';
  styles?: object;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  fontSize?: number;
  fontWeight?: number;
  loading?: boolean;
  borderColor?:string;
  icon?: React.ReactNode;
};

const ButtonInput = (props: Props) => {
  return (
    <Button
      sx={{
        backgroundColor: `${props.buttonBackgroundColor ? props.buttonBackgroundColor : 'rgba(31, 100, 255, 1)'}`,
        color: `${props.buttonFontColor ? props.buttonFontColor : '#fff'}`,
        width: '100%',
        border: props.borderColor ? `2px solid ${props.borderColor}` : 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer!important',
        '@media(max-width:768px)': {
          padding: '5 10px',

        },
        ':hover': {
          backgroundColor: 'rgba(31, 100, 255, 1)',
        },
        textTransform: 'unset',
        ...props.styles,
      }}
      type={props.type}
      disabled={props.disabled}
      onClick={props?.onClick}
      startIcon={props.icon}

    >
      {!props?.loading ? (
        <Typography variant="text8" fontWeight={props?.fontWeight ? props?.fontWeight : 700} fontSize={props?.fontSize}>
          {props.text}
        </Typography>
      ) : (
        <ClipLoader
          color={'#ff'}
          loading={props?.loading}
          // cssOverride={override}
          size={25}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </Button>
  );
};

export default ButtonInput;
