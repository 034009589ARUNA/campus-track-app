import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UploadWork from '../components/UploadWork';

const Assignment = () => {
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
            <Text style={styles.headerTitle}>Assignment</Text>
            <Text style={styles.headerSubtitle}>Submit your work below</Text>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <View style={styles.assignmentInfo}>
              <Text style={styles.sectionTitle}>Submit your assignment</Text>
              
              <View style={styles.dueDateCard}>
                <View style={styles.dueDateBadge}>
                  <Text style={styles.dueDateLabel}>Due Date</Text>
                </View>
                <Text style={styles.dueDateText}>30th June 2024</Text>
              </View>
            </View>

            {/* Upload Section */}
            <View style={styles.uploadSection}>
              <UploadWork />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Assignment;

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
  assignmentInfo: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  dueDateCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#1B72B5",
  },
  dueDateBadge: {
    backgroundColor: "#1B72B5",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  dueDateLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dueDateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  uploadSection: {
    flex: 1,
    marginBottom: 200,
  },
});