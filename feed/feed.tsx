import React, { useState } from 'react';
import { ListRenderItemInfo, StyleSheet } from 'react-native';
import { List, Text } from '@ui-kitten/components';
import { BusinessCard } from './business-overview-card';
import { BusinessCardInfo } from './data';
import Screen from '../components/screen';
import { default as theme } from "../custom-theme.json";
import { BusinessLocation } from '../util/business';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Customer } from '../util/customer';
import BusinessInfoScreen from '../business-info/business-info';

export const businesses: BusinessCardInfo[][] = [
  [
    BusinessCardInfo.sample(),
    BusinessCardInfo.sample(),
    BusinessCardInfo.sample(),
  ],
  [
    BusinessCardInfo.sample(),
    BusinessCardInfo.sample(),
    BusinessCardInfo.sample(),
  ],
  [
    BusinessCardInfo.sample(),
    BusinessCardInfo.sample(),
    BusinessCardInfo.sample(),
  ],
];

interface FeedProps {
  setBusiness: (b: [BusinessLocation | undefined, number]) => void,
  feedList: [BusinessLocation[], BusinessLocation[], BusinessLocation[]],
  setFavs: (b: BusinessLocation[]) => void,
  business: [BusinessLocation | undefined, number],
  currUser: Customer,
}

export const BusinessListScreen = ({ feedList, setBusiness, setFavs, currUser, business }: FeedProps): React.ReactElement => {
  const [chosenBusiness, setChosenBusiness] = useState<[BusinessLocation | undefined, number]>(business);

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
    newFavs.push(chosenBusiness[0]!);
    setFavs(newFavs);
  };

  const removeFav = () => {
    const favsCopy = feedList[0];
    const unfavorite = chosenBusiness[0];
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
    <TouchableHighlight onPress={() => setChosenBusiness([info.item, info.index])}>
      <BusinessCard
        style={styles.horizontalItem}
        business={info.item}
      />
    </TouchableHighlight>
  );

  const renderVerticalTrainingItem = (info: ListRenderItemInfo<BusinessLocation>): React.ReactElement => (
    <TouchableHighlight onPress={() => setChosenBusiness([info.item, info.index])}>
      <BusinessCard
        style={styles.verticalItem}
        business={info.item}
      />
    </TouchableHighlight>
  );

  return (
    <Screen style={styles.container}>
      {chosenBusiness[0] ? <BusinessInfoScreen
        user={currUser}
        business={chosenBusiness[0]!}
        isFavorite={feedList[0].map((b) => b.queues[0]).includes(chosenBusiness[0].queues[0])}
        addFav={addFav}
        removeFav={removeFav}
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

