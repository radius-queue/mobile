import React from "react";
import { View, Button, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Me from "./profile/Me";
import BusinessInfoScreen from "./business-info/business-info";
import Register from "./profile/Register";
import Login from "./profile/Login";
import { businesses, BusinessListScreen } from "./feed/feed";
import QueuePage from "./queue-view/queue-page";
import ProfilePage from "./profile/profile-page";
import { User, BusinessInfo } from "./business-info/data";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="DevPage">
      <Stack.Screen name="DevPage" component={DevPageContent} />
      <Stack.Screen name="Me" component={Me} />
      <Stack.Screen name="Business">
        {() => (
          <BusinessInfoScreen
            user={User.sample()}
            business={BusinessInfo.sample()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Feed">
        {() => <BusinessListScreen {...businesses} />}
      </Stack.Screen>
      <Stack.Screen name="Queue" component={QueuePage} />
      <Stack.Screen name="Profile" component={ProfilePage} />
    </Stack.Navigator>
  );
}

function DevPageContent() {
  const nav = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Button title={"Me"} onPress={() => nav.navigate("Me")} />
      <Button
        title={"Business Info"}
        onPress={() => nav.navigate("Business")}
      />
      <Button title={"Register"} onPress={() => nav.navigate("Register")} />
      <Button title={"Login"} onPress={() => nav.navigate("Login")} />
      <Button title={"Feed"} onPress={() => nav.navigate("Feed")} />
      <Button title={"Queue View"} onPress={() => nav.navigate("Queue")} />
      <Button title={"Profile"} onPress={() => nav.navigate("Profile")} />
    </SafeAreaView>
  );
}

function DevPage() {
  return <MyStack />;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
});

export default DevPage;
