// src/screens/Lecturer/ClassSessionCode.tsx
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import Slider from '@react-native-community/slider';
//import Share from 'react-native-share';
import * as Sharing from 'expo-sharing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { attendanceService } from '../../services/attendanceService';
//import RNFS from 'react-native-fs';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
import api from '../../services/api'; // adjust path if needed

import {
  generateAttendancePDF,
  generateAttendanceCSV,
  generateAttendanceJSON,
} from '../../utils/reportDownloadUtils';

type Props = NativeStackScreenProps<any, 'ClassSessionCode'>;

export default function ClassSessionCode({ navigation }: Props) {
  const [courseName, setCourseName] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('');
  const [geofenceRadius, setGeofenceRadius] = useState(50); // in meters
  
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const [sessionCode, setSessionCode] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [activeSessions, setActiveSessions] = useState([]);
  const [geofenceStats, setGeofenceStats] = useState(null);

  useEffect(() => {
    checkLocationPermission();
    fetchActiveSessions();
  }, []);

  // Timer for session expiration
  useEffect(() => {
    if (!sessionActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setSessionActive(false);
          Alert.alert('Session Expired', 'Your attendance session has expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionActive]);

  // Check Location Permission
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

  // Get Current Location (for lecturer's venue)
  const getCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
      });
    } catch (error) {
      console.error('Get location error:', error);
      Alert.alert('Error', 'Could not get your location. Please enable GPS.');
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
      }
    } catch (error) {
      console.error('Request permission error:', error);
    }
  };

  // Fetch active sessions
  const fetchActiveSessions = async () => {
    try {
      const response = await attendanceService.getActiveSessions();
      setActiveSessions(response.data);
    } catch (error) {
      console.error('Fetch sessions error:', error);
    }
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Start Session with Geofencing
  const handleStartSession = async () => {
    if (!courseName.trim()) {
      Alert.alert('Validation Error', 'Please enter course name');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Validation Error', 'Please enter subject');
      return;
    }
    if (duration < 15 || duration > 480) {
      Alert.alert('Validation Error', 'Duration must be between 15 and 480 minutes');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Error', 'Could not get your location. Please enable GPS.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await attendanceService.createClassSession(
        courseName,
        duration,
        subject,
        currentLocation.latitude,
        currentLocation.longitude,
        location,
        geofenceRadius
      );

      if (response.success) {
        setSessionCode(response.data.code);
        setSessionId(response.data.sessionId);
        setSessionActive(true);
        setTimeRemaining(duration * 60);
        setAttendanceCount(0);

        Alert.alert(
          'Success',
          `Session created!\n\nCode: ${response.data.code}\n\nGeofence Radius: ${geofenceRadius}m\n\nShare this code with your students`
        );

        fetchActiveSessions();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create session';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

 //import * as Sharing from 'expo-sharing';

// Handle Share Code
const handleShareCode = async () => {
  if (!sessionCode) return;

  try {
    const shareMessage = `📍 Attendance Code: ${sessionCode}\n\nCourse: ${courseName}\nSubject: ${subject}\nGeofence: ±${geofenceRadius}m\nTime: ${formatTime(timeRemaining)}\n\nEnter this code in the app to mark attendance.`;
    
    // Check if sharing is available
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(shareMessage, {
        dialogTitle: 'Share Attendance Code',
        mimeType: 'text/plain',
      });
    } else {
      // Fallback: Copy to clipboard or show alert
      console.log('Sharing not available on this device');
      // Optional: Implement clipboard fallback
      // await Clipboard.setStringAsync(shareMessage);
      // alert('Attendance code copied to clipboard!');
    }
  } catch (error) {
    console.error('Share error:', error);
    // Optional: Handle specific error cases
    if (error instanceof Error && error.message.includes('cancelled')) {
      // User cancelled sharing - no need to show error
      return;
    }
    // Show user-friendly error message
    alert('Failed to share attendance code. Please try again.');
  }
};
  // Handle Get Session Details
  const handleGetSessionDetails = async () => {
    if (!sessionId) return;

    try {
      setIsLoading(true);
      const response = await attendanceService.getSessionAttendance(sessionId);

      setAttendanceCount(response.data.statistics.present);
      setGeofenceStats(response.data.geofenceStatistics);

      Alert.alert(
        'Session Statistics',
        `Total Present: ${response.data.statistics.present}\n` +
        `Total Absent: ${response.data.statistics.absent}\n` +
        `Avg Distance: ${response.data.geofenceStatistics.averageDistance}m\n` +
        `Within Geofence: ${response.data.geofenceStatistics.withinGeofence}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch session details');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle End Session
  const handleEndSession = async () => {
    if (!sessionId) return;

    Alert.alert(
      'End Session?',
      'Are you sure you want to end this attendance session?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'End Session',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await attendanceService.endClassSession(sessionId);

              if (response.success) {
                setSessionActive(false);
                setSessionCode(null);
                setSessionId(null);
                Alert.alert('Success', response.message);
                fetchActiveSessions();
              }
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

// Handle Download PDF Report ===========================================>


const [downloadProgress, setDownloadProgress] = useState(0);
const [isDownloading, setIsDownloading] = useState(false);

/**
 * Handle PDF report download
 */
const handleDownloadPDF = async (sessionId: string) => {
  try {
    setIsDownloading(true);
    setDownloadProgress(0);

    await generateAttendancePDF(
      sessionId,
      courseName,
      (progress) => {
        setDownloadProgress(Math.round(progress * 100));
        console.log(`Download progress: ${Math.round(progress * 100)}%`);
      }
    );

    setDownloadProgress(0);
    setIsDownloading(false);
  } catch (error) {
    console.error('Download error:', error);
    setIsDownloading(false);
    setDownloadProgress(0);
  }
};

/**
 * Handle CSV report download
 */
const handleDownloadCSV = async (sessionId: string) => {
  try {
    setIsDownloading(true);
    setDownloadProgress(0);

    await generateAttendanceCSV(
      sessionId,
      courseName,
      (progress) => {
        setDownloadProgress(Math.round(progress * 100));
      }
    );

    setDownloadProgress(0);
    setIsDownloading(false);
  } catch (error) {
    console.error('Download error:', error);
    setIsDownloading(false);
    setDownloadProgress(0);
  }
};

/**
 * Handle JSON report download
 */
const handleDownloadJSON = async (sessionId: string) => {
  try {
    setIsDownloading(true);
    setDownloadProgress(0);

    await generateAttendanceJSON(
      sessionId,
      courseName,
      (progress) => {
        setDownloadProgress(Math.round(progress * 100));
      }
    );

    setDownloadProgress(0);
    setIsDownloading(false);
  } catch (error) {
    console.error('Download error:', error);
    setIsDownloading(false);
    setDownloadProgress(0);
  }
};

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
            <Text style={styles.headerTitle}>Start Class Session</Text>
            <Text style={styles.headerSubtitle}>Generate code with geofencing</Text>
          </View>

          {/* Location Status */}
          {!sessionActive && (
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <Icon
                  name={hasLocationPermission ? 'map-marker' : 'map-marker-off'}
                  size={24}
                  color={hasLocationPermission ? '#1B72B5' : '#FF5252'}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.locationTitle}>
                    {hasLocationPermission ? 'Location Enabled' : 'Location Disabled'}
                  </Text>
                  {currentLocation && (
                    <Text style={styles.locationCoords}>
                      Lat: {currentLocation.latitude.toFixed(6)}, Lon:{' '}
                      {currentLocation.longitude.toFixed(6)}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={getCurrentLocation}>
                  <Icon name="refresh" size={20} color="#1B72B5" />
                </TouchableOpacity>
              </View>

              {!hasLocationPermission && (
                <TouchableOpacity
                  style={styles.permissionButton}
                  onPress={requestLocationPermission}
                >
                  <Text style={styles.permissionButtonText}>Enable Location</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Active Session Display */}
          {sessionActive && sessionCode && (
            <View style={styles.activeSessionCard}>
              <View style={styles.pulseIcon}>
                <Icon name="wifi-sync" size={40} color="#4CAF50" />
              </View>

              <Text style={styles.sessionLabel}>Active Code</Text>
              <View style={styles.codeDisplay}>
                <Text style={styles.codeText}>{sessionCode}</Text>
              </View>

              <Text style={styles.sessionInfo}>{courseName}</Text>
              <Text style={styles.sessionSubinfo}>{subject}</Text>

              {/* Geofence Info */}
              <View style={styles.geofenceInfo}>
                <Icon name="radius" size={16} color="#1B72B5" />
                <Text style={styles.geofenceText}>Radius: ±{geofenceRadius}m</Text>
              </View>

              <View style={styles.timerContainer}>
                <Icon name="timer" size={20} color="#FF9800" />
                <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              </View>

              <View style={styles.attendanceContainer}>
                <Icon name="account-check" size={24} color="#2196F3" />
                <Text style={styles.attendanceText}>
                  {attendanceCount} Students Present
                </Text>
              </View>

              {/* Geofence Statistics */}
              {geofenceStats && (
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Within Zone</Text>
                    <Text style={styles.statValue}>{geofenceStats.withinGeofence}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Outside Zone</Text>
                    <Text style={styles.statValue}>{geofenceStats.outsideGeofence}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Avg Distance</Text>
                    <Text style={styles.statValue}>{geofenceStats.averageDistance}m</Text>
                  </View>
                </View>
              )}

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.shareButton]}
                  onPress={handleShareCode}
                >
                  <Icon name="share" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.detailsButton]}
                  onPress={handleGetSessionDetails}
                >
                  <Icon name="information" size={20} color="#666" />
                  <Text style={[styles.actionButtonText, { color: '#666' }]}>Details</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.endButton}
                onPress={handleEndSession}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon name="stop-circle" size={20} color="#fff" />
                    <Text style={styles.endButtonText}>End Session</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Session Setup Form */}
          {!sessionActive && (
            <>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Session Setup</Text>

                {/* Course Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Course Name</Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="book" size={20} color="#999" />
                    <TextInput
                      style={styles.input}
                      placeholder="E.g., Web Development"
                      value={courseName}
                      onChangeText={setCourseName}
                      editable={!isLoading}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Subject */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Subject</Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="tag" size={20} color="#999" />
                    <TextInput
                      style={styles.input}
                      placeholder="E.g., React Basics"
                      value={subject}
                      onChangeText={setSubject}
                      editable={!isLoading}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Duration Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Duration: {duration} mins</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={15}
                    maximumValue={480}
                    step={15}
                    value={duration}
                    onValueChange={setDuration}
                  />
                </View>

                {/* Geofence Radius */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Geofence Radius: ±{geofenceRadius}m</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={10}
                    maximumValue={500}
                    step={10}
                    value={geofenceRadius}
                    onValueChange={setGeofenceRadius}
                  />
                  <Text style={styles.radiusHint}>
                    Typical classroom: 30-50m | Large auditorium: 50-100m | Outdoor: 100-200m
                  </Text>
                </View>

                {/* Location */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Location Name (Optional)</Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="map-marker" size={20} color="#999" />
                    <TextInput
                      style={styles.input}
                      placeholder="E.g., Room 101"
                      value={location}
                      onChangeText={setLocation}
                      editable={!isLoading}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              {/* Start Button */}
              <TouchableOpacity
                style={[styles.startButton, isLoading && styles.startButtonDisabled]}
                onPress={handleStartSession}
                disabled={isLoading || !hasLocationPermission}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon name="play-circle" size={24} color="#fff" />
                    <Text style={styles.startButtonText}>Start Session</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Icon name="lightbulb" size={24} color="#FF9800" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Geofencing Tips</Text>
              <Text style={styles.infoText}>
                • Smaller radius (30m): Prevents cheating{'\n'}
                • Larger radius (100m): Prevents false rejections{'\n'}
                • GPS works best outdoors{'\n'}
                • Students must have location enabled
              </Text>
            </View>
          </View>
  <View style={styles.reportSection}>
      <Text style={styles.reportTitle}>📊 Download Report</Text>

      {isDownloading && (
        <View style={styles.progressContainer}>
  <View style={[styles.progressBar, { width: `${downloadProgress}%` }]} />
  <Text style={styles.progressText}>{downloadProgress}%</Text>
</View>
      )}

      <View style={styles.downloadButtonsContainer}>
        <TouchableOpacity
          style={[styles.downloadButton, styles.pdfButton, isDownloading && styles.disabledButton]}
          onPress={() => handleDownloadPDF(sessionId)}
          disabled={isDownloading}
        >
          <Icon name="file-pdf-box" size={20} color="#fff" />
          <Text style={styles.downloadButtonText}>HTML/PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.downloadButton, styles.csvButton, isDownloading && styles.disabledButton]}
          onPress={() => handleDownloadCSV(sessionId)}
          disabled={isDownloading}
        >
          <Icon name="file-delimited" size={20} color="#fff" />
          <Text style={styles.downloadButtonText}>CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.downloadButton, styles.jsonButton, isDownloading && styles.disabledButton]}
          onPress={() => handleDownloadJSON(sessionId)}
          disabled={isDownloading}
        >
          <Icon name="code-json" size={20} color="#fff" />
          <Text style={styles.downloadButtonText}>JSON</Text>
        </TouchableOpacity>
      </View>
    </View>


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
  locationCard: {
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
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  locationCoords: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  permissionButton: {
    backgroundColor: '#1B72B5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  activeSessionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  pulseIcon: {
    marginBottom: 16,
  },
  sessionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  codeDisplay: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
    width: '100%',
  },
  codeText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#4CAF50',
    textAlign: 'center',
    letterSpacing: 2,
  },
  sessionInfo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
  },
  sessionSubinfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  geofenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  geofenceText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: 8,
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  attendanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    width: '100%',
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B72B5',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
  },
  detailsButton: {
    backgroundColor: '#f0f0f0',
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  endButton: {
    backgroundColor: '#FF5252',
    marginTop: 12,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  endButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  formCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  radiusHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  startButton: {
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
  startButtonDisabled: {
    backgroundColor: '#CCC',
    opacity: 0.6,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#FFF3E0',
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
    color: '#E65100',
  },
  infoText: {
    fontSize: 12,
    color: '#BF360C',
    marginTop: 6,
    lineHeight: 18,
  },
  reportSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    width: '100%',
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#1B72B5',
    fontWeight: '600',
    textAlign: 'center',
  },
  downloadButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  downloadButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  pdfButton: {
    backgroundColor: '#E53935',
  },
  csvButton: {
    backgroundColor: '#43A047',
  },
  jsonButton: {
    backgroundColor: '#FB8C00',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  disabledButton: {
    opacity: 0.6,
  }
});