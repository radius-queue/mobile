
import {firestore} from '../firebase';
import {Business, businessConverter} from './business';

/**
 * Get Business from database based on uid
 * @param {string} uid business uid
 */
export default async function getBusiness(uid : string) {
  let ret: Business | undefined;
  await firestore.collection('businesses').doc(uid)
      .withConverter(businessConverter)
      .get().then(function(doc) {
        if (doc.exists) {
          const q: Business | undefined = doc.data();
          ret = q;
        } else {
          console.log('No such document!');
        }
      }).catch(function(error) {
        console.log('Error getting document:', error);
      });

  if (ret) {
    ret.uid = uid;
  }
  return ret;
}
