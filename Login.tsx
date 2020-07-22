import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { TextInput } from "react-native-gesture-handler";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <ImageBackground
      style={styles.background}
      source={require("./assets/brown.jpg")}
    >
      <Text style={styles.text}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        maxLength={50}
        placeholder={"Email goes here..."}
        placeholderTextColor={"white"}
        selectionColor={"white"}
      />
      <Text style={styles.text}>Password:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        maxLength={50}
        placeholder={"Enter password"}
        placeholderTextColor={"white"}
        selectionColor={"white"}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },

  input: {
    height: 50,
    width: "100%",
    borderColor: "white",
    borderWidth: 3,
    color: "white",
    padding: 5,
  },

  text: {
    color: "white",
    fontSize: 18,
    alignItems: "flex-start",
    paddingBottom: 15,
    paddingTop: 15,
  },
});

export default Login;
