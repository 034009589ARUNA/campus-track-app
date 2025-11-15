import { useNavigation } from '@react-navigation/native'; // ✅ added
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Icons
const ChevronRightIcon = ({ isDark }) => (
  <Text style={[styles.chevron, isDark && styles.chevronDark]}>›</Text>
);

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation(); // ✅ added

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    console.log('Theme toggled:', !isDarkMode ? 'Dark' : 'Light');
  };

  const handlePress = (option) => {
    console.log(`${option} pressed`);
  };

  const SettingsGroup = ({ title, children }) => (
    <View style={styles.settingsGroup}>
      <Text style={[styles.groupTitle, isDarkMode && styles.groupTitleDark]}>{title}</Text>
      <View style={[styles.groupContainer, isDarkMode && styles.groupContainerDark]}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ icon, title, onPress, isLast = false, showToggle = false }) => (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        isDarkMode && styles.settingsItemDark,
        isLast && styles.settingsItemLast
      ]}
      onPress={() => onPress(title)}
      activeOpacity={0.7}
      disabled={showToggle}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}>
          <Text style={styles.settingsIcon}>{icon}</Text>
        </View>
        <Text style={[styles.settingsItemText, isDarkMode && styles.settingsItemTextDark]}>
          {title}
        </Text>
      </View>
      {showToggle ? (
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#E0E0E0', true: '#1B72B5' }}
          thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'}
          ios_backgroundColor="#E0E0E0"
        />
      ) : (
        <ChevronRightIcon isDark={isDarkMode} />
      )}
    </TouchableOpacity>
  );

  const ProfileCard = () => (
    <TouchableOpacity 
      style={[styles.profileCard, isDarkMode && styles.profileCardDark]} 
      activeOpacity={0.9}
      onPress={() => navigation.navigate('EditProfile')} // ✅ Added navigation
    >
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&w=1000&q=80'
        }}
        style={styles.profileImage}
      />
      <View style={styles.profileInfo}>
        <Text style={[styles.profileName, isDarkMode && styles.profileNameDark]}>
          Aruna Kallon
        </Text>
        <Text style={[styles.profileRole, isDarkMode && styles.profileRoleDark]}>
          Student
        </Text>
      </View>
      <View style={styles.editIcon}>
        <Text style={styles.editIconText}>✏️</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar 
        backgroundColor="#1B72B5" 
        barStyle="light-content" 
      />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Manage your account & preferences</Text>
          </View>

          <View style={[styles.contentContainer, isDarkMode && styles.contentContainerDark]}>
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Profile Section */}
              <ProfileCard />

              {/* Account Section */}
              <SettingsGroup title="Account">
                <SettingsItem
                  icon="👤"
                  title="Edit Profile"
                  onPress={() => navigation.navigate("EditProfile")}
                />
                <SettingsItem
                  icon="🔒"
                  title="Change Password"
                  onPress={() => navigation.navigate("ChangePassword")}
                />
                <SettingsItem
                  icon="🌐"
                  title="Language"
                  onPress={() => navigation.navigate("Language")}
                />
                <SettingsItem
                  icon="🔔"
                  title="Notifications"
                  onPress={() => navigation.navigate("Notifications")}
                  isLast={true}
                />
              </SettingsGroup>

              {/* Location & Device Section */}
              <SettingsGroup title="Location & Device">
                <SettingsItem
                  icon="📍"
                  title="GPS Permission"
                  onPress={() => navigation.navigate("GPSpermission")}
                />
                <SettingsItem
                  icon="📱"
                  title="Device Info"
                  onPress={handlePress}
                />
                <SettingsItem
                  icon="🔄"
                  title="Request Device Change"
                  onPress={handlePress}
                  isLast={true}
                />
              </SettingsGroup>

              {/* App Preferences Section */}
              <SettingsGroup title="App Preferences">
                <SettingsItem
                  icon="🎨"
                  title="Theme"
                  onPress={handlePress}
                  showToggle={true}
                />
                <SettingsItem
                  icon="🔄"
                  title="Auto Sync"
                  onPress={handlePress}
                  isLast={true}
                />
              </SettingsGroup>

              {/* Security Section */}
              <SettingsGroup title="Security">
                <SettingsItem
                  icon="🔐"
                  title="2-Step Auth"
                  onPress={handlePress}
                  isLast={true}
                />
                <SettingsItem
                  icon="📱"
                  title="Logout"
                  onPress={() => navigation.navigate("LogoutScreen")}
                />
              </SettingsGroup>

              <View style={styles.bottomSpacing} />
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// (Keep your styles — no need to change)


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1B72B5',
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
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  contentContainerDark: {
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  
  // Profile Card Styles
  profileCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  profileCardDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#1B72B5',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileNameDark: {
    color: '#FFFFFF',
  },
  profileRole: {
    fontSize: 14,
    color: '#666',
  },
  profileRoleDark: {
    color: '#999',
  },
  editIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1B72B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconText: {
    fontSize: 16,
  },

  // Settings Group Styles
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupTitleDark: {
    color: '#CCCCCC',
  },
  groupContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  groupContainerDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },

  // Settings Item Styles
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsItemDark: {
    backgroundColor: '#2a2a2a',
    borderBottomColor: '#3a3a3a',
  },
  settingsItemLast: {
    borderBottomWidth: 0,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  iconContainerDark: {
    backgroundColor: '#3a3a3a',
  },
  settingsIcon: {
    fontSize: 18,
  },
  settingsItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingsItemTextDark: {
    color: '#FFFFFF',
  },
  chevron: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  chevronDark: {
    color: '#666',
  },

  bottomSpacing: {
    height: 40,
    marginBottom: 100,
  },
});