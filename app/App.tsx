
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAuthenticated } from './src/utils/auth';
import { AppProviders } from './src/navigation/Providers';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { UnauthNavigator } from './src/navigation/UnauthNavigator';
import ThemeToggle from './src/component/UI/ThemeToggle/ThemeToggle';
import Toast from "react-native-toast-message";
import { RootNavigator } from './src/navigation/RootNavigator';
import { toastConfig } from './src/utils/toastService';


const App = () => {
  return (
    <AppProviders>
        <RootNavigator/>
        <Toast config={toastConfig}/>
    </AppProviders>
  );
};

const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};


export default App;
