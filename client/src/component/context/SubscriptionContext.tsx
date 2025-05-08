import { createContext, useState } from 'react';

export const SubscriptionsContext = createContext(null);

export const SubscriptionsProvider = ({ children }) => {
    const [createSubscription, setCreateSubscription] = useState(false);
    const [subscriptionActionType, setSubscriptionActionType] = useState("Add new Subscription");
    const [subscriptionId, setSubscriptionId] = useState('');
    const [subscriptionName, setSubscriptionName] = useState('');
    const [subscriptionMemberStatus, setSubscriptionMemberStatus] = useState(false)
    const [editSubscriptionData, setEditSubscriptionData] = useState(null);
    const [fetchData, setFetchData] = useState(true);
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
