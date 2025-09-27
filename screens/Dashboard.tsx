import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DashboardCard from "../components/DashboardCard";
export default function Dashboard() {
  const navigation = useNavigation();

  const [attendance, setAttendance] = useState("Not marked yet");
  const [assignment, setAssignment] = useState("You have a pending assignment");
  const [messages, setMessages] = useState("Code has been sent");
  const [subjects, setSubjects] = useState(5); // Example number

  return (
    <><StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1B72B5" }} edges={['top', 'left', 'right']}>
      <SafeAreaProvider>
      {/* Header with logo and profile */}
      <View style={styles.header}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        <Image source={require("../assets/images/profile.png")} style={styles.profile} />
      </View>

      {/* Dashboard cards */}
      <View style={styles.cardsRow}>
        <DashboardCard
          title="Attendance"
          message={attendance}
          icon="calendar-check"
          backgroundColor="#00284B"
          textColor="#fff"
          onPress={() => {
            setAttendance("Present ✅");
            navigation.navigate("Attendance");
          } } />
        <DashboardCard
          title="Assignment"
          message={assignment}
          icon="book-open-page-variant"
          backgroundColor="#00284B"
          textColor="#fff"
          onPress={() => navigation.navigate("Assignment")} />
      </View>

      <View style={styles.cardsRow}>
        <DashboardCard
          title="Messages"
          message={messages}
          icon="message-text"
          backgroundColor="#00284B"
          textColor="#fff"
          onPress={() => setMessages("Code received ✔")} />
        <DashboardCard
          title="Subjects Enrolled"
          message={`${subjects} subjects`}
          icon="school"
          backgroundColor="#00284B"
          textColor="#fff"
          onPress={() => navigation.navigate("Settings")} />
      </View>
      </SafeAreaProvider>
    </SafeAreaView></>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 70,
    resizeMode: "contain",
  },
  profile: {
    width: 70,
    height: 70,
    borderRadius: 25, // circular
    resizeMode: "cover",
    marginRight: 15,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
