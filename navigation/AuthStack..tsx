// navigation/AuthStack.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "../src/screens/Auth/LoginScreen";
import SignupForm from "../src/screens/Auth/SignupScreen";


const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupForm} />
    </Stack.Navigator>
  );
}