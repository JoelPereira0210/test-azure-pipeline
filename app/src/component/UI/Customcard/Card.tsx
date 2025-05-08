import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Avatar } from 'react-native-paper';
import dayjs from 'dayjs';
import { useTheme } from '../../../../theme/themeProvider'; // Use themeProvider hook

interface CardProps {
  title?: string;
  startDate?: string;
  description?: string;
  price?: string | null;
  percentage?: number | string;
  registeredMembersCount?: number;
  maxUsers?: number | string;
  buttonText?: string;
  buttonAction?: () => void;
  mode?: 'light' | 'dark';
  showEditButton?: boolean;
}

const CustomCard: React.FC<CardProps> = ({
  title,
  startDate,
  description = '',
  price,
  registeredMembersCount,
  maxUsers,
  percentage,
  buttonText,
  buttonAction,
  mode = 'light',
  showEditButton = false,
}) => {
  const { theme } = useTheme(); // Access theme from useTheme hook

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('D MMM YYYY');
  };

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: theme.colors.background, borderColor: theme.colors.onBackground },
      ]}
    >
      <Card.Content>
        <View style={styles.header}>
          <View>
            <Text
              style={[
                { color: theme.colors.text, backgroundColor: theme.colors.background },
                theme.typography.text3,
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                theme.typography.text6,
                { color: theme.colors.text, backgroundColor: theme.colors.background },
              ]}
            >
              {startDate ? formatDate(startDate) : ''}
            </Text>
          </View>
          <Text
            style={[
              theme.typography.text3,
              {
                color: price ? theme.colors.error : theme.colors.success,
                backgroundColor: theme.colors.background,
              },
            ]}
          >
            {price ? `₹ ${price}` : percentage ? `${percentage}%` : ''}
          </Text>
        </View>

        <Text
          style={[
            theme.typography.text6,
            {
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
            },
          ]}
        >
          {description.length > 80 ? `${description.substring(0, 80)}...` : description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.membersContainer}>
            <Avatar.Icon
              size={32}
              icon="account-group"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <Text
              style={[
                theme.typography.text6,
                { color: theme.colors.text, backgroundColor: theme.colors.background },
              ]}
            >
              {registeredMembersCount}/{maxUsers}
            </Text>
          </View>

          {showEditButton ? (
            <IconButton
              icon="dots-horizontal"
              size={24}
              onPress={buttonAction}
              accessibilityLabel="Edit"
              iconColor={theme.colors.text}
            />
          ) : (
            <View style={styles.actionContainer}>
              <Text
                style={[
                  theme.typography.text5,
                  { color: theme.colors.primary, backgroundColor: theme.colors.background },
                ]}
                onPress={buttonAction}
              >
                {buttonText}
              </Text>
              <IconButton
                icon="dots-horizontal"
                size={20}
                accessibilityLabel="More Options"
                iconColor={theme.colors.text}
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
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default CustomCard;