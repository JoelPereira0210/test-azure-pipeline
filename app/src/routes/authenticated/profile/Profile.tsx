import React, { useState, useEffect } from 'react';
import { View,  StyleSheet, Text } from 'react-native';
import ProfileForm from '../../../forms/ProfileForm';
import { useTheme } from '../../../../theme/themeProvider';


const Profile= () => {

const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
    <ProfileForm/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
  },
 
});

export default Profile;
