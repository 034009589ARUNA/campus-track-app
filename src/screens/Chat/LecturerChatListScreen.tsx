// LecturerChatListScreen.tsx
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
import ViewStudentsModal from '../../../components/ViewStudentsModal';
import axios from 'axios';
import { Chat } from '../../../types/chat';

type Props = NativeStackScreenProps<any, 'ChatList'> & {
  userId: string;
  userRole: 'student' | 'lecturer';
};

const getBackendUrl = () => {
  const BACKEND_IP = '192.168.0.200';
  return `http://${BACKEND_IP}:5000`;
};

const LecturerChatListScreen: React.FC<Props> = ({ navigation, userId, userRole }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [addStudentsModalVisible, setAddStudentsModalVisible] = useState(false);
  const [viewStudentsModalVisible, setViewStudentsModalVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [classId, setClassId] = useState('');
  const [chatMode, setChatMode] = useState<'discussion' | 'announcement'>('announcement');
  const [studentIds, setStudentIds] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);
  const [addingStudents, setAddingStudents] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
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
          lecturerId: userId,
          chatMode,
        },
        { timeout: 10000 }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Chat created successfully');
        setClassId('');
        setChatMode('announcement');
        setCreateModalVisible(false);
        await fetchChats();
      }
    } catch (err) {
      console.error('Error creating chat:', err);
      Alert.alert('Error', 'Failed to create chat');
    } finally {
      setCreatingChat(false);
    }
  };

  const handleAddStudents = async () => {
    if (!selectedChat || !studentIds.trim()) {
      Alert.alert('Error', 'Please enter student IDs');
      return;
    }

    // Parse comma-separated student IDs
    const ids = studentIds
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (ids.length === 0) {
      Alert.alert('Error', 'Please enter valid student IDs');
      return;
    }

    try {
      setAddingStudents(true);
      const backendUrl = getBackendUrl();
      const response = await axios.post(
        `${backendUrl}/api/chat/${selectedChat._id}/add-students`,
        { studentIds: ids },
        { timeout: 10000 }
      );

      if (response.data.success) {
        Alert.alert('Success', `Added ${ids.length} student(s) to chat`);
        setStudentIds('');
        setAddStudentsModalVisible(false);
        await fetchChats();
      }
    } catch (err) {
      console.error('Error adding students:', err);
      Alert.alert('Error', 'Failed to add students');
    } finally {
      setAddingStudents(false);
    }
  };

  const handleChangeChatMode = async (chat: Chat, newMode: 'announcement' | 'discussion') => {
    try {
      const backendUrl = getBackendUrl();
      await axios.put(
        `${backendUrl}/api/chat/${chat._id}/mode`,
        { chatMode: newMode },
        { timeout: 10000 }
      );
      await fetchChats();
      Alert.alert('Success', `Chat mode changed to ${newMode}`);
    } catch (err) {
      console.error('Error changing chat mode:', err);
      Alert.alert('Error', 'Failed to change chat mode');
    }
  };

  const handleDeleteChat = async (chat: Chat) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete "${chat.classId}"? All messages will also be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const backendUrl = getBackendUrl();
              await axios.delete(
                `${backendUrl}/api/chat/${chat._id}`,
                {
                  data: { lecturerId: userId },
                  timeout: 10000,
                }
              );
              Alert.alert('Success', 'Class deleted successfully');
              await fetchChats();
            } catch (err) {
              console.error('Error deleting chat:', err);
              Alert.alert('Error', 'Failed to delete class');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1B72B5" />
        <Text style={styles.loadingText}>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}  >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Classes</Text>
          <Text style={styles.headerSubtitle}>Lecturer Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="chat-outline" size={80} color="#bbb" />
          <Text style={styles.emptyText}>No classes yet</Text>
          <Text style={styles.emptySubtext}>Create your first class to get started</Text>
          <TouchableOpacity
            style={styles.createFirstButton}
            onPress={() => setCreateModalVisible(true)}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
            <Text style={styles.createFirstButtonText}>Create Class</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.chatCard}>
              <TouchableOpacity
                style={styles.chatItemContent}
                onPress={() =>
                  navigation.navigate('ChatRoom', {
                    chatId: item._id,
                    className: item.classId,
                    chatMode: item.chatMode,
                    role: userRole,
                  })
                }
              >
                <View style={styles.chatInfo}>
                  <Text style={styles.chatTitle} numberOfLines={2}>
                    {item.classId}
                  </Text>
                  <View style={styles.chatMetaContainer}>
                    <View style={styles.chatModeBadge}>
                      <MaterialCommunityIcons
                        name={item.chatMode === 'announcement' ? 'volume-high' : 'chat'}
                        size={12}
                        color="#1B72B5"
                      />
                      <Text style={styles.chatModeText}>
                        {item.chatMode === 'announcement' ? 'Announcement' : 'Discussion'}
                      </Text>
                    </View>
                    <Text style={styles.participantCount}>
                      👥 {item.participants?.length || 0} students
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setSelectedChat(item);
                    setViewStudentsModalVisible(true);
                  }}
                >
                  <MaterialCommunityIcons name="account-multiple" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>View Students</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setSelectedChat(item);
                    setAddStudentsModalVisible(true);
                  }}
                >
                  <MaterialCommunityIcons name="account-plus" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Add Students</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    item.chatMode === 'announcement' ? styles.modeButtonActive : styles.modeButton,
                  ]}
                  onPress={() =>
                    handleChangeChatMode(
                      item,
                      item.chatMode === 'announcement' ? 'discussion' : 'announcement'
                    )
                  }
                >
                  <MaterialCommunityIcons
                    name={item.chatMode === 'announcement' ? 'chat' : 'volume-high'}
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.actionButtonText}>
                    {item.chatMode === 'announcement' ? 'Allow Replies' : 'Announcement Only'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButtonStyle]}
                  onPress={() => handleDeleteChat(item)}
                >
                  <MaterialCommunityIcons name="trash-can" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* View Students Modal */}
      {selectedChat && (
        <ViewStudentsModal
          visible={viewStudentsModalVisible}
          chatId={selectedChat._id}
          className={selectedChat.classId}
          onClose={() => setViewStudentsModalVisible(false)}
          onStudentRemoved={() => fetchChats()}
        />
      )}

      {/* Create Chat Modal */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Class</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Class Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., CS101 - Web Development"
                value={classId}
                onChangeText={setClassId}
                placeholderTextColor="#bbb"
              />

              <Text style={styles.label}>Chat Mode</Text>
              <View style={styles.modeContainer}>
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
                  <Text style={styles.modeDescription}>Students read-only</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    chatMode === 'discussion' && styles.modeButtonActive,
                  ]}
                  onPress={() => setChatMode('discussion')}
                >
                  <MaterialCommunityIcons
                    name="chat"
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
                  <Text style={styles.modeDescription}>Two-way chat</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setCreateModalVisible(false)}
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
                  <Text style={styles.createButtonText}>Create Class</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Students Modal */}
      <Modal
        visible={addStudentsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddStudentsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Students</Text>
              <TouchableOpacity onPress={() => setAddStudentsModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>{selectedChat?.classId}</Text>

              <Text style={styles.label}>Student IDs</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Enter student IDs separated by commas&#10;e.g., 123abc, 456def, 789ghi"
                value={studentIds}
                onChangeText={setStudentIds}
                placeholderTextColor="#bbb"
                multiline
                numberOfLines={5}
              />

              <View style={styles.infoBox}>
                <MaterialCommunityIcons name="information" size={16} color="#1B72B5" />
                <Text style={styles.infoText}>
                  Enter comma-separated student IDs. These should match the user IDs from your database.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAddStudentsModalVisible(false)}
                disabled={addingStudents}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createButton, addingStudents && styles.createButtonDisabled]}
                onPress={handleAddStudents}
                disabled={addingStudents}
              >
                {addingStudents ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.createButtonText}>Add Students</Text>
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
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
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
  chatCard: {
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  chatItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
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
  chatMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chatModeText: {
    fontSize: 12,
    color: '#1B72B5',
    fontWeight: '500',
    marginLeft: 4,
  },
  participantCount: {
    fontSize: 12,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#1B72B5',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 12,
  },
  deleteButtonStyle: {
    backgroundColor: '#d32f2f',
  },
  separator: {
    height: 0,
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
  multilineInput: {
    textAlignVertical: 'top',
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButtonStyle: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modeButtonStyleActive: {
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

export default LecturerChatListScreen;