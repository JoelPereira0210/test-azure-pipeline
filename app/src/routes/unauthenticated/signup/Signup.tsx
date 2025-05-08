// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import { Text, Button } from 'react-native-paper';
// import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
// import SignUpForm from '../../../forms/SignUpForm';
// import OTPInput from '../../../component/UI/OTPInput/OTPInput';
// import SignInForm from '../../../forms/SignInForm';
// import { useNavigation } from '@react-navigation/native';
// import { Linking } from 'react-native';
// import OTPForm from '../../../forms/OTPForm';
// const initialLayout = { width: Dimensions.get('window').width };

// const Login = () => {
//   const [steps, setSteps] = useState(1);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [selectedTab, setSelectedTab] = useState(0); // 0 = SignUp, 1 = SignIn
//   const navigation = useNavigation();

//   useEffect(() => {
//     const checkURLParams = async () => {
//       const url = await Linking.getInitialURL(); // Get initial URL (if deep linking)
//       if (url) {
//         const hasSignIn = url.includes('signin');
//         setSelectedTab(hasSignIn ? 1 : 0);
//       }
//     };
  
//     checkURLParams();
//   }, []);

//   const renderSignUp = () => (
//     <View style={styles.tabContent}>
//       {steps === 1 ? (
//         <>
//           {/* <Text variant="titleMedium" style={styles.heading}>Sign Up</Text>
//           <Text variant="bodyMedium" style={styles.subText}>Enter Your Mobile Number To Register</Text> */}
//           <SignUpForm setSteps={setSteps} setPhoneNumber={setPhoneNumber} />
//         </>
//       ) : (
//         <>
//           <Text variant="titleMedium" style={styles.heading}>OTP Verification</Text>
//           <Text variant="bodyMedium" style={styles.subText}>Enter the OTP sent to {phoneNumber}</Text>
//           <OTPForm phoneNumber={phoneNumber} setSteps={setSteps} />
//         </>
//       )}
//     </View>
//   );

//   const renderSignIn = () => (
//     <View style={styles.tabContent}>
//       <SignInForm />
//     </View>
//   );

//   const renderScene = SceneMap({
//     signup: renderSignUp,
//     signin: renderSignIn,
//   });

//   return (
//     <View style={styles.container}>
//       <TabView
//         navigationState={{ index: selectedTab, routes: [{ key: 'signup', title: 'Sign Up' }, { key: 'signin', title: 'Sign In' }] }}
//         renderScene={renderScene}
//         onIndexChange={setSelectedTab}
//         initialLayout={initialLayout}
//         renderTabBar={props => (
//           <TabBar
//             {...props}
//             style={styles.tabBar}
//             indicatorStyle={{ backgroundColor: 'white' }}
//           />
//         )}
//       />

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   tabBar: {
//     backgroundColor: '#30449E',
//   },
//   tabContent: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 20,
//   },
//   heading: {
//     marginBottom: 10,
//   },
//   subText: {
//     marginBottom: 20,
//   },
//   footer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   footerText: {
//     textAlign: 'center',
//     color: '#9C9AA5',
//   },
//   link: {
//     color: '#26203B',
//     fontWeight: 'bold',
//   },
// });

// export default Login;

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import SignUpForm from '../../../forms/SignUpForm';
import SignInForm from '../../../forms/SignInForm';
import OTPForm from '../../../forms/OTPForm';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { useTheme } from '../../../../theme/themeProvider';

const initialLayout = { width: Dimensions.get('window').width };

const Login = () => {
  const [steps, setSteps] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTab, setSelectedTab] = useState(0); // 0 = SignUp, 1 = SignIn
  const navigation = useNavigation();
  const { theme, mode } = useTheme(); // Access theme and mode from useTheme hook

  useEffect(() => {
    const checkURLParams = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const hasSignIn = url.includes('signin');
        setSelectedTab(hasSignIn ? 1 : 0);
      }
    };
    checkURLParams();
  }, []);

  const renderSignUp = () => (
    <View style={styles.tabContent}>
      {steps === 1 ? (
        <SignUpForm setSteps={setSteps} setPhoneNumber={setPhoneNumber} />
      ) : (
        <>
          <Text style={[styles.heading, { color: theme.colors.text }]}>OTP Verification</Text>
          <Text style={[styles.subText, { color: theme.colors.text }]}>Enter the OTP sent to {phoneNumber}</Text>
          <OTPForm phoneNumber={phoneNumber} setSteps={setSteps} />
        </>
      )}
    </View>
  );

  const renderSignIn = () => (
    <View style={styles.tabContent}>
      <SignInForm />
    </View>
  );

  const renderScene = SceneMap({
    signup: renderSignUp,
    signin: renderSignIn,
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Welcome Header */}
      <View style={[styles.welcomeContainer, { backgroundColor: theme.colors.main }]}>
        <Text style={styles.welcomeText}>Welcome To Society</Text>
        <Text style={styles.subText}>Your Gateway To Effortless Management</Text>
      </View>

      {/* Tab View */}
      <TabView
        navigationState={{ index: selectedTab, routes: [{ key: 'signup', title: 'Sign Up' }, { key: 'signin', title: 'Sign In' }] }}
        renderScene={renderScene}
        onIndexChange={setSelectedTab}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={[styles.tabBar, { backgroundColor: theme.colors.main }]}
            indicatorStyle={{ backgroundColor: 'white' }}
            //@ts-ignore
            labelStyle={{ color: 'white' }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subText: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  tabBar: {
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Login;
