import React, { FunctionComponent } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

/**
 * Screen component allows for uniformity in making
 * sure that we do not cover the status bar. This 
 * is a background component and should be used when
 * we need to pad on top.
 * @param {any} props takes in the children of the screen
 * and the optional styles on the screen view. 
 */
const Screen : FunctionComponent<any> = ({children, style}) => {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen : {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  }
})

export default Screen;