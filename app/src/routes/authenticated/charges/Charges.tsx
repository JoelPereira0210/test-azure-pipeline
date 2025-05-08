import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView, 
  Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../../theme/themeProvider';
import { ChargesContext } from '../../../component/context/ChargesContext';

import ButtonInput from '../../../component/UI/Button/Button';
import ViewChargeForm from '../../../forms/ViewChargeForm';
import ChargeFeeModal from '../../../component/modals/ChargeFeeModal';
import { fetchChargeData, fetchUserChargeData } from '../../../actions/charges';
import ViewPaymentStatus from '../../../forms/ViewPaymentStatus';
import ViewUserCharge from '../../../forms/ViewUserCharge';
import { fetchBankDetails } from '../../../actions/profile';
import AlertModal from '../../../component/UI/Popup/AlertPopUp';
import Footer from '../../../component/UI/Footer/foter';
import { SafeAreaView } from 'react-native-safe-area-context';


const CreateMaintenancePage: React.FC = () => {
  const { 
    createCharge, 
    setCreateCharge, 
    setChargeActionType, 
    setChargeId, 
    chargeActionType, 
    chargeMemberStatus 
  } = useContext(ChargesContext);
  
  const [chargesPresent, setChargesPresent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const { theme } = useTheme();

  // Determine if the user is an admin using AsyncStorage
  useEffect(() => {
    const fetchRole = async () => {
      const role = await AsyncStorage.getItem('flow');
      setIsAdmin(role === 'admin');
    };
    fetchRole();
  }, []);

  // For admin users: Fetch charges for various statuses
  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const response1 = await fetchChargeData('upcoming');
        const response2 = await fetchChargeData('past');
        const response3 = await fetchChargeData('draft');
        const response4 = await fetchChargeData('deleted');
        if (
          (response1 && response1.length > 0) ||
          (response2 && response2.length > 0) ||
          (response3 && response3.length > 0) ||
          (response4 && response4.length > 0)
        ) {
          setChargesPresent(true);
          console.log("charge response 1", response1);
          console.log("charge response 2", response2);
          console.log("charge response 3", response3);
          console.log("charge response 4", response4);
        } else {
          setChargesPresent(false);
        }
      } catch (error) {
        console.error('Error fetching charges:', error);
        setChargesPresent(false);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchCharges();
    }
  }, [createCharge, isAdmin]);

  // For non-admin users: Fetch pending and paid charges
  useEffect(() => {
    const fetchUserCharges = async () => {
      try {
        const response1 = await fetchUserChargeData('pending');
        const response2 = await fetchUserChargeData('paid');
        if (
          (response1 && response1.length > 0) ||
          (response2 && response2.length > 0)
        ) {
          setChargesPresent(true);
        } else {
          setChargesPresent(false);
        }
      } catch (error) {
        console.error('Error fetching user charges:', error);
        setChargesPresent(false);
      } finally {
        setLoading(false);
      }
    };

    if (!isAdmin) {
      fetchUserCharges();
    }
  }, [isAdmin]);

  // Handle create action: Check bank details before allowing charge creation
  const handleCreateAction = async () => {
    try {
      const bankDetails = await fetchBankDetails();
      console.log("bankDetails are", bankDetails);
      setCreateCharge(true);
      if (!bankDetails) {
        setShowAlertModal(true);
        return;
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      setShowAlertModal(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      {isAdmin ? (
        chargeMemberStatus ? (
          // If chargeMemberStatus is true, show the Payment Status view
          <View style={[styles.mainContainer,{backgroundColor:theme.colors.background}]}>
            <View style={[styles.contentBox, styles.marginBottom,{backgroundColor:theme.colors.background}]}>
              <ViewPaymentStatus />
            </View>
          </View>
        ) : createCharge ? (
          // If createCharge is true, show the ChargeFeeModal
          <ChargeFeeModal 
            open={true} 
            onClose={() => { 
              setCreateCharge(false); 
              setChargeActionType(null); 
              setChargeId(null); 
            }} 
          />
        ) : chargesPresent ? (
          // If charges exist, show the ViewChargeForm
          <View style={[styles.mainContainer,{backgroundColor:theme.colors.background}]}>
            <View style={[styles.contentBox,{backgroundColor:theme.colors.background}]}>
              <ViewChargeForm />
            </View>
          </View>
        ) : (
          // If no charges, show a BaseContainer with an "Add Charges/Fees" button
          <View style={[styles.mainContainer,{backgroundColor:theme.colors.background}]}>
            <View style={[styles.emptyContainer,{backgroundColor:theme.colors.background}]}>
            <Image source={require('../../../images/Frame.png')} style={styles.emptyImage} resizeMode="contain" />
            <Text style={[{color:theme.colors.mainText}]}>No Charges/Fees</Text>
                <ButtonInput
                  type="button"
                  text="Add Charges/Fees"
                  onPress={handleCreateAction}
                  disabled={false}
                  loading={false}
                  styles={{ maxWidth: 230 }}
                />

            </View>
          </View>
        )
      ) : (
        // For non-admin users
        chargesPresent ? (
          <View style={[styles.mainContainer,{backgroundColor:theme.colors.background}]}>
            <View style={[styles.contentBox,{backgroundColor:theme.colors.background}]}>
              <ViewUserCharge />
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
                          <Image source={require('../../../images/Frame.png')} style={styles.emptyImage} resizeMode="contain" />
                        <Text style={[{color:theme.colors.mainText}]}>No Charges/Fees Available</Text>
              
                        {/* <Footer /> */}
                      </View>
        )
      )}
      

      {/* Alert Modal always rendered */}
      <AlertModal
        open={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Bank Details Missing"
        note="Please update your bank details before proceeding to create."
        buttonText="Close"
      />
      <Footer />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
   
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  mainContainer: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom:50,
  },
  contentBox: {
    width: '95%', // or 100% if you prefer
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9C9AA533',
    padding: 10,
    paddingBottom:0
  },
  marginBottom: {
    marginBottom: 30,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
});

export default CreateMaintenancePage;
