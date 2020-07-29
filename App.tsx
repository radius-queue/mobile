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

import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const feedIcon = <Entypo name="news" size={24} color="black" />;
const meIcon = <MaterialIcons name="person" size={30} color="black" />;
const queueIcon = <Fontisto name="list-1" size={22} color="black" />;

const TabNavigator = () => (
  <Tab.Navigator initialRouteName="DevPage">
    <Tab.Screen
      name="Dev"
      component={DevPage}
      options={{
        tabBarLabel: "DEV",
      }}
    />
    <Tab.Screen
      name="Feed"
      options={{
        tabBarLabel: "FEED",
        tabBarIcon: ({ color, size }) => feedIcon,
      }}
    >
      {() => <BusinessListScreen {...businesses} />}
    </Tab.Screen>
    <Tab.Screen
      name="Me"
      component={Me}
      options={{
        tabBarLabel: "ME",
        tabBarIcon: ({ color, size }) => meIcon,
      }}
    />
    <Tab.Screen
      name="Queue"
      component={QueuePage}
      options={{
        tabBarLabel: "QUEUE",
        tabBarIcon: ({ color, size }) => queueIcon,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfilePage}
      options={{
        tabBarLabel: "PROF",
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
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
