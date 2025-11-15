// App.tsx - Updated sections for role-based chat
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// ===== Auth Screens =====
import DeviceVerificationScreen from './src/screens/Auth/DeviceVerificationScreen';
import ForgotPasswordScreen from './src/screens/Auth/ForgotPassword';
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignUpScreen from './src/screens/Auth/SignupScreen';
import SplashScreen from './src/screens/Auth/SplashScreen';

// ===== Lecturer Screens =====
import LecturerClassSession from './src/screens/Lecturer/ClassSessionCode';
import LecturerDashboard from './src/screens/Lecturer/LecturerDashboard';
import LecturerSignUpScreen from './src/screens/Auth/LecturerSignup';
import SettingsStackL from './components/SettingsStackL';
import LecturerChatListScreen from './src/screens/Chat/LecturerChatListScreen';
import LecturerAssignmentScreen from './src/screens/Lecturer/LecturerAssignmentScreen.tsx';

// ===== Student Screens =====
import StudentAssignment from './src/screens/Student/Assignment';
import StudentAttendance from './src/screens/Student/Attendance';
import StudentDashboard from './src/screens/Student/Dashboard';
import StudentStack from './components/SettingsStack';
import StudentChatListScreen from './src/screens/Chat/StudentChatListScreen';
import AIChatScreen from './src/screens/Student/AIChatScreen';

// ===== Chat Screens (Shared) =====
import ChatRoomScreen from './src/screens/Chat/ChatRoomScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();

// ==================== Student Chat Stack ====================
function StudentChatStackNavigator({ userId, userRole }: { userId: string; userRole: 'student' | 'lecturer' }) {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: true }}>
      <ChatStack.Screen
        name="ChatList"
        options={{ title: 'Messages' }}
      >
        {(props) => (
          <StudentChatListScreen
            {...props}
            userId={userId}
            userRole={userRole}
          />
        )}
      </ChatStack.Screen>
      <ChatStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }: any) => ({
          title: route.params?.className || 'Chat',
          headerBackTitle: 'Back',
        })}
      />
    </ChatStack.Navigator>
  );
}

// ==================== Lecturer Chat Stack ====================
function LecturerChatStackNavigator({ userId, userRole }: { userId: string; userRole: 'student' | 'lecturer' }) {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: true }}>
      <ChatStack.Screen
        name="ChatList"
        options={{ title: 'My Classes' }}
      >
        {(props) => (
          <LecturerChatListScreen
            {...props}
            userId={userId}
            userRole={userRole}
          />
        )}
      </ChatStack.Screen>
      <ChatStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }: any) => ({
          title: route.params?.className || 'Chat',
          headerBackTitle: 'Back',
        })}
      />
    </ChatStack.Navigator>
  );
}

// ==================== Student Tabs ====================
function StudentTabs() {
  const { user } = useAuth();
  const userId = user?.id || '';
  const userRole: 'student' | 'lecturer' = 'student';

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
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chat' : 'chat-outline';
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
      <Tab.Screen
        name="Chat"
        options={{ tabBarLabel: 'Chat' }}
      >
        {() => <StudentChatStackNavigator userId={userId} userRole={userRole} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" component={StudentStack} />
    </Tab.Navigator>
  );
}

// ==================== Lecturer Tabs ====================
function LecturerTabs() {
  const { user } = useAuth();
  const userId = user?.id || '';
  const userRole: 'student' | 'lecturer' = 'lecturer';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chat' : 'chat-outline';
          } else if (route.name === 'Session') {
            iconName = focused ? 'play' : 'play';
          } else if (route.name === 'Assignment') {
            iconName = focused ? 'book' : 'book-outline';
          }else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1B72B5',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={LecturerDashboard} />
      <Tab.Screen name="Session" component={LecturerClassSession} />
      <Tab.Screen
        name="Chat"
        options={{ tabBarLabel: 'Classes' }}
      >
        {() => <LecturerChatStackNavigator userId={userId} userRole={userRole} />}
      </Tab.Screen>
      <Tab.Screen name="Assignment" component={LecturerAssignmentScreen} />
      <Tab.Screen name="Settings" component={SettingsStackL} />
    </Tab.Navigator>
  );
}

// ==================== App Navigator (Handles Auth) ====================
function AppNavigator() {
  const { isAuthenticated, userType } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="LecturerSignUpScreen" component={LecturerSignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="DeviceVerification" component={DeviceVerificationScreen} />
        </>
      ) : userType === 'student' ? (
        <>
          <Stack.Screen name="StudentRoot" component={StudentTabs} />
          <Stack.Screen name="AIChat" component={AIChatScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="LecturerRoot" component={LecturerTabs} />
        </>
      )}
    </Stack.Navigator>
  );
}

// ==================== Root App Component ====================
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}