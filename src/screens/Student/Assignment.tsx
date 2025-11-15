// src/screens/Student/StudentAssignmentScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import {
  getAvailableAssignments,
  getStudentSubmission,
  getMySubmissions,
  getMyGrades,
  submitAssignment,
} from '../../services/studentAssignmentService';
import { pickFile, uploadFile } from '../../services/fileUploadService';

interface Assignment {
  _id: string;
  title: string;
  classId: string;
  description: string;
  dueDate: string;
  maxGrade: number;
  lecturerId: {
    fullName: string;
  };
}

interface Submission {
  _id: string;
  assignmentId: {
    title: string;
    classId: string;
    maxGrade: number;
  };
  fileName: string;
  submittedAt: string;
  status: 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  isLate: boolean;
}

export default function StudentAssignmentScreen() {
  const { user } = useAuth();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState<'available' | 'submissions' | 'grades'>('available');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [grades, setGrades] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmissionDetails, setShowSubmissionDetails] = useState(false);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!userId) {
        setError('User ID not available');
        return;
      }
      const data = await getAvailableAssignments(userId);
      setAssignments(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!userId) {
        setError('User ID not available');
        return;
      }
      const data = await getMySubmissions(userId);
      setSubmissions(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchGrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!userId) {
        setError('User ID not available');
        return;
      }
      const data = await getMyGrades(userId);
      setGrades(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load grades');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAssignments();
    } else if (activeTab === 'submissions') {
      fetchSubmissions();
    } else if (activeTab === 'grades') {
      fetchGrades();
    }
  }, [activeTab, fetchAssignments, fetchSubmissions, fetchGrades]);

  const handleSubmitAssignment = async (assignment: Assignment) => {
    if (!userId) {
      Alert.alert('Error', 'User ID not available');
      return;
    }

    Alert.alert('Submit Assignment', `Submit "${assignment.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Upload File',
        onPress: async () => {
          try {
            setLoading(true);
            
            // Pick a file
            const fileResult = await pickFile();
            
            if (!fileResult) {
              setLoading(false);
              return; // User cancelled
            }

            // Upload the file
            Alert.alert('Uploading', 'Please wait while your file is being uploaded...');
            
            const uploadResult = await uploadFile(
              fileResult.uri,
              fileResult.name || 'assignment.pdf'
            );

            // Submit the assignment with the uploaded file URL
            await submitAssignment(
              assignment._id,
              userId,
              uploadResult.fileUrl,
              uploadResult.fileName
            );

            Alert.alert('Success', 'Assignment submitted successfully!', [
              {
                text: 'OK',
                onPress: () => {
                  fetchAssignments();
                  fetchSubmissions();
                },
              },
            ]);
          } catch (error: any) {
            console.error('Error submitting assignment:', error);
            Alert.alert('Error', error.message || 'Failed to submit assignment');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const isAssignmentDue = (dueDate: string) => {
    return new Date() > new Date(dueDate);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const renderAssignmentCard = ({ item }: { item: Assignment }) => (
    <TouchableOpacity
      style={[styles.card, isAssignmentDue(item.dueDate) && styles.overDueCard]}
      onPress={() => {
        setSelectedAssignment(item);
        setShowSubmissionDetails(true);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <MaterialCommunityIcons name="file-document" size={24} color="#1B72B5" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.classId}>{item.classId}</Text>
          </View>
        </View>
        {isAssignmentDue(item.dueDate) && (
          <View style={styles.overDueBadge}>
            <Text style={styles.overDueText}>OVERDUE</Text>
          </View>
        )}
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="calendar" size={14} color="#666" />
          <Text style={styles.metaText}>
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        </View>
        {!isAssignmentDue(item.dueDate) && (
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock" size={14} color="#4CAF50" />
            <Text style={styles.metaText}>{getDaysUntilDue(item.dueDate)} days left</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => handleSubmitAssignment(item)}
      >
        <MaterialCommunityIcons name="upload" size={16} color="#fff" />
        <Text style={styles.submitButtonText}>Submit Assignment</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSubmissionCard = ({ item }: { item: Submission }) => (
    <View style={styles.card}>
      <View style={styles.submissionHeader}>
        <View>
          <Text style={styles.title}>{item.assignmentId.title}</Text>
          <Text style={styles.classId}>{item.assignmentId.classId}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'graded' ? styles.gradedBadge : styles.submittedBadge,
          ]}
        >
          <MaterialCommunityIcons
            name={item.status === 'graded' ? 'check-circle' : 'clock-outline'}
            size={16}
            color="#fff"
          />
          <Text style={styles.statusText}>{item.status === 'graded' ? 'Graded' : 'Submitted'}</Text>
        </View>
      </View>

      <View style={styles.submissionMeta}>
        <Text style={styles.metaText}>📄 {item.fileName}</Text>
        <Text style={styles.metaText}>
          🕐 {new Date(item.submittedAt).toLocaleString()}
        </Text>
        {item.isLate && <Text style={styles.lateText}>⚠️ Late Submission</Text>}
      </View>

      {item.status === 'graded' && (
        <View style={styles.gradeContainer}>
          <View style={styles.gradeBox}>
            <Text style={styles.gradeLabel}>Grade</Text>
            <Text style={styles.gradeValue}>
              {item.grade}/{item.assignmentId.maxGrade}
            </Text>
          </View>
          {item.feedback && (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackTitle}>Feedback</Text>
              <Text style={styles.feedbackText} numberOfLines={3}>
                {item.feedback}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderGradeCard = ({ item }: { item: Submission }) => (
    <View style={styles.card}>
      <View style={styles.gradeCardHeader}>
        <View>
          <Text style={styles.title}>{item.assignmentId.title}</Text>
          <Text style={styles.classId}>{item.assignmentId.classId}</Text>
        </View>
      </View>

      <View style={styles.largeGradeBox}>
        <Text style={styles.largeGradeValue}>
          {item.grade}/{item.assignmentId.maxGrade}
        </Text>
        <Text style={styles.gradePercentage}>
          {((item.grade / item.assignmentId.maxGrade) * 100).toFixed(0)}%
        </Text>
      </View>

      {item.feedback && (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackTitle}>Feedback from Lecturer</Text>
          <Text style={styles.feedbackText}>{item.feedback}</Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Assignments</Text>
          <Text style={styles.headerSubtitle}>Submit work and view grades</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {(['available', 'submissions', 'grades'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#1B72B5" />
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <MaterialCommunityIcons name="alert-circle" size={60} color="#d32f2f" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : activeTab === 'available' ? (
          <FlatList
            data={assignments}
            keyExtractor={(item) => item._id}
            renderItem={renderAssignmentCard}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="inbox" size={60} color="#bbb" />
                <Text style={styles.emptyText}>No assignments available</Text>
              </View>
            }
          />
        ) : activeTab === 'submissions' ? (
          <FlatList
            data={submissions}
            keyExtractor={(item) => item._id}
            renderItem={renderSubmissionCard}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="inbox" size={60} color="#bbb" />
                <Text style={styles.emptyText}>No submissions yet</Text>
              </View>
            }
          />
        ) : (
          <ScrollView contentContainerStyle={styles.listContent}>
            {grades?.statistics && (
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{grades.statistics.averageGrade}</Text>
                  <Text style={styles.statLabel}>Average</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{grades.statistics.highestGrade}</Text>
                  <Text style={styles.statLabel}>Highest</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{grades.statistics.lowestGrade}</Text>
                  <Text style={styles.statLabel}>Lowest</Text>
                </View>
              </View>
            )}
            <FlatList
              data={grades?.submissions || []}
              keyExtractor={(item) => item._id}
              renderItem={renderGradeCard}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="inbox" size={60} color="#bbb" />
                  <Text style={styles.emptyText}>No grades yet</Text>
                </View>
              }
            />
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1B72B5',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1B72B5',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#1B72B5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    marginTop: 12,
  },
  listContent: {
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  overDueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF5252',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  classId: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  overDueBadge: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  overDueText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  gradedBadge: {
    backgroundColor: '#4CAF50',
  },
  submittedBadge: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  submissionMeta: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lateText: {
    fontSize: 12,
    color: '#FF5252',
    fontWeight: '600',
    marginTop: 6,
  },
  gradeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  gradeBox: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  gradeLabel: {
    fontSize: 11,
    color: '#2E7D32',
  },
  gradeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 4,
  },
  feedbackBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  feedbackTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  gradeCardHeader: {
    marginBottom: 12,
  },
  largeGradeBox: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  largeGradeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  gradePercentage: {
    fontSize: 16,
    color: '#558B2F',
    marginTop: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  statLabel: {
    fontSize: 11,
    color: '#0D47A1',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
});