import React from 'react';
import { ListRenderItemInfo, StyleSheet } from 'react-native';
import { List, Text } from '@ui-kitten/components';
import { BusinessCard } from './business-overview-card';
import { BusinessCardInfo } from './data';

export const businesses: BusinessCardInfo[][] = [
  [],
  [],
  [
  BusinessCardInfo.sample(),
  BusinessCardInfo.sample(),
  BusinessCardInfo.sample(),
  ],
];

export const BusinessListScreen = (businesses: BusinessCardInfo[][]): React.ReactElement => {

  const renderHeader = (): React.ReactElement => (
    <React.Fragment>
      <Text
        style={styles.headerTitle}
        appearance='hint'>
        FAVORITES
      </Text>
      <List
        contentContainerStyle={styles.horizontalList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={businesses[2]}
        renderItem={renderHorizontalTrainingItem}
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
    <List
      contentContainerStyle={styles.list}
      data={businesses[2]}
      renderItem={renderVerticalTrainingItem}
      ListHeaderComponent={renderHeader}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 24,
  },
  headerTitle: {
    marginHorizontal: 16,
  },
  horizontalList: {
    marginVertical: 16,
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

