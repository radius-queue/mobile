import React, { useState } from 'react';
import { Card, Button, Input, Layout } from '@ui-kitten/components';
import { StyleSheet, View, Text, Modal } from 'react-native';
import defaultStyles from '../config/styles';
import Screen from '../components/screen';
import * as eva from '@eva-design/eva';
import { User } from './data';

interface ModalProps {
  show: boolean;
  addToQ: () => void;
  hide: () => void;
  user: User | undefined;
};

const BusinessModal = ({show, addToQ, hide, user} : ModalProps) => {
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
          <View style={styles.buttonGroup}>
            <Button style={styles.button} onPress={addToQ} status='success'>Join</Button>
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
    height: 500,
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
  buttonGroup: {
    flex: 1,
    justifyContent: 'flex-end',
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