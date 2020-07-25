import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Layout, Button, Text, Input } from "@ui-kitten/components";

function Register() {
  const navigation = useNavigation();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <Layout style={styles.background} level="3">
      <View style={styles.registerContainer}>
        <Text style={styles.header}>Register with Email</Text>
        <View style={styles.nameGroup}>
          <Input
            style={styles.registerFirst}
            placeholder="First Name"
            value={firstName}
            onChangeText={(newFirstName) => setFirstName(newFirstName)}
            size="large"
          />
          <Input
            style={styles.registerLast}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(newLastName) => setLastName(newLastName)}
            size="large"
          />
        </View>
        <Input
          style={styles.registerLargeField}
          placeholder="Email Address"
          value={email}
          onChangeText={(newEmail) => setEmail(newEmail)}
          size="large"
        />
        <Input
          style={styles.registerLargeField}
          placeholder="Password"
          value={password}
          onChangeText={(newPass) => setPassword(newPass)}
          size="large"
        />
        <Button
          style={styles.button}
          onPress={() => navigation.navigate("Feed")}
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
  },

  button: {
    margin: 10,
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 10,
  },

  nameGroup: {
    flexDirection: "row",
    paddingTop: 10,
  },

  registerContainer: {
    flex: 1,
  },

  registerFirst: {
    width: "50%",
    paddingLeft: 10,
    paddingRight: 5,
  },

  registerLargeField: {
    width: "100%",
    paddingHorizontal: 10,
  },

  registerLast: {
    width: "50%",
    paddingRight: 10,
  },
});

export default Register;
