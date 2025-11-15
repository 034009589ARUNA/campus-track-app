// screens/Lecturer/LecturerAssignmentScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import CreateAssignmentModal from '../../../components/CreateAssignmentModal';

type Props = NativeStackScreenProps<any, 'Assignment'>;

interface Assignment {
  _id: string;
  title: string;
  classId: string;
  dueDate: string;
  description: string;
  maxGrade: number;
}

interface Submission {
  _id: string;
  studentId: {
    _id: string;
    fullName: string;
    email: string;
    studentID: string;
  };
  fileName: string;
  submittedAt: string;
  status: 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
  isLate: boolean;
}

const getBackendUrl = () => {
  const BACKEND_IP = '192.168.0.200';
  return `http://${BACKEND_IP}:5000`;
};

export default function LecturerAssignmentScreen({ navigation }: Props) {
  const { user } = useAuth();
  const userId = user?.id;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [grading, setGrading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!userId) {
        setError('User ID not available');
        return;
      }

      const backendUrl = getBackendUrl();
      const response = await axios.get(
        `${backendUrl}/api/assignments/lecturer/${userId}`,
        { timeout: 10000 }
      );

      if (response.data.success) {
        setAssignments(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useFocusEffect(
    useCallback(() => {
      fetchAssignments();
    }, [fetchAssignments])
  );

  const fetchSubmissions = async (assignmentId: string) => {
    try {
      setLoading(true);
      const backendUrl = getBackendUrl();
      const response = await axios.get(
        `${backendUrl}/api/assignments/${assignmentId}/submissions`,
        { timeout: 10000 }
      );

      if (response.data.success) {
        setSubmissions(response.data.data || []);
        fetchStats(assignmentId);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      Alert.alert('Error', 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (assignmentId: string) => {
    try {
      const backendUrl = getBackendUrl();
      const response = await axios.get(
        `${backendUrl}/api/assignments/${assignmentId}/stats`,
        { timeout: 10000 }
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !grade.trim()) {
      Alert.alert('Error', 'Please enter a grade');
      return;
    }

    const gradeValue = parseFloat(grade);
    const maxGrade = selectedAssignment?.maxGrade || 100;

    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > maxGrade) {
      Alert.alert('Error', `Grade must be between 0 and ${maxGrade}`);
      return;
    }

    try {
      setGrading(true);
      const backendUrl = getBackendUrl();
      const response = await axios.put(
        `${backendUrl}/api/assignments/submission/${selectedSubmission._id}/grade`,
        {
          grade: gradeValue,
          feedback: feedback.trim(),
          maxGrade,
        },
        { timeout: 10000 }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Grade submitted successfully');
        setGrade('');
        setFeedback('');
        setShowGradeModal(false);
        if (selectedAssignment) {
          fetchSubmissions(selectedAssignment._id);
        }
      }
    } catch (err) {
      console.error('Error grading submission:', err);
      Alert.alert('Error', 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const handleAssignmentCreated = () => {
    fetchAssignments();
  };

  const openGradeModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || '');
    setFeedback(submission.feedback || '');
    setShowGradeModal(true);
  };

  const renderAssignmentCard = ({ item }: { item: Assignment }) => (
    <TouchableOpacity
      style={styles.assignmentCard}
      onPress={() => {
        setSelectedAssignment(item);
        fetchSubmissions(item._id);
        setShowSubmissions(true);
      }}
    >
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="file-document" size={32} color="#1B72B5" />
        <View style={styles.cardInfo}>
          <Text style={styles.assignmentTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.assignmentClass}>{item.classId}</Text>
        </View>
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="calendar" size={14} color="#666" />
          <Text style={styles.metaText}>
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="star" size={14} color="#FFC107" />
          <Text style={styles.metaText}>Max: {item.maxGrade}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Submissions →</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSubmissionItem = ({ item }: { item: Submission }) => (
    <View style={styles.submissionCard}>
      <View style={styles.submissionHeader}>
        <View style={styles.studentInfo}>
          <MaterialCommunityIcons name="account-circle" size={40} color="#1B72B5" />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{item.studentId.fullName}</Text>
            <Text style={styles.studentId}>{item.studentId.studentID}</Text>
          </View>
        </View>

        <View style={styles.statusBadge}>
          {item.status === 'graded' ? (
            <View style={[styles.badge, styles.gradedBadge]}>
              <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
              <Text style={styles.badgeText}>Graded</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.pendingBadge]}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#FF9800" />
              <Text style={styles.badgeText}>Pending</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.submissionMeta}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Submitted:</Text>
          <Text style={styles.metaValue}>
            {new Date(item.submittedAt).toLocaleString()}
          </Text>
        </View>

        {item.isLate && (
          <View style={[styles.metaRow, styles.lateRow]}>
            <MaterialCommunityIcons name="alert" size={16} color="#FF5252" />
            <Text style={styles.lateText}>Late Submission</Text>
          </View>
        )}

        {item.status === 'graded' && item.grade !== undefined && (
          <View style={styles.gradeDisplay}>
            <Text style={styles.gradeLabel}>Grade:</Text>
            <Text style={styles.gradeValue}>{item.grade}</Text>
          </View>
        )}

        {item.feedback && (
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackLabel}>Feedback:</Text>
            <Text style={styles.feedbackText}>{item.feedback}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.gradeButton}
        onPress={() => openGradeModal(item)}
      >
        {item.status === 'graded' ? (
          <>
            <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
            <Text style={styles.gradeButtonText}>Edit Grade</Text>
          </>
        ) : (
          <>
            <MaterialCommunityIcons name="star" size={16} color="#fff" />
            <Text style={styles.gradeButtonText}>Grade Now</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (!showSubmissions) {
    return (
      <>
        <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
        <SafeAreaView style={styles.container} edges={['top']}>
          {/* Header with Create Button */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>My Assignments</Text>
              <Text style={styles.headerSubtitle}>Manage and grade submissions</Text>
            </View>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateModal(true)}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#1B72B5" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={60} color="#d32f2f" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchAssignments}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : assignments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="file-outline" size={80} color="#bbb" />
              <Text style={styles.emptyText}>No assignments yet</Text>
              <Text style={styles.emptySubtext}>Create your first assignment</Text>
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={() => setShowCreateModal(true)}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                <Text style={styles.createFirstButtonText}>Create Assignment</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={assignments}
              keyExtractor={(item) => item._id}
              renderItem={renderAssignmentCard}
              contentContainerStyle={styles.listContent}
            />
          )}

          {/* Create Assignment Modal */}
          <CreateAssignmentModal
            visible={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleAssignmentCreated}
            lecturerId={userId || ''}
          />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowSubmissions(false)}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{selectedAssignment?.title}</Text>
            <Text style={styles.headerSubtitle}>Student Submissions</Text>
          </View>
        </View>

        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalSubmissions}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.gradedSubmissions}</Text>
              <Text style={styles.statLabel}>Graded</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.pendingSubmissions}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.averageGrade}</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
          </View>
        )}

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#1B72B5" />
          </View>
        ) : submissions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="inbox" size={80} color="#bbb" />
            <Text style={styles.emptyText}>No submissions yet</Text>
          </View>
        ) : (
          <FlatList
            data={submissions}
            keyExtractor={(item) => item._id}
            renderItem={renderSubmissionItem}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Grade Modal */}
        <Modal visible={showGradeModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Grade Submission</Text>
                <TouchableOpacity onPress={() => setShowGradeModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {selectedSubmission && (
                  <>
                    <View style={styles.studentCard}>
                      <Text style={styles.studentCardTitle}>
                        {selectedSubmission.studentId.fullName}
                      </Text>
                      <Text style={styles.studentCardId}>
                        ID: {selectedSubmission.studentId.studentID}
                      </Text>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Grade (0-{selectedAssignment?.maxGrade})</Text>
                      <TextInput
                        style={styles.gradeInput}
                        placeholder="Enter grade"
                        value={grade}
                        onChangeText={setGrade}
                        keyboardType="decimal-pad"
                        maxLength={5}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Feedback (Optional)</Text>
                      <TextInput
                        style={[styles.feedbackInput, styles.textArea]}
                        placeholder="Enter feedback for the student"
                        value={feedback}
                        onChangeText={setFeedback}
                        multiline
                        numberOfLines={6}
                        maxLength={500}
                        textAlignVertical="top"
                      />
                      <Text style={styles.charCount}>{feedback.length}/500</Text>
                    </View>
                  </>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowGradeModal(false)}
                  disabled={grading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.submitButton, grading && styles.submitButtonDisabled]}
                  onPress={handleGradeSubmission}
                  disabled={grading}
                >
                  {grading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Grade</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1B72B5',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1B72B5',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
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
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 6,
    marginBottom: 24,
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 12,
  },
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  assignmentClass: {
    fontSize: 12,
    color: '#999',
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
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
  viewButton: {
    backgroundColor: '#1B72B5',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B72B5',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  submissionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentDetails: {
    marginLeft: 12,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  studentId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  gradedBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  submissionMeta: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
  },
  metaValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  lateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lateText: {
    fontSize: 12,
    color: '#FF5252',
    fontWeight: '600',
  },
  gradeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  gradeLabel: {
    fontSize: 12,
    color: '#666',
  },
  gradeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  feedbackSection: {
    marginTop: 8,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  gradeButton: {
    backgroundColor: '#1B72B5',
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  gradeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  studentCard: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  studentCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
  },
  studentCardId: {
    fontSize: 12,
    color: '#0D47A1',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  gradeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 120,
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    textAlign: 'right',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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
  submitButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});