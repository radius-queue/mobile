import React, { useState, useEffect } from 'react';
import { ListRenderItemInfo, StyleSheet, ActivityIndicator } from 'react-native';
import { List, Text } from '@ui-kitten/components';
import { BusinessCard } from './business-overview-card';
import Screen from '../components/screen';
import { default as theme } from "../../custom-theme.json";
import { BusinessLocation } from '../util/business';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Customer } from '../util/customer';
import BusinessInfoScreen from '../business-info/business-info';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

interface FeedProps {
  setQueueBusiness: (b: BusinessLocation | undefined) => void,
  feedList: [string[], string[], BusinessLocation[]],
  setFavs: (s: string[]) => void,
  currUser: Customer,
  queueId: string,
  setQueueId: (q: string) => void,
  setUser: (c: Customer) => void,
  setRecents: (b: string[]) => void,
  assetsMap: Map<string, string>,
  businessMap: Map<string, BusinessLocation>,
  queueBusiness : BusinessLocation | undefined,
}

export const BusinessListScreen = ({
  feedList,
  setQueueBusiness,
  setFavs,
  currUser,
  queueId,
  setQueueId,
  setUser,
  setRecents,
  assetsMap,
  businessMap,
  queueBusiness,
}: FeedProps): React.ReactElement => {
  const [feedcnt, setCnt] = useState<number>(0);
  const [business, setBusiness] = useState<BusinessLocation | undefined>();

  const navigation = useNavigation(); 

  const onSelect = (biz : BusinessLocation) => {
    setBusiness(biz);
    navigation.navigate("Chosen Business");
  }

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
        data={feedList[0].map((val : string) => businessMap.get(val))}
        renderItem={renderHorizontalTrainingItem}
      />
    </React.Fragment>
  );

  const addFav = (chosenBusiness: string) => {
    const newFavs = feedList[0].slice();
    newFavs.push(chosenBusiness);
    setFavs(newFavs);
  };

  const removeFav = (chosenBusiness: string) => {
    const favsCopy = feedList[0];
    const unfavorite = chosenBusiness;
    let newFavs: string[] = [];
    let i: number;
    for (i = 0; i < favsCopy.length; i++) {
      if (favsCopy[i] !== unfavorite) {
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
        data={feedList[1].map((val) => businessMap.get(val))}
        renderItem={renderHorizontalTrainingItem}
      />
    </React.Fragment>
  );

  const recentsHandler = (chosenBusiness: string) => {
    let newRecents: string[] = [];
    newRecents.push(chosenBusiness);
    const recentsCopy = feedList[1];

    for (let i = 0; i < recentsCopy.length; i++) {
      if (recentsCopy[i] !== chosenBusiness) {
        newRecents.push(recentsCopy[i]);
      }
    }
    setRecents(newRecents);
  };

  const renderAll = (): React.ReactElement => (
    <Screen style={styles.container}>
      <React.Fragment>
        <List
          contentContainerStyle={{}}
          data={feedList[2]}
          renderItem={renderVerticalTrainingItem}
          ListHeaderComponent={renderHeader}
        />
      </React.Fragment>
    </Screen>
  );


  const renderHorizontalTrainingItem = (info: ListRenderItemInfo<BusinessLocation>): React.ReactElement => (
    <TouchableOpacity activeOpacity={.6} onPress={() => onSelect(info.item)}>
      <BusinessCard
        style={styles.horizontalItem}
        business={info.item}
        assetsMap={assetsMap}
      />
    </TouchableOpacity>
  );

  const renderVerticalTrainingItem = (info: ListRenderItemInfo<BusinessLocation>): React.ReactElement => (
    <TouchableOpacity activeOpacity={.6} onPress={() => onSelect(info.item)}>
      <BusinessCard
        style={styles.verticalItem}
        business={info.item}
        assetsMap={assetsMap}
      />
    </TouchableOpacity>
  );

  const Stack = createStackNavigator();

  const BusinessScreen = (chosenBusiness: BusinessLocation | undefined) => {
    return( chosenBusiness ?
      <Screen style={styles.container}>
        <BusinessInfoScreen
          user={currUser}
          business={chosenBusiness}
          isFavorite={feedList[0].includes(chosenBusiness.queues[0])}
          addFav={addFav}
          removeFav={removeFav}
          queue={queueId}
          setQueue={setQueueId}
          setQueueBusiness={setQueueBusiness}
          setUser={setUser}
          recentsHandler={recentsHandler}
        /> 
      </Screen>
      : (<Screen style={[styles.container, {justifyContent: 'center'}]}>
      <ActivityIndicator/>
    </Screen>)
    );
  }



  return (
    <Stack.Navigator>
      <Stack.Screen name='Feed' options={{ headerShown: false }} component={renderAll} />
        <Stack.Screen
          key={"Chosen Business"}
          name={"Chosen Business"}
          options={{ headerShown: false }}
        >
          {() => BusinessScreen(business)}
        </Stack.Screen>
        <Stack.Screen
          key={"Queue Business"}
          name={"Queue Business"}
          options={{headerShown: false}}
        >
          {() => BusinessScreen(queueBusiness)}
        </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme['color-basic-900'],
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

