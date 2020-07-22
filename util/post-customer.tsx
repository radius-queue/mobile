import {Customer, customerConverter} from './customer';
import {firestore} from '../firebase';

/**
 * upload Customer object to firebase server.
 * if already exist replaces old entry, else creates new one
 * @param {Customer} c customer object to be pushed to database
 */
export default function postCustomer(c : Customer) {
  firestore.collection('customer').doc(c.uid)
      .withConverter(customerConverter)
      .set(c);
}
