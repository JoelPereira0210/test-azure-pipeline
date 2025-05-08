import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decryptValue } from '../../../utils/encryptiondecryption';
import { getSocietyAction } from '../../../actions/society';
import { useNavigation } from '@react-navigation/native';
import { MoreDetailsContext } from '../../context/MoreDetails';

// Function to truncate text based on screen size.
const truncateTextWithTwoLines = (text:any, isMobile:any) => {
  if (!text) return 'N/A';
  const words = text.split(' ');
  return isMobile
    ? words.length > 2
      ? words.slice(0, 3).join(' ') + '...'
      : text
    : words.length > 3
    ? words.slice(0, 3).join(' ') + '...'
    : text;
};

interface SocietyData {
  societyName?: string;
  address?: string;
  description?: string;
}

const Footer = () => {
  const [societyData, setSocietyData] = useState<SocietyData | null>(null);
  const { toggleDetails } = useContext(MoreDetailsContext);
  const navigation = useNavigation();

  // Determine mobile view based on screen width.
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth <= 600;

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const encryptedId = await AsyncStorage.getItem('societyId');
     
        const societyID = await decryptValue(encryptedId);
        if (societyID) {
          const values = await getSocietyAction();
          setSocietyData(values.data.society);
          console.log('Fetched society data:', values);
        }
      } catch (error) {
        console.error('Error fetching society details:', error);
      }
    };
    fetchSociety();
  }, []);

  const handleMoreDetailsClick = () => {
    //@ts-ignore
    navigation.navigate("AuthNavigator",{screen:"Profile"}); // Ensure that "Profile" is defined in your navigator
    toggleDetails();
  };

  return (
    <View style={styles.footer}>
      <View style={styles.section}>
        <Text style={[styles.text, { fontSize: isMobile ? 11 : 16 }]}>
          {truncateTextWithTwoLines(societyData?.societyName, isMobile)}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.section}>
        <Text style={[styles.text, { fontSize: isMobile ? 11 : 16 }]}>
          {truncateTextWithTwoLines(societyData?.address, isMobile)}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.descriptionContainer}>
        {!isMobile && (
          <Text style={[styles.text, { fontSize: isMobile ? 11 : 16, flex: 1 }]}>
            {truncateTextWithTwoLines(societyData?.description, isMobile)}
          </Text>
        )}
        <TouchableOpacity onPress={handleMoreDetailsClick} style={styles.moreDetailsContainer}>
          <Text style={[styles.moreDetailsText, { fontSize: isMobile ? 11 : 16 }]}>
            More Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#465FF1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 10,
  },
  section: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 2,
    height: '60%',
    backgroundColor: '#000',
    marginHorizontal: 8,
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '300',
    textAlign: 'center',
  },
  moreDetailsContainer: {
    position: 'absolute',
    right: 0,
  },
  moreDetailsText: {
    color: '#FFFFFF',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default Footer;
