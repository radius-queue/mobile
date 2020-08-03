import React, { useState } from 'react';
import { Button } from '@ui-kitten/components';
import Modal from 'react-native-modal';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import defaultStyles from '../config/styles';
import { User } from './data';
import * as Location from 'expo-location';
import * as IntentLauncherAndroid from 'expo-intent-launcher';
import HaversineGeolocation from 'haversine-geolocation';
import { default as theme } from "../custom-theme.json";
import { allNumbers, parsePhoneNum } from '../util/util-functions';
import { AntDesign } from '@expo/vector-icons';

const RADIUS_BUFFER_METERS = 10;

interface ModalProps {
  show: boolean,
  addToQ: () => void,
  hide: () => void,
  user: User | undefined,
  coords: [number, number],
  radius: number,
};

const BusinessModal = ({show, addToQ, hide, user, coords, radius} : ModalProps) => {
  const [firstName, setFirst] = useState<string>(user ? user.firstName : '');
  const [lastName, setLast] = useState<string>(user ? user.lastName : '');
  const [phoneNumber, setPhone] = useState<string>(user ? user.phoneNumber : '');
  const [phoneDisplay, setPhoneDisplay] = useState<string>(user ? parsePhoneNum(user.phoneNumber) : '');
  const [partySize, setParty] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onHide = () => {
    hide();
    setFirst(user ? user.firstName : '');
    setLast(user ? user.lastName : '');
    setPhone(user ? user.phoneNumber : '');
    setParty('');
    setSubmitted(false);
    setPhone(user ? user.phoneNumber : '');
    setPhoneDisplay(user ? parsePhoneNum(user.phoneNumber) : '');
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
        return [distance, true];
      } else {
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

  const validateForm = () => {
    const nameValid = firstName.length > 0 && lastName.length > 0;
    const phoneValid = phoneNumber.length === 10;
    const partySizeValid = partySize.length > 0;
    return nameValid && phoneValid && partySizeValid;
  }

  const onSubmit = async () => {
    setSubmitted(true);
    if (validateForm()) {
      const shouldAdd : [number | undefined, boolean] = await checkDistance();

      if (shouldAdd[1]) {
        onHide();
        addToQ();
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
  }

  /**
   * Takes the user phone number input and sets the current phone
   * number state and the phone number display state.
   * Ensures that only numbers are inputted before setting states.
   * @param {string} next The phone number inputted by the user.
   */
  const changePhone = (next: string) => {
    let isAllNumbers: boolean = true;
    let strippedToNumbers = '';
    for (let i: number = 0; i < next.length; i++) {
      if (allNumbers.includes(next[i])) {
        strippedToNumbers += next[i];
      }
    }
    if (isAllNumbers) {
      setPhone(strippedToNumbers);
      setPhoneDisplay(parsePhoneNum(strippedToNumbers));
    }
  };

  /**
   * Takes the user party size input and sets the current party
   * size state.
   * Ensures that only numbers are inputted before setting state.
   * @param {string} next The party size inputted by the user.
   */
  const changeParty = (next: string) => {
    for (let i: number = 0; i < next.length; i++) {
      if (!allNumbers.includes(next[i])) {
        return;
      }
    }
    setParty(next);
  };

  return (
    <Modal
      isVisible={show}
      onSwipeComplete={onHide}
      swipeDirection={['down']}
    >
      <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.avoidContainer}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={[defaultStyles.text, styles.title]}>Join Queue</Text>
            <AntDesign style={styles.closeIcon} name="close" size={24} onPress={onHide}/>
          </View>
          <View>
            <View style={styles.inputCaptionContainer}>
              <Text style={styles.inputCaption}>First Name</Text>
              {submitted && firstName.length === 0 && 
                <Text style={[styles.inputCaption, styles.hiddenInputCaption]}>
                  Please Enter a First Name
                </Text>
              }
            </View>
            <TextInput
              value={firstName}
              onChangeText={next => setFirst(next)}
              style={[styles.input,
                submitted && firstName.length === 0 ? {borderColor: theme['color-danger-600']} : {}
              ]}
              returnKeyType={'done'}
            />
            <View style={styles.inputCaptionContainer}>
              <Text style={styles.inputCaption}>Last Name</Text>
              {submitted && lastName.length === 0 && 
                <Text style={[styles.inputCaption, styles.hiddenInputCaption]}>
                  Please Enter a Last Name
                </Text>
              }
            </View>
            <TextInput
              value={lastName}
              onChangeText={next => setLast(next)}
              style={[styles.input,
                submitted && lastName.length === 0 ? {borderColor: theme['color-danger-600']} : {}
              ]}
              returnKeyType={'done'}
            />
            <View style={styles.inputCaptionContainer}>
              <Text style={styles.inputCaption}>Phone Number</Text>
              {submitted && phoneNumber.length !== 10 &&
                <Text style={[styles.inputCaption, styles.hiddenInputCaption]}>
                  Invalid Phone Number
                </Text>
              }
            </View>
            <TextInput
              maxLength={13}
              value={phoneDisplay}
              onChangeText={next => changePhone(next)}
              style={[styles.input,
                submitted && phoneNumber.length !== 10 ? {borderColor: theme['color-danger-600']} : {}
              ]}
              keyboardType='numeric'
              returnKeyType={'done'}
            />
            <View style={styles.inputCaptionContainer}>
              <Text style={styles.inputCaption}>Party Size</Text>
              {submitted && partySize.length === 0 &&
                <Text style={[styles.inputCaption, styles.hiddenInputCaption]}>
                  Please Enter a Party Size
                </Text>
              }
            </View>
            <TextInput
              value={partySize}
              onChangeText={next => changeParty(next)}
              style={[styles.input, 
                submitted && partySize.length === 0 ? {borderColor: theme['color-danger-600']} : {}
              ]}
              keyboardType='numeric'
              returnKeyType={'done'}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button style={styles.button} onPress={onSubmit}>Join</Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BusinessModal;

const styles = StyleSheet.create({
  avoidContainer: {
    height: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  button: {
    width: '100%',
    marginTop: 5,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: theme['color-basic-100'],
    display: "flex",
    justifyContent: "space-evenly",
    marginTop: 'auto',
    marginBottom: 'auto',
    padding: 10,
    borderColor: theme['color-basic-100'],
    borderWidth: 3,
    borderRadius: 10,
  },
  closeIcon: {
    color: theme['color-basic-1100'],
    marginTop: -6,
    marginRight: -6,
  },
  hiddenInputCaption: {
    color: theme['color-danger-600'],
    fontSize: 12,
    marginTop: 'auto',
  },
  input: {
    borderWidth: 1,
    borderColor: theme['color-basic-100'],
    marginTop: 5,
    marginBottom: 7,
    backgroundColor: theme['color-basic-400'],
    height: 36,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 15,
  },
  inputCaption: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: -4,
  },
  inputCaptionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    color: theme['color-basic-1100'],
  },
  titleContainer: {
    height: 32,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});