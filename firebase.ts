import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLKa3MCGky3T98RZrP8DZZWffCnz6tnV8",
  authDomain: "ahead-9d906.firebaseapp.com",
  databaseURL: "https://ahead-9d906.firebaseio.com",
  projectId: "ahead-9d906",
  storageBucket: "ahead-9d906.appspot.com",
  messagingSenderId: "580604661554",
  appId: "1:580604661554:web:7b0223746bc9f873da912b",
  measurementId: "G-C73S6LEMS5"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };