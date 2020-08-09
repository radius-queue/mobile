import React from 'react';
import { ListRenderItemInfo, StyleSheet } from 'react-native';
import { List, Text } from '@ui-kitten/components';
import { BusinessCard } from './business-overview-card';
import { BusinessCardInfo } from './data';
import Screen from '../components/screen';
import { default as theme } from "../custom-theme.json";
import { BusinessLocation } from '../util/business';

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
  setBusiness: (b: BusinessLocation) => void,
  feedList: [BusinessLocation[], BusinessLocation[], BusinessLocation[]],
  setFavs: (b: BusinessLocation[]) => void,
  setRecents: (b: BusinessLocation[]) => void,
}

export const BusinessListScreen = ({feedList, setBusiness, setFavs, setRecents}: FeedProps) : React.ReactElement => {

  const renderHeader = (): React.ReactElement => (
    <React.Fragment>
      {(businesses[0].length > 0) ? renderFav() : <React.Fragment/>}
      {(businesses[1].length > 0) ? renderRecent() : <React.Fragment/>}
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
        data={businesses[0]}
        renderItem={renderHorizontalTrainingItem}
      />
    </React.Fragment>
  );

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
        data={businesses[1]}
        renderItem={renderHorizontalTrainingItem}
      />
    </React.Fragment>
  );

  const renderAll = (): React.ReactElement => (
    <React.Fragment>
      <List
        contentContainerStyle={styles.list}
        data={businesses[2]}
        renderItem={renderVerticalTrainingItem}
        ListHeaderComponent={renderHeader}
      />
    </React.Fragment>
  );

  const renderHorizontalTrainingItem = (info: ListRenderItemInfo<BusinessCardInfo>): React.ReactElement => (
    <BusinessCard
      style={styles.horizontalItem}
      bCard={info.item}
    />
  );

  const renderVerticalTrainingItem = (info: ListRenderItemInfo<BusinessCardInfo>): React.ReactElement => (
    <BusinessCard
      style={styles.verticalItem}
      bCard={info.item}
    />
  );

  return (
    <Screen style={styles.container}>
      {renderAll()}
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

