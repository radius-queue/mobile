import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Button,
} from "react-native";

function LandingPage(this: any, props) {
  return (
    <ImageBackground
      style={styles.background}
      source={require("./assets/radius-logo.png")}
    >
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
  },

  login: {
    width: "100%",
    height: "9.5%",
    backgroundColor: "#cab9f1",
  },

  register: {
    width: "100%",
    height: "9.5%",
    backgroundColor: "#8c65d3",
  },
});

export default LandingPage;
