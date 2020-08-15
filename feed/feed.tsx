import React, { useState, useEffect } from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { List, Text } from '@ui-kitten/components';
import { BusinessCard } from './business-overview-card';
import Screen from '../components/screen';
import { default as theme } from "../custom-theme.json";
import { BusinessLocation } from '../util/business';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Customer } from '../util/customer';
import BusinessInfoScreen from '../business-info/business-info';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

interface FeedProps {
  setQueueBusiness: (b: BusinessLocation | undefined) => void,
  feedList: [BusinessLocation[], BusinessLocation[], BusinessLocation[]],
  setFavs: (b: BusinessLocation[]) => void,
  business: BusinessLocation | undefined,
  currUser: Customer,
  queueId: string,
  setQueueId: (q: string) => void,
  setUser: (c: Customer) => void,
  setRecents: (b: BusinessLocation[]) => void,
  assetsMap: Map<string, string>,
}

export const BusinessListScreen = ({
  feedList,
  setQueueBusiness,
  setFavs,
  currUser,
  business,
  queueId,
  setQueueId,
  setUser,
  setRecents,
  assetsMap,
}: FeedProps): React.ReactElement => {
  const [feedcnt, setCnt] = useState<number>(0);
  const navigation = useNavigation(); 

  const renderHeader = (): React.ReactElement => (
    <React.Fragment>
      {(feedList[0].length > 0) ? renderFav() : <React.Fragment />}
      {(feedList[1].length > 0) ? renderRecent() : <React.Fragment />}
      <Text
        style={styles.headerTitle}
        appearance='hint'>
        🗺 Explore
      </Text>
    </React.Fragment>
  );

  const renderFav = (): React.ReactElement => (
    <React.Fragment>
      <Text
        style={styles.headerTitle}
        appearance='hint'>
        ⭐️ Favorites
      </Text>
      <List
        contentContainerStyle={styles.horizontalList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={feedList[0]}
        renderItem={renderHorizontalTrainingItem}
      />
    </React.Fragment>
  );

  const addFav = (chosenBusiness: BusinessLocation) => {
    const newFavs = feedList[0].slice();
    newFavs.push(chosenBusiness);
    setFavs(newFavs);
  };

  const removeFav = (chosenBusiness: BusinessLocation) => {
    const favsCopy = feedList[0];
    const unfavorite = chosenBusiness;
    let newFavs: BusinessLocation[] = [];
    let i: number;
    for (i = 0; i < favsCopy.length; i++) {
      if (favsCopy[i].uid !== unfavorite.uid) {
        newFavs.push(favsCopy[i]);
      }
    }
    setFavs(newFavs);
  };

  const renderRecent = (): React.ReactElement => (
    <React.Fragment>
      <Text
        style={styles.headerTitle}
        appearance='hint'>
        ⏰ Recents
      </Text>
      <List
        contentContainerStyle={styles.horizontalList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={feedList[1]}
        renderItem={renderHorizontalTrainingItem}
      />
    </React.Fragment>
  );

  const recentsHandler = (chosenBusiness: BusinessLocation) => {
    let newRecents: BusinessLocation[] = [];
    newRecents.push(chosenBusiness!);
    const recentsCopy = feedList[1];
    let i: number;

    for (i = 0; i < recentsCopy.length; i++) {
      if (recentsCopy[i].phoneNumber !== chosenBusiness?.phoneNumber) {
        newRecents.push(recentsCopy[i]);
      }
    }
    setRecents(newRecents);
  };

  const renderAll = (): React.ReactElement => (
    <Screen style={styles.container}>
      <React.Fragment>
        <List
          contentContainerStyle={styles.list}
          data={feedList[2]}
          renderItem={renderVerticalTrainingItem}
          ListHeaderComponent={renderHeader}
        />
      </React.Fragment>
    </Screen>
  );


  const renderHorizontalTrainingItem = (info: ListRenderItemInfo<BusinessLocation>): React.ReactElement => (
    <TouchableOpacity activeOpacity={.6} onPress={() => navigation.navigate(info.item.uid)}>
      <BusinessCard
        style={styles.horizontalItem}
        business={info.item}
        assetsMap={assetsMap}
      />
    </TouchableOpacity>
  );

  const renderVerticalTrainingItem = (info: ListRenderItemInfo<BusinessLocation>): React.ReactElement => (
    <TouchableOpacity activeOpacity={.6} onPress={() => navigation.navigate(info.item.uid)}>
      <BusinessCard
        style={styles.verticalItem}
        business={info.item}
        assetsMap={assetsMap}
      />
    </TouchableOpacity>
  );

  const Stack = createStackNavigator();

  const BusinessScreen = (chosenBusiness: BusinessLocation) => {
    return(
      <Screen style={styles.container}>
        <BusinessInfoScreen
          user={currUser}
          business={chosenBusiness}
          isFavorite={feedList[0].map((b) => b.queues[0]).includes(chosenBusiness.queues[0])}
          addFav={addFav}
          removeFav={removeFav}
          queue={queueId}
          setQueue={setQueueId}
          setQueueBusiness={setQueueBusiness}
          setUser={setUser}
          recentsHandler={recentsHandler}
        /> 
      </Screen>
    );
  }



  return (
    <Stack.Navigator>
      <Stack.Screen name='Feed' options={{ headerShown: false }} component={renderAll} />
      {feedList[2].map((business) => (
        <Stack.Screen
          key={business.uid}
          name={business.uid}
          options={{ headerShown: false }}
        >
          {() => BusinessScreen(business)}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme['color-basic-900'],
  },
  list: {

  },
  headerTitle: {
    marginHorizontal: 16,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  horizontalList: {
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  verticalItem: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  horizontalItem: {
    width: 256,
    marginHorizontal: 8,
  },
});

