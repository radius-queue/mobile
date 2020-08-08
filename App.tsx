import React, {useEffect, useState, useRef, Dispatch, SetStateAction} from "react";
import { StyleSheet } from "react-native";

import Me from "./profile/Me";
import QueuePage from "./queue-view/queue-page";
import ProfilePage from "./profile/profile-page";
import { BusinessListScreen, businesses } from "./feed/feed";
import { sampleUserInfo } from "./profile/profile-page";
import type { BusinessLocation } from "./util/business";
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
import {getCustomer, getAllBusinessLocations, getBusinessLocationsFromArray} from "./util/api-functions";
import { auth} from './firebase';
import { Business } from "./util/business";

const REGISTRATION_TIME_THRESHOLD : number = 3000;

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
  setUser: (c: Customer) => void,
  currUser: Customer,
  setFavs: (b: BusinessLocation[]) => void,
  setRecents: (b: BusinessLocation[]) => void,
  feedLists: [BusinessLocation[], BusinessLocation[], BusinessLocation[]],
}

export interface RenderProps {
  setUser: (c: Customer) => void,
  currUser: Customer,
}

const TabNavigator = ({setUser, currUser, setFavs, setRecents, feedLists}: TabProps) => (
  <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Feed">
      {() => <BusinessListScreen {...businesses} />}
    </Tab.Screen>
    <Tab.Screen name="Me">
      {() => <ProfileWrapper setUser={setUser} currUser={currUser}/>}
    </Tab.Screen>
    <Tab.Screen name="Queue" component={QueuePage} />
  </Tab.Navigator>
);

const ProfileWrapper = ({setUser, currUser}: RenderProps) => (
  currUser.email.length > 0 ? <ProfilePage setUser={setUser} currUser={currUser} /> : <Me setUser={setUser} currUser={currUser} />
);

export default function App() {

  //const [rerenderApp, setRerenderApp] = useState<number>(0);
  const [currUser, setUser] = useState<Customer>(new Customer());
  const [recents, setRecents] = useState<BusinessLocation[]>([]);
  const [favs, setFavs] = useState<BusinessLocation[]>([]);
  const [businesses, setBusinesses] = useState<BusinessLocation[]>([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(function(user) {
      if (user) {
        if (new Date().getTime() - new Date(user.metadata.creationTime!).getTime() > REGISTRATION_TIME_THRESHOLD) {
          getCustomer(user.uid).then((retrievedCustomer) => {
            setUser(retrievedCustomer);
          });
        }
      } else {
        setUser(new Customer());
      }
    });

    const getBizList = async () => {
      setBusinesses(await getAllBusinessLocations());
    }

    const getFavsAndRecents = async () => {
      const favs = await getBusinessLocationsFromArray(currUser.favorites);
      const recents = await getBusinessLocationsFromArray(currUser.recents);
      setFavs(favs);
      setRecents(recents);
    }


    getBizList();
    getFavsAndRecents();

    return unsub;
  }, []);
  
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <NavigationContainer>
          <TabNavigator
            setUser={setUser}
            feedLists={[favs, recents, businesses]}
            currUser={currUser}
            setFavs={setFavs}
            setRecents={setRecents}
          />
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