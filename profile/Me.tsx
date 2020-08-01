import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text } from "@ui-kitten/components";

import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import Register from "./Register";
import Screen from "../components/screen";

import { default as theme } from "../custom-theme.json";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Me" component={MeContent} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

function MeContent() {
  const navigation = useNavigation();

  return (
    <Screen style={styles.container}>
      <Layout style={styles.background} level="3">
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Log in using your email address and password.
          </Text>
          <Image
            style={styles.headerLogo}
            source={require("../assets/log-in-art.png")}
          />
        </View>
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
      </Layout>
    </Screen>
  );
}

function Me() {
  return <MyStack />;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme['color-basic-900'],
  },

  button: {
    margin: 5,
    width: "50%",
  },

  buttonGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 25,
    paddingHorizontal: 20,
  },

  container: {
    backgroundColor: theme['color-basic-900'],
  },

  header: {
    position: "absolute",
    top: 30,
    flex: 1,
  },

  headerLogo: {
    width: 256,
    height: 320,
    alignSelf: "center",
    top: 60,
  },

  headerText: {
    margin: 3,
    marginTop: "15%",
    fontSize: 25,
    textAlign: "center",
  },
});

export default Me;
