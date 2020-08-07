import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import Me from "./profile/Me";
import DevPage from "./dev-page";
import QueuePage from "./queue-view/queue-page";
import ProfilePage from "./profile/profile-page";
import { BusinessListScreen, businesses } from "./feed/feed";
import { sampleUserInfo } from "./profile/profile-page";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  ApplicationProvider,
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  IconRegistry,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from "./custom-theme.json";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import {Customer} from "./util/customer"
import firebase from "firebase";
import {getCustomer} from "./util/api-functions";

const Tab = createBottomTabNavigator();

const DevIcon = (props: any) => <Icon {...props} name="code-outline" />;
const FeedIcon = (props: any) => <Icon {...props} name="browser-outline" />;
const MeIcon = (props: any) => <Icon {...props} name="person-outline" />;
const QueueIcon = (props: any) => <Icon {...props} name="list-outline" />;
const ProfileIcon = (props: any) => (
  <Icon {...props} name="smiling-face-outline" />
);

const BottomTabBar = (Navigator: {
  state: { index: number | undefined; routeNames: any[] };
  navigation: { navigate: (arg0: any) => void };
}) => (
  <BottomNavigation
    selectedIndex={Navigator.state.index}
    style={styles.bottomNavigation}
    onSelect={(index) =>
      Navigator.navigation.navigate(Navigator.state.routeNames[index])
    }
  >
    <BottomNavigationTab icon={DevIcon} title="DEV" />
    <BottomNavigationTab icon={FeedIcon} title="FEED" />
    <BottomNavigationTab icon={MeIcon} title="ME" />
    <BottomNavigationTab icon={QueueIcon} title="QUEUE" />
    <BottomNavigationTab icon={ProfileIcon} title="PROFILE" />
  </BottomNavigation>
);

const TabNavigator = (user: Customer) => (
  <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Dev" component={DevPage} />
    <Tab.Screen name="Feed">
      {() => <BusinessListScreen {...businesses} />}
    </Tab.Screen>
    <Tab.Screen name="Me" component={Me} />
    <Tab.Screen name="Queue" component={QueuePage} />
    <Tab.Screen name="Profile">
      {() => <ProfilePage {...user} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const loggedInUser = firebase.auth().currentUser;
let user: Customer;
if (loggedInUser) {
  console.log("yes");
  getCustomer(loggedInUser.uid).then(function(userInfo) {
    user = new Customer(
      userInfo.firstName,
      userInfo.lastName,
      userInfo.email,
      userInfo.phoneNumber,
      userInfo.uid,
      userInfo.currentQueue,
      userInfo.favorites,
      userInfo.recents,
    );
  }).catch(function(error) {
    console.log("Unable to load user info:" + error);
  });
} else {
  console.log("no");
  user = new Customer(
    '',
    '',
    '',
    '',
    '',
  );
}

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <NavigationContainer>
          <TabNavigator {...user}/>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    display: "flex",
    alignItems: "flex-start",
    height: 70,
    backgroundColor: theme['color-basic-1100'],
  },
});