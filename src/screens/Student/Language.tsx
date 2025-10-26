import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChangeLanguage = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isSaving, setIsSaving] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const languages = [
    {
      id: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      description: 'Language of international communication',
      speakers: '1.5B+ speakers',
    },
    {
      id: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      description: 'Widely spoken language in many countries',
      speakers: '500M+ speakers',
    },
    {
      id: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      description: 'Language of diplomacy and culture',
      speakers: '280M+ speakers',
    },
    {
      id: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      description: 'Language of science and technology',
      speakers: '130M+ speakers',
    },
    {
      id: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
      description: 'Spoken across Africa and South America',
      speakers: '260M+ speakers',
    },
    {
      id: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      description: 'The most spoken language in the world',
      speakers: '1.1B+ speakers',
    },
    {
      id: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      description: 'Official language of 26 countries',
      speakers: '420M+ speakers',
    },
    {
      id: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      description: 'Language of innovation and technology',
      speakers: '125M+ speakers',
    },
  ];

  // Animate on language selection
  const animateSelection = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSelectLanguage = (languageId) => {
    setSelectedLanguage(languageId);
    animateSelection();
  };

  const handleSaveLanguage = () => {
    const selectedLang = languages.find((lang) => lang.id === selectedLanguage);

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Success',
        `Language changed to ${selectedLang.name}!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // You can trigger app restart or language change here
              navigation.goBack?.();
            },
          },
        ]
      );
    }, 1500);
  };

  const LanguageCard = ({ language, isSelected }) => (
    <TouchableOpacity
      style={[styles.languageCard, isSelected && styles.languageCardSelected]}
      onPress={() => handleSelectLanguage(language.id)}
      activeOpacity={0.7}
    >
      <View style={styles.languageCardContent}>
        <View style={styles.languageHeader}>
          <Text style={styles.flagEmoji}>{language.flag}</Text>
          <View style={styles.languageNameContainer}>
            <Text style={styles.languageName}>{language.name}</Text>
            <Text style={styles.languageNativeName}>{language.nativeName}</Text>
          </View>
        </View>

        <Text style={styles.languageDescription}>{language.description}</Text>
        <Text style={styles.languageSpeakers}>{language.speakers}</Text>
      </View>

      {isSelected && (
        <View style={styles.selectedCheckmark}>
          <Icon name="check-circle" size={24} color="#1B72B5" />
        </View>
      )}
    </TouchableOpacity>
  );

  const currentLanguage = languages.find((lang) => lang.id === selectedLanguage);

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
            <Text style={styles.headerTitle}>Select Language</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Current Selection Preview */}
            <View style={styles.previewCard}>
              <View style={styles.previewContent}>
                <Text style={styles.previewLabel}>Current Selection</Text>
                <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
                  <View style={styles.previewLanguage}>
                    <Text style={styles.previewFlagEmoji}>
                      {currentLanguage?.flag}
                    </Text>
                    <View>
                      <Text style={styles.previewName}>
                        {currentLanguage?.name}
                      </Text>
                      <Text style={styles.previewNativeName}>
                        {currentLanguage?.nativeName}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              </View>
            </View>

            {/* Available Languages Title */}
            <Text style={styles.sectionTitle}>Available Languages</Text>

            {/* Languages Grid */}
            <View style={styles.languagesContainer}>
              {languages.map((language) => (
                <LanguageCard
                  key={language.id}
                  language={language}
                  isSelected={selectedLanguage === language.id}
                />
              ))}
            </View>

            {/* Language Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="information" size={24} color="#1B72B5" />
                <Text style={styles.infoTitle}>Language Preferences</Text>
              </View>
              <Text style={styles.infoText}>
                • Language changes will apply immediately across the app{'\n'}
                • Your profile data remains unchanged{'\n'}
                • You can change your language anytime{'\n'}
                • Some content may not be available in all languages
              </Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                isSaving && styles.saveButtonDisabled,
              ]}
              onPress={handleSaveLanguage}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <>
                  <Icon name="loading" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Icon name="check-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save Language</Text>
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

            {/* Tips Card */}
            <View style={styles.tipsCard}>
              <Icon name="lightbulb-on" size={20} color="#FF9800" />
              <View style={styles.tipsContent}>
                <Text style={styles.tipsTitle}>Translation Tips</Text>
                <Text style={styles.tipsText}>
                  • Machine translations may not be 100% accurate{'\n'}
                  • Report translation issues to help us improve{'\n'}
                  • UI updates happen after app restart
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ChangeLanguage;

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
  previewCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#1B72B5',
  },
  previewContent: {
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    fontWeight: '600',
  },
  previewLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewFlagEmoji: {
    fontSize: 48,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  previewNativeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  languagesContainer: {
    marginBottom: 25,
  },
  languageCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageCardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1B72B5',
    borderWidth: 2,
  },
  languageCardContent: {
    flex: 1,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flagEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  languageNameContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  languageNativeName: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  languageDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  languageSpeakers: {
    fontSize: 12,
    color: '#1B72B5',
    fontWeight: '500',
  },
  selectedCheckmark: {
    marginLeft: 12,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B72B5',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#0D47A1',
    lineHeight: 18,
    marginLeft: 32,
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
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