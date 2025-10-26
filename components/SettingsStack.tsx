import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChangePassword from "../src/screens/Student/ChangePassword";
import EditProfile from "../src/screens/Student/EditProfile";
import GPSpermission from "../src/screens/Student/GPSpermission";
import Language from "../src/screens/Student/Language";
import Notifications from "../src/screens/Student/Notifications";
import SetttingsScreen from "../src/screens/Student/StudentSettings";

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
      name="Settings"
      component={SetttingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Language"
      component={Language}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Notifications"
      component={Notifications}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="GPSpermission"
      component={GPSpermission}
      options={{ headerShown: false }}
    />
    
    </Stack.Navigator>
  );
}

