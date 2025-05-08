import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import moment from 'moment';
import { useTheme } from '../../../../theme/themeProvider';

type Props = {
  text: string;
  type: 'sender' | 'receiver';
  timeStamp: string;
  fullName: string;
  designation: string;
  mediaId: string | null;
};

const Message: React.FC<Props> = ({
  text,
  type,
  timeStamp,
  fullName,
  designation,
  mediaId,
}) => {
  const colorScheme = useColorScheme();
  const mode = colorScheme || 'light';
  const { theme } = useTheme();

  // For simplicity, we choose text colors as follows:
  

  // Bubble style differs by type
  const bubbleStyle = type === 'sender' ? styles.senderBubble : styles.receiverBubble;
  const isSender = type === 'sender';

  return (
    <View style={[styles.container, { alignItems: type === 'sender' ? 'flex-end' : 'flex-start' }]}>
      <View style={[styles.messageContainer, { maxWidth: 340 }]}>
        <View style={styles.innerContainer}>
          {type === 'sender' ? null : (
            <Text style={styles.senderInfo}>
              {fullName} ({designation === 'societySuperAdmin' ? 'Admin' : designation})
            </Text>
          )}
          <View style={[styles.messageBubble, bubbleStyle]}>
          <Text style={[styles.messageText, { color: isSender ? 'white' : theme.colors.mainText }]}>
              {text || ''}
            </Text>
          </View>
          <Text style={styles.timeText}>{moment(timeStamp).calendar()}</Text>
        </View>
      </View>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  messageContainer: {
    width: '100%',
  },
  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  senderInfo: {
    marginBottom: 4,
    color: '#8E92BC',
    fontSize: 12,
  },
  messageBubble: {
    maxWidth: 340,
    // borderWidth: 1,
    // borderColor: '#f0f0f0', // Adjust as needed (placeholder for body background)
    padding: 10,
    marginBottom: 10,
  },
  senderBubble: {

    backgroundColor: '#465ff1',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  receiverBubble: {
     borderColor: '#f0f0f0', // Adjust as needed (placeholder for body background)
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  messageText: {
    fontSize: 14,
  },
  timeText: {
    fontSize: 12,
    color: '#8E92BC',
    textAlign: 'right',
  },
});
