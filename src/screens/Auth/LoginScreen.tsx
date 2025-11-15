// src/screens/Auth/LoginScreen.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../../../App";

// ✅ Import your backend service and auth context
import { authService } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState(null); // "student" or "lecturer"
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      // Call your backend API
      const response = await authService.login(email, password, userType);

      if (response.success) {
        // Save auth data in context
        await login(response.token, response.user, userType);

        // Navigate based on user type
        if (userType === "student") {
          navigation.replace("DeviceVerification", {
            studentEmail: email,
            token: response.token,
          });
        } else {
          navigation.replace("LecturerRoot");
        }
      } else {
        Alert.alert("Login Failed", response.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response) {
        Alert.alert(
          "Login Error",
          error.response.data.message || "Invalid email or password"
        );
      } else if (error.request) {
        Alert.alert(
          "Network Error",
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleSignUp = () => {
  if (userType === "student") {
    navigation.navigate("SignUpScreen");
  } else if (userType === "lecturer") {
    navigation.navigate("LecturerSignUpScreen");
  } else {
    Alert.alert("Select User Type", "Please choose whether you are a student or lecturer first.");
  }
};


  return (
    <>
      <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.container}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                  <Image
                    source={require("../../../assets/images/image2.png")}
                    style={styles.logo}
                  />
                </View>

                {/* Header */}
                <Text style={styles.title}>Connect to Your Classes</Text>
                <Text style={styles.subtitle}>
                  Stay on top of your classes, assignments, and attendance
                </Text>

                {/* User Type */}
                <View style={styles.userTypeContainer}>
                  <Text style={styles.userTypeLabel}>Login As</Text>
                  <View style={styles.userTypeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.userTypeButton,
                        userType === "student" && styles.userTypeButtonActive,
                      ]}
                      onPress={() => setUserType("student")}
                    >
                      <Icon
                        name="account-multiple"
                        size={20}
                        color={userType === "student" ? "#FFFFFF" : "#999"}
                      />
                      <Text
                        style={[
                          styles.userTypeButtonText,
                          userType === "student" && styles.userTypeButtonTextActive,
                        ]}
                      >
                        Student
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.userTypeButton,
                        userType === "lecturer" && styles.userTypeButtonActive,
                      ]}
                      onPress={() => setUserType("lecturer")}
                    >
                      <Icon
                        name="school"
                        size={20}
                        color={userType === "lecturer" ? "#FFFFFF" : "#999"}
                      />
                      <Text
                        style={[
                          styles.userTypeButtonText,
                          userType === "lecturer" && styles.userTypeButtonTextActive,
                        ]}
                      >
                        Lecturer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email or Registration Number</Text>
                    <View style={styles.inputWrapper}>
                      <Icon name="email" size={20} color="#1B72B5" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Enter your email or reg number"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                      />
                    </View>
                  </View>

                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                      <Icon name="lock" size={20} color="#1B72B5" style={styles.inputIcon} />
                      <TextInput
                        placeholder="Enter your password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        editable={!isLoading}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                          name={showPassword ? "eye" : "eye-off"}
                          size={20}
                          color="#1B72B5"
                          style={styles.eyeIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Remember Me */}
                  <View style={styles.rememberMeRow}>
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => setRememberMe(!rememberMe)}
                    >
                      <Icon
                        name={rememberMe ? "checkbox-marked" : "checkbox-blank-outline"}
                        size={24}
                        color={rememberMe ? "#1B72B5" : "#CCC"}
                      />
                    </TouchableOpacity>
                    <Text style={styles.rememberMeText}>Remember me</Text>
                  </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Icon name="login" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                      <Text style={styles.loginButtonText}>Login</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Forgot Password */}
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* Sign Up */}
                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

export default LoginScreen;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1B72B5",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  container: {
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  userTypeContainer: {
    marginBottom: 30,
  },
  userTypeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    gap: 8,
  },
  userTypeButtonActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  userTypeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  userTypeButtonTextActive: {
    color: "#1B72B5",
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 0,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  rememberMeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  rememberMeText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#00284B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 10,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 20,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
});