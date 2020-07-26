import React from 'react';
import {Card, Text, Button} from '@ui-kitten/components';
import {StyleSheet, View, useWindowDimensions, SafeAreaView} from "react-native";
import Screen from '../components/screen';
import QueueList from './queue-list';
import QueueMessages from './queue-messages'

/**
 * The page displaying relevant information regarding the user's
 * current queue.
 * @return {SafeAreaView} The entire page.
 */
const QueuePage = () => {

  return (
    <Screen style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.pageTitle}>You're 
          <Text style={[styles.pageTitle, {color: '#00B383'}]}> 3rd </Text>
          in line at:
        </Text>
        <Text style={styles.pageTitle}>Alladin's Gyro-Cery and the Deli</Text>
      </View>
      <View style={[styles.card, styles.lineCard]}>
        <Text style={styles.cardHeader}>Line</Text>
        <View style={styles.cardContent}>
          <QueueList />
        </View> 
        <Button status='danger'>
          Leave Line
        </Button>
      </View>
      <View style={[styles.card, styles.messagesCard]}>
        <Text style={styles.cardHeader}>Messages</Text> 
        <View style={styles.cardContent}>
          <QueueMessages />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A2138',
    padding: 15,
    borderRadius: 10,
    marginVertical: '1%',
    marginHorizontal: '2%',
  },
  cardContent: {
    marginVertical: 6,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
  },
  lineCard: {
  },
  messagesCard: {
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QueuePage;
