/**
 * @format
 */

import {AppRegistry,LogBox } from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// LogBox.ignoreLogs([
//     'Encryption Error:',   // Ignores specific crypto error
//     // 'Warning: ...',       // Add other warnings you want to hide
//   ]);

AppRegistry.registerComponent(appName, () => App);
