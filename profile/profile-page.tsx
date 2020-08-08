import React from 'react';
import {Text, Button} from '@ui-kitten/components';
import {StyleSheet, View} from "react-native";
import { default as theme } from "../custom-theme.json";
import Screen from "../components/screen";
import {auth} from '../firebase';
import { parsePhoneNum } from '../util/util-functions';
import { Customer } from '../util/customer';
import { RenderProps } from '../App';
import { useNavigation } from "@react-navigation/native";

interface userInfo {
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
};

export const sampleUserInfo: userInfo = {
  email: 'harryhusky123@gmail.com',
  firstName: 'Harry',
  lastName: 'Husky',
  phoneNumber: '(206)876-4432'
};

const ProfilePage = ({setUser, currUser}: RenderProps): React.ReactElement => {
  
  const navigation = useNavigation();

  const signOut = async () => {
    setUser(new Customer());
    navigation.navigate("Feed");
    await auth.signOut();
    //setRerenderApp(rerenderApp+1);
  }

  return (
    <Screen style={styles.container}>
      <View style={[styles.card, styles.headerCard]}>
        <Text style={styles.pageTitle}>Your Radius Profile</Text>
      </View>
      <View style={[styles.card, styles.infoCard]}>
        <Text style={styles.cardHeader}>📇 Basic Info</Text>
        <View style={styles.cardContent}>
          <Text style={styles.contentLabel}>Name: {'\t'}<Text style={styles.contentInfo}>{currUser.firstName} {currUser.lastName}</Text></Text>
          <Text style={styles.contentLabel}>Phone: {'\t'}<Text style={styles.contentInfo}>{parsePhoneNum(currUser.phoneNumber)}</Text></Text>
          <Text style={styles.contentLabel}>Email: {'\t'}<Text style={styles.contentInfo}>{currUser.email}</Text></Text>
        </View>
        <Button style={styles.cardButton} status='danger' onPress={signOut}>Log Out</Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme['color-basic-900'],
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    borderRadius: 10,
    marginHorizontal: '2%',
    display: 'flex',
  },
  cardButton: {
    marginTop: 'auto',
  },
  cardContent: {
    marginTop: 'auto',
    backgroundColor: theme['color-basic-900'],
    paddingHorizontal: 4,
    paddingVertical: '15%',
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
    backgroundColor: theme['color-basic-800'],
    height: '100%',
    paddingTop: '10%',
  },
  contentInfo: {
    fontSize: 16,
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
  infoCard: {
    marginTop: '3%',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfilePage;