import React from 'react';
import {Text, Button, Autocomplete} from '@ui-kitten/components';
import {StyleSheet, View, useWindowDimensions, SafeAreaView} from "react-native";
import QueueList from './queue-list';
import QueueMessages from './queue-messages'
import * as eva from '@eva-design/eva';

/**
 * The page displaying relevant information regarding the user's
 * current queue.
 * @return {SafeAreaView} The entire page.
 */
const QueuePage = () => {

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.headerCard]}>
        <Text style={styles.pageTitle}>You're 
          <Text style={[styles.pageTitle, {color: '#00B383'}]}> 3rd </Text>
          in line at:
        </Text>
        <Text style={styles.pageTitle}>Alladin's Gyro-Cery and the Deli</Text>
      </View>
      <View style={[styles.card, styles.lineCard]}>
        <Text style={styles.cardHeader}>Line</Text>
        <View style={styles.lineCardContent}>
          <QueueList />
        </View> 
        <Button style={styles.leaveLineButton} status='danger'>
          Leave Line
        </Button>
      </View>
      <View style={[styles.card, styles.messagesCard]}>
        <Text style={styles.cardHeader}>Messages</Text> 
        <View style={styles.messagesCardContent}>
          <QueueMessages />
        </View>
      </View>
    </View>
  );
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
