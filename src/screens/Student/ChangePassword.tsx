import React, { useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState('');
  const strengthAnim = new Animated.Value(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength === 0) return '';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    if (strength === 4) return 'Strong';
  };

  const getStrengthColor = () => {
    const strength = calculatePasswordStrength(newPassword);
    if (strength === 'Weak') return '#F44336';
    if (strength === 'Fair') return '#FF9800';
    if (strength === 'Good') return '#FFC107';
    if (strength === 'Strong') return '#4CAF50';
    return '#E0E0E0';
  };

  const getStrengthPercentage = () => {
    const strength = calculatePasswordStrength(newPassword);
    if (strength === 'Weak') return 0.25;
    if (strength === 'Fair') return 0.5;
    if (strength === 'Good') return 0.75;
    if (strength === 'Strong') return 1;
    return 0;
  };

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    setPasswordStrength(calculatePasswordStrength(text));
  };

  const validatePassword = () => {
    // Validation checks
    if (!currentPassword.trim()) {
      Alert.alert('Required', 'Please enter your current password');
      return false;
    }

    if (!newPassword.trim()) {
      Alert.alert('Required', 'Please enter a new password');
      return false;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters long'
      );
      return false;
    }

    if (newPassword === currentPassword) {
      Alert.alert(
        'Invalid',
        'New password must be different from current password'
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirmation do not match');
      return false;
    }

    if (!/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword)) {
      Alert.alert(
        'Weak Password',
        'Password must contain both uppercase and lowercase letters'
      );
      return false;
    }

    if (!/[0-9]/.test(newPassword)) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least one number'
      );
      return false;
    }

    return true;
  };

  const handleChangePassword = () => {
    if (!validatePassword()) {
      return;
    }

    setIsChanging(true);

    // Simulate API call
    setTimeout(() => {
      setIsChanging(false);
      Alert.alert(
        'Success',
        'Your password has been changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setPasswordStrength('');
              navigation.goBack?.();
            },
          },
        ]
      );
    }, 1500);
  };

  const PasswordRequirement = ({ met, text }) => (
    <View style={styles.requirementRow}>
      <Icon
        name={met ? 'check-circle' : 'circle-outline'}
        size={20}
        color={met ? '#4CAF50' : '#E0E0E0'}
      />
      <Text style={[styles.requirementText, met && styles.requirementMet]}>
        {text}
      </Text>
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
            <Text style={styles.headerTitle}>Change Password</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Security Icon */}
            <View style={styles.securitySection}>
              <View style={styles.securityIconContainer}>
                <Icon name="shield-lock" size={50} color="#1B72B5" />
              </View>
              <Text style={styles.securityTitle}>Secure Your Account</Text>
              <Text style={styles.securitySubtitle}>
                Create a strong password to protect your account
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Current Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter current password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showCurrentPassword}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Icon
                      name={showCurrentPassword ? 'eye' : 'eye-off'}
                      size={22}
                      color="#1B72B5"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter new password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={handleNewPasswordChange}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Icon
                      name={showNewPassword ? 'eye' : 'eye-off'}
                      size={22}
                      color="#1B72B5"
                    />
                  </TouchableOpacity>
                </View>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBar}>
                      <View
                        style={[
                          styles.strengthFill,
                          {
                            width: `${getStrengthPercentage() * 100}%`,
                            backgroundColor: getStrengthColor(),
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.strengthText,
                        { color: getStrengthColor() },
                      ]}
                    >
                      Password Strength: {passwordStrength}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm new password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={22}
                      color="#1B72B5"
                    />
                  </TouchableOpacity>
                </View>

                {/* Password Match Indicator */}
                {confirmPassword && newPassword && (
                  <View style={styles.matchRow}>
                    <Icon
                      name={
                        newPassword === confirmPassword
                          ? 'check-circle'
                          : 'alert-circle'
                      }
                      size={18}
                      color={
                        newPassword === confirmPassword ? '#4CAF50' : '#F44336'
                      }
                    />
                    <Text
                      style={[
                        styles.matchText,
                        {
                          color:
                            newPassword === confirmPassword
                              ? '#4CAF50'
                              : '#F44336',
                        },
                      ]}
                    >
                      {newPassword === confirmPassword
                        ? 'Passwords match'
                        : 'Passwords do not match'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Password Requirements */}
              <View style={styles.requirementsCard}>
                <Text style={styles.requirementsTitle}>
                  Password Requirements
                </Text>
                <PasswordRequirement
                  met={newPassword.length >= 8}
                  text="At least 8 characters"
                />
                <PasswordRequirement
                  met={
                    /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)
                  }
                  text="Contains uppercase and lowercase letters"
                />
                <PasswordRequirement
                  met={/[0-9]/.test(newPassword)}
                  text="Contains at least one number"
                />
                <PasswordRequirement
                  met={/[^a-zA-Z0-9]/.test(newPassword)}
                  text="Contains special character (optional)"
                />
              </View>

              {/* Change Password Button */}
              <TouchableOpacity
                style={[
                  styles.changeButton,
                  isChanging && styles.changeButtonDisabled,
                ]}
                onPress={handleChangePassword}
                disabled={isChanging}
                activeOpacity={0.8}
              >
                {isChanging ? (
                  <>
                    <Icon name="loading" size={20} color="#FFFFFF" />
                    <Text style={styles.changeButtonText}>Changing...</Text>
                  </>
                ) : (
                  <>
                    <Icon name="check-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.changeButtonText}>Change Password</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack?.()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Security Tips */}
              <View style={styles.tipsCard}>
                <Icon name="lightbulb-on" size={20} color="#FF9800" />
                <View style={styles.tipsContent}>
                  <Text style={styles.tipsTitle}>Security Tips</Text>
                  <Text style={styles.tipsText}>
                    • Use unique passwords for different accounts{'\n'}
                    • Don't share your password with anyone{'\n'}
                    • Change your password regularly{'\n'}
                    • Never use personal information in passwords
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ChangePassword;

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
  securitySection: {
    alignItems: 'center',
    marginBottom: 35,
  },
  securityIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(27, 114, 181, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  securityTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  securitySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    padding: 8,
  },
  strengthContainer: {
    marginTop: 12,
  },
  strengthBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  requirementsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 8,
    flex: 1,
  },
  requirementMet: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  changeButton: {
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
  changeButtonDisabled: {
    opacity: 0.7,
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#1B72B5',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 25,
  },
  cancelButtonText: {
    color: '#1B72B5',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  tipsContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    color: '#BF360C',
    lineHeight: 18,
  },
});