import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';


// Auth screens
import DeviceVerificationScreen from './src/screens/Auth/DeviceVerificationScreen';
import ForgotPasswordScreen from './src/screens/Auth/ForgotPassword';
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignUpScreen from './src/screens/Auth/SignupScreen';
import SplashScreen from './src/screens/Auth/SplashScreen';

// Lecturer screens
import Classes from './src/screens/Lecturer/Classes';
import LecturerClassSession from './src/screens/Lecturer/ClassSessionCode';
import LecturerDashboard from './src/screens/Lecturer/LecturerDashboard';
import Settings from './src/screens/Lecturer/Settings';

// Student screens
import StudentAssignment from './src/screens/Student/Assignment';
import StudentAttendance from './src/screens/Student/Attendance';
import StudentDashboard from './src/screens/Student/Dashboard';
//import StudentSettings from './src/screens/Student/StudentSettings';
import StudentStack from './components/SettingsStack';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Student Bottom Tabs
function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Assignment') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'calendar-check' : 'calendar-check-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1B72B5',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={StudentDashboard} />
      <Tab.Screen name="Assignment" component={StudentAssignment} />
      <Tab.Screen name="Attendance" component={StudentAttendance} />
      <Tab.Screen name="Settings" component={StudentStack} />
    </Tab.Navigator>
  );
}


// Lecturer Bottom Tabs
function LecturerTabs() {
  return (
    <Tab.Navigator 
    screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Classes') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Session') {
            iconName = focused ? 'play' : 'play';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1B72B5',
        tabBarInactiveTintColor: 'gray',
      })}
    
    >
      <Tab.Screen name="Home" component={LecturerDashboard} />
      <Tab.Screen name="Classes" component={Classes} />
      <Tab.Screen name="Session" component={LecturerClassSession} />
      <Tab.Screen name="Settings" component={Settings} />

    </Tab.Navigator>
  );
}

export default function App() {
  const [userType, setUserType] = useState<'student' | 'lecturer' | null>(null);

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="DeviceVerification" component={DeviceVerificationScreen} />

        {/* Main Root Screens */}
        <Stack.Screen name="StudentRoot" component={StudentTabs} />
        <Stack.Screen name="LecturerRoot" component={LecturerTabs} />
      </Stack.Navigator>
  );
}
