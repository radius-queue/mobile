import {firestore} from '../firebase';
import {businessConverter, Business} from './business';

/**
 * upload Business object to firebase server.
 * if already exist replaces old entry, else creates new one
 * @param {Business} b business to be pushed to server
 */
export default function postBusiness(b : Business) {
  firestore.collection('businesses').doc(b.uid)
      .withConverter(businessConverter)
      .set(b);
}
