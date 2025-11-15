// components/CreateAssignmentModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CreateAssignmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lecturerId: string;
}

export default function CreateAssignmentModal({
  visible,
  onClose,
  onSuccess,
  lecturerId,
}: CreateAssignmentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [maxGrade, setMaxGrade] = useState('100');

  // Date + Time pickers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setClassId('');
    setDueDate(new Date());
    setMaxGrade('100');
  };

  const handleCreateAssignment = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter assignment title');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter assignment description');
      return;
    }
    if (!classId.trim()) {
      Alert.alert('Error', 'Please enter class ID');
      return;
    }

    const maxGradeValue = parseFloat(maxGrade);
    if (isNaN(maxGradeValue) || maxGradeValue <= 0) {
      Alert.alert('Error', 'Please enter a valid maximum grade');
      return;
    }

    // warn if due date is in the past
    if (dueDate < new Date()) {
      Alert.alert(
        'Warning',
        'Due date is in the past. Are you sure you want to continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => submitAssignment() },
        ]
      );
      return;
    }

    await submitAssignment();
  };

  const submitAssignment = async () => {
    try {
      setCreating(true);

      const BACKEND_IP = '192.168.0.200';
      const backendUrl = `http://${BACKEND_IP}:5000`;

      const response = await fetch(`${backendUrl}/api/assignments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          classId: classId.trim(),
          lecturerId,
          dueDate: dueDate.toISOString(),
          maxGrade: parseFloat(maxGrade),
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Assignment created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              onSuccess();
              onClose();
            },
          },
        ]);
      } else {
        Alert.alert('Error', data.error || 'Failed to create assignment');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      Alert.alert('Error', 'Failed to create assignment. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* HEADER */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Assignment</Text>
            <TouchableOpacity onPress={onClose} disabled={creating}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* BODY */}
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Assignment Title <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Data Structures Assignment 1"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
                editable={!creating}
              />
            </View>

            {/* Class ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Class ID <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., CS101, MATH201"
                value={classId}
                onChangeText={setClassId}
                autoCapitalize="characters"
                maxLength={20}
                editable={!creating}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Description <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write detailed instructions for the assignment..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                maxLength={1000}
                textAlignVertical="top"
                editable={!creating}
              />
              <Text style={styles.charCount}>{description.length}/1000</Text>
            </View>

            {/* Due Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Due Date <Text style={styles.required}>*</Text>
              </Text>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                disabled={creating}
              >
                <MaterialCommunityIcons name="calendar" size={20} color="#1B72B5" />
                <Text style={styles.dateText}>
                  {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>

              {/* DATE PICKER */}
              {showDatePicker && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setDueDate(selectedDate);
                      setShowTimePicker(true); // then open time picker
                    }
                  }}
                />
              )}

              {/* TIME PICKER */}
              {showTimePicker && (
                <DateTimePicker
                  value={dueDate}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) {
                      setDueDate(prev => {
                        const updated = new Date(prev);
                        updated.setHours(selectedTime.getHours());
                        updated.setMinutes(selectedTime.getMinutes());
                        return updated;
                      });
                    }
                  }}
                />
              )}
            </View>

            {/* Max Grade */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Maximum Grade <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 100"
                value={maxGrade}
                onChangeText={setMaxGrade}
                keyboardType="decimal-pad"
                maxLength={5}
                editable={!creating}
              />
            </View>

            {/* Info box */}
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="information" size={20} color="#1B72B5" />
              <Text style={styles.infoText}>
                Once created, this assignment will be visible to all students in the specified class.
              </Text>
            </View>
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={creating}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.createButton, creating && styles.createButtonDisabled]}
              onPress={handleCreateAssignment}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                  <Text style={styles.createButtonText}>Create Assignment</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF5252',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1565C0',
    lineHeight: 18,
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
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
