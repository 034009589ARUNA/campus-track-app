import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DashboardCard from "../../../components/DashboardCard";

export default function LecturerDashboard() {
  const navigation = useNavigation();
  

  return (
    <>
      <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <SafeAreaProvider>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header with logo and profile */}
            <View style={styles.headerContainer}>
              <View style={styles.header}>
                <Image 
                  source={require("../../../assets/images/logo.png")} 
                  style={styles.logo} 
                />
                <Image 
                  source={require("../../../assets/images/profile.png")} 
                  style={styles.profile} 
                />
              </View>
              
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome, Mr Kamara!</Text>
              </View>
            </View>

            {/* Dashboard Content */}
            <View style={styles.dashboardContent}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
              
              {/* Dashboard cards */}
              <View style={styles.cardsRow}>
                <DashboardCard
                  title="Start Session"
                  icon="play-circle"
                  backgroundColor="#FFFFFF"
                  textColor="#333"
                  onPress={() => {
                    navigation.navigate("Session");
                  } } message={""}                />
                <DashboardCard
                  title="Assignment"
                  icon="book"
                  backgroundColor="#FFFFFF"
                  textColor="#333"
                  onPress={() => navigation.navigate("Assignment")} message={""}                />
              </View>
              
              <View style={styles.cardsRow}>
                <DashboardCard
                  title="Send Code"
                  icon="message-text"
                  backgroundColor="#FFFFFF"
                  textColor="#333"
                  onPress={() => navigation.navigate("Chat")} message={""}                />
                <DashboardCard
                  title="Student List"
                  icon="account-group"
                  backgroundColor="#FFFFFF"
                  textColor="#333"
                  onPress={() => navigation.navigate("Settings")} message={""}                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaProvider>
      </SafeAreaView>
    </>
  );
}

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
    paddingTop: 10,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 70,
    resizeMode: "contain",
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeSection: {
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  dashboardContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    minHeight: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});