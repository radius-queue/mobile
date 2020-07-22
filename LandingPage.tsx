import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.login}
          onPress={() => console.log("login pressed")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.register}
          onPress={() => console.log("register pressed")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    //height: "80%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  buttonContainer: {
    width: "100%",
  },

  buttonText: {
    color: "white",
    fontSize: 24,
  },

  login: {
    backgroundColor: "#b99c6b",
    alignItems: "center",
    padding: 25,
  },

  logo: {
    width: 200,
    height: 200,
  },

  logoContainer: {
    position: "absolute",
    top: 20,
    alignItems: "center",
  },

  logoText: {
    color: "white",
    fontSize: 24,
    top: -5,
  },

  register: {
    backgroundColor: "#613318",
    alignItems: "center",
    padding: 25,
  },
});

export default LandingPage;
