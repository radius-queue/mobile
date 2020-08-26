import React from 'react';
import Modal from 'react-native-modal';
import { Button, Text } from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import { default as theme } from "../../custom-theme.json";
import { AntDesign } from '@expo/vector-icons';

interface LeaveModalProps {
  show: boolean,
  hide: () => void,
  leave: () => void,
}

/**
 * Modal displayed when the user clicks the "Leave line" button.
 * @param {LeaveModalProps} param0 Information on whether to display
 * the modal, a function to hide the modal, and a function to call when
 * the user leaves the line.
 */
const LeaveModal = ({show, hide, leave}: LeaveModalProps) => {
  return(
    <Modal 
      isVisible={show}
      onSwipeComplete={hide}
      swipeDirection={['down']}
    >
      <View style={styles.container}>
        <AntDesign style={styles.closeIcon} name="close" size={24} onPress={hide}/>
        <Text style={styles.cardHeader}>Are you sure you want to leave the line?</Text>
        <View style={styles.buttonGroup}>
          <Button onPress={() => leave()} status='danger' style={styles.button}>
            Leave the line
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  container: {
    backgroundColor: theme['color-basic-100'],
    display: "flex",
    justifyContent: "space-evenly",
    padding: 10,
    borderColor: theme['color-basic-100'],
    borderWidth: 3,
    borderRadius: 10,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme['color-basic-1100'],
    marginTop: 15,
  },
  closeIcon: {
    color: theme['color-basic-1100'],
    marginTop: -6,
    marginRight: -6,
    marginLeft: 'auto',
  },
});

export default LeaveModal;
