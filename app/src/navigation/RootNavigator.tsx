import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { UnauthNavigator } from './UnauthNavigator';
import { isAuthenticated } from '../utils/auth';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = await isAuthenticated();
      console.log("Auth Status for here:", authStatus);

      if (authStatus === 'superAdmin' || authStatus === 'societyUser') {
        setInitialRoute('AuthNavigator');
      } else {
        setInitialRoute('UnauthNavigator');
      }
    };

    checkAuthStatus();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    ); // Show loader until we determine the route
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}  screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        <Stack.Screen name="UnauthNavigator" component={UnauthNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
