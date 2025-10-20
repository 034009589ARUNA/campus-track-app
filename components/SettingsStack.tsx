import Language from "@/Setttings/Language";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SetttingsScreen from "../screens/SettingsScreen";
import ChangePassword from "../Setttings/ChangePassword";
import EditProfile from "../Setttings/EditProfile";
import GPSpermission from "../Setttings/GPSpermission";
import Notifications from "../Setttings/Notifications";

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

