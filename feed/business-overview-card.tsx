import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, CardElement, CardProps, Text } from '@ui-kitten/components';
import { ImageOverlay } from './image-overlay';
import { BusinessLocation } from '../util/business';

export interface BusinessCardProps extends Omit<CardProps, 'children'> {
  business: BusinessLocation;
}

const image = require('../assets/landing.jpg');

export type BusinessCardElement = React.ReactElement<BusinessCardProps>;

export const BusinessCard = (props: BusinessCardProps): CardElement => {

  const { style, business, ...cardProps } = props;

  return (
    <Card
      {...cardProps}
      style={[styles.container, style]}>
      <ImageOverlay
        style={styles.image}
        source={image}>
        <Text
          style={styles.level}
          category='s1'
          status='control'>
          {business.type}
        </Text>
        <Text
          style={styles.title}
          category='h2'
          status='control'>
          {business.name}
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
