import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/themeProvider';

type ChargesTabProps = {
  step: number;
  setStep: (step: number) => void;
};

const ChargesTab: React.FC<ChargesTabProps> = ({ step, setStep }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    // Retrieve the user role from AsyncStorage
    AsyncStorage.getItem('flow').then((role) => {
      setIsAdmin(role === 'admin');
    });
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tabsContainer,
          {
            justifyContent: screenWidth < 768 ? 'center' : 'space-between',
          },
        ]}
      >
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, step === 1 && styles.tabActive]}
            onPress={() => setStep(1)}
          >
            <Text style={[styles.tabText, { color: theme.colors.mainText }]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, step === 2 && styles.tabActive]}
            onPress={() => setStep(2)}
          >
            <Text style={[styles.tabText, { color: theme.colors.mainText }]}>
              Paid
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChargesTab;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F64FF', // You can also use theme.colors.primary here if preferred.
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
