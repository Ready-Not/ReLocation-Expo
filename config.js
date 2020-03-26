import firebase from 'firebase';
import 'firebase/firestore';

import { FB_apiKey } from 'react-native-dotenv'

const FIREBASE_CONFIG = {
apiKey: FB_apiKey,
authDomain: "relocation-1ac3d.firebaseapp.com",
databaseURL: "https://relocation-1ac3d.firebaseio.com",
projectId: "relocation-1ac3d",
storageBucket: "relocation-1ac3d.appspot.com",
messagingSenderId: "658430192184",
appId: "1:658430192184:web:c6107a992d238aba7e14cd",
measurementId: "G-7HQ5Q3MTH5"
};

firebase.initializeApp(FIREBASE_CONFIG);

export const firestore = firebase.firestore();
export default firebase;
