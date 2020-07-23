import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import QueueList from './queue-list';

/**
 * The page displaying relevant information regarding the user's
 * current queue.
 * @return {SafeAreaView} The entire page.
 */
const QueuePage = () => {
  return (
    <SafeAreaView  style={styles.page}>
      <QueueList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});

export default QueuePage;
