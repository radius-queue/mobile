import {firebase} from '../firebase';
import {queueConverter, Queue} from './queue';

/**
 * Realtime listener for queues
 */
export class QueueListener {
  listener: () => void;

  /**
   * Create a listener with given uid. Triggers kickback upon recieving update
   * @param {string} uid uid of desired queue
   * @param {function} kickback function to deal with update
   */
  constructor(uid: string, kickback: (q: any) => void) {
    this.listener = firebase.firestore().collection('queues').doc(uid)
        .withConverter(queueConverter)
        .onSnapshot(function(doc) {
          if (doc.exists) {
            const queue: Queue = doc.data()!;
            queue.uid = uid;
            kickback(queue);
          } else {
            console.log('No such document! for uid: ' + doc.id);
          }
        }, function(error) {
          console.log('Error getting document:', error);
        });
  }

  /**
   * frees listener to reduce server traffic
   */
  free(): void {
    console.log('free');
    this.listener();
  }
}
