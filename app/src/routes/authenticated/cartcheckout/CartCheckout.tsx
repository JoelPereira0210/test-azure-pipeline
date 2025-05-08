import React, {useState, useContext} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Text, Card, Divider, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../../../component/context/UserContext';
import {PaymentContext} from '../../../component/context/PaymentContext';
import {validateCoupon} from '../../../actions/coupons';
import { showToast } from '../../../utils/toastService';
import SubscriptionPayment from '../../../component/SubscriptionPayment';
import ButtonInput from '../../../component/UI/Button/Button';
import EventPayment from '../../../component/EventPayment';
import ChargesPayment from '../../../component/ChargesPayment';
import MembershipPayment from '../../../component/MembershipPayment';
import { useTheme } from '../../../../theme/themeProvider';

const CartCheckoutPage = () => {
  const {
    paymentItemAmount,
    paymentItemName,
    paymentItemId,
    paymentItemSection,
    eventRegistrationCount,
    subsciptionDuration,
    subscriptionMaxUsers,
  } = useContext(PaymentContext);

  const {user} = useUser();
  const navigation = useNavigation();
  const {theme,mode} = useTheme();

  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountData, setDiscountData] = useState<{ discountPercentage: number } | null>(null);
  const [loadingDiscount, setLoadingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [isCouponVisible, setIsCouponVisible] = useState(false);

  const subtotal = paymentItemAmount || 0;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = async () => {
    setLoadingDiscount(true);
    setDiscountError('');
    setDiscountApplied(false);

    try {
      const FetchedDiscountData = await validateCoupon(discountCode);
      if (FetchedDiscountData && FetchedDiscountData.discountPercentage) {
        setDiscountData(FetchedDiscountData);
        const discountAmt =
          (subtotal * FetchedDiscountData.discountPercentage) / 100;
        setDiscountAmount(discountAmt);
        setDiscountApplied(true);
        showToast('Discount applied successfully!','success');
      } else {
        showToast('Invalid discount code or no discount available!','error');
        setDiscountError('Invalid discount code or no discount available.');
        setDiscountAmount(0);
        setDiscountApplied(false);
      }
    } catch (error) {
      // console.error('Error applying discount:', error);
      setDiscountError('Failed to validate discount code. Try again.');
      setDiscountAmount(0);
      setDiscountApplied(false);
    } finally {
      setLoadingDiscount(false);
    }
  };

  const handleCancel = () => {
    if(paymentItemSection === 'Subscription Payment'){  
      // console.log("in Subscription Payment")
      navigation.goBack();
    }else{
      // console.log("in Subscription Payment not")
    //@ts-ignore
    navigation.navigate('AuthNavigator', { screen: 'Members' });
    }

  };

  return (
    <ScrollView contentContainerStyle={[styles.container,{backgroundColor:theme.colors.background}]}>
      <Text variant="headlineMedium" style={[styles.title,{color:theme.colors.mainText}]}>
        Payment
      </Text>

      {paymentItemSection !== 'Event Payment' &&
        paymentItemSection !== 'Donation Payment' &&
        paymentItemSection !== 'Charges Payment' && (
          <Text variant="bodyMedium" style={[styles.subtitle,{color:theme.colors.smallText}]}>
            Choose a plan that fits your needs.
          </Text>
        )}

      <Card style={[styles.card,{backgroundColor:mode==='light'?'#C4DBF7':'#252525'}]}>
        <Text variant="titleLarge" style={[styles.sectionTitle,{color:theme.colors.mainText}]}>
          Your Order Summary
        </Text>

        <View style={[styles.summaryItem,{backgroundColor:mode==='light'?'#1F64FF40':'#252525',borderWidth:mode==='light'?0:1,borderColor:mode==='light'?'none':'#F5F6FA5F', padding:20}]}>
          <Text variant="bodyLarge" style={[{color:theme.colors.mainText}]}>{paymentItemName}</Text>
          <Text variant="bodyLarge" style={[styles.boldText,{color:theme.colors.mainText}]}>
            Rs. {paymentItemAmount}
          </Text>
        </View>

        {paymentItemSection !== 'Event Payment' &&
          paymentItemSection !== 'Donation Payment' &&
          paymentItemSection !== 'Charges Payment' &&
          paymentItemSection !== 'membership' && (
            <>
              <Divider style={styles.divider} />

              {/* Coupon Toggle */}
              <View style={styles.couponToggle}>
                <Text variant="bodyLarge" style={[styles.boldText,{color:theme.colors.mainText}]}>
                  Apply Coupon
                </Text>
                <IconButton
                  icon={isCouponVisible ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  onPress={() => setIsCouponVisible(!isCouponVisible)}
                  iconColor={theme.colors.mainText}
                />
              </View>

              {/* Coupon Input */}
              {isCouponVisible && (
                <View style={[styles.couponInputContainer,{backgroundColor:theme.colors.background}]}>
                  <View style={styles.couponIcon}>
                    <Text style={[styles.couponText]}>%</Text>
                  </View>

                  <TextInput
                    placeholder="Enter Code"
                    placeholderTextColor={theme.colors.smallText}
                    value={discountCode}
                    onChangeText={setDiscountCode}
                    style={[styles.textInput,{color:theme.colors.mainText}]}
                  />

                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={handleApplyDiscount}
                    disabled={loadingDiscount}>
                    <Text style={styles.applyButton}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}

              {discountError ? (
                <Text style={styles.errorText}>{discountError}</Text>
              ) : null}

              <Divider style={styles.divider} />

              {/* Price Breakdown */}
              <View style={styles.summaryItem}>
                <Text variant="bodyMedium" style={[{color:theme.colors.mainText}]}>Subtotal</Text>
                <Text variant="bodyMedium" style={[{color:theme.colors.mainText}]}>Rs. {subtotal}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="bodyMedium" style={[{color:theme.colors.mainText}]}>Platform Fee</Text>
                <Text variant="bodyMedium" style={[{color:theme.colors.mainText}]}>Rs. x</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="bodyMedium" style={[{color:theme.colors.mainText}]}>Convenience Fee</Text>
                <Text variant="bodyMedium" style={[{color:theme.colors.mainText}]}>Rs. x</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text variant="bodyMedium" style={[{color:theme.colors.mainText}]}>
                  Discount ({discountData?.discountPercentage}%)
                </Text>
                <Text variant="bodyMedium" style={{color: 'red'}}>
                  -Rs. {discountAmount}
                </Text>
              </View>

              <Divider style={styles.divider} />
            </>
          )}

        <View style={styles.summaryItem}>
          <Text variant="bodyLarge" style={styles.boldText}>
            Total
          </Text>
          <Text variant="bodyLarge" style={styles.boldText}>
            Rs. {total}
          </Text>
        </View>
      </Card>

      {/* Payment Button */}
      

      {paymentItemSection === 'Subscription Payment' && (
      <SubscriptionPayment
        total={total}
        subscriptionName={paymentItemName ?? ''}
        subscriptionId={paymentItemId ?? ''}
        duration={subsciptionDuration ?? 0}
        maxUsers={subscriptionMaxUsers ?? 0}
        user={user}
        discountApplied={discountApplied}
        discountData={discountData}
      />
      )}

{(paymentItemSection === 'Event Payment' || paymentItemSection === 'Donation Payment') && (
          <EventPayment
            total={total}
            planName={paymentItemName}
            planId={paymentItemId}
            planSection={paymentItemSection}
            noOfRegistrations={eventRegistrationCount}
            user={user}
          />
        )}


{paymentItemSection === 'Charges Payment' && (
          <ChargesPayment
            total={total}
            chargeName={paymentItemName ?? ''}
            chargeId={paymentItemId ?? ''}
            chargeSection={paymentItemSection}
            user={user}
          />
        )}



{paymentItemSection === 'membership' && (
          <MembershipPayment
            total={total}
            membershipName={paymentItemName??''}
          // membershipId={paymentItemId}

          // user={user}

          />
        )}
        
    
      <ButtonInput
        text="Cancel"
        onPress={handleCancel}
        styles={styles.cancelButton}
        buttonBackgroundColor={theme.colors.background}
                  borderColor={theme.colors.mainText}
                  buttonFontColor={theme.colors.mainText}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginTop: 5,
    marginBottom: 5,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    flex:1
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#9C9AA5',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    borderRadius  :10,
  },
  divider: {
    marginVertical: 10,
  },
  couponToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4B7DF3',
    borderRadius: 12,
    padding: 8,
    backgroundColor: 'white',
  },
  couponInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4B7DF3',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  couponIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#1976d2',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponText: {
    color: 'white',
    fontWeight: 'bold',
  },
  applyButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 20,
    width: '80%',
  },
});

export default CartCheckoutPage;