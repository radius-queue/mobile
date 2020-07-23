import React from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";

interface Party {
  id: string,
  firstName: string,
  lastName: string,
  size: number,
  checkIn: Date,
}

/**
* Calculates the time difference in minutes betweeen two Date objects.
* @param {Date} t1 The most current time.
* @param {Date} t2 The oldest time.
* @return {boolean} the time difference in minutes
*/
const timeDiffInMinutes = (t1: Date, t2: Date) => {
  const result : number = Math.round((t1.getTime() - t2.getTime()) / 60000);
  return result === -1 ? 0 : result;
};

/**
 * Displays the queue of the business the user is currently in line for.
 * @return {View} The list representing the queue.
 */
const QueueList = () => {


  const currentUserId = "alsdkjfalkf";

  const hardCodedDate = new Date("2020-07-21");

  const parties = [
    {
      id: "sdeeisifsll",
      firstName: "First",
      lastName: "Item",
      size: 4,
      checkIn: hardCodedDate,
    },
    {
      id: "alsdkjfalkf",
      firstName: "Second",
      lastName: "Item",
      size: 9,
      checkIn: hardCodedDate,
    },
    {
      id: "klweiofjvns",
      firstName: "Third",
      lastName: "Item",
      size: 8,
      checkIn: hardCodedDate,
    },
  ];

  /**
   * Representation of a party to be input into a list of parties.
   * @param partyInfo Information relevent to the displaying of an individual party. 
   */
  const PartyItem: React.FC<{
    spot: number,
    item: Party,
    backgroundColor: object,
    fontWeight: object,
    currentUser: boolean
  }> = ({ spot, item, backgroundColor, fontWeight, currentUser }) => (
    <View style={[styles.party, backgroundColor]}>
      <Text style={styles.partyIndex}>
        {spot + 1}
      </Text>
      <View style={styles.partyNameAndWait}>
        <Text style={[styles.partyName, fontWeight]}>
          {item.firstName[0]}. {item.lastName[0]}. {currentUser ? '(You)' : ''}
        </Text>
        <Text style={styles.partyWait}>
          Waited: {timeDiffInMinutes(new Date(), item.checkIn)} min.
        </Text>
      </View>
      <Text style={styles.partySize}>
        Party: {item.size}
      </Text>
    </View>
  );

  /**
   * Creates a PartyItem using relevant information and renders it.
   * @param itemInfo The current party retrieved from 'parties' and the index of the party 
   */
  const renderItem: React.FC<{item: Party, index: number}> = ({ item, index }) => {
    let currentUser: boolean = item.id === currentUserId;
    let backgroundColor: string = currentUser ? '#d17069' : '#dbdbdb';
    let fontWeight: string = currentUser ? 'bold' : 'normal';
    return (
      <PartyItem
        spot={index}
        item={item}
        backgroundColor={{backgroundColor}}
        fontWeight={{fontWeight}}
        currentUser={currentUser}
      />
    );
    };
  
  return (
    <View>
      <Text style={styles.title}>Your Current Line</Text>
      <FlatList
        data={parties}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  party: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginHorizontal: 12,
    borderRadius: 5,
  },
  partyIndex: {
    fontSize: 24,
    marginRight: 10,
    textAlign: "left",
    fontWeight: "bold",
  },
  partyName: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: 8,
  },
  partyNameAndWait: {
    width: 150,
  },
  partySize: {
    width: 100,
    textAlign: "right"
  },
  partyWait: {
    textAlign: "left",
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default QueueList;
