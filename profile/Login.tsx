import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text, Input } from "@ui-kitten/components";
import { AntDesign } from "@expo/vector-icons";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigation = useNavigation();

  const google = <AntDesign name="google" size={24} color="white" />;
  const facebook = <AntDesign name="facebook-square" size={24} color="white" />;

  const googleIcon = () => (
    <TouchableWithoutFeedback>{google}</TouchableWithoutFeedback>
  );
  const facebookIcon = () => (
    <TouchableWithoutFeedback>{facebook}</TouchableWithoutFeedback>
  );

  return (
    <Layout style={styles.background} level="3">
      <Input
        style={styles.inputField}
        placeholder="Email address"
        value={email}
        onChangeText={(newEmail) => setEmail(newEmail)}
        size="large"
      />
      <Input
        style={styles.inputField}
        placeholder="Password"
        value={password}
        onChangeText={(newPassword) => setPassword(newPassword)}
        size="large"
      />
      <Button style={styles.button} onPress={() => navigation.navigate("Feed")}>
        Login with Email
      </Button>
      <View style={styles.altContainer}>
        <Button
          style={styles.altGoogle}
          status="success"
          accessoryRight={googleIcon}
          onPress={() => {
            console.log("Google sign in");
          }}
        >
          Sign in with Google
        </Button>
        <Button
          style={styles.altFacebook}
          status="info"
          accessoryRight={facebookIcon}
          onPress={() => {
            console.log("Facebook sign in");
          }}
        >
          Sign in with Facebook
        </Button>
      </View>
      <View style={styles.registerContainer}>
        <Text>Don't have a Radius Account?</Text>
        <Button
          appearance="ghost"
          status="primary"
          onPress={() => navigation.navigate("Register")}
        >
          Register here
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  altContainer: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    paddingTop: 25,
  },

  altGoogle: {
    marginBottom: 10,
  },

  altFacebook: {
    marginBottom: 10,
  },

  background: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 50,
  },

  button: {
    margin: 10,
    width: "95%",
  },

  inputField: {
    paddingHorizontal: 10,
  },

  registerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
  },
});

export default Login;
