import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Button,
  Image,
  Text,
} from "react-native";

function LandingPage() {
  return (
    <ImageBackground
      style={styles.background}
      source={require("./assets/landing.jpg")}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("./assets/radius-logo.png")}
        />
        <Text style={styles.logoText}>The Waiting Room Reimagined.</Text>
      </View>
      <View style={styles.login}>
        <Button
          title="Login"
          color={"white"}
          onPress={() => console.log("login pressed")}
        />
      </View>
      <View style={styles.register}>
        <Button
          title="Register"
          color={"white"}
          onPress={() => console.log("register pressed")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: "80%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  login: {
    width: "100%",
    height: "10%",
    backgroundColor: "#b99c6b",
  },

  logo: {
    width: 200,
    height: 200,
  },

  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },

  logoText: {
    color: "white",
    fontSize: 24,
  },

  register: {
    width: "100%",
    height: "10%",
    backgroundColor: "#613318",
  },
});

export default LandingPage;
