import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ClassSessionCode = () => {
  const [sessionCode, setSessionCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [duration, setDuration] = useState('60');
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [studentsJoined, setStudentsJoined] = useState(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Generate random code
  const generateCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  // Start pulse animation
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      fadeAnim.setValue(0);
    }
  }, [isActive]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            Alert.alert('Session Ended', 'The class session has expired.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start session
  const startSession = () => {
    if (!courseName.trim()) {
      Alert.alert('Required', 'Please enter a course name');
      return;
    }

    const code = generateCode();
    setSessionCode(code);
    setIsActive(true);
    setTimeRemaining(parseInt(duration) * 60);
    setStudentsJoined(0);
    
    Alert.alert(
      'Session Started',
      `Share code ${code} with your students to start attendance.`
    );
  };

  // End session
  const endSession = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: () => {
            setIsActive(false);
            setTimeRemaining(0);
            Alert.alert(
              'Session Ended',
              `${studentsJoined} student(s) marked present.`
            );
          },
        },
      ]
    );
  };

  // Share code
  const shareCode = async () => {
    try {
      await Share.share({
        message: `Join my class session!\n\nCourse: ${courseName}\nAttendance Code: ${sessionCode}\n\nEnter this code in your student app to mark attendance.`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the code');
    }
  };

  // Copy code
  const copyCode = () => {
    Alert.alert('Copied!', `Code ${sessionCode} copied to clipboard`);
  };

  // Simulate student joining
  const simulateStudentJoin = () => {
    setStudentsJoined((prev) => prev + 1);
  };

  return (
    <>
      <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Class Session</Text>
            <Text style={styles.headerSubtitle}>
              Generate code for student attendance
            </Text>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {!isActive ? (
              // Setup Form
              <View style={styles.setupSection}>
                <Text style={styles.sectionTitle}>Start New Session</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Course Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Computer Science 101"
                    placeholderTextColor="#999"
                    value={courseName}
                    onChangeText={setCourseName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Session Duration (minutes)</Text>
                  <View style={styles.durationButtons}>
                    {['15', '30', '60', '90', '120'].map((min) => (
                      <TouchableOpacity
                        key={min}
                        style={[
                          styles.durationBtn,
                          duration === min && styles.durationBtnActive,
                        ]}
                        onPress={() => setDuration(min)}
                      >
                        <Text
                          style={[
                            styles.durationText,
                            duration === min && styles.durationTextActive,
                          ]}
                        >
                          {min}m
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.startButton}
                  onPress={startSession}
                  activeOpacity={0.8}
                >
                  <Icon name="play-circle" size={24} color="#FFFFFF" />
                  <Text style={styles.startButtonText}>Start Session</Text>
                </TouchableOpacity>

                {/* Instructions */}
                <View style={styles.instructionsCard}>
                  <View style={styles.instructionRow}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>1</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      Enter your course name and select duration
                    </Text>
                  </View>
                  <View style={styles.instructionRow}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>2</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      Click "Start Session" to generate code
                    </Text>
                  </View>
                  <View style={styles.instructionRow}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>3</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      Share the code with your students
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              // Active Session
              <Animated.View style={[styles.activeSection, { opacity: fadeAnim }]}>
                {/* Course Info */}
                <View style={styles.courseInfoCard}>
                  <Text style={styles.courseLabel}>Current Session</Text>
                  <Text style={styles.courseName}>{courseName}</Text>
                </View>

                {/* Code Display */}
                <Animated.View
                  style={[
                    styles.codeContainer,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <View style={styles.codeGlow} />
                  <Text style={styles.codeLabel}>Attendance Code</Text>
                  <Text style={styles.codeText}>{sessionCode}</Text>
                  
                  <View style={styles.codeActions}>
                    <TouchableOpacity
                      style={styles.codeActionBtn}
                      onPress={copyCode}
                    >
                      <Icon name="content-copy" size={20} color="#1B72B5" />
                      <Text style={styles.codeActionText}>Copy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.codeActionBtn}
                      onPress={shareCode}
                    >
                      <Icon name="share-variant" size={20} color="#1B72B5" />
                      <Text style={styles.codeActionText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Icon name="clock-outline" size={32} color="#1B72B5" />
                    <Text style={styles.statValue}>{formatTime(timeRemaining)}</Text>
                    <Text style={styles.statLabel}>Time Remaining</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Icon name="account-multiple" size={32} color="#4CAF50" />
                    <Text style={styles.statValue}>{studentsJoined}</Text>
                    <Text style={styles.statLabel}>Students Joined</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <TouchableOpacity
                  style={styles.endButton}
                  onPress={endSession}
                  activeOpacity={0.8}
                >
                  <Icon name="stop-circle" size={24} color="#FFFFFF" />
                  <Text style={styles.endButtonText}>End Session</Text>
                </TouchableOpacity>

                {/* Demo button (remove in production) */}
                <TouchableOpacity
                  style={styles.demoButton}
                  onPress={simulateStudentJoin}
                >
                  <Text style={styles.demoButtonText}>
                    + Simulate Student Join (Demo)
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ClassSessionCode;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1B72B5',
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    minHeight: '100%',
  },
  setupSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#333',
  },
  durationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  durationBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  durationBtnActive: {
    backgroundColor: '#1B72B5',
    borderColor: '#1B72B5',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  durationTextActive: {
    color: '#FFFFFF',
  },
  startButton: {
    backgroundColor: '#1B72B5',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#1B72B5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  instructionsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1B72B5',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1B72B5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  activeSection: {
    flex: 1,
  },
  courseInfoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
  },
  courseLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  courseName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  codeContainer: {
    backgroundColor: '#1B72B5',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
    overflow: 'hidden',
  },
  codeGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  codeLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  codeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 8,
    marginBottom: 20,
  },
  codeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  codeActionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codeActionText: {
    color: '#1B72B5',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  endButton: {
    backgroundColor: '#F44336',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  endButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  demoButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
});