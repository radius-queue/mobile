import React, {useState, FunctionComponent} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import call from 'react-native-phone-call';
import {Card, Layout, Button} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import Screen from '../components/screen';
import type { BusinessInfo } from './data';
import MapView, { Marker, Circle } from 'react-native-maps'
import {parseTimeString, toStandardTime} from '../util/util-functions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import defaultStyles from '../config/styles';

interface BusinessInfoProps {
  business: BusinessInfo,
}

const DEGREES_PER_HUNDRED_METER = .001;

const BusinessInfoScreen : FunctionComponent<BusinessInfoProps>= ({business} : BusinessInfoProps) => {
  const [editMap, setEditMap] = useState<boolean>(false);
  const navigation = useNavigation();

  const calculateDelta = (radius: number) => {
    return ((radius * 4) / 100) * DEGREES_PER_HUNDRED_METER;
  }

  const callHandler = () => {
    const args = {
      number: business.phone.replace('-', ''),
      prompt: true,
    };

    call(args);
  };

  const joinQueue = () => {
    console.log('queue joined');
  }

  return (
    <Screen>
      <ScrollView style={styles.scroll} scrollEnabled={true}>
        <MapView
          style={styles.map}
          region={{
            latitude: business.coordinates[0],
            longitude: business.coordinates[1],
            latitudeDelta: calculateDelta(business.radius),
            longitudeDelta: calculateDelta(business.radius),
          }}
          onPress={() => setEditMap(!editMap)}
          scrollEnabled={editMap}
          zoomEnabled={editMap}
          rotateEnabled={editMap}
          pitchEnabled={editMap}
        >
          <Marker
            title={business.name}
            coordinate={{
              latitude: business.coordinates[0],
              longitude: business.coordinates[1],
            }}
          />
          <Circle 
            center={{
              latitude: business.coordinates[0],
              longitude: business.coordinates[1],
            }}
            radius={business.radius}
            strokeWidth={1}
            strokeColor={'#ff0000'}
            style={styles.circle}
          />
        </MapView>
        <Card style={styles.businessCard}>
          <Layout style={styles.layout} level='2'>
            <Text style={[defaultStyles.text, styles.name]}>{business.name}</Text>
            <Text style={[defaultStyles.text, styles.subtitle]}>{business.address}</Text>
            <TouchableOpacity onPress={callHandler}>
              <Text style={[defaultStyles.text, styles.subtitle, styles.phone]}>{business.phone}</Text>
            </TouchableOpacity>
          </Layout>
          <Layout level='2' style={styles.layout}>
              <Text style={[defaultStyles.text, styles.name]}>Current Queue</Text>
              <View>
                <Text>Status</Text>
              </View>
              <Button style={styles.join} disabled={!business.queues[0].open} status='success' onPress={joinQueue}>Join Queue</Button>
          </Layout>
          <Layout style={styles.layout} level='2'>
            <Text style={[defaultStyles.text, styles.name]}>Hours</Text>
            <View style={{...styles.layout, flexDirection: 'row', marginVertical: 0}}>
              <View>
                {DAYS.map(val => <Text style={[defaultStyles.text, styles.dayText]} key={val}>{val}</Text>)}
              </View>
              <View>
                {business.hours.map((val, idx) => (
                      <Text key={idx} style={[defaultStyles.text, styles.dayText]}>
                        {val[0] ? 
                          `${toStandardTime(parseTimeString(val[0]))} -` +  
                          `${toStandardTime(parseTimeString(val[1]!))}` : 'Closed'} 
                      </Text>
                    )
                  )
                }
              </View>
            </View>
          </Layout>
        </Card>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  businessCard: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginTop: -5,
  },
  circle: {
    opacity: .5,
  },
  dayText: {
    fontWeight: '400',
    marginVertical: 5,
  },
  join: {
    marginVertical: 5,
    width: '100%',
    alignSelf: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  phone: {
    textDecorationLine: 'underline',
  },
  scroll: {
    backgroundColor: 'white',
    display: 'flex',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 5,
  },
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