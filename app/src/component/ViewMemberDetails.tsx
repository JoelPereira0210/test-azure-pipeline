// ViewMemberDetails.tsx
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ButtonInput from './UI/Button/Button';
import MemberTab from './Tabs/MemberTab';
import { useNavigation } from '@react-navigation/native';
import { MemberContext } from './context/MemberContext';
import PersonalInformation from './PersonalInformation';
import RegisteredEvent from './RegisteredEvent';
import MaintenanceFees from './MaintenanceFees';
import { fetchMemberData } from '../actions/addMembers';
import RNRestart from 'react-native-restart';
import PersonaleInformatioEditForm from '../forms/PersonaleInformatioEditForm';
import { useTheme } from '../../theme/themeProvider';

const ViewMemberDetails = () => {
  // If you need navigation, use useNavigation
  const navigation = useNavigation();
  const {
    viewMembersForm,
    setViewmembersForm,
    contextUserId,
    setStep,
    step, // current step from context
  } = useContext(MemberContext);
  const [userData, setUserData] = useState<any>(null);
  const [superAdmin, setSuperAdmin] = useState(false);
  const {theme} = useTheme();

  useEffect(() => {
    if (contextUserId) {
      const fetchData = async () => {
        try {
          const response = await fetchMemberData(contextUserId);
          setUserData(response);
          if (response.designationName === 'societySuperAdmin') {
            console.log("society super");
            setSuperAdmin(true);
          }
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

  return (
    <View style={styles.container}>
      {/* Back arrow */}
      <MaterialIcons
        name="arrow-back"
        size={28}
        onPress={() => {
          if (step === 4) {
            setStep(1); // if editing (step 4) go back to step 1
          } else {

            RNRestart.restart();
          }
        }}
        style={styles.backIcon}
      />

      <View style={styles.content}>
        {step !== 4 && (
          <View style={styles.profileHeader}>
            <Image
              source={require('../images/sidebarlogo.png')} // adjust the path as needed
              style={styles.profileImage}
            />
            <View style={styles.nameContainer}>
              <Text style={[styles.userName, { color: theme.colors.mainText }]}>
                {userData?.firstName} {userData?.lastName}
              </Text>
            </View>
            {userData?.membershipStatusId === "1" && !superAdmin && (
              <ButtonInput
                text="Manage Role"
                disabled={false}
                type="button"
                loading={false}
                icon={<MaterialIcons name="edit" size={16} color={'white'} />}
          
                width={170}
                onPress={() => setStep(4)} // Update step to 4
              />
            )}
          </View>
        )}

        <View>
          <MemberTab />
          <View style={styles.formContainer}>
            {/* {step === 4 ? (
              <PersonaleInformatioEditForm />
            ) : step === 1 ? (
              <PersonalInformation />
            ) : step === 2 ? (
              <RegisteredEvent />
            ) : step === 3 ? (
              <MaintenanceFees />
            ) : null} */}
             {step === 4 ? <PersonaleInformatioEditForm /> : step === 1 && <PersonalInformation />}
            {step === 2 && <RegisteredEvent />}
            {step === 3 && <MaintenanceFees />}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height:'75%',
    padding: 16,
    marginBottom: 50,
  },
  backIcon: {
    marginBottom: 16,
  },
  content: {
    // flex: 1,
  },
  profileHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#9C9AA533',
    borderRadius: 8,
    // flexWrap: 'wrap',
  },
  profileImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 50,
    // marginRight: 16,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 24,
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 16,
  },
});

export default ViewMemberDetails;
