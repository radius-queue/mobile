import React, {useState, useRef, FunctionComponent} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import call from 'react-native-phone-call';
import {Card, Layout, Button} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import Screen from '../components/screen';
import type { BusinessInfo } from './data';
import MapView, { Marker, Circle } from 'react-native-maps'
import {parseTimeString, toStandardTime} from '../util/util-functions';
import defaultStyles from '../config/styles';
import * as eva from '@eva-design/eva';

interface BusinessInfoProps {
  business: BusinessInfo,
}

const DEGREES_PER_HUNDRED_METER = .001;

const BusinessInfoScreen : FunctionComponent<BusinessInfoProps>= ({business} : BusinessInfoProps) => {
  const [editMap, setEditMap] = useState<boolean>(false);
  const scrollA = useRef(new Animated.Value(0)).current;
  
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
      <Animated.ScrollView style={styles.scroll}
        scrollEnabled={true}
        onScroll={Animated.event([
          {nativeEvent: {contentOffset: {y: scrollA}}}
        ], {useNativeDriver: true})}
        scrollEventThrottle={16}>
        <Animated.View
          style={animatedStyles.map(scrollA)}
        >
          <MapView
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
            style={{width: '100%', height: '100%'}}
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
        </Animated.View>
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
              <View style={styles.queueInfoTextContainer}>
                <Text style={defaultStyles.text}>Status:</Text>
                <Text style={defaultStyles.text}>{business.queues[0].open ? 'Open' : 'Closed'}</Text>
              </View>
              <View style={styles.queueInfoTextContainer}>
                <Text style={defaultStyles.text}>Line Length:</Text>
                <Text style={defaultStyles.text}>{business.queues[0].length} parties</Text>
              </View>
              <View style={styles.queueInfoTextContainer}>
                <Text style={defaultStyles.text}>Most Recent Wait Time:</Text>
                <Text style={defaultStyles.text}>{business.queues[0].firstWaitTime} minutes</Text>
              </View>
              <Button style={styles.joinButton} disabled={!business.queues[0].open} status='success' onPress={joinQueue}>Join Queue</Button>
          </Layout>
          <Layout style={styles.layout} level='2'>
            <Text style={[defaultStyles.text, styles.name]}>Hours</Text>
            <View style={styles.hoursContainer}>
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
      </Animated.ScrollView>
  );
};

const animatedStyles = {
  map: (scrollA : Animated.Value) => ({
    height: 350,
    transform: [{
      translateY: scrollA,
    }]
  }),
}

const styles = StyleSheet.create({
  businessCard: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginTop: -5,
    borderWidth: 0,
  },
  circle: {
    opacity: .5,
  },
  dayText: {
    fontWeight: '400',
    marginVertical: 5,
  },
  hoursContainer: {
    flexDirection: 'row',
    marginVertical: 0,
    padding: 0,
    width: '100%',
    justifyContent: 'space-between',
  },
  joinButton: {
    marginVertical: 10,
    width: '100%',
    alignSelf: 'center',
  },
  layout: {
    width: '100%',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 20,
    marginVertical: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  phone: {
    textDecorationLine: 'underline',
  },
  queueInfoTextContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    width: '100%',
    justifyContent: 'space-between',
  },
  scroll: {
    backgroundColor: '#222b45',
    display: 'flex',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 5,
  },
});

const DAYS : string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/*
*/

export default BusinessInfoScreen;