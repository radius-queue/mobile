import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

import Me from "./profile/Me";
import Login from "./profile/Login";
import Register from "./profile/Register";
import BusinessInfoScreen from "./business-info/business-info";
import { BusinessInfo, User } from "./business-info/data";
import DevPage from "./dev-page";
import QueuePage from "./queue-view/queue-page";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { BusinessListScreen, businesses } from "./feed/feed";

const { Navigator, Screen } = createStackNavigator();

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <NavigationContainer>
        <Navigator
          initialRouteName="DevPage"
          screenOptions={{ headerShown: false }}
        >
          <Screen name="DevPage" component={DevPage} />
          <Screen name="Me" component={Me} />
          <Screen name="Register" component={Register} />
          <Screen name="Login" component={Login} />
          <Screen name="Business">
            {() => <BusinessInfoScreen user={User.sample()} business={BusinessInfo.sample()} />}
          </Screen>
          <Screen name="Feed">
            {() => <BusinessListScreen {...businesses} />}
          </Screen>
          <Screen name="Queue" component={QueuePage} />
        </Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
