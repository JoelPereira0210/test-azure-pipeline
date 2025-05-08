import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from '../routes/unauthenticated/signup/Signup';
import SocietyRegister from '../routes/unauthenticated/SocietyRegister';
import Welcome from '../routes/unauthenticated/getstarted/GetStarted';
import Subscriptions from '../routes/unauthenticated/subscriptions/Subscriptions';
import CartCheckoutPage from '../routes/authenticated/cartcheckout/CartCheckout';
import { View } from 'react-native';
import ThemeToggle from '../component/UI/ThemeToggle/ThemeToggle';

const Stack = createStackNavigator();

export const UnauthNavigator = () => {
  return (
    // <View style={{ flex: 1 }}>
    // {/* Show the ThemeToggle only for unauthenticated users */}
    // <ThemeToggle />
    <Stack.Navigator initialRouteName="Signup">
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="SocietyRegister" component={SocietyRegister} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
      <Stack.Screen name="Subscriptions" component={Subscriptions} options={{ headerShown: false }} />
      <Stack.Screen name="CartCheckoutPage" component={CartCheckoutPage} options={{ headerShown: false }} />
    </Stack.Navigator>
    // </View>
  );
};
