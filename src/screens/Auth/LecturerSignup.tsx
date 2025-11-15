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
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import api from '../../services/api';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Login: undefined;
};

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  employeeID: string;
  department: string;
  campus: string;
  phoneNumber: string;
  address: string;
  gender: string | null;
  dateOfBirth: string;
  userType: string;
}

interface DropdownItem {
  label: string;
  value: string;
}

export default function LecturerSignUpScreen() {
  const navigation = useNavigation();
  // Form states
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [employeeID, setEmployeeID] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Gender dropdown
  const [genderOpen, setGenderOpen] = useState<boolean>(false);
  const [genderValue, setGenderValue] = useState<string | null>(null);
  const [genderItems, setGenderItems] = useState<DropdownItem[]>([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]);

  // Campus dropdown
  const [campusOpen, setCampusOpen] = useState<boolean>(false);
  const [campusValue, setCampusValue] = useState<string | null>(null);
  const [campusItems, setCampusItems] = useState<DropdownItem[]>([
    { label: "Fourah Bay College", value: "FBC" },
    { label: "IPAM", value: "IPAM" },
    { label: "COMAHS", value: "COMAHS" },
  ]);

  // Department dropdown
  const [departmentOpen, setDepartmentOpen] = useState<boolean>(false);
  const [departmentValue, setDepartmentValue] = useState<string | null>(null);
  const [departmentItems, setDepartmentItems] = useState<DropdownItem[]>([
    { label: "Computer Science", value: "computer_science" },
    { label: "Mathematics", value: "mathematics" },
    { label: "Physics", value: "physics" },
    { label: "Chemistry", value: "chemistry" },
    { label: "Biology", value: "biology" },
    { label: "Engineering", value: "engineering" },
    { label: "Business", value: "business" },
    { label: "Psychology", value: "psychology" },
    { label: "Languages", value: "languages" },
    { label: "History", value: "history" },
  ]);

  // Date picker
  const [dob, setDob] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Full name is required");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Error", "Valid email is required");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    if (!employeeID.trim()) {
      Alert.alert("Error", "Employee ID is required");
      return false;
    }
    if (!departmentValue) {
      Alert.alert("Error", "Department is required");
      return false;
    }
    if (!campusValue) {
      Alert.alert("Error", "Campus is required");
      return false;
    }
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Address is required");
      return false;
    }
    if (!genderValue) {
      Alert.alert("Error", "Gender is required");
      return false;
    }
    return true;
  };

  // Handle form submit
  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    const formData: FormData = {
      fullName,
      email,
      password,
      confirmPassword,
      employeeID,
      department: departmentValue || "",
      campus: campusValue || "",
      phoneNumber,
      address,
      gender: genderValue,
      dateOfBirth: dob.toDateString(),
      userType: "lecturer",
    };

    console.log("Submitting:", formData);

    try {
      const response = await axios.post(
        "http://192.168.0.200:5000/api/auth/signup",
        formData
      );

      if (response.data.success) {
        console.log("Signup successful:", response.data);
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => {
            // Navigate to login or home screen
            navigation.navigate('Login');
          }},
        ]);
        // Reset form
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setEmployeeID("");
        setDepartmentValue(null);
        setCampusValue(null);
        setPhoneNumber("");
        setAddress("");
        setGenderValue(null);
        setDob(new Date());
      } else {
        Alert.alert("Error", response.data.message || "Signup failed");
      }
    } catch (error: any) {
      console.log("API Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

const handleSignIn = () => {
    navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
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
            <Text style={styles.title}>Lecturer Registration</Text>
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
                placeholder="example@university.edu"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Employee ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Employee ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your employee ID"
                placeholderTextColor="#999"
                value={employeeID}
                onChangeText={setEmployeeID}
              />
            </View>

            {/* Department Dropdown */}
            <View style={[styles.inputGroup, { zIndex: 5000 }]}>
              <Text style={styles.label}>Department</Text>
              <DropDownPicker
                open={departmentOpen}
                value={departmentValue}
                items={departmentItems}
                setOpen={setDepartmentOpen}
                setValue={setDepartmentValue}
                setItems={setDepartmentItems}
                placeholder="Select your department"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                placeholderStyle={styles.dropdownPlaceholder}
                zIndex={5000}
                zIndexInverse={1000}
              />
            </View>

            {/* Campus Dropdown */}
            <View style={[styles.inputGroup, { zIndex: 4000 }]}>
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
                zIndex={4000}
                zIndexInverse={1000}
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

            {/* Gender Dropdown */}
            <View style={[styles.inputGroup, { zIndex: 3000 }]}>
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
                zIndex={3000}
                zIndexInverse={1000}
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
  },
  eyeButton: {
    padding: 8,
  },
  eyeText: {
    fontSize: 12,
    color: "#1B72B5",
    fontWeight: "600",
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
});