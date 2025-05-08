// import React, { useEffect, useState, useContext } from 'react';
// import { View, ScrollView, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Text, Button } from 'react-native-paper';
// import { getPublishedSubscriptions } from '../../../actions/auth';
// import { useUser } from '../../../component/context/UserContext';
// import { PaymentContext } from '../../../component/context/PaymentContext';
// import Subscription from '../../../component/UI/Subscription';
// import { useTheme } from '../../../../theme/themeProvider';

// const Subscriptions = () => {
//   const [loading, setLoading] = useState(false);
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [selectedSubscription, setSelectedSubscription] = useState(null);
  
//   const navigation = useNavigation();
//   const { user: contextUser } = useUser(); // Get user details from context
//   const societyId = contextUser?.societyId; // Fetch societyId from user context
// const {theme} = useTheme();
//   const {
//     setPaymentItemAmount,
//     setPaymentItemName,
//     setPaymentItemId,
//     setPaymentItemSection,
//     setSubscriptionDuration,
//     setSubscriptionMaxUsers
//   } = useContext(PaymentContext);

//   useEffect(() => {
//     getSubscription();
//   }, []);

//   const getSubscription = async () => {
//     try {
//       const response = await getPublishedSubscriptions();
//       if (response.status === 200) {
//         setSubscriptions(response?.data);
//       }
//     } catch (error) {
//       console.log('Error fetching subscriptions:', error);
//     }
//   };

//   const handleSubscriptionClick = (subscription) => {
//     setSelectedSubscription(prev => (prev === subscription ? null : subscription));
//   };

//   const handlePaymentGateway = async () => {
//     try {
//       setLoading(true);
//       setPaymentItemAmount(selectedSubscription?.price);
//       setPaymentItemName(selectedSubscription?.planName);
//       setPaymentItemId(selectedSubscription?.subscriptionId);
//       setPaymentItemSection('Subscription Payment');
//       setSubscriptionDuration(selectedSubscription?.duration);
//       setSubscriptionMaxUsers(selectedSubscription?.maxUsers);

//       // Navigate to checkout (update route if necessary)
//       navigation.navigate('CartCheckoutPage');


//     } catch (error) {
//       console.error('Error navigating to payment gateway:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // <ScrollView contentContainerStyle={[styles.container,{backgroundColor:theme.colors.background}]}>
//     //   <Text variant="headlineMedium" style={styles.title}>Subscription</Text>
//     //   <Text variant="bodyMedium" style={styles.subtitle}>Choose a plan that fits your needs.</Text>
      
//     //   <View style={styles.subscriptionContainer}>
//     //     {subscriptions.map(subscription => (
//     //       <Subscription
//     //         key={subscription?.subscriptionId}
//     //         planName={subscription.planName}
//     //         maxUsers={subscription.maxUsers}
//     //         amount={subscription.price}
//     //         planDescription={subscription.planDescription}
//     //         duration={subscription.duration}
//     //         selectedSubscription={selectedSubscription}
//     //         setSelectedSubscription={() => handleSubscriptionClick(subscription)}
//     //         subscription={subscription}
//     //         buttonText={'Subscribe'}
//     //       />
//     //     ))}
//     //   </View>
      
//     //   {selectedSubscription && (
//     //     <Button
//     //       mode="contained"
//     //       onPress={handlePaymentGateway}
//     //       loading={loading}
//     //       disabled={loading}
//     //       style={styles.button}
//     //     >
//     //       Start Your {selectedSubscription?.planName}
//     //     </Button>
//     //   )}
//     // </ScrollView>
// <View style={{ flex: 1 }}>

//     <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background,flexGrow: 1 }]}>
//   <Text variant="headlineMedium" style={styles.title}>Subscription</Text>
//   <Text variant="bodyMedium" style={styles.subtitle}>Choose a plan that fits your needs.</Text>

//   {/* Horizontal Scroll View for Subscription Cards */}

  

//   <ScrollView 
//     horizontal 
//     showsHorizontalScrollIndicator={false} 
//     contentContainerStyle={styles.subscriptionContainer}
//   >
//     {subscriptions.map(subscription => (
//       <Subscription
//         key={subscription?.subscriptionId}
//         planName={subscription.planName}
//         maxUsers={subscription.maxUsers}
//         amount={subscription.price}
//         planDescription={subscription.planDescription}
//         duration={subscription.duration}
//         selectedSubscription={selectedSubscription}
//         setSelectedSubscription={() => handleSubscriptionClick(subscription)}
//         subscription={subscription}
//         buttonText={'Subscribe'}
//       />
//     ))}
//   </ScrollView>



//   {selectedSubscription && (
//     <Button
//       mode="contained"
//       onPress={handlePaymentGateway}
//       loading={loading}
//       disabled={loading}
//       style={styles.button}
//     >
//       Start Your {selectedSubscription?.planName}
//     </Button>
//   )}
// </ScrollView>
      
