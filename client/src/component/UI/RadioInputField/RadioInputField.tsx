import React from 'react';
import { RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, Typography, Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { lightColors } from '@/src/theme/colors';

type RadioButtonFieldProps = {
  label: string;
  options: { label: string; value: any }[];
  error?: string;
  infoText?: string | string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: any;
};
const RadioButtonField: React.FC<RadioButtonFieldProps> = ({
  label,
  options,
  error,
  infoText,
  onChange,
  value,
}) => {
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
    <FormControl component="fieldset" error={!!error} fullWidth>
      <FormLabel component="legend" sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="text8" fontWeight={600}>
          {label}
        </Typography>
        {infoText && (
          <Tooltip title={renderInfoText()} arrow>
            <Info
              sx={{
                cursor: 'pointer',
                marginLeft: '8px',
                verticalAlign: 'middle',
                // color: lightColors.main,
              }}
            />
          </Tooltip>
        )}
      </FormLabel>
      <RadioGroup
        row
        value={value}
        onChange={onChange}
      // onChange={(event) => {
      //   const newValue = event.target.value === 'true'; // Convert to boolean
      //   onChange({ target: { name: event.target.name, value: newValue } });
      // }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={
              <Typography variant="body2" fontWeight="normal">
                {option.label}
              </Typography>
            }
          />
        ))}
      </RadioGroup>
      {error && (
        <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
          {error}
        </Typography>
      )}
    </FormControl>
  );
};

export default RadioButtonField;
