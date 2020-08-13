import React, { useState, useEffect } from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { List, Text } from '@ui-kitten/components';
import { BusinessCard } from './business-overview-card';
import Screen from '../components/screen';
import { default as theme } from "../custom-theme.json";
import { BusinessLocation } from '../util/business';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Customer } from '../util/customer';
import BusinessInfoScreen from '../business-info/business-info';

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
}: FeedProps): React.ReactElement => {
  const [chosenBusiness, setChosenBusiness] = useState<BusinessLocation | undefined>(business);
  const [feedcnt, setCnt] = useState<number>(0);

  useEffect(() => {
    setChosenBusiness(business);
  }, [business]);

  useEffect(() => {
    console.log(feedcnt + 1);
    setCnt(feedcnt + 1);
  }, feedList);

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

  const addFav = () => {
    const newFavs = feedList[0].slice();
    newFavs.push(chosenBusiness!);
    setFavs(newFavs);
  };

  const removeFav = () => {
    const favsCopy = feedList[0];
    const unfavorite = chosenBusiness;
    let newFavs: BusinessLocation[] = [];
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
        data={feedList[1]}
        renderItem={renderHorizontalTrainingItem}
      />
    </React.Fragment>
  );

  const recentsHandler = () => {
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
    <React.Fragment>
      <List
        contentContainerStyle={styles.list}
        data={feedList[2]}
        renderItem={renderVerticalTrainingItem}
        ListHeaderComponent={renderHeader}
      />
    </React.Fragment>
  );


  const renderHorizontalTrainingItem = (info: ListRenderItemInfo<BusinessLocation>): React.ReactElement => (
    <TouchableHighlight onPress={() => setChosenBusiness(info.item)}>
      <BusinessCard
        style={styles.horizontalItem}
        business={info.item}
      />
    </TouchableHighlight>
  );

  const renderVerticalTrainingItem = (info: ListRenderItemInfo<BusinessLocation>): React.ReactElement => (
    <TouchableHighlight onPress={() => setChosenBusiness(info.item)}>
      <BusinessCard
        style={styles.verticalItem}
        business={info.item}
      />
    </TouchableHighlight>
  );

  return (
    <Screen style={styles.container}>
      {chosenBusiness ? <BusinessInfoScreen
        user={currUser}
        business={chosenBusiness!}
        isFavorite={feedList[0].map((b) => b.queues[0]).includes(chosenBusiness.queues[0])}
        addFav={addFav}
        removeFav={removeFav}
        queue={queueId}
        setQueue={setQueueId}
        setQueueBusiness={setQueueBusiness}
        setUser={setUser}
        recentsHandler={recentsHandler}
        setRecents={setRecents}
        setChosenBusiness={setChosenBusiness}
      />
        : renderAll()}
    </Screen>
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

