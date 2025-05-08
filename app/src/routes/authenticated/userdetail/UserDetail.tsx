import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../theme/themeProvider';
import { useNavigation } from '@react-navigation/native';
import UserDetailsProfile from '../../../forms/UserDetailsProfile';

const UserDetails = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.innerContainer}>
        <UserDetailsProfile 
           //@ts-ignore
          backHandler={() => navigation.navigate('Profile',{screen:'ProfileMain'})}
        />
      </View>
    </View>
  );
};

export default UserDetails;

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
