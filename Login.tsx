import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigation = useNavigation();

  return (
    <ImageBackground
      style={styles.background}
      source={require("./assets/brown.jpg")}
    >
      <Text style={styles.header}>Sign in with Radius.</Text>
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
      <TouchableOpacity
        style={styles.submit}
        onPress={() => navigation.navigate("Feed")}
      >
        <Text style={styles.submitText}>SIGN IN</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },

  header: {
    fontSize: 24,
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
    position: "absolute",
    top: 100,
  },

  input: {
    height: 50,
    width: "100%",
    borderColor: "white",
    borderWidth: 3,
    color: "white",
    padding: 5,
    top: -30,
  },

  submit: {
    backgroundColor: "#f5cb5c",
    alignItems: "center",
    padding: 15,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  submitText: {
    color: "white",
    fontSize: 18,
  },

  text: {
    color: "white",
    fontSize: 18,
    alignItems: "flex-start",
    paddingBottom: 15,
    paddingTop: 15,
    top: -30,
  },
});

export default Login;
