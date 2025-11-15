import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import api from '../../services/api'; // Adjust the path if needed
//import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  StudentRoot: undefined;
  Login: undefined;
};

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [studentID, setStudentID] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Gender dropdown
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]);

  // Campus dropdown
  const [campusOpen, setCampusOpen] = useState(false);
  const [campusValue, setCampusValue] = useState(null);
  const [campusItems, setCampusItems] = useState([
    { label: "Fourah Bay College", value: "FBC" },
    { label: "IPAM", value: "IPAM" },
    { label: "COMAHS", value: "COMAHS" },
  ]);

  // Date picker
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDob(selectedDate);
  };

 // Dropdown for studens and lecturers
 const [userTypeOpen, setUserTypeOpen] = useState(false);
const [userTypeValue, setUserTypeValue] = useState(null);
const [userTypeItems, setUserTypeItems] = useState([
  { label: "Student", value: "student" },
  { label: "Lecturer", value: "lecturer" },
]);


  // Handle form submit
const handleSubmit = async () => {
  const formData = {
    fullName,
    email,
    password,
    confirmPassword,
    studentID,       // optional if lecturer
    employeeID: "",  // optional if student
    department,
    yearOfStudy,     // optional if lecturer
    campus: campusValue,
    phoneNumber,
    address,
    gender: genderValue,
    dateOfBirth: dob.toDateString(),
    userType: userTypeValue, // must come from your dropdown
  };

  console.log("Submitting:", formData);

  try {
    const response = await axios.post(
      "http://192.168.0.200:5000/api/auth/signup",
      formData
    );

    if (response.data.success) {
      console.log("Signup successful:", response.data);
      // maybe navigate to login or home screen
      Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => {
            // Navigate to login or home screen
            navigation.navigate('StudentRoot');
          }},
        ]);
    } else {
      console.log("Signup error:", response.data);
      alert(response.data.message);
    }
  } catch (error) {
    console.log("API Error:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Signup failed");
  }
};

  const handleSignIn = () => {
    navigation.navigate("Login");
  }


  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Student Registration</Text>
            <Text style={styles.subtitle}>Create your account</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="example@student.edu"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

             {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Create a password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>{showPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>{showConfirmPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
            </View>
            </View>

            {/* Student ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Student ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your student ID"
                placeholderTextColor="#999"
                value={studentID}
                onChangeText={setStudentID}
              />
            </View>

            {/* Department */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Department</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Computer Science"
                placeholderTextColor="#999"
                value={department}
                onChangeText={setDepartment}
              />
            </View>

            {/* Year of Study */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Year of Study</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 1, 2, 3, 4"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={yearOfStudy}
                onChangeText={setYearOfStudy}
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+232 XX XXX XXXX"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your address"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* Campus Dropdown */}
            <View style={[styles.inputGroup, { zIndex: 2000 }]}>
              <Text style={styles.label}>Campus</Text>
              <DropDownPicker
                open={campusOpen}
                value={campusValue}
                items={campusItems}
                setOpen={setCampusOpen}
                setValue={setCampusValue}
                setItems={setCampusItems}
                placeholder="Select your campus"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                placeholderStyle={styles.dropdownPlaceholder}
                zIndex={2000}
                zIndexInverse={1000}
              />
            </View>

            {/* Gender Dropdown */}
            <View style={[styles.inputGroup, { zIndex: 1000 }]}>
              <Text style={styles.label}>Gender</Text>
              <DropDownPicker
                open={genderOpen}
                value={genderValue}
                items={genderItems}
                setOpen={setGenderOpen}
                setValue={setGenderValue}
                setItems={setGenderItems}
                placeholder="Select your gender"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                placeholderStyle={styles.dropdownPlaceholder}
                zIndex={1000}
                zIndexInverse={2000}
              />
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{dob.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dob}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            {/* User Type Dropdown */}
            <View style={[styles.inputGroup, { zIndex: 3000 }]}>
  <Text style={styles.label}>User Type</Text>
  <DropDownPicker
    open={userTypeOpen}
    value={userTypeValue}
    items={userTypeItems}
    setOpen={setUserTypeOpen}
    setValue={setUserTypeValue}
    setItems={setUserTypeItems}
    placeholder="Select user type"
    style={styles.dropdown}
    dropDownContainerStyle={styles.dropdownContainer}
    textStyle={styles.dropdownText}
    placeholderStyle={styles.dropdownPlaceholder}
    zIndex={3000}
    zIndexInverse={1000}
  />
</View>


            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <TouchableOpacity onPress={handleSignIn}>
                    <Text style={styles.footerLink}>Sign In</Text>
                  </TouchableOpacity>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1B72B5",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  formContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    minHeight: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#F8F9FA",
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  dropdown: {
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    minHeight: 50,
  },
  dropdownContainer: {
    borderColor: "#E0E0E0",
    borderRadius: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownPlaceholder: {
    color: "#999",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#F8F9FA",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  submitBtn: {
    backgroundColor: "#1B72B5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1B72B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  footerLink: {
    color: "#1B72B5",
    fontWeight: "600",
  },
   eyeButton: {
    padding: 8,
  },
  eyeText: {
    fontSize: 12,
    color: "#1B72B5",
    fontWeight: "600",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    paddingRight: 10,
  },
   passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: "#333",
  }
});