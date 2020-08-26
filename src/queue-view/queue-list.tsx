import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";
import { default as theme } from "../../custom-theme.json";
import {Party} from '../util/queue';

interface ListProps {
  parties: Party[],
  placeInLine: number,
}

/**
* Calculates the time difference in minutes betweeen two Date objects.
* @param {Date} t1 The most current time.
* @param {Date} t2 The oldest time.
* @return {number} the time difference in minutes
*/
const timeDiffInMinutes = (t1: Date, t2: Date) : number => {
  const result : number = Math.round((t1.getTime() - t2.getTime()) / 60000);
  return result === -1 ? 0 : result;
};

/**
 * Displays the queue of the business the user is currently in line for.
 */
const QueueList = ({parties, placeInLine} : ListProps)  => {
  const [currTime, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /**
   * Representation of a party to be input into a list of parties.
   * @param partyInfo Information relevent to the displaying of an individual party. 
   */
  const PartyItem: React.FC<{
    spot: number,
    item: Party,
    backgroundColor: object,
    color: object,
    fontWeight: object,
    currentUser: boolean
  }> = ({ spot, item, backgroundColor, color, fontWeight, currentUser }) => (
    <View style={[styles.party, backgroundColor]}>
      <Text style={[styles.partyIndex, color]}>
        {spot + 1}
      </Text>
      <View style={styles.partyNameAndWait}>
        <Text style={[styles.partyName, fontWeight, color]}>
          {item.firstName[0]}. {item.lastName[0]}. {currentUser ? '(You)' : ''}
        </Text>
        <Text style={[styles.partyWait, color]}>
          Waited: {timeDiffInMinutes(currTime, item.checkIn)} min.
        </Text>
      </View>
      <Text style={[styles.partySize, color]}>
        Party: {item.size}
      </Text>
    </View>
  );

  /**
   * Creates a PartyItem using relevant information and renders it.
   * @param itemInfo The current party retrieved from 'parties' and the index of the party 
   */
  const renderItem: React.FC<{item: Party, index: number}> = ({ item, index }) => {
    let currentUser: boolean = index === placeInLine;
    let backgroundColor: string = currentUser ? theme['color-primary-500'] : theme['color-basic-100'];
    let color: string = currentUser ? theme['color-basic-300'] : theme['color-basic-900'];
    let fontWeight: string = currentUser ? 'bold' : 'normal';
    return (
      <PartyItem
        spot={index}
        item={item}
        backgroundColor={{backgroundColor}}
        color={{color}}
        fontWeight={{fontWeight}}
        currentUser={currentUser}
      />
    );
  };
  
  return (
    <FlatList
      data={parties}
      renderItem={renderItem}
      keyExtractor={(party) => party.phoneNumber}
    />
  );
}

const styles = StyleSheet.create({
  party: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginHorizontal: 6,
    marginVertical: 1,
    borderRadius: 8,
  },
  partyIndex: {
    fontSize: 20,
    width: '8%',
    marginRight: 10,
    textAlign: "left",
    fontWeight: "bold",
  },
  partyName: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: 4,
  },
  partyNameAndWait: {
    width: '60%',
  },
  partySize: {
    width: '20%',
    textAlign: "right"
  },
  partyWait: {
    textAlign: "left",
  },
});

export default QueueList;
