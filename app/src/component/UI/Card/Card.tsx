import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import { useTheme } from '../../../../theme/themeProvider'; // Use themeProvider hook

interface EventCardProps {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  eventType: 'free' | 'paid';
  amount: number;
  registeredCount: number;
  maxCount: number;
  acceptDonation: boolean;
  hasPaid: boolean;
  isAdmin: boolean;
  onRegister: () => void;
  onViewDetails: () => void;
  mode?: 'light' | 'dark';
  onMenuOpen: (event: any, id: string, title: string) => void;
  id: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  startDate,
  startTime,
  eventType,
  amount,
  registeredCount,
  maxCount,
  acceptDonation,
  hasPaid,
  isAdmin,
  onRegister,
  onViewDetails,
  onMenuOpen,
  id,
}) => {
  const { theme, mode } = useTheme(); // Access theme and mode from useTheme hook

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    let hours = time.getUTCHours();
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <Card.Content>
        <View style={styles.header}>
          <View>
            <Text style={[theme.typography.text3]}>{title}</Text>
            <Text style={[theme.typography.text6]}>
              {dayjs(startDate).format('D MMM YYYY')}, {formatTime(startTime)}
            </Text>
          </View>
          <Text
            style={{
              ...theme.typography.text3,
              color: eventType === 'free' ? theme.colors.success : theme.colors.error,
            }}
          >
            {eventType === 'free' ? 'Free' : `₹ ${amount}`}
          </Text>
        </View>

        <Text style={[theme.typography.text6]}>
          {description.length > 80 ? parse(`${description.substring(0, 80)}...`) : parse(description)}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
          {/*   <MaterialCommunityIcons name="account-group" size={24} color={theme.colors.primary} /> */}
            <Text style={[theme.typography.text6]}>&nbsp; {registeredCount}/{maxCount}</Text>
            {acceptDonation && (
              <Text style={[theme.typography.text5, { color: theme.colors.warning }]}>
                Accept Donation
              </Text>
            )}
          </View>
          {isAdmin ? (
            <IconButton
              icon="dots-horizontal"
              size={24}
              onPress={(e) => onMenuOpen(e, id, title)}
              iconColor={theme.colors.text}
            />
          ) : (
            <View style={styles.actions}>
              {registeredCount === maxCount ? (
                <Text style={[theme.typography.text5, { color: theme.colors.error }]}>
                  Registration Full
                </Text>
              ) : hasPaid ? (
                <Text style={[theme.typography.text5, { color: theme.colors.success }]}>
                  Registered
                </Text>
              ) : (
                <Text
                  style={[theme.typography.text5, { color: theme.colors.primary }]}
                  onPress={onRegister}
                >
                  Register
                </Text>
              )}
              <IconButton
                icon="information-outline"
                size={20}
                onPress={onViewDetails}
                iconColor={theme.colors.text}
                style={{ marginLeft: 8 }}
              />
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default EventCard;