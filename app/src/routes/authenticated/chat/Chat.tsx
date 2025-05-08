import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useTheme } from '../../../../theme/themeProvider';
import NetInfo from '@react-native-community/netinfo';

import { getChatsAction } from '../../../actions/chat';
import { decryptValue } from '../../../utils/encryptiondecryption';
import { useUser } from '../../../component/context/UserContext';

import Message from '../../../component/UI/ChatComponents/Message';
import SendMessage from '../../../component/UI/ChatComponents/SendMessage';

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

const Chat = () => {
  const { theme } = useTheme();
  const [allMessages, setAllMessages] = useState<MessageType[]>([]);
  const [societyId, setSocietyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [membershipStatus, setMembershipStatus] = useState<string>('');
  const [customSocket, setCustomSocket] = useState<Socket | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useUser();

  // Track whether user is at the bottom of the chat
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollViewHeight = useRef(0);
  const contentHeight = useRef(0);

  // 1. Fetch membership and role from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      const role = await AsyncStorage.getItem('flow');
      setIsAdmin(role === 'admin');

      const membership = await AsyncStorage.getItem('membershipStatus');
      setMembershipStatus(membership || '');
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Network status:', state.isConnected);
      if (!state.isConnected) {
        console.warn('You are offline');
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch and decrypt societyId before socket initialization
  useEffect(() => {
    const fetchDecryptedSocietyId = async () => {
      const storedSocietyId = await AsyncStorage.getItem('societyId');
      if (!storedSocietyId) {
        console.error("Society ID not found in AsyncStorage.");
        return;
      }
      const decryptedSocietyId = await decryptValue(storedSocietyId);
      setSocietyId(decryptedSocietyId);
    };
    fetchDecryptedSocietyId();
  }, []);

  // 3. Initialize socket + Retrieve societyId/auth token
  useEffect(() => {
    if (!societyId || customSocket) return;

    const initializeSocket = async () => {
      const netInfo = await NetInfo.fetch();
      console.log("NetInfo:", netInfo);
      if (!netInfo.isConnected) {
        console.warn("No internet connection. Socket not initialized.");
        return;
      }

      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error("Auth token not found in AsyncStorage.");
          return;
        }

        const socket = io('http://10.0.2.2:9000', {
          path: '/api/chat/socket.io',
          withCredentials: true,
          query: { platform: 'react-native' },
          transports: ['websocket'],
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomSocket(socket);

        socket.on('connect', () => {
          console.log("Socket connected");
          socket.emit('joinRoom', String(societyId));
        });

        socket.onAny((event, ...args) => {
          console.log("Socket event received:", event, args);
        });
        
        socket.on('message', (newMessage: MessageType) => {
          console.log("Received message:", newMessage);
          setAllMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
            console.log("Updated messages count:", updatedMessages.length);
            return updatedMessages;
          });
        });

        socket.on('connect_error', (error) => {
          console.error("Socket connection error:", error);
        });

        socket.on('disconnect', (reason) => {
          console.log("Socket disconnected:", reason);
        });

        return () => {
          socket.disconnect();
          console.log("Socket connection closed.");
        };
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    initializeSocket();
  }, [societyId, customSocket]);

  useEffect(() => {
    console.log("Current allMessages state:", allMessages);
  }, [allMessages]);

  // 4. Load initial messages when we have a societyId
  useEffect(() => {
    if (societyId) {
      getChats(); // Load initial page (today's chats)
    }
  }, [societyId]);

  // 5. Function to fetch older chats (infinite scroll)
  const getChats = async () => {
    if (!societyId || !hasMore || loading) return;
    setLoading(true);
    try {
      const response = await getChatsAction(societyId, page);
      if (response.status === 200) {
        console.log('getChats response:', response.data);
        const newMessages: MessageType[] = response.data;
        setAllMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.messageId));
          const filtered = newMessages.filter((m) => !existingIds.has(m.messageId));
          // Prepend older messages so they appear at the top
          return [...filtered, ...prev];
        });
        setHasMore(newMessages.length > 0);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
    setLoading(false);
  };

  // 6. Helper to format dates
  const formatDate = (timeStamp: string) => {
    const messageDate = moment(timeStamp);
    if (messageDate.isSame(moment(), 'day')) return 'Today';
    if (messageDate.isSame(moment().subtract(1, 'days'), 'day')) return 'Yesterday';
    return messageDate.format('MMM DD, YYYY');
  };

  // 7. Group messages by date, then flatten for display
  const groupMessagesByDate = (messages: MessageType[]) => {
    return messages.reduce((acc: { [key: string]: MessageType[] }, msg) => {
      const date = formatDate(msg.timeStamp);
      if (!acc[date]) acc[date] = [];
      acc[date].push(msg);
      return acc;
    }, {});
  };

  const getFlatData = () => {
    const sorted = [...allMessages].sort(
      (a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );
    const grouped = groupMessagesByDate(sorted);
    const flatData: Array<{ type: 'header' | 'message'; key: string; [x: string]: any }> = [];
    for (const [date, msgs] of Object.entries(grouped)) {
      flatData.push({ type: 'header', key: `header-${date}`, date });
      msgs.forEach((m) => {
        flatData.push({ type: 'message', key: m.messageId, data: m });
      });
    }
    return flatData;
  };

  // Compute flatData once per render
  const flatData = getFlatData();

  // 8. Handle scroll events to detect if user is at the bottom and to load older messages if at top
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Update isAtBottom flag based on current scroll position
    if (contentHeight.current - scrollViewHeight.current - offsetY < 20) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
    // When scrolled near the top (offsetY <= 20), load older messages
    if (offsetY <= 20 && !loading && hasMore) {
      getChats();
    }
  };

  // 9. Capture ScrollView height and content height
  const handleLayout = (event: LayoutChangeEvent) => {
    scrollViewHeight.current = event.nativeEvent.layout.height;
  };

  const handleContentSizeChange = (w: number, h: number) => {
    contentHeight.current = h;
    // Auto-scroll to bottom only if user is already at bottom
    if (isAtBottom) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.chatContainer, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 10 }}
          ref={scrollViewRef}
          onLayout={handleLayout}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
        >
          {/* Loader at top when pulling down to load older messages */}
          {loading && (
            <View style={styles.topLoaderContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          )}
 {/* If no chats present and not loading, display empty message */}
{!loading && flatData.length === 0 && (
            <View style={styles.emptyMessageContainer}>
              <Text style={[styles.emptyMessageText, { color: theme.colors.smallText }]}>
                No chats available.
              </Text>
            </View>
          )}
          {flatData.map((item) => {
            if (item.type === 'header') {
              return (
                <View key={item.key} style={styles.headerContainer}>
                  <View style={styles.dateHeader}>
                    <Text style={[styles.dateText, { color: theme.colors.smallText }]}>{item.date}</Text>
                  </View>
                </View>
              );
            }
            if (item.type === 'message') {
              const msg = item.data;
              return (
                <Message
                  key={msg.messageId}
                  text={msg.message}
                  type={user?.userId === msg.userId ? 'sender' : 'receiver'}
                  timeStamp={msg.timeStamp}
                  fullName={msg.fullName}
                  designation={msg.designation}
                  mediaId={msg.mediaId}
                />
              );
            }
            return null;
          })}
        </ScrollView>
      </View>
      <SendMessage
        socket={customSocket}
        disabled={!isAdmin && membershipStatus === 'unpaid'}
        refreshChats={getChats}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chatContainer: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: '3%',
  },
  topLoaderContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  dateHeader: {
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 10,
  },
  dateText: {
    fontWeight: '600',
  },
  emptyMessageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyMessageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
