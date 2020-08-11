import React, { useState, useEffect } from 'react';
import {Text, Button} from '@ui-kitten/components';
import {StyleSheet, View, TouchableOpacity} from "react-native";
import QueueList from './queue-list';
import QueueMessages from './queue-messages'
import LeaveModal from './leave-modal';
import { default as theme } from "../custom-theme.json";
import Screen from "../components/screen";
import {useNavigation} from '@react-navigation/native';
import { Queue, Party } from '../util/queue';
import { Customer } from '../util/customer';
import {BusinessLocation} from '../util/business';
import {QueueListener} from '../util/queue-listener';
import {postQueue} from '../util/api-functions';

interface QueueProps {
  queue: Queue | undefined,
  setQueue: (q: Queue | undefined) => void,
  setUser: (c: Customer) => void,
  currUser: Customer,
  setQueueBusiness: (b: BusinessLocation | undefined) => void,
}

/**
 * The page displaying relevant information regarding the user's
 * current queue. If not in a queue, the user is notified.
 */
const QueuePage = ({queue, setQueue, currUser, setUser, setQueueBusiness}: QueueProps) => {
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [placeInLine, setInLine] = useState<number | undefined>(
    queue
    ? queue.parties.map((val) => val.phoneNumber).indexOf(currUser.phoneNumber)
    : undefined
  );

  const leaveLine = (fromUser: boolean) => {
    if (fromUser) {
      const newParties = queue!.parties.filter((val: Party,idx: number) => {
        return idx !== placeInLine
      });
      postQueue({...queue!, parties: newParties});
    }
    setQueue(undefined);
    setQueueBusiness(undefined);
    setInLine(undefined);
    setLeaveModalVisible(false);
    setUser({...currUser, currentQueue: ''});
  };

  useEffect(() => {
    if (queue && placeInLine !== undefined) {
      const listener = new QueueListener(queue.uid, (newQ: Queue) => {
        let ourCustomer;
        for(let i = 0; i < newQ.parties.length; i++) {
          if (currUser.lastName === newQ.parties[i].lastName &&
              currUser.phoneNumber === newQ.parties[i].phoneNumber) {
                ourCustomer = i;
          }
        }

        if (ourCustomer !== undefined) {
          setInLine(ourCustomer);
          setQueue(newQ);
        } else {
          leaveLine(false);
        }
      });
      
      return () => {
        listener.free();
      };
    }
  }, [currUser]);

  useEffect(() => {
    const newPlace : number | undefined =queue
      ? queue.parties.map((val) => val.phoneNumber).indexOf(currUser.phoneNumber)
      : undefined; 

    setInLine(newPlace !== -1 ? newPlace : undefined);
  }, [queue]);

  const navigator = useNavigation();


  if (queue && placeInLine !== undefined) {
    return (
      <Screen style={styles.container}>
        <View style={[styles.card, styles.headerCard]}>
          <Text style={styles.pageTitle}>You're 
            <Text style={[styles.pageTitle, {color: theme['color-primary-500']}]}> {`${placeInLine}`} </Text>
            in line at:
          </Text>
          <TouchableOpacity onPress={() => navigator.navigate('Feed')}>
            <Text style={styles.pageTitle}>{queue.name}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.card, styles.lineCard]}>
          <Text style={styles.cardHeader}>👯 Line</Text>
          <View style={styles.lineCardContent}>
            <QueueList parties={queue.parties} placeInLine={placeInLine} />
          </View> 
          <Button style={styles.leaveLineButton} status='danger' onPress={() => setLeaveModalVisible(true)}>
            Leave Line
          </Button>
        </View>
        <View style={[styles.card, styles.messagesCard]}>
          <Text style={styles.cardHeader}>💬 Messages</Text> 
          <View style={styles.messagesCardContent}>
            <QueueMessages messages={queue.parties[placeInLine].messages}/>
          </View>
        </View>
        <LeaveModal
          show={leaveModalVisible}
          hide={() => setLeaveModalVisible(false)}
          leave={() => leaveLine(true)}
        />
      </Screen>
    );
  } else {
    return (
      <Screen style={styles.container}>
        <View style={[styles.card, styles.headerCard, styles.noLineCard]}>
          <Text style={styles.pageTitle}>You are not in a line right now</Text>
          <Text style={styles.emoji}>😬</Text>
        </View>
      </Screen>
    );
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme['color-basic-900'],
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
    backgroundColor: theme['color-basic-800'],
    height: '100%',
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
    marginTop: '3%',
  },
  lineCardContent: {
    height: '76%',
  },
  messagesCard: {
    height: '30%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '3%',
  },
  messagesCardContent: {
    height: '84%',
  },
  noLineCard: {
    marginTop: '70%',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QueuePage;
