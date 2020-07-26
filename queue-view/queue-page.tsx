import React from 'react';
import {Card, Text, Button, Layout} from '@ui-kitten/components';
import {StyleSheet} from "react-native";
import Screen from '../components/screen';
import QueueList from './queue-list';
import { ScrollView } from 'react-native-gesture-handler';

/**
 * The page displaying relevant information regarding the user's
 * current queue.
 * @return {SafeAreaView} The entire page.
 */
const QueuePage = () => {

  return (
    <Screen>
      <ScrollView style={styles.scroll}>
        <Card style={styles.card}>
          <Text style={styles.header}>Your Current Line</Text> 
          <QueueList />
          <Button style={styles.leaveButton} status='danger'>Leave Line</Button>
        </Card>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  leaveButton: {
  },
  line: {
    marginVertical: 10,
  },
  scroll: {
  }
});

export default QueuePage;
