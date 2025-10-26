import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationPermission from '../../../components/LocationPermission';

const Attendance = () => {
  return (
    <>
      <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Attendance Verification</Text>
            <Text style={styles.headerSubtitle}>Mark your presence for today's class</Text>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <View style={styles.instructionCard}>
              <Text style={styles.instructionText}>
                To mark yourself present, enter the code provided by the lecturer
              </Text>
            </View>

            {/* Code Input Section */}
            <View style={styles.codeSection}>
              <Text style={styles.label}>Attendance Code</Text>
              <TextInput 
                style={styles.input}
                placeholder="Enter code here" 
                placeholderTextColor="#999"
                autoCapitalize="characters"
                maxLength={6}
              />
            </View>

            {/* Location Verification Section */}
            <View style={styles.locationSection}>
              <View style={styles.locationHeader}>
                <Text style={styles.sectionTitle}>Location Verification</Text>
                <Text style={styles.locationDescription}>
                  To ensure you are in class, please verify your location
                </Text>
              </View>
              
              <LocationPermission />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1B72B5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    minHeight: "100%",
  },
  instructionCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#1B72B5",
  },
  instructionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  codeSection: {
    marginBottom: 30,
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
    fontSize: 18,
    backgroundColor: "#F8F9FA",
    color: "#333",
    textAlign: "center",
    letterSpacing: 4,
    fontWeight: "600",
  },
  locationSection: {
    marginTop: 10,
  },
  locationHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  locationDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
  },
});