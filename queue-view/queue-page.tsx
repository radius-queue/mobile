import React from 'react';
import { StatusBar } from 'react-native';

import Screen from '../components/screen';
import QueueList from './queue-list';

/**
 * The page displaying relevant information regarding the user's
 * current queue.
 * @return {SafeAreaView} The entire page.
 */
const QueuePage = () => {
  return (
    <Screen>
      <QueueList />
    </Screen>
  );
};

export default QueuePage;
