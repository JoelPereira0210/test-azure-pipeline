import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Message from './Message';
import { useUser } from '../../context/UserContext';
import moment from 'moment';

type MessageType = {
  messageId: string;
  societyId: string;
  userId: string;
  message: string;
  timeStamp: string;
  mediaId: string | null;
  isDeleted: boolean;
  fullName: string;
  designation: string;
};

type Props = {
  allMessages: MessageType[];
  disabled: boolean;
};

const formatDate = (timeStamp: string) => {
  const messageDate = moment(timeStamp);
  if (messageDate.isSame(moment(), 'day')) return 'Today';
  if (messageDate.isSame(moment().subtract(1, 'days'), 'day')) return 'Yesterday';
  return messageDate.format('MMM DD, YYYY');
};

const groupMessagesByDate = (messages: MessageType[]) => {
  return messages.reduce((acc: { [key: string]: MessageType[] }, message) => {
    const date = formatDate(message.timeStamp);
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {});
};

const ChatHistory: React.FC<Props> = ({ allMessages, disabled }) => {
  const { user } = useUser();

  useEffect(() => {
    console.log('ChatHistory mounted');
  }, []);

  console.log('user', user);
  console.log('allMessages', allMessages);

  // Sort messages by timeStamp
  const sortedMessages = allMessages.sort(
    (a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
  );

  // Group messages by date
  const groupedMessages = groupMessagesByDate(sortedMessages);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {allMessages.length === 0 && !disabled ? (
        <Text style={styles.noMessagesText}>
          No messages found. Start chatting!
        </Text>
      ) : (
        Object.entries(groupedMessages).map(([date, messages]) => (
          <View key={date} style={styles.groupContainer}>
            {/* Date Header */}
            <View style={styles.dateHeaderContainer}>
              <View style={styles.dateHeader}>
                <Text style={styles.dateText}>{date}</Text>
              </View>
            </View>
            {/* Render Messages */}
            {messages.map((message) => (
              <Message
                key={message.messageId}
                text={message.message}
                type={user?.userId === message.userId ? 'sender' : 'receiver'}
                timeStamp={message.timeStamp}
                fullName={message.fullName}
                designation={message.designation}
                mediaId={message.mediaId}
              />
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ChatHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 8,
  },
  noMessagesText: {
    fontSize: 18,
    color: '#666',
  },
  groupContainer: {
    marginBottom: 16,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dateHeader: {
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  dateText: {
    fontWeight: '600',
    color: '#fff',
  },
});
