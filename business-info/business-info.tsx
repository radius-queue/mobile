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
import { Card, Layout, Button, Icon } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import BusinessModal from "./business-info-modal";
import type { BusinessInfo, User } from "./data";
import MapView, { Marker, Circle } from "react-native-maps";
import { dateToOperationHours, parsePhoneNum } from "../util/util-functions";
import defaultStyles from "../config/styles";
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
    <View>
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
          <Layout style={styles.dragNotif}/>
          <Layout style={[styles.layout, {flexDirection: 'row'}]} level="2">
            <View>
              <View style={styles.businessNameContainer}>
                <Text style={[defaultStyles.text, styles.name, styles.businessName]}>
                  {business.name}
                </Text>
                <TouchableOpacity disabled={!!!user} onPress={() => setIsFav(!isFav)}>
                  {!isFav
                    ? <SimpleLineIcons name="star" size={24} color="yellow" />
                    : <Fontisto name='star'size={24} color='yellow'/>
                  }
                </TouchableOpacity>
              </View>
              <Text style={[defaultStyles.text]}>
                {business.address}
              </Text>
            <TouchableOpacity onPress={callHandler}>
                <Text></Text>
                <Text style={[defaultStyles.text, styles.phone]}>
                  {parsePhoneNum(business.phone)}
                </Text>
              </TouchableOpacity>
            </View>
          </Layout>
          <Layout level="2" style={styles.layout}>
            <Text style={[defaultStyles.text, styles.name]}>👯 Current Queue</Text>
            <View style={styles.queueInfoTextContainer}>
              <Text style={[defaultStyles.text, styles.contentLabel]}>Status:</Text>
              <Text style={defaultStyles.text}>
                {business.queues[0].open ? "Open" : "Closed"}
              </Text>
            </View>
            <View style={styles.queueInfoTextContainer}>
              <Text style={[defaultStyles.text, styles.contentLabel]}>Line Length:</Text>
              <Text style={defaultStyles.text}>
                {business.queues[0].length} parties
              </Text>
            </View>
            <View style={styles.queueInfoTextContainer}>
              <Text style={[defaultStyles.text, styles.contentLabel]}>Recent Wait Time:</Text>
              <Text style={defaultStyles.text}>
                {business.queues[0].firstWaitTime} minutes
              </Text>
            </View>
            <Button
              style={styles.joinButton}
              disabled={!business.queues[0].open}
              onPress={() => setJoin(true)}
            >
              Join Queue
            </Button>
          </Layout>
          <Layout style={styles.layout} level="2">
            <Text style={[defaultStyles.text, styles.name]}>📅 Hours</Text>
            <View style={styles.hoursContainer}>
              <View>
                {DAYS.map((val) => (
                  <Text style={[defaultStyles.text, styles.dayText, styles.contentLabel]} key={val}>
                    {val}
                  </Text>
                ))}
              </View>
              <View>
                {business.hours.map((val, idx) => (
                  <Text key={idx} style={[defaultStyles.text, styles.dayText]}>
                    {val[0]
                      ? dateToOperationHours(val[0]) + ` - ` +
                        dateToOperationHours(val[1]!)
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
    </View>
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
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 0,
    flex: 1,
  },
  businessName: {
    fontSize: 28,
    width: '90%',
    marginBottom: 0,
    color: theme['color-primary-500'],
  },
  businessNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    marginBottom: 28,
    borderBottomWidth: 3,
    borderBottomColor: theme['color-primary-500'],
  },
  circle: {
    opacity: 0.5,
  },
  contentLabel: {
    fontWeight: 'bold',
  },
  dayText: {
    marginVertical: 5,
    fontWeight: '400',
  },
  dragNotif: {
    height: 4,
    backgroundColor: 'white',
    width: 70,
    alignSelf: "center",
    marginBottom: 7,
    borderRadius: 3,
  },
  hoursContainer: {
    flexDirection: "row",
    marginVertical: 0,
    padding: 0,
    width: "100%",
    justifyContent: "space-between",
  },
  joinButton: {
    marginTop: 10,
    width: "100%",
    alignSelf: "center",
  },
  layout: {
    width: "110%",
    marginLeft: '-5%',
    padding: 15,
    justifyContent: "space-between",
    borderRadius: 10,
    marginVertical: 5,
  },
  map: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
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
    backgroundColor: theme['color-basic-900'],
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
