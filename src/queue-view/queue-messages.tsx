import React from 'react';
import { Divider, List, ListItem } from '@ui-kitten/components';

interface MessageProps {
  messages: [Date, string][]
}

const QueueMessages = ({messages} : MessageProps) => {

  const renderMessage: React.FC<{item : [Date, string]} > = ({ item }) => (
    <ListItem
      title={`${item[1]}`}
      description={`${item[0]}`}
    />
  );

  return (
    <List
      data={messages}
      ItemSeparatorComponent={Divider}
      renderItem={renderMessage}
    />
  );
}

export default QueueMessages;