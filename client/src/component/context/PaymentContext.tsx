import { createContext, useState } from 'react';

export const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
    const [paymentItemAmount, setPaymentItemAmount] = useState(null);
    const [paymentItemName,setPaymentItemName] = useState(null);
    const [paymentItemId, setPaymentItemId] = useState(null);
    const [paymentItemSection, setPaymentItemSection] = useState(null);
    const [eventRegistrationCount,setEventRegistrationCount] = useState(null);
    const [subsciptionDuration, setSubscriptionDuration] = useState(null);
    const [subscriptionMaxUsers, setSubscriptionMaxUsers] = useState(null);
    

  return (
    <PaymentContext.Provider
      value={{
         paymentItemAmount,
         setPaymentItemAmount,
         paymentItemName,
         setPaymentItemName,
         paymentItemId, 
         setPaymentItemId,
         paymentItemSection, 
         setPaymentItemSection,
         eventRegistrationCount,
         setEventRegistrationCount,
         subsciptionDuration, 
         setSubscriptionDuration,
         subscriptionMaxUsers, 
         setSubscriptionMaxUsers
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
