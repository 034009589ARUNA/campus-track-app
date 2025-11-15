// StudentChatListScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getChats } from '../../services/chatService';
import { Chat } from '../../../types/chat';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<any, 'ChatList'> & {
  userId: string;
  userRole: 'student' | 'lecturer';
};

const StudentChatListScreen: React.FC<Props> = ({ navigation, userId, userRole }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1B72B5" />
        <Text style={styles.loadingText}>Loading classes...</Text>
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
    <View style={styles.container} headerShown={false}  >
    <SafeAreaView>
        <StatusBar barStyle="light-content" backgroundColor="#1B72B5" /> 

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Classes</Text>
          <Text style={styles.headerSubtitle}>Student View</Text>
        </View>
        <MaterialCommunityIcons name="school" size={32} color="#fff" />
      </View>

      {/* Chat List */}
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="inbox" size={80} color="#bbb" />
          <Text style={styles.emptyText}>No classes yet</Text>
          <Text style={styles.emptySubtext}>
            You'll see your classes here when your lecturer adds you
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatCard}
              onPress={() =>
                navigation.navigate('ChatRoom', {
                  chatId: item._id,
                  className: item.classId,
                  chatMode: item.chatMode,
                  role: userRole,
                })
              }
            >
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="book-open" size={32} color="#1B72B5" />
                <View style={styles.cardInfo}>
                  <Text style={styles.chatTitle} numberOfLines={2}>
                    {item.classId}
                  </Text>
                  <View style={styles.modeContainer}>
                    <View
                      style={[
                        styles.modeBadge,
                        item.chatMode === 'announcement'
                          ? styles.announcementBadge
                          : styles.discussionBadge,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.chatMode === 'announcement' ? 'volume-high' : 'chat'}
                        size={12}
                        color="#fff"
                      />
                      <Text style={styles.modeBadgeText}>
                        {item.chatMode === 'announcement' ? 'Announcements' : 'Discussion'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.accessoryContainer}>
                {item.chatMode === 'announcement' && (
                  <MaterialCommunityIcons name="lock-outline" size={16} color="#FF9800" />
                )}
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          scrollEventThrottle={16}
        />
      )}
      </SafeAreaView>
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
  listContent: {
    paddingVertical: 8,
  },
  chatCard: {
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  announcementBadge: {
    backgroundColor: '#FF9800',
  },
  discussionBadge: {
    backgroundColor: '#4CAF50',
  },
  modeBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  accessoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  separator: {
    height: 0,
  },
});

export default StudentChatListScreen;