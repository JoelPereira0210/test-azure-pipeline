// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
// import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
// import { Button } from 'react-native-paper';
// import { useTheme } from '../../theme/themeProvider';

// const SignIn = () => {
//   const [steps, setSteps] = useState(1);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [index, setIndex] = useState(0); // 0 for SignUp, 1 for SignIn
//   const [routes] = useState([
//     { key: 'signup', title: 'Sign Up' },
//     { key: 'signin', title: 'Sign In' },
//   ]);

//   // Use the useTheme hook to get the current theme and toggle function
//   const { theme, toggleTheme, mode } = useTheme();

//   const renderSignUp = () => (
//     <View style={[styles.scene, { backgroundColor: theme.colors.background }]}>
//       {steps === 1 ? (
//         <>
//           <Text style={[styles.title, { color: theme.colors.text }, theme.typography.text1]}>Sign Up</Text>
//           <Text style={[styles.subtitle, { color: theme.colors.text }, theme.typography.text2]}>
//             Enter Your Mobile Number To Register
//           </Text>
//           <TextInput
//             placeholder="Enter Mobile Number"
//             style={[styles.input, { borderColor: theme.colors.primary }]}
//             placeholderTextColor={theme.colors.placeholder}
//             onChangeText={(text) => setPhoneNumber(text)}
//             value={phoneNumber}
//             keyboardType="phone-pad"
//           />
//           <Button
//             mode="contained"
//             onPress={() => setSteps(2)}
//             style={[
//               styles.button,
//               { backgroundColor: theme.colors.blue || '#007BFF' }, // Change button background color dynamically
//             ]}
//           >
//             Create Account
//           </Button>
//         </>
//       ) : (
//         <>
//           <Text style={[styles.title, { color: theme.colors.text }, theme.typography.text1]}>OTP Verification</Text>
//           <Text style={[styles.subtitle, { color: theme.colors.text }, theme.typography.text2]}>
//             Enter the OTP sent to {phoneNumber}
//           </Text>
//           <TextInput
//             placeholder="Enter OTP"
//             style={[styles.input, { borderColor: theme.colors.primary }]}
//             placeholderTextColor={theme.colors.placeholder}
//             keyboardType="numeric"
//           />
//           <Button mode="contained" onPress={() => console.log('OTP Verified')} style={styles.button}>
//             Verify
//           </Button>
//         </>
//       )}
//     </View>
//   );

//   const renderSignIn = () => (
//     <View style={[styles.scene, { backgroundColor: theme.colors.background }]}>
//       <Text style={[styles.title, { color: theme.colors.text }, theme.typography.text1]}>Sign In</Text>
//       <TextInput
//         placeholder="Email"
//         style={[styles.input, { borderColor: theme.colors.primary }]}
//         placeholderTextColor={theme.colors.placeholder}
//         keyboardType="email-address"
//       />
//       <TextInput
//         placeholder="Password"
//         style={[styles.input, { borderColor: theme.colors.primary }]}
//         placeholderTextColor={theme.colors.placeholder}
//         secureTextEntry
//       />
//       <Button
//         mode="contained"
//         onPress={() => console.log('Sign In')}
//         style={[styles.button, { backgroundColor: theme.colors.blue || '#007BFF' }]} // Apply blue background
//       >
//         Sign In
//       </Button>
//     </View>
//   );

//   const renderScene = SceneMap({
//     signup: renderSignUp,
//     signin: renderSignIn,
//   });

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       <TabView
//         navigationState={{ index, routes }}
//         renderScene={renderScene}
//         onIndexChange={setIndex}
//         initialLayout={{ width: Dimensions.get('window').width }}
//         renderTabBar={(props) => (
//           <TabBar
//             {...props}
//             indicatorStyle={{
//               backgroundColor:
//                 mode === 'light' ? theme.colors.primary : theme.colors.accent, // Change indicator based on mode
//               height: 3,
//             }}
//             style={{
//               backgroundColor:
//                 mode === 'light' ? theme.colors.surface : theme.colors.background, // TabBar background
//             }}
//             tabStyle={{
//            
//               color:mode === 'light' ? theme.colors.text : theme.colors.secondary, // Label text color
//               fontSize: 14,
//               fontWeight: 'bold',
//             }}
//             activeColor={theme.colors.primary} // Active tab text color
//             inactiveColor={
//               mode === 'light' ? theme.colors.placeholder : theme.colors.secondary // Inactive tab color changes dynamically
//             }
//           />
//         )}
//       />
// {/*       <Button
//         mode="contained"
//         onPress={toggleTheme}
//         style={[
//           styles.themeToggleButton,
//           { backgroundColor: theme.colors.blue || '#007BFF' }, // Dynamically set to blue
//         ]}
//       >
//         Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode
//       </Button> */}
//       <View style={styles.footer}>
//         <Text style={[{ color: theme.colors.text, textAlign: 'center' }, theme.typography.text3]}>
//           By signing up to create an account I accept Company’s{' '}
//           <Text style={[{ color: theme.colors.primary }, theme.typography.text3]}>
//             Terms of use & Privacy Policy.
//           </Text>
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'space-between',
//     padding: 20,
//   },
//   scene: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   title: {
//     marginBottom: 8,
//   },
//   subtitle: {
//     marginBottom: 20,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//   },
//   button: {
//     marginTop: 10,
//   },
//   themeToggleButton: {
//     marginBottom: 20,
//     alignSelf: 'center',
//   },
//   footer: {
//     padding: 16,
//     textAlign: 'center',
//   },
// });

// export default SignIn;