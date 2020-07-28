import React, { useState } from 'react';
import { Button, Input } from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import defaultStyles from '../config/styles';
import * as eva from '@eva-design/eva';
import { User } from './data';
import * as Location from 'expo-location';
import * as IntentLauncherAndroid from 'expo-intent-launcher';
import HaversineGeolocation from 'haversine-geolocation';

const RADIUS_BUFFER_METERS = 10;

interface ModalProps {
  show: boolean,
  addToQ: (user: User) => void,
  hide: () => void,
  user: User | undefined,
  coords: [number, number],
  radius: number,
};

const BusinessModal = ({show, addToQ, hide, user, coords, radius} : ModalProps) => {
  const [firstName, setFirst] = useState<string>(user ? user.firstName : '');
  const [lastName, setLast] = useState<string>(user ? user.lastName : '');
  const [phoneNumber, setPhone] = useState<string>(user ? user.phoneNumber : '');
  const [partySize, setParty] = useState<string>('');

  const onHide = () => {
    hide();
    setFirst(user ? user.firstName : '');
    setLast(user ? user.lastName : '');
    setPhone(user ? user.phoneNumber : '');
    setParty('');
  }

  const checkDistance : () => Promise<[number | undefined, boolean]> = async () => {
    const permission: Location.PermissionResponse = await Location.requestPermissionsAsync();

    if (permission.granted) {
      const location: Location.LocationData = await Location.getCurrentPositionAsync();
      const distance: number = HaversineGeolocation.getDistanceBetween(
        {
          latitude: coords[0],
          longitude: coords[1],
        },
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }, 'm'
      );
      if(distance <= radius + RADIUS_BUFFER_METERS) {
        console.log('INSIDE w/ DIST: ' + distance);
        return [distance, true];
      } else {
        console.log('OUTSIDE W/ DIST: ' + distance);
        return [distance, false];
      }
    } else {
      const openSetting = () => {
        if(Platform.OS =='ios'){
          Linking.openURL('app-settings:')
        }
        else{
          IntentLauncherAndroid.startActivityAsync(
            IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
          );
        }    
      }

      Alert.alert(
        'Enable Location Services',
        'You must enable location services in order to join a queue.',
        [
          {
            text: 'Dismiss',
            style: 'cancel',
          },
          {text: 'Settings', onPress: openSetting,},
        ],
        {
          cancelable: false
        }
      );
      return [undefined, false];
    }
  };

  const onSubmit = async () => {
    const shouldAdd : [number | undefined, boolean] = await checkDistance();

    if (shouldAdd[1]) {
      addToQ(User.sample());
    } else if (shouldAdd[0] !== undefined) { // they are not inside the radius
      Alert.alert(
        "You're Outside the Radius",
        `You are approximately ${shouldAdd[0] - radius} meters away from the edge of the radius.` + 
        ' Please move closer to the business before joining the queue.',
        [
          {
            text: 'OK',
            style: 'cancel',
          }
        ],
        {cancelable: false},
      )
    }
  }

  return (
    <Modal
      visible={show}
      animationType='slide'
      transparent={true}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={[defaultStyles.text, styles.title]}>Join Queue</Text>
          <View style={styles.layout}>
            <Input
              value={firstName}
              onChangeText={next => setFirst(next)}
              style={styles.input}
              caption={'First Name'}
              returnKeyType={'done'}
            />
            <Input
              value={lastName}
              onChangeText={next => setLast(next)}
              style={styles.input}
              caption={'Last Name'}
              returnKeyType={'done'}
            />
            <Input
              value={phoneNumber}
              onChangeText={next => setPhone(next)}
              caption={'Phone Number'}
              style={styles.input}
              keyboardType='numeric'
              returnKeyType={'done'}
            />
            <Input
              value={partySize}
              onChangeText={next => setParty(next)}
              caption={'Party Size'}
              style={styles.input}
              keyboardType='numeric'
              returnKeyType={'done'}
            />
          </View>
          <View>
            <Button style={styles.button} onPress={onSubmit} status='success'>Join</Button>
            <Button style={styles.button} onPress={onHide} status='danger'>Back</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BusinessModal;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: eva.dark['color-basic-800'],
    overflow: 'hidden',
    height: 650,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  button: {
    width: '100%',
    marginVertical: 5,
  },
  container: {
    padding: 15,
    flex: 1,
  },
  input: {
    borderColor: 'white',
    marginVertical: 5,
  },
  layout: {
    width: '100%',
    padding: 5,
    borderRadius: 20,
    marginVertical: 15,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
  },
});