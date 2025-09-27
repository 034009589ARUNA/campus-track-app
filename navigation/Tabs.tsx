import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { SafeAreaView } from 'react-native-safe-area-context';
import Assignment from '../screens/Assignment';
import Attendance from '../screens/Attendance';
import Dashboard from '../screens/Dashboard';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1B72B5' }} edges={['top', 'left', 'right']}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#007BFF",
          tabBarInactiveTintColor: "#777",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            height: 90,
            position: "absolute",
            left: 0,
            bottom: 10,
            right: 0,
            elevation: 5,
            // Shadow for iOS
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            paddingBottom: 10,
            paddingTop: 10,
            marginBottom: 40
            
               
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") iconName = "home";
            else if (route.name === "Assignment") iconName = "book-open-variant";
            else if (route.name === "Attendance") iconName = "calendar-check";
            else if (route.name === "Settings") iconName = "cog";

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={Dashboard} />
        <Tab.Screen name="Assignment" component={Assignment} />
        <Tab.Screen name="Attendance" component={Attendance} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </SafeAreaView>
    
  );
}