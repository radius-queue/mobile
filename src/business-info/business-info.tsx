import React, { useState, useRef, FunctionComponent, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity,
} from "react-native";
import call from "react-native-phone-call";
import { Card, Layout, Button } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import BusinessModal from "./business-info-modal";
import MapView, { Marker, Circle } from "react-native-maps";
import { dateToOperationHours, parsePhoneNum } from "../util/util-functions";
import defaultStyles from "../config/styles";
import { Fontisto, SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { default as theme } from "../../custom-theme.json";
import { BusinessLocation } from "../util/business";
import { Customer } from "../util/customer";
import { QueueInfo } from '../util/queue';
import { getQueueInfo, addToQueue, getBusinessLocation } from "../util/api-functions";

interface BusinessInfoProps {
  business: BusinessLocation,
  user: Customer | undefined,
  setUser: (c: Customer) => void,
  isFavorite: boolean,
  addFav: (b: string) => void;
  removeFav: (b: string) => void;
  setQueueBusiness: (b: BusinessLocation | undefined) => void,
  queue: string,
  setQueue: (q: string) => void,
  recentsHandler: (b: string) => void,
}

const DEGREES_PER_HUNDRED_METERS = 0.001;
const BEGIN_HEADER_DISPLAY = 240;
const END_HEADER_DISPLAY = 295;
const HEADER_HEIGHT = 50;

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
  const [updatedBusiness, setUpdatedBusiness] = useState<BusinessLocation>(business);

  const scrollA = useRef(new Animated.Value(0)).current;
  scrollA.addListener((newScroll) => setScrollAmount(newScroll.value));

  const headerOpacity = scrollA.interpolate({
    inputRange: [BEGIN_HEADER_DISPLAY, END_HEADER_DISPLAY],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const antiHeaderOpacity = scrollA.interpolate({
    inputRange: [BEGIN_HEADER_DISPLAY, END_HEADER_DISPLAY],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const zIndexPicker: number = scrollAmount < END_HEADER_DISPLAY ? 1 : 2;

  const navigation = useNavigation();

  useEffect(() => {
    const getQueue = async () => {
      setQueueInfo(await getQueueInfo(updatedBusiness.queues[0]));
    }

    const getBusiness = async () => {
      setUpdatedBusiness(await getBusinessLocation(business.uid));
    }

    getQueue();
    getBusiness();
  }, []);

  const onStarPress = () => {
    if (isFav) {
      removeFav(updatedBusiness.uid);
    } else {
      addFav(updatedBusiness.uid);
    }
    setIsFav(!isFav);
  }

  const onQueuePress = () => {
    setJoin(true);
  }

  const calculateDelta = (radius: number) => {
    return ((radius * 4) / 100) * DEGREES_PER_HUNDRED_METERS;
  };

  const callHandler = () => {
    const args = {
      number: updatedBusiness.phoneNumber,
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
    const newQueue = await addToQueue(updatedBusiness.queues[0], {
      firstName,
      lastName,
      phoneNumber,
      size,
      checkIn: new Date(),
      quote: -1,
      messages: [],
      pushToken: user!.pushToken,
    });

    const newUser = {
      ...user!,
      firstName,
      lastName,
      phoneNumber,
      currentQueue: newQueue.uid
    };

    console.log("New User: ", newUser);
    console.log("Queue Business: ", updatedBusiness);
    console.log("New Queue: ", newQueue);
    
    setUser(newUser);
    setQueueBusiness(updatedBusiness);
    recentsHandler(updatedBusiness.uid);
    setQueue(newQueue.uid);
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
      {/* Header bar with business name text display */}
      <Animated.View style={[styles.headerBar, {opacity: headerOpacity}]}>
        <Text style={styles.headerName}>{updatedBusiness.name.length > 15 ? updatedBusiness.name.substring(0, 12) + '...' : updatedBusiness.name}</Text>
      </Animated.View>

      {/* Back arrow and text in white for display when header bar is displayed */}
      <TouchableOpacity onPress={goBack} style={[styles.headerBackContainer, {zIndex: zIndexPicker}]}>
        <Animated.View style={[styles.headerBackContent, {opacity: headerOpacity}]}>
          <Ionicons name='ios-arrow-back' size={24} color={theme['color-basic-100']} />
          <Animated.Text style={styles.headerText}>Back</Animated.Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Back arrow and text in black for display when header bar is not displayed */}
      <TouchableOpacity onPress={goBack} style={styles.headerBackContainer}>
        <Animated.View style={[styles.headerBackContent, {opacity: antiHeaderOpacity}]}>
          <Ionicons name='ios-arrow-back' size={24} color={theme['color-basic-1100']} />
          <Animated.Text style={[styles.headerText, {color: theme['color-basic-1100']}]}>Back</Animated.Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Favorite star in yello for display when header bar is displayed */}
      <TouchableOpacity onPress={onStarPress} style={[styles.headerIcon, {zIndex: zIndexPicker}]}>
        <Animated.View style={{opacity: headerOpacity}}>
          {isFav
            ? <Fontisto name='star' size={24} color='yellow' />
            : <SimpleLineIcons name="star" size={24} color="yellow" />
          }
        </Animated.View>
      </TouchableOpacity>

      {/* Favorite star in black for display when header bar is not displayed */}
      <TouchableOpacity onPress={onStarPress} style={styles.headerIcon}>
        <Animated.View style={{opacity: antiHeaderOpacity}}>
          {isFav
            ? <Fontisto name='star' size={24} color={theme['color-basic-1100']} />
            : <SimpleLineIcons name="star" size={24} color={theme['color-basic-1100']} />
          }
        </Animated.View>
      </TouchableOpacity>

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
              latitude: updatedBusiness.coordinates[0],
              longitude: updatedBusiness.coordinates[1],
              latitudeDelta: calculateDelta(updatedBusiness.geoFenceRadius),
              longitudeDelta: calculateDelta(updatedBusiness.geoFenceRadius),
            }}
            style={styles.map}
          >
            <Marker
              title={updatedBusiness.name}
              coordinate={{
                latitude: updatedBusiness.coordinates[0],
                longitude: updatedBusiness.coordinates[1],
              }}
            />
            <Circle
              center={{
                latitude: updatedBusiness.coordinates[0],
                longitude: updatedBusiness.coordinates[1],
              }}
              radius={updatedBusiness.geoFenceRadius}
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
                  {updatedBusiness.name}
                </Text>
                <TouchableOpacity onPress={onStarPress}>
                  {isFav
                    ? <Fontisto name='star' size={24} color='yellow' />
                    : <SimpleLineIcons name="star" size={24} color="yellow" />
                  }
                </TouchableOpacity>
              </View>
              <Text style={[defaultStyles.text]}>
                {business.address}
              </Text>
              <TouchableOpacity onPress={callHandler}>
                <Text></Text>
                <Text style={[defaultStyles.text, styles.phone]}>
                  {parsePhoneNum(updatedBusiness.phoneNumber)}
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
                {updatedBusiness.hours.map((val, idx) => (
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
        coords={updatedBusiness.coordinates}
        radius={updatedBusiness.geoFenceRadius}
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
    alignItems: 'center',
    width: 80,
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1,
    marginBottom: -HEADER_HEIGHT,
  },
  headerBackContent: {
    display: 'flex',
    flexDirection: 'row',
  },
  headerBar: {
    marginBottom: -HEADER_HEIGHT,
    height: HEADER_HEIGHT,
    zIndex: 1,
    backgroundColor: theme['color-basic-900'],
    borderBottomWidth: 1,
    borderBottomColor: theme['color-basic-600'],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    height: HEADER_HEIGHT,
    position: 'absolute',
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1,
    marginBottom: -HEADER_HEIGHT,
    paddingLeft: 15,
    paddingRight: 15,
  },
  headerName: {
    color: theme['color-primary-500'],
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 'auto',
    paddingRight: 'auto',
    marginBottom: 4,
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