// </View>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   title: {
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   subtitle: {
//     textAlign: 'center',
//     color: '#9C9AA5',
//     marginBottom: 20,
//   },
//   subscriptionContainer: {
//     flexDirection: 'row', // Make items align horizontally
//     alignItems: 'center',
//     gap: 10,
//     paddingHorizontal: 10, // Add some padding for smooth scrolling
//     paddingBottom: 0, // Remove extra bottom space
//     marginBottom: 0, // Ensure no margin at the bottom
//   },
//   button: {
//     marginTop: 10,
//     marginBottom:50,
//     width: '80%',
//   },
// });

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 20,
// //     alignItems: 'center',
// //   },
// //   title: {
// //     textAlign: 'center',
// //     marginBottom: 10,
// //   },
// //   subtitle: {
// //     textAlign: 'center',
// //     color: '#9C9AA5',
// //     marginBottom: 20,
// //   },
// //   subscriptionContainer: {
// //     width: '100%',
// //     alignItems: 'center',
// //     gap: 10,
// //   },
// //   button: {
// //     marginTop: 20,
// //     width: '80%',
// //   },
// // });

// export default Subscriptions;


import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Button } from 'react-native-paper';
import { getPublishedSubscriptions } from '../../../actions/auth';
import { useUser } from '../../../component/context/UserContext';
import { PaymentContext } from '../../../component/context/PaymentContext';
import Subscription from '../../../component/UI/Subscription';
import { useTheme } from '../../../../theme/themeProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ButtonInput from '../../../component/UI/Button/Button';

const Subscriptions = () => {
  const [loading, setLoading] = useState(false);
  interface Subscription {
    subscriptionId: string;
    planName: string;
    price: number;
    maxUsers: number;
    duration: number;
    planDescription: string;
  }
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user: contextUser } = useUser();
  const { theme } = useTheme();
  const {
    setPaymentItemAmount,
    setPaymentItemName,
    setPaymentItemId,
    setPaymentItemSection,
    setSubscriptionDuration,
    setSubscriptionMaxUsers,
  } = useContext(PaymentContext);

  useEffect(() => {
    getSubscription();
  }, []);

  const getSubscription = async () => {
    try {
      const response = await getPublishedSubscriptions();
      if (response && response.status === 200) {
        setSubscriptions(response.data);
      }
    } catch (error) {
      console.log('Error fetching subscriptions:', error);
    }
  };

  const handleSubscriptionClick = (subscription:any) => {
    setSelectedSubscription(prev => (prev === subscription ? null : subscription));
  };

  const handlePaymentGateway = async () => {
    try {
      setLoading(true);
      setPaymentItemAmount(selectedSubscription?.price ?? null);
      setPaymentItemName(selectedSubscription?.planName ?? null);
      setPaymentItemId(selectedSubscription?.subscriptionId ?? null);
      setPaymentItemSection('Subscription Payment');
      setSubscriptionDuration(selectedSubscription?.duration ?? null);
      setSubscriptionMaxUsers(selectedSubscription?.maxUsers ?? null);
      //@ts-ignore
      navigation.navigate('CartCheckoutPage');
    } catch (error) {
      console.error('Error navigating to payment gateway:', error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll Handlers
  const scrollLeft = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollPosition - 300, animated: true });
      setScrollPosition(prev => Math.max(prev - 300, 0));
    }
  };

  const scrollRight = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollPosition + 300, animated: true });
      setScrollPosition(prev => prev + 300);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background, flexGrow: 1 }]}
      >
        <Text variant="headlineMedium" style={[{color:theme.colors.mainText},styles.title]}>Subscription</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Choose a plan that fits your needs.</Text>

        {/* Arrows and Horizontal ScrollView */}
        <View style={styles.scrollContainer}>
          {/* Left Arrow */}
          {scrollPosition > 0 && (
            <TouchableOpacity style={styles.arrowLeft} onPress={scrollLeft}>
              <Icon name="chevron-left" size={40} color="#5B61F1" />
            </TouchableOpacity>
          )}

          {/* Scrollable Subscription Cards */}
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.subscriptionContainer}
          >
            {subscriptions.map(subscription => (
              <Subscription
                key={subscription?.subscriptionId ??null}
                planName={subscription.planName}
                maxUsers={(subscription.maxUsers ?? '').toString()}
                amount={String(subscription.price ?? '')}
                planDescription={subscription.planDescription}
                duration={(subscription.duration ?? '').toString()}
                selectedSubscription={selectedSubscription}
                setSelectedSubscription={() => handleSubscriptionClick(subscription)}
                subscription={subscription}
                buttonText={'Subscribe'}
              />
            ))}
          </ScrollView>

          {/* Right Arrow */}
          {subscriptions.length > 1 && (
            <TouchableOpacity style={styles.arrowRight} onPress={scrollRight}>
              <Icon name="chevron-right" size={40} color="#5B61F1" />
            </TouchableOpacity>
          )}
        </View>

        {selectedSubscription && (
          <ButtonInput
          text={`Start Your ${selectedSubscription?.planName}`}
            onPress={handlePaymentGateway}
            loading={loading}
            disabled={loading}
            width={'80%'}
            styles={[{ marginBottom: 30}]}

          />
            
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#9C9AA5',
    marginBottom: 20,
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  subscriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  arrowLeft: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  arrowRight: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },

});

export default Subscriptions;

