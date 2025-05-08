import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, Button, List, IconButton } from 'react-native-paper';
import { useTheme } from '../../../theme/themeProvider';

type Props = {
  buttonText: string;
  buttonAction?: () => void;
  planName: string;
  maxUsers: string;
  amount: string;
  planDescription: string;
  duration: string;
  subscription?: any;
  selectedSubscription?: any | null;
  setSelectedSubscription?: (obj: object) => void;
};

const Subscription = ({
  buttonText,
  buttonAction,
  planName,
  maxUsers,
  amount,
  planDescription,
  duration,
  subscription,
  selectedSubscription,
  setSelectedSubscription,
}: Props) => {

  const isSelected = selectedSubscription?.subscriptionId === subscription?.subscriptionId;
  const {theme,mode} = useTheme();

  return (
    <TouchableOpacity onPress={() => setSelectedSubscription?.(subscription)}>
      <Card
        style={{
          padding: 20,
          width: 290,
          // height: 564,
          // minHeight: 500,
          minHeight: '80%',
          borderRadius: 10,
          backgroundColor: isSelected ? theme.colors.main : theme.colors.background,
          borderWidth: 1, // Add border width
          borderColor: isSelected ? '#465FF1' : '#e0e0e0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.8,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Card.Content>
          <Text
            variant="headlineSmall"
            style={{ fontWeight: '600', color: mode === 'light' ? (isSelected ? '#fff' : '#000') : (isSelected ? '#000' : '#fff'),marginBottom: 5 }}

          >
            {planName}
          </Text>
          <Text
            variant="displaySmall"
            style={{ color: mode === 'light' ? (isSelected ? '#fff' : '#000') : (isSelected ? '#000' : '#fff') }}
          >
            ₹ {amount}
          </Text>
          <Text
            variant="headlineSmall"
            style={{ fontWeight: '300', marginBottom: 8, color: mode === 'light' ? (isSelected ? '#fff' : '#000') : (isSelected ? '#000' : '#fff') }}
          >
            / month
          </Text>
          <Text
            variant="bodyLarge"
            style={{ maxWidth: 214, color: mode === 'light' ? (isSelected ? '#fff' : '#000') : (isSelected ? '#000' : '#fff') }}
          >
            {planDescription}
          </Text>

          <List.Section>
            <List.Item
              title={`${duration} Months`}
              left={() => (
                <IconButton
                  icon="check"
                  iconColor={mode === 'light' ? (isSelected ? '#fff' : '#000') : (isSelected ? '#000' : '#fff')}
                  size={20}
                />
              )}
              titleStyle={{ color: mode === 'light' ? (isSelected ? '#fff' : '#000') : (isSelected ? '#000' : '#fff'),fontSize:16,marginLeft:0 }}
            />
            <List.Item
              title={`${maxUsers} Users`}
              left={() => (
                <IconButton
                  icon="check"
                  iconColor={mode === 'light' ? (isSelected ? '#fff' : '#000') : (isSelected ? '#000' : '#fff')}
                  size={20}
                />
              )}
              titleStyle={{ color: mode === 'light' ? (isSelected ? '#fff' : '#000') : (isSelected ? '#000' : '#fff'),fontSize:16,marginLeft:0}}
            />
          </List.Section>
        </Card.Content>

        <Card.Actions style={{ justifyContent: 'center' }}>
          <Button
            mode='text'
            buttonColor={mode === 'light' ? (isSelected ? 'white' : '#465FF1') : (isSelected ? '#000' : '#465FF1')}
            onPress={buttonAction}
            style={{ width: '100%', borderRadius: 8, marginBottom:50}}
            contentStyle={{ height: 50 }}
            labelStyle={{
              fontSize: 16,
              fontWeight: '700',
              color: mode === 'light' ? (isSelected ? '#465FF1' : 'white') : (isSelected ? '#465FF1' : 'white'),
           
            }}
          >
            {buttonText}
          </Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );
};

export default Subscription;
