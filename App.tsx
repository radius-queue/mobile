import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

import LandingPage from "./LandingPage";
import Login from "./Login";
import Register from "./Register";
import BusinessInfo from './business-info';
import DevPage from './dev-page';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from '@eva-design/eva';
import { BusinessListScreen } from "./feed/feed";

const Stack = createStackNavigator();

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.dark} >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="DevPage"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="DevPage" component={DevPage}/>
          <Stack.Screen name="Home" component={LandingPage} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name='Business' component={BusinessInfo}/>
          <Stack.Screen name='Feed' component={BusinessListScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
