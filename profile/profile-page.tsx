import React from 'react';
import {Text, Button} from '@ui-kitten/components';
import {StyleSheet, View} from "react-native";
import * as eva from '@eva-design/eva';

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Your Profile</Text>
        <View>
          <Text>Name: </Text>
          <Text>Phone: </Text>
          <Text>Email: </Text>
          <Button>Edit Profile</Button>
          <Button status='danger'>Log Out</Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: eva.dark['color-basic-900'],
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
    display: 'flex',
    justifyContent: "space-evenly",
    backgroundColor: eva.dark['color-basic-800'],
    height: '100%',
    paddingTop: '10%',
    paddingBottom: '1%',
  },
});

export default ProfilePage;