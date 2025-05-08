import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SocietyRegistrationForm from '../../forms/SocietyRegistrationForm';// Adjust the import based on your folder structure
import { Text } from 'react-native-paper';
import { useTheme } from '../../../theme/themeProvider';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SocietyRegister = () => {
  const [step, setStep] = useState(1);
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();

  const { phoneNumber } = route.params || {};
  const [sessionPhoneNumber, setSessionPhoneNumber] = useState<string | null>(null);

  // useEffect(() => {
  //   const checkSession = async () => {
  //     // const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
  //     // console.log('sessionPhoneNumber:', storedPhoneNumber);
  //     console.log('Phone Number:', phoneNumber);
  //     setSessionPhoneNumber(phoneNumber);

  //     if (!sessionPhoneNumber) {
  //       console.log('No phone number found, redirecting to Signup');
  //       navigation.navigate('Signup'); // Redirect to the Signup screen
  //     }
  //   };

  //   checkSession();
  // }, []);


  useEffect(() => {
    if (!phoneNumber) {
      console.log('No phone number found, redirecting to Signup');
      //@ts-ignore
      navigation.navigate('Signup'); // Redirect to the Signup screen if phoneNumber is missing
    } else {
      console.log('Phone Number received in SocietyRegister:', phoneNumber);
    }
  }, [phoneNumber]);

  return (
    

           
      // <View style={styles.formContainer}>
        
        <ImageBackground
            source={require('../../images/backgroundImage.png')}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
        <SocietyRegistrationForm phoneNumber={phoneNumber}/>
        
      </ImageBackground>
      // </View>


  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, 
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 970,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background
    borderRadius: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SocietyRegister;
