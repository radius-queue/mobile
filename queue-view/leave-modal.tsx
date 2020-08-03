import React from 'react';
import { Modal, Card, Button, Text } from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';

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

  const FooterButtons = () => {
    return (
      <View style={styles.footerContainer}>
        <Button onPress={() => hide()} style={styles.footerControl}>
          Stay in line
        </Button>
        <Button onPress={() => leave()} status='danger' style={styles.footerControl}>
          Leave the line
        </Button>
      </View>
    );
  }

  return(
    <Modal 
      visible={show}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => hide()}
    >
      <Card disabled={true} style={styles.leaveModal} footer={FooterButtons}>
        <Text style={styles.cardHeader}>Are you sure you want to leave the line?</Text>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
  leaveModal: {
    padding: 2,
    flex: 1,
    margin: 2,
  },
});

export default LeaveModal;
