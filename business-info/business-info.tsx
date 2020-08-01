import React, { useState, useRef, FunctionComponent } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from "react-native";
import call from "react-native-phone-call";
import { Card, Layout, Button } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import BusinessModal from "./business-info-modal";
import type { BusinessInfo, User } from "./data";
import MapView, { Marker, Circle } from "react-native-maps";
import { parseTimeString, toStandardTime } from "../util/util-functions";
import defaultStyles from "../config/styles";
import * as eva from "@eva-design/eva";
import * as Location from "expo-location";
import * as IntentLauncherAndroid from "expo-intent-launcher";
import HaversineGeolocation from "haversine-geolocation";
import {Fontisto, SimpleLineIcons} from '@expo/vector-icons';
import { default as theme } from "../custom-theme.json";

interface BusinessInfoProps {
  business: BusinessInfo;
  user: User | undefined;
}

const DEGREES_PER_HUNDRED_METER = 0.001;

const BusinessInfoScreen: FunctionComponent<BusinessInfoProps> = ({
  business,
  user,
}: BusinessInfoProps) => {
  const [editMap, setEditMap] = useState<boolean>(false);
  const [showJoin, setJoin] = useState<boolean>(false);
  const [isFav, setIsFav] = useState<boolean>(false);

  const scrollA = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const calculateDelta = (radius: number) => {
    return ((radius * 4) / 100) * DEGREES_PER_HUNDRED_METER;
  };

  const callHandler = () => {
    const args = {
      number: business.phone.replace("-", ""),
      prompt: true,
    };

    call(args);
  };

  const addToQ = () => {
    navigation.navigate("Queue");
  };

  return (
    <>
      <Animated.ScrollView
        style={styles.scroll}
        scrollEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollA } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={animatedStyles.mapContainer(scrollA)}>
          <MapView
            region={{
              latitude: business.coordinates[0],
              longitude: business.coordinates[1],
              latitudeDelta: calculateDelta(business.radius),
              longitudeDelta: calculateDelta(business.radius),
            }}
            onPress={() => setEditMap(!editMap)}
            scrollEnabled={editMap}
            zoomEnabled={editMap}
            rotateEnabled={editMap}
            pitchEnabled={editMap}
            style={styles.map}
          >
            <Marker
              title={business.name}
              coordinate={{
                latitude: business.coordinates[0],
                longitude: business.coordinates[1],
              }}
            />
            <Circle
              center={{
                latitude: business.coordinates[0],
                longitude: business.coordinates[1],
              }}
              radius={business.radius}
              strokeWidth={1}
              strokeColor={"#ff0000"}
              style={styles.circle}
            />
          </MapView>
        </Animated.View>
        <Card disabled={true} style={styles.businessCard}>
          <Layout style={[styles.layout, {flexDirection: 'row'}]} level="2">
            <View>
              <Text style={[defaultStyles.text, styles.name]}>
                {business.name}
              </Text>
              <Text style={[defaultStyles.text, styles.subtitle]}>
                {business.address}
              </Text>
              <TouchableOpacity onPress={callHandler}>
                <Text style={[defaultStyles.text, styles.subtitle, styles.phone]}>
                  {business.phone}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity disabled={!!!user} onPress={() => setIsFav(!isFav)}>
              {!isFav
                ? <SimpleLineIcons name="star" size={24} color="yellow" />
                : <Fontisto name='star'size={24} color='yellow'/>
              }
            </TouchableOpacity>
          </Layout>
          <Layout level="2" style={styles.layout}>
            <Text style={[defaultStyles.text, styles.name]}>Current Queue</Text>
            <View style={styles.queueInfoTextContainer}>
              <Text style={defaultStyles.text}>Status:</Text>
              <Text style={defaultStyles.text}>
                {business.queues[0].open ? "Open" : "Closed"}
              </Text>
            </View>
            <View style={styles.queueInfoTextContainer}>
              <Text style={defaultStyles.text}>Line Length:</Text>
              <Text style={defaultStyles.text}>
                {business.queues[0].length} parties
              </Text>
            </View>
            <View style={styles.queueInfoTextContainer}>
              <Text style={defaultStyles.text}>Most Recent Wait Time:</Text>
              <Text style={defaultStyles.text}>
                {business.queues[0].firstWaitTime} minutes
              </Text>
            </View>
            <Button
              style={styles.joinButton}
              disabled={!business.queues[0].open}
              status="success"
              onPress={() => setJoin(true)}
            >
              Join Queue
            </Button>
          </Layout>
          <Layout style={styles.layout} level="2">
            <Text style={[defaultStyles.text, styles.name]}>Hours</Text>
            <View style={styles.hoursContainer}>
              <View>
                {DAYS.map((val) => (
                  <Text style={[defaultStyles.text, styles.dayText]} key={val}>
                    {val}
                  </Text>
                ))}
              </View>
              <View>
                {business.hours.map((val, idx) => (
                  <Text key={idx} style={[defaultStyles.text, styles.dayText]}>
                    {val[0]
                      ? `${toStandardTime(parseTimeString(val[0]))} -` +
                        `${toStandardTime(parseTimeString(val[1]!))}`
                      : "Closed"}
                  </Text>
                ))}
              </View>
            </View>
          </Layout>
        </Card>
      </Animated.ScrollView>
      <BusinessModal
        show={showJoin}
        addToQ={addToQ}
        coords={business.coordinates}
        radius={business.radius}
        hide={() => setJoin(false)}
        user={user}
      />
    </>
  );
};

const animatedStyles = {
  mapContainer: (scrollA: Animated.Value) => ({
    height: 350,
    transform: [
      {
        translateY: scrollA,
      },
    ],
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: "hidden",
  }),
};

const styles = StyleSheet.create({
  businessCard: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 0,
    flex: 1,
  },
  circle: {
    opacity: 0.5,
  },
  dayText: {
    fontWeight: "400",
    marginVertical: 5,
  },
  hoursContainer: {
    flexDirection: "row",
    marginVertical: 0,
    padding: 0,
    width: "100%",
    justifyContent: "space-between",
  },
  joinButton: {
    marginVertical: 10,
    width: "100%",
    alignSelf: "center",
  },
  layout: {
    width: "100%",
    padding: 15,
    justifyContent: "space-between",
    borderRadius: 20,
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  phone: {
    textDecorationLine: "underline",
  },
  queueInfoTextContainer: {
    flexDirection: "row",
    marginVertical: 5,
    width: "100%",
    justifyContent: "space-between",
  },
  scroll: {
    backgroundColor: theme["color-basic-800"],
    display: "flex",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 5,
  },
});

const DAYS: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
/*
 */

export default BusinessInfoScreen;
