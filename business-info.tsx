import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import {Card, Layout} from '@ui-kitten/components';

const BusinessInfo = () => {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.map}>
        <Text>Wassup</Text>
      </View>
      <Card style={styles.business}>
        <Text style={{color: 'white', fontSize: 40}}>Samuel Berensohn</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  business: {
    width: '100%',
    flexDirection: 'row',
    flex: 1,
  },
  map: {
    backgroundColor: 'white',
    flex: .45,
    width: '100%',
  },
  outerContainer: {
    flex: 1,
    width: '100%',
  },
  scroll: {
    backgroundColor: 'black',
    flexDirection: 'column',
    flex: 1,
    display: 'flex',
    width: '100%',
  },
  title: {
    flex: .25,
    textAlign: "center",
    justifyContent: 'center',
    width: '100%',
  },
});

export default BusinessInfo;