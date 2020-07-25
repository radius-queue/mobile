import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card, Layout, Button, Text } from "@ui-kitten/components";

function Me() {
  const navigation = useNavigation();

  return (
    <Layout style={styles.background} level="3">
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Log in using your email address and password.
        </Text>
        <Image
          style={styles.headerLogo}
          source={require("../assets/radius-logo.png")}
        ></Image>
      </View>
      <View style={styles.buttonGroup}>
        <Button
          style={styles.button}
          status="basic"
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          Register
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
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

  header: {
    position: "absolute",
    top: 50,
    flex: 1,
  },

  headerLogo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    top: 10,
  },

  headerText: {
    margin: 2,
  },
});

export default Me;
