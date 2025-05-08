
  import React, { useContext, useEffect, useState } from 'react';
  import { View, StyleSheet, ActivityIndicator } from 'react-native';
  import { useNavigation, useRoute } from '@react-navigation/native';
  import MemberListDisplay from '../../../component/MemberListDispay';
  import ViewMemberDetails from '../../../component/ViewMemberDetails';
  import { MemberContext } from '../../../component/context/MemberContext';
  import { fetchLoggedInUserdata,setRoleAction } from '../../../actions/auth';
  import { encryptValue } from '../../../utils/encryptiondecryption';
  import { setSocietyIdInLocalStorage } from '../../../utils/auth';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useTheme } from '../../../../theme/themeProvider';
import Footer from '../../../component/UI/Footer/foter';

  const Members = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const searchParams = route.params || {};
  const {theme} = useTheme();
  const [roleSet, setRoleSet] = useState(false);



    useEffect(() => {
      const checkAndSetRole = async () => {
        const role = await AsyncStorage.getItem('flow');
        const socioId = await AsyncStorage.getItem('societyId');
        console.log("socioId in members", socioId);
        console.log("role in members", role);
        if (!role) {
          await setRoleAction();
          setRoleSet(true);
        }
        else
        {
          setRoleSet(true);
        }
      };
      checkAndSetRole();
    }, []);
    
    const {
      viewMembersForm,
    } = useContext(MemberContext);

    if (!roleSet) {
      return (
        <View style={[styles.loaderContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.main} />
        </View>
      );
    }
  
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {viewMembersForm ? <ViewMemberDetails /> : <MemberListDisplay />}
      <Footer/>
      </View>
    );
  };

  const styles = StyleSheet.create({
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 10,
    },
  });

  export default Members;
