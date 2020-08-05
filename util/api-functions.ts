import { BusinessLocation } from "./business";
import { Customer } from "./customer";
import {Queue, Party, QueueInfo} from './queue';
import {auth} from '../firebase';

const ROOT_URL : string = 'https://us-central1-ahead-9d906.cloudfunctions.net/widgets';

/**
 * This functions retreives a business' location information.
 * Ie. phone number, geofence radius, address, hours, etc.
 * 
 * @param {string} uid the id of the business
 * @return {BusinessLocation} the result of the query
 * @throws {Error} if the connection with Firestore is severed, the uid is
 * an empty string, or if the business does not exist.
 */
export const getBusinessLocation = async (uid: string) : Promise<BusinessLocation> => {
  const token : string = await auth.currentUser!.getIdToken();

  const response = await fetch(
    `${ROOT_URL}/api/businesses/${uid}/location`,
    fetchOptions('GET', token)
  );

  if (response.status === 403) {
    throw new Error('Unauthorized');
  }
  if (response.status === 500) {
    throw new Error('Problem Connecting to Firestore');
  }
  if (response.status === 400) {
    throw new Error('Malformed Request');
  }
  if (response.status === 404) {
    throw new Error('Business Not Found, this should not happen on mobile app (bug in your code)');
  }

  const value = await response.json();
  value.hours = value.hours.map((val: [string | null, string | null]) => hoursFromAPI(val));
  return value;
}

/**
 * This function retreives all businesses using Radius service for the 
 * explore portion of the feed.
 * 
 * @return {BusinessLocation[]} list of BusinessLocation objects representing each business using
 * the service.
 * @throws {Error} if the connection with Firestore is severed, in which the user
 * should be asked to refresh the app. 
 */
export const getAllBusinessLocations = async () : Promise<BusinessLocation[]> => {
  const token : string = await auth.currentUser!.getIdToken();

  const response = await fetch(`${ROOT_URL}/api/businesses/locations/all`, fetchOptions('GET', token));

  if (response.status === 403) {
    throw new Error('Unauthorized');
  }
  if (response.status === 500) {
    throw new Error('Problem Connecting to Firestore');
  }

  const value = await response.json();
  return value;
}

/**
 * This function retreives the business locations that are specified in the
 * given array.
 * 
 * @param locations a string of business uids to be retreived, must be 10 items or less
 * @return the list of BusinessLocation objects
 * @throws {Error} if there is a connection problem with Firestore. 
 */
export const getBusinessLocationsFromArray = async (locations : string[]) : Promise<BusinessLocation[]> => {
  const token : string = await auth.currentUser!.getIdToken();

  const response = await fetch(
    `${ROOT_URL}/api/businesses/locations?locations=${JSON.stringify(locations)}`,
    fetchOptions('GET', token),
  );

  if (response.status === 403) {
    throw new Error('Unauthorized');
  }
  if (response.status === 400) {
    throw new Error('Malformed Request');
  }

  if (response.status === 500) {
    throw new Error('Problem Connecting to Firestore')
  }

  return await response.json();
}

/**
 * This function retreives a customer's information.
 * 
 * @param {string} uid the id of the customer
 * @return {Customer} the Customer object that represents the user with
 * the given uid.
 * @throws {Error} if the connection with Firestore is severed, the uid is
 * an empty string, or if the business does not exist
 */
export const getCustomer = async (uid: string) : Promise<Customer> => {
  const token : string = await auth.currentUser!.getIdToken();

  const response = await fetch(`${ROOT_URL}/api/customers?uid=${uid}`, fetchOptions('GET', token));

  if (response.status === 403) {
    throw new Error('Unauthorized');
  }
  if (response.status === 400) {
    throw new Error('Malformed Request');
  }
  if (response.status === 500) {
    throw new Error('Problem Connecting To Firestore');
  }
  if (response.status === 404) {
    throw new Error('Customer Not Found, this should not happen on mobile app (bug in your code)');
  }

  const value = await response.json();
  return value;
}

/**
 * This function posts the given customer's information.
 * 
 * @param {Customer} customer the customer to be posted
 * @throws {Error} if the connection with Firestore is severed, ir if
 * the request is malformed.
 */
