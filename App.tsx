import React, {useEffect, useState, useRef, Dispatch, SetStateAction} from "react";
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
import { watchPositionAsync } from "expo-location";

let currUser = new Customer('', '' ,'', '', '',);

export interface CurrUserProps {
  currUser: Customer,
}

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

const TabNavigator = ({rerenderApp, setRerenderApp, currUser}: RenderProps) => (
  <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Feed">
      {() => <BusinessListScreen {...businesses} />}
    </Tab.Screen>
    <Tab.Screen name="Me">
      {() => <ProfileWrapper rerenderApp={rerenderApp} setRerenderApp={setRerenderApp} currUser={currUser}/>}
    </Tab.Screen>
    <Tab.Screen name="Queue" component={QueuePage} />
  </Tab.Navigator>
);

const ProfileWrapper = ({rerenderApp, setRerenderApp, currUser}: RenderProps) => (
  currUser.email.length > 0 ? <ProfilePage rerenderApp={rerenderApp} setRerenderApp={setRerenderApp} currUser={currUser} /> : <Me rerenderApp={rerenderApp} setRerenderApp={setRerenderApp} currUser={currUser} />
);

export interface RenderProps {
  rerenderApp: number,
  setRerenderApp: React.Dispatch<React.SetStateAction<number>>,
  currUser: Customer,
}

export default function App() {

  const [rerenderApp, setRerenderApp] = useState<number>(0);

  useEffect(() => {
    auth.onAuthStateChanged(async function(user) {
      if (user) {
        if (currUser.email !== 'register') {
          await getCustomer(user.uid).then((retrievedCustomer) => {
            currUser = retrievedCustomer;
            console.log(`App.tsx (101) - Auth changed: ${currUser.email}`);
            setRerenderApp(rerenderApp + 1);
          })
        } else {
          let a: string = 'register';
          while (a !== 'register') {
            a = currUser.email;
          }
          await getCustomer(user.uid).then((retrievedCustomer) => {
            currUser = retrievedCustomer;
            console.log(`App.tsx (101) - Auth changed: ${currUser.email}`);
            setRerenderApp(rerenderApp + 99);
          })
        }
      } else {
        currUser = new Customer('', '' ,'', '', '',);
      }
    }); 
  }, []);

  console.log(`App.tsx (98) - Page rendered: ${currUser.email}`);
  console.log(`App.tsx (99) - currUser at render:`);
  console.log(currUser);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <NavigationContainer>
          <TabNavigator rerenderApp={rerenderApp} setRerenderApp={setRerenderApp} currUser={currUser}/>
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