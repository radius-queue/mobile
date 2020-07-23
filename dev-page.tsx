import React from "react";
import { View, Button, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DevPage = () => {
  const nav = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Button title={"Home"} onPress={() => nav.navigate("Home")} />
      <Button
        title={"Business Info"}
        onPress={() => nav.navigate("Business")}
      />
      <Button title={"Register"} onPress={() => nav.navigate("Register")} />
      <Button title={"Login"} onPress={() => nav.navigate("Login")} />
      <Button title={"Feed"} onPress={() => nav.navigate("Feed")} />
      <Button title={"Queue View"} onPress={() => nav.navigate("Queue")} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
});

export default DevPage;
