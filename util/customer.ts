/**
 * This class represnets a customer
 */
export class Customer {
  firstName: string;
  lastName:string;
  phoneNumber: string;
  uid: string;
  currentQueue: string;
  favorites: string[];
  recents: string[];
  pushToken: string;

  /**
   * @param {string} firstName Customer First Name
   * @param {string} lastName Customer Last Name
   * @param {string} phoneNumber Customer phone number
   * @param {string} uid Customer unique identifier
   * @param {string} currentQueue Optional ID of queue that customer is in,
   *    Default of ""
   * @param {string[]} favorites List of favorite businesses' uid
   * @param {string[]} recents List of recently visited businesses'uid
   */
  constructor(uid: string = '', firstName : string = '', lastName: string = '',
      phoneNumber: string = '', currentQueue: string = '',
      favorites: string[] = [], recents: string[] = [], pushToken : string = '') {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.uid = uid;
    this.currentQueue = currentQueue;
    this.favorites = favorites;
    this.recents= recents;
    this.pushToken = pushToken;
  }
}

export const customerConverter = {
  toFirestore: function(c: Customer) {
    return {
      firstName: c.firstName,
      lastName: c.lastName,
      phoneNumber: c.phoneNumber,
      currentQueue: c.currentQueue,
      favorites: c.favorites,
      recents: c.recents,
    };
  },
  fromFirestore: function(snapshot: any, options: any) {
    const data = snapshot.data(options);
    return new Customer(
        '', // uid
        data.firstName,
        data.lastName,
        data.phoneNumber,
        data.currentQueue,
        data.favorites,
        data.recents,
    );
  },
};
