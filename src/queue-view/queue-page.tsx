import React, { useState, useEffect } from 'react';
import {Text, Button} from '@ui-kitten/components';
import {StyleSheet, View, TouchableOpacity, ActivityIndicator} from "react-native";
import QueueList from './queue-list';
import QueueMessages from './queue-messages'
import LeaveModal from './leave-modal';
import { default as theme } from "../../custom-theme.json";
import Screen from "../components/screen";
import {useNavigation} from '@react-navigation/native';
import { Queue, Party } from '../util/queue';
import { Customer } from '../util/customer';
import {BusinessLocation} from '../util/business';
import {QueueListener} from '../util/queue-listener';
import {postQueue} from '../util/api-functions';
import { getSuffix } from '../util/util-functions';

interface QueueProps {
  queueId: string,
  setQueueId: (q: string) => void,
  setUser: (c: Customer) => void,
  currUser: Customer,
  setQueueBusiness: (b: BusinessLocation | undefined) => void,
  businessName: string | undefined,
}

/**
 * The page displaying relevant information regarding the user's
 * current queue. If not in a queue, the user is notified.
 */
const QueuePage = ({queueId, setQueueId, currUser, setUser, setQueueBusiness, businessName}: QueueProps) => {
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);

  const [queueInfo, setQueueInfo] = useState<any>({queue: undefined, inLine: undefined});
  const [loading, setLoading] = useState<boolean>(true);

  const leaveLine = (fromUser: boolean) => {
    const {queue, inLine} = queueInfo;
  
    if (fromUser) {
      const newParties = queue!.parties.filter((val: Party,idx: number) => {
        return idx !== inLine
      });
      postQueue({...queue!, parties: newParties});
    }
  
    setQueueId('');
    setQueueBusiness(undefined);
    setQueueInfo({queue: undefined, inLine: undefined});
    setLeaveModalVisible(false);
    setUser({...currUser, currentQueue: ''});
  };

  useEffect(() => {
    if (queueId.length !== 0) {
      setLoading(true);
      const listener = new QueueListener(queueId, (newQ: Queue) => {
        let ourCustomer;
        for(let i = 0; i < newQ.parties.length; i++) {
          if (currUser.lastName === newQ.parties[i].lastName &&
              currUser.phoneNumber === newQ.parties[i].phoneNumber) {
                ourCustomer = i;
          }
        }

        if (ourCustomer !== undefined) {
          setQueueInfo({queue: newQ, inLine: ourCustomer});
        } else {
          leaveLine(false);
        }
        setLoading(false);
      });
      
      return () => {
        listener.free();
      };
    } else {
      setLoading(false);
    }
  }, [currUser, queueId]);

  const navigator = useNavigation();

  if (queueInfo.queue && queueInfo.inLine !== undefined) {
    const positionInLineSuffix: string = getSuffix(queueInfo.inLine + 1);
    return (
      <Screen style={styles.container}>
        <View style={[styles.card, styles.headerCard]}>
          <Text style={styles.pageTitle}>
            <Text style={styles.pageTitle}>You're </Text>
            <Text style={[styles.pageTitle, {color: theme['color-primary-500']}]}>{`${queueInfo.inLine + 1}`}{positionInLineSuffix}</Text>
            <Text style={styles.pageTitle}> in line at:</Text>
          </Text>
          <TouchableOpacity onPress={() => navigator.navigate(queueId)}>
            <Text style={styles.pageTitle}>{businessName}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.card, styles.lineCard]}>
          <Text style={styles.cardHeader}>👯 Line</Text>
          <View style={styles.lineCardContent}>
            <QueueList parties={queueInfo.queue.parties} placeInLine={queueInfo.inLine} />
          </View> 
          <Button style={styles.leaveLineButton} status='danger' onPress={() => setLeaveModalVisible(true)}>
            Leave Line
          </Button>
        </View>
        <View style={[styles.card, styles.messagesCard]}>
          <Text style={styles.cardHeader}>💬 Messages</Text> 
          <View style={styles.messagesCardContent}>
            <QueueMessages messages={queueInfo.queue.parties[queueInfo.inLine].messages}/>
          </View>
        </View>
        <LeaveModal
          show={leaveModalVisible}
          hide={() => setLeaveModalVisible(false)}
          leave={() => leaveLine(true)}
        />
      </Screen>
    );
  } else if (!loading) {
    return (
      <Screen style={styles.container}>
        <View style={[styles.card, styles.headerCard, styles.noLineCard]}>
          <Text style={styles.pageTitle}>You are not in a line right now</Text>
          <Text style={styles.emoji}>😬</Text>
        </View>
      </Screen>
    );
  } else {
    return (
      <Screen style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator/>
      </Screen>
    )
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
