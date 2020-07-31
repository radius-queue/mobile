import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";

import Me from "./profile/Me";
import Login from "./profile/Login";
import Register from "./profile/Register";
import BusinessInfoScreen from "./business-info/business-info";
import { BusinessInfo, User } from "./business-info/data";
import DevPage from "./dev-page";
import QueuePage from "./queue-view/queue-page";
import ProfilePage from "./profile/profile-page";

import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import {
  ApplicationProvider,
  BottomNavigation,
  BottomNavigationTab,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { BusinessListScreen, businesses } from "./feed/feed";

import { sampleUserInfo } from "./profile/profile-page";

import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { default as theme } from "./custom-theme.json";

const Tab = createBottomTabNavigator();

const feedIcon = <Entypo name="news" size={24} color="white" />;
const meIcon = <MaterialIcons name="person" size={30} color="white" />;
const queueIcon = <Fontisto name="list-1" size={22} color="white" />;
const devIcon = <MaterialIcons name="developer-mode" size={24} color="white" />;
const profileIcon = <AntDesign name="tags" size={30} color="white" />;

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Me"
    tabBarOptions={{
      activeTintColor: "#DB8B00",
      inactiveTintColor: "white",
      activeBackgroundColor: "#091C7A",
      inactiveBackgroundColor: "#091C7A",
    }}
  >
    <Tab.Screen
      name="Dev"
      component={DevPage}
      options={{
        tabBarLabel: "DEV",
        tabBarIcon: () => devIcon,
      }}
    />
    <Tab.Screen
      name="Feed"
      options={{
        tabBarLabel: "FEED",
        tabBarIcon: () => feedIcon,
      }}
    >
      {() => <BusinessListScreen {...businesses} />}
    </Tab.Screen>
    <Tab.Screen
      name="Me"
      component={Me}
      options={{
        tabBarLabel: "ME",
        tabBarIcon: () => meIcon,
      }}
    />
    <Tab.Screen
      name="Queue"
      component={QueuePage}
      options={{
        tabBarLabel: "QUEUE",
        tabBarIcon: () => queueIcon,
      }}
    />
    <Tab.Screen
      name="Profile"
      options={{
        tabBarLabel: "PROFILE",
        tabBarIcon: () => profileIcon,
      }}
    >
      {() => <ProfilePage {...sampleUserInfo} />}
    </Tab.Screen>
  </Tab.Navigator>
);

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <NavigationContainer>
        <TabNavigator />
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