export const postCustomer = async (customer: Customer) => {
  const token : string = await auth.currentUser!.getIdToken();

  const options : any = fetchOptions('POST', token);
  options.body = JSON.stringify({customer});

  const response = await fetch(`${ROOT_URL}/api/customers`, options);

  if (response.status === 403) {
    throw new Error('Unauthorized');
  }
  if (response.status === 400) {
    throw new Error('Malformed Request');
  }
  if (response.status === 500) {
    throw new Error('Problem Connecting to Firestore');
  }
}

/**
 * This function posts a new customer to Firestore and returns the object
 * posted.
 * 
 * @param customer an object that contains all of the initial data unique
 * to that specific individual. Should have the following properties: 
 * {
 *     firstName: string,
 *     lastName: string,
 *     phoneNumber: string,
 *     uid: string,
 * }
 * @returns {Customer} the customer object initialized with the given properties.
 * @throws {Error} if the given object does not have the correct parameters,
 * or if there was a problem connecting to firestore.
 */
export const newCustomer = async (customer : any) : Promise<Customer> => {
  const token : string = await auth.currentUser!.getIdToken();

  const options : any = fetchOptions('POST', token);
  options.body = JSON.stringify({customer});

  const response = await fetch(`${ROOT_URL}/api/customers/new`, options);

  if (response.status === 403) {
    throw new Error('Unauthorized');
  }
  if (response.status === 400) {
    throw new Error('Malformed Request');
  }
  if (response.status === 500) {
    throw new Error('Problem Connecting to Firestore');
  }
  return await response.json();
}

/**
 * This function retreives summary data for a business' queue.
 * 
 * @param uid the id of the business' queue you are retreiving
 */
export const getQueueInfo = async (uid: string) : Promise<QueueInfo> => {
  const token : string = await auth.currentUser!.getIdToken();

  const response = await fetch(`${ROOT_URL}/api/queues/info?uid=${uid}`, fetchOptions('GET', token));

  if (response.status === 403) {
    throw new Error('Unauthorized');
  }
  if (response.status === 400) {
    throw new Error('Malformed Reqest');
  }
  if (response.status === 404) {
    throw new Error('Queue Not Found, This Should Not Happen on Mobile App' + 
      '(bug in your code)');
  }
  if (response.status === 500) {
    throw new Error('Problem Connecting to Firestore');
  }

  return await response.json();
}

/**
 * This function adds a party to the desired queue, and returns
 * it.
 *
 * @param {Party} party the party to be appended to queue
 * @param {string} uid the id of the queue to be appended to
 * @return {Promise<Queue>} the result of the query, either the
 * queue object or undefined if it did not exist.
 * @throws {Error} if the connection with Firestore is severed or if the
 * queue doesn't exist.
 */
export const addToQueue = async (uid: string, party: Party): Promise<Queue> => {
  const token : string = await auth.currentUser!.getIdToken();

  const options : any = fetchOptions('POST', token);
  options.body = JSON.stringify({party});

  const response = await fetch(`${ROOT_URL}/api/queues/${uid}`, options);

  if (response.status === 403) {
    throw new Error('Unauthorized');
  }
  if (response.status === 500) { // error on server (status === 500)
    // This would be a very big problem, will want the user
    // to refresh the page
    throw new Error('Problem Connecting to Firestore');
  }
  if (response.status === 404) { // queue doesn't exist, shouldn't happen
    throw new Error('Queue Not Found, this should not happen on mobile (bug in code)');
  }

  const value = await response.json();
  value.parties = value.parties.map((val : any) => partyFromAPI(val));

  return value;
};

const fetchOptions = (method: string, idToken :string) => (
  {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
  }
);

const hoursFromAPI = (val: [string | null, string | null]) => {
  return [
    val[0] ? new Date(val[0]) : val[0],
    val[1] ? new Date(val[1]) : val[1],
  ];
};

const partyFromAPI : (val: any) => Party = (val : any) => {
  return {
    ...val,
    messages: val.messages.map(
        (val: [string, string]) => [new Date(val[0]), val[1]],
    ),
    checkIn: new Date(val.checkIn),
  };
};