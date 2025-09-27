// App.js
//import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
///import LoginScreen from "../components/LoginScreen";
//import SignupForm from "../components/SignupForm";
//import SplashScreen from "../components/SplashScreen";
//import HomeScreen from "./components/HomeScreen";
import Tabs from "../navigation/Tabs";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Signup: undefined;
  Tab: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        { /*<Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Signup" component={SignupForm} /> */}
        <Stack.Screen name="Tab" component={Tabs} />


      </Stack.Navigator>
    
  
  );
}
