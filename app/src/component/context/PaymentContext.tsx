import { createContext, useState } from 'react';

interface PaymentContextType {
    paymentItemAmount: number | null;
    setPaymentItemAmount: (value: number | null) => void;
    paymentItemName: string | null;
    setPaymentItemName: (value: string | null) => void;
    paymentItemId: string | null;
    setPaymentItemId: (value: string | null) => void;
    paymentItemSection: string | null;
    setPaymentItemSection: (value: string | null) => void;
    eventRegistrationCount: number | null;
    setEventRegistrationCount: (value: number | null) => void;
    subsciptionDuration: number | null;
    setSubscriptionDuration: (value: number | null) => void;
    subscriptionMaxUsers: number | null;
    setSubscriptionMaxUsers: (value: number | null) => void;
}

export const PaymentContext = createContext<PaymentContextType>({} as PaymentContextType);

export const PaymentProvider = ({ children }:any) => {
    const [paymentItemAmount, setPaymentItemAmount] = useState<number | null>(null);
    const [paymentItemName,setPaymentItemName] = useState<string | null>(null);
    const [paymentItemId, setPaymentItemId] = useState<string | null>(null);
    const [paymentItemSection, setPaymentItemSection] = useState<string | null>(null);
    const [eventRegistrationCount,setEventRegistrationCount] = useState<number | null>(null);
    const [subsciptionDuration, setSubscriptionDuration] = useState<number | null>(null);
    const [subscriptionMaxUsers, setSubscriptionMaxUsers] = useState<number | null>(null);
    

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
