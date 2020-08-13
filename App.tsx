import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { StyleSheet } from "react-native";

import Me from "./profile/Me";
import QueuePage from "./queue-view/queue-page";
import ProfilePage from "./profile/profile-page";
import { BusinessListScreen } from "./feed/feed";
import { BusinessLocation, copyBusLoc } from "./util/business";
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
import { Customer } from "./util/customer"
import { getCustomer, getAllBusinessLocations, getBusinessLocationsFromArray, postCustomer, getQueue, newCustomer } from "./util/api-functions";
import { auth } from './firebase';
import { Queue } from "./util/queue";
import { getBusPic } from "./util/storage-func";

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
      {/*<BottomNavigationTab icon={MeIcon} title="ME" />*/}
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

const TabNavigator = ({ setUser, currUser, setQueueBusiness, business, setFavs, feedLists, queueId, setQueueId, setRecents }: TabProps) => (
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
        setUser={setUser}
        setRecents={setRecents}
      />}
    </Tab.Screen>
    {/*<Tab.Screen name="Me">
      {() => <ProfileWrapper setUser={setUser} currUser={currUser} />}
      </Tab.Screen>*/}
    <Tab.Screen name="Queue">
      {() => <QueuePage
        queueId={queueId}
        setQueueBusiness={setQueueBusiness}
        setQueueId={setQueueId}
        currUser={currUser}
        setUser={setUser}
        businessName={business?.name}
      />}
    </Tab.Screen>
  </Tab.Navigator>
);

// const ProfileWrapper = ({ setUser, currUser }: RenderProps) => (
//   currUser.uid.length > 0 ? <ProfilePage setUser={setUser} currUser={currUser} /> : <Me setUser={setUser} currUser={currUser} />
// );

export default function App() {

  const [currUser, setUser] = useState<Customer>(new Customer());
  const [recents, setRecents] = useState<BusinessLocation[]>([]);
  const [favs, setFavs] = useState<BusinessLocation[]>([]);
  const [businesses, setBusinesses] = useState<BusinessLocation[]>([]);
  const [business, setBusiness] = useState<BusinessLocation | undefined>(); // business that you are in a queue with
  const [queueId, setQueueId] = useState<string>('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async function (user) {
      if (user) {
        let customer: Customer;

        try {
          customer = await getCustomer(user.uid);
        } catch (errror) {
          customer = await newCustomer(user.uid);
        }

        const newFavs = await getBusinessLocationsFromArray(customer.favorites);

        const newRecents = await getBusinessLocationsFromArray(customer.recents);

        const businessLocations = await getAllBusinessLocations();


        if (customer.currentQueue.length !== 0) {
          for (const biz of businessLocations) {
            if (biz.queues[0] === customer.currentQueue) {
              setBusiness(biz);
              break;
            }
          }
        }

        setBusinesses(businessLocations);
        setRecents(newRecents);
        setFavs(newFavs);
        setQueueId(customer.currentQueue);
        setUser(customer);
      } else {
        auth.signInAnonymously().catch((error) => {
          console.error(error);
        });
      }
    });

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    setImageURL(businesses, setBusinesses);
  }, [businesses]);

  useEffect(() => {
    setImageURL(recents, setRecents);
  }, [recents]);

  useEffect(() => {
    setImageURL(favs, setFavs);
  }, [favs]);

  const setImageURL = async (feedList: BusinessLocation[], setNew: (entry: any) => void) => {
    let copy = [];
    let set = 0;
    for (let i = 0; i < feedList.length; i++) {
      if (feedList[i].images.length != 0 && feedList[i].imageURL == undefined) {
        console.log('getting image for : ' + feedList[i]);
        await getBusPic(feedList[i].uid, feedList[i].images[0], (URL: string) => {
          let cur = copyBusLoc(feedList[i]);
          cur.imageURL = URL;
          copy.push(cur);
          set = 1;
        });
      } else {
        copy.push(copyBusLoc(feedList[i]));
      }
    }
    if (set) {
      setNew(copy);
    }
  }

  useEffect(() => {
    if (currUser.uid.length !== 0 && currUser.favorites.length !== favs.length) {
      const newFavs = favs.map((b: BusinessLocation) => b.queues[0]); // gets the uids of each business location
      const newCustomer = {
        ...currUser,
        favorites: newFavs,
      };
      setUser(newCustomer);
    }
  }, [favs, currUser]);


  useEffect(() => {
    if (currUser.uid.length !== 0 && currUser.recents.length !== recents.length) {
      const newRecs = recents.map((b: BusinessLocation) => b.queues[0]) // get the uids of each business location
      const newCustomer = {
        ...currUser,
        recents: newRecs,
      };
      setUser(newCustomer);
    }
  }, [recents, currUser]);


  useEffect(() => {
    if (currUser.uid.length !== 0) {
      postCustomer(currUser);
    }
  }, [currUser]);


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