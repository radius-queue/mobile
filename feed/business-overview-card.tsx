import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, CardElement, CardProps, Text } from '@ui-kitten/components';
import { ImageOverlay } from './image-overlay';
import { BusinessCardInfo} from './data';

export interface BusinessCardProps extends Omit<CardProps, 'children'> {
  bCard: BusinessCardInfo;
}

export type BusinessCardElement = React.ReactElement<BusinessCardProps>;

export const BusinessCard = (props: BusinessCardProps): CardElement => {

  const { style, bCard, ...cardProps } = props;

  return (
    <Card
      {...cardProps}
      style={[styles.container, style]}>
      <ImageOverlay
        style={styles.image}
        source={bCard.image}>
        <Text
          style={styles.level}
          category='s1'
          status='control'>
          {bCard.type}
        </Text>
        <Text
          style={styles.title}
          category='h2'
          status='control'>
          {bCard.title}
        </Text>
      </ImageOverlay>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    height: 200,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  level: {
    zIndex: 1,
  },
  title: {
    zIndex: 1,
  },
});
