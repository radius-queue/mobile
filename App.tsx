import React from "react";
import { StyleSheet } from "react-native";

import Me from "./profile/Me";
import DevPage from "./dev-page";
import QueuePage from "./queue-view/queue-page";
import ProfilePage from "./profile/profile-page";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  ApplicationProvider,
  BottomNavigation,
  BottomNavigationTab,
  IconRegistry,
  Icon,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { BusinessListScreen, businesses } from "./feed/feed";

import { default as theme } from "./custom-theme.json";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

const Tab = createBottomTabNavigator();

<IconRegistry icons={EvaIconsPack} />;
const devIcon = (props) => <Icon {...props} name="code-outline" />;

const BottomTabBar = (Navigator: {
  state: { index: number | undefined; routeNames: any[] };
  navigation: { navigate: (arg0: any) => void };
}) => (
  <BottomNavigation
    selectedIndex={Navigator.state.index}
    onSelect={(index) =>
      Navigator.navigation.navigate(Navigator.state.routeNames[index])
    }
  >
    <BottomNavigationTab title="DEV" />
    <BottomNavigationTab title="FEED" />
    <BottomNavigationTab title="ME" />
    <BottomNavigationTab title="QUEUE" />
    <BottomNavigationTab title="PROFILE" />
  </BottomNavigation>
);

const TabNavigator = () => (
  <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Dev" component={DevPage} />
    <Tab.Screen name="Feed">
      {() => <BusinessListScreen {...businesses} />}
    </Tab.Screen>
    <Tab.Screen name="Me" component={Me} />
    <Tab.Screen name="Queue" component={QueuePage} />
    <Tab.Screen name="Profile" component={ProfilePage} />
  </Tab.Navigator>
);

export default function App() {
  <IconRegistry icons={EvaIconsPack} />;
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

/* const TabNavigator = () => (
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
); */
