import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BusinessInfo from './business-info';
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <BusinessInfo/>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
});
