import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationsScreen = ({ navigation }) => {
  const [allNotifications, setAllNotifications] = useState(true);
  const [attendance, setAttendance] = useState(true);
  const [assignments, setAssignments] = useState(true);
  const [messages, setMessages] = useState(true);
  const [announcements, setAnnouncements] = useState(true);
  const [grades, setGrades] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Master toggle animation
  useEffect(() => {
    if (!allNotifications) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [allNotifications]);

  const handleMasterToggle = (value) => {
    setAllNotifications(value);
    if (value) {
      // Enable all when master is on
      setAttendance(true);
      setAssignments(true);
      setMessages(true);
      setAnnouncements(true);
      setGrades(true);
      setReminders(true);
    } else {
      // Disable all when master is off
      setAttendance(false);
      setAssignments(false);
      setMessages(false);
      setAnnouncements(false);
      setGrades(false);
      setReminders(false);
    }
  };

  const handleSavePreferences = () => {
    Alert.alert(
      'Save Preferences',
      'Are you sure you want to save these notification preferences?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          style: 'default',
          onPress: () => {
            Alert.alert(
              'Success',
              'Notification preferences saved successfully!',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack?.(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleResetToDefault = () => {
    Alert.alert(
      'Reset to Default',
      'This will reset all notification preferences to default settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setAllNotifications(true);
            setAttendance(true);
            setAssignments(true);
            setMessages(true);
            setAnnouncements(true);
            setGrades(true);
            setReminders(true);
            setSoundEnabled(true);
            setVibrationEnabled(true);
            setQuietHours(false);
            Alert.alert('Reset Complete', 'Preferences reset to default');
          },
        },
      ]
    );
  };

  const NotificationToggle = ({
    icon,
    title,
    description,
    value,
    onToggle,
    disabled = false,
  }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationLeft}>
        <View style={[styles.iconContainer, disabled && styles.iconContainerDisabled]}>
          <Icon name={icon} size={24} color={disabled ? '#CCC' : '#1B72B5'} />
        </View>
        <View style={styles.notificationInfo}>
          <Text style={[styles.notificationTitle, disabled && styles.disabledText]}>
            {title}
          </Text>
          <Text style={styles.notificationDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: '#E0E0E0', true: '#1B72B5' }}
        thumbColor={value ? '#FFFFFF' : '#f4f3f4'}
        ios_backgroundColor="#E0E0E0"
      />
    </View>
  );

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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack?.()}
            >
              <Icon name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Master Toggle Section */}
            <Animated.View
              style={[
                styles.masterCard,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.masterLeft}>
                <View style={styles.masterIconContainer}>
                  <Icon name="bell-ring" size={32} color="#1B72B5" />
                </View>
                <View style={styles.masterInfo}>
                  <Text style={styles.masterTitle}>All Notifications</Text>
                  <Text style={styles.masterDescription}>
                    {allNotifications ? 'Notifications enabled' : 'All notifications disabled'}
                  </Text>
                </View>
              </View>
              <Switch
                value={allNotifications}
                onValueChange={handleMasterToggle}
                trackColor={{ false: '#E0E0E0', true: '#1B72B5' }}
                thumbColor={allNotifications ? '#FFFFFF' : '#f4f3f4'}
                ios_backgroundColor="#E0E0E0"
                style={styles.masterSwitch}
              />
            </Animated.View>

            {/* Notification Types Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notification Types</Text>
              <View style={styles.notificationsList}>
                <NotificationToggle
                  icon="calendar-check"
                  title="Attendance"
                  description="Reminders and attendance code notifications"
                  value={attendance}
                  onToggle={setAttendance}
                  disabled={!allNotifications}
                />

                <NotificationToggle
                  icon="book-open-variant"
                  title="Assignments"
                  description="New assignments and deadline reminders"
                  value={assignments}
                  onToggle={setAssignments}
                  disabled={!allNotifications}
                />

                <NotificationToggle
                  icon="message-text"
                  title="Messages"
                  description="New messages from instructors and peers"
                  value={messages}
                  onToggle={setMessages}
                  disabled={!allNotifications}
                />

                <NotificationToggle
                  icon="speaker"
                  title="Announcements"
                  description="Important class announcements"
                  value={announcements}
                  onToggle={setAnnouncements}
                  disabled={!allNotifications}
                />

                <NotificationToggle
                  icon="chart-line"
                  title="Grades"
                  description="Grade updates and feedback notifications"
                  value={grades}
                  onToggle={setGrades}
                  disabled={!allNotifications}
                />

                <NotificationToggle
                  icon="alarm"
                  title="Reminders"
                  description="Study reminders and upcoming events"
                  value={reminders}
                  onToggle={setReminders}
                  disabled={!allNotifications}
                />
              </View>
            </View>

            {/* Sound & Vibration Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sound & Vibration</Text>
              <View style={styles.notificationsList}>
                <NotificationToggle
                  icon="volume-high"
                  title="Sound"
                  description="Play sound for notifications"
                  value={soundEnabled}
                  onToggle={setSoundEnabled}
                  disabled={!allNotifications}
                />

                <NotificationToggle
                  icon="vibrate"
                  title="Vibration"
                  description="Vibrate device when notifications arrive"
                  value={vibrationEnabled}
                  onToggle={setVibrationEnabled}
                  disabled={!allNotifications}
                />
              </View>
            </View>

            {/* Quiet Hours Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quiet Hours</Text>
              <View style={[styles.quietHoursCard, !allNotifications && styles.quietHoursDisabled]}>
                <View style={styles.quietHoursHeader}>
                  <View style={styles.quietHoursInfo}>
                    <Icon name="moon" size={28} color="#1B72B5" />
                    <View style={styles.quietHoursTextContainer}>
                      <Text style={styles.quietHoursTitle}>
                        Mute notifications during quiet hours
                      </Text>
                      <Text style={styles.quietHoursDescription}>
                        Notifications won't disturb you at night
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={quietHours}
                    onValueChange={setQuietHours}
                    disabled={!allNotifications}
                    trackColor={{ false: '#E0E0E0', true: '#1B72B5' }}
                    thumbColor={quietHours ? '#FFFFFF' : '#f4f3f4'}
                    ios_backgroundColor="#E0E0E0"
                  />
                </View>

                {quietHours && allNotifications && (
                  <View style={styles.quietHoursSettings}>
                    <View style={styles.timeRow}>
                      <View style={styles.timeItem}>
                        <Text style={styles.timeLabel}>Start Time</Text>
                        <View style={styles.timeDisplay}>
                          <Icon name="clock-outline" size={20} color="#1B72B5" />
                          <Text style={styles.timeText}>{quietStart}</Text>
                        </View>
                      </View>
                      <View style={styles.separatorTime}>
                        <Icon name="arrow-right" size={24} color="#CCC" />
                      </View>
                      <View style={styles.timeItem}>
                        <Text style={styles.timeLabel}>End Time</Text>
                        <View style={styles.timeDisplay}>
                          <Icon name="clock-outline" size={20} color="#1B72B5" />
                          <Text style={styles.timeText}>{quietEnd}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.quietHoursTip}>
                      <Icon name="information" size={16} color="#0D47A1" />
                      <Text style={styles.quietHoursTipText}>
                        Notifications will be silenced but still delivered
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Icon name="lightbulb-on" size={20} color="#FF9800" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Notification Tips</Text>
                <Text style={styles.infoText}>
                  • Enable notifications to stay updated{'\n'}
                  • Customize preferences for each notification type{'\n'}
                  • Quiet hours help maintain focus during study
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSavePreferences}
              activeOpacity={0.8}
            >
              <Icon name="check-circle" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetToDefault}
              activeOpacity={0.8}
            >
              <Icon name="refresh" size={20} color="#1B72B5" />
              <Text style={styles.resetButtonText}>Reset to Default</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack?.()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default NotificationsScreen;

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    minHeight: '100%',
  },
  masterCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#1B72B5',
  },
  masterLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  masterIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  masterInfo: {
    flex: 1,
  },
  masterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  masterDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  masterSwitch: {
    marginLeft: 12,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 14,
  },
  notificationsList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(27, 114, 181, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerDisabled: {
    backgroundColor: '#F0F0F0',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  notificationDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  disabledText: {
    color: '#CCC',
  },
  quietHoursCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quietHoursDisabled: {
    opacity: 0.5,
  },
  quietHoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quietHoursInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quietHoursTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  quietHoursTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  quietHoursDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  quietHoursSettings: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  separatorTime: {
    marginHorizontal: 8,
  },
  quietHoursTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  quietHoursTipText: {
    fontSize: 12,
    color: '#0D47A1',
    marginLeft: 8,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#BF360C',
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: '#1B72B5',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#1B72B5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  resetButton: {
    borderWidth: 2,
    borderColor: '#FF9800',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resetButtonText: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#1B72B5',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#1B72B5',
    fontSize: 16,
    fontWeight: '600',
  },
});