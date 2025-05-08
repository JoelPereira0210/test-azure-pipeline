import { createContext, useState, ReactNode } from 'react';

export const SubscriptionsContext = createContext<any>(null);

interface SubscriptionsProviderProps {
  children: ReactNode;
}

export const SubscriptionsProvider: React.FC<SubscriptionsProviderProps> = ({ children }) => {
  const [createSubscription, setCreateSubscription] = useState<boolean>(false);
  const [subscriptionActionType, setSubscriptionActionType] = useState<string>("Add new Subscription");
  const [subscriptionId, setSubscriptionId] = useState<string>('');
  const [subscriptionName, setSubscriptionName] = useState<string>('');
  const [subscriptionMemberStatus, setSubscriptionMemberStatus] = useState<boolean>(false);
  const [editSubscriptionData, setEditSubscriptionData] = useState<any>(null);
  const [fetchData, setFetchData] = useState<boolean>(true);

  return (
    <SubscriptionsContext.Provider
      value={{
        createSubscription,
        setCreateSubscription,
        subscriptionActionType,
        setSubscriptionActionType,
        subscriptionId,
        setSubscriptionId,
        subscriptionName,
        setSubscriptionName,
        subscriptionMemberStatus,
        setSubscriptionMemberStatus,
        editSubscriptionData,
        setEditSubscriptionData,
        fetchData,
        setFetchData
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
};