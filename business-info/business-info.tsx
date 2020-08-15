import React, { useState, useRef, FunctionComponent, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity,
} from "react-native";
import call from "react-native-phone-call";
import { Card, Layout, Button, ButtonGroup } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import BusinessModal from "./business-info-modal";
import MapView, { Marker, Circle } from "react-native-maps";
import { dateToOperationHours, parsePhoneNum } from "../util/util-functions";
import defaultStyles from "../config/styles";
import { Fontisto, SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { default as theme } from "../custom-theme.json";
import { BusinessLocation } from "../util/business";
import { Customer } from "../util/customer";
import { QueueInfo } from '../util/queue';
import { getQueueInfo, addToQueue } from "../util/api-functions";

interface BusinessInfoProps {
  business: BusinessLocation,
  user: Customer | undefined,
  setUser: (c: Customer) => void,
  isFavorite: boolean,
  addFav: (b: BusinessLocation) => void;
  removeFav: (b: BusinessLocation) => void;
  setQueueBusiness: (b: BusinessLocation | undefined) => void,
  queue: string,
  setQueue: (q: string) => void,
  recentsHandler: (b: BusinessLocation) => void,
}

const DEGREES_PER_HUNDRED_METERS = 0.001;
const BEGIN_HEADER_DISPLAY = 240;
const END_HEADER_DISPLAY = 295;

const BusinessInfoScreen: FunctionComponent<BusinessInfoProps> = ({
  business,
  user,
  isFavorite,
  addFav,
  removeFav,
  setQueue,
  queue,
  setQueueBusiness,
  setUser,
  recentsHandler,
}: BusinessInfoProps) => {
  const [showJoin, setJoin] = useState<boolean>(false);
  const [isFav, setIsFav] = useState<boolean>(isFavorite);
  const [queueInfo, setQueueInfo] = useState<QueueInfo | undefined>();
  const [scrollAmount, setScrollAmount] = useState<number>(0);

  const scrollA = useRef(new Animated.Value(0)).current;
  scrollA.addListener((newScroll) => setScrollAmount(newScroll.value));

  const headerOpacity = scrollA.interpolate({
    inputRange: [BEGIN_HEADER_DISPLAY, END_HEADER_DISPLAY],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const backOpacity = scrollA.interpolate({
    inputRange: [BEGIN_HEADER_DISPLAY, END_HEADER_DISPLAY],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const navigation = useNavigation();

  useEffect(() => {
    const getQueue = async () => {
      setQueueInfo(await getQueueInfo(business.queues[0]));
    }

    getQueue();
  }, []);

  const onStarPress = () => {
    console.log('star press');
    if (isFav) {
      removeFav(business);
    } else {
      addFav(business);
    }
    setIsFav(!isFav);
  }

  const onQueuePress = () => {
    setJoin(true);
    recentsHandler(business);
  }

  const calculateDelta = (radius: number) => {
    return ((radius * 4) / 100) * DEGREES_PER_HUNDRED_METERS;
  };

  const callHandler = () => {
    const args = {
      number: business.phoneNumber,
      prompt: true,
    };

    call(args);
  };

  const addToQ = async (
    firstName: string,
    lastName: string,
    phoneNumber: string,
    size: number,
  ) => {
    const newQueue = await addToQueue(business.queues[0], {
      firstName,
      lastName,
      phoneNumber,
      size,
      checkIn: new Date(),
      quote: -1,
      messages: [],
    });

    const newUser = {
      ...user!,
      firstName,
      lastName,
      phoneNumber,
      currentQueue: newQueue.uid
    };

    setQueue(newQueue.uid);
    setQueueBusiness(business);
    setUser(newUser);
    navigation.navigate("Queue");
  };

  /**
   * Returns the user to the favorites/recents/explore page.
   */
  const goBack = () => {
    navigation.navigate('Feed');
  }

  return (
    <View>
      {/* Header with bar */}
      <Animated.View style={[styles.headerBar, {opacity: headerOpacity}]}>
        <TouchableOpacity onPress={goBack}>
          <View style={styles.headerBackContainer}>
            <Ionicons name='ios-arrow-back' size={24} color={theme['color-basic-100']} />
            <Text style={styles.headerText}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.headerText, styles.headerName]}>{business.name.length > 15 ? business.name.substring(0, 12) + '...' : business.name}</Text>
        <TouchableOpacity onPress={onStarPress} >
          <View style={styles.headerIcon}>
            {!isFav
              ? <SimpleLineIcons name="star" size={24} color="yellow" />
              : <Fontisto name='star' size={24} color='yellow' />
            }
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Header without bar (only the back button) */}
      <Animated.View style={[styles.headerBar, styles.backBar, {opacity: backOpacity}]}>
        <TouchableOpacity onPress={goBack}>
          <View style={styles.headerBackContainer}>
            <Ionicons name='ios-arrow-back' size={24} color={theme['color-basic-1100']} />
            <Text style={[styles.headerText, styles.backText]}>Back</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroll}
        scrollEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollA } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={1}
      >
        <Animated.View style={animatedStyles.mapContainer(scrollA)}>
          <MapView
            region={{
              latitude: business.coordinates[0],
              longitude: business.coordinates[1],
              latitudeDelta: calculateDelta(business.geoFenceRadius),
              longitudeDelta: calculateDelta(business.geoFenceRadius),
            }}
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
              radius={business.geoFenceRadius}
              strokeWidth={1}
              strokeColor={"#ff0000"}
              style={styles.circle}
            />
          </MapView>
        </Animated.View>
        <Card disabled={true} style={styles.businessCard}>
          <Layout style={styles.dragNotif} />
          <Layout style={[styles.layout, { flexDirection: 'row' }]} level="2">
            <View>
              <View style={styles.businessNameContainer}>
                <Text style={[defaultStyles.text, styles.name, styles.businessName]}>
                  {business.name}
                </Text>
                <TouchableOpacity onPress={onStarPress}>
                  {!isFav
                    ? <SimpleLineIcons name="star" size={24} color="yellow" />
                    : <Fontisto name='star' size={24} color='yellow' />
                  }
                </TouchableOpacity>
              </View>
              <Text style={[defaultStyles.text]}>
                {business.address}
              </Text>
              <TouchableOpacity onPress={callHandler}>
                <Text></Text>
                <Text style={[defaultStyles.text, styles.phone]}>
                  {parsePhoneNum(business.phoneNumber)}
                </Text>
              </TouchableOpacity>
            </View>
          </Layout>
          <Layout level="2" style={styles.layout}>
            <Text style={[defaultStyles.text, styles.name]}>👯 Current Queue</Text>
            <View style={styles.queueInfoTextContainer}>
              <Text style={[defaultStyles.text, styles.contentLabel]}>Status:</Text>
              <Text style={defaultStyles.text}>
                {queueInfo?.open ? "Open" : "Closed"}
              </Text>
            </View>
            <View style={styles.queueInfoTextContainer}>
              <Text style={[defaultStyles.text, styles.contentLabel]}>Line Length:</Text>
              <Text style={defaultStyles.text}>
                {queueInfo && queueInfo.open ? `${queueInfo.length} parties` : `N/A`}
              </Text>
            </View>
            <View style={styles.queueInfoTextContainer}>
              <Text style={[defaultStyles.text, styles.contentLabel]}>Recent Wait Time:</Text>
              <Text style={defaultStyles.text}>
                {queueInfo && queueInfo.open ? `${queueInfo.longestWaitTime === -1 ? 0 : queueInfo.longestWaitTime} minutes` : `N/A`}
              </Text>
            </View>
            <Button
              style={styles.joinButton}
              disabled={queue ? true : (queueInfo ? !queueInfo.open : false)}
              onPress={onQueuePress}
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
        radius={business.geoFenceRadius}
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
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 4,
  }),
};

const styles = StyleSheet.create({
  backBar: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  backText: {
    color: theme['color-basic-1100'],
  },
  businessCard: {
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 0,
    flex: 1,
    backgroundColor: theme['color-basic-700'],
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
  headerBackContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingBottom: 6,
    alignItems: 'flex-end',
    width: 85,
    height: '100%',
  },
  headerBar: {
    marginBottom: -45,
    height: 45,
    zIndex: 1,
    backgroundColor: theme['color-basic-900'],
    borderBottomWidth: 1,
    borderBottomColor: theme['color-basic-600'],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    width: 85,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  headerName: {
    color: theme['color-primary-500'],
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 'auto',
    paddingRight: 'auto',
  },
  headerText: {
    color: theme['color-basic-100'],
    fontSize: 18,
    paddingTop: 1,
    marginLeft: 6,
    marginBottom: 4,
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
    display: "flex",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 5,
  },
  touch: {
    backgroundColor: 'red',
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
