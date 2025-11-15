// ChatListScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getChats } from '../../services/chatService';
import axios from 'axios';
import { Chat } from '../../../types/chat';

// Get backend URL - CHANGE THIS if 192.168.0.200 doesn't work
const getBackendUrl = () => {
  const BACKEND_IP = '192.168.0.200'; // <-- CHANGE THIS to your machine IP if needed
  return `http://${BACKEND_IP}:5000`;
};

type Props = NativeStackScreenProps<any, 'ChatList'> & {
  userId: string;
  userRole: 'student' | 'lecturer';
};

const ChatListScreen: React.FC<Props> = ({ navigation, userId, userRole }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [classId, setClassId] = useState('');
  const [chatMode, setChatMode] = useState<'discussion' | 'announcement'>('discussion');
  const [creatingChat, setCreatingChat] = useState(false);

  // Fetch chats
  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!userId) {
        setError('User ID is not available');
        return;
      }
      const data = await getChats(userId);
      setChats(data || []);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [userId]);

  // Refresh chats when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchChats();
    }, [userId])
  );

  const handleCreateChat = async () => {
    if (!classId.trim()) {
      Alert.alert('Error', 'Please enter a class name');
      return;
    }

    try {
      setCreatingChat(true);
      const backendUrl = getBackendUrl();
      const response = await axios.post(
        `${backendUrl}/api/chat/create`,
        {
          classId,
          lecturerId: userId, // Current user is the lecturer creating the chat
          chatMode,
        },
        {
          timeout: 10000,
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Chat created successfully');
        setClassId('');
        setChatMode('discussion');
        setModalVisible(false);
        await fetchChats();
      }
    } catch (err) {
      console.error('Error creating chat:', err);
      if (axios.isAxiosError(err)) {
        if (err.message === 'Network Error') {
          Alert.alert('Network Error', `Cannot reach backend at ${getBackendUrl()}\n\nMake sure:\n1. Backend is running\n2. IP address is correct`);
        } else if (err.response?.status === 200 && err.response?.data?.message?.includes('already exists')) {
          Alert.alert('Info', 'Chat already exists for this class');
          await fetchChats();
        } else {
          Alert.alert('Error', err.response?.data?.error || 'Failed to create chat');
        }
      } else {
        Alert.alert('Error', 'Failed to create chat');
      }
    } finally {
      setCreatingChat(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1B72B5" />
        <Text style={styles.loadingText}>Loading chats...</Text>
      </View>
    );
  }

  if (error && chats.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="alert-circle" size={60} color="#d32f2f" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchChats}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="chat-outline" size={80} color="#bbb" />
          <Text style={styles.emptyText}>No chats yet</Text>
          <Text style={styles.emptySubtext}>Create your first chat to get started</Text>
          <TouchableOpacity
            style={styles.createFirstButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
            <Text style={styles.createFirstButtonText}>Create Chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate('ChatRoom', {
                  chatId: item._id,
                  className: item.classId,
                  chatMode: item.chatMode,
                  role: userRole,
                })
              }
            >
              <View style={styles.chatItemContent}>
                <View style={styles.chatInfo}>
                  <Text style={styles.chatTitle} numberOfLines={2}>
                    {item.classId}
                  </Text>
                  <View style={styles.chatModeBadge}>
                    <MaterialCommunityIcons
                      name={item.chatMode === 'announcement' ? 'volume-high' : 'chat'}
                      size={14}
                      color="#1B72B5"
                    />
                    <Text style={styles.chatModeText}>
                      {item.chatMode === 'announcement' ? 'Announcement' : 'Discussion'}
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Create Chat Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Chat</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Class Name Input */}
              <Text style={styles.label}>Class Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter class name (e.g., CS101 - Web Dev)"
                value={classId}
                onChangeText={setClassId}
                placeholderTextColor="#bbb"
              />

              {/* Chat Mode Selection */}
              <Text style={styles.label}>Chat Mode</Text>
              <View style={styles.modeContainer}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    chatMode === 'discussion' && styles.modeButtonActive,
                  ]}
                  onPress={() => setChatMode('discussion')}
                >
                  <MaterialCommunityIcons
                    name="chat-multiple"
                    size={20}
                    color={chatMode === 'discussion' ? '#1B72B5' : '#999'}
                  />
                  <Text
                    style={[
                      styles.modeButtonText,
                      chatMode === 'discussion' && styles.modeButtonTextActive,
                    ]}
                  >
                    Discussion
                  </Text>
                  <Text style={styles.modeDescription}>Everyone can chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    chatMode === 'announcement' && styles.modeButtonActive,
                  ]}
                  onPress={() => setChatMode('announcement')}
                >
                  <MaterialCommunityIcons
                    name="volume-high"
                    size={20}
                    color={chatMode === 'announcement' ? '#1B72B5' : '#999'}
                  />
                  <Text
                    style={[
                      styles.modeButtonText,
                      chatMode === 'announcement' && styles.modeButtonTextActive,
                    ]}
                  >
                    Announcement
                  </Text>
                  <Text style={styles.modeDescription}>Lecturer only</Text>
                </TouchableOpacity>
              </View>

              {/* Info */}
              <View style={styles.infoBox}>
                <MaterialCommunityIcons name="information" size={16} color="#1B72B5" />
                <Text style={styles.infoText}>
                  {chatMode === 'discussion'
                    ? 'In discussion mode, all participants can send messages.'
                    : 'In announcement mode, only lecturers can send messages. Students can read only.'}
                </Text>
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={creatingChat}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createButton, creatingChat && styles.createButtonDisabled]}
                onPress={handleCreateChat}
                disabled={creatingChat}
              >
                {creatingChat ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>Create Chat</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1B72B5',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1B72B5',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  createFirstButton: {
    flexDirection: 'row',
    backgroundColor: '#1B72B5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  createFirstButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  listContent: {
    paddingVertical: 8,
  },
  chatItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  chatItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
    marginRight: 12,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  chatModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  chatModeText: {
    fontSize: 12,
    color: '#1B72B5',
    fontWeight: '500',
    marginLeft: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modeButtonActive: {
    borderColor: '#1B72B5',
    backgroundColor: '#e3f2fd',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  modeButtonTextActive: {
    color: '#1B72B5',
  },
  modeDescription: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#1B72B5',
    marginLeft: 8,
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#1B72B5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ChatListScreen;