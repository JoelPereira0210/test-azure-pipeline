import React, { ReactNode } from 'react';

import { Provider as PaperProvider } from 'react-native-paper';
import { UserProvider } from '../component/context/UserContext';
import { PaymentProvider } from '../component/context/PaymentContext';
import { EventProvider } from '../component/context/EventContext';
import { MemberProvider } from '../component/context/MemberContext';
import { ChargesProvider } from '../component/context/ChargesContext';
import { SubscriptionsProvider } from '../component/context/SubscriptionContext';
import { CouponsProvider } from '../component/context/CouponContext';
import { MoreDetailsProvider } from '../component/context/MoreDetails';
import { ThemeProvider } from '../../theme/themeProvider';


export const AppProviders = ({ children }: { children: ReactNode }) => {

  return (
    <ThemeProvider>
      <PaperProvider>
        <UserProvider>
          <MoreDetailsProvider>
          <EventProvider>
            <PaymentProvider>
              <ChargesProvider>
                <MemberProvider>
                  <SubscriptionsProvider>
                    <CouponsProvider>{children}</CouponsProvider>
                  </SubscriptionsProvider>
                </MemberProvider>
              </ChargesProvider>
            </PaymentProvider>
          </EventProvider>
          </MoreDetailsProvider>
        </UserProvider>
      </PaperProvider>
    </ThemeProvider>
  );
};
