import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { StyleSheet } from "react-native";

import Me from "./profile/Me";
import QueuePage from "./queue-view/queue-page";
import ProfilePage from "./profile/profile-page";
import { BusinessListScreen } from "./feed/feed";
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
import {getCustomer, getAllBusinessLocations, getBusinessLocationsFromArray, postCustomer, getQueue} from "./util/api-functions";
import { auth} from './firebase';
import { Queue } from "./util/queue";

const REGISTRATION_TIME_THRESHOLD: number = 3000;

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
      <BottomNavigationTab icon={MeIcon} title="ME" />
      <BottomNavigationTab icon={QueueIcon} title="QUEUE" />
    </BottomNavigation>
  );

interface TabProps {
  setUser: (c: Customer) => void,
  currUser: Customer,
  setFavs: (b: BusinessLocation[]) => void,
  setRecents: (b: BusinessLocation[]) => void,
  feedLists: [BusinessLocation[], BusinessLocation[], BusinessLocation[]],
  setQueueBusiness: (b: BusinessLocation | undefined) => void,
  business: BusinessLocation | undefined,
  queueId: string,
  setQueueId: (s: string) => void,
}

export interface RenderProps {
  setUser: (c: Customer) => void,
  currUser: Customer,
}

const TabNavigator = ({ setUser, currUser, setQueueBusiness, business, setFavs, feedLists, queueId, setQueueId }: TabProps) => (
  <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Tab.Screen name="Feed">
      {() => <BusinessListScreen
        setQueueBusiness={setQueueBusiness}
        setFavs={setFavs}
        feedList={feedLists}
        currUser={currUser}
        business={business}
        setQueueId={setQueueId}
        queueId={queueId}
      />}
    </Tab.Screen>
    <Tab.Screen name="Me">
      {() => <ProfileWrapper setUser={setUser} currUser={currUser} />}
    </Tab.Screen>
    <Tab.Screen name="Queue">
      {() => <QueuePage
        queueId={queueId}
        setQueueBusiness={setQueueBusiness}
        setQueueId={setQueueId}
        currUser={currUser}
        setUser={setUser}
      />}
    </Tab.Screen>
  </Tab.Navigator>
);

const ProfileWrapper = ({ setUser, currUser }: RenderProps) => (
  currUser.email.length > 0 ? <ProfilePage setUser={setUser} currUser={currUser} /> : <Me setUser={setUser} currUser={currUser} />
);

export default function App() {

  const [currUser, setUser] = useState<Customer>(new Customer());
  const [recents, setRecents] = useState<BusinessLocation[]>([]);
  const [favs, setFavs] = useState<BusinessLocation[]>([]);
  const [businesses, setBusinesses] = useState<BusinessLocation[]>([]);
  const [business, setBusiness] = useState<BusinessLocation | undefined>();
  const [queueId, setQueueId] = useState<string>('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async function (user) {
      if (user) {
        if (new Date().getTime() - new Date(user.metadata.creationTime!).getTime() > REGISTRATION_TIME_THRESHOLD) { // assuming not registering
          let customer: Customer = await getCustomer(user.uid);
          
          const newFavs = await getBusinessLocationsFromArray(customer.favorites);
          setFavs(newFavs);

          const newRecents = await getBusinessLocationsFromArray(customer.recents);
          setRecents(newRecents);
          
          setQueueId(customer.currentQueue);

          setUser(customer);
        } 

        const businessLocations = await getAllBusinessLocations();
        setBusinesses(businessLocations);

      } else {
        setUser(new Customer());
        setRecents([]);
        setBusiness(undefined);
        setFavs([]);
        setBusinesses([]);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  
  useEffect(() => {
    if (currUser.email.length !== 0 && currUser.favorites.length !== favs.length) {
      const newFavs = favs.map((b: BusinessLocation) => b.queues[0]); // gets the uids of each business location
      const newCustomer = {
        ...currUser,
        favorites: newFavs,
      };
      postCustomer(newCustomer);
      setUser(newCustomer);
    }
  }, [favs, currUser]);


  useEffect(() => {
    if (currUser.email.length !== 0 && currUser.recents.length !== recents.length) {
      const newRecs = recents.map((b: BusinessLocation) => b.queues[0]) // get the uids of each business location
      const newCustomer = {
        ...currUser,
        recents: newRecs,
      };
      postCustomer(newCustomer);
      setUser(newCustomer);
    }
  }, [recents, currUser]);
  
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
            setQueueBusiness={setBusiness}
            business={business}
            queueId={queueId}
            setQueueId={setQueueId}
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