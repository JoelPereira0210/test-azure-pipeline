// MembershipCheckoutPage.tsx
import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import ButtonInput from '../../../component/UI/Button/Button'; // adjust the path as needed
import { PaymentContext } from '../../../component/context/PaymentContext'; // adjust the path as needed
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../theme/themeProvider';

const MembershipCheckoutPage = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const {
    paymentItemAmount,
    setPaymentItemAmount,
    paymentItemName,
    setPaymentItemName,
    paymentItemId,
    setPaymentItemId,
    paymentItemSection,
    setPaymentItemSection,
    setEventRegistrationCount
  } = useContext(PaymentContext);

  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.innerContainer, { backgroundColor: theme.colors.cardBackground }]}>
        <View style={styles.content}>
          <Image
            source={require('../../../images/welcomeIcon.png')} // adjust the path as needed
            style={styles.image}
          />
          <Text style={[styles.title, { color: theme.colors.mainText }]}>
            You have successfully created your password to complete registration and avail all the features. You need to pay the membership fees.
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.mainText }]}>
            Membership Fees cost ₹ {paymentItemAmount}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonInput
            type="button"
            text="Pay Later"
            width={130}

            disabled={false}
            loading={loading}
            onPress={() => {
              setLoading(true);
              // Navigate to signup with a signin query parameter (adjust as per your navigator)
              //@ts-ignore
              navigation.navigate('UnauthNavigator', { screen: 'Signup' });
            }}
          />
          <ButtonInput
            type="button"
            text="Pay Now"
            width={130}
            disabled={false}
            loading={loading}
            onPress={() => {
              setLoading(true);
              setPaymentItemSection("membership");
              setPaymentItemName("Membership");
              //@ts-ignore
              navigation.navigate('UnauthNavigator', {screen:'CartCheckoutPage'});
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default MembershipCheckoutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    maxWidth: 970,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 180,
    height: 180,
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap:10,
    marginTop: 20,
  },
});
