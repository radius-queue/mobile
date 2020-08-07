import React, {useEffect, useState, useRef} from "react";
import { StyleSheet } from "react-native";

import Me from "./profile/Me";
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
import {getCustomer} from "./util/api-functions";
import { auth} from './firebase';

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

interface TabProps {
  signedIn : boolean,
  setSignedIn: (b: boolean) => void,
}

const TabNavigator = ({signedIn} : TabProps) => (
  <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Feed">
      {() => <BusinessListScreen {...businesses} />}
    </Tab.Screen>
    <Tab.Screen name="Me">
      {() => <ProfileWrapper signedIn={signedIn}/>}
    </Tab.Screen>
    <Tab.Screen name="Queue" component={QueuePage} />
  </Tab.Navigator>
);

const ProfileWrapper = ({signedIn}: {signedIn : boolean}) => (
  signedIn ? <ProfilePage {...sampleUserInfo} /> : <Me />
);

export default function App() {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const currUser = useRef<Customer>();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const customer = await getCustomer(user.uid);
        setSignedIn(true);
        currUser.current = customer;
        console.log(currUser.current);
      } else {
        currUser.current = new Customer('', '', '', '', '', '', [], []);
        console.log(currUser.current);
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
]       </NavigationContainer>
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