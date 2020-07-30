import React from 'react';
import {Text, Button} from '@ui-kitten/components';
import {StyleSheet, View, SafeAreaView} from "react-native";
import * as eva from '@eva-design/eva';
import Screen from './../components/screen';

interface userInfo {
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
};

export const sampleUserInfo: userInfo = {
  email: 'profileSample@uw.edu',
  firstName: 'Harry',
  lastName: 'Husky',
  phoneNumber: '(206)876-4432'
};

const ProfilePage = (curUserInfo: userInfo): React.ReactElement => {
  return (
    <Screen style={styles.container}>
      <View style={[styles.card, styles.headerCard]}>
        <Text style={styles.pageTitle}>Your Radius Profile</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardHeader}>📇 Basic Info</Text>
        <View style={styles.cardContent}>
          <Text style={styles.contentLabel}>Name: <Text style={styles.contentInfo}>{curUserInfo.firstName} {curUserInfo.lastName}</Text></Text>
          <Text style={styles.contentLabel}>Phone: <Text style={styles.contentInfo}>{curUserInfo.phoneNumber}</Text></Text>
          <Text style={styles.contentLabel}>Email: <Text style={styles.contentInfo}>{curUserInfo.email}</Text></Text>
        </View>
        <Button style={styles.cardButton} status='danger'>Log Out</Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: eva.dark['color-basic-900'],
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    borderRadius: 10,
    marginHorizontal: '2%',
    display: 'flex',
    marginTop: '3%'
  },
  cardButton: {
    marginTop: 'auto',
  },
  cardContent: {
    marginTop: 'auto',
    backgroundColor: eva.dark['color-basic-800'],
    paddingHorizontal: 4,
    paddingVertical: '20%',
    marginVertical: '5%',
    borderRadius: 6,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '3%',
  },
  container: {
    display: 'flex',
    backgroundColor: eva.dark['color-basic-800'],
    height: '100%',
  },
  contentInfo: {
    fontSize: 18,
  },
  contentLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 10,
  },
  headerCard: {
    height: '15%',
    display: 'flex',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfilePage;