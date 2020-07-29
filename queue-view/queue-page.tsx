import React, { useState } from 'react';
import {Text, Button} from '@ui-kitten/components';
import {StyleSheet, View} from "react-native";
import QueueList from './queue-list';
import QueueMessages from './queue-messages'
import * as eva from '@eva-design/eva';
import LeaveModal from './leave-modal';

/**
 * The page displaying relevant information regarding the user's
 * current queue. If not in a queue, the user is notified.
 * @return {View} The entire page.
 */
const QueuePage = () => {
  const [userInLine, setUserInLine] = useState(true);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);

  const leaveLine = () => {
    setLeaveModalVisible(false);
    setUserInLine(false);
  };

  if (userInLine) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.headerCard]}>
          <Text style={styles.pageTitle}>You're 
            <Text style={[styles.pageTitle, {color: '#00B383'}]}> 3rd </Text>
            in line at:
          </Text>
          <Text style={styles.pageTitle}>Alladin's Gyro-Cery and Deli</Text>
        </View>
        <View style={[styles.card, styles.lineCard]}>
          <Text style={styles.cardHeader}>👯 Line</Text>
          <View style={styles.lineCardContent}>
            <QueueList />
          </View> 
          <Button style={styles.leaveLineButton} status='danger' onPress={() => setLeaveModalVisible(true)}>
            Leave Line
          </Button>
        </View>
        <View style={[styles.card, styles.messagesCard]}>
          <Text style={styles.cardHeader}>💬 Messages</Text> 
          <View style={styles.messagesCardContent}>
            <QueueMessages />
          </View>
        </View>
        <LeaveModal
          show={leaveModalVisible}
          hide={() => setLeaveModalVisible(false)}
          leave={leaveLine}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.headerCard]}>
          <Text style={styles.pageTitle}>You are not in a line right now</Text>
          <Text style={styles.emoji}>😬</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: eva.dark['color-basic-900'],
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    borderRadius: 10,
    marginHorizontal: '2%',
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    display: 'flex',
    justifyContent: "space-evenly",
    backgroundColor: eva.dark['color-basic-800'],
    height: '100%',
    paddingTop: '10%',
    paddingBottom: '1%',
  },
  emoji: {
    fontSize: 35,
    alignSelf: "center",
  },
  headerCard: {
    height: '15%',
    display: 'flex',
    justifyContent: 'center',
  },
  leaveLineButton: {
    paddingVertical: 0,
    height: '12%',
    minHeight: 20,
    minWidth: 20,
  },
  lineCard: {
    height: '50%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  lineCardContent: {
    height: '76%',
  },
  messagesCard: {
    height: '30%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  messagesCardContent: {
    height: '84%',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QueuePage;
