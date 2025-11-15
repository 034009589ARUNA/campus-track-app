// components/ViewStudentsModal.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

interface Student {
  _id: string;
  fullName: string;
  email: string;
  studentID: string;
}

interface ViewStudentsModalProps {
  visible: boolean;
  chatId: string;
  className: string;
  onClose: () => void;
  onStudentRemoved: () => void;
}

const getBackendUrl = () => {
  const BACKEND_IP = '192.168.0.200';
  return `http://${BACKEND_IP}:5000`;
};

const ViewStudentsModal: React.FC<ViewStudentsModalProps> = ({
  visible,
  chatId,
  className,
  onClose,
  onStudentRemoved,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingStudentId, setRemovingStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      fetchStudents();
    }
  }, [visible, chatId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const backendUrl = getBackendUrl();
      const response = await axios.get(
        `${backendUrl}/api/chat/${chatId}/students`,
        { timeout: 10000 }
      );

      if (response.data.success) {
        // Filter out lecturer (they're also in participants)
        const studentList = response.data.data || [];
        setStudents(studentList);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = (student: Student) => {
    Alert.alert(
      'Remove Student',
      `Are you sure you want to remove ${student.fullName} from this class?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setRemovingStudentId(student._id);
              const backendUrl = getBackendUrl();
              const response = await axios.delete(
                `${backendUrl}/api/chat/${chatId}/student/${student._id}`,
                { timeout: 10000 }
              );

              if (response.data.success) {
                setStudents((prev) => prev.filter((s) => s._id !== student._id));
                Alert.alert('Success', `${student.fullName} removed from class`);
                onStudentRemoved();
              }
            } catch (err) {
              console.error('Error removing student:', err);
              Alert.alert('Error', 'Failed to remove student');
            } finally {
              setRemovingStudentId(null);
            }
          },
        },
      ]
    );
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.studentItem}>
      <View style={styles.studentInfo}>
        <MaterialCommunityIcons name="account-circle" size={40} color="#1B72B5" />
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{item.fullName}</Text>
          <Text style={styles.studentId}>{item.studentID}</Text>
          <Text style={styles.studentEmail}>{item.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveStudent(item)}
        disabled={removingStudentId === item._id}
      >
        {removingStudentId === item._id ? (
          <ActivityIndicator size="small" color="#d32f2f" />
        ) : (
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="#d32f2f" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Class Students</Text>
              <Text style={styles.className} numberOfLines={1}>
                {className}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Student Count */}
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              👥 {students.length} {students.length === 1 ? 'student' : 'students'}
            </Text>
          </View>

          {/* Students List */}
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#1B72B5" />
            </View>
          ) : students.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="account-multiple-outline" size={60} color="#bbb" />
              <Text style={styles.emptyText}>No students yet</Text>
              <Text style={styles.emptySubtext}>Students will appear here once added</Text>
            </View>
          ) : (
            <FlatList
              data={students}
              keyExtractor={(item) => item._id}
              renderItem={renderStudent}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  className: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  listContent: {
    paddingVertical: 8,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  studentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  studentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  studentId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  studentEmail: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  removeButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
});

export default ViewStudentsModal;