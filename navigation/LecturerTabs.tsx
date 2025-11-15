import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import ClassSessionCode from '../src/screens/Lecturer/ClassSessionCode';
import LecturerDashboard from '../src/screens/Lecturer/LecturerDashboard';

const Tab = createBottomTabNavigator();



// Classes Screen
function ClassesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Classes Screen</Text>
    </View>
  );
}

// Code Screen
function CodeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Code Screen</Text>
    </View>
  );
}

// Settings Screen
function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
  );
}

export default function LecturerTabs() {
  return (
    
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Classes') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Code') {
              iconName = focused ? 'code-slash' : 'code-slash-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={LecturerDashboard} />
        <Tab.Screen name="Classes" component={ClassSessionCode} />
        <Tab.Screen name="Code" component={CodeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
