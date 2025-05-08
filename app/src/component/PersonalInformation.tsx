import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MemberContext } from './context/MemberContext';
import { fetchMemberData } from '../actions/addMembers';
import { useTheme } from '../../theme/themeProvider';

const PersonalInformation = () => {
  const {
    viewMembersForm,
    setViewmembersForm,
    MemberActionType,
    setMemberActionType,
    contextUserId,
    setContextUserId,
  } = useContext(MemberContext);

  const [userData, setUserData] = useState<any>(null);
  const theme = useTheme();

  useEffect(() => {
    console.log('Current User ID in personal:', contextUserId);
    if (contextUserId) {
      const fetchData = async () => {
        try {
          const response = await fetchMemberData(contextUserId);
          setUserData(response);
          console.log('Data in personal:', response);
          if (response.status === 203) {
            console.log('User not found');
          }
        } catch (error) {
          console.error('Error fetching member data:', error);
        }
      };

      fetchData();
    }
  }, [contextUserId]);

  console.log('userData', userData);

  // Destructure user data with default values
  const {
    firstName = '',
    lastName = '',
    phoneNumber = '',
    isAdmin = false,
    designationName = '',
  } = userData || {};

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.rowContainer}>
        {/* First Column */}
        <View style={styles.column}>
          <Text style={[styles.label, { color: theme.colors.mainText }]}>First Name</Text>
          <Text style={[styles.value, { color: theme.colors.mainText }]}>{firstName}</Text>

          <Text style={[styles.label, styles.marginTop,{ color: theme.colors.mainText }]}>Mobile Number</Text>
          <Text style={[styles.value, { color: theme.colors.mainText }]}>{phoneNumber}</Text>

          <Text style={[styles.label, styles.marginTop,{ color: theme.colors.mainText }]}>Designation</Text>
          <Text style={[styles.value, { color: theme.colors.mainText }]}>{designationName}</Text>
        </View>

        {/* Second Column */}
        <View style={styles.column}>
          <Text style={[styles.label, { color: theme.colors.mainText }]}>Last Name</Text>
          <Text style={[styles.value, { color: theme.colors.mainText }]}>{lastName}</Text>

          <Text style={[styles.label, styles.marginTop,{ color: theme.colors.mainText }]}>Gender</Text>
          <Text style={[styles.value, { color: theme.colors.mainText }]}>{userData?.gender || 'N/A'}</Text>

          <Text style={[styles.label, styles.marginTop,{ color: theme.colors.mainText }]}>Admin Access</Text>
          <Text style={[styles.value, { color: theme.colors.mainText }]}>{isAdmin ? 'Yes' : 'No'}</Text>
        </View>
      </View>
    </View>
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
     justifyContent:'space-between'
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent:'center',
    // gap: 16,
    // marginRight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  marginTop: {
    marginTop: 16,
  },
});
