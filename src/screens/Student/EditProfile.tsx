import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EditProfile = ({ navigation }) => {
  // Profile info state
  const [profileImage, setProfileImage] = useState(
    'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  );
  const [fullName, setFullName] = useState('Aruna Kallon');
  const [email, setEmail] = useState('aruna.kallon@student.edu');
  const [phoneNumber, setPhoneNumber] = useState('+232 76 XX XX XX');
  const [department, setDepartment] = useState('Computer Science');
  const [yearOfStudy, setYearOfStudy] = useState('1');
  const [bio, setBio] = useState('Passionate about learning and technology');
  const [studentID, setStudentID] = useState('CS2024001');
  const [campus, setCampus] = useState('Fourah Bay College');
  const [isSaving, setIsSaving] = useState(false);
//Aruna Kallon coding
  // Handle saving profile
  const handleSaveProfile = () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Full Name and Email are required');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack?.();
    }, 1500);
  };

  // Handle changing photo
  const handleChangePhoto = async () => {
    const result = await new Promise((resolve) => {
      Alert.alert(
        'Change Photo',
        'How would you like to change your profile picture?',
        [
          { text: 'Take Photo', onPress: () => resolve('camera') },
          { text: 'Choose from Gallery', onPress: () => resolve('gallery') },
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
        ]
      );
    });

    if (!result) return;

    // Request permissions
    let permissionResult;
    if (result === 'camera') {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.status !== 'granted') {
      Alert.alert('Permission Required', 'Permission is required to access this feature.');
      return;
    }

    // Launch camera or gallery
    let pickerResult;
    if (result === 'camera') {
      pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
    } else {
      pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
    }

    if (!pickerResult.cancelled) {
      setProfileImage(pickerResult.uri);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack?.()}
            >
              <Icon name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Profile Photo Section */}
            <View style={styles.photoSection}>
              <View style={styles.photoContainer}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                <TouchableOpacity
                  style={styles.photoChangeButton}
                  onPress={handleChangePhoto}
                >
                  <Icon name="camera-plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.photoChangeText}>Tap to change photo</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter full name"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell us about yourself"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  value={bio}
                  onChangeText={setBio}
                />
              </View>

              {/* Academic Info */}
              <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
                Academic Information
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Student ID</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={studentID}
                  editable={false}
                />
                <Text style={styles.disabledText}>Cannot be changed</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Department</Text>
                <TextInput
                  style={styles.input}
                  value={department}
                  onChangeText={setDepartment}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Year of Study</Text>
                <View style={styles.yearButtons}>
                  {['1', '2', '3', '4', '5'].map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.yearButton,
                        yearOfStudy === year && styles.yearButtonActive,
                      ]}
                      onPress={() => setYearOfStudy(year)}
                    >
                      <Text
                        style={[
                          styles.yearButtonText,
                          yearOfStudy === year && styles.yearButtonTextActive,
                        ]}
                      >
                        Year {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Campus</Text>
                <TextInput
                  style={styles.input}
                  value={campus}
                  onChangeText={setCampus}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={handleSaveProfile}
                disabled={isSaving}
                activeOpacity={0.8}
              >
                <Icon
                  name={isSaving ? 'loading' : 'check-circle'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack?.()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditProfile;

// Styles (same as your previous version)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1B72B5' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    minHeight: '100%',
  },
  photoSection: { alignItems: 'center', marginBottom: 35 },
  photoContainer: { position: 'relative', marginBottom: 12 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#1B72B5' },
  photoChangeButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1B72B5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  photoChangeText: { fontSize: 13, color: '#1B72B5', fontWeight: '500' },
  formSection: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 20, marginTop: 10 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#F8F9FA', color: '#333' },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 12 },
  disabledInput: { backgroundColor: '#F0F0F0', color: '#999' },
  disabledText: { fontSize: 12, color: '#999', marginTop: 4, fontStyle: 'italic' },
  yearButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  yearButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center' },
  yearButtonActive: { backgroundColor: '#1B72B5', borderColor: '#1B72B5' },
  yearButtonText: { fontSize: 13, fontWeight: '600', color: '#666' },
  yearButtonTextActive: { color: '#FFFFFF' },
  saveButton: {
    backgroundColor: '#1B72B5',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 12,
    shadowColor: '#1B72B5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginLeft: 10 },
  cancelButton: { borderWidth: 2, borderColor: '#1B72B5', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  cancelButtonText: { color: '#1B72B5', fontSize: 16, fontWeight: '600' },
});
