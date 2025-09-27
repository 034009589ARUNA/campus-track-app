// components/LoginScreen.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";


type Props = NativeStackScreenProps<RootStackParamList, "Login">;

/// remember me component
function RememberMeSwitch() {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={style4.rememberRow}>
      <Text style={style4.label}>Remember Me</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={rememberMe ? "#17ba0fff" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e" 
        value={rememberMe}
        onValueChange={() => setRememberMe(prev => !prev)}
      />
    </View>
  );
}

const style4 = StyleSheet.create({
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
   
  },
  label: {
    fontSize: 16,
    color: "white",
  },
});

// Choice component
function Choice() {
  return (
    <View style={styles2.container}>
      <Text style={styles2.leftText}>Lecturer</Text>
      <Text style={styles2.rightText}>Student</Text>
    </View>
  );
}

/// Toggle between Lecturer and Student
/// Toggle for lecturer
function Toggle() {
  const [isLeftEnabled, setIsLeftEnabled] = useState(false);
  const [isRightEnabled, setIsRightEnabled] = useState(false);

  return (
    <View style={style3.container}>
      <View style={style3.row}>
        {/* Left Switch */}
        <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isLeftEnabled ? "#00284B" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
          value={isLeftEnabled}
          onValueChange={() => setIsLeftEnabled(prev => !prev)}
        />

        {/* Right Switch */}
        <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isRightEnabled ? "#00284B" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
          value={isRightEnabled}
          onValueChange={() => setIsRightEnabled(prev => !prev)}
        />
    </View>
    </View>
  );
}

const style3 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // center vertically
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",      // horizontal row
    justifyContent: "space-between", // space switches apart
    alignItems: "center",      // align vertically
  },
});


export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    navigation.replace("Home");
  };

return (
  <>
    <StatusBar backgroundColor="#1B72B5" barStyle="light-content" /> 
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1B72B5" }} edges={['top', 'left', 'right']} >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled" 
          >
            <View style={styles.container}>
              <Image 
                source={require("../assets/images/image2.png")}
                style={{width: 180, height: 172, marginBottom: 20, alignSelf: 'center'}}
              />
              <Text style={styles.h1}>Connect to your classes </Text>
              <Text style={styles.p}>Stay on top of your classes, assignments, and attendance</Text>
              <TextInput
                placeholder="Email/Reg. Number"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
<RememberMeSwitch />
<Choice />
<Toggle />
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
              <Text style={styles.h2}>Forget password?</Text>
              </TouchableOpacity>
              <Text style={styles.p2}>Need an account? <TouchableOpacity onPress={() => {}}> <Text style={styles.h3}>Sign Up</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </ScrollView> 
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  </>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: '#1B72B5' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 20, color: 'black', backgroundColor: 'white' },
  button: {
    backgroundColor: "#00284B",      // Green button
    paddingVertical: 16,              // Vertical height of button
    paddingHorizontal: 40,            // Horizontal padding
    borderRadius: 100,                 // Rounded corners
    alignItems: "center",             // Center text
    marginTop: 20,                    // Space from inputs
    shadowColor: "#000",              // Shadow (iOS)
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5 ,
    padding: 20,
    marginBottom: 1                    // Shadow for Android
  },
  buttonText: {
    color: "#fff",                    // White text
    fontSize: 18,                     // Larger text
    fontWeight: "700"                 // Bold
  },
  h1: {
    fontSize: 20,       // Large font size like <h1>
    fontWeight: "bold",
    marginBottom: 10,
    color: 'white',
    textAlign: 'center'  // Center the text
  },
  p: {
    fontSize: 14,       // Large font size like <h1>
    fontWeight: "bold",
    marginBottom: 50,
    color: 'white',
    textAlign: 'center'  // Center the text
  },
  scrollContainer: {
    flexGrow: 1, // ✅ prevents extra space when keyboard is hidden
    justifyContent: "center"
  },
  h2: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: 'white',
    textAlign: 'center'  // Center the text
  },
  p2: {
    fontSize: 14,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center'  // Center the text
  },
  h3: {
    fontSize: 14,
    fontWeight: "bold",
    color: '#00284B',
    marginTop: 5  },
    h4: {
      fontSize: 16,
      fontWeight: "bold",
      color: 'white',
      marginBottom: 10,
      marginTop: 5,
      textAlign: 'left'  // Center the text
    }
});

const styles2 = StyleSheet.create({
  container: {
    flexDirection: "row",         // put items in a row
    justifyContent: "space-between", // push them to edges
    alignItems: "center",         // align vertically
    paddingHorizontal: 20,        // space from screen edges

  },
  leftText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  rightText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
