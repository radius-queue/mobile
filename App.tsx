import React, {useEffect, useState} from "react";
import { StyleSheet } from "react-native";

import Me from "./profile/Me";
import QueuePage from "./queue-view/queue-page";
import ProfilePage from "./profile/profile-page";
import { BusinessListScreen, businesses } from "./feed/feed";
import { sampleUserInfo } from "./profile/profile-page";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import { auth} from './firebase';
import { getCustomer } from "./util/api-functions";

const Tab = createBottomTabNavigator();

const FeedIcon = (props: any) => <Icon {...props} name="browser-outline" />;
const MeIcon = (props: any) => <Icon {...props} name="person-outline" />;
const QueueIcon = (props: any) => <Icon {...props} name="list-outline" />;


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
    <BottomNavigationTab icon={FeedIcon} title="FEED" />
    <BottomNavigationTab icon={MeIcon} title="Me" />
    <BottomNavigationTab icon={QueueIcon} title="QUEUE" />
  </BottomNavigation>
);

const ProfileWrapper = ({signedIn, setSignedIn} : TabProps) => (
  signedIn ? <ProfilePage {...sampleUserInfo} /> : <Me setSignedIn={setSignedIn}/>
);

interface TabProps {
  signedIn : boolean,
  setSignedIn: (b: boolean) => void,
}

export default function App() {
  const [signedIn, setSignedIn] = useState<boolean>(false);

  const TabNavigator = ({signedIn, setSignedIn} : TabProps) => (
    <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
      <Tab.Screen name="Feed">
        {() => <BusinessListScreen {...businesses} />}
      </Tab.Screen>
      <Tab.Screen name="Me">
        {() => <ProfileWrapper setSignedIn={setSignedIn} signedIn={signedIn}/>}
      </Tab.Screen>
      <Tab.Screen name="Queue" component={QueuePage} />
    </Tab.Navigator>
  );

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const customer = await getCustomer(user.uid);
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    });
    return unsub;
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <NavigationContainer>
          <TabNavigator signedIn={signedIn} setSignedIn={setSignedIn}/>
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
