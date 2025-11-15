// ChatRoomScreen.tsx - Updated with delete functionality
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getMessages } from '../../services/chatService';
import { socket, SendMessagePayload } from '../../utils/socket';
import { Message } from '../../../types/chat';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

type ChatRoomRouteParams = {
  chatId: string;
  className: string;
  chatMode: 'announcement' | 'discussion';
  role: 'student' | 'lecturer';
};

const getBackendUrl = () => {
  const BACKEND_IP = '192.168.0.200';
  return `http://${BACKEND_IP}:5000`;
};

const ChatRoomScreen: React.FC = () => {
  const route = useRoute();
  const { chatId, className, chatMode, role } = (route.params as ChatRoomRouteParams) || {};
  const { user } = useAuth();
  const userId = user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const canSendMessage = role === 'lecturer' || (role === 'student' && chatMode === 'discussion');

  // Fallback checks
  if (!chatId) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="alert-circle" size={60} color="#d32f2f" />
        <Text style={styles.errorText}>Invalid chat. No chatId provided.</Text>
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="alert-circle" size={60} color="#d32f2f" />
        <Text style={styles.errorText}>User not logged in.</Text>
      </View>
    );
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessages(chatId);
        setMessages(data || []);
        setTimeout(() => scrollToBottom(), 300);
      } catch (err) {
        console.error('Error fetching messages:', err);
        Alert.alert('Error', 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Join chat room
    socket.emit('joinChat', chatId);
    console.log('🔌 Joined chat room:', chatId);

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      console.log('📨 New message received:', message);
      setMessages((prev) => [...prev, message]);
      setTimeout(() => scrollToBottom(), 100);
    };

    socket.on('message', handleNewMessage);

    return () => {
      socket.off('message', handleNewMessage);
    };
  }, [chatId]);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const sendMessage = async () => {
    if (!text.trim() || !canSendMessage || !userId) {
      return;
    }

    const messageText = text.trim();
    setText('');

    try {
      setSending(true);

      const payload: SendMessagePayload = {
        chatId,
        senderId: userId,
        text: messageText,
        role,
      };

      socket.emit('sendMessage', payload);
      console.log('📤 Message sent:', payload);
    } catch (err) {
      console.error('Error sending message:', err);
      Alert.alert('Error', 'Failed to send message');
      setText(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingMessageId(messageId);
              const backendUrl = getBackendUrl();
              const response = await axios.delete(
                `${backendUrl}/api/chat/message/${messageId}`,
                {
                  data: { userId },
                  timeout: 10000,
                }
              );

              if (response.data.success) {
                setMessages((prev) => prev.filter((m) => m._id !== messageId));
                Alert.alert('Success', 'Message deleted');
              }
            } catch (err) {
              console.error('Error deleting message:', err);
              Alert.alert('Error', 'Failed to delete message');
            } finally {
              setDeletingMessageId(null);
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // Handle both string and object senderId
    const senderId = typeof item.senderId === 'string' ? item.senderId : item.senderId?._id;
    const isOwnMessage = senderId === userId;
    const isLecturer = item.role === 'lecturer';

    return (
      <View style={[styles.messageRow, isOwnMessage ? styles.ownMessageRow : styles.otherMessageRow]}>
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
            isLecturer && !isOwnMessage && styles.lecturerBubble,
          ]}
        >
          {isLecturer && !isOwnMessage && (
            <View style={styles.lecturerBadge}>
              <MaterialCommunityIcons name="shield" size={12} color="#ff6f00" />
              <Text style={styles.lecturerBadgeText}>Lecturer</Text>
            </View>
          )}
          <Text
            style={[
              styles.messageText,
              isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp]}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Delete button - only show for own messages */}
        {isOwnMessage && deletingMessageId !== item._id && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteMessage(item._id)}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={16} color="#d32f2f" />
          </TouchableOpacity>
        )}

        {deletingMessageId === item._id && (
          <ActivityIndicator size="small" color="#d32f2f" style={styles.deletingLoader} />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1B72B5" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.container}>
        {/* Announcement Banner */}
        {chatMode === 'announcement' && role === 'student' && (
          <View style={styles.banner}>
            <MaterialCommunityIcons name="information" size={16} color="#a67c00" />
            <Text style={styles.bannerText}>Announcement Mode - Read Only</Text>
          </View>
        )}

        {/* Messages List */}
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="chat-outline" size={60} color="#bbb" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              {canSendMessage ? 'Be the first to send a message!' : 'Waiting for messages...'}
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderMessage}
            onContentSizeChange={() => scrollToBottom()}
            contentContainerStyle={styles.messagesContainer}
          />
        )}

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, !canSendMessage && { backgroundColor: '#f0f0f0' }]}
            value={text}
            onChangeText={setText}
            placeholder={canSendMessage ? 'Type a message...' : 'Read-only mode'}
            editable={canSendMessage}
            multiline
            maxLength={500}
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!canSendMessage || !text.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!canSendMessage || !text.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialCommunityIcons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  banner: {
    backgroundColor: '#ffefc5',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ffe0b2',
  },
  bannerText: {
    color: '#a67c00',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 6,
    textAlign: 'center',
  },
  messagesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  messageRow: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  ownMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  ownBubble: {
    backgroundColor: '#1B72B5',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  lecturerBubble: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff6f00',
  },
  lecturerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  lecturerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ff6f00',
    marginLeft: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  ownTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherTimestamp: {
    color: '#999',
  },
  deleteButton: {
    padding: 6,
  },
  deletingLoader: {
    padding: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1B72B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatRoomScreen;