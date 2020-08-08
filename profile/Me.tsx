import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text } from "@ui-kitten/components";

import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import Register from "./Register";
import Screen from "../components/screen";

import { default as theme } from "../custom-theme.json";
import { RenderProps } from "../App";

const Stack = createStackNavigator();

function MyStack({rerenderApp, setRerenderApp, currUser}: RenderProps) {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Me" component={MeContent} />
      <Stack.Screen name="Login">
        {() => <Login rerenderApp={rerenderApp} setRerenderApp={setRerenderApp} currUser={currUser}/>}  
      </Stack.Screen>
      <Stack.Screen name="Register">
        {() => <Register rerenderApp={rerenderApp} setRerenderApp={setRerenderApp} currUser={currUser}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function MeContent() {
  const navigation = useNavigation();

  return (
    <Screen style={styles.container}>
      <View style={styles.background}>
        <Text style={styles.headerText}>
          Log in using your email address and password.
        </Text>
        <Image
          style={styles.headerLogo}
          source={require("../assets/log-in-art.png")}
        />
        <View style={styles.buttonGroup}>
          <Button
            style={styles.button}
            status="basic"
            onPress={() => navigation.navigate("Login")}
          >
            Log In
          </Button>
          <Button
            style={styles.button}
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
          </Button>
        </View>
      </View>
    </Screen>
  );
}

function Me({rerenderApp, setRerenderApp, currUser}: RenderProps) {
  return <MyStack rerenderApp={rerenderApp} setRerenderApp={setRerenderApp} currUser={currUser} />;
}

const styles = StyleSheet.create({
  background: {
    display: 'flex',
    height: '100%',
    paddingVertical: '5%',
    flexDirection: "column",
    alignItems: "center",
    justifyContent: 'space-between',
    backgroundColor: theme['color-basic-900'],
  },

  button: {
    width: "48%",
  },

  buttonGroup: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },

  container: {
    backgroundColor: theme['color-basic-900'],
  },

  headerLogo: {
    width: 256,
    height: 320,
    marginBottom: 40,
  },

  headerText: {
    margin: 3,
    fontSize: 25,
    textAlign: "center",
    marginTop: '5%',
  },
});

export default Me;
