// src/screens/Student/Attendance.tsx
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { attendanceService, calculateDistance } from '../../services/attendanceService';
import FaceAttendance from '../../../components/FaceAttendance';

type Props = NativeStackScreenProps<any, 'Attendance'>;

export default function StudentAttendance({ navigation }: Props) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(0);
  const [gpsQuality, setGpsQuality] = useState('');
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  
  // Animation
  const pulseAnim = new Animated.Value(0);

  useEffect(() => {
    checkLocationPermission();
    fetchTodayAttendance();
    setupLocationTracking();
  }, []);

  // Pulse animation for GPS
  useEffect(() => {
    if (hasLocationPermission) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [hasLocationPermission]);

  // Check GPS Permission
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      if (status === 'granted') {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Location permission error:', error);
    }
  };

  // Setup continuous location tracking for accuracy improvement
  const setupLocationTracking = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') return;

      // Watch location for continuous updates
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 5, // Or every 5 meters
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy,
          });
          setGpsAccuracy(newLocation.coords.accuracy);
          updateGpsQuality(newLocation.coords.accuracy);
        }
      );

      return () => subscription.remove();
    } catch (error) {
      console.error('Location tracking error:', error);
    }
  };

  // Get Current Location (high accuracy)
  const getCurrentLocation = async () => {
    try {
      setIsRefreshingLocation(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        mayShowUserSettingsDialog: true,
      });

      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
      };

      setLocation(newLocation);
      setGpsAccuracy(currentLocation.coords.accuracy);
      updateGpsQuality(currentLocation.coords.accuracy);
    } catch (error) {
      console.error('Get location error:', error);
      Alert.alert('Error', 'Could not get your location. Please ensure GPS is enabled.');
    } finally {
      setIsRefreshingLocation(false);
    }
  };

  // Update GPS quality indicator
  const updateGpsQuality = (accuracy: number) => {
    if (accuracy <= 10) {
      setGpsQuality('Excellent');
    } else if (accuracy <= 20) {
      setGpsQuality('Very Good');
    } else if (accuracy <= 30) {
      setGpsQuality('Good');
    } else if (accuracy <= 50) {
      setGpsQuality('Fair');
    } else if (accuracy <= 100) {
      setGpsQuality('Poor');
    } else {
      setGpsQuality('Very Poor');
    }
  };

  // Request Location Permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      if (status === 'granted') {
        getCurrentLocation();
        Alert.alert('Success', 'Location permission granted');
      } else {
        Alert.alert('Permission Denied', 'Location permission is required for attendance');
      }
    } catch (error) {
      console.error('Request permission error:', error);
    }
  };

  // Fetch Today's Attendance
  const fetchTodayAttendance = async () => {
    try {
      const response = await attendanceService.getTodayAttendance();
      setTodayAttendance(response.data);
    } catch (error) {
      console.error('Fetch today attendance error:', error);
    }
  };

  // Handle Mark Attendance
  const handleMarkAttendance = async () => {
    if (!code.trim()) {
      Alert.alert('Validation Error', 'Please enter the attendance code');
      return;
    }

    if (!location) {
      Alert.alert('Location Error', 'Could not get your location. Please try again.');
      return;
    }

    if (!hasLocationPermission) {
      Alert.alert(
        'Permission Required',
        'Please enable location permission to mark attendance'
      );
      return;
    }

    // Check GPS accuracy before submitting
    if (gpsAccuracy > 100) {
      Alert.alert(
        'Poor GPS Signal',
        `Current accuracy: ±${gpsAccuracy.toFixed(0)}m\n\nPlease wait for better GPS signal (< 50m) or move to an open area.`,
        [
          { text: 'Cancel', onPress: () => {} },
          { text: 'Try Anyway', onPress: () => submitAttendance() },
        ]
      );
      return;
    }

    // Show face verification
    setShowFaceVerification(true);
  };

  const handleFaceVerified = () => {
    setFaceVerified(true);
    setShowFaceVerification(false);
    // Automatically submit attendance after face verification
    submitAttendance();
  };

  const handleFaceVerificationFailed = () => {
    Alert.alert(
      'Face Verification Failed',
      'Please try again. Make sure your face is clearly visible and well-lit.',
      [
        { text: 'Try Again', onPress: () => setFaceVerified(false) },
        { text: 'Skip Face Verification', onPress: () => {
          setShowFaceVerification(false);
          submitAttendance();
        }},
      ]
    );
  };

  const submitAttendance = async () => {
    setIsLoading(true);

    try {
      const response = await attendanceService.markAttendance(
        code,
        location.latitude,
        location.longitude,
        gpsAccuracy
      );

      if (response.success) {
        Alert.alert('Success', response.message);
        setCode('');
        fetchTodayAttendance();
        setTimeout(() => {
          fetchTodayAttendance();
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to mark attendance. Please try again.';
      const errorDetails = error.details;

      if (errorDetails?.distance !== undefined) {
        Alert.alert(
          'Outside Attendance Zone',
          `Distance from venue: ${errorDetails.distance}m\nMaximum allowed: ${errorDetails.maxDistance}m\nPlease move closer to the venue.`
        );
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get GPS quality color
  const getGpsQualityColor = () => {
    if (gpsAccuracy <= 10) return '#4CAF50';
    if (gpsAccuracy <= 30) return '#8BC34A';
    if (gpsAccuracy <= 50) return '#FFC107';
    if (gpsAccuracy <= 100) return '#FF9800';
    return '#FF5252';
  };

  // Get GPS quality icon
  const getGpsIcon = () => {
    if (gpsAccuracy <= 30) return 'wifi-strength-4';
    if (gpsAccuracy <= 50) return 'wifi-strength-3';
    if (gpsAccuracy <= 100) return 'wifi-strength-2';
    return 'wifi-strength-1';
  };


// Face Attendance Component Placeholder

 {/*const TensorCamera = cameraWithTensors(Camera);

  

const FaceAttendance: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<string | null>(null);
  const [isTfReady, setIsTfReady] = useState<boolean>(false);
  const modelRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      await tf.ready();
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );
      modelRef.current = model;
      setIsTfReady(true);
    })();
  }, []);

  const handleCapture = async (imageTensor: tf.Tensor3D) => {
    if (!modelRef.current) return;

    const predictions = await modelRef.current.estimateFaces({
      input: imageTensor,
      returnTensors: false,
    });

    if (predictions.length > 0) {
      setAttendanceStatus('✅ Attendance Marked');
    } else {
      setAttendanceStatus('❌ Face not detected. Try again!');
    }
  };

  if (hasPermission === null) return <Text>Requesting camera permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;
  if (!isTfReady) return <Text>Loading AI model...</Text>;  */}
  /// ====================================================================================================>>>>>>>>>>>>>>>>>>>>

  // Show face verification modal
  if (showFaceVerification) {
    return (
      <>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={styles.faceVerificationHeader}>
            <TouchableOpacity onPress={() => setShowFaceVerification(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.faceVerificationTitle}>Face Verification</Text>
            <View style={{ width: 24 }} />
          </View>
          <FaceAttendance
            onFaceDetected={handleFaceVerified}
            onFaceDetectionFailed={handleFaceVerificationFailed}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1B72B5' }} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mark Attendance</Text>
            <Text style={styles.headerSubtitle}>
              Enter code & enable GPS for location verification
            </Text>
          </View>

          {/* GPS Status Card */}
          <View style={styles.gpsCard}>
            <View style={styles.gpsHeader}>
              <Animated.View
                style={[
                  styles.gpsPulse,
                  {
                    opacity: hasLocationPermission
                      ? pulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 0.5],
                        })
                      : 0.3,
                  },
                ]}
              >
                <Icon name="satellite-variant" size={40} color="#1B72B5" />
              </Animated.View>

              <View style={styles.gpsStatus}>
                <Text style={styles.gpsStatusTitle}>
                  {hasLocationPermission ? 'GPS Connected' : 'GPS Disconnected'}
                </Text>
                <Text style={styles.gpsStatusSubtext}>
                  Accuracy: ±{gpsAccuracy.toFixed(1)}m ({gpsQuality})
                </Text>
              </View>

              <TouchableOpacity
                onPress={getCurrentLocation}
                disabled={isRefreshingLocation}
              >
                {isRefreshingLocation ? (
                  <ActivityIndicator color="#1B72B5" />
                ) : (
                  <Icon name="refresh" size={24} color="#1B72B5" />
                )}
              </TouchableOpacity>
            </View>

            {/* GPS Quality Indicator */}
            {hasLocationPermission && (
              <View style={styles.gpsQualityContainer}>
                <View style={styles.accuracyBar}>
                  <View
                    style={[
                      styles.accuracyFill,
                      {
                        width: `${Math.max(10, Math.min(100, (100 / 100) * (100 - gpsAccuracy / 10)))}%`,
                        backgroundColor: getGpsQualityColor(),
                      },
                    ]}
                  />
                </View>

                <View style={styles.gpsSignal}>
                  <Icon name={getGpsIcon()} size={20} color={getGpsQualityColor()} />
                  <Text style={[styles.gpsSignalText, { color: getGpsQualityColor() }]}>
                    {gpsQuality}
                  </Text>
                </View>

                {location && (
                  <Text style={styles.coordinates}>
                    Lat: {location.latitude.toFixed(6)} | Lon: {location.longitude.toFixed(6)}
                  </Text>
                )}

                {gpsAccuracy > 50 && (
                  <Text style={styles.accuracyWarning}>
                    ⚠️ GPS accuracy is below optimal level. Please wait or move to an open area.
                  </Text>
                )}
              </View>
            )}

            {!hasLocationPermission && (
              <TouchableOpacity
                style={styles.enableGpsButton}
                onPress={requestLocationPermission}
              >
                <Icon name="map-marker" size={20} color="#fff" />
                <Text style={styles.enableGpsButtonText}>Enable GPS</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Today's Attendance Status */}
          {todayAttendance?.marked ? (
            <View style={[styles.statusCard, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="check-circle" size={48} color="#4CAF50" />
              <Text style={[styles.statusText, { color: '#2E7D32' }]}>Attendance Marked ✓</Text>
              <Text style={[styles.statusTime, { color: '#558B2F' }]}>
                Time: {new Date(todayAttendance.time).toLocaleTimeString()}
              </Text>
              {todayAttendance.location?.distance && (
                <Text style={[styles.statusTime, { color: '#558B2F' }]}>
                  Distance: {todayAttendance.location.distance}m
                </Text>
              )}
            </View>
          ) : (
            <View style={[styles.statusCard, { backgroundColor: '#FFF3E0' }]}>
              <Icon name="clock-outline" size={48} color="#FF9800" />
              <Text style={[styles.statusText, { color: '#E65100' }]}>Not Marked Yet</Text>
              <Text style={[styles.statusSubtext, { color: '#BF360C' }]}>
                Enter code below to mark attendance
              </Text>
            </View>
          )}

          {/* Attendance Code Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Attendance Code</Text>
            <View style={styles.inputWrapper}>
              <Icon name="lock" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.codeInput}
                placeholder="Enter 6-character code"
                value={code}
                onChangeText={(text) => setCode(text.toUpperCase())}
                maxLength={6}
                editable={!isLoading && hasLocationPermission}
                placeholderTextColor="#999"
              />
              {code && <Text style={styles.codeLength}>{code.length}/6</Text>}
            </View>
          </View>

          {/* Mark Attendance Button */}
          <TouchableOpacity
            style={[
              styles.markButton,
              (!hasLocationPermission || isLoading) && styles.markButtonDisabled,
            ]}
            onPress={handleMarkAttendance}
            disabled={!hasLocationPermission || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="check" size={24} color="#fff" />
                <Text style={styles.markButtonText}>Mark Attendance</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Icon name="information" size={24} color="#2196F3" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Location Verification</Text>
              <Text style={styles.infoText}>
                • GPS accuracy must be ±50m or better{'\n'}
                • You must be within the attendance zone{'\n'}
                • Location is tracked for security{'\n'}
                • Wait in open areas for better signal
              </Text>
            </View>
          </View>
    {/*<View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants.Type.front}
        cameraTextureHeight={1920}
        cameraTextureWidth={1080}
        resizeHeight={224}
        resizeWidth={224}
        resizeDepth={3}
        onReady={handleCapture}
        autorender={true}
      />
      {attendanceStatus && <Text style={styles.status}>{attendanceStatus}</Text>}
    </View> */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#1B72B5',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#1B72B5',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
    marginTop: 8,
  },
  gpsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gpsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gpsPulse: {
    marginRight: 12,
  },
  gpsStatus: {
    flex: 1,
  },
  gpsStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  gpsStatusSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  gpsQualityContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  accuracyBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  accuracyFill: {
    height: '100%',
    borderRadius: 4,
  },
  gpsSignal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gpsSignalText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  coordinates: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
  },
  accuracyWarning: {
    marginTop: 8,
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  enableGpsButton: {
    backgroundColor: '#1B72B5',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  enableGpsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statusCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  statusSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  statusTime: {
    fontSize: 12,
    marginTop: 8,
  },
  inputSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  codeInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#333',
  },
  codeLength: {
    fontSize: 12,
    color: '#999',
  },
  markButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  markButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
  },
  infoText: {
    fontSize: 12,
    color: '#0D47A1',
    marginTop: 6,
    lineHeight: 18,
  },
  faceVerificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000',
  },
  faceVerificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});