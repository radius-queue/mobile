import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';

interface MessageItem {
  message: string,
  time: Date,
};

const QueueMessages = () => {

  const data = [
    {
      message: 'Come to the store now pls.',
      time: new Date(),
    },
    {
      message: 'Come to the store now pls.',
      time: new Date(),
    },
    {
      message: 'Come to the store now pls.',
      time: new Date(),
    },
    {
      message: 'Come to the store now pls.',
      time: new Date(),
    },
  ]

  const renderMessage: React.FC<{item: MessageItem}> = ({ item }) => (
    <ListItem
      title={`${item.message}`}
      description={`${item.time}`}
    />
  );

  return (
    <List
      data={data}
      ItemSeparatorComponent={Divider}
      renderItem={renderMessage}
    />
  );
}

export default QueueMessages;