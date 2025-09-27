import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupForm() {
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
    ,
  ]);

  // Date picker
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDob(selectedDate);
  };

  // Handle form submit
  const handleSubmit = () => {
    const formData = {
      fullName,
      email,
      password,
      confirmPassword,
      studentID,
      department,
      yearOfStudy,
      phoneNumber,
      address,
      campus: campusValue,
      gender: genderValue,
      dateOfBirth: dob.toDateString(),
    };
    console.log("Form Submitted:", formData);
    // send formData to backend here
  };

  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1B72B5" }} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView  style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        style={styles.container}
        nestedScrollEnabled={true} // ✅ Fixes nested VirtualizedLists warning
      >
        <Text style={styles.title}>Student Signup Form</Text>

        {/* Full Name */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirm Password */}
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Student ID */}
        <TextInput
          style={styles.input}
          placeholder="Student ID"
          value={studentID}
          onChangeText={setStudentID}
        />

        {/* Department */}
        <TextInput
          style={styles.input}
          placeholder="Department"
          value={department}
          onChangeText={setDepartment}
        />

        {/* Year of Study */}
        <TextInput
          style={styles.input}
          placeholder="Year of Study"
          keyboardType="numeric"
          value={yearOfStudy}
          onChangeText={setYearOfStudy}
        />

        {/* Phone Number */}
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        {/* Address */}
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />

        {/* Campus Dropdown */}
        <Text style={styles.label}>Campus</Text>
        <DropDownPicker
          open={campusOpen}
          value={campusValue}
          items={campusItems}
          setOpen={setCampusOpen}
          setValue={setCampusValue}
          setItems={setCampusItems}
          placeholder="Select Campus"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={2000}
          zIndexInverse={1000}
        />

        {/* Gender Dropdown */}
        <Text style={styles.label}>Gender</Text>
        <DropDownPicker
          open={genderOpen}
          value={genderValue}
          items={genderItems}
          setOpen={setGenderOpen}
          setValue={setGenderValue}
          setItems={setGenderItems}
          placeholder="Choose Gender"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
          zIndexInverse={2000}
        />

        {/* Date of Birth */}
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

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: 'white' 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "white",
  },
  label: { fontSize: 16, marginBottom: 8, fontWeight: "600", color: 'white' },
  dropdown: { marginBottom: 15, borderColor: "#ccc" },
  dropdownContainer: { borderColor: "#ccc" },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "white",
  },
  dateText: { fontSize: 16 },
  submitBtn: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 16, borderRadius: 100,},
});
