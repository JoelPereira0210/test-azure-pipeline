import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import ButtonInput from '../component/UI/Button/Button';
import { useTheme } from '../../theme/themeProvider';
interface SocietySubscriptionProps {
  subscriptionData: any[]; // Or a more specific type if available
}

const SocietySubscription: React.FC<SocietySubscriptionProps> = ({ subscriptionData }) => {
  const [renewalDate, setRenewalDate] = useState<boolean>(false);
  const {theme} = useTheme();

  useEffect(() => {
    if (subscriptionData && subscriptionData.length > 0) {
      const endDate = moment(subscriptionData[0]?.subscriptionEndDate);
      const currentDate = moment();

      // Check if subscriptionEndDate is within 1 month or is past current date
      if (endDate.isSameOrBefore(currentDate.add(1, 'month'), 'day')) {
        setRenewalDate(true);
      } else {
        setRenewalDate(false);
      }
    }
  }, [subscriptionData]);

  const planName = subscriptionData?.[0]?.subscriptionMaster?.planName;
  const planPrice = subscriptionData?.[0]?.subscriptionMaster?.price;

  return (
    <View>
      {/* Divider */}
      <View style={styles.divider} />

      <View style={{ marginTop: 8 }}>
        {/* Plan Info */}
        <View style={styles.planInfoContainer}>
          <Text style={[styles.planName, { color: theme.colors.mainText }]}>
            {planName}
          </Text>
          <Text style={[styles.planPrice, { color: theme.colors.mainText }]}>
            ₹{planPrice}
          </Text>
        </View>

        {/* Upgrade / Renew Buttons */}
        <View style={styles.buttonsRow}>
          <ButtonInput
            text="Upgrade plan"
            type="submit"
            fontSize={14}

         
            onPress={() => {
              // Handle Upgrade Plan logic here
            }}
          />
          {renewalDate && (
            <ButtonInput
              text="Renew plan"
              type="submit"
              fontSize={14}
            
              onPress={() => {
                // Handle Renew Plan logic here
              }}
            />
          )}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Billing History */}
      <View style={{ marginTop: 8 }}>
        <Text style={[styles.billingHistoryTitle, { color: theme.colors.mainText }]}>Billing History</Text>
        {subscriptionData?.map((subscription, index) => (
          <Text
            key={index}
            style={[styles.billingHistoryItem, { color: theme.colors.mainText }]}
          >
            {moment(subscription?.subscriptionStartDate).format('MMM D, YYYY')} - 
            {' ₹'}{subscription?.subscriptionMaster?.price} - 
            {' '}{subscription?.subscriptionMaster?.planName}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    marginTop: 8,
    borderBottomWidth: 1.5,
    borderColor: '#000022',
  },
  planInfoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  planName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  planPrice: {
    fontSize: 14,
    // color: '#555', // or any color you like
    marginTop: 2,
  },
  buttonsRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  billingHistoryTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  billingHistoryItem: {
    fontSize: 14,
    // color: '#555', 
    marginTop: 2,
  },
});

export default SocietySubscription;
