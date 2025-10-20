import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { ScrollView } from 'react-native-gesture-handler';
import SettingsStack from '../components/SettingsStack';
import Assignment from '../screens/Assignment';
import Attendance from '../screens/Attendance';
import Dashboard from '../screens/Dashboard';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// AI Screen Component
const AIAssistant = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    // Pulse animation for AI icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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
  }, []);

  const features = [
    {
      id: 1,
      icon: '💡',
      title: 'Smart Help',
      desc: 'Get instant help with assignments and concepts',
      gradient: ['#6C63FF', '#8B7FFF'],
    },
    {
      id: 2,
      icon: '📚',
      title: 'Study Tips',
      desc: 'Personalized learning strategies for success',
      gradient: ['#FF6B9D', '#FFA07A'],
    },
    {
      id: 3,
      icon: '⏰',
      title: 'Schedule',
      desc: 'Smart study time management and reminders',
      gradient: ['#4ECDC4', '#44A08D'],
    },
    {
      id: 4,
      icon: '🎯',
      title: 'Goals',
      desc: 'Track progress and achieve your targets',
      gradient: ['#F7971E', '#FFD200'],
    },
  ];

  return (
    <SafeAreaView 
      style={styles.aiContainer} 
      edges={['top', 'left', 'right']}
    >
      <ScrollView>
      <View style={styles.aiContent}>
        <View style={styles.aiHeader}>
          <Animated.View 
            style={[
              styles.aiIconContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <View style={styles.aiIconInner}>
              <Text style={styles.aiIcon}>🤖</Text>
              <View style={styles.aiGlowEffect} />
            </View>
          </Animated.View>
          <Text style={styles.aiTitle}>
            AI Study Assistant
          </Text>
          <Text style={styles.aiSubtitle}>
            Your personal learning companion
          </Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>
            How can I help you today?
          </Text>
          
          <View style={styles.aiFeatures}>
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureCard,
                  selectedFeature === feature.id && styles.featureCardSelected
                ]}
                onPress={() => setSelectedFeature(feature.id)}
                activeOpacity={0.7}
              >
                <View style={styles.featureContent}>
                  <View style={[
                    styles.featureIconContainer,
                    { backgroundColor: `${feature.gradient[0]}15` }
                  ]}>
                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>
                      {feature.title}
                    </Text>
                    <Text style={styles.featureDesc}>
                      {feature.desc}
                    </Text>
                  </View>
                </View>
                {selectedFeature === feature.id && (
                  <View style={[styles.selectedCheck, { backgroundColor: feature.gradient[0] }]}>
                    <Icon name="check" size={14} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.aiChatButton}
            activeOpacity={0.8}
          >
            <Icon name="message-text" size={20} color="#FFFFFF" style={styles.chatIcon} />
            <Text style={styles.aiChatText}>Start Conversation</Text>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.quickActions}>
            <Text style={styles.quickActionsTitle}>
              Quick Actions
            </Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionBtn}>
                <Text style={styles.quickActionIcon}>📝</Text>
                <Text style={styles.quickActionText}>Summarize</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionBtn}>
                <Text style={styles.quickActionIcon}>🔍</Text>
                <Text style={styles.quickActionText}>Research</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionBtn}>
                <Text style={styles.quickActionIcon}>✅</Text>
                <Text style={styles.quickActionText}>Quiz Me</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionBtn}>
                <Text style={styles.quickActionIcon}>💭</Text>
                <Text style={styles.quickActionText}>Explain</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Custom Tab Bar Component with auto-hide
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const hideTabBar = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const showTabBar = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View 
      style={[
        styles.customTabBar,
        { transform: [{ translateY }] }
      ]}
    >
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : options.title !== undefined 
            ? options.title 
            : route.name;

          const isFocused = state.index === index;
          let iconName;
          let specialIcon = null;
          
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Assignment":
              iconName = "book-open-variant";
              break;
            case "AI":
              specialIcon = true;
              iconName = "robot";
              break;
            case "Attendance":
              iconName = "calendar-check";
              break;
            case "Settings":
              iconName = "cog";
              break;
            default:
              iconName = "circle";
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[
                styles.tabItem,
                specialIcon && styles.aiTabItem,
                isFocused && !specialIcon && styles.tabItemActive,
              ]}
              activeOpacity={0.8}
            >
              {specialIcon ? (
                <View style={[
                  styles.aiTabIcon,
                  isFocused && styles.aiTabIconActive
                ]}>
                  <View style={styles.aiGlow}>
                    <Icon 
                      name={iconName} 
                      size={24} 
                      color={isFocused ? "#FFFFFF" : "#1B72B5"} 
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.tabIcon}>
                  <Icon 
                    name={iconName} 
                    size={22} 
                    color={isFocused ? "#1B72B5" : "#8E8E93"} 
                  />
                </View>
              )}
              
              <Text style={[
                styles.tabLabel,
                isFocused && styles.tabLabelActive,
              ]}>
                {label}
              </Text>
              
              {isFocused && !specialIcon && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default function Tabs() {
  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: '#1B72B5' }} 
      edges={['top', 'left', 'right']}
    >
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={Dashboard}
          options={{ title: 'Home' }}
        />
        <Tab.Screen 
          name="Assignment" 
          component={Assignment}
          options={{ title: 'Tasks' }}
        />
        <Tab.Screen 
          name="AI" 
          component={AIAssistant}
          options={{ title: 'AI' }}
        />
        <Tab.Screen 
          name="Attendance" 
          component={Attendance}
          options={{ title: 'Check-in' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsStack}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // AI Screen Styles
  aiContainer: {
    flex: 1,
    backgroundColor: '#1B72B5',
  },
  aiContent: {
    flex: 1,
  },
  aiHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  aiIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  aiIconInner: {
    position: 'relative',
  },
  aiIcon: {
    fontSize: 50,
  },
  aiGlowEffect: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(108, 99, 255, 0.3)',
    top: -15,
    left: -15,
    zIndex: -1,
  },
  aiTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  aiSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  aiFeatures: {
    marginBottom: 25,
  },
  featureCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureCardSelected: {
    borderWidth: 2,
    borderColor: '#6C63FF',
    backgroundColor: '#FFFFFF',
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  selectedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiChatButton: {
    backgroundColor: '#1B72B5',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B72B5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 25,
  },
  chatIcon: {
    marginRight: 10,
  },
  aiChatText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  quickActions: {
    marginTop: 10,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionBtn: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },

  // Custom Tab Bar Styles
  customTabBar: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    right: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    zIndex: 1000,
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 20,
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: 'rgba(27, 114, 181, 0.1)',
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
  },
  tabLabelActive: {
    fontWeight: '600',
    color: '#1B72B5',
  },
  activeIndicator: {
    position: 'absolute',
    top: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1B72B5',
  },
  aiTabItem: {
    transform: [{ scale: 1 }],
  },
  aiTabIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(27, 114, 181, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'rgba(27, 114, 181, 0.3)',
  },
  aiTabIconActive: {
    backgroundColor: '#1B72B5',
    borderColor: '#1B72B5',
    shadowColor: '#1B72B5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.05 }],
  },
  aiGlow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 40,
    marginBottom: 30,
  },
});