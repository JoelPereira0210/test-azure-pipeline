import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Text,  } from 'react-native-paper';
import ButtonInput from '../../../component/UI/Button/Button';
import { useTheme } from '../../../../theme/themeProvider';

const Welcome = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [loading, setLoading] = useState(false);
  const [sessionPhoneNumber, setSessionPhoneNumber] = useState<string | null>(null);

//   useEffect(() => {
//     const checkSession = async () => {
//       const phoneNumber = await AsyncStorage.getItem('phoneNumber');
//       setSessionPhoneNumber(phoneNumber);
//       if (!phoneNumber) {
//         navigation.navigate('Signup'); // ✅ Navigate if no session
//       }
//     };

//     checkSession();
//   }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.innerContainer}>
        <View style={styles.content}>
        
          <Text style={[styles.title,theme.typography.text1,{color:theme.colors.mainText}]}>
            Society created successfully!
          </Text>
          <Text style={[styles.subtitle,theme.typography.text7,{color:theme.colors.mainText}]}>
            Welcome aboard! Start your success journey.
          </Text>
          <Image
            source={require('../../../images/welcomeIcon.png')} 
            style={styles.image}
          />
        </View>

        <ButtonInput
          type="button"
          text="Let's Start!"
          styles={{ maxWidth: 210 }}
          disabled={false}
          loading={loading}
          onPress={() => {
            setLoading(true);
            //@ts-ignore
            navigation.navigate('Subscriptions'); // ✅ Navigate to subscriptions
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    maxWidth: 970,
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
    textAlign: 'center',
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  title: {
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 10,
    fontSize: 24,
    textAlign: 'center',
  },
});

export default Welcome;
