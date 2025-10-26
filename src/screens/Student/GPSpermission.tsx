import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GPSPermission() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("unknown");
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkPermission();
  }, []);

  // Pulse animation for GPS icon
  useEffect(() => {
    if (hasPermission) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [hasPermission]);

  // Scale animation on mount
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === "granted");
      setPermissionStatus(status);
    } catch (error) {
      console.error("Error checking permission:", error);
      setPermissionStatus("error");
    }
  };

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === "granted");
      setPermissionStatus(status);

      if (status === "granted") {
        Alert.alert(
          "Success",
          "Location permission granted! You can now use location-based features.",
          [{ text: "OK" }]
        );
      } else if (status === "denied") {
        Alert.alert(
          "Permission Denied",
          "Location permission was denied. You can enable it in settings later."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to request location permission");
    } finally {
      setIsLoading(false);
    }
  };

  const openSystemSettings = () => {
    Linking.openSettings();
  };

  const PermissionBenefit = ({ icon, title, description }) => (
    <View style={styles.benefitRow}>
      <View style={styles.benefitIconContainer}>
        <MaterialIcons name={icon} size={24} color="#1B72B5" />
      </View>
      <View style={styles.benefitContent}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitDescription}>{description}</Text>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Location Access</Text>
            <Text style={styles.headerSubtitle}>
              Required for attendance verification
            </Text>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            {/* Status Card */}
            <Animated.View
              style={[
                styles.statusCard,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <MaterialIcons
                  name={hasPermission ? "my-location" : "location-off"}
                  size={48}
                  color={hasPermission ? "#4CAF50" : "#F44336"}
                />
              </Animated.View>

              <Text style={styles.statusTitle}>
                {hasPermission
                  ? "Location Enabled"
                  : "Location Permission Required"}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: hasPermission ? "#E8F5E9" : "#FFEBEE",
                    borderColor: hasPermission ? "#4CAF50" : "#F44336",
                  },
                ]}
              >
                <MaterialIcons
                  name={hasPermission ? "check-circle" : "info"}
                  size={18}
                  color={hasPermission ? "#4CAF50" : "#F44336"}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color: hasPermission ? "#2E7D32" : "#C62828",
                    },
                  ]}
                >
                  {hasPermission
                    ? "Permission Granted"
                    : "Permission Not Granted"}
                </Text>
              </View>
            </Animated.View>

            {/* Why Location Access Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why We Need Location</Text>
              <View style={styles.benefitsContainer}>
                <PermissionBenefit
                  icon="calendar-check"
                  title="Attendance Verification"
                  description="Verify you are on campus during class"
                />
                <PermissionBenefit
                  icon="security"
                  title="Security"
                  description="Prevent unauthorized attendance marking"
                />
                <PermissionBenefit
                  icon="location-on"
                  title="Accurate Tracking"
                  description="Ensure attendance is marked from correct location"
                />
              </View>
            </View>

            {/* Privacy & Security Section */}
            <View style={styles.privacyCard}>
              <View style={styles.privacyHeader}>
                <MaterialIcons name="lock" size={24} color="#1B72B5" />
                <Text style={styles.privacyTitle}>Your Privacy Matters</Text>
              </View>
              <Text style={styles.privacyText}>
                • Your location data is encrypted and never stored{"\n"}
                • Only used during class attendance marking{"\n"}
                • You can disable location anytime in settings{"\n"}
                • No third-party access to your location
              </Text>
            </View>

            {/* How It Works Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How It Works</Text>
              <View style={styles.stepsContainer}>
                <StepCard number="1" title="Enable Location" description="Grant location permission" />
                <StepCard number="2" title="Mark Attendance" description="Enter attendance code" />
                <StepCard number="3" title="Verify Location" description="System verifies your location" />
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: hasPermission ? "#4CAF50" : "#1B72B5",
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={hasPermission ? openSystemSettings : requestPermission}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={hasPermission ? "settings" : "my-location"}
                size={22}
                color="#FFFFFF"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.buttonText}>
                {isLoading
                  ? "Requesting Permission..."
                  : hasPermission
                  ? "Open Location Settings"
                  : "Grant Location Permission"}
              </Text>
            </TouchableOpacity>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <MaterialIcons name="info" size={20} color="#FF9800" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Important</Text>
                <Text style={styles.infoText}>
                  {hasPermission
                    ? "Location permission is enabled. You can now mark attendance from campus."
                    : "Without location permission, you won't be able to mark attendance. Please grant permission to continue."}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const StepCard = ({ number, title, description }) => (
  <View style={styles.stepCard}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  </View>
);

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
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    minHeight: "100%",
  },
  statusCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 25,
    marginBottom: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(27, 114, 181, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 14,
  },
  benefitsContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 16,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  benefitIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(27, 114, 181, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: 12,
    color: "#999",
  },
  privacyCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  privacyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B72B5",
    marginLeft: 8,
  },
  privacyText: {
    fontSize: 12,
    color: "#0D47A1",
    lineHeight: 20,
  },
  stepsContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1B72B5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 12,
    color: "#999",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 16,
    shadowColor: "#1B72B5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E65100",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#BF360C",
    lineHeight: 18,
  },
});