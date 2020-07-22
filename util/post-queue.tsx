import {firestore} from '../firebase';
import {queueConverter, Queue} from './queue';

/**
 * upload Queue object to firebase server.
 * if already exist replaces old entry, else creates new one
 * @param {Queue} q Queue object to be updated on the database
 */
export default function postQueue(q : Queue) {
  firestore.collection('queues').doc(q.uid)
      .withConverter(queueConverter)
      .set(q);
}
