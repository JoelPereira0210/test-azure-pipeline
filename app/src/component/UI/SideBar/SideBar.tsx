import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Switch } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../../theme/themeProvider';
import { getSocietyAction } from '../../../actions/society';

const SideBar = (props: any) => {
  const { mode, toggleTheme, theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(mode === 'dark');
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [hasLoadedLogo, setHasLoadedLogo] = useState(false);

  useEffect(() => {
    const fetchSocietyLogo = async () => {
      // if (hasLoadedLogo) return; // Skip if already loaded
      
      try {
        const response = await getSocietyAction();
        // console.log("getSocietyAction response:", response);
        if (response?.data?.societyLogo) {
          setLogoBase64(`data:image/png;base64,${response.data.societyLogo}`);
          // setHasLoadedLogo(true); // Mark as loaded
        }
      } catch (error) {
        console.log("Error fetching society logo:", error);
      }
    };

    fetchSocietyLogo();
  }, []);
  // }, [hasLoadedLogo]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.sidebar }]}>
      {/* Logo & App Name */}
    <View style={styles.logoContainer}>
        {logoBase64 ? (
          <Image source={{ uri: logoBase64 }} style={styles.logo} />
        ) : (
          <Image source={require('../../../images/sidebarlogo.png')} style={styles.logo} />
        )}
      </View>

      {/* Menu Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Upgrade Plan */}
      <TouchableOpacity 
        style={styles.upgradeButton}
        onPress={() => props.navigation.navigate('UnauthNavigator', {
          screen: 'Subscriptions'
        })}
      >
        <Text style={styles.upgradeText}>Upgrade your plan</Text>
      </TouchableOpacity>

      {/* Dark Mode Toggle */}
      <View style={styles.themeToggleContainer}>
        <Icon name="weather-sunny" size={20} color={isDarkMode ? "#888" : theme.colors.mainText} />
        <Switch
          value={isDarkMode}
          onValueChange={() => {
        setIsDarkMode(!isDarkMode);
        toggleTheme();
          }}
          trackColor={{ false: '#D0D0D0', true: '#90CAF9' }}
          thumbColor={isDarkMode ? '#2196F3' : '#f4f3f4'}
        />
        <Icon name="weather-night" size={20} color={isDarkMode ? theme.colors.mainText : "#888"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: '10%',
    marginBottom: '1%'
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  upgradeButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  upgradeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20
  },
});

export default SideBar;
