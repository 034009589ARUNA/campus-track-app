import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Device from 'expo-device';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'DeviceVerification'>;

const DeviceVerificationScreen = ({ navigation, route }: Props) => {
  const { studentEmail } = route.params || {};
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, approved, rejected

  useEffect(() => {
    getDeviceInfo();
  }, []);

const getDeviceInfo = async () => {
  try {
    const uniqueId = Device.osBuildId || 'Unknown';
    const deviceName = Device.deviceName || 'Unknown Device';
    const deviceModel = Device.modelName || 'Unknown Model';
    const manufacturer = Device.manufacturer || 'Unknown Manufacturer';
    const osVersion = `${Device.osName} ${Device.osVersion}`;
    const appVersion = '1.0.0'; // you can manually update this
    const isTablet = Device.deviceType === Device.DeviceType.TABLET;

    // Expo doesn’t directly give memory, so we’ll simulate this for UI consistency
    const totalMemory = 2 * 1024 * 1024 * 1024; // 2 GB example

    const formatBytes = (bytes) => {
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    setDeviceInfo({
      deviceId: uniqueId,
      deviceName,
      deviceModel,
      manufacturer,
      osType: Device.osName || 'Unknown OS',
      osVersion,
      appVersion,
      totalMemory: formatBytes(totalMemory),
      deviceType: isTablet ? 'Tablet' : 'Phone',
      registrationTime: new Date().toLocaleString(),
    });

    setIsLoading(false);
  } catch (error) {
    console.error('Error getting device info:', error);
    Alert.alert('Error', 'Failed to retrieve device information');
    setIsLoading(false);
  }
};


  const handleApproveDevice = async () => {
    setIsVerifying(true);

    // Simulate API call to verify and register device
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStatus('approved');

      Alert.alert(
        'Device Registered',
        'This device has been registered for your account. You can now mark attendance only from this device.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to student app
              navigation.replace('StudentRoot');
            },
          },
        ]
      );
    }, 2000);
  };

  const handleRejectDevice = () => {
    Alert.alert(
      'Device Not Approved',
      'To continue, you must approve this device for your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Go Back to Login',
          onPress: () => {
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <>
        <StatusBar backgroundColor="#1B72B5" barStyle="light-content" />
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1B72B5" />
            <Text style={styles.loadingText}>Retrieving device information...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailIconContainer}>
        <Icon name={icon} size={18} color="#1B72B5" />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
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
            <Text style={styles.headerTitle}>Device Verification</Text>
            <Text style={styles.headerSubtitle}>
              Register this device to your account
            </Text>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Security Info */}
            <View style={styles.securityCard}>
              <Icon name="shield-lock" size={32} color="#1B72B5" />
              <Text style={styles.securityTitle}>Single Device Access</Text>
              <Text style={styles.securityText}>
                Your account can only mark attendance from one registered device for security purposes.
              </Text>
            </View>

            {/* Student Email Display */}
            <View style={styles.studentCard}>
              <View style={styles.studentIconContainer}>
                <Icon name="account" size={32} color="#1B72B5" />
              </View>
              <View style={styles.studentContent}>
                <Text style={styles.studentLabel}>Student Account</Text>
                <Text style={styles.studentEmail}>{studentEmail}</Text>
              </View>
            </View>

            {/* Device Information Card */}
            <View style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <View style={styles.deviceIconContainer}>
                  <Icon
                    name={deviceInfo?.deviceType === 'Tablet' ? 'tablet' : 'cellphone'}
                    size={40}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.deviceNameSection}>
                  <Text style={styles.deviceNameLabel}>Device</Text>
                  <Text style={styles.deviceName}>{deviceInfo?.deviceName}</Text>
                  <Text style={styles.deviceModel}>
                    {deviceInfo?.manufacturer} {deviceInfo?.deviceModel}
                  </Text>
                </View>
              </View>

              <View style={styles.deviceDivider} />

              {/* Device Details */}
              <View style={styles.deviceDetails}>
                <DetailRow
                  icon="identifier"
                  label="Device ID"
                  value={deviceInfo?.deviceId?.substring(0, 16) + '...'}
                />
                <DetailRow
                  icon="devices"
                  label="Device Type"
                  value={deviceInfo?.deviceType}
                />
                <DetailRow
                  icon={Platform.OS === 'ios' ? 'apple' : 'android'}
                  label="OS"
                  value={`${deviceInfo?.osType} ${deviceInfo?.osVersion}`}
                />
                <DetailRow
                  icon="package"
                  label="App Version"
                  value={deviceInfo?.appVersion}
                />
                <DetailRow
                  icon="memory"
                  label="RAM"
                  value={deviceInfo?.totalMemory}
                />
                <DetailRow
                  icon="clock"
                  label="Registration Time"
                  value={deviceInfo?.registrationTime}
                />
              </View>
            </View>

            {/* Important Notice */}
            <View style={styles.noticeCard}>
              <Icon name="alert-circle" size={20} color="#FF9800" />
              <View style={styles.noticeContent}>
                <Text style={styles.noticeTitle}>Important Notice</Text>
                <Text style={styles.noticeText}>
                  {`• Once you approve this device, only this device can be used to mark attendance from your account\n`}
                  {`• Attendance from other devices will not be accepted\n`}
                  {`• You cannot change this device without contacting support`}
                </Text>
              </View>
            </View>

            {/* Warning */}
            <View style={styles.warningCard}>
              <Icon name="information" size={20} color="#0D47A1" />
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>Is This Your Device?</Text>
                <Text style={styles.warningText}>
                  Make sure this is your personal device. Do not use shared or borrowed devices.
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            {verificationStatus === 'pending' ? (
              <>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={handleApproveDevice}
                  disabled={isVerifying}
                  activeOpacity={0.8}
                >
                  {isVerifying ? (
                    <>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                      <Text style={styles.approveButtonText}>Verifying...</Text>
                    </>
                  ) : (
                    <>
                      <Icon name="check-circle" size={20} color="#FFFFFF" />
                      <Text style={styles.approveButtonText}>
                        Approve This Device
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={handleRejectDevice}
                  disabled={isVerifying}
                  activeOpacity={0.8}
                >
                  <Icon name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.rejectButtonText}>
                    Reject - Use Different Device
                  </Text>
                </TouchableOpacity>
              </>
            ) : verificationStatus === 'approved' ? (
              <View style={styles.approvedMessage}>
                <Icon name="check-circle" size={24} color="#4CAF50" />
                <Text style={styles.approvedText}>Device Approved</Text>
              </View>
            ) : null}

            {/* Support */}
            <View style={styles.supportCard}>
              <Icon name="help-circle" size={20} color="#FF9800" />
              <View style={styles.supportContent}>
                <Text style={styles.supportTitle}>Need Help?</Text>
                <Text style={styles.supportText}>
                  If you have questions about device verification, contact our support team.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default DeviceVerificationScreen;

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
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
  securityCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BBDEFB',
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B72B5',
    marginTop: 12,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 13,
    color: '#0D47A1',
    textAlign: 'center',
    lineHeight: 20,
  },
  studentCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  studentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(27, 114, 181, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentContent: {
    flex: 1,
  },
  studentLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deviceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1B72B5',
    marginBottom: 25,
  },
  deviceHeader: {
    backgroundColor: '#1B72B5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  deviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceNameSection: {
    flex: 1,
  },
  deviceNameLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  deviceModel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  deviceDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  deviceDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(27, 114, 181, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  noticeContent: {
    flex: 1,
    marginLeft: 12,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 6,
  },
  noticeText: {
    fontSize: 12,
    color: '#BF360C',
    lineHeight: 18,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D47A1',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#1565C0',
    lineHeight: 18,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  rejectButton: {
    borderWidth: 2,
    borderColor: '#F44336',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  rejectButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  approvedMessage: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  approvedText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  supportCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  supportContent: {
    flex: 1,
    marginLeft: 12,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 4,
  },
  supportText: {
    fontSize: 12,
    color: '#BF360C',
    lineHeight: 18,
  },
});