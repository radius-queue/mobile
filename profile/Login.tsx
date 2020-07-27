import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text, Input } from "@ui-kitten/components";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigation = useNavigation();

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
