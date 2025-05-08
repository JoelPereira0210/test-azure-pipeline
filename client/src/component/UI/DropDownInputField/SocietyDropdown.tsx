
import React, { useState, useEffect, forwardRef } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import Select from 'react-dropdown-select';
import { Info } from '@mui/icons-material';
import { lightColors } from '@/src/theme/colors';



type Props = {
  label: string;
  required?: boolean;
  errorMessage?: string | undefined;
  classes?: string;
  infoText?: string | string[];
  disabled?: boolean;
  options: Array<any>;
  values: Array<any>;

  setSelectedSociety: (values: any) => void;
  setValue: (name: string, value: any) => void;
  placeholder?: string;
  readOnly: boolean;
  mode: string;


};

const SocietyDropDownField = forwardRef<any, Props>((props, ref) => {
  const {
    label,
    required,
    classes,
    errorMessage,
    disabled,
    options,
    values,
    setSelectedSociety,
    setValue,
   
    infoText,
    placeholder,
    readOnly,
    mode,
    ...inputProps
  } = props;

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


  const handleSocietyChange = (selectedValues) => {

      const selectedSociety = selectedValues[0]?.feeType || '';
      setSelectedSociety(selectedValues);
      setValue('feeType', selectedSociety);
      console.log("selectedFeeType",selectedSociety);
      console.log("selectedValues",selectedValues);
    
  
  };

  
const inputStyles = mode === 'dark'
? {
    backgroundColor: 'transparent', // Dark background
    color: '#1F64FF', // Light text for contrast
    border: '1px solid rgba(70,95,241,0.40)', // Muted white border

  // Minimal shadow for dark mode

  }
: {
    backgroundColor: 'transparent', // Light background for light mode
    color: 'blue', // Dark text
    border: '1px solid rgba(70,95,241,0.40)', // Blueish border for light mode
  

  };

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
          {label} {required && <span style={{ color: 'red' }}>*</span>}{' '}
          {infoText && (
            <Tooltip title={renderInfoText()} arrow placement="top">
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
      </label>
      <Select
        options={options}
        labelField="feeType"
        valueField="id"
        searchBy="feeType"
        multi={false} // Ensure multi-select is disabled if you expect a single value
        searchable={true}
        create={false}
        clearable={false}
        values={values || []} // Ensure values is an array
        onChange={handleSocietyChange}
        // onCreateNew={(newOption) => onCreateNew(newOption)}
        placeholder={placeholder || `Select or add ${label}`}
        disabled={disabled}
        style={{
       
          padding: '10px',
          borderRadius: '8px', // Rounded corners
          border: '1px solid rgba(70,95,241,0.40)',
          fontSize: '1rem', // Font size similar to image
          boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)', // Outline on focus
          fontFamily:'Montserrat',
          fontWeight:300,
          height:'54px',
          opacity: disabled ? 1 : 1,
          ...inputStyles,
        }}
      />

      {errorMessage && (
        <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
});



export default SocietyDropDownField;
