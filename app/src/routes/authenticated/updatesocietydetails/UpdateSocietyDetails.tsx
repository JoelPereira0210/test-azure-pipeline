import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { useTheme } from '../../../../theme/themeProvider';
import UpdateSocietyDetails from '../../../forms/UpdateSocietyDetails'; 
// Adjust the import path for your RN version of UpdateSocietyDetails

const UpdateSocietyDetailsForm = () => {
  const { theme } = useTheme();

  return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.innerContainer}></View>
        <UpdateSocietyDetails />
      </View>
      
  );
};

export default UpdateSocietyDetailsForm;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    marginVertical: 20,
  },
});
