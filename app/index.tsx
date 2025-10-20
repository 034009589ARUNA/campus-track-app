// App.js
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
//import LoginScreen from "../components/LoginScreen";
//import SignupForm from "../components/SignupForm";
//import SplashScreen from "../components/SplashScreen";
import AuthStack from "../navigation/AuthStack.";
//import Tab2 from "../navigation/Tab2";
//import Tabs from "../navigation/Tabs";
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Tab: undefined;
  Tabs: undefined;
  //Login: undefined;
 // SignupForm: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    
      <Stack.Navigator screenOptions={{ headerShown: false }}>
       {/* <Stack.Screen name="Splash" component={SplashScreen} /> 
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Signup" component={SignupForm} /> 
         <Stack.Screen name="Tab" component={Tabs} />  
        <Stack.Screen name="Tabs" component={Tab2} /> */}
       <Stack.Screen name="Auth" component={AuthStack} /> 


      </Stack.Navigator>
    
    
  
  );
}
