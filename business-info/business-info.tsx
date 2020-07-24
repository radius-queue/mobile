import React, {FunctionComponent} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import {Card, Layout} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import Screen from '../components/screen';
import type { BusinessInfo } from './data';
import {parseTimeString, toStandardTime} from '../util/util-functions';

interface BusinessInfoProps {
  business: BusinessInfo,
}

const BusinessInfoScreen : FunctionComponent<BusinessInfoProps>= ({business} : BusinessInfoProps) => {

  const navigation = useNavigation();

  return (
    <ScrollView style={styles.scroll} scrollEnabled={true}>
      <View style={styles.map}/>
      <Card style={styles.businessCard}>
        <Layout style={styles.layout} level='2'>
          <Text style={styles.name}>{business.name}</Text>
          <Text style={styles.address}>{business.address}</Text>
          <Text style={styles.address}>{business.phone}</Text>
        </Layout>
        <Layout style={{...styles.layout, flexDirection: 'row'}} level='2'>
          <View>
            {DAYS.map(val => <Text style={styles.dayText} key={val}>{val}</Text>)}
          </View>
          <View>
            {business.hours.map((val, idx) => (
                  <Text key={idx} style={{...styles.dayText}}>
                    {toStandardTime(parseTimeString(val[0]))} - {toStandardTime(parseTimeString(val[1]))} 
                  </Text>
                )
              )
            }
          </View>
        </Layout>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  address: {
    fontSize: 13,
    color: 'white',
    marginTop: 5,
  },
  businessCard: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginTop: -10,
  },
  dayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
    marginVertical: 5,
  },
  layout: {
    width: '100%',
    padding: 15,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    borderRadius: 20,
    marginVertical: 10,
  },
  map: {
    backgroundColor: 'black',
    height: 350,
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scroll: {
    backgroundColor: 'white',
    display: 'flex',
  }
});

const DAYS : string[] = [
  'Sun.',
  'Mon.',
  'Tues',
  'Wed.',
  'Thurs.',
  'Fri.',
  'Sat.',
];


export default BusinessInfoScreen;