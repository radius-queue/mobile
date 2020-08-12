import firebase from 'firebase/app';
/**
 * This class represents a Business
 */
export class Business {
  name: string;
  firstName: string;
  lastName:string;
  email: string;
  locations: BusinessLocation[];
  // password : string;
  uid : string;

  /**
   * @param {string} name Business name
   * @param {string} firstName Owner First Name
   * @param {string} lastName Owner Last Name
   * @param {string} email Account email
   * @param {string} uid Unique Identifier
   * @param {BusinessLocation[]} locations Optional array of store location
   *    objects, Default value is set to be empty array
   */
  constructor(name: string, firstName: string, lastName: string, email: string,
      uid: string, locations: BusinessLocation[] =[]) {
    this.name = name;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.uid = uid;
    this.locations = locations;
    // this.uid = uid || "";
  }
}

/**
 * A specific business location
 */
export class BusinessLocation {
  name: string;
  address: string;
  phoneNumber: string;
  hours: [Date | null, Date | null][];
  coordinates: number[]; // in decimal degrees (DD).
  queues: string[];
  geoFenceRadius: number; // in meters
  type: string;

  /**
   * @param {string} name Name of specific location
   * @param {string} address Address of location
   * @param {string} phoneNumber phone number of the location
   * @param {[Date | null, Date | null][]} hours business hours for queue operation as array
   *    of Date object pairs.
   * @param {number[]} coordinates Geographic coordinates of location in
   *    decimal degrees (DD). ex: [41.40338, 2.17403] lat, long
   * @param {string[]} queues Optional array of queue ids associated with
   *    this location, Default value of empty array
   * @param {number} geoFenceRadius Optional radius around business location
   *    (in meters) that a customer is allowed to enter queue, Default value
   *    of -1
   */
  constructor(name: string, address: string, phoneNumber: string, hours: [Date | null, Date | null][],
      coordinates: number[], type: string, queues: string[] = [],
      geoFenceRadius: number = -1) {
    this.name = name;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.hours = hours;
    this.coordinates = coordinates;
    this.queues = queues;
    this.geoFenceRadius = geoFenceRadius;
    this.type = type;
  }

  /* Firebase helper methods */

  /**
  * Convert location object from firebase to js object
  * @param {object} location firebase location object
  * @return {BusinessLocation} equivalent js object
  */
  static fromFirebase(type: string, location: any): BusinessLocation {
    const locPrams : [string, string, string, [Date | null, Date | null][], number[],
     string, string[], number] = [
       location.name,
       location.address,
       location.phoneNumber,
       BusinessLocation.hoursFromFirebase(location.hours),
       [location.coordinates.latitude,
         location.coordinates.longitude],
       type,
       location.queues,
       location.geoFenceRadius,
     ];
    return new BusinessLocation(...locPrams);
  }

  /**
  *
  * @param {BusinessLocation} location js object
  * @return {object} equivalent firebase location object
  */
  static toFirebase(location: BusinessLocation): any {
    return {
      name: location.name,
      address: location.address,
      phoneNumber: location.phoneNumber,
      hours: BusinessLocation.hoursToFirebase(location.hours), // need fixing
      coordinates: new firebase.firestore.GeoPoint(
          location.coordinates[0],
          location.coordinates[1],
      ),
      queues: location.queues,
      geoFenceRadius: location.geoFenceRadius,
    };
  };

  /**
   *
   * @param hours
   */
  static hoursToFirebase(hours: [Date | null, Date | null][]): any {
    const ret: {[id:string]: [Date | null, Date | null]} = {};
    for (let i = 0; i < DATE_INDEX.size; i++) {
      const day = hours[i];
      const dayName: string = DATE_INDEX.get(i)!;
      ret[dayName] = [day[0] ? day[0] : null, day[1] ? day[1] : null];
    }
    return ret;
  }

  /**
   *
   * @param hour
   */
  static hoursFromFirebase(hours: any): [Date | null, Date | null][] {
    const ret: [Date | null, Date | null][] = [];
    for (let i = 0; i < DATE_INDEX.size; i++) {
      const day = hours[(DATE_INDEX.get(i))!];
      ret.push([!day[0] ? null : day[0].toDate(), !day[1] ? null : day[1].toDate()]);
    }
    return ret;
  }
}

export const businessConverter = {
  toFirestore: function(b: Business) {
    return {
      name: b.name,
      firstName: b.firstName,
      lastName: b.lastName,
      email: b.email,
      locations: b.locations.map((e) => BusinessLocation.toFirebase(e)),
    };
  },
  fromFirestore: function(snapshot: any, options: any) {
    const data = snapshot.data(options);
    return new Business(
        data.name,
        data.firstName,
        data.lastName,
        data.email,
        '', // uid
        data.locations.map((e: any) => BusinessLocation.fromFirebase(data.type, e)),
    );
  },
};

export function getHoursArray(input: [string, string][]) {
  const result : [Date | null, Date | null][] = [];
  for (const pair of input) {
    if (pair[0] && pair[1]) {
      const openParts : string[] = pair[0].split(':');
      const closeParts : string[] = pair[1].split(':');

      const openDate = new Date(2020, 0, 1, parseInt(openParts[0]), parseInt(openParts[1]));
      const closeDate = new Date(2020, 0, 1, parseInt(closeParts[0]), parseInt(closeParts[1]));

      result.push([openDate, closeDate]);
    } else {
      result.push([null, null]);
    }
  }
  return result;
}

const DATE_INDEX: Map<number, string> = new Map<number, string>([
  [0, 'Sunday'],
  [1, 'Monday'],
  [2, 'Tuesday'],
  [3, 'Wednesday'],
  [4, 'Thursday'],
  [5, 'Friday'],
  [6, 'Saturday'],
]);

export const DAYS : string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
